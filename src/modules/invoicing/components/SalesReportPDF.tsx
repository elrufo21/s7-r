import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#333333',
    fontFamily: 'Helvetica',
    fontSize: '10px',
    padding: '25px 35px',
  },
  header: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    border: '1px solid #d0d0d0',
  },
  headerLeft: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 10,
    color: '#000000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
    color: '#555555',
  },
  dateRange: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666666',
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 15,
    border: '1px solid #cccccc',
    borderRadius: 6,
  },
  sectionTitle: {
    backgroundColor: '#666666',
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 10,
    fontSize: 12,
    marginBottom: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    textAlign: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 11,
    backgroundColor: '#e8e8e8',
    fontWeight: 'bold',
    color: '#333333',
    borderBottom: '1px solid #cccccc',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 30,
    paddingRight: 12,
    paddingTop: 6,
    paddingBottom: 6,
    fontSize: 10,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #f5f5f5',
  },
  productName: {
    flex: 2,
    color: '#555555',
  },
  productQuantity: {
    flex: 1,
    textAlign: 'center',
    color: '#333333',
  },
  productAmount: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#000000',
  },
  categoryName: {
    flex: 2,
    fontWeight: 'bold',
  },
  categoryQuantity: {
    flex: 1,
    textAlign: 'center',
  },
  categoryAmount: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalRow: {
    backgroundColor: '#444444',
    color: '#ffffff',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 12,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  totalLabel: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
  },
  totalQuantity: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
  },
  totalAmount: {
    flex: 1,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: 'bold',
  },
  table: {
    width: '100%',
    marginTop: 5,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #cccccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#666666',
    borderBottomWidth: 2,
    borderBottomColor: '#cccccc',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableRowEven: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  tableCellLeft: {
    flex: 2,
    padding: 10,
    fontSize: 10,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    color: '#333333',
  },
  tableCellCenter: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    color: '#333333',
  },
  tableCellRight: {
    flex: 1,
    padding: 10,
    fontSize: 10,
    textAlign: 'right',
    color: '#333333',
  },
  tableCellHeader: {
    flex: 2,
    padding: 10,
    fontSize: 11,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tableCellHeaderCenter: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tableCellHeaderRight: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  rightBox: {
    border: '1px solid #cccccc',
    padding: 8,
    fontSize: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    color: '#333333',
  },
})

function getTotals(data) {
  let totalQuantity = 0
  let totalAmount = 0

  data.forEach((category) => {
    category.products.forEach((product) => {
      totalQuantity += product.quantity
      totalAmount += product.amount_withtaxed_total
    })
  })

  return {
    totalQuantity,
    totalAmount,
  }
}

const salesReportData = {
  company_id: 1,
  company_name: 'Pie Grande',
  ln1_id: 604,
  ln1_name: 'Perú',
  location_country_id: 604,
  location_country_name: 'Perú',
  report_name: 'Reporte diario de ventas',
  session_id: 'PUNTO DE VENTA DOS/00008',
  date_start: '2025-07-02T01:16:11',
  date_end: '2025-07-02T01:16:29',
  date_generated: '2025-07-03',
}

// Funciones auxiliares
const formatDate = (dateString) => {
  return new Date(dateString)
    .toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '')
}

const formatDateShort = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatAmount = (amount, currency) => {
  if (amount === '') return ''
  return `${currency}${amount.toFixed(2)}`
}

const SalesReportPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLeft}>{salesReportData.company_name}</Text>
          <Text style={styles.headerLeft}>{salesReportData.ln1_name}</Text>
        </View>
        <View style={styles.rightBox}>
          <Text>A partir del {formatDateShort(salesReportData.date_generated)}</Text>
        </View>
      </View>

      <Text style={styles.title}>{salesReportData.report_name}</Text>
      <Text style={styles.subtitle}>ID de la sesión: {salesReportData.session_id}</Text>
      <Text style={styles.dateRange}>
        {formatDate(salesReportData.date_start)} - {formatDate(salesReportData.date_end)}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>VENTAS</Text>

        {/* Categorías */}
        {data.products.map((category, index) => (
          <View key={`category-${index}`}>
            {/* Categoría */}
            <View style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryQuantity}>Cant.</Text>
              <Text style={styles.categoryAmount}>Total</Text>
            </View>

            {/* Productos de esta categoría */}
            {category.products.map((product, productIndex) => (
              <View key={`product-${productIndex}`} style={styles.productRow}>
                <Text style={styles.productName}>• {product.name}</Text>
                <Text style={styles.productQuantity}>{product.quantity}</Text>
                <Text style={styles.productAmount}>
                  {formatAmount(product.amount_withtaxed_total, 'S/')}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Total de ventas */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL GENERAL</Text>
          <Text style={styles.totalQuantity}>{getTotals(data.products).totalQuantity}</Text>
          <Text style={styles.totalAmount}>
            {formatAmount(getTotals(data.products).totalAmount, 'S/')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>CONTROL DE CAJA</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>Nombre</Text>
            <Text style={styles.tableCellHeaderCenter}>Esperado</Text>
            <Text style={styles.tableCellHeaderCenter}>Contado</Text>
            <Text style={styles.tableCellHeaderRight}>Diferencia</Text>
          </View>
          {data.control.map((register, index) => (
            <View
              key={`register-${index}`}
              style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}
            >
              <Text style={styles.tableCellLeft}>{register.name}</Text>
              <Text style={styles.tableCellRight}>
                {register.position === 1.1
                  ? 'S/ ' + register.amount || 0
                  : formatAmount(register.amount || 0, 'S/ ')}
              </Text>
              <Text style={styles.tableCellRight}>
                {register.position === 1.1 || register.position === 1.2
                  ? register?.counted != null
                    ? `S/ ${register.counted}`
                    : ''
                  : formatAmount(register?.counted ?? 0, 'S/ ')}
              </Text>
              <Text style={styles.tableCellRight}>
                {register.position === 1.1 || register.position === 1.2
                  ? ''
                  : 'S/ ' + register.difference}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
)

export default SalesReportPDF
