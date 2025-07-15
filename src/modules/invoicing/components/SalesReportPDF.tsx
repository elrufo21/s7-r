import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#262626',
    fontFamily: 'Helvetica',
    fontSize: '11px',
    padding: '20px 30px',
  },
  header: {
    backgroundColor: '#e9e9e9',
    padding: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    fontSize: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 3,
  },
  dateRange: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    marginTop: 0,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: '#d0d0d0',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 11,
    marginBottom: 0,
  },
  subSectionTitle: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 10,
    marginBottom: 0,
    marginTop: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 20,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
  },
  totalRow: {
    backgroundColor: '#e9e9e9',
    fontWeight: 'bold',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 10,
  },
  table: {
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d0d0d0',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  tableCellLeft: {
    flex: 2,
    padding: 6,
    fontSize: 10,
    textAlign: 'left',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableCellCenter: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  tableCellRight: {
    flex: 1,
    padding: 6,
    fontSize: 10,
    textAlign: 'center',
  },
  rightBox: {
    border: '1px solid #000',
    padding: 6,
    fontSize: 10,
    alignSelf: 'flex-end',
  },
})

const SalesReportPDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLeft}>Agropetunia</Text>
          <Text style={styles.headerLeft}>Perú</Text>
        </View>
        <View style={styles.rightBox}>
          <Text>A partir del 03/07/2025</Text>
        </View>
      </View>

      <Text style={styles.title}>Reporte diario de ventas Z</Text>
      <Text style={styles.subtitle}>ID de la sesión: PUNTO DE VENTA DOS/00008</Text>
      <Text style={styles.dateRange}>02/07/2025 01:16:11 - 02/07/2025 01:16:29</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ventas</Text>
        <View style={styles.row}>
          <Text>Chairs</Text>
          <Text>6.0</Text>
          <Text>S/420.00</Text>
        </View>
        <View style={styles.productRow}>
          <Text>[FURN_7777] Office Chair</Text>
          <Text>6.0 Unidades</Text>
          <Text>S/420.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>6.0</Text>
          <Text>S/420.00</Text>
        </View>

        <Text style={styles.subSectionTitle}>Impuestos sobre las ventas</Text>
        <View style={styles.row}>
          <Text>IGV 18%</Text>
          <Text>S/75.60</Text>
          <Text>S/420.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>S/75.60</Text>
          <Text>S/420.00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reembolsos</Text>
        <View style={styles.row}>
          <Text>Chairs</Text>
          <Text>6.0</Text>
          <Text>S/-420.00</Text>
        </View>
        <View style={styles.productRow}>
          <Text>[FURN_7777] Office Chair</Text>
          <Text>6.0 Unidades</Text>
          <Text>S/-420.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>6.0</Text>
          <Text>S/-420.00</Text>
        </View>

        <Text style={styles.subSectionTitle}>Impuestos sobre los reembolsos</Text>
        <View style={styles.row}>
          <Text>IGV 18%</Text>
          <Text>S/-75.60</Text>
          <Text>S/-420.00</Text>
        </View>
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>S/-75.60</Text>
          <Text>S/-420.00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos</Text>
        <View style={styles.paymentRow}>
          <Text>Efectivo PUNTO DE VENTA DOS/00008</Text>
          <Text>S/0.00</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text>Efectivo POS Agropetunia/00007</Text>
          <Text>S/-495.60</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text>Efectivo POS 2 Agropetunia/00007</Text>
          <Text>S/495.60</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descuentos</Text>
        <View style={styles.row}>
          <Text>Número de descuentos: 0</Text>
        </View>
        <View style={styles.row}>
          <Text>Importe de los descuentos: S/ 0.00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control de la sesión</Text>
        <View style={styles.row}>
          <Text>Total: S/0.00</Text>
        </View>
        <View style={styles.row}>
          <Text>Número de transacciones: 4</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellLeft}>Nombre</Text>
            <Text style={styles.tableCellCenter}>Esperado</Text>
            <Text style={styles.tableCellCenter}>Contado</Text>
            <Text style={styles.tableCellRight}>Diferencia</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellLeft}>Efectivo PUNTO DE VENTA DOS/00008</Text>
            <Text style={styles.tableCellCenter}>S/0.00</Text>
            <Text style={styles.tableCellCenter}>S/0.00</Text>
            <Text style={styles.tableCellRight}>S/0.00</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default SalesReportPDF
