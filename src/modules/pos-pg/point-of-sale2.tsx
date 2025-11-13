import '../../pos2.css'
import Header from './components/Header'
import Screens from './components/Screens'
import useAppStore from '@/store/app/appStore'
import { useEffect, useRef } from 'react'
import { FrmBaseDialog } from '@/shared/components/core'
import PosDetailConfig from './components/modal/opening-control/config'
import { useNavigate, useParams } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'
import { now, setCurrentTimeIfToday } from '@/shared/utils/dateUtils'
import { CustomToast } from '@/components/toast/CustomToast'
import { usePosActionsPg } from '../pos/hooks/usePosActionsPg'
import { ViewTypeEnum } from '@/shared/shared.types'
import { Type_pos_payment_origin, TypePayment } from './types'
import { Operation } from './context/CalculatorContext'
import PaymentsModal from '../pos-pg/views/modal-payment/config'
import PosModalPaymentListConfig from './views/modal-payment-list/config'
import { codePayment } from '@/shared/helpers/helpers'
import DateCalculatorPanel from './components/modal/components/ModalDate'
import { formatDateToDDMMYYYY } from '@/shared/utils/utils'
import { FiAlertTriangle } from 'react-icons/fi'
import PosCloseCashConfig from './views/modal-close-cash-register/config'
import PosModalCashinAndOut from './views/modal-cash-in-and-out/config'
import ModalButtons from './components/modal/components/ModalButtons'

const PointOfSale = () => {
  const { pointId } = useParams()
  const { userData } = useUserStore()
  const navigate = useNavigate()
  const { isOnline } = usePWA()

  const {
    executeFnc,
    openDialog,
    closeDialogWithData,
    initializePointOfSalePg,
    setOrderDataPg,
    setSyncLoading,
    setScreenPg,
    localModePg,
    sync_dataPg,
    setSyncDataPg,
    setSessionIdPg,
    setPointIdPg,
    connectedPg,
    connectToDevicePg,
    selectedOrderPg,
    selectedItemPg,
    deleteProductInOrderPg,
    changeToPaymentLocalPg,
    getTotalPriceByOrderPg,
    setBackToProductsPg,
    setHandleChangePg,
    orderDataPg,
    screenPg,
    session_idPg,
    setPayment,
    dateInvoice,
    setDateInvoice,
    setOperationPg,
    setChangePricePg,
    frmLoading,
    changePricePg,
    setCloseSession,
    deleteOrderPg,
    setSelectedOrderPg,
  } = useAppStore()
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const { saveCurrentOrder } = usePosActionsPg()
  const session = sessions.find((s: any) => s.point_id === Number(pointId))
  const { session_id } = session || 0
  const isOnlineRef = useRef(isOnline)
  const fnc_to_pay = async () => {
    changeToPaymentLocalPg(selectedOrderPg)
    /*  const rs = await executeFnc('fnc_pos_order', 'u', {
      order_id: selectedOrderPg,
      state: 'Y',
    })
    if (rs.oj_data.length > 0) {
      const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
        [0, 'fequal', 'point_id', pointId],
      ])
      setorderDataPg(newOrders.oj_data)
    }*/
    //Linea comentada, analizar luego
    //  changeToPayment(selectedOrderPg)
    setScreenPg('payment')
    saveCurrentOrder(true, true)
  }
  const loadInitialData = async () => {
    if (!pointId) return

    try {
      if (!isOnline) {
        //await offlineCache.generateTestOrders(100, Number(pointId), session_id)
      }
      if (sync_dataPg) {
        await offlineCache.syncOfflineData(
          executeFnc,
          pointId,
          setOrderDataPg,
          setSyncLoading,
          session_id
        )
        setSyncDataPg(false)
      }
      await initializePointOfSalePg(pointId, isOnline, session_id, true)
    } catch (error) {
      console.error('Fallo la inicialización de datos del POS:', error)
    }
  }
  useEffect(() => {
    if (!connectedPg) {
      connectToDevicePg()
    }
  }, [connectedPg])
  useEffect(() => {
    isOnlineRef.current = isOnline
  }, [isOnline])
  useEffect(() => {
    setPointIdPg(Number(pointId))
    if (session_id !== 0 && session_id) setSessionIdPg(session_id)
    return () => {
      if (!isOnlineRef.current) {
        offlineCache.addPosOrderToQueue()
        offlineCache.clearOfflinePosOrders()
      } else {
        // offlineCache.clearOfflinePosOrders()
      }
    }
  }, [])
  function updateLocalStorageObject(key: string, updates: Record<string, any>) {
    // const existing = localStorage.getItem(key)

    //const parsed = existing ? JSON.parse(existing) : {}

    //    const updated = { ...parsed, ...updates }
    const updated = updates

    localStorage.setItem(key, JSON.stringify(updated))
  }
  useEffect(() => {
    if (isOnline) {
      const syncOfflineData = async () => {
        await offlineCache.syncPayments(executeFnc, session_id, setSyncDataPg)
      }
      syncOfflineData()
    }
    if (isOnline && !localModePg) {
      const getPosOrders = async () => {
        offlineCache.syncOfflineData(
          executeFnc,
          Number(pointId),
          setOrderDataPg,
          setSyncLoading,
          session_id
        )
        offlineCache.clearSyncOrdersQueue()
      }
      getPosOrders()
    }
  }, [isOnline])
  const openPaymentsModal = async () => {
    const paymentMethods = await offlineCache.getOfflinePaymentMethods()
    const localCustomers = await offlineCache.getOfflineContacts()
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'PAGOS',
      dialogContent: () => (
        <FrmBaseDialog
          initialValues={{
            paymentMethods: paymentMethods,
            type: TypePayment.INPUT,
            origin: Type_pos_payment_origin.PAY_DEBT,
            customers: localCustomers,
            dialogId: dialogId,
            partner_id: null,
          }}
          viewType={ViewTypeEnum.LIBRE}
          config={PaymentsModal}
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
              partner_id: formData.partner_id,
              reason: formData.reason,
              type: TypePayment.INPUT,
              payment_method_id: formData.payment_method_id,
              date: setCurrentTimeIfToday(dateInvoice),
              origin: Type_pos_payment_origin.PAY_DEBT,
              currency_id: 1,
              state: 'R',
              company_id: userData?.company_id,
              user_id: userData?.user_id,
              session_id: session_idPg,
            }
            let errors = []
            if (!data.amount) {
              errors.push({ message: 'El campo importe es requerido' })
            }
            if (!data.reason) errors.push({ message: 'El campo motivo es requerido' })
            if (!data.payment_method_id) errors.push({ message: 'Seleccione un metodo de pago' })
            if (!data.partner_id) errors.push({ message: 'Seleccione un cliente' })
            if (errors.length > 0) {
              CustomToast({
                title: 'Errores encontrados',
                items: errors,
                type: 'error',
              })
              return
            }
            setPayment({
              name: formData.partner_name || null,
              order_date: setCurrentTimeIfToday(dateInvoice),
              receipt_number: codePayment(),
              point_id: formData.point_id,
              payments: [
                { payment_method_name: formData.payment_method_name, amount: formData.amount },
              ],
              amount_total: formData.amount,
              amount_residual: '',
              type: TypePayment.INPUT,
              origin: Type_pos_payment_origin.PAY_DEBT,
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
            setDateInvoice(new Date())
            setScreenPg('invoice')
            closeDialogWithData(dialogId, null)
          },
        },
        {
          type: 'cancel',
          text: 'Cerrar',
          onClick: () => {
            closeDialogWithData(dialogId, {})
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
  const handlePaymentsList = async () => {
    const dialogId = openDialog({
      title: 'Lista de pagos',
      dialogContent: () => (
        <FrmBaseDialog
          config={PosModalPaymentListConfig}
          viewType={ViewTypeEnum.LIBRE}
          initialValues={{ typeForm: 'pg_payments_list', session_id: session_idPg }}
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
  useEffect(() => {
    setScreenPg('products')
    const getSession = async (s: number) => {
      const { oj_data } = await executeFnc('fnc_pos_session', 's1', [s])
      updateLocalStorageObject('secuence', oj_data[0].sequence)
    }
    const storedSessionId = session_id

    if (storedSessionId) {
      getSession(session_id)
      return
    }

    let getData = () => ({})
    const dialogId = openDialog({
      title: `Control de apertura ${pointId ? `- Punto ${session.session_name}` : ''}`,
      disableClose: true,
      dialogContent: () => (
        <FrmBaseDialog
          config={PosDetailConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ initial_cash: 0, opening_note: '' }}
        />
      ),
      buttons: [
        {
          text: 'Abrir caja registradora',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const data = {
              ...formData,
              company_id: userData.company_id,
              state: 'I',
              point_id: pointId,
              start_at: now().toPlainDateTime().toString(),
              currency_id: 1,
              user_id: userData.user_id,
            }

            if (!isOnline) {
              const id = Math.floor(Math.random() * 1000000)

              await offlineCache.cachePosSessions(executeFnc, 'i', {
                session_id: id,
                ...data,
              })

              const posPoints = await offlineCache.getOfflinePosPoints()
              const posPoint = posPoints.find((p: any) => p.point_id === Number(pointId))
              if (posPoint) {
                posPoint.session_id = id
                posPoint.state = 'u'
                await offlineCache.updatePosPointOffline(posPoint)
              }

              await offlineCache.updatePosSessionOffline({
                session_id: id,
                ...data,
                action: 'i',
              })

              // ✅ Actualizamos localStorage.sessions
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId) ? { ...s, session_id: id } : s
              )
              localStorage.setItem('sessions', JSON.stringify(newSessions))

              // ✅ Actualizamos local_pos_open para habilitar "Seguir vendiendo"
              const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
              const exists = localPosOpen.some((p: any) => p.point_id === Number(pointId))
              if (!exists) {
                localPosOpen.push({ point_id: Number(pointId), session_id: id })
                localStorage.setItem('local_pos_open', JSON.stringify(localPosOpen))
              }

              closeDialogWithData(dialogId, {})
              return
            }

            // ✅ Modo online
            const response = await executeFnc('fnc_pos_session', 'i', data)
            if (response.oj_data?.session_id) {
              const newSessions = sessions.map((s: any) =>
                s.point_id === Number(pointId)
                  ? { ...s, session_id: response.oj_data.session_id }
                  : s
              )
              getSession(response.oj_data?.session_id)
              localStorage.setItem('sessions', JSON.stringify(newSessions))

              setSessionIdPg(response.oj_data?.session_id)
              setPointIdPg(Number(pointId))

              // ✅ Guardamos en local_pos_open para que luego "Seguir vendiendo" funcione
              const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
              const exists = localPosOpen.some((p: any) => p.point_id === Number(pointId))
              if (!exists) {
                localPosOpen.push({
                  point_id: Number(pointId),
                  session_id: response.oj_data.session_id,
                })
                localStorage.setItem('local_pos_open', JSON.stringify(localPosOpen))
              }
            }

            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
            navigate('/points-of-sale-pg')
          },
        },
      ],
    })
  }, [])

  useEffect(() => {
    if (session_id) {
      loadInitialData()
    }
  }, [session_id, pointId])

  const openDateModal = () => {
    const dialogId = openDialog({
      title: 'Cambiar fecha',
      dialogContent: () => <DateCalculatorPanel dialogId={dialogId} />,
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
        // BOTÓN 1: Guardar
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

            // Validaciones
            let errors = []
            if (!data.amount) {
              errors.push({ message: 'El campo amount es requerido' })
            }
            if (!data.reason) {
              errors.push({ message: 'El campo motivo es requerido' })
            }
            if (!data.payment_method_id) {
              errors.push({ message: 'Seleccione un metodo de pago' })
            }

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
                {
                  payment_method_name: formData.payment_method_name,
                  amount: formData.amount,
                },
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
            setDateInvoice(new Date())
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

  const handleCloseCashRegister = async () => {
    await offlineCache
      .syncOfflineData(executeFnc, Number(pointId), setOrderDataPg, setSyncLoading, session_id)
      .then(async () => {
        // Obtener datos de la sesión
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

                // Confirmar diferencias
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

                // Marcar sesión como cerrada
                setCloseSession(true)

                // Eliminar órdenes en progreso
                const dataInStore = await offlineCache.getOfflinePosOrders()
                for (let i = 0; i < dataInStore.length; i++) {
                  if (dataInStore[i].state === 'I' || dataInStore[i].state === 'Y') {
                    deleteOrderPg(dataInStore[i].order_id, true)
                    await offlineCache.markOrderAsDeleted(dataInStore[i].order_id)
                    setHandleChangePg(true)
                  }
                }

                // Guardar cierre de sesión
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

                // Actualizar punto de venta
                const posPoints = await offlineCache.getOfflinePosPoints()
                const posPoint = posPoints.find((p: any) => p.point_id === Number(pointId))
                if (posPoint) {
                  posPoint.session_id = null
                  await offlineCache.updatePosPointOffline(posPoint)
                }

                // Actualizar localStorage
                const currentData = JSON.parse(localStorage.getItem('sessions') ?? '[]')
                const newSessions = currentData.map((s: any) =>
                  s.point_id === Number(pointId) ? { ...s, session_id: null } : s
                )
                localStorage.setItem('sessions', JSON.stringify(newSessions))

                const localPosOpen = JSON.parse(localStorage.getItem('local_pos_open') || '[]')
                const filtered = localPosOpen?.filter((p: any) => p.point_id !== Number(pointId))
                localStorage.setItem('local_pos_open', JSON.stringify(filtered))

                // Sincronizar y limpiar
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

            // BOTÓN 2: Descartar
            {
              text: 'Descartar',
              type: 'cancel',
              onClick: () => {
                closeDialogWithData(dialogId, null)
              },
            },

            // BOTÓN 3: Reporte de sesión
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
      const fieldName = item.is_cash ? 'cash_count' : `pm_${item.payment_method_id}`
      const counted = parseFloat(data[fieldName] || 0)

      const difference = parseFloat((item.amount - counted).toFixed(2))

      return {
        ...item,
        counted,
        difference,
      }
    })

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
  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-1 min-w-0">
        <Header pointId={pointId ?? ''} />
        <div className="pos-content pos-content-pg">
          <Screens />
        </div>
      </div>

      {screenPg === 'products' && (
        <div className="pg-line-vertical">
          {/* 
          <div className="bg-yellow-400 w-full h-[50px] mt-4 flex items-center justify-center font-bold text-[1.5rem]">
            {formatDateToDDMMYYYY(dateInvoice)}
          </div>
          */}

          <div className="lv-child">
            <button
              onClick={() => {
                openDateModal()
              }}
              className="btn h-full w-full bg-yellow-400 font-bold rounded-3 shadow-sm d-flex align-items-center justify-content-center text-black"
              style={{
                fontSize: '1.5rem',
              }}
            >
              {new Date(dateInvoice).toLocaleDateString('es-PE', { timeZone: 'America/Lima' })}
            </button>
          </div>

          <div className="lv-child">
            <button
              disabled={frmLoading}
              onClick={() => {
                setOperationPg(Operation.CHANGE_PRICE)
                setChangePricePg(!changePricePg)
              }}
              style={{
                backgroundColor: 'oklch(50.8% 0.118 165.612)',
                fontSize: '1.1375rem',
              }}
              className="btn h-full w-full fw-semibold rounded-3 d-flex align-items-center justify-content-center text-white"
            >
              CAMBIAR PRECIO
            </button>
          </div>

          <div className="lv-child">
            <button
              style={{
                fontSize: '1.1375rem',
                // width: '100%',
                // height: '150px',
              }}
              className="btn h-full w-full text-white bg-red-600 fw-semibold d-flex align-items-center justify-content-center"
              onClick={() => {
                if (!selectedItemPg) {
                  CustomToast({
                    title: 'Error al eliminar',
                    description: 'Seleccione un producto para eliminar.',
                    type: 'error',
                  })
                  return
                }
                const dialogId = openDialog({
                  title: 'Alerta',

                  dialogContent: () => (
                    <div className="h-[50px] w-[600px] font-semibold flex items-center justify-center text-lg text-gray-700 rounded-md shadow-sm">
                      ¿Está seguro que desea eliminar este producto?
                    </div>
                  ),
                  buttons: [
                    {
                      type: 'confirm',
                      text: 'Si',
                      onClick() {
                        deleteProductInOrderPg(selectedOrderPg, selectedItemPg)
                        closeDialogWithData(dialogId, {})
                      },
                    },
                    {
                      type: 'cancel',
                      text: 'No',
                      onClick() {
                        closeDialogWithData(dialogId, {})
                      },
                    },
                  ],
                })
              }}
            >
              <div className="pt-1 text-center-s7">
                <div className="text-white">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 48 48"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M 24 15 V 8" stroke-width="2.5" />
                    <path d="M 8 15 H 40" stroke-width="2.5" />
                    <path d="M 35 16 V 38 H 13 V 16" stroke-width="2.5" />
                    <path d="M 21 21 V 32" stroke-width="2.5" />
                    <path d="M 27 21 V 32" stroke-width="2.5" />
                  </svg>
                </div>
                <div className="mt-2 text-white font-bold text-[1.09375rem]">QUITAR PESADA</div>
              </div>
            </button>
          </div>

          <div className="lv-child lv-child-4">
            <button
              className="btn h-full w-full align-items-center justify-content-center text-white"
              style={{
                backgroundColor: '#3b82f6',
                fontSize: '1.1375rem',
                // width: '100%',
                // height: '300px',
              }}
              onClick={() => {
                if (getTotalPriceByOrderPg(selectedOrderPg) === 0) {
                  CustomToast({
                    title: 'Error al continuar a pago',
                    description: 'No se puede continuar: el monto debe ser distinto de 0.',
                    type: 'error',
                  })

                  return
                }
                if (!orderDataPg.find((o) => o.order_id === selectedOrderPg)?.partner_id) {
                  CustomToast({
                    title: 'Error al continuar a pago',
                    description: 'Seleccione un cliente antes de continuar.',
                    type: 'error',
                  })
                  return
                }
                setBackToProductsPg(false)
                setHandleChangePg(true)
                fnc_to_pay()
              }}
            >
              <div className="text-white font-bold text-[1.09375rem]">CANCELAR</div>
            </button>
          </div>

          <div className="lv-child">
            <button
              className="btn h-full w-full align-items-center justify-content-center text-white bg-yellow-600"
              style={{
                //backgroundColor: '#3b82f6',
                fontSize: '1.1375rem',
                // width: '100%',
                // height: '100px',
              }}
              onClick={() => {
                openPaymentsModal()
              }}
            >
              <div className="text-white font-bold text-[1.09375rem]">REALIZAR PAGO</div>
            </button>
          </div>

          <div className="lv-child">
            <button
              className="btn h-full w-full align-items-center justify-content-center text-white bg-red-600"
              style={{
                fontSize: '1.1375rem',
                // width: '100%',
                // height: '100px',
              }}
              onClick={handleClick}
            >
              <div className="text-white font-bold text-[1.09375rem]">Cerrar</div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PointOfSale
