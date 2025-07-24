import { Operation } from '@/modules/pos/types'
import { AppStoreProps, PointsOfSaleSliceState, SetState } from '@/store/store.types'
import { OfflineCache } from '@/lib/offlineCache'

const createPos = (
  set: SetState<PointsOfSaleSliceState>,
  get: () => AppStoreProps
): PointsOfSaleSliceState => ({
  orderSelected: null,
  setOrderSelected: (orderSelected: { order_id: string; state: string } | null) =>
    set({ orderSelected }),
  defaultPosSessionData: {
    partner_id: 66135,
    name: 'Consumidor final',
    currency_id: 1,
  },
  total: 0,
  setTotal: (total) => set({ total }),
  paidOrders: [],
  setPaidOrders: (paidOrders) => set({ paidOrders }),
  paymentMethods: [],
  setPaymentMethods: (paymentMethods) => set({ paymentMethods }),
  setDefaultPosSessionData: (defaultPosSessionData) => set({ defaultPosSessionData }),
  backToProducts: false,
  setBackToProducts: (backToProducts) => set({ backToProducts }),
  handleChange: false,
  setHandleChange: (handleChange) => set({ handleChange }),
  payments: [],
  setPayments: (payments) => set({ payments }),
  operation: Operation.QUANTITY,
  session_id: null,
  setSessionId: (session_id) => set({ session_id }),
  setOperation: (operation) => set({ operation }),
  screen: 'products',
  setScreen: (screen) => set({ screen }),
  customers: [],
  setCustomers: (customers) => set({ customers }),
  products: [],
  setProducts: (products) => set({ products }),
  cart: [],
  setCart: (cart) => set({ cart }),
  orderCart: [],
  setOrderCart: (orderCart) => set({ orderCart }),
  selectedOrder: '',
  setSelectedOrder: (selectedOrder) => set({ selectedOrder }),
  selectedItem: null,
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  orderData: [],
  setOrderData: (orderData) => set({ orderData }),
  finalCustomer: {},
  setFinalCustomer: (finalCustomer) => set({ finalCustomer }),
  categories: [],
  setCategories: (categories) => set({ categories }),
  selectedCategory: '',
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  selectedNavbarMenu: 'R',
  setSelectedNavbarMenu: (selectedNavbarMenu) => set({ selectedNavbarMenu }),
  filteredProducts: [],
  setFilteredProducts: (filteredProducts) => set({ filteredProducts }),
  displayValue: '0',
  setDisplayValue: (displayValue) => set({ displayValue }),
  clearOnNextDigit: false,
  setClearOnNextDigit: (clearOnNextDigit) => set({ clearOnNextDigit }),

  addPaymentToOrder: (order_id, payment) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const existingPayments = order.payments || []
        const updatedPayments = [...existingPayments, payment]

        return {
          ...order,
          payments_change: true,
          payments: updatedPayments,
        }
      })

      return { orderData: newOrderData }
    })
  },

  updatePaymentInOrder: (order_id, updatedPayment) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedPayments = order.payments?.map((p) =>
          p.payment_id === updatedPayment.payment_id ? updatedPayment : p
        )

        return {
          ...order,
          payments: updatedPayments,
        }
      })

      return { orderData: newOrderData }
    })
  },

  removePaymentFromOrder: (order_id, payment_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedPayments = order.payments?.filter((p) => p.payment_id !== payment_id)

        return {
          ...order,
          payments_change: true,
          payments: updatedPayments,
        }
      })

      return { orderData: newOrderData }
    })
  },

  setProductQuantityInOrder: (order_id, product_id, exact_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) =>
          p.product_id === product_id ? { ...p, quantity: exact_quantity } : p
        )

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  addProductToOrder: (order_id, product, added_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        state.setHandleChange(true)
        if (order.order_id !== order_id) return order

        const existingLine = order?.lines?.find((p: any) => p.product_id === product.product_id)

        let updatedLines
        if (!existingLine) {
          // Nuevo producto
          updatedLines = [
            ...(order?.lines ?? []),
            {
              ...product,
              quantity: added_quantity,
              price_unit: product.sale_price,
            },
          ]
        } else {
          // Ya existe => actualizar cantidad
          updatedLines = order.lines.map((p: any) =>
            p.product_id === product.product_id
              ? { ...p, quantity: (p.quantity || 0) + added_quantity }
              : p
          )
        }

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return {
        orderData: newOrderData,
        selectedItem: product.product_id,
      }
    })
  },

  addNewOrder: () =>
    set((state) => {
      state.setScreen('products')
      state.setHandleChange(true)
      const newId = crypto.randomUUID()

      const newOrder = {
        order_id: newId,
        name: newId,
        lines: [],
        state: 'I',
      }

      return {
        orderData: [...state.orderData, newOrder],
        selectedOrder: newId,
      }
    }),

  setProductPriceInOrder: (order_id, product_id, new_price) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) =>
          p.product_id === product_id ? { ...p, price_unit: new_price } : p
        )

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  toggleProductQuantitySign: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.product_id === product_id) {
            const currentQuantity = p.quantity || 0
            // No permitir cambiar el signo si la cantidad es 0
            if (currentQuantity === 0) return p

            const newQuantity = currentQuantity * -1
            return { ...p, quantity: newQuantity }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  toggleProductPriceSign: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.product_id === product_id) {
            const currentPrice = p.price_unit || 0
            // No permitir cambiar el signo si el precio es 0
            if (currentPrice === 0) return p

            const newPrice = currentPrice * -1
            return { ...p, price_unit: newPrice }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  getProductQuantityInOrder: (order_id, product_id) => {
    const order = get().orderData.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.product_id === product_id)
    return product ? product.quantity : 0
  },

  deleteProductInOrder: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.filter((p: any) => p.product_id !== product_id)
        const existingPayments = order.payments || []

        return {
          ...order,
          lines: updatedLines,
          lines_change: true,
          payments: existingPayments,
        }
      })

      const orderAfterDeletion = newOrderData.find((o) => o.order_id === order_id)
      const firstProductId = orderAfterDeletion?.lines?.[0]?.product_id || null

      return {
        orderData: newOrderData,
        selectedItem: firstProductId,
      }
    })
  },

  getTotalPriceByOrder: (order_id) => {
    const order = get().orderData?.find((o) => o.order_id === order_id)
    if (!order) return 0

    const total = order.lines?.reduce(
      (sum: number, item: any) => sum + item.price_unit * item.quantity,
      0
    )

    return Number.parseFloat(total?.toFixed(2))
  },

  deleteOrder: (order_id) => {
    set((state) => {
      const remainingOrders = state.orderData.filter((order) => order.order_id !== order_id)
      const newSelectedOrder = remainingOrders.length > 0 ? remainingOrders[0].order_id : ''
      return {
        orderData: remainingOrders,
        selectedOrder: newSelectedOrder,
        selectedItem: null,
      }
    })
  },

  updateOrderFromServer: (updatedOrder) =>
    set((state) => {
      const exists = state.orderData.some((o) => o.order_id === updatedOrder.order_id)
      return {
        orderData: exists
          ? state.orderData.map((o) => (o.order_id === updatedOrder.order_id ? updatedOrder : o))
          : [...state.orderData, updatedOrder],
      }
    }),

  changeToPayment: async (order_id) => {
    const { orderData, executeFnc } = get()
    const order = orderData.find((o) => o.order_id === order_id)

    if (!order) return

    const updatedOrder = {
      ...order,
      pos_status: 'P',
    }

    await executeFnc('fnc_pos_order', 'u', updatedOrder)

    set((state) => ({
      orderData: state.orderData.map((o) => (o.order_id === order_id ? updatedOrder : o)),
    }))
  },

  changeToPaymentLocal: (order_id: number | string) => {
    set((state) => {
      const order = state.orderData.find((o) => o.order_id === order_id)
      if (!order) return state

      const updatedOrder = {
        ...order,
        state: 'Y',
      }

      return {
        orderData: state.orderData.map((o) => (o.order_id === order_id ? updatedOrder : o)),
      }
    })
  },
  updateMoveId: (oldMoveId: string, newMoveId: string) => {
    set((state) => {
      const updatedOrders = state.orderData.map((order) =>
        order.order_id === oldMoveId ? { ...order, order_id: newMoveId } : order
      )

      return {
        orderData: updatedOrders,
        selectedOrder: newMoveId,
      }
    })
  },

  filterProducts: () => {
    const { products, searchTerm, selectedCategory } = get() // searchTerm del DialogSlice
    let result = [...products]

    if (selectedCategory) {
      result = result.filter((product) => product.category_id === selectedCategory)
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(term) || product.size?.toLowerCase().includes(term)
      )
    }

    set({ filteredProducts: result })
  },

  addDigit: (digit) => {
    const { displayValue, clearOnNextDigit } = get()
    if (digit === '.' && displayValue.includes('.')) return

    if (clearOnNextDigit) {
      set({ displayValue: digit, clearOnNextDigit: false })
    } else {
      set({ displayValue: displayValue === '0' ? digit : displayValue + digit })
    }
  },

  clearDisplay: () =>
    set({
      displayValue: '0',
      clearOnNextDigit: false,
    }),

  fetchProducts: async () => {
    const { executeFnc } = get()
    try {
      const { oj_data } = await executeFnc('fnc_product_template', 's', [
        [
          1,
          'fcon',
          ['Disponible en PdV'],
          '2',
          [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
        ],
        [1, 'pag', 1],
      ])
      set({ products: oj_data, filteredProducts: oj_data })
    } catch (err) {
      console.error('Error al obtener productos:', err)
      set({ products: [], filteredProducts: [] })
    }
  },

  getOrSetLocalStorage: async <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      let cachedData: T | null = null

      if (key === 'products') {
        cachedData = (await offlineCache.getOfflineProducts()) as T
      } else if (key === 'categories') {
        cachedData = (await offlineCache.getOfflineCategories()) as T
      } else if (key === 'payment_methods') {
        cachedData = (await offlineCache.getOfflinePaymentMethods()) as T
      }

      if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
        console.log(`datos obtenidos del cache (${key}):`, cachedData.length)
        return cachedData
      }

      const data = await fetchFn()

      if (key === 'products') {
        await offlineCache.cacheProducts(get().executeFnc)
      } else if (key === 'categories') {
        await offlineCache.cacheCategories(get().executeFnc)
      } else if (key === 'payment_methods') {
        await offlineCache.cachePaymentMethods(get().executeFnc)
      }

      return data
    } catch (error) {
      console.error(`Error en cache para ${key}:`, error)
      return await fetchFn()
    }
  },

  refreshAllCache: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      console.log('Iniciando actualización completa del cache...')
      await offlineCache.refreshCache(get().executeFnc)
      console.log('Cache actualizado completamente')
    } catch (error) {
      console.error('Error actualizando cache:', error)
    }
  },

  clearPosCache: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()
    await offlineCache.clearCache()
    console.log('Cache de POS limpiado')
  },

  getPosCacheInfo: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()

    try {
      const products = await offlineCache.getOfflineProducts()
      const categories = await offlineCache.getOfflineCategories()

      const cacheInfo = {
        products: products.length > 0 ? `${products.length} productos` : 'No cacheados',
        categories: categories.length > 0 ? `${categories.length} categorías` : 'No cacheadas',
        payment_methods: 'No implementado',
        customers: 'No implementado',
      }

      console.log('Estado del cache POS:', cacheInfo)
      return cacheInfo
    } catch (error) {
      console.error('Error obteniendo info del cache:', error)
      return {
        products: 'Error',
        categories: 'Error',
        payment_methods: 'Error',
        customers: 'Error',
      }
    }
  },

  forceReloadPosData: async (pointId: string, isOnline: boolean = true) => {
    const { refreshAllCache, initializePointOfSale } = get()

    await refreshAllCache()
    await initializePointOfSale(pointId, isOnline)
  },

  initializePointOfSale: async (pointId: string, isOnline: boolean = true) => {
    const { executeFnc, getOrSetLocalStorage } = get()

    try {
      if (!isOnline) {
        const cache = new OfflineCache()
        await cache.init()

        const [
          offlineProducts,
          offlineCategories,
          offlinePaymentMethods,
          offlineCustomers,
          offlineOrders,
        ] = await Promise.all([
          cache.getOfflineProducts(),
          cache.getOfflineCategories(),
          cache.getOfflinePaymentMethods(),
          cache.getOfflinePosPoints(),
          cache.getOfflinePosOrders(parseInt(pointId)),
        ])

        let initialOrders = offlineOrders || []
        let firstOrderId

        if (initialOrders.length === 0) {
          const newId = crypto.randomUUID()
          initialOrders = [
            {
              order_id: newId,
              name: newId,
              lines: [],
              state: 'I',
              payments: [],
            },
          ]
          firstOrderId = newId
        } else {
          firstOrderId = initialOrders[0].order_id
        }

        set({
          orderData: initialOrders,
          products: offlineProducts,
          filteredProducts: offlineProducts,
          categories: offlineCategories,
          customers: offlineCustomers,
          selectedOrder: firstOrderId,
          paymentMethods: offlinePaymentMethods,
        })

        return
      }

      // Si hay conexión, hacer las peticiones normales (código existente)
      const fetchProducts = () =>
        executeFnc('fnc_product_template', 's', [
          [
            1,
            'fcon',
            ['Disponible en PdV'],
            '2',
            [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
          ],
          [1, 'pag', 1],
        ]).then((res) => res.oj_data || [])

      const fetchCategories = () =>
        executeFnc('fnc_product_template_pos_category', 's3', [[1, 'pag', 1]]).then(
          (res) => res.oj_data || []
        )

      const fetchPaymentMethods = () =>
        executeFnc('fnc_pos_payment_method', 's', []).then((res) => res.oj_data || [])

      const fetchCustomers = () =>
        executeFnc('fnc_partner', 's', [[1, 'pag', 1]]).then((res) => res.oj_data || [])

      const ordersRes = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
        [
          0,
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],
      ])

      const ordersData = ordersRes.oj_data

      const [products, categories, paymentMethods, customers] = await Promise.all([
        getOrSetLocalStorage('products', fetchProducts),
        getOrSetLocalStorage('categories', fetchCategories),
        getOrSetLocalStorage('payment_methods', fetchPaymentMethods),
        getOrSetLocalStorage('customers', fetchCustomers),
        getOrSetLocalStorage('pos_orders', () => ordersData),
      ])

      let initialOrders = ordersRes.oj_data || []
      let firstOrderId

      if (initialOrders[0]?.state === 'I' || !initialOrders) {
        set({ screen: 'products' })
      }

      if (initialOrders.length === 0) {
        const newId = crypto.randomUUID()
        initialOrders = [
          {
            order_id: newId,
            name: newId,
            lines: [],
            state: 'I',
            payments: [],
          },
        ]
        firstOrderId = newId
      } else {
        firstOrderId = initialOrders[0].order_id
      }

      set({
        orderData: initialOrders,
        products: products,
        filteredProducts: products,
        categories: categories,
        customers: customers,
        selectedOrder: firstOrderId,
        paymentMethods: paymentMethods,
      })
    } catch (error) {
      console.error('Error al inicializar el punto de venta:', error)
      set({
        orderData: [],
        products: [],
        filteredProducts: [],
        categories: [],
        customers: [],
        paymentMethods: [],
      })
    }
  },
})

export default createPos
