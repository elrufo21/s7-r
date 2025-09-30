import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#333333',
    fontFamily: 'Helvetica',
    // fontFamily: 'Montserrat', 
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
    marginTop: 10,
    marginBottom: 8,
    color: '#000',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 9,
    color: '#000',
  },
  dateRange: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
    // fontStyle: 'italic',
  },
  section: {
    marginBottom: 15,
    // border: '1px solid #cccccc',
    // borderRadius: 6,
  },
  sectionTitle: {
    backgroundColor: '#cfd0d2',
    color: '#000',
    fontWeight: 'bold',
    padding: 3,
    fontSize: 10,
    marginBottom: 0,
    // borderTopLeftRadius: 5,
    // borderTopRightRadius: 5,
    textAlign: 'left',
  },

  // Head - ini
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 0,
    // paddingLeft: 3,
    // paddingRight: 3,
    // paddingTop: 8,
    // paddingBottom: 3,
    // fontSize: 10,
    // backgroundColor: '#fff',
    // fontWeight: 'bold',
    // color: '#000',
    // borderBottom: '1px solid #000',

    backgroundColor: '#cfd0d2',
    color: '#000',
    fontWeight: 'bold',
    padding: 3,
    fontSize: 10,
    marginBottom: 0,
    // borderTopLeftRadius: 5,
    // borderTopRightRadius: 5,
    textAlign: 'left',
  },
  sectionHeadTitle: {
    flex: 4,
    fontWeight: 'bold',
  },
  sectionHeadQuantity: {
    flex: 1,
    textAlign: 'right',
  },
  sectionHeadAmount: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  // Head - fin

  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 8,
    paddingBottom: 3,
    fontSize: 10,
    backgroundColor: '#fff',
    fontWeight: 'bold',
    color: '#000',
    borderBottom: '1px solid #000',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 10,
    paddingRight: 3,
    paddingTop: 6,
    paddingBottom: 3,
    fontSize: 10,
    backgroundColor: '#fff',
    borderBottom: '1px solid #f5f5f5',
  },
  productName: {
    flex: 4,
    color: '#000',
  },
  productQuantity: {
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  productAmount: {
    flex: 1,
    textAlign: 'right',
    // fontWeight: 'bold',
    color: '#000',
  },
  categoryName: {
    flex: 4,
    fontWeight: 'bold',
  },
  categoryQuantity: {
    flex: 1,
    textAlign: 'right',
  },
  categoryAmount: {
    flex: 1,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalRow: {
    // backgroundColor: '#fff',
    // backgroundColor: '#cfd0d2',
    backgroundColor: '#f0f1f2',
    color: '#000',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
    // borderBottomLeftRadius: 5,
    // borderBottomRightRadius: 5,
    // borderTopWidth: 1,
    // borderTopColor: '#000',
  },
  totalLabel: {
    flex: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalQuantity: {
    flex: 1,
    textAlign: 'right',
    fontSize: 10,
  },
  totalAmount: {
    flex: 1,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: 'bold',
  },
  /*
  table: {
    width: '100%',
    marginTop: 5,
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid #cccccc',
  },
  */
  tableHeader: {
    paddingTop: 6,
    // padding: 3,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // borderBottomWidth: 2,
    // borderBottomColor: '#cccccc',
    // fontWeight: 'bold',
  },
  tableRow: {
    paddingTop: 4,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // borderBottomWidth: 1,
    // borderBottomColor: '#f5f5f5',
  },
  /*
  tableRowEven: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  */
  tableCellLeft: {
    flex: 2,
    padding: 3,
    fontSize: 10,
    textAlign: 'left',
    // borderRightWidth: 1,
    // borderRightColor: '#cccccc',
    color: '#000',
  },
  tableCellCenter: {
    flex: 1,
    padding: 3,
    fontSize: 10,
    textAlign: 'center',
    // borderRightWidth: 1,
    // borderRightColor: '#cccccc',
    color: '#000',
  },
  tableCellRight: {
    flex: 1,
    padding: 3,
    fontSize: 10,
    textAlign: 'right',
    color: '#000',
  },
  tableCellHeaderLeft: {
    flex: 2,
    padding: 3,
    fontSize: 10,
    textAlign: 'left',
    // borderRightWidth: 1,
    // borderRightColor: '#cccccc',
    color: '#000',
    fontWeight: 'bold',
  },
  /*
  tableCellHeaderCenter: {
    flex: 1,
    padding: 10,
    fontSize: 11,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
    color: '#000',
    fontWeight: 'bold',
  },
  */
  tableCellHeaderRight: {
    flex: 1,
    padding: 3,
    fontSize: 10,
    textAlign: 'right',
    color: '#000',
    fontWeight: 'bold',
  },
  rightBox: {
    border: '1px solid #cccccc',
    padding: 8,
    fontSize: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
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
  report_name: 'REPORTE DE VENTAS POR SESIÓN',
  session_id: 'P1/00008',
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

      {/*
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLeft}>{salesReportData.company_name}</Text>
          <Text style={styles.headerLeft}>{salesReportData.ln1_name}</Text>
        </View>
        <View style={styles.rightBox}>
          <Text>A partir del {formatDateShort(salesReportData.date_generated)}</Text>
        </View>
      </View>
      */}

      <Text style={styles.title}>{salesReportData.report_name}</Text>
      <Text style={styles.subtitle}>ID SESIÓN: {salesReportData.session_id}</Text>
      <Text style={styles.dateRange}>
        {formatDate(salesReportData.date_start)} - {formatDate(salesReportData.date_end)}
      </Text>

      <View style={styles.section}>

        {/* c1 */}
        {/* <Text style={styles.sectionTitle}>Ventas</Text> */}

        <View style={styles.sectionHead}>
          <Text style={styles.sectionHeadTitle}>Ventas</Text>
          <Text style={styles.sectionHeadQuantity}>Cantidad</Text>
          <Text style={styles.sectionHeadAmount}>Total</Text>
        </View>

        {/* Categorías */}
        {data.products.map((category, index) => (
          <View key={`category-${index}`}>
            {/* Categoría */}
            <View style={styles.categoryRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryQuantity}></Text>
              <Text style={styles.categoryAmount}></Text>
            </View>

            {/* Productos de esta categoría */}
            {category.products.map((product, productIndex) => (
              <View key={`product-${productIndex}`} style={styles.productRow}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productQuantity}>{product.quantity}</Text>
                <Text style={styles.productAmount}>
                  {formatAmount(product.amount_withtaxed_total, 'S/ ')}
                </Text>
              </View>
            ))}
          </View>
        ))}

        {/* Total de ventas */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalQuantity}>{getTotals(data.products).totalQuantity}</Text>
          <Text style={styles.totalAmount}>
            {formatAmount(getTotals(data.products).totalAmount, 'S/ ')}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control de sesión</Text>

        {/* <View style={styles.table}> */}

        <View style={styles.tableHeader}>
          <Text style={styles.tableCellHeaderLeft}>Método de pago</Text>
          <Text style={styles.tableCellHeaderRight}>Esperado</Text>
          <Text style={styles.tableCellHeaderRight}>Contado</Text>
          <Text style={styles.tableCellHeaderRight}>Diferencia</Text>
        </View>

        {data.control.map((register, index) => (
          <View
            key={`register-${index}`}
            // style={index % 2 === 0 ? styles.tableRow : styles.tableRowEven}
            style={styles.tableRow}
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

        {/* </View> */}

      </View>
    </Page>
  </Document>
)

export default SalesReportPDF
