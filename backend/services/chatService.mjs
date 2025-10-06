// services/chatService.mjs
import prisma from '../utils/prismaClient.mjs'
import crypto from 'crypto'
import logger from '../utils/logger.mjs'
import { createNotification, createManyNotifications } from './notificationService.mjs'

// ==============================
// AES CONFIG
// ==============================
const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.CHAT_SECRET_KEY || '', 'hex') // 32 bytes hex

if (KEY.length !== 32) {
  throw new Error('CHAT_SECRET_KEY must be a 32-byte hex string')
}

function encryptMessage(plaintext) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  let encrypted = cipher.update(plaintext, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const tag = cipher.getAuthTag().toString('hex')
  return JSON.stringify({ iv: iv.toString('hex'), content: encrypted, tag })
}

function decryptMessage(ciphertext) {
  try {
    const { iv, content, tag } = JSON.parse(ciphertext)
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'))
    decipher.setAuthTag(Buffer.from(tag, 'hex'))
    let decrypted = decipher.update(content, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (err) {
    logger.error('Decrypt failed:', err)
    return null
  }
}

function formatMessages(messages) {
  return messages.map(m => ({ ...m, content: decryptMessage(m.content) }))
}

// ==============================
// PRIVATE CHAT
// ==============================

export async function findOrCreatePrivateChat(user1Id, user2Id) {
  let chat = await prisma.privateChat.findFirst({
    where: { OR: [{ user1Id, user2Id }, { user1Id: user2Id, user2Id: user1Id }] }
  })
  if (!chat) {
    chat = await prisma.privateChat.create({ data: { user1Id, user2Id } })
  }
  return chat
}

export async function sendPrivateMessage(chatId, senderId, content) {
  const encrypted = encryptMessage(content)
  // transazione: crea messaggio + notifica destinatario
  return prisma.$transaction(async (tx) => { //operazione atomica --> transaction)
    const message = await tx.privateMessage.create({
      data: { chatId, senderId, content: encrypted }
    })
    // trova il destinatario
    const chat = await tx.privateChat.findUnique({ where: { id: chatId } })
    if (!chat) throw new Error('Chat not found')
    const recipientId = chat.user1Id === senderId ? chat.user2Id : chat.user1Id

    await createNotification({
      userId: recipientId,
      type: 'PRIVATE_MESSAGE',
      payload: { chatId, messageId: message.id, senderId }
    })

    return { ...message, content } // ritorna content in chiaro al chiamante
  })
}

export async function getPrivateMessages(chatId, { limit = 50, cursor } = {}) {
  const messages = await prisma.privateMessage.findMany({
    where: { chatId },
    orderBy: { sentAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: { sender: true }
  })
  return formatMessages(messages)
}

export async function markPrivateMessagesAsRead(chatId, userId) {
  return prisma.privateMessage.updateMany({
    where: { chatId, senderId: { not: userId }, read: false },
    data: { read: true }
  })
}

// ==============================
// GROUP CHAT
// ==============================

export async function createGroupChat({ name, createdBy, gymId = null }) {
  return prisma.groupChat.create({
    data: {
      name,
      createdBy,
      gymId,
      participants: { create: { userId: createdBy, isAdmin: true } }
    }
  })
}

export async function addUserToGroupChat(chatId, userId, isAdmin = false) {
  return prisma.groupChatParticipant.create({
    data: { chatId, userId, isAdmin }
  })
}

export async function removeUserFromGroupChat(chatId, userId) {
  return prisma.groupChatParticipant.deleteMany({
    where: { chatId, userId }
  })
}

export async function sendGroupMessage(chatId, senderId, content) {
  const encrypted = encryptMessage(content)
  // transazione: crea messaggio + notifiche a tutti i partecipanti (escluso sender)
  return prisma.$transaction(async (tx) => {
    const message = await tx.groupMessage.create({
      data: { chatId, senderId, content: encrypted, readBy: [] }
    })

    const participants = await tx.groupChatParticipant.findMany({
      where: { chatId },
      select: { userId: true }
    })
    const recipients = participants.map(p => p.userId).filter(uid => uid !== senderId)

    if (recipients.length > 0) {
      await createManyNotifications(
        recipients.map(userId => ({
          userId,
          type: 'GROUP_MESSAGE',
          payload: { chatId, messageId: message.id, senderId }
        }))
      )
    }

    return { ...message, content }
  })
}

export async function getGroupMessages(chatId, { limit = 50, cursor } = {}) {
  const messages = await prisma.groupMessage.findMany({
    where: { chatId },
    orderBy: { sentAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: { sender: true }
  })
  return formatMessages(messages)
}

export async function markGroupMessageAsRead(messageId, userId) {
  const msg = await prisma.groupMessage.findUnique({ where: { id: messageId } })
  if (!msg) return null

  const readBy = Array.isArray(msg.readBy) ? msg.readBy : []
  if (!readBy.includes(userId)) readBy.push(userId)

  return prisma.groupMessage.update({
    where: { id: messageId },
    data: { readBy }
  })
}

export async function getUserGroupChats(userId) {
  return prisma.groupChatParticipant.findMany({
    where: { userId },
    include: {
      chat: {
        include: { participants: true }
      }
    }
  })
}
