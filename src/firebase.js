import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

const DEFAULT_VAPID_KEY ='BBFvqk-O_DWM3fhA-uEnUiz5SjeHSfTEafSbmTTOd6wuRPbY5ItI0exn8kbStHSn-3qTt3LUzF4dCylArOvbAB8'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAubVJta1uAtPCqTg9dc0hhdqxeK7Acdp0',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'requests-95.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'requests-95',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'drequests-95.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '476982119822',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:476982119822:web:abf362a67c00551874e8df'
}

let messagingInstance = null

export async function ensureFirebase() {
  try {
    const supported = await isSupported()
    if (!supported) return null
    const app = initializeApp(firebaseConfig)
    messagingInstance = getMessaging(app)
    return messagingInstance
  } catch {
    return null
  }
}

export async function getFcmToken(vapidKey) {
  const messaging = await ensureFirebase()
  if (!messaging) return null
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      // Request permission before token
      if (Notification.permission === 'default') {
        await Notification.requestPermission()
      }
      if (Notification.permission !== 'granted') return null
      const token = await getToken(messaging, {
        vapidKey:
          vapidKey ||
          import.meta.env.VITE_FIREBASE_VAPID_KEY ||
          DEFAULT_VAPID_KEY ||
          undefined,
        serviceWorkerRegistration: reg
      })
      return token || null
    }
    return null
  } catch {
    return null
  }
}

export async function subscribeForegroundAsync(handler) {
  const messaging = await ensureFirebase()
  if (!messaging) return
  onMessage(messaging, (payload) => handler(payload))
}

export default { ensureFirebase, getFcmToken, subscribeForegroundAsync }


