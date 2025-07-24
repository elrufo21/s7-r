import './App.css'
import { AppRoutes } from './setup/routes/AppRoutes'
import { useOfflineCache } from './hooks/useOfflineCache'
import { OfflineIndicator } from './components/OfflineIndicator'
import { PWAUpdateHandler } from './components/PWAUpdateHandler'
import { usePWA } from './hooks/usePWA'

function App() {
  const { isOnline } = usePWA()
  console.log('isOnline', isOnline)
  useOfflineCache()
  return (
    <>
      <AppRoutes />
      <OfflineIndicator />
      <PWAUpdateHandler />
    </>
  )
}

export default App
