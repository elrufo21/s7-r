import { now } from '@/shared/utils/dateUtils'
import useAppStore from '@/store/app/appStore'
import { openDB, IDBPDatabase } from 'idb'

// Tipos para las entidades principales
export type Product = { product_id: number; [key: string]: any }
export type Category = { category_id: number; [key: string]: any }
export type PaymentMethod = { payment_method_id: number; [key: string]: any }
export type PosOrder = { order_id: number | string; [key: string]: any }
export type PosPoint = { point_id: number; [key: string]: any }
export type PosSession = { session_id: number; [key: string]: any }
export type Contact = { partner_id: number; [key: string]: any }
export type Container = { container_id: number; [key: string]: any }
export type PosOrderQueue = { order_id: number; [key: string]: any }
export type PosPointCache = { point_id: number; oj_data: PosPoint[] }

export type EntityName =
  | 'products'
  | 'categories'
  | 'payment_method'
  | 'pos_order'
  | 'pos_point'
  | 'pos_session'
  | 'contact'
  | 'container'
  | 'product_images'
  | 'sync_orders_queue'

interface OfflineCacheOptions {
  dbName?: string
  version?: number
}

/**
 * Servicio para manejo de cache offline usando IndexedDB.
 * Permite cachear, obtener, limpiar y sincronizar entidades clave para el POS.
 */
export class OfflineCache {
  private db: IDBPDatabase | null = null
  private dbName: string
  private version: number

  constructor(options?: OfflineCacheOptions) {
    this.dbName = options?.dbName || 's7-offline-cache'
    this.version = options?.version || 3 // Subimos la versión a 3
  }

  /** Inicializa la base de datos y los object stores necesarios. */
  async init() {
    if (!('indexedDB' in window)) return
    this.db = await openDB(this.dbName, this.version, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('products', { keyPath: 'product_id' })
          db.createObjectStore('categories', { keyPath: 'category_id' })
          db.createObjectStore('sync_orders_queue', { keyPath: 'order_id' })
        }
        if (oldVersion < 2) {
          db.createObjectStore('payment_method', { keyPath: 'payment_method_id' })
          //db.createObjectStore('pos_order', { keyPath: 'order_sequence' })
          const store = db.createObjectStore('pos_order', { keyPath: 'order_sequence' })
          store.createIndex('by_order_id', 'order_id', { unique: true })
          db.createObjectStore('pos_point', { keyPath: 'point_id' })

          db.createObjectStore('pos_session', { keyPath: 'session_id' })
          db.createObjectStore('requestsQueue', { keyPath: 'request_id', autoIncrement: true })
          db.createObjectStore('contact', { keyPath: 'partner_id' })
          db.createObjectStore('container', { keyPath: 'container_id' })
        }
        if (oldVersion < 3) {
          db.createObjectStore('product_images', { keyPath: 'product_id' })
        }
        // Soporte para imágenes de métodos de pago
        if (!db.objectStoreNames.contains('payment_method_images')) {
          db.createObjectStore('payment_method_images', { keyPath: 'payment_method_id' })
        }
      },
    })
  }

  /** Devuelve la instancia de la base de datos, inicializándola si es necesario. */
  private async getDB(): Promise<IDBPDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('IndexedDB no disponible')
    return this.db
  }

  /** Guarda una lista de entidades en el store correspondiente. */
  private async putEntities<T>(storeName: EntityName, entities: T[]) {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    for (const entity of entities) {
      await store.put(entity)
    }
    await tx.done
  }

  /** Obtiene todas las entidades de un store. */
  async getAll<T>(storeName: EntityName): Promise<T[]> {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readonly')
    const store = tx.objectStore(storeName)
    return await store.getAll()
  }

  /** Limpia todos los stores principales. */
  async clearAll() {
    const db = await this.getDB()
    const stores: EntityName[] = [
      'products',
      'categories',
      'payment_method',
      'pos_order',
      'pos_point',
      'pos_session',
      'contact',
      'container',
      'sync_orders_queue',
    ]
    for (const storeName of stores) {
      const tx = db.transaction(storeName, 'readwrite')
      await tx.objectStore(storeName).clear()
      await tx.done
    }
  }

  /** Refresca el cache de productos, categorías y métodos de pago. */
  async refreshCache(executeFnc: any) {
    try {
      await this.clearAll()
      await this.cacheProducts(executeFnc)
      await this.cacheCategories(executeFnc)
      await this.cachePaymentMethods(executeFnc)
      await this.cachePosPoints(executeFnc)
      await this.cacheContacts(executeFnc)
      await this.cacheContainers(executeFnc)
    } catch (error) {
      console.error('Error actualizando cache:', error)
    }
  }

  // Métodos para cachear y obtener cada entidad

  async cacheProducts(executeFnc: any) {
    const existing = await this.getAll<Product>('products')
    if (existing.length > 0) {
      return
    }
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
    if (result?.oj_data) {
      await this.putEntities('products', result.oj_data)

      // Descargar y guardar imágenes
      for (const product of result.oj_data) {
        const publicUrl = product?.files?.[0]?.publicUrl
        if (publicUrl) {
          const imageBlob = await this.fetchImageAsBlob(publicUrl)
          if (imageBlob) {
            await this.saveProductImage(product.product_id, imageBlob)
          }
        }
      }
    }
  }

  async getOfflineProducts(): Promise<Product[]> {
    return this.getAll<Product>('products')
  }

  async cacheCategories(executeFnc: any) {
    const existing = await this.getAll<Category>('categories')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_product_template_pos_category', 's3', [[1, 'pag', 1]])
    if (result?.oj_data) {
      await this.putEntities('categories', result.oj_data)
    }
  }

  async getOfflineCategories(): Promise<Category[]> {
    return this.getAll<Category>('categories')
  }

  async cachePaymentMethods(executeFnc: any) {
    const existing = await this.getAll<PaymentMethod>('payment_method')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_pos_payment_method', 's', [])
    if (result?.oj_data) {
      await this.putEntities('payment_method', result.oj_data)
      for (const paymentMethod of result.oj_data) {
        const publicUrl = paymentMethod?.files?.[0]?.publicUrl
        if (publicUrl) {
          const imageBlob = await this.fetchImageAsBlob(publicUrl)
          if (imageBlob) {
            await this.savePaymentMethodImage(paymentMethod.payment_method_id, imageBlob)
          }
        }
      }
    } else {
      console.log('No se obtuvieron métodos de pago para cachear')
    }
  }

  async getOfflinePaymentMethods(): Promise<PaymentMethod[]> {
    return this.getAll<PaymentMethod>('payment_method')
  }

  async cachePosOrders(executeFnc: any, pos_id: number) {
    if (!pos_id) return
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
    if (result?.oj_data) {
      await this.putEntities('pos_order', result.oj_data)
    }
  }

  async getOfflinePosOrders(): Promise<PosOrder[]> {
    return this.getAll<PosOrder>('pos_order')
  }

  async cachePosSessions(executeFnc: any, action: string, data: any) {
    const existing = await this.getAll<PosSession>('pos_session')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_pos_session', action, data)
    if (result?.oj_data) {
      await this.putEntities('pos_session', result.oj_data)
    }
  }

  async addPosOrderToQueue() {
    const result = await this.getOfflinePosOrders()
    const orders = result.filter((order: any) => order.action)
    const db = await this.getDB()
    const tx = db.transaction('sync_orders_queue', 'readwrite')
    for (const order of orders) {
      await tx.objectStore('sync_orders_queue').add(order)
    }
    await tx.done
  }

  async getSyncOrdersQueue() {
    return this.getAll<PosOrderQueue>('sync_orders_queue')
  }

  async clearSyncOrdersQueue() {
    const db = await this.getDB()
    const tx = db.transaction('sync_orders_queue', 'readwrite')
    await tx.objectStore('sync_orders_queue').clear()
    await tx.done
  }

  // Actualizar una sesión específica offline
  async updatePosSessionOffline(posSession: PosSession) {
    const db = await this.getDB()
    const tx = db.transaction('pos_session', 'readwrite')
    await tx.objectStore('pos_session').put(posSession)
    await tx.done
  }

  // Agregar una nueva sesión offline
  async addPosSessionOffline(posSession: PosSession) {
    const db = await this.getDB()
    const tx = db.transaction('pos_session', 'readwrite')
    await tx.objectStore('pos_session').add(posSession)
    await tx.done
  }

  async getOfflinePosSessions(): Promise<PosSession[]> {
    return this.getAll<PosSession>('pos_session')
  }

  async cachePosPoints(executeFnc: any) {
    const existing = await this.getAll<PosPoint>('pos_point')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_pos_point', 's', [[1, 'pag', 1]])
    if (result?.oj_data) {
      await this.putEntities('pos_point', result.oj_data)
    }
  }

  async updatePosPoints(executeFnc: any) {
    const result = await executeFnc('fnc_pos_point', 's', [[1, 'pag', 1]])
    if (result?.oj_data) {
      await this.putEntities('pos_point', result.oj_data)
    } else {
      console.log('No se obtuvieron puntos de venta para actualizar')
    }
  }

  // Actualizar puntos de venta offline (sin petición al servidor)
  async updatePosPointsOffline(posPoints: PosPoint[]) {
    await this.putEntities('pos_point', posPoints)
  }

  async updatePosPointOffline(posPoint: PosPoint) {
    const db = await this.getDB()
    const tx = db.transaction('pos_point', 'readwrite')
    await tx.objectStore('pos_point').put(posPoint)
    await tx.done
  }

  async getOfflinePosPoints(): Promise<PosPoint[]> {
    return this.getAll<PosPoint>('pos_point')
  }

  async refetchPosPointsCache(data: { oj_data: PosPoint[] }) {
    if (data?.oj_data) {
      await this.putEntities('pos_point', data.oj_data)
    }
  }

  async cacheContacts(executeFnc: any) {
    const existing = await this.getAll<Contact>('contact')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_partner', 's', [])
    if (result?.oj_data) {
      await this.putEntities('contact', result.oj_data)
    }
  }

  async getOfflineContacts(): Promise<Contact[]> {
    return this.getAll<Contact>('contact')
  }

  async cacheContainers(executeFnc: any) {
    const existing = await this.getAll<Container>('container')
    if (existing.length > 0) {
      return
    }
    const result = await executeFnc('fnc_pos_container', 's', [[1, 'pag', 1]])
    if (result?.oj_data) {
      await this.putEntities('container', result.oj_data)
    }
  }

  async getOfflineContainers(): Promise<Container[]> {
    return this.getAll<Container>('container')
  }

  async clearOfflinePosSessions() {
    const db = await this.getDB()
    const tx = db.transaction('pos_session', 'readwrite')
    await tx.objectStore('pos_session').clear()
    await tx.done
  }

  async saveContactOffline(contact: Contact) {
    const db = await this.getDB()
    const tx = db.transaction('contact', 'readwrite')
    await tx.objectStore('contact').put(contact)
    await tx.done
  }

  async saveOrderOffline(order: PosOrder) {
    const db = await this.getDB()

    const existing = await db.getFromIndex('pos_order', 'by_order_id', order.order_id)

    const tx = db.transaction('pos_order', 'readwrite')
    const store = tx.objectStore('pos_order')

    if (existing) {
      await store.put({ ...existing, ...order })
    } else {
      await store.put(order)
    }

    await tx.done
  }

  /**
   * Genera y guarda 100 órdenes de prueba usando la estructura exacta proporcionada
   */
  async generateTestOrders(count: number = 100, point_id: number, session_id: number) {
    const orders: PosOrder[] = []

    for (let i = 1; i <= count; i++) {
      const orderId = crypto.randomUUID()
      const paymentId = crypto.randomUUID()

      const order: PosOrder = {
        order_id: orderId,
        name: '',
        lines: [
          {
            order_id: orderId,
            position: 1,
            product_id: 3915,
            quantity: 8,
            uom_id: 414,
            price_unit: 5,
            notes: null,
            amount_untaxed: 5,
            amount_tax: 0,
            amount_withtaxed: 5,
            amount_untaxed_total: 40,
            amount_tax_total: 40,
            amount_withtaxed_total: 40,
          },
        ],
        state: 'P',
        order_date: now().toPlainDateTime().toString(),
        user_id: 1,
        point_id: point_id,
        session_id: session_id,
        currency_id: 1,
        company_id: 1,
        invoice_state: 'P',
        partner_id: 66135,
        amount_untaxed: 5,
        amount_withtaxed: 40,
        amount_total: 40,
        action: 'i',
        lines_change: true,
        payments_change: true,
        payments: [
          {
            payment_id: paymentId,
            company_id: 1,
            state: 'A',
            session_id: session_id,
            order_id: orderId,
            date: now().toPlainDateTime().toString(),
            currency_id: 1,
            amount: 40,
            payment_method_id: 8,
            payment_method_name: 'Plin',
          },
        ],
      }

      orders.push(order)
    }

    const db = await this.getDB()
    const tx = db.transaction('pos_order', 'readwrite')
    const store = tx.objectStore('pos_order')

    for (const order of orders) {
      await store.put(order)
    }

    await tx.done

    return orders
  }

  async clearOfflinePosOrders() {
    const db = await this.getDB()
    const tx = db.transaction('pos_order', 'readwrite')
    await tx.objectStore('pos_order').clear()
    await tx.done
  }
  async markOrderAsDeleted(order_id: string | number) {
    const db = await this.getDB()

    const order = await db.getFromIndex('pos_order', 'by_order_id', order_id)
    if (!order) return

    await db.delete('pos_order', order.order_sequence)

    if (typeof order_id === 'number') {
      await db.put('sync_orders_queue', {
        ...order,
        action: 'd',
        state: 'D',
        updated_at: new Date().toISOString(),
      })
    }
  }

  async syncOfflineData(
    executeFnc: any,
    point_id: number,
    setOrderData: any,
    setSyncLoading?: (loading: boolean) => void
  ) {
    const { selectedOrder, setSelectedOrder, setSelectedItem } = useAppStore.getState()
    if (setSyncLoading) setSyncLoading(true)

    try {
      const ordersQueue = await this.getSyncOrdersQueue()
      const orders = await this.getOfflinePosOrders()
      const sessions = await this.getOfflinePosSessions()

      // 🔹 Filtrar las órdenes que tienen acción pendiente
      const syncOrders = [...orders.filter((order) => order.action), ...ordersQueue]

      // ✅ ORDENAR por order_sequence antes de sincronizar
      syncOrders.sort((a, b) => (a.order_sequence ?? 0) - (b.order_sequence ?? 0))

      const syncSessions = sessions.filter((session: any) => session.action)
      const sessionIdMapping = new Map<number, number>()

      const processBatch = async <T>(
        items: T[],
        batchSize: number,
        processor: (item: T) => Promise<any>,
        errorHandler: (item: T, error: any) => void
      ) => {
        const results = []
        for (let i = 0; i < items.length; i += batchSize) {
          const batch = items.slice(i, i + batchSize)
          const batchPromises = batch.map(async (item) => {
            try {
              return await processor(item)
            } catch (error) {
              errorHandler(item, error)
              return null
            }
          })
          const batchResults = await Promise.all(batchPromises)
          results.push(...batchResults.filter((result) => result !== null))
        }
        return results
      }

      // 1. Crear sesiones nuevas
      const newSessions = syncSessions.filter((session) => session.action === 'i')
      if (newSessions.length > 0) {
        await processBatch(
          newSessions,
          5,
          async (session) => {
            const { oj_data } = await executeFnc('fnc_pos_session', 'i', { ...session })
            if (oj_data && (oj_data.session_id || oj_data.id)) {
              const serverSessionId = oj_data.session_id || oj_data.id
              sessionIdMapping.set(session.session_id, serverSessionId)
            }
            return oj_data
          },
          (session, error) => {
            console.error('Error creando sesión:', session.session_id, error)
          }
        )
      }

      // 2. Actualizar sesiones existentes
      const updateSessions = syncSessions.filter((session) => session.action === 'u')
      if (updateSessions.length > 0) {
        await processBatch(
          updateSessions,
          5,
          async (session) => {
            return await executeFnc('fnc_pos_session', 'u', { ...session })
          },
          (session, error) => {
            console.error('Error actualizando sesión:', session.session_id, error)
          }
        )
      }

      let selectedLine: string | undefined

      // 3. Procesar órdenes (ya están ordenadas)
      if (syncOrders.length > 0) {
        await processBatch(
          syncOrders,
          10,
          async (order) => {
            let finalSessionId = order.session_id
            if (sessionIdMapping.has(order.session_id)) {
              finalSessionId = sessionIdMapping.get(order.session_id)!
            }

            if (order.action === 'd') {
              return await executeFnc('fnc_pos_order', 'd', [order.order_id])
            } else {
              const orderToSync = {
                ...order,
                session_id: finalSessionId,
              }
              const result = await executeFnc('fnc_pos_order', order.action, orderToSync)

              if (order.order_id === selectedOrder) {
                setSelectedOrder(result.oj_data.order_id)
                selectedLine = result.oj_data.order_id
              }
              return
            }
          },
          (order, error) => {
            console.error('Error sincronizando orden:', order.order_id, error)
          }
        )
      }

      // 4. Limpiar colas después de sincronizar
      await this.clearOfflinePosOrders()
      await this.clearOfflinePosSessions()
      await this.clearSyncOrdersQueue()

      // 5. Recargar órdenes desde el backend
      try {
        const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
          ['0', 'fequal', 'point_id', point_id],
          /*[
            '0',
            'multi_filter_in',
           [
              { key_db: 'state', value: 'I' },
              { key_db: 'state', value: 'Y' },
            
            ]
            ,
          ],*/
        ])

        const ordersData = newOrders.oj_data || []

        // 🔹 Guardar en IndexedDB
        await this.clearOfflinePosOrders()
        await this.putEntities('pos_order', ordersData)

        // 🔹 Obtener desde IndexedDB
        const localOrders = await this.getOfflinePosOrders()
        setOrderData(localOrders)

        // 🔹 Re-seleccionar orden y línea
        const order = localOrders.find((o: any) => o.order_id === selectedLine)
        if (order) {
          setSelectedOrder(order.order_id)

          if (order.lines?.length > 0) {
            const line = order.lines.find((l: any) => l.selected)
            setSelectedItem(line?.line_id ?? null)
          } else {
            setSelectedItem(null)
          }
        } else {
          console.log('aeaea')
          setSelectedOrder(null)
          setSelectedItem(null)
        }
      } catch (error) {
        console.error('Error recargando órdenes desde el servidor:', error)

        const fallbackOrders = await this.getOfflinePosOrders()
        setOrderData(fallbackOrders)
      }
    } catch (error) {
      console.error('Error general durante la sincronización:', error)
    } finally {
      if (setSyncLoading) setSyncLoading(false)
    }
  }

  /**
   * Devuelve las órdenes y contactos offline que tengan la propiedad 'action' para sincronizar.
   */
  async getOfflineDataToSync() {
    const orders = await this.getOfflinePosOrders()
    const contacts = await this.getOfflineContacts()
    const contactsToSync = contacts.filter((contact: any) => contact.action)
    const ordersToSync = orders.filter((order: any) => order.action)
    return { orders: ordersToSync, contacts: contactsToSync }
  }

  // Función utilitaria para descargar una imagen como Blob
  private async fetchImageAsBlob(url: string): Promise<Blob | null> {
    try {
      const response = await fetch(url)
      if (!response.ok) return null
      return await response.blob()
    } catch {
      return null
    }
  }

  private async saveProductImage(product_id: number, imageBlob: Blob) {
    const db = await this.getDB()
    const tx = db.transaction('product_images', 'readwrite')
    await tx.objectStore('product_images').put({ product_id, image: imageBlob })
    await tx.done
  }

  // Obtener la imagen de un producto offline
  async getProductImage(product_id: number): Promise<Blob | undefined> {
    const db = await this.getDB()
    const tx = db.transaction('product_images', 'readonly')
    const record = await tx.objectStore('product_images').get(product_id)
    return record?.image
  }

  // Guardar imagen de método de pago
  private async savePaymentMethodImage(payment_method_id: number, imageBlob: Blob) {
    const db = await this.getDB()
    const tx = db.transaction('payment_method_images', 'readwrite')
    await tx.objectStore('payment_method_images').put({ payment_method_id, image: imageBlob })
    await tx.done
  }

  // Obtener imagen de método de pago offline
  async getPaymentMethodImage(payment_method_id: number): Promise<Blob | undefined> {
    const db = await this.getDB()
    const tx = db.transaction('payment_method_images', 'readonly')
    const record = await tx.objectStore('payment_method_images').get(payment_method_id)
    return record?.image
  }
}

// Instancia singleton para uso global
export const offlineCache = new OfflineCache()
