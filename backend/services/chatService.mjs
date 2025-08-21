import prisma from '../utils/prismaClient.mjs'
import logger from '../utils/logger.mjs'

/* ================================
   📩 CHAT PRIVATE
================================ */

// Trova o crea una chat privata tra due utenti
export async function findOrCreatePrivateChat(user1Id, user2Id) {
  try {
    let chat = await prisma.privateChat.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    })

    if (!chat) {
      chat = await prisma.privateChat.create({
        data: { user1Id, user2Id }
      })
    }

    return chat
  } catch (error) {
    logger.error(`Error finding/creating private chat: ${error.message}`)
    throw new Error('Private chat operation failed')
  }
}

// Invia un messaggio privato
export async function sendPrivateMessage(chatId, senderId, content) {
  return prisma.privateMessage.create({
    data: { chatId, senderId, content }
  })
}

// Prende i messaggi di una chat privata
export async function getPrivateMessages(chatId, limit = 50, cursor) { //CURSOR è di fatto un indice, che ci dice da quale record iniziare a prendere i dati
  return prisma.privateMessage.findMany({
    where: { chatId },
    orderBy: { sentAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0, //se cursor=10, parto dall'11esimo record perchè skippo quello del cursor
    cursor: cursor ? { id: cursor } : undefined,
    include: { sender: true }
  })
}

// Segna i messaggi come letti
export async function markPrivateMessagesAsRead(chatId, userId) {
  return prisma.privateMessage.updateMany({
    where: { chatId, senderId: { not: userId }, read: false },
    data: { read: true }
  })
}

/* ================================
   👥 CHAT DI GRUPPO
================================ */

// Crea un gruppo
export async function createGroupChat({ name, createdBy, gymId }) {
  return prisma.groupChat.create({
    data: {
      name,
      createdBy,
      gymId,
      participants: {
        create: { userId: createdBy, isAdmin: true }
      }
    }
  })
}

// Aggiungi un partecipante
export async function addUserToGroupChat(chatId, userId, isAdmin = false) {
  return prisma.groupChatParticipant.create({
    data: { chatId, userId, isAdmin }
  })
}

// Rimuovi un partecipante
export async function removeUserFromGroupChat(chatId, userId) {
  return prisma.groupChatParticipant.deleteMany({
    where: { chatId, userId }
  })
}

// Trova tutte le chat di gruppo di un utente
export async function getUserGroupChats(userId) {
  return prisma.groupChatParticipant.findMany({
    where: { userId },
    include: { chat: true }
  })
}

// Invia un messaggio in un gruppo
export async function sendGroupMessage(chatId, senderId, content) {
  return prisma.groupMessage.create({
    data: { chatId, senderId, content }
  })
}

// Prendi i messaggi di un gruppo
export async function getGroupMessages(chatId, limit = 50, cursor) {
  return prisma.groupMessage.findMany({
    where: { chatId },
    orderBy: { sentAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: { sender: true }
  })
}

// Segna un messaggio come letto da un utente
export async function markGroupMessageAsRead(messageId, userId) {
  const message = await prisma.groupMessage.findUnique({ where: { id: messageId } })

  if (!message) return null

  let readBy = message.readBy || []
  if (!readBy.includes(userId)) {
    readBy.push(userId)
  }

  return prisma.groupMessage.update({
    where: { id: messageId },
    data: { readBy }
  })
}
