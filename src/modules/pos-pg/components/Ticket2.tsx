import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: '15px',
    fontFamily: 'Helvetica',
    fontSize: 9,
    display: 'flex',
    flexDirection: 'column',
    width: '80mm',
  },
  header: {
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
    paddingBottom: 5,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  companyInfo: {
    fontSize: 8,
    marginBottom: 1,
  },
  controlSection: {
    width: '100%',
    marginBottom: 10,
    paddingBottom: 5,
  },
  controlTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
  },
  controlInfo: {
    fontSize: 8,
    marginBottom: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 2,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
  },
  tableHeaderCell: {
    fontSize: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 0.5,
    paddingVertical: 2,
  },
  typeCol: { width: '25%' },
  qtyCol: { width: '10%' },
  unitCol: { width: '13%' },
  taraCol: { width: '13%' },
  netCol: { width: '13%' },
  cantidadCol: { width: '13%' },
  totalCol: { width: '13%' },

  tableRow: {
    flexDirection: 'row',
    marginBottom: 1,
    paddingVertical: 1,
  },
  tableCell: {
    fontSize: 6,
    paddingHorizontal: 0.5,
  },
  tableCellCenter: {
    textAlign: 'center',
  },
  tableCellRight: {
    textAlign: 'right',
  },

  reportSection: {
    width: '100%',
    marginTop: 10,
    paddingTop: 5,
  },
  reportTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    textDecoration: 'underline',
  },
  reportTable: {
    width: '100%',
  },
  reportHeader: {
    flexDirection: 'row',
    paddingVertical: 2,
    backgroundColor: '#f0f0f0',
  },
  reportHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productCol: { width: '45%' },
  priceCol: { width: '18%' },
  weightCol: { width: '18%' },
  reportTotalCol: { width: '19%' },

  reportRow: {
    flexDirection: 'row',
    paddingVertical: 1,
  },
  reportCell: {
    fontSize: 7,
    paddingHorizontal: 1,
  },

  totalSection: {
    marginTop: 8,
    paddingTop: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 7,
    color: '#666',
  },
  textBold: {
    fontWeight: 'bold',
  },
})

const Ticket2PDF = ({ info }: any) => {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const session = sessions.find((s: any) => s.point_id === info.point_id)

  const getTotalPrice = () => {
    if (!info.lines || info.lines.length === 0) {
      return '0.00'
    }

    return info.lines
      .reduce((total: number, item: any) => total + (item.amount_untaxed_total || 0), 0)
      .toFixed(2)
  }

  const total = parseFloat(getTotalPrice())

  function formatDateToDDMMYYYY(date: any) {
    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) {
      return 'Fecha inválida'
    }

    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()

    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  // Calcular totales de pagos por método
  const getPaymentTotals = () => {
    if (!info.payments || info.payments.length === 0) {
      return { efectivo: 0, tarjeta: 0, yape: 0, plan: 0, transf: 0, credito: 0 }
    }

    const totals = { efectivo: 0, tarjeta: 0, yape: 0, plan: 0, transf: 0, credito: 0 }

    info.payments.forEach((payment: any) => {
      const method = payment.payment_method_name?.toLowerCase() || ''
      const amount = payment.amount || 0

      if (method.includes('efectivo')) totals.efectivo += amount
      else if (method.includes('tarjeta')) totals.tarjeta += amount
      else if (method.includes('yape')) totals.yape += amount
      else if (method.includes('plan')) totals.plan += amount
      else if (method.includes('transf')) totals.transf += amount
      else totals.credito += amount
    })

    return totals
  }

  // Crear resumen de productos para el informe
  // const getProductSummary = () => {
  //   if (!info.lines || info.lines.length === 0) return []

  //   const summary = info.lines.map((item: any) => {
  //     const pesoNeto = (item.quantity || 0) - (item.tara_total || 0)
  //     return {
  //       name: item.name,
  //       pesoNeto: pesoNeto,
  //       precio: item.price_unit || 0,
  //       total: item.amount_untaxed_total || 0,
  //     }
  //   })

  //   return summary
  // }

  const paymentTotals = getPaymentTotals()

  return (
    <PDFViewer width="100%" className="h-screen">
      <Document>
        <Page size={[226, 600]} style={styles.page}>
          {/* Encabezado */}
          <View style={styles.header}>
            <Text style={styles.companyName}>Avícola "Pie Grande"</Text>
            <Text style={styles.companyInfo}>JR. HUANCAS 20 - HUANCAYO</Text>
            <Text style={styles.companyInfo}>PEDIDOS 964-612067</Text>
          </View>

          <View style={styles.controlSection}>
            <Text style={styles.controlTitle}>CONTROL DE PESO</Text>
            <Text style={styles.controlInfo}>Nº {info.receipt_number || info.name}</Text>
            <Text style={styles.controlInfo}>
              FECHA {formatDateToDDMMYYYY(info.order_date || new Date())}
            </Text>
            <Text style={(styles.controlInfo, styles.textBold)}>{session?.session_name}</Text>
          </View>
          {/* Encabezado de tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.typeCol]}>Producto</Text>
            <Text style={[styles.tableHeaderCell, styles.unitCol]}>Bruto</Text>
            <Text style={[styles.tableHeaderCell, styles.qtyCol]}>C/T</Text>
            <Text style={[styles.tableHeaderCell, styles.taraCol]}>Tara</Text>
            <Text style={[styles.tableHeaderCell, styles.netCol]}>Neto</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>Precio</Text>
            <Text style={[styles.tableHeaderCell, styles.totalCol]}>Total</Text>
          </View>

          {/* Filas de productos */}
          {info.lines &&
            info.lines.map((item: any, index: number) => {
              return (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.typeCol]}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.qtyCol, styles.tableCellCenter]}>
                    {item.base_quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.unitCol, styles.tableCellCenter]}>
                    {item.tara_quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.taraCol, styles.tableCellCenter]}>
                    {item.tara_total.toFixed(1)}
                  </Text>
                  <Text style={[styles.tableCell, styles.netCol, styles.tableCellRight]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.totalCol, styles.tableCellRight]}>
                    {Number(item.price_unit).toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, styles.totalCol, styles.tableCellRight]}>
                    {item.amount_untaxed_total.toFixed(2)}
                  </Text>
                </View>
              )
            })}

          {/* Sección de Informe */}
          {/** <View style={styles.reportSection}>
            <Text style={styles.reportTitle}>INFORME</Text>

            <View style={styles.reportHeader}>
              <Text style={[styles.reportHeaderCell, styles.productCol]}>PRODUCTO</Text>
              <Text style={[styles.reportHeaderCell, styles.priceCol]}>P NETO</Text>
              <Text style={[styles.reportHeaderCell, styles.weightCol]}>PRECIO</Text>
              <Text style={[styles.reportHeaderCell, styles.reportTotalCol]}>TOTAL</Text>
            </View>

            {productSummary.map((product: any, index: number) => (
              <View key={index} style={styles.reportRow}>
                <Text style={[styles.reportCell, styles.productCol]}>{product.name}</Text>
                <Text style={[styles.reportCell, styles.priceCol, styles.tableCellCenter]}>
                  {product.pesoNeto.toFixed(1)}
                </Text>
                <Text style={[styles.reportCell, styles.weightCol, styles.tableCellCenter]}>
                  {product.precio.toFixed(1)}
                </Text>
                <Text style={[styles.reportCell, styles.reportTotalCol, styles.tableCellRight]}>
                  {product.total.toFixed(1)}
                </Text>
              </View>
            ))}
          </View> */}

          {/* Totales */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL:</Text>
              <Text style={styles.totalValue}>{total}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>EFECTIVO:</Text>
              <Text style={styles.totalValue}>{paymentTotals.efectivo.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TARJETA:</Text>
              <Text style={styles.totalValue}>{paymentTotals.tarjeta.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>YAPE:</Text>
              <Text style={styles.totalValue}>{paymentTotals.yape.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TRANSF:</Text>
              <Text style={styles.totalValue}>{paymentTotals.transf.toFixed(2)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>CREDITO:</Text>
              <Text style={styles.totalValue}>{paymentTotals.credito.toFixed(2)}</Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>S7</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default Ticket2PDF
