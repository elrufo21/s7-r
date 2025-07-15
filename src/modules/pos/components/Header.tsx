import { useEffect, useCallback } from 'react'
import { MdAddCircleOutline } from 'react-icons/md'
// import { WiCloudUp } from 'react-icons/wi'
// import { IoMdArrowDropdown } from 'react-icons/io'
import { FaBarcode } from 'react-icons/fa'
import useAppStore from '@/store/app/appStore'
import { useNavigate } from 'react-router-dom'
import PosCloseCashConfig from '../views/modal-close-cash-register/config'
import { FrmBaseDialog } from '@/shared/components/core'
import PosModalCashinAndOut from '../views/modal-cash-in-and-out/config'
import { CustomHeaderCashInAndOut } from '../views/modal-cash-in-and-out/components/customHeader'
import { ViewTypeEnum } from '@/shared/shared.types'
import ModalButtons from './modal/components/ModalButtons'

export default function Header({ pointId }: { pointId: string }) {
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
    handleChange,
    setHandleChange,
    openDialog,
    closeDialogWithData,
    searchTerm,
    setSearchTerm,
    selectedNavbarMenu,
    setSelectedNavbarMenu,
    setOrderData,
    setSelectedItem,
    finalCustomer,
  } = useAppStore()
  const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
  const { userData } = state
  const sessions = JSON.parse(localStorage.getItem('sessions') ?? '[]')
  const { session_id } = sessions.find((s: any) => s.point_id === Number(pointId))
  const navigate = useNavigate()
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const open = Boolean(anchorEl)

  const handleClick = (/*event: React.MouseEvent<HTMLButtonElement >*/) => {
    // setAnchorEl(event.currentTarget)
    const dialogId = openDialog({
      title: '',
      dialogContent: () => (
        <ModalButtons
          handleCashInAndOut={handleCashInAndOut}
          handleCloseCashRegister={handleCloseCashRegister}
          returnToMain={() => {
            closeDialogWithData(dialogId, {})
            navigate('/points-of-sale')
          }}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  const handleClose = () => {
    // setAnchorEl(null)
  }

  const handleCashInAndOut = async () => {
    const dialogId = openDialog({
      title: '',
      customHeader: <CustomHeaderCashInAndOut />,

      dialogContent: () => (
        <FrmBaseDialog config={PosModalCashinAndOut} viewType={ViewTypeEnum.LIBRE} />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            closeDialogWithData(dialogId, null)
          },
        },
        {
          text: 'Cancelar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, null)
          },
        },
      ],
    })
  }

  const handleCloseCashRegister = async () => {
    const dialogId = openDialog({
      title: 'Cerrando la caja registradora',
      dialogContent: () => <FrmBaseDialog config={PosCloseCashConfig} />,
      buttons: [
        {
          text: 'Cerrar caja registradora',
          type: 'confirm',
          onClick: async () => {
            const rs = await executeFnc('fnc_pos_session', 'u', {
              session_id: session_id,
              state: 'R',
              stop_at: new Date(),
              final_cash: 0,
              closing_note: '',
            })
            const currentData = JSON.parse(localStorage.getItem('sessions') ?? '[]')
            const newSessions = currentData.map((s: any) =>
              s.point_id === Number(pointId) ? { ...s, session_id: null } : s
            )
            localStorage.setItem('sessions', JSON.stringify(newSessions))
            handleClose()
            closeDialogWithData(dialogId, rs)
            navigate('/points-of-sale')
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, null)
          },
        },
      ],
    })
  }
  const fnc_save_order = async () => {
    const date = new Date()
    const peruDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    switch (screen) {
      case 'products': {
        if (!handleChange) break

        const data = orderData.find((item) => item.order_id === selectedOrder)
        if (!data) return

        const updatedData = {
          ...data,
          name: '',
          state: orderData.find((item) => item.order_id === selectedOrder)?.state || 'I',
          order_date:
            orderData.find((item) => item.order_id === selectedOrder)?.order_date ||
            peruDate.toISOString(),
          user_id: userData?.user_id,
          point_id: pointId,
          session_id: session_id,
          currency_id: 1,
          company_id: userData?.company_id,
          invoice_state:
            orderData.find((item) => item.order_id === selectedOrder)?.invoice_state || 'P',
          partner_id: finalCustomer?.partner_id,
          lines: data.lines?.map((item: any, i: number) => ({
            line_id: item?.line_id,
            order_id: selectedOrder,
            position: i + 1,
            product_id: item?.product_id,
            quantity: item?.quantity,
            uom_id: item?.uom_id,
            price_unit: item?.price_unit,
            notes: null,
            amount_untaxed: item?.price_unit,
            amount_tax: 0,
            amount_withtaxed: item?.price_unit,
            amount_untaxed_total: item?.price_unit * item?.quantity,
            amount_tax_total: item?.price_unit * item?.quantity,
            amount_withtaxed_total: item?.price_unit * item?.quantity,
          })),
          order_id: selectedOrder,
          amount_untaxed:
            data.lines?.reduce((total: number, item: any) => total + (item?.price_unit || 0), 0) ||
            0,
          amount_withtaxed:
            data.lines?.reduce(
              (total: number, item: any) => total + (item?.price_unit || 0) * (item?.quantity || 0),
              0
            ) || 0,
          amount_total: getTotalPriceByOrder(selectedOrder),
        }

        const rs = await executeFnc(
          'fnc_pos_order',
          typeof selectedOrder === 'string' ? 'i' : 'u',
          {
            ...updatedData,
          }
        )

        if (rs?.oj_data?.order_id) {
          const orders = await executeFnc('fnc_pos_order', 's_pos', [
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
          setOrderData(orders?.oj_data || [])
          setSelectedOrder(rs?.oj_data?.order_id)
        }

        // Si el ID cambió, actualizamos el estado con el nuevo order_id
        if (
          typeof selectedOrder === 'string' &&
          rs?.oj_data?.order_id &&
          rs?.oj_data?.order_id !== selectedOrder
        ) {
          updateMoveId(selectedOrder, rs.oj_data.order_id)
        }
        setHandleChange(false)
        break
      }
      case 'ticket': {
        if (!handleChange) break
        break
      }
      case 'payment': {
        if (!handleChange) break
        const data = orderData.find((item) => item.order_id === selectedOrder)
        const newPayments = data?.payments?.filter((item: any) => item.amount !== 0)
        const { oj_data } = await executeFnc(
          'fnc_pos_order',
          typeof data?.order_id === 'string' ? 'i' : 'u',
          {
            ...data,
            session_id: typeof data?.order_id === 'string' ? session_id : undefined,
            payments: newPayments,
          }
        )
        if (oj_data?.order_id) {
          setSelectedOrder(oj_data?.order_id)
        }

        const orders = await executeFnc('fnc_pos_order', 's_pos', [
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
        setOrderData(orders?.oj_data || [])
        setHandleChange(false)
        break
      }
      default:
        break
    }
  }

  const fnc_change_order = (id_order: string) => {
    setScreen('products')
    fnc_save_order()
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

  const stableSaveOrder = useCallback(async () => {
    await fnc_save_order()
  }, [fnc_save_order])

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        console.log('El usuario cambió de pestaña o minimizó la ventana', handleChange)
        await stableSaveOrder()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleChange, stableSaveOrder])

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
              setSelectedItem(null)
              setScreen('ticket')
            }}
          >
            Órdenes
          </button>
        </div>

        <div className="navbar-orders">
          <button
            // className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            className="btn2 btn2-secondary lh-lg min-h-[48px]"
            onClick={() => {
              addNewOrder({
                date: new Date(),
                user_id: userData?.user_id,
                point_id: Number(pointId),
                session_id: session_id,
                company_id: userData?.company_id,
                partner_id: finalCustomer?.partner_id,
              })
            }}
          >
            <MdAddCircleOutline style={{ fontSize: '24px' }} />
          </button>
          {/* 
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            onClick={() => {
              setSelectedItem(null)
              fnc_save_order()
            }}
          >
            <WiCloudUp style={{ fontSize: '34px' }} />
          </button>
          */}

          {/*
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            <IoMdArrowDropdown style={{ fontSize: '24px' }} />
          </button>
          */}

          <div className="pos-orders">
            {orderData?.map((order, index) => (
              <button
                key={order?.order_id}
                className={`btn2 btn2-secondary btn2-lg lh-lg w-auto min-h-[48px] ${selectedOrder === order.order_id ? 'btn2-light active' : ''} `}
                onClick={() => {
                  setSelectedItem(null)
                  fnc_change_order(order.order_id)
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pos-header-right">
        <div
          className={`relative ${screen === 'ticket' || screen === 'payment' || screen === 'invoice' ? 'hidden' : ''}`}
        >
          <input
            type="text"
            className="w-[20rem] pl-10 pr-10 py-2 border rounded-md bg-white text-[16px]"
            placeholder="Buscar productos ..."
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

        <button className="btn2 btn2-light lh-lg w-auto min-h-[48px]" onClick={handleClick}>
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
        {/**<Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleCashInAndOut}>Entrada/salida de efectivo</MenuItem>
          <MenuItem onClick={() => navigate('/points-of-sale')}>
            Regresar a la ventana principal
          </MenuItem>
          <MenuItem onClick={handleCloseCashRegister}>Cerrar caja registradora</MenuItem>
        </Menu> */}
      </div>
    </header>
  )
}
