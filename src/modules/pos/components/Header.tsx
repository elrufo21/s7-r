import { useEffect, useCallback, useMemo } from 'react'
import { MdAddCircleOutline } from 'react-icons/md'
// import { WiCloudUp } from 'react-icons/wi'
// import { IoMdArrowDropdown } from 'react-icons/io'
import useAppStore from '@/store/app/appStore'
import { useNavigate } from 'react-router-dom'
import PosCloseCashConfig from '../views/modal-close-cash-register/config'
import { FrmBaseDialog } from '@/shared/components/core'
import PosModalCashinAndOut from '../views/modal-cash-in-and-out/config'
import { CustomHeaderCashInAndOut } from '../views/modal-cash-in-and-out/components/customHeader'
import { ViewTypeEnum } from '@/shared/shared.types'
import ModalButtons from './modal/components/ModalButtons'
import { usePosActions } from '../hooks/usePosActions'
import { offlineCache } from '@/lib/offlineCache'
import { usePWA } from '@/hooks/usePWA'
import { now } from '@/shared/utils/dateUtils'
import { TypeStateOrder } from '../types'
import { FiAlertTriangle } from 'react-icons/fi'

export default function Header({ pointId }: { pointId: string }) {
  const {
    addNewOrder,
    orderData,
    selectedOrder,
    setSelectedOrder,
    setScreen,
    screen,
    openDialog,
    closeDialogWithData,
    searchProduct,
    setSearchProduct,
    selectedNavbarMenu,
    setSelectedNavbarMenu,
    setSelectedItem,
    finalCustomer,
    executeFnc,
    frmLoading,
    setOrderData,
    setSyncLoading,
    deleteOrder,
    setHandleChange,
  } = useAppStore()
  const { saveCurrentOrder } = usePosActions()
  const { isOnline } = usePWA()
  const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
  const { userData } = state
  const sessions = JSON.parse(localStorage.getItem('sessions') ?? '[]')
  const { session_id } = sessions.find((s: any) => s.point_id === Number(pointId))
  const navigate = useNavigate()

  const handleVisibilityChange = useCallback(async () => {
    if (document.visibilityState === 'hidden') {
      await saveCurrentOrder(true)
    }
    if (document.visibilityState === 'visible') {
      const order = orderData.filter((i: any) => i.order_id === selectedOrder)
      const selected = order?.[0]?.lines?.filter((i: any) => i.selected)

      setSelectedItem(selected?.[0]?.line_id)
    }
  }, [saveCurrentOrder])
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  const handleClick = () => {
    const dialogId = openDialog({
      title: '',
      dialogContent: () => (
        <ModalButtons
          pointId={pointId}
          handleCashInAndOut={handleCashInAndOut}
          handleCloseCashRegister={handleCloseCashRegister}
          returnToMain={() => {
            closeDialogWithData(dialogId, {})
            setScreen('products')
            navigate('/points-of-sale')
          }}
          closeDialog={() => closeDialogWithData(dialogId, {})}
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

  const handleCashInAndOut = async () => {
    const dialogId = openDialog({
      title: '',
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
  function updatePmValues(data: any) {
    if (!data.pm || !Array.isArray(data.pm)) return data
    const isCash = data.watchData?.find((pm: any) => pm.is_cash === true).payment_method_id
    data.pm = data.pm.map((item: any) => {
      const fieldName =
        item.payment_method_id === isCash ? 'cash_count' : `pm_${item.payment_method_id}`

      const counted = parseFloat(data[fieldName] ?? 0)

      return {
        ...item,
        counted,
        difference: parseFloat((item.amount - counted).toFixed(2)),
      }
    })

    return data
  }

  const diferenceDialog = (title: string, diferences: any) => {
    return new Promise<boolean>((resolve) => {
      const dialogId = openDialog({
        title,
        dialogContent: () => (
          <div className="flex items-center justify-center p-6">
            <div className="max-w-lg w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <FiAlertTriangle className="text-slate-900 w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Aún tienes cuentas sin cerrar
                </h2>
              </div>

              <p className="text-slate-800 mb-4">
                Se encontraron diferencias en los siguientes métodos de pago:
              </p>

              <ul className="space-y-2">
                {diferences.map((item) => (
                  <li
                    key={item.payment_method_id}
                    className="flex justify-between items-center bg-slate-700/30 border border-slate-600/40 rounded-lg p-3"
                  >
                    <span className="text-slate-900 font-medium">{item.name}</span>
                    <span className="text-slate-900 font-semibold">S/ {item.difference}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ),
        buttons: [
          {
            text: 'Continuar',
            type: 'confirm',
            onClick: () => {
              closeDialogWithData(dialogId, [])
              resolve(true)
            },
          },
          {
            text: 'Cancelar',
            type: 'cancel',
            onClick: () => {
              closeDialogWithData(dialogId, [])
              resolve(false)
            },
          },
        ],
      })
    })
  }
  const confirmDialog = (title: string, message: string) => {
    return new Promise<boolean>((resolve) => {
      const dialogId = openDialog({
        title,
        dialogContent: () => <div>{message}</div>,
        buttons: [
          {
            text: 'Continuar',
            type: 'confirm',
            onClick: () => {
              closeDialogWithData(dialogId, [])
              resolve(true)
            },
          },
          {
            text: 'Cancelar',
            type: 'cancel',
            onClick: () => {
              closeDialogWithData(dialogId, [])
              resolve(false)
            },
          },
        ],
      })
    })
  }
  function getDiferences(data) {
    return data.pm
      .filter((pmItem) => pmItem.difference !== 0)
      .map((pmItem) => {
        const match = data.watchData.find((w) => w.payment_method_id === pmItem.payment_method_id)
        return {
          payment_method_id: pmItem.payment_method_id,
          name: match ? match.name : null,
          difference: pmItem.difference || 0,
        }
      })
  }
  const handleCloseCashRegister = async () => {
    await offlineCache
      .syncOfflineData(executeFnc, Number(pointId), setOrderData, setSyncLoading, session_id)
      .then(async () => {
        const { oj_data: sessionLogOutData } = await executeFnc('fnc_pos_session_log_out', '', [
          session_id,
        ])
        const { oj_data: sessionData } = await executeFnc('fnc_pos_session', 's1', [session_id])

        let getData = () => ({})
        const dialogId = openDialog({
          title: 'Cerrando la caja registradora',
          dialogContent: () => (
            <FrmBaseDialog
              config={PosCloseCashConfig}
              initialValues={{
                watchData: sessionLogOutData.result_1,
                pm: sessionLogOutData.payment_methods,
                opening_note: sessionData[0]?.opening_note,
              }}
              setGetData={(fn: any) => (getData = fn)}
            />
          ),
          buttons: [
            {
              text: 'Cerrar caja registradora',
              type: 'confirm',
              onClick: async () => {
                const formData = getData()
                const rawData = {
                  session_id: session_id,
                  state: 'R',
                  stop_at: now().toPlainDateTime().toString(),
                  final_cash: 0,
                  closing_note: '',
                  ...formData,
                }
                const data = updatePmValues(rawData)

                let pass = await diferenceDialog('', getDiferences(data))
                if (!pass) return

                pass = await confirmDialog('Cerrar caja', 'Se eliminarán todas las órdenes')
                if (!pass) return
                // 🔄 Eliminar pedidos en memoria
                const dataInStore = await offlineCache.getOfflinePosOrders()
                for (let i = 0; i < dataInStore.length; i++) {
                  if (dataInStore[i].state === 'I' || dataInStore[i].state === 'Y') {
                    deleteOrder(dataInStore[i].order_id, true)
                    await offlineCache.markOrderAsDeleted(dataInStore[i].order_id)
                    setHandleChange(true)
                  }
                }

                if (!isOnline) {
                  const sessions = await offlineCache.getOfflinePosSessions()
                  const session = sessions.find((s: any) => s.point_id === pointId)
                  await offlineCache.updatePosSessionOffline({
                    ...data,
                    action: session?.action === 'i' ? 'i' : 'u',
                  })
                } else {
                  await executeFnc('fnc_pos_session', 'u', {
                    session_id: data.session_id,
                    state: 'R',
                    stop_at: data.stop_at,
                    final_cash: data.cash_count ?? 0,
                    closing_note: data.closing_note,
                    payment_methods: data.pm,
                    payment_methods_change: true,
                  })
                }

                // 🔄 Actualizar posPoints offline
                const posPoints = await offlineCache.getOfflinePosPoints()
                const posPoint = posPoints.find((p: any) => p.point_id === Number(pointId))
                if (posPoint) {
                  posPoint.session_id = null
                  await offlineCache.updatePosPointOffline(posPoint)
                }

                // 🔄 Actualizar sessions en localStorage
                const currentData = JSON.parse(localStorage.getItem('sessions') ?? '[]')
                const newSessions = currentData.map((s: any) =>
                  s.point_id === Number(pointId) ? { ...s, session_id: null } : s
                )
                localStorage.setItem('sessions', JSON.stringify(newSessions))

                // ✅ Remover de local_pos_open
                const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
                const filtered = localPosOpen.filter((p: any) => p.point_id !== Number(pointId))
                localStorage.setItem('local_pos_open', JSON.stringify(filtered))

                setSelectedOrder('')
                offlineCache.syncOfflineData(
                  executeFnc,
                  pointId,
                  setOrderData,
                  setSyncLoading,
                  session_id,
                  true
                )

                closeDialogWithData(dialogId, {})
                setScreen('products')
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
            {
              text: 'Entrada y salida de efectivo',
              type: 'cancel',
              onClick: async () => {
                handleCashInAndOut()
              },
            },
            {
              text: 'Venta diaria',
              type: 'cancel',
              onClick: async () => {
                const formData = getData()
                const rawData = {
                  session_id: session_id,
                  state: 'R',
                  stop_at: now().toPlainDateTime().toString(),
                  final_cash: 0,
                  closing_note: '',
                  ...formData,
                }
                const data = updatePmValues(rawData)

                const { oj_data } = await executeFnc('fnc_pos_session', 'u', {
                  session_id: data.session_id,
                  stop_at: data.stop_at,
                  final_cash: data.cash_count,
                  closing_note: data.closing_note,
                  payment_methods: data.pm,
                  payment_methods_change: true,
                })
                const { oj_data: rs } = await executeFnc('fnc_pos_session_report', '', [
                  oj_data.session_id,
                ])
                import('@/modules/invoicing/components/SalesReportPDF').then((module) => {
                  const SalesReportPDF = module.default

                  import('@react-pdf/renderer').then((pdfModule) => {
                    const { pdf } = pdfModule
                    pdf(SalesReportPDF({ data: { products: rs.result_1, control: rs.result_3 } }))
                      .toBlob()
                      .then((blob) => {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = 'detalle-ventas.pdf'
                        link.click()
                        URL.revokeObjectURL(url)
                      })
                  })
                })
              },
            },
          ],
        })
      })
  }

  const fnc_change_order = useCallback(
    (id_order: string) => {
      setScreen('products')
      saveCurrentOrder()
      setSelectedNavbarMenu('R')
      setSelectedOrder(id_order)
    },
    [setScreen, saveCurrentOrder, setSelectedNavbarMenu, setSelectedOrder]
  )
  const orderFiltered = useMemo(() => {
    return orderData.filter(
      (order) => order.state === TypeStateOrder.PAY || order.state === TypeStateOrder.IN_PROGRESS
    )
  }, [orderData])
  useEffect(() => {
    saveCurrentOrder()
  }, [orderData])

  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <div className="navbar-menu">
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] active"
            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenu === 'R' ? 'active' : ''
            }`}
            disabled={frmLoading}
            onClick={() => {
              if (screen === 'invoice') {
                if (
                  orderData.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  ).length === 0
                ) {
                  addNewOrder({
                    date: new Date(),
                    user_id: userData?.user_id,
                    point_id: Number(pointId),
                    session_id: session_id,
                    company_id: userData?.company_id,
                    partner_id: finalCustomer?.partner_id,
                    partner_name: finalCustomer?.partner_name,
                    lines: [],
                  })
                  return
                }
                setSelectedOrder(
                  orderData.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  )[0].order_id
                )
                setSelectedNavbarMenu('R')
                setScreen('products')
                return
              }
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
            disabled={frmLoading}
            onClick={() => {
              if (screen === 'invoice') {
                if (
                  orderData.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  ).length === 0
                ) {
                  setScreen('ticket')
                  addNewOrder()
                  setSelectedNavbarMenu('O')
                  return
                }
                setSelectedOrder(
                  orderData.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  )[0].order_id
                )
                setSelectedNavbarMenu('O')
                setScreen('ticket')
                return
              }
              saveCurrentOrder(true)
              setSelectedNavbarMenu('O')
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
            disabled={frmLoading}
            onClick={() => {
              addNewOrder({
                date: new Date(),
                user_id: userData?.user_id,
                point_id: Number(pointId),
                session_id: session_id,
                company_id: userData?.company_id,
                partner_id: finalCustomer?.partner_id,
                partner_name: finalCustomer?.partner_name,
                lines: [],
              })
              setSelectedNavbarMenu('R')
              setScreen('products')
            }}
          >
            <MdAddCircleOutline style={{ fontSize: '24px' }} />
          </button>
          {/* 
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            onClick={() => {
              setSelectedItem(null)
              saveCurrentOrder()
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
            {orderFiltered?.map((order, index) => (
              <button
                key={order?.order_id}
                className={`btn2 btn2-secondary btn2-lg lh-lg w-auto min-h-[48px] ${selectedOrder === order.order_id ? 'btn2-light active' : ''} `}
                disabled={frmLoading}
                onClick={() => {
                  if (selectedOrder !== order.order_id || screen === 'ticket') {
                    fnc_change_order(order.order_id)
                  }
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
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
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
          {searchProduct && (
            <button
              type="button"
              onClick={() => setSearchProduct('')}
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

        {/* 
        <button
          className="btn2 btn2-light lh-lg w-auto min-h-[48px]"
          // style={{ paddingLeft: '2px', paddingRight: '2px' }}
        >
          <FaBarcode style={{ fontSize: '24px' }} />
        </button>
        */}

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
