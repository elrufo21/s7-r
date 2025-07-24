// src/hooks/usePWA.ts
import { useState, useEffect } from 'react'

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    // Detectar cambios de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setShowInstallPrompt(true)
      ;(window as any).deferredPrompt = e
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (showInstallPrompt) {
      const promptEvent = (window as any).deferredPrompt
      if (promptEvent) {
        promptEvent.prompt()
        const result = await promptEvent.userChoice
        if (result.outcome === 'accepted') {
          setIsInstalled(true)
          setShowInstallPrompt(false)
        }
      }
    }
  }

  const hideInstallPrompt = () => {
    setShowInstallPrompt(false)
  }

  return {
    isOnline,
    isInstalled,
    showInstallPrompt,
    installApp,
    hideInstallPrompt,
  }
}
