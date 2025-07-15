import { Operation, TypeStateOrder } from '@/modules/pos/types'
import { AppStoreProps, PointsOfSaleSliceState, SetState } from '@/store/store.types'

const createPos = (
  set: SetState<PointsOfSaleSliceState>,
  get: () => AppStoreProps
): PointsOfSaleSliceState => ({
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

  addNewOrder: async ({date ,user_id, point_id, session_id,company_id,partner_id}: {date: Date, user_id: number, point_id: number, session_id: number,company_id: number,partner_id: number}) => {
    const { executeFnc } = get()

    const { oj_data } = await executeFnc('fnc_pos_order', 'i', {
      lines: [],
      state: TypeStateOrder.IN_PROGRESS,
      user_id: user_id,
      point_id: point_id,
      session_id: session_id,
      company_id: company_id,
      partner_id: partner_id,
      currency_id: 1,
      order_date: date,
    })

   const {oj_data: orders} = await executeFnc('fnc_pos_order', 's_pos', [
    [0, 'fequal', 'point_id', point_id],
    [
      0,
      'multi_filter_in',
      [
        { key_db: 'state', value: 'I' },
        { key_db: 'state', value: 'Y' },
      ],
    ],
  ])

    set((state) => ({
      orderData: orders,
      selectedOrder: oj_data.order_id,
      screen: 'products',
    }))
  },

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

  initializePointOfSale: async (pointId: string) => {
    const { executeFnc } = get()
    try {
      const [ordersRes, productsRes, categoriesRes, customersRes, paymentMethodsRes] =
        await Promise.all([
          executeFnc('fnc_pos_order', 's_pos', [
            [0, 'fequal', 'point_id', pointId],
            [
              0,
              'multi_filter_in',
              [
                { key_db: 'state', value: 'I' },
                { key_db: 'state', value: 'Y' },
              ],
            ],
          ]),
          executeFnc('fnc_product_template', 's', [
            [
              1,
              'fcon',
              ['Disponible en PdV'],
              '2',
              [{ key: '2.1', key_db: 'available_in_pos', value: '1' }],
            ],
            [1, 'pag', 1],
          ]),
          executeFnc('fnc_product_category', 's', [[1, 'pag', 1]]),
          executeFnc('fnc_partner', 's', [[1, 'pag', 1]]),
          executeFnc('fnc_pos_payment_method', 's', []),
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
        products: productsRes.oj_data || [],
        filteredProducts: productsRes.oj_data || [],
        categories: categoriesRes.oj_data || [],
        customers: customersRes.oj_data || [],
        selectedOrder: firstOrderId,
        paymentMethods: paymentMethodsRes.oj_data || [],
        // isLoading: false,
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
