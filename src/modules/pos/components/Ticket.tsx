import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: '20px',
    fontFamily: 'Helvetica',
    fontSize: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '80mm',
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logoPlaceholder: {
    marginBottom: 10,
    color: '#6b5b95',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ticketInfo: {
    width: '100%',
    textAlign: 'center',
    marginBottom: 15,
  },
  ticketNumber: {
    fontSize: 10,
    marginBottom: 2,
  },
  dateTime: {
    fontSize: 10,
    marginBottom: 2,
  },
  servedBy: {
    fontSize: 10,
    marginBottom: 10,
  },
  items: {
    width: '100%',
    marginBottom: 15,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemQty: {
    width: '10%',
  },
  itemDetails: {
    width: '60%',
    flexDirection: 'column',
  },
  itemUnitPrice: {
    fontSize: 8,
    color: '#333',
  },
  itemTotal: {
    width: '30%',
    textAlign: 'right',
  },
  summary: {
    width: '100%',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 8,
    color: '#666',
  },
})

const TicketPDF = ({ info, finalCustomer }: any) => {
  const getTotalPrice = () => {
    if (!info.lines || info.lines.length === 0) {
      return '0.00'
    }

    return info.lines
      .filter((item: any) => item.type !== 'SECTION' && item.type !== 'NOTE')
      .reduce((total: number, item: any) => total + (item.quantity * item.price_unit || 0), 0)
      .toFixed(2)
  }
  const total = parseFloat(getTotalPrice())
  const subtotal = total / 1.18
  const igv = total - subtotal

  function formatDateToDDMMYYYY(date: any) {
    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) {
      return 'Fecha inválida'
    }

    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()

    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')

    const period = hours >= 12 ? 'p.m.' : 'a.m.'

    hours = hours % 12
    hours = hours ? hours : 12

    return `${day}/${month}/${year}, ${hours}:${minutes} ${period}`
  }

  return (
    <PDFViewer width="100%" className="h-screen">
      <Document>
        <Page size={[226, 500]} style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logoPlaceholder}>S7</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.ticketNumber}>Ticket {info.name}</Text>
            <Text style={styles.dateTime}>
              {info.invoice_date || formatDateToDDMMYYYY(new Date())}
            </Text>
            <Text style={styles.servedBy}>Servido por: {finalCustomer.name}</Text>
          </View>

          <View style={styles.items}>
            {info.lines &&
              info.lines.map((item: any, index: number) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemQty}>{item.quantity}</Text>
                  <View style={styles.itemDetails}>
                    <Text>{item.name}</Text>
                    <Text style={styles.itemUnitPrice}>
                      S/ {item.price_unit ? item.price_unit.toFixed(2) : '0.00'} / Unidades
                    </Text>
                  </View>
                  <Text style={styles.itemTotal}>
                    S/ {item.price_unit ? (item.quantity * item.price_unit).toFixed(2) : '0.00'}
                  </Text>
                </View>
              ))}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>S/ {subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>IGV</Text>
              <Text>S/ {igv.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.bold}>Total</Text>
              <Text style={styles.bold}>S/ {total.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>Factura electrónica S7</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  )
}

export default TicketPDF
