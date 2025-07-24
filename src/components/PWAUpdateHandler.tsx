// src/components/PWAUpdateHandler.tsx
import { useEffect } from 'react'

export const PWAUpdateHandler = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // El service worker ha cambiado, recargar la página
        window.location.reload()
      })
    }
  }, [])

  return null
}
