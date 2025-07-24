# 📱 Documentación PWA - S7 React ERP

## 🎯 Resumen Ejecutivo

Se ha implementado una **Progressive Web App (PWA)** completa para el sistema S7 React ERP, que permite a los usuarios instalar la aplicación en sus dispositivos y usarla offline. La implementación incluye Service Workers, cacheo inteligente, indicadores de estado y funcionalidades de instalación.

---

## 🏗️ Arquitectura PWA

### 1. **Configuración Base**

#### **Vite PWA Plugin** (`vite.config.ts`)

```typescript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    runtimeCaching: [
      // Cache para Supabase
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'supabase-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        },
      },
      // Cache para imágenes
      {
        urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
        },
      },
    ],
  },
})
```

#### **Web App Manifest** (`public/manifest.json`)

```json
{
  "name": "S7 React ERP",
  "short_name": "S7 ERP",
  "description": "Sistema ERP completo para gestión empresarial",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "orientation": "portrait",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "/images/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/images/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. **Service Worker Personalizado** (`public/sw.js`)

```javascript
/* eslint-env serviceworker */
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
      if (response) return response

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        const responseToCache = response.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return response
      })
    })
  )
})
```

---

## 🎣 Hooks y Funcionalidades

### 1. **Hook Principal PWA** (`src/hooks/usePWA.ts`)

```typescript
export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  // Detectar cambios de conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Detectar si ya está instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Manejar prompt de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setShowInstallPrompt(true)
      ;(window as any).deferredPrompt = e
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
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

  return {
    isOnline,
    isInstalled,
    showInstallPrompt,
    installApp,
    hideInstallPrompt: () => setShowInstallPrompt(false),
  }
}
```

### 2. **Hook de Cache Offline** (`src/hooks/useOfflineCache.ts`)

```typescript
export const useOfflineCache = () => {
  useEffect(() => {
    const initCache = async () => {
      try {
        const cache = new OfflineCache()
        await cache.init()
        await cache.cacheProducts()
        await cache.cacheCustomers()
        console.log('Cache offline inicializado correctamente')
      } catch (error) {
        console.error('Error inicializando cache:', error)
      }
    }

    initCache()
  }, [])
}
```

---

## 🗄️ Sistema de Cache Offline

### **Clase OfflineCache** (`src/lib/offlineCache.ts`)

```typescript
export class OfflineCache {
  private db: IDBDatabase | null = null

  async init() {
    if (!('indexedDB' in window)) return

    this.db = await openDB('s7-offline-cache', 1, {
      upgrade(db: IDBDatabase) {
        db.createObjectStore('products', { keyPath: 'id' })
        db.createObjectStore('customers', { keyPath: 'id' })
        db.createObjectStore('categories', { keyPath: 'id' })
        db.createObjectStore('payment_methods', { keyPath: 'id' })
      },
    })
  }

  async cacheProducts() {
    // Obtiene productos de Supabase y los guarda en IndexedDB
    const { data } = await supabase.rpc('fnc_execute', {
      ic_fnc: 'fnc_product_template',
      it_action: 's',
      ij_data: [[1, 'pag', 100]],
    })

    // Guarda en IndexedDB para uso offline
  }

  async getOfflineProducts() {
    // Recupera productos del cache local
  }
}
```

---

## 🧩 Componentes PWA

### 1. **Prompt de Instalación** (`src/components/PWAInstallPrompt.tsx`)

```typescript
export const PWAInstallPrompt = () => {
  const { showInstallPrompt, installApp, hideInstallPrompt, isInstalled } = usePWA()

  if (isInstalled) return null

  return (
    <>
      {/* Botón temporal para testing */}
      {!showInstallPrompt && (
        <div className="fixed bottom-4 left-4 bg-green-500 text-white p-2 rounded-lg shadow-lg z-50">
          <button onClick={forceShowPrompt} className="text-sm">
            Forzar Instalación (Testing)
          </button>
        </div>
      )}

      {/* Prompt normal de instalación */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm">Instalar S7 ERP</h3>
              <p className="text-xs mt-1 opacity-90">Acceso rápido desde tu escritorio</p>
            </div>
            <div className="flex gap-2">
              <button onClick={installApp} className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-semibold">
                Instalar
              </button>
              <button onClick={hideInstallPrompt} className="text-white hover:text-gray-200 text-sm">✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
```

### 2. **Indicador Offline** (`src/components/OfflineIndicator.tsx`)

```typescript
export const OfflineIndicator = () => {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-sm font-medium">Modo Offline</span>
      </div>
    </div>
  )
}
```

### 3. **Manejador de Actualizaciones** (`src/components/PWAUpdateHandler.tsx`)

```typescript
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
```

---

## 🔧 Integración en la Aplicación

### **App.tsx**

```typescript
function App() {
  return (
    <>
      <AppRoutes />
      <useOfflineCache />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <PWAUpdateHandler />
    </>
  )
}
```

---

## 📋 Funcionalidades Implementadas

### ✅ **Completadas**

1. **Service Worker** - Cacheo automático de recursos
2. **Web App Manifest** - Configuración para instalación
3. **Hook PWA** - Gestión de estado online/offline e instalación
4. **Cache Offline** - IndexedDB para datos críticos
5. **Prompt de Instalación** - UI para instalar la app
6. **Indicador Offline** - Notificación visual de estado
7. **Manejador de Actualizaciones** - Recarga automática
8. **Configuración Vite** - Plugin PWA integrado

### �� **En Progreso**

1. **Sincronización de datos** - Cuando vuelve a estar online
2. **Gestión de conflictos** - Resolución de datos offline vs online
3. **Notificaciones push** - Alertas del sistema

### 📝 **Pendientes**

1. **Estrategias de cache avanzadas** - Cache por módulos
2. **Compresión de datos** - Optimización de almacenamiento
3. **Métricas de uso offline** - Analytics de funcionalidad

---

## 🚀 Cómo Usar

### **Para Desarrolladores**

1. La PWA se activa automáticamente en producción
2. Usar `npm run build` para generar la versión PWA
3. Los Service Workers se registran automáticamente
4. El cache offline se inicializa al cargar la app

### **Para Usuarios**

1. **Instalación**: Aparece un prompt automático o usar el botón de testing
2. **Uso Offline**: Los datos cacheados están disponibles sin conexión
3. **Actualizaciones**: Se descargan automáticamente en segundo plano
4. **Indicadores**: Se muestra el estado de conexión en tiempo real

---

## 🔍 Troubleshooting

### **Problemas Comunes**

1. **Service Worker no se registra**: Verificar HTTPS en producción
2. **Cache no funciona**: Revisar configuración de IndexedDB
3. **Prompt no aparece**: Verificar criterios de instalación del navegador
4. **Errores de ESLint**: Agregar `/* eslint-env serviceworker */` en archivos SW

### **Debugging**

```javascript
// Verificar estado del Service Worker
navigator.serviceWorker.getRegistrations().then((registrations) => {
  console.log('SW registrations:', registrations)
})

// Verificar cache
caches.keys().then((names) => {
  console.log('Cache names:', names)
})

// Verificar IndexedDB
indexedDB.databases().then((dbs) => {
  console.log('IndexedDB databases:', dbs)
})
```

---

## �� Recursos Adicionales

- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

## �� Estructura de Archivos
