// services/notificationService.mjs
import prisma from '../utils/prismaClient.mjs'
import { notificationBus } from '../utils/notificationBus.mjs'
import logger from '../utils/logger.mjs'

export async function createNotification({ userId, type, payload }) {
  try {
    const notif = await prisma.notification.create({
      data: { userId, type, payload }
    })
    // push realtime
    notificationBus.emit('notification:new', notif)
    return notif
  } catch (err) {
    logger.error(`createNotification failed: ${err.message}`)
    throw new Error('Unable to create notification')
  }
}

export async function createManyNotifications(notifs) {
  // notifs: array di { userId, type, payload }
  // NB: createMany non ritorna le righe, quindi emettiamo dopo un findMany
  const data = notifs.map(n => ({ userId: n.userId, type: n.type, payload: n.payload }))
  await prisma.notification.createMany({ data })
  const userIds = [...new Set(notifs.map(n => n.userId))]
  const created = await prisma.notification.findMany({
    where: { userId: { in: userIds } },
    orderBy: { id: 'desc' },
    take: notifs.length
  })
  created.forEach(n => notificationBus.emit('notification:new', n))
  return created
}

export async function listUserNotifications(userId, { unreadOnly = false, limit = 50, cursor } = {}) { //l'oggetto opzionale ci permette di prendere solo i messaggi non letti
  return prisma.notification.findMany({
    where: { userId, ...(unreadOnly ? { read: false } : {}) },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined
  })
}

export async function markNotificationRead(id, userId) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true }
  })
}

export async function markAllNotificationsRead(userId) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true }
  })
}

export async function deleteNotification(id, userId) {
  return prisma.notification.deleteMany({
    where: { id, userId }
  })
}

export async function deleteAllNotifications(userId) {
  return prisma.notification.deleteMany({
    where: { userId }
  })
}
