import { Operation } from '@/modules/pos/context/CalculatorContext'
import { AppStoreProps, PointsOfSaleSliceState, SetState } from '@/store/store.types'

const createPos = (
  set: SetState<PointsOfSaleSliceState>,
  get: () => AppStoreProps
): PointsOfSaleSliceState => ({
  operation: Operation.QUANTITY,
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
  categories: [],
  setCategories: (categories) => set({ categories }),

  setProductQuantityInOrder: (order_id, product_id, exact_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.move_id !== order_id) return order

        const updatedLines = order.move_lines.map((p: any) =>
          p.product_id === product_id ? { ...p, quantity: exact_quantity } : p
        )

        return {
          ...order,
          move_lines_change: true,
          move_lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  addProductToOrder: (order_id, product, added_quantity) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.move_id !== order_id) return order

        const existingLine = order.move_lines.find((p: any) => p.product_id === product.product_id)

        let updatedLines
        if (!existingLine) {
          // Nuevo producto
          updatedLines = [
            ...order.move_lines,
            {
              ...product,
              quantity: added_quantity,
              price_unit: product.sale_price,
            },
          ]
        } else {
          // Ya existe => actualizar cantidad
          updatedLines = order.move_lines.map((p: any) =>
            p.product_id === product.product_id
              ? { ...p, quantity: (p.quantity || 0) + added_quantity }
              : p
          )
        }

        return {
          ...order,
          move_lines_change: true,
          move_lines: updatedLines,
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
      const newId = crypto.randomUUID()
      const newOrder = {
        move_id: newId,
        name: newId,
        move_lines: [],
      }

      return {
        orderData: [...state.orderData, newOrder],
        selectedOrder: newId,
      }
    }),

  setProductPriceInOrder: (order_id, product_id, new_price) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.move_id !== order_id) return order

        const updatedLines = order.move_lines.map((p: any) =>
          p.product_id === product_id ? { ...p, price_unit: new_price } : p
        )

        return {
          ...order,
          move_lines_change: true,
          move_lines: updatedLines,
        }
      })

      return { orderData: newOrderData }
    })
  },

  getProductQuantityInOrder: (order_id, product_id) => {
    const order = get().orderData.find((o) => o.move_id === order_id)
    if (!order) return 0

    const product = order.move_lines.find((p: any) => p.product_id === product_id)
    return product ? product.quantity : 0
  },

  deleteProductInOrder: (order_id, product_id) => {
    set((state) => {
      const newOrderData = state.orderData.map((order) => {
        if (order.move_id !== order_id) return order

        const updatedLines = order.move_lines.filter((p: any) => p.product_id !== product_id)

        return {
          ...order,
          move_lines: updatedLines,
          move_lines_change: true,
        }
      })

      return {
        orderData: newOrderData,
        selectedItem: newOrderData.find((o) => o.move_id === order_id)?.move_lines[0]?.product_id,
      }
    })
  },

  getTotalPriceByOrder: (order_id) => {
    const order = get().orderData.find((o) => o.move_id === order_id)
    if (!order) return 0

    const total = order.move_lines.reduce(
      (sum: number, item: any) => sum + item.price_unit * item.quantity,
      0
    )

    return Number.parseFloat(total.toFixed(2))
  },

  deleteOrder: (order_id) => {
    set((state) => {
      const remainingOrders = state.orderData.filter((order) => order.move_id !== order_id)
      const newSelectedOrder = remainingOrders.length > 0 ? remainingOrders[0].move_id : ''
      return {
        orderData: remainingOrders,
        selectedOrder: newSelectedOrder,
        selectedItem: null,
      }
    })
  },

  updateOrderFromServer: (updatedOrder) =>
    set((state) => {
      const exists = state.orderData.some((o) => o.move_id === updatedOrder.move_id)
      return {
        orderData: exists
          ? state.orderData.map((o) => (o.move_id === updatedOrder.move_id ? updatedOrder : o))
          : [...state.orderData, updatedOrder],
      }
    }),

  changeToPayment: async (order_id) => {
    const { orderData, executeFnc } = get()
    const order = orderData.find((o) => o.move_id === order_id)

    if (!order) return

    const updatedOrder = {
      ...order,
      pos_status: 'P',
    }

    // Esperar a que se actualice en la BD
    await executeFnc('fnc_account_move', 'u', updatedOrder)

    // Luego actualizar el estado local
    set((state) => ({
      orderData: state.orderData.map((o) => (o.move_id === order_id ? updatedOrder : o)),
    }))
  },
  updateMoveId: (oldMoveId: string, newMoveId: string) => {
    console.log('updateMoveId', oldMoveId, newMoveId)
    set((state) => {
      const updatedOrders = state.orderData.map((order) =>
        order.move_id === oldMoveId ? { ...order, move_id: newMoveId } : order
      )

      return {
        orderData: updatedOrders,
        selectedOrder: newMoveId,
      }
    })
  },
})

export default createPos
