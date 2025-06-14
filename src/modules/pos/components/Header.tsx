import { useSearch } from '../context/SearchContext'
import { MdAddCircle } from 'react-icons/md'
import { IoMdArrowDropdown } from 'react-icons/io'
import { FaBarcode } from 'react-icons/fa'
import { BiSave } from 'react-icons/bi'
import useAppStore from '@/store/app/appStore'

export default function Header() {
  const {
    executeFnc,
    addNewOrder,
    orderData,
    selectedOrder,
    setSelectedOrder,
    setScreen,
    screen,
    getTotalPriceByOrder,
    updateMoveId,
  } = useAppStore()

  const { searchTerm, setSearchTerm, selectedNavbarMenu, setSelectedNavbarMenu } = useSearch()

  const fnc_save_order = async () => {
    const data = orderData.find((item) => item.move_id === selectedOrder)
    if (!data) return

    const updatedData = {
      ...data,
      move_lines: data.move_lines?.map((item: any, i: number) => ({
        ...item,
        order_id: i + 1,
        tyle: 'L',
      })),
      move_id: selectedOrder,
      amount_total: getTotalPriceByOrder(selectedOrder),
    }

    const rs = await executeFnc('fnc_account_move', typeof selectedOrder === 'string' ? 'i' : 'u', {
      ...updatedData,
    })

    // Si el ID cambió, actualizamos el estado con el nuevo move_id
    if (
      typeof selectedOrder === 'string' &&
      rs?.oj_data?.move_id &&
      rs?.oj_data?.move_id !== selectedOrder
    ) {
      updateMoveId(selectedOrder, rs.oj_data.move_id)
    }
  }

  const fnc_change_order = (id_order: string) => {
    setScreen('products')
    setSelectedNavbarMenu('R')
    setSelectedOrder(id_order)
    /* setOrderCart((prevOrderCart) =>
      prevOrderCart.map((item) => {
        if (item.id_order === selectedOrder) {
          return { ...item, cart: cart }
        }
        return item
      })
    )*/
  }

  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <div className="navbar-menu">
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] active"
            // onClick={() => setScreen('products')}

            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenu === 'R' ? 'active' : ''
            }`}
            onClick={() => {
              setSelectedNavbarMenu('R')
              setScreen('products')
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
              fnc_save_order()
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
              addNewOrder()
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
            {orderData?.map((order, index) => (
              <button
                key={order?.id_order}
                className={`btn2 btn2-secondary btn2-lg lh-lg w-auto min-h-[48px] ${selectedOrder === order.move_id ? 'btn2-light active' : ''} `}
                onClick={() => fnc_change_order(order.move_id)}
              >
                {index + 1}
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
