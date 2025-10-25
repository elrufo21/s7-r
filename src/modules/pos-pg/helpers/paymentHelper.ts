// helpers/paymentHelper.ts
import { now } from '@/shared/utils/dateUtils'
import { TypeStateOrder, TypeStatePayment } from '../types'

export const buildOrderPayloadNoPayment = ({
  orderData,
  selectedOrder,
  session_id,
  userData,
  finalCustomer,
  pointId,
}) => {
  const data = orderData
  if (!data) return null

  const orderTotal =
    data.lines?.reduce((sum, item) => sum + item.price_unit * item.quantity, 0) || 0

  return {
    ...data,
    name: data.name,
    state: TypeStateOrder.REGISTERED,
    order_date: now().toPlainDateTime().toString(),
    session_id: typeof data.order_id === 'string' ? session_id : undefined,
    currency_id: 1,
    company_id: userData?.company_id,
    invoice_state: data.invoice_state || 'T',
    partner_id: finalCustomer?.partner_id,
    payment_state: TypeStatePayment.PENDING_PAYMENT, // siempre pendiente
    combined_states: TypeStateOrder.REGISTERED + TypeStatePayment.PENDING_PAYMENT,
    point_id: pointId,
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
      amount_withtaxed: item?.price_unit,
      amount_untaxed_total: item?.price_unit * item?.quantity,
      amount_tax_total: 0,
      amount_withtaxed_total: item?.price_unit * item?.quantity,
      tara_value: item?.tara_value,
      tara_quantity: item?.tara_quantity,
      base_quantity: item?.base_quantity,
      tara_total: item?.tara_total,
      uom_name: item?.uom_name,
    })),
    payments: [], // sin pagos
    amount_untaxed: orderTotal,
    amount_withtaxed: orderTotal,
    amount_total: orderTotal,
    amount_adjustment: 0,
    amount_payment: 0,
    amount_residual: orderTotal.toFixed(2),
  }
}

// Agregar al store (createPosPg):

// Función auxiliar para obtener órdenes ordenadas
