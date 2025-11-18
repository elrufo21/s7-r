import './App.css'
import { useEffect } from "react";
import { AppRoutes } from './setup/routes/AppRoutes'
import { useOfflineCache } from './hooks/useOfflineCache'
import { OfflineIndicator } from './components/OfflineIndicator'
import { PWAUpdateHandler } from './components/PWAUpdateHandler'

function App() {
  useOfflineCache();

  useEffect(() => {
    // Bloquear menú contextual (anticlick)
    const handleContextMenu = (e) => e.preventDefault();

    // Bloquear long-press en móviles
    const blockLongPress = (e) => {
      if (e.touches.length === 1) {
        // Opción suave: evita long press sin afectar scroll
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("touchstart", blockLongPress, { passive: false });

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("touchstart", blockLongPress);
    };
  }, []);

  return (
    <>
      <AppRoutes />
      <OfflineIndicator />
      <PWAUpdateHandler />
    </>
  )
}

export default App;
