import { Type_pos_payment_origin } from '@/modules/pos-pg/types'
import { now } from '@/shared/utils/dateUtils'
import useAppStore from '@/store/app/appStore'
import { openDB, IDBPDatabase } from 'idb'
const CACHE_CONFIG = {
  IMAGE_TIMEOUT: 5000,
  MAX_CONCURRENT_IMAGES: 5,
  RETRY_ATTEMPTS: 2,
  BATCH_SIZE: 100,
  SKIP_IMAGES_ON_RECACHE: false,
}
export type OfflinePayment = {
  payment_id: string | number
  amount: string | number
  reason?: string
  type: string
  payment_method_id: number
  date: string
  origin: string
  currency_id: number
  state: string
  company_id: number
  user_id: number
  session_id: number
  partner_id?: number | null

  name?: string
  detail?: string
  order_id?: number | null
  parent_id?: number | null
  user_name?: string
  order_name?: string | null
  partner_name?: string
  payment_method_name?: string
  state_description?: string
  amount_in_currency?: string

  synced?: boolean | number
  is_new?: boolean
  created_at?: string
  synced_at?: string
}

export type Product = { product_id: number; [key: string]: any }
export type Category = { category_id: number; [key: string]: any }
export type PaymentMethod = { payment_method_id: number; [key: string]: any }
export type PosOrder = { order_id: number | string; [key: string]: any }
export type PosPoint = { point_id: number; [key: string]: any }
export type PosSession = { session_id: number; [key: string]: any }
export type Contact = { partner_id: number | string; [key: string]: any }
export type Container = { container_id: number; [key: string]: any }
export type PosOrderQueue = { order_id: number; [key: string]: any }
export type PosPointCache = { point_id: number; oj_data: PosPoint[] }
export type Permisions = { permision_id: number; [key: string]: any }
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
  | 'offline_payments'
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
    this.version = options?.version || 5 // ← Incrementar a 5
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
        if (oldVersion < 4) {
          if (!db.objectStoreNames.contains('permissions')) {
            db.createObjectStore('permissions', { keyPath: 'permission_id' })
          }
        }
        if (oldVersion < 5) {
          if (!db.objectStoreNames.contains('offline_payments')) {
            const store = db.createObjectStore('offline_payments', {
              keyPath: 'payment_id',
            })
            store.createIndex('by_synced', 'synced', { unique: false })
            store.createIndex('by_session', 'session_id', { unique: false })
          }
        }
        if (oldVersion < 6) {
          if (!db.objectStoreNames.contains('qz_security')) {
            const store = db.createObjectStore('qz_security', { keyPath: 'id' })
            store.createIndex('by_id', 'id', { unique: true })
          }
        }
      },
    })
  }
  // Guarda configuración de QZ (certificado + clave privada)
  async saveQZKeys(certText: string, privateKeyText: string) {
    if (!this.db) await this.init()
    const tx = this.db.transaction('qz_security', 'readwrite')
    const store = tx.objectStore('qz_security')

    await store.put({
      id: 'default',
      cert: certText,
      privateKey: privateKeyText,
      updatedAt: new Date().toISOString(),
    })

    await tx.done
    console.log('💾 Claves QZ guardadas localmente.')
  }

  // Obtiene configuración QZ
  async getQZKeys() {
    if (!this.db) await this.init()
    const tx = this.db.transaction('qz_security', 'readonly')
    const store = tx.objectStore('qz_security')
    const result = await store.get('default')
    await tx.done
    return result
  }

  async cachePayments(executeFnc: any, session_id: number) {
    const result = await executeFnc('fnc_pos_payment', 's', [
      ['0', 'fequal', 'session_id', session_id],
      [
        0,
        'multi_filter_in',
        [
          { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
          { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
        ],
      ],
    ])

    if (!result?.oj_data || result.oj_data.length === 0) {
      return
    }

    const db = await this.getDB()
    const tx = db.transaction('offline_payments', 'readwrite')
    const store = tx.objectStore('offline_payments')

    const existingPayments = await store.getAll()
    const existingIds = new Set(existingPayments.map((p) => p.payment_id))

    let addedCount = 0
    let updatedCount = 0
    let skippedCount = 0

    for (const payment of result.oj_data) {
      if (existingIds.has(payment.payment_id)) {
        const existing = existingPayments.find((p) => p.payment_id === payment.payment_id)

        if (existing && !existing.is_new) {
          const offlinePayment: OfflinePayment = {
            ...payment,
            synced: true,
            is_new: false,
            created_at: existing.created_at || new Date().toISOString(),
            synced_at: new Date().toISOString(),
          }
          await store.put(offlinePayment)
          updatedCount++
        } else {
          skippedCount++
        }
      } else {
        const offlinePayment: OfflinePayment = {
          ...payment,
          synced: true,
          is_new: false,
          created_at: payment.date || new Date().toISOString(),
        }
        await store.put(offlinePayment)
        addedCount++
      }
    }

    await tx.done
  }

  async saveOfflinePayment(payment: {
    amount: string
    reason?: string
    type: string
    payment_method_id: number
    date: string
    origin: string
    currency_id: number
    state: string
    company_id: number
    user_id: number
    session_id: number
    partner_id?: number
    payment_id?: string | number
  }): Promise<OfflinePayment> {
    const db = await this.getDB()

    const offlinePayment: OfflinePayment = {
      payment_id: payment.payment_id || crypto.randomUUID(),
      amount: payment.amount,
      reason: payment.reason,
      type: payment.type,
      payment_method_id: payment.payment_method_id,
      date: payment.date,
      origin: payment.origin,
      currency_id: payment.currency_id,
      state: payment.state,
      company_id: payment.company_id,
      user_id: payment.user_id,
      session_id: payment.session_id,
      ...(payment.partner_id && { partner_id: payment.partner_id }),
      synced: payment.payment_id ? true : false,
      is_new: !payment.payment_id,
      created_at: new Date().toISOString(),
    }

    const tx = db.transaction('offline_payments', 'readwrite')
    await tx.objectStore('offline_payments').put(offlinePayment)
    await tx.done

    return offlinePayment
  }
  async syncOfflinePayments(executeFnc: any) {
    const pendingPayments = await this.getPendingOfflinePayments()

    if (pendingPayments.length === 0) {
      return { success: 0, failed: 0, results: [] }
    }

    let successCount = 0
    let failedCount = 0
    const results = []

    for (const payment of pendingPayments) {
      try {
        const paymentData: any = {
          amount: payment.amount,
          reason: payment.reason,
          type: payment.type,
          payment_method_id: payment.payment_method_id,
          date: payment.date,
          origin: payment.origin,
          currency_id: payment.currency_id,
          state: payment.state,
          company_id: payment.company_id,
          user_id: payment.user_id,
          session_id: payment.session_id,
        }

        if (payment.partner_id) {
          paymentData.partner_id = payment.partner_id
        }

        const result = await executeFnc('fnc_pos_payment', 'i', paymentData)

        if (result?.oj_data) {
          const serverPaymentId = result.oj_data.payment_id || result.oj_data.id

          let fullPaymentDetail = result.oj_data

          try {
            const detailResult = await executeFnc('fnc_pos_payment', 's1', [serverPaymentId])
            if (detailResult?.oj_data?.[0]) {
              fullPaymentDetail = detailResult.oj_data[0]
            }
          } catch (detailError) {
            console.warn(detailError)
          }

          const db = await this.getDB()
          const tx = db.transaction('offline_payments', 'readwrite')
          const store = tx.objectStore('offline_payments')

          await store.delete(payment.payment_id)

          const syncedPayment: OfflinePayment = {
            ...fullPaymentDetail,
            payment_id: serverPaymentId,
            synced: true,
            is_new: false,
            synced_at: new Date().toISOString(),
          }
          await store.put(syncedPayment)
          await tx.done

          successCount++
          results.push({
            local_id: payment.payment_id,
            server_id: serverPaymentId,
            origin: payment.origin,
            status: 'success',
            has_full_detail: detailResult?.oj_data?.[0] ? true : false,
          })
        } else {
          failedCount++
          results.push({
            payment_id: payment.payment_id,
            origin: payment.origin,
            status: 'failed',
            error: 'No data returned',
          })
        }
      } catch (error) {
        failedCount++
        results.push({
          payment_id: payment.payment_id,
          origin: payment.origin,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return { success: successCount, failed: failedCount, results }
  }

  async getOfflinePayments(): Promise<OfflinePayment[]> {
    return this.getAll<OfflinePayment>('offline_payments')
  }
  async getPendingOfflinePayments(): Promise<OfflinePayment[]> {
    const allPayments = await this.getOfflinePayments()
    return allPayments.filter((payment) => payment.synced === false || payment.synced === undefined)
  }
  async getOfflinePaymentsByOrigin(
    origin: string,
    onlyPending?: boolean
  ): Promise<OfflinePayment[]> {
    const allPayments = await this.getOfflinePayments()

    let filtered = allPayments.filter((payment) => payment.origin === origin)

    if (onlyPending) {
      filtered = filtered.filter((payment) => payment.synced === false || payment.synced === 0)
    }

    return filtered
  }

  async syncPayments(
    executeFnc: any,
    session_id: number,
    setSyncLoading?: (loading: boolean) => void
  ) {
    if (setSyncLoading) setSyncLoading(true)

    try {
      const pendingPayments = await this.getPendingOfflinePayments()

      let successCount = 0
      let failedCount = 0
      const results = []

      for (const payment of pendingPayments) {
        try {
          const paymentData: any = {
            amount: payment.amount,
            reason: payment.reason,
            type: payment.type,
            payment_method_id: payment.payment_method_id,
            date: payment.date,
            origin: payment.origin,
            currency_id: payment.currency_id,
            state: payment.state,
            company_id: payment.company_id,
            user_id: payment.user_id,
            session_id: payment.session_id,
          }

          if (payment.partner_id) {
            paymentData.partner_id = payment.partner_id
          }

          const result = await executeFnc('fnc_pos_payment', 'i', paymentData)

          if (result?.oj_data) {
            const serverPaymentId = result.oj_data.payment_id || result.oj_data.id
            successCount++
            results.push({
              local_id: payment.payment_id,
              server_id: serverPaymentId,
              origin: payment.origin,
              status: 'success',
            })
          } else {
            failedCount++
            results.push({
              payment_id: payment.payment_id,
              origin: payment.origin,
              status: 'failed',
              error: 'No data returned',
            })
          }
        } catch (error) {
          failedCount++
          results.push({
            payment_id: payment.payment_id,
            origin: payment.origin,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      const db = await this.getDB()
      const txClear = db.transaction('offline_payments', 'readwrite')
      await txClear.objectStore('offline_payments').clear()
      await txClear.done

      const result = await executeFnc('fnc_pos_payment', 's', [
        ['0', 'fequal', 'session_id', session_id],
        [
          0,
          'multi_filter_in',
          [
            { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
            { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
          ],
        ],
        [1, 'pag', 1],
      ])

      if (result?.oj_data && result.oj_data.length > 0) {
        const tx = db.transaction('offline_payments', 'readwrite')
        const store = tx.objectStore('offline_payments')

        for (const payment of result.oj_data) {
          const offlinePayment: OfflinePayment = {
            ...payment,
            synced: true,
            is_new: false,
            created_at: payment.date || new Date().toISOString(),
          }
          await store.put(offlinePayment)
        }

        await tx.done
      }

      return {
        success: true,
        synced: successCount,
        failed: failedCount,
        results: results,
        reloaded: result?.oj_data?.length || 0,
        message: `Sincronización completada: ${successCount} pagos sincronizados${
          failedCount > 0 ? `, ${failedCount} fallidos` : ''
        }, ${result?.oj_data?.length || 0} pagos recargados`,
      }
    } catch (error) {
      console.error('Error durante la sincronización de pagos:', error)
      return {
        success: false,
        synced: 0,
        failed: 0,
        results: [],
        reloaded: 0,
        error: error instanceof Error ? error.message : 'Error desconocido',
        message: 'Error durante la sincronización de pagos',
      }
    } finally {
      if (setSyncLoading) setSyncLoading(false)
    }
  }

  async markPaymentAsSynced(payment_id: string) {
    const db = await this.getDB()
    const tx = db.transaction('offline_payments', 'readwrite')
    const store = tx.objectStore('offline_payments')

    const payment = await store.get(payment_id)
    if (payment) {
      payment.synced = true
      payment.synced_at = new Date().toISOString()
      await store.put(payment)
    }

    await tx.done
  }

  private async getDB(): Promise<IDBPDatabase> {
    if (!this.db) {
      await this.init()
    }
    if (!this.db) throw new Error('IndexedDB no disponible')
    return this.db
  }

  private async putEntities<T>(storeName: EntityName, entities: T[]) {
    const db = await this.getDB()
    const tx = db.transaction(storeName, 'readwrite')
    const store = tx.objectStore(storeName)
    for (const entity of entities) {
      await store.put(entity)
    }
    await tx.done
  }
  ensureDefaultDeletePermissions = async (
    user_id: number | string,
    formIds: Array<string | number>
  ) => {
    for (const form_id of formIds) {
      const permission_id = `${form_id}-delete`
      const exists = await offlineCache.getPermissionById(permission_id)

      if (!exists) {
        await offlineCache.savePermission({
          permission_id,
          user_id,
          form_id,
          action: 'delete',
          value: false,
        })
      }
    }
  }
  ensureDefaultCreatePermissions = async (
    user_id: number | string,
    formIds: Array<string | number>
  ) => {
    for (const form_id of formIds) {
      const permission_id = `${form_id}-create`
      const exists = await offlineCache.getPermissionById(permission_id)

      if (!exists) {
        await offlineCache.savePermission({
          permission_id,
          user_id,
          form_id,
          action: 'create',
          value: false,
        })
      }
    }
  }
  async savePermission(permission: {
    user_id: number | string
    form_id: string | number
    action: string
    value: boolean
  }) {
    const db = await this.getDB()

    if (!db.objectStoreNames.contains('permissions')) {
      console.error('Error: permissions store NO existe!')
      return
    }

    const tx = db.transaction('permissions', 'readwrite')
    const store = tx.objectStore('permissions')

    const permissionId =
      permission['permission_id'] ??
      `${permission.user_id}_${permission.form_id}_${permission.action}`

    const finalPermission = {
      permission_id: permissionId,
      created_at: new Date().toISOString(),
      ...permission,
    }

    await store.put(finalPermission)
    await tx.done

    return finalPermission
  }
  async createDeletePermission() {
    const permission = {
      permission_id: '201-delete',
      user_id: 1,
      form_id: 201,
      action: 'delete',
      value: false,
    }

    await offlineCache.init()

    const savedPermission = await offlineCache.savePermission(permission)

    return savedPermission
  }
  async getPermissionById(permission_id: string | number) {
    const db = await this.getDB()
    const tx = db.transaction('permissions', 'readonly')
    const store = tx.objectStore('permissions')

    const permission = await store.get(permission_id)
    return permission ?? null
  }
  async getPermissionsByForm(user_id: string | number, form_id: string | number) {
    const db = await this.getDB()
    const tx = db.transaction('permissions', 'readonly')
    const store = tx.objectStore('permissions')
    const all = await store.getAll()

    return all.filter((perm: any) => perm.user_id == user_id && perm.form_id == form_id)
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
      // 'pos_order',
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
  async refreshCache(executeFnc: any, options?: { skipImages?: boolean }) {
    const { setSyncLoading } = useAppStore.getState()
    setSyncLoading(true)

    try {
      // Limpiar todo excepto imágenes si se van a reusar
      await this.clearAll()

      // Ejecutar en paralelo las operaciones que no dependen entre sí
      await Promise.all([
        this.cacheProducts(executeFnc),
        this.cacheCategories(executeFnc),
        this.cachePaymentMethods(executeFnc),
        this.cachePosPoints(executeFnc),
        this.cacheContacts(executeFnc),
        this.cacheContainers(executeFnc),
      ])

      console.log('✅ Caché actualizado exitosamente')
    } catch (error) {
      console.error('❌ Error actualizando cache:', error)
      throw error
    } finally {
      setSyncLoading(false)
    }
  }

  // Métodos para cachear y obtener cada entidad

  async cacheProducts(executeFnc: any) {
    const { setProducts, setProductsPg } = useAppStore.getState()

    // Verificar si ya hay productos en caché
    const existing = await this.getAll<Product>('products')
    if (existing.length > 0) {
      console.log(`✅ ${existing.length} productos ya en caché`)
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
      // Guardar productos inmediatamente
      await this.putEntities('products', result.oj_data)
      setProducts(result.oj_data)
      setProductsPg(result.oj_data)

      // Descargar imágenes en segundo plano
      this.downloadProductImagesInBackground(result.oj_data).catch((err) =>
        console.warn('Error en descarga de imágenes:', err)
      )
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
      // Guardar datos inmediatamente
      await this.putEntities('payment_method', result.oj_data)

      // Descargar imágenes en segundo plano
      this.downloadPaymentMethodImagesInBackground(result.oj_data).catch((err) =>
        console.warn('Error descargando imágenes de métodos de pago:', err)
      )
    }
  }
  private async downloadPaymentMethodImagesInBackground(paymentMethods: any[]) {
    const methodsWithImages = paymentMethods.filter((pm) => pm?.files?.[0]?.publicUrl)

    for (let i = 0; i < methodsWithImages.length; i += CACHE_CONFIG.MAX_CONCURRENT_IMAGES) {
      const batch = methodsWithImages.slice(i, i + CACHE_CONFIG.MAX_CONCURRENT_IMAGES)

      await Promise.allSettled(
        batch.map(async (method) => {
          try {
            const imageBlob = await this.fetchImageWithTimeout(
              method.files[0].publicUrl,
              CACHE_CONFIG.IMAGE_TIMEOUT
            )
            if (imageBlob) {
              await this.savePaymentMethodImage(method.payment_method_id, imageBlob)
            }
          } catch (err) {
            console.warn(`Error descargando imagen para método ${method.payment_method_id}`)
          }
        })
      )
    }
  }

  async getOfflinePaymentMethods(): Promise<PaymentMethod[]> {
    return this.getAll<PaymentMethod>('payment_method')
  }

  async cachePosOrders(executeFnc: any, pos_id: number) {
    if (!pos_id) return
    const today = new Date()
    const formattedDate = today.toLocaleDateString('es-PE')
    const result = await executeFnc('fnc_pos_order', 's_pos', [
      //[0, 'fequal', 'point_id', pos_id],
      // [0, 'fbetween', 'order_date', formattedDate, formattedDate],

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
        invoice_state: 'T',
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
    setSyncLoading?: (loading: boolean) => void,
    session_id?: number,
    cleanOrders?: boolean,
    reloadOrders?: boolean,
    orderSelected?: boolean
  ) {
    const {
      selectedOrder,
      setSelectedOrder,
      setSelectedItem,
      selectedOrderInList,
      selectedOrderPg,
      setSelectedOrderPg,
      setSelectedItemPg,
      selectedOrderInListPg,
    } = useAppStore.getState()
    if (setSyncLoading) setSyncLoading(true)
    let selectedOrderInListRT

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
      //  console.log('syncOrders', syncOrders)
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

              if (order.order_id === selectedOrder || order.order_id === selectedOrderPg) {
                setSelectedOrder(result.oj_data.order_id)
                setSelectedOrderPg(result.oj_data.order_id)
                selectedLine = result.oj_data.order_id
              }

              if (orderSelected) {
                if (
                  order.order_id === selectedOrderInList ||
                  order.order_id === selectedOrderInListPg
                ) {
                  selectedOrderInListRT = result.oj_data.order_id
                }
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
        const today = new Date()
        const formattedDate = today.toLocaleDateString('es-PE')
        const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
          //  ['0', 'fequal', 'point_id', point_id],
          ['0', 'fequal', 'session_id', session_id],
          // [0, 'fbetween', 'order_date', formattedDate, formattedDate],

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
          setSelectedOrderPg(order.order_id)
          if (order.lines?.length > 0) {
            const line = order.lines.find((l: any) => l.selected)
            setSelectedItem(line?.line_id ?? null)
            setSelectedItemPg(line?.line_id ?? null)
          } else {
            setSelectedItem(null)
            setSelectedItemPg(null)
          }
        } else {
          setSelectedOrder(selectedOrder)

          setSelectedItem(null)
          setSelectedOrderPg(selectedOrder)
          setSelectedItemPg(null)
        }
      } catch (error) {
        console.error('Error recargando órdenes desde el servidor:', error)

        const fallbackOrders = await this.getOfflinePosOrders()
        setOrderData(fallbackOrders)
      }
      if (cleanOrders) {
        setOrderData([])
        await this.clearOfflinePosOrders()
      }
      if (reloadOrders) {
        await this.refreshCache(executeFnc)
      }
    } catch (error) {
      console.error('Error general durante la sincronización:', error)
    } finally {
      if (setSyncLoading) setSyncLoading(false)
    }
    return {
      selectedOr: selectedOrderInListRT,
    }
  }

  /**
   * Borra y recarga los productos del cache desde la base de datos
   */

  async recacheProducts(
    executeFnc: any,
    options?: {
      skipImages?: boolean
      onProgress?: (progress: { current: number; total: number; phase: string }) => void
    }
  ) {
    const { setProducts, setProductsPg, setSyncDataPg, setSyncData } = useAppStore.getState()
    setSyncDataPg(true)
    setSyncData(true)

    const skipImages = options?.skipImages ?? CACHE_CONFIG.SKIP_IMAGES_ON_RECACHE
    const onProgress = options?.onProgress

    try {
      const db = await this.getDB()

      // FASE 1: Limpiar datos antiguos (paralelo)
      onProgress?.({ current: 0, total: 100, phase: 'Limpiando caché...' })

      await Promise.all([
        db
          .transaction('products', 'readwrite')
          .objectStore('products')
          .clear()
          .then((tx) => tx.done),
        skipImages
          ? Promise.resolve()
          : db
              .transaction('product_images', 'readwrite')
              .objectStore('product_images')
              .clear()
              .then((tx) => tx.done),
      ])

      // FASE 2: Obtener productos del servidor
      onProgress?.({ current: 20, total: 100, phase: 'Descargando productos...' })

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

      if (!result?.oj_data || result.oj_data.length === 0) {
        return []
      }

      const products = result.oj_data
      onProgress?.({ current: 40, total: 100, phase: 'Guardando productos...' })

      // FASE 3: Guardar productos en una sola transacción
      await this.putEntities('products', products)

      // FASE 4: Actualizar estado inmediatamente (sin esperar imágenes)
      setProducts(products)
      setProductsPg(products)

      onProgress?.({ current: 60, total: 100, phase: 'Productos listos' })

      // FASE 5: Descargar imágenes en segundo plano (opcional)
      if (!skipImages) {
        this.downloadProductImagesInBackground(products, onProgress).catch((err) =>
          console.warn('Error descargando imágenes en segundo plano:', err)
        )
      }

      return products
    } catch (error) {
      console.error('Error recargando productos:', error)
      throw error
    } finally {
      setSyncDataPg(false)
      setSyncData(false)
    }
  }

  private async downloadProductImagesInBackground(
    products: any[],
    onProgress?: (progress: { current: number; total: number; phase: string }) => void
  ) {
    const productsWithImages = products.filter((p) => p?.files?.[0]?.publicUrl)

    if (productsWithImages.length === 0) return

    console.log(`📸 Descargando ${productsWithImages.length} imágenes en segundo plano...`)

    let downloaded = 0
    const total = productsWithImages.length

    // Procesar imágenes en lotes concurrentes
    for (let i = 0; i < productsWithImages.length; i += CACHE_CONFIG.MAX_CONCURRENT_IMAGES) {
      const batch = productsWithImages.slice(i, i + CACHE_CONFIG.MAX_CONCURRENT_IMAGES)

      await Promise.allSettled(
        batch.map(async (product) => {
          try {
            const imageBlob = await this.fetchImageWithTimeout(
              product.files[0].publicUrl,
              CACHE_CONFIG.IMAGE_TIMEOUT
            )

            if (imageBlob) {
              await this.saveProductImage(product.product_id, imageBlob)
              downloaded++

              onProgress?.({
                current: 60 + Math.floor((downloaded / total) * 40),
                total: 100,
                phase: `Imágenes: ${downloaded}/${total}`,
              })
            }
          } catch (err) {
            console.warn(`❌ Error descargando imagen para producto ${product.product_id}`)
          }
        })
      )
    }

    console.log(`✅ Descarga de imágenes completada: ${downloaded}/${total}`)
  }

  private async fetchImageWithTimeout(
    url: string,
    timeout: number,
    retries: number = CACHE_CONFIG.RETRY_ATTEMPTS
  ): Promise<Blob | null> {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)

        if (!response.ok) {
          if (attempt < retries) continue
          return null
        }

        return await response.blob()
      } catch (error) {
        if (attempt < retries && error.name !== 'AbortError') {
          await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)))
          continue
        }
        return null
      }
    }
    return null
  }
  async recacheProductsFast(executeFnc: any) {
    return this.recacheProducts(executeFnc, { skipImages: true })
  }

  /**
   * Devuelve las órdenes y contactos offline que tengan la propiedad 'action' para sincronizar.
   */

  async updateProductPrice(product_id: number, newPrice: number): Promise<Product | null> {
    try {
      const db = await this.getDB()

      // Obtener el producto actual
      const txGet = db.transaction('products', 'readonly')
      const product = await txGet.objectStore('products').get(product_id)
      await txGet.done

      if (!product) {
        console.warn(`Producto con ID ${product_id} no encontrado`)
        return null
      }

      // Actualizar el precio
      const updatedProduct = {
        ...product,
        sale_price: newPrice,
      }

      // Guardar el producto actualizado
      const txUpdate = db.transaction('products', 'readwrite')
      await txUpdate.objectStore('products').put(updatedProduct)
      await txUpdate.done

      // Actualizar en el estado global si es necesario
      const { setProducts, setProductsPg } = useAppStore.getState()
      const allProducts = await this.getOfflineProducts()
      setProducts(allProducts)
      setProductsPg(allProducts)

      return updatedProduct
    } catch (error) {
      console.error(`Error actualizando precio del producto ${product_id}:`, error)
      throw error
    }
  }
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
