import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#333333',
    fontFamily: 'Helvetica',
    fontSize: 10,
    padding: 18,
  },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 6, marginBottom: 6 },
  subtitle: { fontSize: 9, textAlign: 'center', marginBottom: 12 },

  clientSection: { marginBottom: 8 },
  clientHeader: { color: '#000', fontWeight: 'bold', paddingVertical: 4, fontSize: 11 },

  monthRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    fontSize: 10,
    borderBottom: '1px solid #e0e0e0',
  },
  monthIcon: { width: 18 },
  monthLabel: { fontWeight: 'bold' },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 4,
    fontSize: 9,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    fontSize: 9,
    borderBottom: '1px solid #f5f5f5',
  },

  
  colTotalPartner: { flex: 2.4, textAlign: 'left' }, // nuevo

  colDate: { flex: 1.2, textAlign: 'center' },
  colTotal: { flex: 1, textAlign: 'right' },
  colResidual: { flex: 1, textAlign: 'right' },
  colPOS: { flex: 0.8, textAlign: 'center' },
  colUser: { flex: 1.6, textAlign: 'left', paddingLeft: 4 },

  // Totales: usan el mismo grid (5 columnas)
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    fontSize: 10,
    fontWeight: 'bold',
    borderTop: '1px solid #d0d0d0',
    marginTop: 4,
  },
  clientGrandTotal: {
    flexDirection: 'row',
    paddingVertical: 6,
    fontSize: 10.5,
    fontWeight: 'bold',
    marginTop: 6,
    backgroundColor: '#eef9ff',
  },
  grandTotalRow: {
    flexDirection: 'row',
    backgroundColor: '#dfe7e9',
    paddingVertical: 8,
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 10,
  },
})

// types
interface Payment {
  amount: number
}
interface OrderData {
  order_id: number
  partner_name: string
  receipt_number: string
  order_date: string
  point_name: string
  amount_withtaxed: number
  amount_payment: number
  amount_residual?: number
  user_name?: string
  payments?: Payment[] | null
}

interface MonthGroup {
  month: string
  orders: (OrderData & { computed_residual: number })[]
  total: number
  payment: number
  residual: number
}
interface ClientGroup {
  clientName: string
  months: MonthGroup[]
  total: number
  payment: number
  residual: number
}

// helpers
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

const formatAmount = (amount: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    amount ?? 0
  )

const getMonthName = (dateString: string) => {
  const d = new Date(dateString)
  const month = d.toLocaleDateString('es-PE', { month: 'long' })
  return month.charAt(0).toUpperCase() + month.slice(1)
}

const sumPayments = (payments?: Payment[] | null) => {
  if (!payments || payments.length === 0) return 0
  return payments.reduce((s, p) => s + (p?.amount ?? 0), 0)
}

// grouping
function groupOrdersByClient(orders: OrderData[]): ClientGroup[] {
  const grouped: { [key: string]: ClientGroup } = {}

  orders.forEach((order) => {
    const clientName = order.partner_name
    const monthName = getMonthName(order.order_date)

    const computedResidual =
      typeof order.amount_residual === 'number'
        ? order.amount_residual
        : Math.max(0, order.amount_withtaxed - sumPayments(order.payments))

    if (!grouped[clientName]) {
      grouped[clientName] = { clientName, months: [], total: 0, payment: 0, residual: 0 }
    }

    let monthGroup = grouped[clientName].months.find((m) => m.month === monthName)
    if (!monthGroup) {
      monthGroup = { month: monthName, orders: [], total: 0, payment: 0, residual: 0 }
      grouped[clientName].months.push(monthGroup)
    }

    monthGroup.orders.push({ ...order, computed_residual: computedResidual })
    monthGroup.total += order.amount_withtaxed
    monthGroup.payment += order.amount_payment
    monthGroup.residual += computedResidual

    grouped[clientName].total += order.amount_withtaxed
    grouped[clientName].payment += order.amount_payment
    grouped[clientName].residual += computedResidual
  })

  return Object.values(grouped).sort((a, b) => a.clientName.localeCompare(b.clientName))
}

function calculateGrandTotals(clientGroups: ClientGroup[]) {
  return clientGroups.reduce(
    (acc, g) => {
      acc.total += g.total
      acc.payment += g.payment
      acc.residual += g.residual
      return acc
    },
    { total: 0, payment: 0, residual: 0 }
  )
}

function getPOSFromReceipt(receiptNumber: string) {
  const parts = (receiptNumber || '').split('-')
  return parts[0] || receiptNumber || '-'
}

// component
const SalesByClientPDF = ({ orders }: { orders: OrderData[] }) => {
  const clientGroups = groupOrdersByClient(orders)
  const grandTotals = calculateGrandTotals(clientGroups)
  const reportDate = formatDate(new Date().toISOString())

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Ventas por Cliente</Text>
        <Text style={styles.subtitle}>{reportDate}</Text>

        {clientGroups.map((group, gi) => (
          <View key={gi} style={styles.clientSection}>
            <Text style={styles.clientHeader}>{group.clientName}</Text>

            {group.months.map((month, mi) => (
              <View key={mi}>
                <View style={styles.monthRow}>
                  <Text style={styles.monthIcon}>⌄</Text>
                  <Text style={styles.monthLabel}>{month.month}</Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={styles.colDate}>Fecha</Text>
                  <Text style={styles.colDate}>Orden</Text> {/* nuevo */}
                  <Text style={styles.colTotal}>Total</Text>
                  <Text style={styles.colResidual}>Pagado</Text> {/* nuevo */}
                  <Text style={styles.colResidual}>Deuda</Text>
                  <Text style={styles.colPOS}>POS</Text>
                  <Text style={styles.colUser}>Cajero</Text>
                </View>

                {month.orders.map((order, oi) => (
                  <View key={oi} style={styles.tableRow}>
                    <Text style={styles.colDate}>{formatDate(order.order_date)}</Text>
                    <Text style={styles.colDate}>{order.receipt_number}</Text> {/* nuevo */}
                    <Text style={styles.colTotal}>{formatAmount(order.amount_withtaxed)}</Text>
                    <Text style={styles.colTotal}>{formatAmount(order.amount_payment)}</Text> {/* nuevo */}
                    <Text style={styles.colResidual}>
                      {formatAmount((order as any).computed_residual)}
                    </Text>
                    {/* <Text style={styles.colPOS}>{getPOSFromReceipt(order.receipt_number)}</Text> */}
                    <Text style={styles.colPOS}>{order.point_name}</Text>
                    <Text style={styles.colUser}>{order.user_name ?? '-'}</Text>
                  </View>
                ))}

                {/* TOTAL DEL MES */}
                <View style={styles.totalRow}>
                  
                  {/* <Text style={styles.colDate}>TOTAL {month.month}</Text> */}
                  <Text style={styles.colDate}>{month.month}</Text>

                  <Text style={styles.colDate}></Text> {/* nuevo */}
                  <Text style={styles.colTotal}>{formatAmount(month.total)}</Text>
                  <Text style={styles.colTotal}>{formatAmount(month.payment)}</Text> {/* nuevo */}
                  <Text style={styles.colResidual}>{formatAmount(month.residual)}</Text>
                  <Text style={styles.colPOS}></Text>
                  <Text style={styles.colUser}></Text>
                </View>
              </View>
            ))}

            {/* TOTAL DEL CLIENTE */}
            <View style={styles.clientGrandTotal} wrap={false}>
              
              {/* <Text style={styles.colDate}>TOTAL {group.clientName}</Text> */}
              <Text style={styles.colTotalPartner}>{group.clientName}</Text>
              {/*<Text style={styles.colDate}></Text> */}
              
              <Text style={styles.colTotal}>{formatAmount(group.total)}</Text>
              <Text style={styles.colTotal}>{formatAmount(group.payment)}</Text> {/* nuevo */}
              <Text style={styles.colResidual}>{formatAmount(group.residual)}</Text>
              <Text style={styles.colPOS}></Text>
              <Text style={styles.colUser}></Text>
            </View>
          </View>
        ))}

        {/* TOTAL GENERAL */}
        <View style={styles.grandTotalRow}>
          
          {/* <Text style={styles.colDate}>TOTAL GENERAL</Text> */}
          <Text style={styles.colDate}>Total informe</Text>

          <Text style={styles.colDate}></Text> {/* nuevo */}
          <Text style={styles.colTotal}>{formatAmount(grandTotals.total)}</Text>
          <Text style={styles.colTotal}>{formatAmount(grandTotals.payment)}</Text> {/* nuevo */}
          <Text style={styles.colResidual}>{formatAmount(grandTotals.residual)}</Text>
          <Text style={styles.colPOS}></Text>
          <Text style={styles.colUser}></Text>
        </View>
      </Page>
    </Document>
  )
}

export default SalesByClientPDF
