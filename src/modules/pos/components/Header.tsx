import { useSearch } from '../context/SearchContext'
import { MdAddCircle } from 'react-icons/md'
import { IoMdArrowDropdown } from 'react-icons/io'
import { FaBarcode } from 'react-icons/fa'
import { BiSave } from 'react-icons/bi'
import { useCart } from '../context/CartContext'
import { useEffect } from 'react'
import useAppStore from '@/store/app/appStore'
import { ActionTypeEnum } from '@/shared/shared.types'

export default function Header() {
  const { executeFnc } = useAppStore()
  const {
    searchTerm,
    setSearchTerm,
    setScreen,
    screen,
    selectedNavbarMenu,
    setSelectedNavbarMenu,
  } = useSearch()
  const {
    orderCart,
    setOrderCart,
    cart,
    setCart,
    selectedOrder,
    setSelectedOrder,
    orderData,
    fetchInvoices,
    finalCustomer,
    getTotalPrice,
  } = useCart()

  const fnc_add_order = () => {
    const order_id = crypto.randomUUID()
    fnc_change_order(order_id)
    setOrderCart((prevOrderCart) => [
      ...prevOrderCart,
      {
        id_order: order_id,
        number_order: prevOrderCart.length ? prevOrderCart.length + 1 : 1,
        name: order_id,
        cart: [],
      },
    ])
    setSelectedOrder(order_id)
  }

  const fnc_save_order = async () => {
    let data = {
      move_lines: cart.map((item, i) => ({
        ...item,
        type: 'B',
        order_id: i + 1,
        price_unit: item.sale_price,
        move_lines_taxes: [],
        amount_untaxed: 0,
        amount_withtaxed: 0,
        amount_tax: 0,
        amount_discount: 0,
        amount_untaxed_in_currency: '0.0',
        discount: null,
        line_id: item.line_id,
        hasLabel: false,
        label: '',
        move_lines_taxes_change: false,
        uom_name: item.uom_name,
        uom_id: item.uom_id,
        _resetKey: 1747172419587,
      })),
      move_id: 0,
      partner_id: finalCustomer.partner_id,
      partner_name: finalCustomer.name,
      name: selectedOrder,
      state: 'B',
      currency_id: 1,
      currency_name: 'PEN',
      pos_status: 'C',
      amount_total: getTotalPrice(),
    }

    if (typeof selectedOrder === 'string') {
      const newOrder = cart.filter((item) => item.action !== ActionTypeEnum.DELETE)

      data = {
        ...data,
        move_lines: newOrder.map((item, i) => ({
          ...item,
          type: 'B',
          order_id: i + 1,
          price_unit: item.sale_price,
          move_lines_taxes: [],
          amount_untaxed: 0,
          amount_withtaxed: 0,
          amount_tax: 0,
          amount_discount: 0,
          amount_untaxed_in_currency: '0.0',
          discount: null,
          line_id: item.line_id,
          hasLabel: false,
          label: '',
          move_lines_taxes_change: false,
          uom_name: item.uom_name,
          uom_id: item.uom_id,
          _resetKey: 1747172419587,
        })),
        move_id: selectedOrder,
      }
    }
    const rs = await executeFnc('fnc_account_move', typeof selectedOrder === 'string' ? 'i' : 'u', {
      ...data,
      move_id: selectedOrder,
    })

    const c = await executeFnc('fnc_account_move', 's1', [rs.oj_data.move_id])
    setOrderCart((prevOrderCart) =>
      prevOrderCart?.map((item) => {
        if (item.id_order === selectedOrder) {
          setSelectedOrder(rs.oj_data.move_id)

          return {
            ...item,
            move_id: rs.oj_data.move_id,
            id_order: rs.oj_data.move_id,
            partner_name: c.oj_data[0]?.partner_name,
            partner_id: c.oj_data[0]?.partner_id,
            amount_total: c.oj_data[0]?.amount_total,
            cart: c.oj_data[0]?.move_lines?.map((item: any) => ({
              ...item,
              sale_price: item.price_unit,
            })),
          }
        }
        return item
      })
    )

    /*setCart(
      order[0].move_lines.map((item: any) => ({
        ...item,
        sale_price: item.price_unit || 0,
      }))
    )*/
    setCart(
      c.oj_data[0]?.move_lines?.map((item: any) => ({ ...item, sale_price: item.price_unit }))
    )
  }
  console.log('orderCartorderCart', orderCart)
  const fnc_change_order = (id_order: string) => {
    setScreen('product')
    setSelectedNavbarMenu('R')

    setSelectedOrder(id_order)
    setOrderCart((prevOrderCart) =>
      prevOrderCart.map((item) => {
        if (item.id_order === selectedOrder) {
          return { ...item, cart: cart }
        }
        return item
      })
    )
  }
  useEffect(() => {
    setCart(orderCart.find((item) => item.id_order === selectedOrder)?.cart || [])
  }, [selectedOrder])
  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <div className="navbar-menu">
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] active"
            // onClick={() => setScreen('product')}

            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenu === 'R' ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedNavbarMenu('R')
              setScreen('product')
            }}
          >
            Registrar
          </button>
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px]"
            // onClick={() => setScreen('ticket')}

            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenu === 'O' ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedNavbarMenu('O')
              setScreen('ticket')
            }}
          >
            Órdenes
          </button>
        </div>

        <div className="navbar-orders">
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            onClick={() => {
              fnc_add_order()
            }}
          >
            <MdAddCircle style={{ fontSize: '20px' }} />
          </button>
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            onClick={() => {
              fnc_save_order()
            }}
          >
            <BiSave style={{ fontSize: '20px' }} />
          </button>

          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            <IoMdArrowDropdown style={{ fontSize: '24px' }} />
          </button>

          <div className="pos-orders">
            {orderCart?.map((order) => (
              <button
                key={order.id_order}
                className={`btn2 btn2-secondary btn2-lg lh-lg w-auto min-h-[48px] ${selectedOrder === order.id_order ? 'btn2-light active' : ''} `}
                onClick={() => fnc_change_order(order.id_order)}
              >
                {order.number_order}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pos-header-right">
        <div className={`relative ${screen === 'ticket' ? 'hidden' : ''}`}>
          <input
            type="text"
            className="w-60 pl-10 pr-10 py-2 border rounded-md bg-white"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar productos"
          />

          {/* Ícono de lupa */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Botón X para limpiar el input */}
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          className="btn2 btn2-light lh-lg w-auto min-h-[48px]"
          // style={{ paddingLeft: '2px', paddingRight: '2px' }}
        >
          <FaBarcode style={{ fontSize: '24px' }} />
        </button>

        {/* 
        <div className="ml-4 bg-teal-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
          A
        </div> */}

        <button
          className="btn2 btn2-light lh-lg w-auto min-h-[48px]"
          // style={{ paddingLeft: '2px', paddingRight: '2px' }}
        >
          {/* <FaBarcode style={{ fontSize: '24px' }} /> */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}
