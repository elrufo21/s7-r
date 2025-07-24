import useAppStore from '@/store/app/appStore'
import { useParams } from 'react-router-dom'
import { TypeStateOrder } from '../types'
import { ActionTypeEnum } from '@/shared/shared.types'
import { toast } from 'sonner'
import { useCallback } from 'react'

interface OrderData {
  order_id: string | number
  state: string
  lines?: any[]
  payments?: any[]
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
  } = useAppStore()

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
          setSelectedOrder(remainingOrders.length > 0 ? remainingOrders[0].order_id : null)
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
    [executeFnc, reloadOrders]
  )

  // Función principal que maneja el guardado según la pantalla actual
  const saveCurrentOrder = useCallback(async (): Promise<boolean> => {
    const date = new Date()
    const peruDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    const session = getSessionData()

    switch (screen) {
      case 'products': {
        if (!handleChange) return false

        const data = orderData.find((item) => item.order_id === selectedOrder)
        if (!data) return false

        const updatedData = {
          ...data,
          name: '',
          state: data.state || TypeStateOrder.IN_PROGRESS,
          order_date: data.order_date || peruDate.toISOString(),
          user_id: userData?.user_id,
          point_id: pointId,
          session_id: session?.session_id,
          currency_id: 1,
          company_id: userData?.company_id,
          invoice_state: data.invoice_state || 'P',
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

        const result = await saveOrder(
          typeof selectedOrder === 'string' ? ActionTypeEnum.INSERT : ActionTypeEnum.UPDATE,
          updatedData
        )

        if (result.success && result.data?.order_id) {
          if (typeof selectedOrder === 'string' && result.data.order_id !== selectedOrder) {
            // updateMoveId(selectedOrder, result.data.order_id)
          }

          setHandleChange(false)
          return true
        }
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
            state: data.state || TypeStateOrder.IN_PROGRESS,
            order_date: data.order_date || peruDate.toISOString(),
            user_id: userData?.user_id,
            point_id: pointId,
            currency_id: 1,
            name: '',
            company_id: userData?.company_id,
            invoice_state: data.invoice_state || 'P',
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

        if (result.success && result.data?.order_id) {
          setSelectedOrder(result.data.order_id)
          setHandleChange(false)
          return true
        }
        return false
      }

      default:
        return false
    }
  }, [
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
  ])

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
