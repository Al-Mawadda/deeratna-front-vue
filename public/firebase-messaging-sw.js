/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js')

const APP_CACHE = 'deeratna-cache-v1'
const OFFLINE_URL = '/offline.html'
const PRECACHE_URLS = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => Promise.resolve())
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('deeratna-cache-') && key !== APP_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Let API calls or external resources pass through untouched
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
    return
  }

  // App shell caching for navigations
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(APP_CACHE).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(async () => (await caches.match(request)) || caches.match(OFFLINE_URL))
    )
    return
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse
      return fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const clone = response.clone()
            caches.open(APP_CACHE).then((cache) => cache.put(request, clone))
          }
          return response
        })
        .catch(() => caches.match(OFFLINE_URL))
    })
  )
})

// These values should match your web app Firebase config.
// You can override them with environment-based builds if needed.
firebase.initializeApp({
  apiKey: 'AIzaSyCRVvZCAF_msHP6i7SS27gzRL9--JRsoUk',
  authDomain: 'deeratna-market.firebaseapp.com',
  projectId: 'deeratna-market',
  storageBucket: 'deeratna-market.firebasestorage.app',
  messagingSenderId: '243995563526',
  appId: '1:243995563526:web:ad5f4bf54f8f070dabd587'
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'إشعار'
  const notificationOptions = {
    body: payload.notification?.body || '',
    data: payload.data || {}
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})

// When user clicks a notification, focus the client and ask it to play a sound
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true })
      let client = allClients.find((c) => 'focus' in c)
      if (client) {
        await client.focus()
        client.postMessage({ type: 'play-sound' })
      } else {
        const newClient = await clients.openWindow('/')
        if (newClient) {
          newClient.postMessage({ type: 'play-sound' })
        }
      }
    })()
  )
})
