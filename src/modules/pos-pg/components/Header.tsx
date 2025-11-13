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
import { now, setCurrentTimeIfToday } from '@/shared/utils/dateUtils'
import { Type_pos_payment_origin, TypePayment, TypeStateOrder } from '../types'
import { FiAlertTriangle } from 'react-icons/fi'
import { CustomToast } from '@/components/toast/CustomToast'
import { usePosActionsPg } from '@/modules/pos/hooks/usePosActionsPg'
import { InputWithKeyboard } from '@/shared/ui/inputs/InputWithKeyboard'
import { Operation } from '../context/CalculatorContext'
import CalculatorPanel from './modal/components/ModalCalculatorPanel'
import { codePayment, summarizeTransactions } from '@/shared/helpers/helpers'
import { Divider } from '@mui/material'

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
    containersPg,
    weightValuePg,
    getProductPricePg,
    setPrevWeight,
    setProductQuantityInOrderPg,
    setTemporaryQuantityPg,
    temporaryValuesPg,
    setTemporaryTaraValuePg,
    setTemporaryTaraQuantityPg,
    convertTemporaryToReturnPg,
    connectedPg,
    connectToDevicePg,
    dateInvoice,
  } = useAppStore()

  const [selectedTaraValue, setSelectedTaraValue] = useState(null)
  const [selectedTaraQuantity, setSelectedTaraQuantity] = useState(null)
  useEffect(() => {
    if (!temporaryValuesPg) {
      setSelectedTaraValue(null)
      setSelectedTaraQuantity(null)
    }
  }, [temporaryValuesPg])
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
              date: setCurrentTimeIfToday(dateInvoice),
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
              order_date: setCurrentTimeIfToday(dateInvoice),
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
  function buildFinalCashData(formData: any, session_id: number) {
    const baseData = {
      session_id,
      state: 'R',
      stop_at: now().toPlainDateTime().toString(),
      final_cash: parseFloat(formData.cash_count || 0),
      closing_note: formData.closing_note || '',
      ...formData,
    }

    const dataWithPm = updatePmValues(baseData)
    return dataWithPm
  }
  function getPaymentMethods(payments = [], sessionData = {}) {
    const safePayments = Array.isArray(payments) ? payments : []
    const initialCash = Number(sessionData?.initial_cash || 0)

    if (safePayments.length === 0) {
      return initialCash > 0
        ? [
            {
              payment_method_id: 'cash',
              name: 'Efectivo',
              amount: initialCash,
              counted: 0,
              difference: initialCash,
              is_cash: true,
            },
          ]
        : []
    }

    const grouped = safePayments.reduce((acc, p) => {
      if (!p || !p.payment_method_id) return acc

      const id = p.payment_method_id
      const name = p.payment_method_name || 'Desconocido'
      if (!acc[id]) {
        acc[id] = {
          payment_method_id: id,
          name,
          total: 0,
          is_cash: name.toLowerCase() === 'efectivo',
        }
      }

      const amount = Number(p.amount) || 0
      acc[id].total += p.type === 'I' ? amount : -amount
      return acc
    }, {})

    return Object.values(grouped).map((pm) => {
      const amount = pm.is_cash ? initialCash + pm.total : pm.total
      return {
        payment_method_id: pm.payment_method_id,
        name: pm.name,
        amount,
        counted: 0,
        difference: amount,
        is_cash: pm.is_cash,
      }
    })
  }

  function updatePmValues(data: any) {
    if (!data.pm || !Array.isArray(data.pm)) return data

    data.pm = data.pm.map((item: any) => {
      // Si es efectivo, toma el campo cash_count
      const fieldName = item.is_cash ? 'cash_count' : `pm_${item.payment_method_id}`
      const counted = parseFloat(data[fieldName] || 0)

      // Calcula la diferencia
      const difference = parseFloat((item.amount - counted).toFixed(2))

      return {
        ...item,
        counted,
        difference,
      }
    })

    // Recalcula el total final en base al efectivo
    const finalCash = data.pm.find((pm: any) => pm.is_cash)?.counted || 0

    return {
      ...data,
      final_cash: finalCash,
      payment_methods: addPositions(data.pm),
      payment_methods_change: true,
    }
  }
  function getFlowByMethod(data, paymentMethodId) {
    const movimientos = data?.filter(
      (m) => m.origin === 'P' && m.payment_method_id === paymentMethodId
    )

    let total = 0
    const detalles = []

    movimientos?.forEach((m) => {
      const value = m.type === 'O' ? -Math.abs(m.amount) : Math.abs(m.amount)

      total += value

      detalles.push({
        detail: m.detail,
        amount: value,
        sign: value > 0 ? '+' : '-',
      })
    })

    const sign = total > 0 ? '+' : total < 0 ? '-' : ''

    return {
      payment_method_id: paymentMethodId,
      total,
      sign,
      detalles,
    }
  }

  function getFlowByOriginAndMethod(data, origin, paymentMethodId) {
    const movimientos = data?.filter(
      (m) => m.origin === origin && m.payment_method_id === paymentMethodId
    )

    let total = 0
    const detalles = []

    movimientos?.forEach((m) => {
      total += m.amount

      detalles.push({
        detail: m.detail,
        amount: m.amount,
        sign: m.amount > 0 ? '+' : '-',
      })
    })

    return {
      origin,
      payment_method_id: paymentMethodId,
      total,
      detalles,
    }
  }

  const diferenceDialog = (title: string, diferences: any) => {
    return new Promise<boolean>((resolve) => {
      if (diferences.length === 0) {
        resolve(true)
        return
      }
      const dialogId = openDialog({
        title,
        dialogContent: () => (
          <div className="flex items-center justify-center p-6">
            <div className="max-w-lg w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <FiAlertTriangle className="text-slate-900 w-6 h-6" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Alerta</h2>
              </div>

              <p className="text-slate-800 mb-4">
                El dinero contado no coincide con el esperado. ¿Desea registrar esta diferencia en
                los libros?
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
  function getDiferences(data: any) {
    if (!data) return []
    const pmList = Array.isArray(data.pm)
      ? data.pm
      : Array.isArray(data.payment_methods)
        ? data.payment_methods
        : []
    if (pmList.length === 0) return []

    const watchList = Array.isArray(data.watchData)
      ? data.watchData
      : Array.isArray(data.payment_methods)
        ? data.payment_methods
        : []

    return pmList
      .filter((pmItem: any) => Number(pmItem.difference ?? 0) !== 0)
      .map((pmItem: any) => {
        const match =
          watchList.find(
            (w: any) =>
              String(w.payment_method_id) === String(pmItem.payment_method_id) ||
              String(w.payment_method_name) === String(pmItem.name)
          ) || null

        return {
          payment_method_id: pmItem.payment_method_id,
          name: match?.payment_method_name,
          difference: Number(pmItem.difference ?? 0),
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
  function addPositions(data) {
    return data
      .slice()
      .sort((a, b) => {
        if (a.is_cash && !b.is_cash) return -1
        if (!a.is_cash && b.is_cash) return 1
        return 0
      })
      .map((item, index) => ({
        ...item,
        position: index + 1,
      }))
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
        let getData = () => ({})
        const dialogId = openDialog({
          title: 'Cerrando la caja registradora',
          dialogContent: () => (
            <FrmBaseDialog
              config={PosCloseCashConfig}
              initialValues={{
                watchData: payments,
                pm: getPaymentMethods(payments, sessionData[0]),
                opening_note: sessionData[0]?.opening_note,
                openingAmount: sessionData[0]?.initial_cash,
              }}
              viewType={ViewTypeEnum.LIBRE}
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
                  session_id,
                  state: 'R',
                  stop_at: now().toPlainDateTime().toString(),
                  final_cash: formData?.cash_count ?? 0,
                  closing_note: formData?.closing_note,
                  ...formData,
                }
                const data = updatePmValues(formData, session_id)

                let pass = await diferenceDialog('', getDiferences(data))
                if (!pass) return
                const newPaymentsMetho = data.pm.map((d) => {
                  return {
                    ...d,
                    amount_in_out: getFlowByMethod(data.watchData, d.payment_method_id).total,
                    amount_sales: getFlowByOriginAndMethod(data.watchData, 'D', d.payment_method_id)
                      .total,
                    amount_debt: getFlowByOriginAndMethod(data.watchData, 'G', d.payment_method_id)
                      .total,
                  }
                })
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
                    session_id: session_id,
                    state: 'R',
                    stop_at: now().toPlainDateTime().toString(),
                    final_cash: data.cash_count ?? 0,
                    closing_note: formData.closing_note || '',
                    payment_methods: addPositions(newPaymentsMetho),
                    payment_methods_change: true,
                  })
                }

                const posPoints = await offlineCache.getOfflinePosPoints()
                const posPoint = posPoints.find((p: any) => p.point_id === Number(pointId))
                if (posPoint) {
                  posPoint.session_id = null
                  await offlineCache.updatePosPointOffline(posPoint)
                }

                const currentData = JSON.parse(localStorage.getItem('sessions') ?? '[]')
                const newSessions = currentData.map((s: any) =>
                  s.point_id === Number(pointId) ? { ...s, session_id: null } : s
                )
                localStorage.setItem('sessions', JSON.stringify(newSessions))

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
            // {
            //   text: 'Entrada y salida de efectivo',
            //   type: 'cancel',
            //   onClick: async () => {
            //     handleCashInAndOut()
            //   },
            // },
            {
              text: 'Reporte de sesión',
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

                const newPaymentsMethods = data.pm.map((d) => {
                  return {
                    ...d,
                    payment_method_id: d.payment_method_id,
                    amount_in_out: getFlowByMethod(data.watchData, d.payment_method_id).total,
                    amount_sales: getFlowByOriginAndMethod(data.watchData, 'D', d.payment_method_id)
                      .total,
                    amount_debt: getFlowByOriginAndMethod(data.watchData, 'G', d.payment_method_id)
                      .total,
                  }
                })

                const { oj_data } = await executeFnc('fnc_pos_session', 'u', {
                  session_id: data.session_id,
                  closing_note: formData.closing_note || '',
                  payment_methods: addPositions(newPaymentsMethods),
                  payment_methods_change: true,
                })
                const { oj_data: s_payment_method } = await executeFnc(
                  'fnc_pos_session',
                  's_payment_method',
                  [oj_data.session_id]
                )
                const { oj_data: paymentData } = await executeFnc('fnc_pos_payment', 's', [
                  ['0', 'fequal', 'report_session_id', session_id],
                  [
                    0,
                    'multi_filter_in',
                    [
                      { key_db: 'origin', value: Type_pos_payment_origin.DOCUMENT },
                      { key_db: 'origin', value: Type_pos_payment_origin.DIRECT_PAYMENT },
                      { key_db: 'origin', value: Type_pos_payment_origin.PAY_DEBT },
                    ],
                  ],
                ])
                const { oj_data: session_data } = await executeFnc('fnc_pos_session', 's1', [
                  session_id,
                ])
                function splitByOriginAndType(data, origin) {
                  const filtered = data.filter((m) => m.origin === origin)

                  return {
                    in: filtered.filter((m) => m.type === 'I'),
                    out: filtered.filter((m) => m.type === 'O'),
                  }
                }

                /* const { oj_data: rs } = await executeFnc('fnc_pos_session_report', '', [
                  oj_data.session_id,
                ])*/

                import('@/modules/invoicing/components/CashSessionReport').then((module) => {
                  const SalesReportPDF = module.default

                  import('@react-pdf/renderer').then((pdfModule) => {
                    const { pdf } = pdfModule
                    pdf(
                      SalesReportPDF({
                        report: {
                          ...s_payment_method,
                          session_name: session_data[0].name,
                          state: session_data[0].state,
                          pos_name: session_data[0].point_name,
                          user_name: session_data[0].user_name,
                          start_at: session_data[0].start_at,
                          stop_at: session_data[0].stop_at,
                          final_cash: session_data[0].final_cash,
                        },
                        in_out: splitByOriginAndType(paymentData, 'P'),
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
    const title = () => {
      switch (operation) {
        case Operation.PRICE:
          return 'Ingrese precio'
        case Operation.QUANTITY:
          return 'Ingrese cantidad'
        case Operation.TARA_VALUE:
          return 'Ingrese tara'
        default:
          return ''
      }
    }
    const dialogId = openDialog({
      title: title(),
      dialogContent: () => (
        <CalculatorPanel
          product={temporaryValuesPg}
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
    <header className="pos-header-pg">
      {!connectedPg && screenPg === 'products' && (
        <div className="w-full">
          <button
            className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white w-100"
            style={{
              backgroundColor: connectedPg ? '#059669' : '#D63515',
              borderColor: connectedPg ? '#059669' : '#D63515',
              height: '80px',
              fontSize: '13px',
            }}
            onClick={() => connectToDevicePg()}
            disabled={connectedPg}
          >
            <span>{connectedPg ? 'CONECTADO' : 'CONECTAR BALANZA'}</span>
          </button>
        </div>
      )}
      {/** <div className="pos-header-top-pg">
        <div className="pos-header-left-header-pg">
          <div className="navbar-menu">
            <button
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
                selectedNavbarMenuPg === 'R' ? 'active' : ''
              }`}
              disabled={frmLoading}
              onClick={() => {
                if (screenPg === 'invoice') {
                  if (
                    orderDataPg.filter(
                      (o) =>
                        o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
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
                      (o) =>
                        o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
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
              className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] ${
                selectedNavbarMenuPg === 'O' ? 'active' : ''
              }`}
              disabled={frmLoading}
              onClick={() => {
                if (screenPg === 'invoice') {
                  if (
                    orderDataPg.filter(
                      (o) =>
                        o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
                    ).length < 5
                  ) {
                    setScreenPg('ticket')
                    // addNewOrderPg()
                    setSelectedNavbarMenuPg('O')
                    return
                  }
                  setSelectedOrderPg(
                    orderDataPg.filter(
                      (o) =>
                        o.state === TypeStateOrder.IN_PROGRESS || o.state === TypeStateOrder.PAY
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
        </div>

        <div className="pos-header-right-header-pg">
          {isOnline && screenPg === 'products' && (
            <div>
              <button
                className={`btn2 btn2-light btn2-lg lh-lg w-auto min-h-[48px] mr-4 px-4 ${
                  changePricePg ? 'active' : ''
                }`}
                disabled={frmLoading}
                onClick={() => {
                  setOperationPg(Operation.CHANGE_PRICE)
                  setChangePricePg(!changePricePg)
                }}
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
            />
          </div>

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
        </div>
      </div> */}

      {/* <div className="pos-header-bottom-pg flex grow gap-1 items-center"> */}
      {screenPg === 'products' && (
        <div className="pos-header-bottom-pg flex grow gap-4 !p-0">
          <div className="grid grid-cols-4 gap-1 h-[140px]">
            <div className="grid-item-tara-pg col-span-2 w-full">
              <button
                className={`btn2 w-full h-full ${selectedTaraValue === 0 && 'border-1 border-red-600 shadow-[0_0_18px_rgba(250,21,21)]  rounded-md'}`}
                style={{ backgroundColor: '#482050', color: 'white' }}
                onClick={() => {
                  setSelectedTaraValue(0)
                  setOperationPg(Operation.TARA_VALUE)
                  openCalculatorModal({ operation: Operation.TARA_VALUE })
                  setChangePricePg(false)
                }}
              >
                TARA MANUAL
              </button>
            </div>

            {containersPg.map((value) => (
              <div
                className={`grid-item-tara-pg ${selectedTaraValue === value.container_id && 'border-1 border-red-600 shadow-[0_0_18px_rgba(250,21,21)]  rounded-md'}`}
              >
                <button
                  key={value.weight}
                  className="btn2 text-[24px] w-full h-full"
                  style={{ backgroundColor: '#482050', color: 'white' }}
                  onClick={() => {
                    setSelectedTaraValue(value.container_id)
                    setTemporaryTaraValuePg(value.weight)
                  }}
                >
                  {value.name}
                </button>
              </div>
            ))}
          </div>

          {/*
        <div className="flex-fill max-w-[200px]">

          <div className="mt-2 flex flex-wrap gap-2 numpad">

            {containersPg.map((value) => (
              <button
                key={value.weight}
                className="numpad-button btn2 btn2-white lh-lg text-[14px]"
                style={{ flex: '1 0 60px', height: '48px' }}
                onClick={() => {
                  setTemporaryTaraValuePg(value.weight)
                }}
              >
                {value.name}
              </button>
            ))}

            <button
              className="numpad-button btn2 btn2-secondary lh-lg text-[14px]"
              style={{ height: '48px' }}
              onClick={() => {
                setOperationPg(Operation.TARA_VALUE)
                openCalculatorModal({ operation: Operation.TARA_VALUE })
                setChangePricePg(false)
              }}
            >
              TARA MANUAL
            </button>

            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`ghost-${index}`}
                className="shrink-0"
                style={{ flex: '1 0 60px', height: 0 }}
              />
            ))}

          </div>
        </div>
        */}

          {/* <div> */}

          <div className="grid grid-cols-3 gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                className={`grid-item-tara-pg ${selectedTaraQuantity === n && 'border-1 border-red-600 shadow-[0_0_18px_rgba(250,21,21)]  rounded-md'}`}
                key={n}
              >
                <button
                  className="btn2 text-[24px] w-full h-full"
                  style={{ backgroundColor: '#482050', color: 'white' }}
                  onClick={() => {
                    setSelectedTaraQuantity(n)
                    setTemporaryTaraQuantityPg(n)
                  }}
                >
                  {n}
                </button>
              </div>
            ))}
          </div>

          {/*
          <div className="pads">
            <div className="subpads">
              <div className="grid-container">
                {[0, 1, 2].map((n) => (
                  <div className="grid-item-header-pg" key={n}>
                    <button
                      className="numpad-button btn2 fs-3 lh-lg w-full h-full"
                      onClick={() => {
                        setTemporaryTaraQuantityPg(n)
                      }}
                    >
                      {n}
                    </button>
                  </div>
                ))}

                <div className=""></div>

                {[4, 5, 6, 7, 8, 9].map((n) => (
                  <div className="grid-item-header-pg" key={n}>
                    <button
                      className=" btn2 fs-3 lh-lg w-full h-full"
                      onClick={() => {
                        setTemporaryTaraQuantityPg(n)
                      }}
                    >
                      {n}
                    </button>
                  </div>
                ))}
                
                <div className="grid-item-header-pg"></div>{' '}
                <div className="grid-item-header-pg">
                  <button className="numpad-button btn2 fs-3 lh-lg w-full h-full">0</button>
                </div>{' '}
                <div className="grid-item-header-pg"></div>

              </div>
            </div>
          </div>
          */}

          {/* </div> */}

          <div className="w-[100px] font-bold">
            <div className="h-[70px] bg-black">
              <div className="h-[25px] bg-red-800 text-white text-center flex items-center justify-center">
                TARA
              </div>
              <div className="w-full h-[40px] text-white flex items-center justify-center text-[20px]">
                {(temporaryValuesPg?.tara_value ? temporaryValuesPg.tara_value : 0).toFixed(2)}
              </div>
            </div>

            <div className="h-[70px] mt-1 bg-black">
              <div className="h-[25px] bg-red-800 text-white text-center flex items-center justify-center">
                CANT. TARA
              </div>
              <div className="w-full h-[40px] text-white flex items-center justify-center text-[20px]">
                {(temporaryValuesPg?.tara_quantity ? temporaryValuesPg.tara_quantity : 0).toFixed(
                  2
                )}
              </div>
            </div>

            <div className="h-[70px] mt-1 bg-black">
              <div className="h-[25px] bg-red-800 text-white text-center flex items-center justify-center">
                TOTAL TARA
              </div>
              <div className="w-full h-[40px] text-white flex items-center justify-center text-[20px]">
                {' '}
                {(temporaryValuesPg?.tara_quantity || temporaryValuesPg?.tara_value
                  ? (temporaryValuesPg.tara_quantity ?? 0) * (temporaryValuesPg?.tara_value ?? 0)
                  : 0
                ).toFixed(2)}
              </div>
            </div>
          </div>

          <div
            // className="rounded-3 p-3 shadow-sm d-flex flex-column div-superior"
            className="div-superior h-full"
            style={{
              backgroundColor: '#1f2937',
              // height: '200px',
              width: '300px',
            }}
          >
            <div className="text-center flex-grow-1 d-flex flex-column justify-content-center gap-4">
              <div
                className="fw-bold mb-0"
                style={{ color: '#60a5fa', fontSize: '70px', lineHeight: '1.1' }}
              >
                {weightValuePg.toFixed(2)}
              </div>
              <Divider component="div" style={{ height: '2px', backgroundColor: '#60a5fa' }} />
              <div
                className="text-truncate"
                style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '600' }}
              >
                S/ {getProductPricePg(selectedItemPg || '', selectedOrderPg || '').toFixed(2)}
              </div>
            </div>
          </div>

          <div className="columna-flex col_balance contenedor-principal">
            <div
              // className="rounded-3 p-3 shadow-sm d-flex flex-column div-superior"
              className="div-superior"
              style={{
                // backgroundColor: '#1f2937',
                height: '140px',
              }}
            >
              <button
                // className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white"
                className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white h-full w-full"
                style={{
                  backgroundColor: '#3b82f6',
                  borderColor: '#3b82f6',
                  // flex: '2',
                  // height: '48px',
                  fontSize: '16px',
                }}
                onClick={() => {
                  //setPrevWeight(weightValuePg)
                  setTemporaryQuantityPg(weightValuePg)
                  return
                }}
              >
                <span>CAPTURAR</span>
              </button>
            </div>

            <div
              // className="rounded-3 d-flex flex-column mt-2 div-inferior"
              className="div-inferior"
              style={{
                height: '50px',
              }}
            >
              <button
                className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white h-full w-full"
                style={{
                  backgroundColor: '#f97316',
                  borderColor: '#f97316',
                  // flex: '1',
                  // height: '48px',
                  fontSize: '16px',
                }}
                onClick={() => {
                  convertTemporaryToReturnPg()
                }}
              >
                DEVOLVER
              </button>
            </div>
          </div>

          {/*
          <div className="h-full w-[150px]">
            <button
              className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center h-full text-white w-full"
              onClick={() => {
                setOperationPg(Operation.QUANTITY)
                openCalculatorModal({ operation: Operation.QUANTITY })
                setChangePricePg(false)
              }}
              style={{
                backgroundColor: 'oklch(50.8% 0.118 165.612)',
                fontSize: '4rem',
              }}
            >
              M
            </button>
          </div>
          */}

          <div className="columna-flex col_price contenedor-principal">
            <div
              className="div-superior"
              style={{
                // backgroundColor: '#1f2937',
                height: '140px',
              }}
            >
              <button
                className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white h-full w-full"
                style={{
                  backgroundColor: 'oklch(50.8% 0.118 165.612)',
                  fontSize: '4rem',
                }}
                onClick={() => {
                  setOperationPg(Operation.QUANTITY)
                  openCalculatorModal({ operation: Operation.QUANTITY })
                  setChangePricePg(false)
                }}
              >
                <span>M</span>
              </button>
            </div>

            <div
              // className="rounded-3 d-flex flex-column mt-2 div-inferior"
              className="div-inferior"
              style={{
                height: '50px',
              }}
            >
              <div
                className="bg-black font-bold rounded-3 d-flex align-items-center justify-content-center h-full w-full text-white"
                style={{
                  fontSize: '1.1375rem',
                  // width: '100px',
                }}
              >
                {Number(temporaryValuesPg?.base_quantity ?? 0).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="columna-flex col_price contenedor-principal">
            <div
              className="div-superior"
              style={{
                // backgroundColor: '#1f2937',
                height: '140px',
              }}
            >
              <button
                className="btn fw-semibold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-white h-full w-full"
                style={{
                  backgroundColor: '#3b82f6',
                  borderColor: '#3b82f6',
                  fontSize: '16px',
                }}
                onClick={() => {
                  setOperationPg(Operation.PRICE)
                  openCalculatorModal({ operation: Operation.PRICE })
                  setChangePricePg(false)
                }}
              >
                <span>PRECIO</span>
              </button>
            </div>

            <div
              // className="rounded-3 d-flex flex-column mt-2 div-inferior"
              className="div-inferior"
              style={{
                height: '50px',
              }}
            >
              <div
                className="bg-black font-bold rounded-3 d-flex align-items-center justify-content-center h-full w-full text-white"
                style={{
                  fontSize: '1.1375rem',
                  // width: '100px',
                }}
              >
                {(temporaryValuesPg?.price_unit ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
