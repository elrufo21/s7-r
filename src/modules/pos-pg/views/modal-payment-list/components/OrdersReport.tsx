import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#333333',
    fontFamily: 'Helvetica',
    fontSize: '10px',
    padding: '25px 35px',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 8,
    color: '#000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  summaryBox: {
    backgroundColor: '#f5f5f5',
    border: '1px solid #d0d0d0',
    borderRadius: 4,
    padding: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontSize: 10,
  },
  summaryLabel: {
    color: '#666',
  },
  summaryValue: {
    fontWeight: 'bold',
    color: '#000',
  },
  orderBox: {
    border: '1px solid #d0d0d0',
    borderRadius: 4,
    marginBottom: 20,
    overflow: 'hidden',
  },
  orderHeader: {
    backgroundColor: '#cfd0d2',
    color: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderHeaderLeft: {
    flex: 2,
  },
  orderHeaderRight: {
    flex: 1,
    textAlign: 'right',
  },
  orderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#000',
  },
  orderInfo: {
    fontSize: 9,
  },
  sectionTitle: {
    backgroundColor: '#e8e8e8',
    color: '#000',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 10,
    borderTop: '1px solid #d0d0d0',
    borderBottom: '1px solid #d0d0d0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 6,
    fontSize: 9,
    fontWeight: 'bold',
    borderBottom: '1px solid #d0d0d0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 6,
    fontSize: 9,
    borderBottom: '1px solid #f0f0f0',
  },
  tableRowEven: {
    flexDirection: 'row',
    padding: 6,
    fontSize: 9,
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
  },
  // Columnas para productos
  colProductName: {
    flex: 3,
  },
  colProductQty: {
    flex: 1,
    textAlign: 'center',
  },
  colProductUnit: {
    flex: 1,
    textAlign: 'center',
  },
  colProductPrice: {
    flex: 1.2,
    textAlign: 'right',
  },
  colProductTotal: {
    flex: 1.2,
    textAlign: 'right',
  },
  // Columnas para pagos
  colPaymentMethod: {
    flex: 2,
  },
  colPaymentAmount: {
    flex: 1.5,
    textAlign: 'right',
  },
  colPaymentDate: {
    flex: 2,
    textAlign: 'right',
  },
  orderTotal: {
    backgroundColor: '#f0f1f2',
    color: '#000',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    fontSize: 11,
    fontWeight: 'bold',
  },
  orderTotalLabel: {
    flex: 1,
  },
  orderTotalAmount: {
    flex: 1,
    textAlign: 'right',
  },
  paymentsSummaryBox: {
    border: '1px solid #d0d0d0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  paymentsSummaryHeader: {
    backgroundColor: '#cfd0d2',
    color: '#000',
    padding: 8,
    fontSize: 11,
    fontWeight: 'bold',
  },
  paymentsSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottom: '1px solid #f0f0f0',
    fontSize: 10,
  },
  paymentsSummaryRowEven: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#fafafa',
    borderBottom: '1px solid #f0f0f0',
    fontSize: 10,
  },
})

interface OrderLine {
  position: number
  name: string
  quantity: string
  uom_name: string
  price_unit: number
  amount_untaxed_total: number
}

interface Payment {
  payment_method_name: string
  amount: number
  date: string
}

interface OrderData {
  order_id: string
  partner_name: string
  receipt_number: string
  order_date: string
  amount_total: number
  lines: OrderLine[]
  payments: Payment[]
}

// Funciones auxiliares
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

const formatAmount = (amount: number) => {
  return `S/ ${amount.toFixed(2)}`
}

function getTotals(orders: OrderData[]) {
  let totalOrders = orders.length
  let totalProducts = 0
  let totalAmount = 0

  orders.forEach((order) => {
    totalProducts += order.lines.length
    totalAmount += order.amount_total
  })

  return { totalOrders, totalProducts, totalAmount }
}

function getPaymentsSummary(orders: OrderData[]) {
  const paymentMethods: { [key: string]: number } = {}

  orders.forEach((order) => {
    order.payments.forEach((payment) => {
      if (paymentMethods[payment.payment_method_name]) {
        paymentMethods[payment.payment_method_name] += payment.amount
      } else {
        paymentMethods[payment.payment_method_name] = payment.amount
      }
    })
  })

  return paymentMethods
}

// Componente principal
const OrdersReportPDF = ({ orders }: { orders: OrderData[] }) => {
  const totals = getTotals(orders)
  const paymentsSummary = getPaymentsSummary(orders)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>REPORTE DE ÓRDENES</Text>
        <Text style={styles.subtitle}>Generado el {formatDate(new Date().toISOString())}</Text>

        {/* Resumen General */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Resumen General</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de órdenes:</Text>
            <Text style={styles.summaryValue}>{totals.totalOrders}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total de productos:</Text>
            <Text style={styles.summaryValue}>{totals.totalProducts}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Monto total:</Text>
            <Text style={styles.summaryValue}>{formatAmount(totals.totalAmount)}</Text>
          </View>
        </View>

        {/* Órdenes individuales */}
        {orders.map((order, orderIndex) => (
          <View key={orderIndex} style={styles.orderBox} break={orderIndex > 0}>
            {/* Cabecera de orden */}
            <View style={styles.orderHeader}>
              <View style={styles.orderHeaderLeft}>
                <Text style={styles.orderTitle}>Orden #{order.receipt_number}</Text>
                <Text style={styles.orderInfo}>Cliente: {order.partner_name}</Text>
                <Text style={styles.orderInfo}>Fecha: {formatDate(order.order_date)}</Text>
              </View>
              <View style={styles.orderHeaderRight}>
                <Text style={styles.orderTitle}>{formatAmount(order.amount_total)}</Text>
                <Text style={styles.orderInfo}>Total</Text>
              </View>
            </View>

            {/* Productos */}
            <Text style={styles.sectionTitle}>Productos</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colProductName}>Producto</Text>
              <Text style={styles.colProductQty}>Cant.</Text>
              <Text style={styles.colProductUnit}>Unidad</Text>
              <Text style={styles.colProductPrice}>P. Unit.</Text>
              <Text style={styles.colProductTotal}>Subtotal</Text>
            </View>
            {order.lines.map((line, lineIndex) => (
              <View
                key={lineIndex}
                style={lineIndex % 2 === 0 ? styles.tableRow : styles.tableRowEven}
              >
                <Text style={styles.colProductName}>{line.name}</Text>
                <Text style={styles.colProductQty}>{line.quantity}</Text>
                <Text style={styles.colProductUnit}>{line.uom_name}</Text>
                <Text style={styles.colProductPrice}>{formatAmount(line.price_unit)}</Text>
                <Text style={styles.colProductTotal}>
                  {formatAmount(line.amount_untaxed_total)}
                </Text>
              </View>
            ))}

            {/* Pagos */}
            <Text style={styles.sectionTitle}>Pagos</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colPaymentMethod}>Método de Pago</Text>
              <Text style={styles.colPaymentAmount}>Monto</Text>
              <Text style={styles.colPaymentDate}>Fecha</Text>
            </View>
            {order.payments.map((payment, paymentIndex) => (
              <View
                key={paymentIndex}
                style={paymentIndex % 2 === 0 ? styles.tableRow : styles.tableRowEven}
              >
                <Text style={styles.colPaymentMethod}>{payment.payment_method_name}</Text>
                <Text style={styles.colPaymentAmount}>{formatAmount(payment.amount)}</Text>
                <Text style={styles.colPaymentDate}>{formatDate(payment.date)}</Text>
              </View>
            ))}

            {/* Total de orden */}
            <View style={styles.orderTotal}>
              <Text style={styles.orderTotalLabel}>TOTAL ORDEN</Text>
              <Text style={styles.orderTotalAmount}>{formatAmount(order.amount_total)}</Text>
            </View>
          </View>
        ))}

        {/* Resumen de pagos */}
        <View style={styles.paymentsSummaryBox}>
          <Text style={styles.paymentsSummaryHeader}>Resumen de Pagos</Text>
          {Object.entries(paymentsSummary).map(([method, amount], index) => (
            <View
              key={index}
              style={index % 2 === 0 ? styles.paymentsSummaryRow : styles.paymentsSummaryRowEven}
            >
              <Text>{method}</Text>
              <Text style={{ fontWeight: 'bold' }}>{formatAmount(amount)}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default OrdersReportPDF
