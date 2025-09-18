import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: '20px',
    fontFamily: 'Helvetica',
    fontSize: 11,
    display: 'flex',
    flexDirection: 'column',
  },

  // Encabezado con fecha
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },

  // Sección de ventas cobradas
  salesSection: {
    backgroundColor: '#4a5568',
    color: '#fff',
    padding: '8px',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  salesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  salesAmount: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Cuadro amarillo de total
  totalSection: {
    backgroundColor: '#f6e05e',
    padding: '8px',
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #d69e2e',
  },

  totalTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },

  totalAmount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },

  // Tabla
  table: {
    width: '100%',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a5568',
    color: '#fff',
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 10,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 3,
    borderBottom: '0.5px solid #e2e8f0',
    fontSize: 9,
  },

  // Columnas de la tabla
  productCol: { width: '25%', paddingLeft: 4 },
  brutCol: { width: '15%', textAlign: 'center' },
  taraCol: { width: '12%', textAlign: 'center' },
  mermaCol: { width: '12%', textAlign: 'center' },
  netoCol: { width: '15%', textAlign: 'center' },
  totalCol: { width: '21%', textAlign: 'right', paddingRight: 4 },

  // Headers
  headerCell: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },

  // Data cells
  dataCell: {
    fontSize: 9,
  },

  dataCellCenter: {
    textAlign: 'center',
    fontSize: 9,
  },

  dataCellRight: {
    textAlign: 'right',
    fontSize: 9,
  },
})

interface ProductSale {
  name: string
  pBruto: number
  tara: number
  merma: number
  pNeto: number
  totalDinero: number
}

interface TotalSalesTodayPDFProps {
  salesData: ProductSale[]
  totalAmount: number
  date?: string
  isPreview?: boolean
}

const TotalSalesTodayPDF = ({
  salesData,
  totalAmount,
  date,
  isPreview = false,
}: TotalSalesTodayPDFProps) => {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) {
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      return `${day}/${month}/${year}`
    }

    const d = new Date(dateStr)
    const day = d.getDate()
    const month = d.getMonth() + 1
    const year = d.getFullYear()
    return `${day}/${month}/${year}`
  }

  const documentContent = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Fecha */}
        <Text style={styles.dateHeader}>{formatDate(date)}</Text>

        {/* Sección de ventas cobradas */}
        <View style={styles.salesSection}>
          <Text style={styles.salesTitle}>VENTAS COBRADAS EN CAJA</Text>
          <Text style={styles.salesAmount}>
            MONTO DEL DIA {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 1 })}
          </Text>
        </View>

        {/* Cuadro amarillo de total */}
        <View style={styles.totalSection}>
          <Text style={styles.totalTitle}>VENTA TOTAL DEL DIA</Text>
          <Text style={styles.totalAmount}>
            {totalAmount.toLocaleString('es-PE', { minimumFractionDigits: 1 })}
          </Text>
        </View>

        {/* Tabla */}
        <View style={styles.table}>
          {/* Encabezado de tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.productCol]}>PRODUCTO</Text>
            <Text style={[styles.headerCell, styles.brutCol]}>P BRUTO</Text>
            <Text style={[styles.headerCell, styles.taraCol]}>TARA</Text>
            <Text style={[styles.headerCell, styles.mermaCol]}>MERMA</Text>
            <Text style={[styles.headerCell, styles.netoCol]}>P NETO</Text>
            <Text style={[styles.headerCell, styles.totalCol]}>TOTAL DINERO</Text>
          </View>

          {/* Filas de datos */}
          {salesData.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.dataCell, styles.productCol]}>{product.name}</Text>
              <Text style={[styles.dataCellCenter, styles.brutCol]}>
                {product.pBruto.toFixed(1)}
              </Text>
              <Text style={[styles.dataCellCenter, styles.taraCol]}>{product.tara.toFixed(1)}</Text>
              <Text style={[styles.dataCellCenter, styles.mermaCol]}>
                {product.merma.toFixed(1)}
              </Text>
              <Text style={[styles.dataCellCenter, styles.netoCol]}>
                {product.pNeto.toFixed(1)}
              </Text>
              <Text style={[styles.dataCellRight, styles.totalCol]}>
                {product.totalDinero.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )

  // Si es para preview, mostramos con PDFViewer, si no, solo retornamos el Document
  if (isPreview) {
    return (
      <PDFViewer width="100%" className="h-screen">
        {documentContent}
      </PDFViewer>
    )
  }

  return documentContent
}

export default TotalSalesTodayPDF
