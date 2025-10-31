import { useEffect, useCallback, useMemo, useState } from 'react'
import PosModalPaymentListConfig from '../views/modal-payment-list/config'
// import { WiCloudUp } from 'react-icons/wi'
// import { IoMdArrowDropdown } from 'react-icons/io'
import useAppStore from '@/store/app/appStore'
import { useNavigate } from 'react-router-dom'
import PosCloseCashConfig from '../views/modal-close-cash-register/config'
import { FrmBaseDialog } from '@/shared/components/core'
import PosModalCashinAndOut from '../views/modal-cash-in-and-out/config'
import { ActionTypeEnum, ViewTypeEnum } from '@/shared/shared.types'
import ModalButtons from './modal/components/ModalButtons'
import { offlineCache, Product } from '@/lib/offlineCache'
import { usePWA } from '@/hooks/usePWA'
import { now } from '@/shared/utils/dateUtils'
import { Type_pos_payment_origin, TypePayment, TypeStateOrder } from '../types'
import { FiAlertTriangle } from 'react-icons/fi'
import { CustomToast } from '@/components/toast/CustomToast'
import { usePosActionsPg } from '@/modules/pos/hooks/usePosActionsPg'
import { InputWithKeyboard } from '@/shared/ui/inputs/InputWithKeyboard'
import { Operation } from '../context/CalculatorContext'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'
import { codePayment } from '@/shared/helpers/helpers'

export default function Header({ pointId }: { pointId: string }) {
  const {
    addNewOrderPg,
    orderDataPg,
    selectedOrderPg,
    setSelectedOrderPg,
    setScreenPg,
    screenPg,
    openDialog,
    closeDialogWithData,
    searchProductPg,
    setSearchProductPg,
    selectedNavbarMenuPg,
    setSelectedNavbarMenuPg,
    setSelectedItemPg,
    finalCustomerPg,
    executeFnc,
    frmLoading,
    setOrderDataPg,
    setSyncLoading,
    deleteOrderPg,
    setHandleChangePg,
    changePricePg,
    setChangePricePg,
    setCloseSession,
    setOperationPg,
    selectedItemPg,
    operationPg,
    backToProductsPg,
    setPayment,
  } = useAppStore()
  const [cart, setCart] = useState<Product[]>([])
  const { saveCurrentOrder } = usePosActionsPg()
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
      const order = orderDataPg.filter((i: any) => i.order_id === selectedOrderPg)
      const selected = order?.[0]?.lines?.filter((i: any) => i.selected)

      setSelectedItemPg(selected?.[0]?.line_id)
    }
  }, [saveCurrentOrder])
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  useEffect(() => {
    const pos_Status = orderDataPg?.find((item) => item?.order_id === selectedOrderPg)?.pos_status
    if (pos_Status === 'P' && backToProductsPg === false) setScreenPg('payment')

    setCart(
      orderDataPg
        ?.find((item) => item.order_id === selectedOrderPg)
        ?.lines?.filter((item: any) => item.action !== ActionTypeEnum.DELETE) || []
    )
  }, [orderDataPg, selectedOrderPg])

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
            setScreenPg('products')
            navigate('/points-of-sale-pg')
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

  const handlePaymentsList = async () => {
    const dialogId = openDialog({
      title: 'Lista de pagos',
      dialogContent: () => (
        <FrmBaseDialog
          config={PosModalPaymentListConfig}
          viewType={ViewTypeEnum.LIBRE}
          initialValues={{ session_id: session_id }}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const handleCashInAndOut = async () => {
    const paymentMethods = await offlineCache.getOfflinePaymentMethods()
    const localCustomers = await offlineCache.getOfflineContacts()
    let getData = () => ({})
    const dialogId = openDialog({
      title: '',
      dialogContent: () => (
        <FrmBaseDialog
          config={PosModalCashinAndOut}
          initialValues={{
            paymentMethods,
            customers: localCustomers,
            type: TypePayment.OUTPUT,
          }}
          viewType={ViewTypeEnum.LIBRE}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const data = {
              amount: formData.amount,
              reason: formData.reason,
              type: formData.type,
              payment_method_id: formData.payment_method_id,
              date: now().toPlainDateTime().toString(),
              origin: Type_pos_payment_origin.DIRECT_PAYMENT,
              currency_id: 1,
              state: 'R',
              company_id: userData?.company_id,
              user_id: userData?.user_id,
              session_id: session_id,
            }
            let errors = []
            if (!data.amount) {
              errors.push({ message: 'El campo amount es requerido' })
            }
            if (!data.reason) errors.push({ message: 'El campo motivo es requerido' })
            if (!data.payment_method_id) errors.push({ message: 'Seleccione un metodo de pago' })
            if (errors.length > 0) {
              CustomToast({
                title: 'Errores encontrados',
                items: errors,
                type: 'error',
              })
              return
            }
            setPayment({
              order_date: now().toPlainDateTime().toString(),
              receipt_number: codePayment(),
              point_id: formData.point_id,
              payments: [
                { payment_method_name: formData.payment_method_name, amount: formData.amount },
              ],
              amount_total: formData.amount,
              amount_residual: '',
              type: TypePayment.INPUT,
              origin: Type_pos_payment_origin.DIRECT_PAYMENT,
            })
            if (!isOnline) {
              await offlineCache.saveOfflinePayment(data)
            } else {
              const { oj_data } = await executeFnc('fnc_pos_payment', 'i', data)
            }
            CustomToast({
              title: 'Exito',
              description: `¡Se creo el pago de S/ ${data.amount} correctamente!`,
              type: 'success',
            })
            setScreenPg('invoice')
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
        {
          text: 'Lista de pagos',
          type: 'cancel',
          onClick: () => {
            handlePaymentsList()
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
                {diferences?.map((item) => (
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
    return data?.pm
      ?.filter((pmItem) => pmItem.difference !== 0)
      ?.map((pmItem) => {
        const match = data.watchData.find((w) => w.payment_method_id === pmItem.payment_method_id)
        return {
          payment_method_id: pmItem.payment_method_id,
          name: match ? match.name : null,
          difference: pmItem.difference || 0,
        }
      })
  }
  type Payment = {
    origin: string
    amount: number
    type: string
    date: string
  }
  function generateDailyReport(data: Payment[]) {
    const map = new Map<
      string,
      { origin: string; type: string; description: string; total: number }
    >()

    const getDescription = (origin: string, type: string) => {
      if (origin === Type_pos_payment_origin.DOCUMENT) return 'pagos por ventas'
      if (origin === Type_pos_payment_origin.DIRECT_PAYMENT && type === 'I')
        return 'ingresos diversos'
      if (origin === Type_pos_payment_origin.DIRECT_PAYMENT && type === 'O')
        return 'egresos diversos'
      if (origin === Type_pos_payment_origin.PAY_DEBT) return 'pagos de deudas'
      return 'otros'
    }

    data.forEach((item) => {
      const originKey = Object.values(Type_pos_payment_origin).find((o) =>
        item.origin.startsWith(o)
      )
      if (!originKey) return

      const key =
        originKey === Type_pos_payment_origin.DOCUMENT ||
        originKey === Type_pos_payment_origin.PAY_DEBT
          ? originKey
          : `${originKey}-${item.type}`

      const description = getDescription(originKey, item.type)

      if (!map.has(key)) {
        map.set(key, { origin: originKey, type: item.type, description, total: 0 })
      }

      map.get(key)!.total += item.amount
    })

    const requiredCases = [
      { origin: Type_pos_payment_origin.DOCUMENT, type: 'I' },
      { origin: Type_pos_payment_origin.DIRECT_PAYMENT, type: 'I' },
      { origin: Type_pos_payment_origin.DIRECT_PAYMENT, type: 'O' },
      { origin: Type_pos_payment_origin.PAY_DEBT, type: 'I' },
    ]

    for (const { origin, type } of requiredCases) {
      const key =
        origin === Type_pos_payment_origin.DOCUMENT || origin === Type_pos_payment_origin.PAY_DEBT
          ? origin
          : `${origin}-${type}`

      if (!map.has(key)) {
        map.set(key, {
          origin,
          type,
          description: getDescription(origin, type),
          total: 0,
        })
      }
    }

    const order = [
      Type_pos_payment_origin.DOCUMENT,
      `${Type_pos_payment_origin.DIRECT_PAYMENT}-I`,
      `${Type_pos_payment_origin.DIRECT_PAYMENT}-O`,
      Type_pos_payment_origin.PAY_DEBT,
    ]

    const rows = order.map((key) => map.get(key)).filter((v): v is NonNullable<typeof v> => !!v)

    const totalGeneral = rows
      .filter((r) => !(r.origin === Type_pos_payment_origin.DIRECT_PAYMENT && r.type === 'O'))
      .reduce((acc, cur) => acc + cur.total, 0)

    return { rows, totalGeneral }
  }

  const handleCloseCashRegister = async () => {
    await offlineCache
      .syncOfflineData(executeFnc, Number(pointId), setOrderDataPg, setSyncLoading, session_id)
      .then(async () => {
        const { oj_data: sessionLogOutData } = await executeFnc('fnc_pos_session_log_out', '', [
          session_id,
        ])
        const { oj_data: sessionData } = await executeFnc('fnc_pos_session', 's1', [session_id])
        const { oj_data: payments } = await executeFnc('fnc_pos_payment', 's', [
          ['0', 'fequal', 'report_session_id', session_id],

          [
            '0',
            'multi_filter_in',
            [
              { key_db: 'origin', value: Type_pos_payment_origin.DOCUMENT },
              { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
              { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
            ],
          ],
        ])
        console.log('payments', payments)
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

                //let pass = await diferenceDialog('', getDiferences(data))
                // if (!pass) return

                //   pass = await confirmDialog('Cerrar caja', 'Se eliminarán todas las órdenes')
                //if (!pass) return
                setCloseSession(true)
                const dataInStore = await offlineCache.getOfflinePosOrders()
                for (let i = 0; i < dataInStore.length; i++) {
                  if (dataInStore[i].state === 'I' || dataInStore[i].state === 'Y') {
                    deleteOrderPg(dataInStore[i].order_id, true)
                    await offlineCache.markOrderAsDeleted(dataInStore[i].order_id)
                    setHandleChangePg(true)
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
                const filtered = localPosOpen?.filter((p: any) => p.point_id !== Number(pointId))
                localStorage.setItem('local_pos_open', JSON.stringify(filtered))

                setSelectedOrderPg('')
                offlineCache.syncOfflineData(
                  executeFnc,
                  pointId,
                  setOrderDataPg,
                  setSyncLoading,
                  session_id,
                  true
                )

                closeDialogWithData(dialogId, {})
                setScreenPg('products')
                setCloseSession(false)
                navigate('/points-of-sale-pg')
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
                const today = new Date()
                const formattedDate = today.toLocaleDateString('es-PE')
                const filter = [0, 'fbetween', 'date', formattedDate, formattedDate]
                const { oj_data: paymentData } = await executeFnc('fnc_pos_payment', 's', [
                  [
                    0,
                    'multi_filter_in',
                    [
                      { key_db: 'origin', value: Type_pos_payment_origin.DOCUMENT },
                      { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
                      { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
                    ],
                  ],
                  ,
                  filter,
                ])
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
                import('@/modules/invoicing/components/paymentReport').then((module) => {
                  const SalesReportPDF = module.default

                  import('@react-pdf/renderer').then((pdfModule) => {
                    const { pdf } = pdfModule
                    pdf(
                      SalesReportPDF({
                        data: { ...generateDailyReport(paymentData), control: rs.result_3 },
                      })
                    )
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
      setScreenPg('products')
      saveCurrentOrder()
      setSelectedNavbarMenuPg('R')
      setSelectedOrderPg(id_order)
    },
    [setScreenPg, saveCurrentOrder, setSelectedNavbarMenuPg, setSelectedOrderPg]
  )
  const orderFiltered = useMemo(() => {
    return orderDataPg.filter(
      (order) => order.state === TypeStateOrder.PAY || order.state === TypeStateOrder.IN_PROGRESS
    )
  }, [orderDataPg])
  useEffect(() => {
    saveCurrentOrder()
  }, [orderDataPg])

  const openCalculatorModal = ({ operation }: { operation: Operation }) => {
    const dialogId = openDialog({
      title: cart.find((c) => c.line_id === selectedItemPg)?.name || '',
      dialogContent: () => (
        <CalculatorPanel
          product={cart.find((c) => c.line_id === selectedItemPg)}
          selectedField={operation}
          dialogId={dialogId}
        />
      ),
      buttons: [
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  return (
    <header className="pos-header">
      <div className="pos-header-left">
        <div className="navbar-menu">
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] active"
            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenuPg === 'R' ? 'active' : ''
            }`}
            disabled={frmLoading}
            onClick={() => {
              if (screenPg === 'invoice') {
                if (
                  orderDataPg.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  ).length === 0
                ) {
                  addNewOrderPg({
                    date: new Date(),
                    user_id: userData?.user_id,
                    point_id: Number(pointId),
                    session_id: session_id,
                    company_id: userData?.company_id,
                    partner_id: finalCustomerPg?.partner_id,
                    partner_name: finalCustomerPg?.partner_name,
                    lines: [],
                  })
                  return
                }
                setSelectedOrderPg(
                  orderDataPg.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  )[0].order_id
                )
                setSelectedNavbarMenuPg('R')
                setScreenPg('products')
                return
              }
              setSelectedNavbarMenuPg('R')
              setScreenPg('products')
            }}
          >
            Registrar
          </button>
          <button
            // className="btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px]"
            // onClick={() => setScreen('ticket')}

            className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
              selectedNavbarMenuPg === 'O' ? 'active' : ''
            }`}
            disabled={frmLoading}
            onClick={() => {
              if (screenPg === 'invoice') {
                if (
                  orderDataPg.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  ).length < 5
                ) {
                  setScreenPg('ticket')
                  // addNewOrderPg()
                  setSelectedNavbarMenuPg('O')
                  return
                }
                setSelectedOrderPg(
                  orderDataPg.filter(
                    (o) => o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                  )[0].order_id
                )
                setSelectedNavbarMenuPg('O')
                setScreenPg('ticket')
                return
              }
              saveCurrentOrder(true)
              setSelectedNavbarMenuPg('O')
              setScreenPg('ticket')
            }}
          >
            Órdenes
          </button>
        </div>

        {/** <div className="navbar-orders">
          <button
            // className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            className="btn2 btn2-secondary lh-lg min-h-[48px]"
            disabled={frmLoading}
            onClick={() => {
              addNewOrderPg({
                date: new Date(),
                user_id: userData?.user_id,
                point_id: Number(pointId),
                session_id: session_id,
                company_id: userData?.company_id,
                partner_id: finalCustomerPg?.partner_id,
                partner_name: finalCustomerPg?.partner_name,
                lines: [],
              })
              setSelectedNavbarMenuPg('R')
              setScreenPg('products')
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

         
          <button
            className="btn2 btn2-secondary lh-lg w-auto min-h-[48px]"
            style={{ paddingLeft: '2px', paddingRight: '2px' }}
          >
            <IoMdArrowDropdown style={{ fontSize: '24px' }} />
          </button>
        

          
        </div> 
        <div className="pos-orders">
          {orderFiltered?.map((order, index) => (
            <button
              key={order?.order_id}
              className={`btn2-carnes btn2-secondary btn2-lg lh-lg min-h-[48px] ${selectedOrderPg === order.order_id ? 'btn2-light active' : ''} `}
              disabled={frmLoading}
              onClick={() => {
                if (selectedOrderPg !== order.order_id || screenPg === 'ticket') {
                  if (
                    orderDataPg.filter(
                      (o) =>
                        o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                    ).length < 4
                  ) {
                    addNewOrderPg()
                    return
                  }
                  fnc_change_order(order.order_id)
                }
              }}
            >
              {order.partner_name}
              {getTotalPriceByOrderPg(order.order_id) === 0
                ? null
                : ' - ' + getTotalPriceByOrderPg(order.order_id)}
            </button>
          ))}
        </div>*/}
      </div>

      <div className="pos-header-right">
        {/**
         * <div className="flex-fill">
          <div className="flex numpad">
            <button
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4  ${operationPg === Operation.QUANTITY ? 'active' : ''}`}
              onClick={() => {
                if (selectedItemPg) {
                  setOperationPg(Operation.QUANTITY)
                  openCalculatorModal({ operation: Operation.QUANTITY })
                }
              }}
              // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
            >
              <span>Cantidad</span>
            </button>

            <button
              className={`numpad-button btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4 ${operationPg === Operation.PRICE ? 'active' : ''}`}
              onClick={() => {
                if (selectedItemPg) {
                  setOperationPg(Operation.PRICE)
                  openCalculatorModal({ operation: Operation.PRICE })
                }
              }}
              // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
            >
              <span>Precio</span>
            </button>

            <button
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4  ${operationPg === Operation.TARA_QUANTITY ? 'active' : ''}`}
              onClick={() => {
                if (selectedItemPg) {
                  setOperationPg(Operation.TARA_QUANTITY)
                  openCalculatorModal({ operation: Operation.TARA_QUANTITY })
                }
              }}
              // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
            >
              <span>TARA cantidad</span>
            </button>

            <button
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4  ${operationPg === Operation.TARA_VALUE ? 'active' : ''}`}
              onClick={() => {
                if (selectedItemPg) {
                  setOperationPg(Operation.TARA_VALUE)
                  openCalculatorModal({ operation: Operation.TARA_VALUE })
                }
              }}
              // style={{ flex: 1, height: '48px', fontSize: '13px', maxWidth: '466px' }}
            >
              <span>TARA peso</span>
            </button>
          </div>
        </div>
         * 
         */}
        {isOnline && screenPg === 'products' && (
          <div>
            <button
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4 ${
                changePricePg ? 'active' : ''
              }`}
              disabled={frmLoading}
              onClick={() => {
                setOperationPg(Operation.CHANGE_PRICE)
                setChangePricePg(!changePricePg)
                //openCalculatorModal({ operation: Operation.CHANGE_PRICE })
              }}
              style={{ paddingLeft: '2px', paddingRight: '2px' }}
            >
              Cambiar precio
            </button>
          </div>
        )}
        <div
          className={`relative  w-[20rem] pl-5 py-2 border rounded-md bg-white text-[16px] ${screenPg === 'ticket' || screenPg === 'payment' || screenPg === 'invoice' ? 'hidden' : ''}`}
        >
          <InputWithKeyboard
            type="text"
            className=""
            placeholder="Buscar productos ..."
            value={searchProductPg}
            onChange={(e) => setSearchProductPg(e.target.value)}
            onValueChange={(value) => setSearchProductPg(value)} // Para el teclado virtual
            aria-label="Buscar productos"
            enableVirtualKeyboard={true}

            // useNumericKeyboard={true} // Opcional
            // isInsideModal={true} // Opcional
          />
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
