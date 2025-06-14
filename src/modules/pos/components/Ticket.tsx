import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

// Crear estilos
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
  itemNumber: {
    width: '5%',
  },
  itemDescription: {
    width: '60%',
  },
  itemPrice: {
    width: '35%',
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

// Componente principal del Ticket
const TicketPDF = ({ info, finalCustomer }: any) => {
  // Esta función calcula el total de los move_lines (si los hubiera)
  const getTotalPrice = () => {
    if (!info.move_lines || info.move_lines.length === 0) {
      return '0.00'
    }

    return info.move_lines
      .filter((item: any) => item.type !== 'SECTION' && item.type !== 'NOTE')
      .reduce((total: number, item: any) => total + (item.quantity * item.price_unit || 0), 0)
      .toFixed(2)
  }
  function formatDateToDDMMYYYY(date: any) {
    // Si recibimos un string, lo convertimos a objeto Date
    const d = date instanceof Date ? date : new Date(date)

    // Verificar si la fecha es válida
    if (isNaN(d.getTime())) {
      return 'Fecha inválida'
    }

    // Obtener componentes de la fecha
    const day = d.getDate() // día sin ceros a la izquierda
    const month = d.getMonth() + 1 // mes sin ceros a la izquierda (enero es 0)
    const year = d.getFullYear()

    // Obtener componentes de la hora
    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0') // minutos con ceros a la izquierda

    // Determinar si es a.m. o p.m.
    const period = hours >= 12 ? 'p.m.' : 'a.m.'

    // Convertir a formato de 12 horas
    hours = hours % 12
    hours = hours ? hours : 12 // las 0 horas deben mostrarse como 12 en formato 12h

    // Construir el string de fecha formateado
    return `${day}/${month}/${year}, ${hours}:${minutes} ${period}`
  }

  return (
    <PDFViewer width="100%" className="h-screen">
      <Document>
        <Page size={[226, 500]} style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.logoPlaceholder}>🖼 Your logo</Text>
          </View>

          <View style={styles.ticketInfo}>
            <Text style={styles.ticketNumber}>Ticket {info.name}</Text>
            <Text style={styles.dateTime}>
              {info.invoice_date || formatDateToDDMMYYYY(new Date())}
            </Text>
            <Text style={styles.servedBy}>Servido por: {finalCustomer.name}</Text>
          </View>

          <View style={styles.items}>
            {info.move_lines &&
              info.move_lines.map((item: any, index: number) => (
                <View key={index} style={styles.item}>
                  <Text style={styles.itemNumber}>{item.quantity}</Text>
                  <Text style={styles.itemDescription}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    S/ {item.price_unit ? item.price_unit.toFixed(2) : '0.00'}
                  </Text>
                </View>
              ))}
            {/* Fallback para demostración si no hay move_lines */}
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>
                S/{' '}
                {parseFloat(getTotalPrice()) > 0
                  ? (parseFloat(getTotalPrice()) * 0.82).toFixed(2)
                  : '20.00'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>IGV</Text>
              <Text>
                S/{' '}
                {parseFloat(getTotalPrice()) > 0
                  ? (parseFloat(getTotalPrice()) * 0.18).toFixed(2)
                  : '3.60'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.bold}>Total</Text>
              <Text style={styles.bold}>
                S/ {parseFloat(getTotalPrice()) > 0 ? getTotalPrice() : '23.60'}
              </Text>
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
