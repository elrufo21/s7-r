import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    color: '#262626',
    fontFamily: 'Helvetica',
    fontSize: '12px',
    padding: '40px 40px',
  },
  header: {
    backgroundColor: '#e9e9e9',
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  section: {
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    backgroundColor: '#e9e9e9',
    fontWeight: 'bold',
    padding: 4,
    fontSize: 12,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  table: {
    width: '100%',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e9e9e9',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 4,
    fontSize: 12,
    textAlign: 'right',
  },
  tableCellLeft: {
    flex: 2,
    padding: 4,
    fontSize: 12,
    textAlign: 'left',
  },
  small: {
    fontSize: 10,
  },
  mt5: { marginTop: 5 },
  mb5: { marginBottom: 5 },
  rightBox: {
    border: '1px solid #000',
    padding: 4,
    fontSize: 10,
    alignSelf: 'flex-end',
  },
})

const SessionReport = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.small}>Agropetunia</Text>
          <Text style={styles.small}>Perú</Text>
        </View>
        <View style={styles.rightBox}>
          <Text>A partir del 03/07/2025</Text>
        </View>
      </View>
      <Text style={styles.title}>Reporte diario de ventas Z</Text>
      <Text style={styles.subtitle}>ID de la sesión: PUNTO DE VENTA DOS/00008</Text>
      <Text style={[styles.small, styles.mb5]}>02/07/2025 01:16:11 - 02/07/2025 01:16:29</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Efectivo PUNTO DE VENTA DOS/00008</Text>
          <Text>S/ 0,00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descuentos</Text>
        <View style={styles.row}>
          <Text>Número de descuentos: 0</Text>
        </View>
        <View style={styles.row}>
          <Text>Importe de los descuentos: S/ 0,00</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control de la sesión</Text>
        <View style={styles.row}>
          <Text>Total: S/0,00</Text>
        </View>
        <View style={styles.row}>
          <Text>Número de transacciones: 0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellLeft}>Nombre</Text>
            <Text style={styles.tableCell}>Esperado</Text>
            <Text style={styles.tableCell}>Contado</Text>
            <Text style={styles.tableCell}>Diferencia</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.tableCellLeft}>Efectivo PUNTO DE VENTA DOS/00008</Text>
            <Text style={styles.tableCell}>S/0,00</Text>
            <Text style={styles.tableCell}>S/0,00</Text>
            <Text style={styles.tableCell}>S/0,00</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
)

export default SessionReport
