import { PosOrder } from '@/lib/offlineCache'
import { ListFilterItem } from '../shared.types'
import { CustomerAccountItem } from '@/modules/invoicing/components/customerAccountStatementReport'
export type Transaction = {
  date: string
  name: string
  type: 'I' | 'O'
  state: string
  amount: number
  detail: string
  origin: 'G' | 'D' | 'P'
  reason: string
  user_id: number
  partner_name: string
  payment_method_name: string
}

export type Summary = {
  payment_method_name: string
  paymentsSales: number
  paymentsDebt: number
  income: number
  outcome: number
  difference: number
  counted: number
}

interface Payment {
  date: string
  name: string
  type: string
  state: string
  amount: number
  detail: string
  payment_method_name: string
  partner_name: string
}
export function getShortUUID(length = 8) {
  return crypto.randomUUID().replace(/-/g, '').slice(0, length)
}
export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (isNaN(value)) return (0).toFixed(maxDecimals)

  const factor = Math.pow(10, maxDecimals)
  const rounded = Math.round(value * factor) / factor

  return rounded.toFixed(maxDecimals)
}
export function adjustTotal(
  value: number,
  step: number = 0.1
): { adjusted: number; residual: number } {
  if (isNaN(value)) return { adjusted: 0, residual: 0 }

  const countDecimals = (n: number) => {
    if (!isFinite(n)) return 0
    const s = n.toString()
    // maneja notación científica como "1e-7"
    if (s.indexOf('e-') >= 0) {
      const match = /(?:\.(\d+))?e-(\d+)$/.exec(s)
      if (!match) return 0
      const fractionDigits = match[1] ? match[1].length : 0
      return parseInt(match[2], 10) + fractionDigits
    }
    const parts = s.split('.')
    return parts[1]?.length ?? 0
  }

  const decimalsStep = countDecimals(step)
  const decimalsValue = countDecimals(value)

  const rawAdjusted = Math.ceil(value / step) * step
  const adjusted = Number(rawAdjusted.toFixed(decimalsStep))

  const rawResidual = adjusted - value
  const residualDecimals = Math.max(decimalsStep, decimalsValue)
  // redondeamos al número de decimales necesario
  let residual = Number(rawResidual.toFixed(residualDecimals))

  // limpiar tiny negative/zero por precisión de punto flotante
  if (Math.abs(residual) < 1e-12) residual = 0

  return { adjusted, residual }
}

export function formatNumberDisplay(value: number | string): string {
  if (Number(value) % 1 === 0) {
    return Number(value).toFixed(0)
  }
  return Number(value).toFixed(2)
}

export const getLastMonths = (count: number = 3): ListFilterItem[] => {
  const months: ListFilterItem[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleString('es-ES', { month: 'long' })

    months.push({
      group: 'date',
      title: monthName.charAt(0).toUpperCase() + monthName.slice(1),
      key: i === 0 ? 'M' : `M_${i}`,
      key_db: 'order_date',
      value: i === 0 ? 'M' : `M_${i}`,
      type: 'check',
    })
  }

  return months
}

export function codePayment(fecha = null) {
  const ahora = fecha ? new Date(fecha) : new Date()

  const dia = String(ahora.getDate()).padStart(2, '0')
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const anio = String(ahora.getFullYear()).slice(-2)
  const hora = String(ahora.getHours()).padStart(2, '0')
  const minuto = String(ahora.getMinutes()).padStart(2, '0')
  const segundo = String(ahora.getSeconds()).padStart(2, '0')

  return `PG-${dia}${mes}${anio}${hora}${minuto}${segundo}`
}

export const transformOrders = (orders: PosOrder[]) => {
  let runningBalance = 0

  const records = orders.flatMap((order) => {
    const total_pagado = order.payments
      ? order.payments.reduce((sum, p) => sum + (p.amount || 0), 0)
      : 0

    const total_pendiente = (order.amount_withtaxed || 0) - total_pagado

    const orderRecords = order.lines.map((line, index, arr) => {
      const total = line.amount_untaxed_total || line.price_unit * line.quantity
      runningBalance += total

      const isLastLine = index === arr.length - 1

      return {
        date: order.order_date,
        document_number: order.receipt_number,
        type: line.name,
        quantity: line.quantity,
        detail: order.partner_name,
        price: line.price_unit,
        total,
        total_balance: isLastLine ? runningBalance : '',
      }
    })

    return orderRecords
  })

  return records
}
export const transformOrdersWithPayments = (
  orders: PosOrder[],
  payments: Payment[]
): CustomerAccountItem[] => {
  let runningBalance = 0

  // 1. Transformar órdenes en registros
  const orderRecords = orders.flatMap((order) => {
    return order.lines.map((line, index, arr) => {
      const total = line.amount_untaxed_total || line.price_unit * line.quantity
      const isLastLine = index === arr.length - 1

      return {
        date: order.order_date,
        document_number: order.receipt_number,
        type: line.name,
        quantity: line.quantity,
        detail: null,
        price: line.price_unit,
        total,
        total_balance: '',
        in_payments: '',
        isPayment: false,
        isLastOfOrder: isLastLine,
        sortDate: new Date(order.order_date).getTime(),
      }
    })
  })

  // 2. Transformar pagos en registros
  const paymentRecords = payments.map((payment) => ({
    date: payment.date,
    document_number: payment.detail.includes('Orden') ? payment.detail : codePayment(payment.date),
    type: payment.payment_method_name,
    quantity: '',
    detail: payment.detail,
    price: '',
    total: '',
    total_balance: '',
    in_payments: payment.amount,
    isPayment: true,
    isLastOfOrder: true,
    sortDate: new Date(payment.date).getTime(),
  }))

  // 3. Combinar y ordenar por fecha
  const allRecords = [...orderRecords, ...paymentRecords].sort((a, b) => a.sortDate - b.sortDate)

  // 4. Calcular saldo acumulado
  const result: any[] = []

  for (let i = 0; i < allRecords.length; i++) {
    const record = allRecords[i]

    if (record.isPayment) {
      runningBalance -= record.in_payments as number
      result.push({
        ...record,
        total_balance: runningBalance,
      })
    } else {
      runningBalance += record.total as number

      const isLastOfDocument =
        i === allRecords.length - 1 || allRecords[i + 1].document_number !== record.document_number

      result.push({
        ...record,
        total_balance: isLastOfDocument ? runningBalance : '',
      })
    }
  }

  // 5. Retornar manteniendo isLastOfOrder
  return result.map(({ isPayment, sortDate, ...record }) => record) as CustomerAccountItem[]
}

export const summarizeTransactions = (transactions: Transaction[]): Summary[] => {
  const result: Record<string, Summary> = {}

  transactions.forEach((tx) => {
    const key = tx.payment_method_name

    if (!result[key]) {
      result[key] = {
        payment_method_name: key,
        paymentsSales: 0,
        paymentsDebt: 0,
        income: 0,
        outcome: 0,
        difference: 0,
        counted: 0,
      }
    }

    if (tx.origin === 'D') result[key].paymentsSales += tx.amount
    if (tx.origin === 'G') result[key].paymentsDebt += tx.amount
    if (tx.origin === 'P' && tx.type === 'I') result[key].income += tx.amount
    if (tx.origin === 'P' && tx.type === 'O') result[key].outcome += tx.amount
  })

  return Object.values(result)
}
