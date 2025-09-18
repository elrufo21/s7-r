import useAppStore from '@/store/app/appStore'
import { useParams } from 'react-router-dom'
import { TypeStateOrder } from '../types'
import { ActionTypeEnum } from '@/shared/shared.types'
import { toast } from 'sonner'
import { useCallback, useEffect } from 'react'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'
import { now } from '@/shared/utils/dateUtils'

interface OrderData {
  order_id: string | number
  state: string
  lines?: any[]
  payments?: any[]
  position?: number
  [key: string]: any
}

interface SaveOrderResult {
  success: boolean
  data?: any
  error?: string
}

export const usePosActions = () => {
  const {
    executeFnc,
    setOrderData,
    setSelectedOrder,
    orderData,
    selectedOrder,
    getTotalPriceByOrder,
    updateMoveId,
    setHandleChange,
    handleChange,
    screen,
    finalCustomer,
    selectedItem,
    localMode,
    setSyncLoading,
  } = useAppStore()

  useEffect(() => {
    saveCurrentOrder()
  }, [orderData])

  const { isOnline } = usePWA()

  const { pointId } = useParams<{ pointId: string }>()

  const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
  const { userData } = state

  // Obtener datos de sesión una sola vez
  const getSessionData = useCallback(() => {
    const sessions = JSON.parse(localStorage.getItem('sessions') ?? '[]')
    return sessions.find((s: any) => s.point_id === Number(pointId))
  }, [pointId])

  const reloadOrders = useCallback(async (): Promise<OrderData[]> => {
    if (!pointId) {
      console.warn('usePosActions: pointId no encontrado')
      return []
    }
    try {
      const newOrders = await executeFnc('fnc_pos_order', 's_pos', [
        ['0', 'fequal', 'point_id', pointId],
        [
          '0',
          'multi_filter_in',
          [
            { key_db: 'state', value: 'I' },
            { key_db: 'state', value: 'Y' },
          ],
        ],
      ])
      /*const order = newOrders.oj_data?.filter((i: any) => i.order_id === selectedOrder)
      const selected = order?.[0]?.lines?.filter((i: any) => i.selected)
      setSelectedItem(selected?.[0]?.line_id)*/
      const orders = newOrders.oj_data || []
      setOrderData(orders)
      return orders
    } catch (error) {
      console.error('Error al recargar órdenes:', error)
      toast.error('Error al cargar las órdenes')
      return []
    }
  }, [pointId, executeFnc, setOrderData])

  const cancelOrder = useCallback(
    async (orderId: number | string): Promise<boolean> => {
      if (!orderId) {
        console.warn('usePosActions: orderId requerido para cancelar orden')
        return false
      }

      try {
        const rs = await executeFnc('fnc_pos_order', 'u', {
          order_id: orderId,
          state: TypeStateOrder.CANCELED,
        })

        if (rs.oj_data?.length > 0) {
          const remainingOrders = await reloadOrders()
          setSelectedOrder(remainingOrders.length > 0 ? String(remainingOrders[0].order_id) : '')
          return true
        } else {
          toast.error('No se pudo cancelar la orden')
          return false
        }
      } catch (error) {
        console.error('Error al cancelar orden:', error)
        toast.error('Error al cancelar la orden')
        return false
      }
    },
    [executeFnc, reloadOrders, setSelectedOrder]
  )

  const saveOrder = useCallback(
    async (
      action: ActionTypeEnum.INSERT | ActionTypeEnum.UPDATE,
      data: any
    ): Promise<SaveOrderResult> => {
      if (!data) {
        return { success: false, error: 'Datos de orden requeridos' }
      }
      if (!isOnline) {
        try {
          await offlineCache.saveOrderOffline({ ...data, action: action })
          toast.info('Orden guardada localmente. Se enviará cuando vuelva la conexión.')
          return { success: true, data }
        } catch (e: any) {
          toast.error('Error al guardar la orden localmente', e)
          return { success: false, error: 'No se pudo guardar la orden localmente' }
        }
      }
      if (localMode) {
        await offlineCache.saveOrderOffline({ ...data, action })
        // 🔎 Verificar si ya hay 5 órdenes con action
        const offlineOrders = await offlineCache.getOfflinePosOrders()
        const ordersWithAction = offlineOrders.filter((o) => o.action)

        const syncQueue = await offlineCache.getSyncOrdersQueue()
        const allPendingOrders = [...ordersWithAction, ...syncQueue]

        if (allPendingOrders.length >= 50) {
          offlineCache.syncOfflineData(executeFnc, Number(pointId), setOrderData, setSyncLoading)
        }

        return { success: true, data }
      }

      try {
        const rs = await executeFnc('fnc_pos_order', action, {
          ...data,
        })

        if (rs?.oj_data?.order_id) {
          await reloadOrders()
          return { success: true, data: rs.oj_data }
        } else {
          toast.error('Error al guardar la orden')
          return { success: false, error: 'No se pudo guardar la orden' }
        }
      } catch (error) {
        console.error('Error al guardar orden:', error)
        toast.error('Error al guardar la orden')
        return { success: false, error: 'Error interno del servidor' }
      }
    },
    [executeFnc, reloadOrders, isOnline]
  )

  // Función principal que maneja el guardado según la pantalla actual
  const saveCurrentOrder = useCallback(
    async (endureOrder = false, toPayment = false): Promise<boolean> => {
      let screens = screen

      const date = now().toPlainDateTime().toString()
      const session = getSessionData()
      if (toPayment) screens = 'payment'
      switch (screens) {
        case 'products': {
          if (!handleChange) return false

          const data = orderData.find((item) => item.order_id === selectedOrder)
          if (!data) return false
          const updatedData = {
            ...data,
            name: '',
            state: TypeStateOrder.IN_PROGRESS,
            order_date: data.order_date || date,
            user_id: userData?.user_id,
            point_id: pointId,
            session_id: session?.session_id,
            currency_id: 1,
            company_id: userData?.company_id,
            invoice_state: data.invoice_state || 'P',
            partner_id: finalCustomer?.partner_id,
            partner_name: finalCustomer?.name,
            position: (data as any).position || 1,
            lines: data.lines?.map((item: any, i: number) => ({
              line_id: item?.line_id,
              order_id: selectedOrder,
              position: i + 1,
              product_id: item?.product_id,
              name: item?.name,
              quantity: item?.quantity,
              uom_id: item?.uom_id,
              price_unit: item?.price_unit,
              notes: null,
              amount_untaxed: item?.price_unit,
              amount_tax: 0,
              tara_value: item?.tara_value,
              tara_quantity: item?.tara_quantity,
              tara_total: item?.tara_total,
              amount_withtaxed: item?.price_unit,
              amount_untaxed_total: item?.price_unit * item?.quantity,
              amount_tax_total: item?.price_unit * item?.quantity,
              amount_withtaxed_total: item?.price_unit * item?.quantity,
              base_quantity: item?.base_quantity,
              selected: item?.line_id === selectedItem, // Marcar como seleccionado si coincide
              uom_name: item?.uom_name,
            })),
            order_id: selectedOrder,
            amount_untaxed:
              data.lines?.reduce(
                (total: number, item: any) => total + (item?.price_unit || 0),
                0
              ) || 0,
            amount_withtaxed:
              data.lines?.reduce(
                (total: number, item: any) =>
                  total + (item?.price_unit || 0) * (item?.quantity || 0),
                0
              ) || 0,
            amount_total: getTotalPriceByOrder(selectedOrder),
          }
          const result = await saveOrder(
            typeof selectedOrder === 'string' ? ActionTypeEnum.INSERT : ActionTypeEnum.UPDATE,
            updatedData
          )

          if (result.success && result.data?.order_id && endureOrder) {
            if (typeof selectedOrder === 'string' && result.data.order_id !== selectedOrder) {
              updateMoveId(selectedOrder, result.data.order_id)
              setSelectedOrder(result.data.order_id)
            }
            setHandleChange(false)
            return true
          }

          setHandleChange(false)

          return false
        }

        case 'ticket': {
          if (!handleChange) return false
          // Lógica específica para ticket si es necesaria
          setHandleChange(false)
          return true
        }

        case 'payment': {
          if (!handleChange) return false

          const data = orderData.find((item) => item.order_id === selectedOrder)
          if (!data) return false
          const newPayments = data?.payments?.filter((item: any) => item.amount !== 0)

          const result = await saveOrder(
            typeof data?.order_id === 'string' ? ActionTypeEnum.INSERT : ActionTypeEnum.UPDATE,
            {
              ...data,
              session_id: typeof data?.order_id === 'string' ? session?.session_id : undefined,
              payments: newPayments,
              state: TypeStateOrder.PAY,
              order_date: data.order_date || date,
              user_id: userData?.user_id,
              point_id: pointId,
              currency_id: 1,
              name: '',
              company_id: userData?.company_id,
              invoice_state: data.invoice_state || 'Y',
              partner_id: finalCustomer?.partner_id,
              partner_name: finalCustomer?.name,
              position: (data as any).position || 1,
              lines: data.lines?.map((item: any, i: number) => ({
                line_id: item?.line_id,
                order_id: selectedOrder,
                position: i + 1,
                product_id: item?.product_id,
                name: item?.name,
                quantity: item?.quantity,
                uom_id: item?.uom_id,
                price_unit: item?.price_unit,
                notes: null,
                amount_untaxed: item?.price_unit,
                tara_value: item?.tara_value,
                tara_quantity: item?.tara_quantity,
                base_quantity: item?.base_quantity,
                tara_total: item?.tara_total,
                amount_tax: 0,
                amount_withtaxed: item?.price_unit,
                amount_untaxed_total: item?.price_unit * item?.quantity,
                amount_tax_total: item?.price_unit * item?.quantity,
                amount_withtaxed_total: item?.price_unit * item?.quantity,
                selected: item?.line_id === selectedItem,
                uom_name: item?.uom_name,
              })),
              order_id: selectedOrder,
              amount_untaxed:
                data.lines?.reduce(
                  (total: number, item: any) => total + (item?.price_unit || 0),
                  0
                ) || 0,
              amount_withtaxed:
                data.lines?.reduce(
                  (total: number, item: any) =>
                    total + (item?.price_unit || 0) * (item?.quantity || 0),
                  0
                ) || 0,
              amount_total: getTotalPriceByOrder(selectedOrder),
            }
          )
          if (result.success && result.data?.order_id && endureOrder) {
            setSelectedOrder(result.data.order_id)
            setHandleChange(false)
            return true
          }
          setHandleChange(false)

          return false
        }

        default:
          return false
      }
    },
    [
      screen,
      handleChange,
      orderData,
      selectedOrder,
      userData,
      pointId,
      finalCustomer,
      getTotalPriceByOrder,
      updateMoveId,
      setSelectedOrder,
      setHandleChange,
      saveOrder,
      getSessionData,
    ]
  )

  const getOrderById = useCallback(
    async (orderId: number | string): Promise<OrderData | null> => {
      if (!orderId) return null

      try {
        const rs = await executeFnc('fnc_pos_order', 's', { order_id: orderId })
        return rs?.oj_data?.[0] || null
      } catch (error) {
        console.error('Error al obtener orden:', error)
        return null
      }
    },
    [executeFnc]
  )

  return {
    cancelOrder,
    reloadOrders,
    saveOrder,
    getOrderById,
    saveCurrentOrder,
  }
}
