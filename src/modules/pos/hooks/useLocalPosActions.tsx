import { useCallback } from 'react'
import { offlineCache } from '@/lib/offlineCache'
import type { PosOrder } from '@/lib/offlineCache'
import { now } from '@/shared/utils/dateUtils'

export const useLocalPosActions = () => {
  const saveOrder = useCallback(async (order: PosOrder) => {
    const newOrder = {
      ...order,
      order_id: order.order_id || crypto.randomUUID(),
      order_date: order.order_date || now().toPlainDateTime().toString(),
      action: order.action || 'i',
    }
    await offlineCache.saveOrderOffline(newOrder)
    return newOrder
  }, [])

  const reloadOrders = useCallback(async () => {
    return await offlineCache.getOfflinePosOrders()
  }, [])

  const getOrderById = useCallback(async (order_id: string | number) => {
    const orders = await offlineCache.getOfflinePosOrders()
    return orders.find((o) => o.order_id === order_id)
  }, [])

  const cancelOrder = useCallback(async (order_id: string | number) => {
    const orders = await offlineCache.getOfflinePosOrders()
    const updatedOrders = orders.map((order) =>
      order.order_id === order_id ? { ...order, state: 'C', action: 'u' } : order
    )
    await offlineCache.clearOfflinePosOrders()
    for (const order of updatedOrders) {
      await offlineCache.saveOrderOffline(order)
    }
    return updatedOrders.find((o) => o.order_id === order_id)
  }, [])

  return {
    saveOrder,
    reloadOrders,
    getOrderById,
    cancelOrder,
  }
}
