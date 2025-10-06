// utils/notificationBus.mjs
import { EventEmitter } from 'events'
export const notificationBus = new EventEmitter()

/**
 * Esempio uso (server WebSocket/SSE):
 * notificationBus.on('notification:new', (notif) => {
 *   // invia in tempo reale al client di notif.userId
 * })
 */
