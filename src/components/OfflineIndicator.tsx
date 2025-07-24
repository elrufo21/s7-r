// src/components/OfflineIndicator.tsx
import { usePWA } from '@/hooks/usePWA'

export const OfflineIndicator = () => {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 ">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Modo Offline</span>
      </div>
    </div>
  )
}
