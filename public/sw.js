/* global self, caches, fetch */
// public/sw.js
const CACHE_NAME = 's7-react-v1'
const urlsToCache = ['/', '/static/js/bundle.js', '/static/css/main.css', '/images/logo.png']

// Instalar service worker
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en cache, devolverlo
      if (response) {
        return response
      }

      // Si no está en cache, hacer petición a red
      return fetch(event.request).then((response) => {
        // Si la petición falla, devolver página offline
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clonar la respuesta para cachearla
        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
