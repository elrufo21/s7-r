import React, { createContext, useState, useContext, type ReactNode, useEffect } from 'react'
import type { CartItem, Product } from '../types'
import { toast } from 'sonner'
import useAppStore from '@/store/app/appStore'
import { ActionTypeEnum } from '@/shared/shared.types'

interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTaxAmount: () => number
  getItemsTotal: () => number
  getItemQuantity: (productId: string) => number
  deteleAll: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  updateCartItemPrice: (productId: string, price: number) => void
  setSelectedItem: (productId: string) => void
  selectedItem: string | null
  cartFill: (data: CartItem[]) => void
  orderCart: OrderCartType[]
  setOrderCart: React.Dispatch<React.SetStateAction<OrderCartType[]>>
  selectedOrder: string
  setSelectedOrder: React.Dispatch<React.SetStateAction<string>>
  orderData: OrderCartType[]
  setOrderData: React.Dispatch<React.SetStateAction<OrderCartType[]>>
  fetchInvoices: () => void
  finalCustomer: any
  setFinalCustomer: React.Dispatch<React.SetStateAction<any>>
  customers: any
  setCustomers: React.Dispatch<React.SetStateAction<any>>
}

interface OrderCartType {
  cart: CartItem[]
  id_order: string
  number_order: number
}
const CartContext = createContext<CartContextType | null>(null)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { executeFnc } = useAppStore()
  const [orderData, setOrderData] = useState<OrderCartType[]>([])
  const [selectedOrder, setSelectedOrder] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orderCart, setOrderCart] = useState<OrderCartType[]>([])
  const [finalCustomer, setFinalCustomer] = useState<any>({})
  const [customers, setCustomers] = useState<any>({})
  const fetchInvoices = async () => {
    try {
      const { oj_data } = await executeFnc('fnc_account_move', 's_pos', [])
      setOrderData(oj_data || [])
      if (!oj_data) {
        const order_id = crypto.randomUUID()
        setOrderCart([{ id_order: order_id, number_order: 1, name: order_id, cart: [] }])
        setSelectedOrder(order_id)
        return
      }
      setFinalCustomer({ name: oj_data[0].partner_name, partner_id: oj_data[0].partner_id })
      setSelectedOrder(oj_data[0].move_id)

      setOrderCart((prevOrderCart) => {
        const newOrders = oj_data?.filter(
          (item: any) => !prevOrderCart.some((order) => order.id_order === item.move_id)
        )

        const updatedOrders = newOrders.map((item: any, index: number) => ({
          ...item,
          cart: item.move_lines?.map((line: any) => ({
            ...line,
            sale_price: line.price_unit,
          })),
          id_order: item.move_id,
          number_order: prevOrderCart.length + index + 1,
        }))

        return [...prevOrderCart, ...updatedOrders]
      })
    } catch (err) {
      console.error('Error al obtener facturas:', err)
      setOrderData([])
    }
  }
  useEffect(() => {
    fetchInvoices()
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    const customers = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
    setCustomers(customers.oj_data)
    console.log('customers', customers.oj_data)
  }
  const addToCart = (product: Product, quantity = 1) => {
    if (product.product_id === null) {
      toast.error('Error al agregar producto al carrito.')
      return
    }

    setSelectedItem(product.product_id)
    setCart((currentCart) => {
      let updatedCart: any[]

      const existingItem = currentCart.find((item) => item.product_id === product.product_id)

      if (existingItem) {
        updatedCart = currentCart.map((item) =>
          item.product_id === product.product_id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                action:
                  item.action === ActionTypeEnum.INSERT
                    ? ActionTypeEnum.INSERT
                    : ActionTypeEnum.UPDATE,
              }
            : item
        )
      } else {
        updatedCart = [...currentCart, { ...product, quantity: 1, action: ActionTypeEnum.INSERT }]
      }

      setOrderCart((prevOrderCart: any) => {
        return prevOrderCart.map((item: any) =>
          item.id_order === selectedOrder ? { ...item, cart: updatedCart } : item
        )
      })

      return updatedCart
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => {
      let updatedCart: any[]

      const existingItem = currentCart.find((item) => item.product_id === productId)

      if (existingItem && existingItem.quantity > 1) {
        updatedCart = currentCart.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity - 1, action: ActionTypeEnum.UPDATE }
            : item
        )
      } else {
        updatedCart = currentCart.map((item) =>
          item.product_id === productId ? { ...item, action: ActionTypeEnum.DELETE } : item
        )
      }

      setOrderCart((prevOrderCart: any) => {
        return prevOrderCart?.map((item: any) => {
          if (item.id_order === selectedOrder) {
            return {
              ...item,
              cart: updatedCart,
            }
          }
          return item
        })
      })

      return updatedCart
    })
  }

  const deteleAll = (productId: string) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item.product_id === productId ? { ...item, action: ActionTypeEnum.DELETE } : item
      )

      setOrderCart((prevOrderCart: any) => {
        return prevOrderCart?.map((item: any) => {
          if (item.id_order === selectedOrder) {
            return {
              ...item,
              cart: updatedCart,
            }
          }
          return item
        })
      })

      return updatedCart
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return Number.parseFloat(
      cart?.reduce((total, item) => total + item.sale_price * item.quantity, 0).toFixed(2)
    )
  }

  const getTaxAmount = () => {
    // Assuming tax rate is 18%
    return 0
  }

  const getItemsTotal = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getItemQuantity = (productId: string) => {
    const item = cart?.find((item) => item.product_id === productId)
    return item ? item.quantity : 0
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity,
              action:
                item.action === ActionTypeEnum.INSERT
                  ? ActionTypeEnum.INSERT
                  : ActionTypeEnum.UPDATE,
            }
          : item
      )

      setOrderCart((prevOrderCart: any) => {
        return prevOrderCart?.map((item: any) => {
          if (item.id_order === selectedOrder) {
            return {
              ...item,
              cart: updatedCart,
            }
          }
          return item
        })
      })

      return updatedCart
    })
  }

  const updateCartItemPrice = (productId: string, price: number) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item.product_id === productId ? { ...item, cost: price, sale_price: price } : item
      )

      setOrderCart((prevOrderCart: any) => {
        return prevOrderCart?.map((item: any) => {
          if (item.id_order === selectedOrder) {
            return {
              ...item,
              cart: updatedCart,
            }
          }
          return item
        })
      })

      return updatedCart
    })
  }

  const cartFill = (data: CartItem[]) => {
    setCart(data)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTaxAmount,
        getItemsTotal,
        getItemQuantity,
        deteleAll,
        updateCartItemQuantity,
        updateCartItemPrice,
        selectedItem,
        setSelectedItem,
        cartFill,
        orderCart,
        setOrderCart,
        setCart,
        selectedOrder,
        setSelectedOrder,
        orderData,
        setOrderData,
        fetchInvoices,
        finalCustomer,
        setFinalCustomer,
        customers,
        setCustomers,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
