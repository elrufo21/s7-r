import { Operation, TypeStateOrder } from '@/modules/pos/types'
import { AppStoreProps, PointsOfSaleSliceState, SetState } from '@/store/store.types'
import { offlineCache, OfflineCache } from '@/lib/offlineCache'
import { now } from '@/shared/utils/dateUtils'
import { ActionTypeEnum } from '@/shared/shared.types'
import { adjustTotal, formatNumber } from '@/shared/helpers/helpers'

const createPos = (
  set: SetState<PointsOfSaleSliceState>,
  get: () => AppStoreProps
): PointsOfSaleSliceState => ({
  selectedOrderInList: 0,
  setSelectedOrderInList: (selectedOrderInList) => set({ selectedOrderInList }),
  point_id: null,
  setPointId: (point_id) => set({ point_id }),
  searchProduct: '',
  setSearchProduct: (searchProduct) => set({ searchProduct }),
  resetTrigger: 0,
  prevItem: {},
  setPrevItem: (prevItem) => set({ prevItem }),
  sync_data: false,
  setSyncData: (sync_data) => set({ sync_data }),
  localMode: true,
  isWeightMode: false,
  setIsWeightMode: (isWeightMode) => set({ isWeightMode }),
  PC_multipleSimilarProducts: true,
  setPC_multipleSimilarProducts: (PC_multipleSimilarProducts) =>
    set({ PC_multipleSimilarProducts }),
  containers: [],
  //Bluetooth
  bluetooth_config: {
    service_Uuid: '6e400001-b5a3-f393-e0a9-e50e24dcca9e',
    character_Uuid: '6e400003-b5a3-f393-e0a9-e50e24dcca9e',
    device_name: 'BalanzaESP32',
  },
  device: null,
  setDevice: (device) => set({ device }),
  connected: false,
  setConnected: (connected) => set({ connected }),
  weightValue: 0,
  setWeightValue: (weightValue) => set({ weightValue }),
  setBluetoothConfig: (bluetooth_config) => set({ bluetooth_config }),
  characteristic: null,
  setCharacteristic: (c: BluetoothRemoteGATTCharacteristic | null) => set({ characteristic: c }),
  connectToDevice: async () => {
    try {
      const dev = await (navigator as any).bluetooth.requestDevice({
        filters: [{ name: get().bluetooth_config.device_name }],
        optionalServices: [get().bluetooth_config.service_Uuid],
      })
      set({ device: dev })

      const server = await dev.gatt!.connect()
      const service = await server.getPrimaryService(get().bluetooth_config.service_Uuid)
      const characteristic = await service.getCharacteristic(get().bluetooth_config.character_Uuid)

      set({ characteristic })

      characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target?.value as DataView
        if (value) {
          const weight = parseFloat(new TextDecoder('utf-8').decode(value))
          if (!isNaN(weight)) set({ weight })
        }
      })

      await characteristic.startNotifications()
      set({ connected: true })

      dev.addEventListener('gattserverdisconnected', () => set({ connected: false }))
    } catch (err) {
      console.error('❌ Error al conectar:', err)
    }
  },

  disconnect: () => {
    const dev = get().device
    if (dev && dev.gatt?.connected) {
      dev.gatt.disconnect()
      set({ connected: false })
    }
  },
  //Final config Buetooth
  setContainers: (containers) => set({ containers }),
  orderSelected: null,
  setOrderSelected: (orderSelected: { order_id: string; state: string } | null) =>
    set({ orderSelected }),
  defaultPosSessionData: {
    partner_id: 66735,
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

  getProductPrice: (product_id, selectedOrder) => {
    const order = get().orderData.find((o) => o.order_id === selectedOrder)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p?.product_id === product_id)
    if (product) {
      return Number((product.price_unit * product.quantity).toFixed(2)) || 0
    }
    return 0
  },

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

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
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

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
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

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  // Función helper para calcular cantidad efectiva y tara total
  calculateEffectiveQuantity: (
    base_quantity: number,
    tara_value: number,
    tara_quantity: number
  ) => {
    return base_quantity - (tara_value || 0) * (tara_quantity || 0)
  },

  calculateTaraTotal: (tara_value: number, tara_quantity: number) => {
    return (tara_value || 0) * (tara_quantity || 0)
  },

  setProductQuantityInOrder: (order_id, product_id, base_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const effectiveQuantity = get().calculateEffectiveQuantity(
              base_quantity,
              p.tara_value || 0,
              p.tara_quantity || 0
            )
            return {
              ...p,
              base_quantity: formatNumber(base_quantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  addProductToOrder: (order_id, product, added_quantity) => {
    set((state) => {
      let selectedItem = crypto.randomUUID()

      const newOrderData = state.orderData.map((order) => {
        state.setHandleChange(true)
        if (order.order_id !== order_id) return order

        const existingLine = order?.lines?.find((p: any) => p.product_id === product.product_id)
        let updatedLines
        if (state.PC_multipleSimilarProducts) {
          updatedLines = [
            ...(order?.lines ?? []),
            {
              ...product,
              base_quantity: 0,
              quantity: 0,
              price_unit: product.sale_price,
              tara_value: 0,
              tara_quantity: 0,
              tara_total: 0,
              line_id: selectedItem,
            },
          ]
        } else {
          if (!existingLine) {
            // Nuevo producto
            const effectiveQuantity = get().calculateEffectiveQuantity(
              added_quantity,
              0, // tara_value inicial
              0 // tara_quantity inicial
            )
            updatedLines = [
              ...(order?.lines ?? []),
              {
                ...product,
                base_quantity: added_quantity,
                quantity: effectiveQuantity,
                price_unit: product.sale_price,
                tara_value: 0,
                tara_quantity: 0,
                tara_total: 0,
                line_id: selectedItem,
              },
            ]
          } else {
            // Producto ya existe
            if (get().isWeightMode) {
              // En modo peso: solo seleccionar, no agregar cantidad
              updatedLines = order.lines
            } else {
              selectedItem = existingLine.line_id

              // En modo normal: agregar cantidad
              updatedLines = order.lines.map((p: any) => {
                if (p.product_id === product.product_id) {
                  const newBaseQuantity = (p.base_quantity || p.quantity || 0) + added_quantity
                  const effectiveQuantity = get().calculateEffectiveQuantity(
                    newBaseQuantity,
                    p.tara_value || 0,
                    p.tara_quantity || 0
                  )
                  return {
                    ...p,
                    base_quantity: newBaseQuantity,
                    quantity: effectiveQuantity,
                  }
                }
                return p
              })
            }
          }
        }

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return {
        orderData: newOrderData.filter((order) => order.state !== 'P'),
        selectedItem: selectedItem,
      }
    })
  },

  updateOrderPartner: (order_id, partner_id, partner_name) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        return {
          ...order,
          partner_id,
          partner_name,
        }
      })

      return {
        orderData: newOrderData.filter((order) => order.state !== 'P'),
      }
    })
  },

  addNewOrder: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()
    const orders = await offlineCache.getOfflinePosOrders()

    const maxSequence =
      orders.length > 0 ? Math.max(...orders.map((order) => order.order_sequence)) : 0
    const newSequence = maxSequence + 1

    const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')

    const formattedSession = String(secuence).padStart(4, '0')
    const formattedSequence = String(newSequence).padStart(4, '0')
    const receiptNumber = `${formattedSession}-${formattedSequence}`

    const newId = crypto.randomUUID()
    const newOrder = {
      order_id: newId,
      order_date: now().toPlainDateTime().toString(),
      name: newId,
      lines: [],
      state: TypeStateOrder.IN_PROGRESS,
      combined_states: TypeStateOrder.IN_PROGRESS,
      position: get().orderData.length + 1,
      partner_id: get().defaultPosSessionData.partner_id,
      partner_name: get().defaultPosSessionData.name,
      order_sequence: newSequence,
      receipt_number: receiptNumber,
      session_id: get().session_id,
      point_id: get().point_id,
      currency_id: get().defaultPosSessionData.currency_id,
    }

    // Guardar offline
    await offlineCache.saveOrderOffline({ ...newOrder, action: ActionTypeEnum.INSERT })

    // Actualizar el estado
    set((state) => {
      if (state.screen !== 'ticket') {
        state.setScreen('products')
      }
      state.setHandleChange(true)

      return {
        orderData: [...state.orderData, newOrder].filter((order) => order.state !== 'P'),
        selectedOrder: newId,
      }
    })
  },

  setProductPriceInOrder: (order_id, product_id, new_price) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) =>
          p.line_id === product_id ? { ...p, price_unit: new_price } : p
        )

        return {
          ...order,
          lines_change: true,
          lines: updatedLines,
        }
      })

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  toggleProductQuantitySign: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
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

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  toggleProductPriceSign: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
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

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },

  getProductQuantityInOrder: (order_id, product_id) => {
    const order = get().orderData.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)

    return product ? product.quantity : 0
  },
  getProductQuantityInProducts: (product_id, order_id) => {
    const order = get().orderData.find((o) => o.order_id === order_id)
    const quantity_by_product = order?.lines
      ?.filter((p: any) => p.product_id === product_id)
      .reduce((acc: number, p: any) => acc + p.quantity, 0)
    const { adjusted } = adjustTotal(quantity_by_product)
    return adjusted || 0
  },

  getProductTaraValue: (order_id, product_id) => {
    const order = get().orderData.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)
    return product ? product.tara_value || 0 : 0
  },

  getProductTaraQuantity: (order_id, product_id) => {
    const order = get().orderData.find((o) => o.order_id === order_id)
    if (!order) return 0

    const product = order?.lines?.find((p: any) => p.line_id === product_id)
    return product ? product.tara_quantity || 0 : 0
  },

  deleteProductInOrder: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.filter((p: any) => p.line_id !== product_id)
        const existingPayments = order.payments || []

        return {
          ...order,
          lines: updatedLines,
          lines_change: true,
          payments: existingPayments,
        }
      })

      const orderAfterDeletion = newOrderData.find((o) => o.order_id === order_id)
      const lastProductId =
        orderAfterDeletion?.lines?.[orderAfterDeletion.lines.length - 1]?.line_id || null

      return {
        orderData: newOrderData.filter((order) => order.state !== 'P'),
        selectedItem: lastProductId,
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
    return total ? formatNumber(total) : 0
  },
  setSelectedLine: (order_id, line_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order?.lines?.map((p: any) => ({
          ...p,
          selected: p?.line_id === line_id,
        }))

        return {
          ...order,
          lines: updatedLines,
        }
      })
      const selectedOrder = newOrderData.find((order) => order.order_id === order_id)
      let selectedLine = {}
      if (selectedOrder) {
        selectedLine = selectedOrder?.lines?.find((line) => line.line_id === line_id)
      } else {
        selectedLine = {}
      }

      return {
        orderData: newOrderData.filter((order) => order.state !== 'P'),
        selectedItem: line_id,
        prevItem: selectedLine,
      }
    })
  },

  resetSelectedItem: () => {
    set((state) => {
      if (!state.selectedItem || !state.prevItem) return state

      const newOrderData = state.orderData.map((order) => {
        const updatedLines = order.lines.map((line: any) => {
          if (line.line_id === state.selectedItem) {
            return { ...state.prevItem }
          }
          return line
        })
        return { ...order, lines: updatedLines, lines_change: true }
      })

      return { orderData: newOrderData, resetTrigger: state.resetTrigger + 1 }
    })
  },

  deleteOrder: (order_id, isCloseSession = false) => {
    set((state) => {
      const remainingOrders = state.orderData
        .filter((order) => order.order_id !== order_id)
        .filter(
          (order) =>
            order.state === TypeStateOrder.IN_PROGRESS || order.state === TypeStateOrder.PAY
        )
      const newSelectedOrder = remainingOrders.length > 0 ? remainingOrders[0].order_id : ''
      if (remainingOrders.length === 0 && !isCloseSession) {
        state.addNewOrder()
      }
      return {
        orderData: remainingOrders.filter((order) => order.state !== 'P'),
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
          ? state.orderData
              .map((o) => (o.order_id === updatedOrder.order_id ? updatedOrder : o))
              .filter((order) => order.state !== 'P')
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
      orderData: state.orderData
        .map((o) => (o.order_id === order_id ? updatedOrder : o))
        .filter((order) => order.state !== 'P'),
    }))
  },

  changeToPaymentLocal: (order_id: number | string) => {
    set((state) => {
      const order = state.orderData.find((o) => o.order_id === order_id)
      if (!order) return state

      const updatedOrder = {
        ...order,
        state: TypeStateOrder.PAY,
        combined_states: TypeStateOrder.PAY,
      }

      return {
        orderData: state.orderData
          .map((o) => (o.order_id === order_id ? updatedOrder : o))
          .filter((order) => order.state !== 'P'),
      }
    })
  },
  updateMoveId: (oldMoveId: string, newMoveId: string) => {
    set((state) => {
      const updatedOrders = state.orderData.map((order) =>
        order.order_id === oldMoveId ? { ...order, order_id: newMoveId } : order
      )

      return {
        orderData: updatedOrders.filter((order) => order.state !== 'P'),
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
      } else if (key === 'containers') {
        cachedData = (await offlineCache.getOfflineContainers()) as T
      }

      if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
        return cachedData
      }

      const data = await fetchFn()

      if (key === 'products') {
        await offlineCache.cacheProducts(get().executeFnc)
      } else if (key === 'categories') {
        await offlineCache.cacheCategories(get().executeFnc)
      } else if (key === 'payment_methods') {
        await offlineCache.cachePaymentMethods(get().executeFnc)
      } else if (key === 'containers') {
        await offlineCache.cacheContainers(get().executeFnc)
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
      await offlineCache.refreshCache(get().executeFnc)
    } catch (error) {
      console.error('Error actualizando cache:', error)
    }
  },

  clearPosCache: async () => {
    const offlineCache = new OfflineCache()
    await offlineCache.init()
    await offlineCache.clearAll()
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

  forceReloadPosData: async (
    pointId: string,
    isOnline: boolean = true,
    session_id: string | null
  ) => {
    console.log(isOnline)

    await offlineCache.syncOfflineData(
      get().executeFnc,
      pointId,
      get().setOrderData,
      get().setSyncLoading,
      session_id,
      false,
      true
    )
    //await initializePointOfSale(pointId, isOnline, session_id)
  },

  initializePointOfSale: async (
    pointId: string,
    isOnline: boolean = true,
    session_id: string | null
  ) => {
    const { executeFnc, getOrSetLocalStorage } = get()

    try {
      const cache = new OfflineCache()
      await cache.init()

      const offlineOrders = await cache.getOfflinePosOrders()

      if (!isOnline) {
        return
      }

      if (
        offlineOrders &&
        offlineOrders.filter(
          (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
        ).length > 0
      ) {
        const [
          offlineProducts,
          offlineCategories,
          offlinePaymentMethods,
          offlineCustomers,
          offlineContainers,
        ] = await Promise.all([
          cache.getOfflineProducts(),
          cache.getOfflineCategories(),
          cache.getOfflinePaymentMethods(),
          cache.getOfflinePosPoints(),
          cache.getOfflineContainers(),
        ])

        set({
          orderData: offlineOrders.filter((o: any) => o.state !== TypeStateOrder.PAID),
          products: offlineProducts,
          filteredProducts: offlineProducts,
          categories: offlineCategories,
          customers: offlineCustomers,
          selectedOrder: offlineOrders.filter((o) => o.state === 'I' || o.state === 'Y')[0]
            .order_id,
          paymentMethods: offlinePaymentMethods,
          containers: offlineContainers || [],
        })

        return
      }

      const ordersRes = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
        [0, 'fequal', 'session_id', session_id],
        /*[
          0,
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],*/
      ])

      if (ordersRes?.oj_data?.length) {
        for (const order of ordersRes.oj_data) {
          await cache.saveOrderOffline(order)
        }
      }

      const [products, categories, paymentMethods, customers, containers] = await Promise.all([
        getOrSetLocalStorage('products', () =>
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
        ),
        getOrSetLocalStorage('categories', () =>
          executeFnc('fnc_product_template_pos_category', 's3', [[1, 'pag', 1]]).then(
            (res) => res.oj_data || []
          )
        ),
        getOrSetLocalStorage('payment_methods', () =>
          executeFnc('fnc_pos_payment_method', 's', []).then((res) => res.oj_data || [])
        ),
        getOrSetLocalStorage('customers', () =>
          executeFnc('fnc_partner', 's', [[1, 'pag', 1]]).then((res) => res.oj_data || [])
        ),
        getOrSetLocalStorage('containers', () =>
          executeFnc('fnc_pos_container', 's', [[1, 'pag', 1]]).then((res) => res.oj_data || [])
        ),
      ])

      let initialOrders = ordersRes?.oj_data || []

      if (initialOrders.filter((o: any) => o.state === 'I').length === 0) {
        //No carga el seleccionado
        const secuence = JSON.parse(localStorage.getItem('secuence') || '[]')
        const firstOrderId = crypto.randomUUID()
        const firstSequence = 1
        const formattedSession = String(secuence).padStart(4, '0')
        const formattedSequence = String(firstSequence).padStart(4, '0')
        const firstReceiptNumber = `${formattedSession}-${formattedSequence}`
        const sessions = JSON.parse(localStorage.getItem('sessions') || '')
        const activeSession = sessions.find((session) => session.active).session_id
        initialOrders = [
          {
            order_id: firstOrderId,
            name: firstOrderId,
            lines: [],
            state: TypeStateOrder.IN_PROGRESS,
            payments: [],
            position: 1,
            order_sequence: firstSequence,
            receipt_number: firstReceiptNumber,
            order_date: now().toPlainDateTime().toString(),
            partner_id: get().defaultPosSessionData.partner_id,
            partner_name: get().defaultPosSessionData.name,
            combined_states: TypeStateOrder.IN_PROGRESS,
            point_id: pointId,
            session_id: activeSession,
            currency_id: get().defaultPosSessionData.currency_id,
            invoice_state: 'T',
            amount_total: 0,
            amount_with_tax: 0,
            amount_untaxed: 0,
            amount_adjustment: 0,
          },
        ]
      }
      await offlineCache.saveOrderOffline({ ...initialOrders[0], action: ActionTypeEnum.INSERT })
      set({
        orderData: initialOrders.filter((o: any) => o.state !== 'P'),
        products,
        filteredProducts: products,
        categories,
        customers,
        selectedOrder: initialOrders[0].order_id,
        paymentMethods,
        containers,
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
        containers: [],
      })
    }
  },

  setTaraValue: (order_id, product_id, tara_value) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const baseQuantity = p.base_quantity || p.quantity || 0
            const tara_quantity = p.tara_quantity || 0
            const effectiveQuantity = get().calculateEffectiveQuantity(
              baseQuantity,
              tara_value,
              tara_quantity
            )
            const tara_total = get().calculateTaraTotal(tara_value, tara_quantity)
            return {
              ...p,
              tara_value: tara_value,
              tara_total: tara_total,
              base_quantity: formatNumber(baseQuantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return { ...order, lines_change: true, lines: updatedLines }
      })

      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },
  setTaraQuantity: (order_id, product_id, tara_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.order_id !== order_id) return order

        const updatedLines = order.lines.map((p: any) => {
          if (p.line_id === product_id) {
            const baseQuantity = p.base_quantity || p.quantity || 0
            const tara_value = p.tara_value || 0
            const effectiveQuantity = get().calculateEffectiveQuantity(
              baseQuantity,
              tara_value,
              tara_quantity
            )
            const tara_total = get().calculateTaraTotal(tara_value, tara_quantity)
            return {
              ...p,
              tara_quantity: tara_quantity,
              tara_total: tara_total,
              base_quantity: formatNumber(baseQuantity),
              quantity: formatNumber(effectiveQuantity),
            }
          }
          return p
        })

        return { ...order, lines_change: true, lines: updatedLines }
      })
      return { orderData: newOrderData.filter((order) => order.state !== 'P') }
    })
  },
})

export default createPos
