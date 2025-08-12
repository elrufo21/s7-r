import './App.css'
import { AppRoutes } from './setup/routes/AppRoutes'
import { useOfflineCache } from './hooks/useOfflineCache'
import { OfflineIndicator } from './components/OfflineIndicator'
import { PWAUpdateHandler } from './components/PWAUpdateHandler'

function App() {
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
