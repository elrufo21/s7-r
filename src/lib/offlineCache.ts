import { openDB } from 'idb'

export class OfflineCache {
  private db: any | null = null

  async init() {
    if (!('indexedDB' in window)) return

    this.db = await openDB('s7-offline-cache', 2, {
      upgrade(db: any, oldVersion: number) {
        if (oldVersion < 1) {
          db.createObjectStore('products', { keyPath: 'product_id' })
          db.createObjectStore('categories', { keyPath: 'category_id' })
        }
        if (oldVersion < 2) {
          db.createObjectStore('payment_methods', { keyPath: 'payment_method_id' })
          db.createObjectStore('pos_orders', { keyPath: 'order_id' })
          db.createObjectStore('pos_points', { keyPath: 'point_id' })
          db.createObjectStore('pos_sessions', { keyPath: 'session_id' })
        }
      },
    })
  }

  async cachePosOrders(executeFnc: any, pos_id: number) {
    if (!this.db || !pos_id) return

    try {
      const result = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pos_id],
        [
          0,
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],
      ])

      if (result && result.oj_data) {
        const tx = this.db.transaction('pos_orders', 'readwrite')
        const store = tx.objectStore('pos_orders')

        await store.clear()

        for (const posOrder of result.oj_data) {
          await store.put(posOrder)
        }
      }
    } catch (error) {
      console.error('Error cacheando órdenes:', error)
    }
  }

  async getOfflinePosOrders(pos_id: number) {
    if (!this.db || !pos_id) return []

    try {
      const tx = this.db.transaction('pos_orders', 'readonly')
      const store = tx.objectStore('pos_orders')

      const posOrders = await store.getAll()
      return posOrders
    } catch (error) {
      console.error('Error obteniendo órdenes offline:', error)
      return []
    }
  }

  async cachePosSessions(executeFnc: any) {
    if (!this.db) return

    try {
      const tx = this.db.transaction('pos_sessions', 'readonly')
      const store = tx.objectStore('pos_sessions')
      const existingPosSessions = await store.getAll()

      if (existingPosSessions.length > 0) {
        console.log('Sesiones ya están cacheadas, no se volverá a cargar.')
        return
      }

      console.log('Cache de sesiones vacío, cargando datos...')
      const result = await executeFnc('fnc_pos_session', 's', [[1, 'pag', 1]])

      if (result && result.oj_data) {
        const tx = this.db.transaction('pos_sessions', 'readwrite')
        const store = tx.objectStore('pos_sessions')

        for (const posSession of result.oj_data) {
          await store.put(posSession)
        }
      }
    } catch (error) {
      console.error('Error cacheando sesiones:', error)
    }
  }

  async getOfflinePosSessions() {
    if (!this.db) return []

    try {
      const tx = this.db.transaction('pos_sessions', 'readonly')
      const store = tx.objectStore('pos_sessions')
      const posSessions = await store.getAll()
      console.log('Sesiones obtenidas del cache:', posSessions.length)
      return posSessions
    } catch (error) {
      console.error('Error obteniendo sesiones offline:', error)
      return []
    }
  }

  async cachePosPoints(executeFnc: any) {
    if (!this.db) return

    try {
      const tx = this.db.transaction('pos_points', 'readonly')
      const store = tx.objectStore('pos_points')
      const existingPosPoints = await store.getAll()

      if (existingPosPoints.length > 0) {
        console.log('Puntos de venta ya están cacheados, no se volverá a cargar.')
        return
      }

      console.log('Cache de puntos de venta vacío, cargando datos...')
      const result = await executeFnc('fnc_pos_point', 's', [[1, 'pag', 1]])

      if (result && result.oj_data) {
        const tx = this.db.transaction('pos_points', 'readwrite')
        const store = tx.objectStore('pos_points')

        for (const posPoint of result.oj_data) {
          await store.put(posPoint)
        }
      }
    } catch (error) {
      console.error('Error cacheando puntos de venta:', error)
    }
  }

  async getOfflinePosPoints() {
    if (!this.db) return []

    try {
      const tx = this.db.transaction('pos_points', 'readonly')
      const store = tx.objectStore('pos_points')
      const posPoints = await store.getAll()
      console.log('Puntos de venta obtenidos del cache:', posPoints.length)
      return posPoints
    } catch (error) {
      console.error('Error obteniendo puntos de venta offline:', error)
      return []
    }
  }

  async cacheProducts(executeFnc: any) {
    if (!this.db) return

    try {
      const tx = this.db.transaction('products', 'readonly')
      const store = tx.objectStore('products')
      const existingProducts = await store.getAll()

      if (existingProducts.length > 0) {
        console.log('Productos ya están cacheados, no se volverá a cargar.')
        return
      }

      console.log('Cache de productos vacío, cargando datos...')
      const result = await executeFnc('fnc_product_template', 's', [
        [
          1,
          'fcon',
          ['Disponible en PdV'],
          '2',
          [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
        ],
        [1, 'pag', 1],
      ])

      if (result && result.oj_data) {
        const tx = this.db.transaction('products', 'readwrite')
        const store = tx.objectStore('products')

        for (const product of result.oj_data) {
          await store.put(product)
        }

        console.log('Productos cacheados para uso offline:', result.oj_data.length)
      } else {
        console.log('No se obtuvieron productos para cachear')
      }
    } catch (error) {
      console.error('Error cacheando productos:', error)
    }
  }

  async getOfflineProducts() {
    if (!this.db) return []

    try {
      const tx = this.db.transaction('products', 'readonly')
      const store = tx.objectStore('products')
      const products = await store.getAll()
      console.log('Productos obtenidos del cache:', products.length)
      return products
    } catch (error) {
      console.error('Error obteniendo productos offline:', error)
      return []
    }
  }

  async cacheCategories(executeFnc: any) {
    if (!this.db) return

    try {
      const tx = this.db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const existingCategories = await store.getAll()

      if (existingCategories.length > 0) {
        console.log('Categorías ya están cacheadas, no se volverá a cargar.')
        return
      }

      console.log('Cache de categorías vacío, cargando datos...')
      const result = await executeFnc('fnc_product_template_pos_category', 's', [[1, 'pag', 1]])

      if (result && result.oj_data) {
        const tx = this.db.transaction('categories', 'readwrite')
        const store = tx.objectStore('categories')

        for (const category of result.oj_data) {
          await store.put(category)
        }

        console.log('Categorías cacheadas para uso offline:', result.oj_data.length)
      }
    } catch (error) {
      console.error('Error cacheando categorías:', error)
    }
  }

  async getOfflineCategories() {
    if (!this.db) return []

    try {
      const tx = this.db.transaction('categories', 'readonly')
      const store = tx.objectStore('categories')
      const categories = await store.getAll()
      console.log('Categorías obtenidas del cache:', categories.length)
      return categories
    } catch (error) {
      console.error('Error obteniendo categorías offline:', error)
      return []
    }
  }

  async cachePaymentMethods(executeFnc: any) {
    if (!this.db) return

    try {
      const tx = this.db.transaction('payment_methods', 'readonly')
      const store = tx.objectStore('payment_methods')
      const existingPaymentMethods = await store.getAll()

      if (existingPaymentMethods.length > 0) {
        console.log('Métodos de pago ya están cacheados, no se volverá a cargar.')
        return
      }

      console.log('Cache de métodos de pago vacío, cargando datos...')
      const result = await executeFnc('fnc_pos_payment_method', 's', [])

      if (result && result.oj_data) {
        const tx = this.db.transaction('payment_methods', 'readwrite')
        const store = tx.objectStore('payment_methods')

        for (const paymentMethod of result.oj_data) {
          await store.put(paymentMethod)
        }

        console.log('Métodos de pago cacheados para uso offline:', result.oj_data.length)
      } else {
        console.log('No se obtuvieron métodos de pago para cachear')
      }
    } catch (error) {
      console.error('Error cacheando métodos de pago:', error)
    }
  }

  async getOfflinePaymentMethods() {
    if (!this.db) return []

    try {
      const tx = this.db.transaction('payment_methods', 'readonly')
      const store = tx.objectStore('payment_methods')
      const paymentMethods = await store.getAll()
      console.log('Métodos de pago obtenidos del cache:', paymentMethods.length)
      return paymentMethods
    } catch (error) {
      console.error('Error obteniendo métodos de pago offline:', error)
      return []
    }
  }
  async clearCache() {
    if (!this.db) return

    try {
      const stores = ['products', 'categories', 'payment_methods']

      for (const storeName of stores) {
        const tx = this.db.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)
        await store.clear()
      }

      console.log('Cache limpiado completamente')
    } catch (error) {
      console.error('Error limpiando cache:', error)
    }
  }

  async refreshCache(executeFnc: any) {
    if (!this.db) return

    try {
      console.log('Iniciando actualización completa del cache...')

      await this.clearCache()

      await this.cacheProducts(executeFnc)
      await this.cacheCategories(executeFnc)
      await this.cachePaymentMethods(executeFnc)

      console.log('Cache actualizado completamente')
    } catch (error) {
      console.error('Error actualizando cache:', error)
    }
  }
}
