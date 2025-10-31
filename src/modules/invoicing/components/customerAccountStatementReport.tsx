import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

// Cada fila individual del reporte
export interface CustomerAccountItem {
  date: string
  document_number: string
  type: string
  quantity: number | string
  detail: string
  price: number | string
  total: number | string
  total_balance: number | string
  debt_d_1?: string | number
  debt_d?: string | number
  debt_total?: string | number
  payments_d?: string | number
  in_payments?: string | number
  debt_total_d?: string | number
  isLastOfOrder?: boolean
}
interface RecordItem {
  total?: number | string
  in_payments?: number | string
  total_balance?: number | string
}

interface Totals {
  ingresos: number
  salidas: number
  deudaTotal: number
}
export const calcularIngresosYSalidas = (records: RecordItem[]): Totals => {
  let ingresos = 0
  let salidas = 0
  let deudaTotal = 0

  records.forEach((item) => {
    ingresos += Number(item.in_payments) || 0
    salidas += Number(item.total) || 0
  })

  const ultimoConSaldo = [...records]
    .reverse()
    .find((r) => r.total_balance !== undefined && r.total_balance !== '')
  deudaTotal = ultimoConSaldo ? Number(ultimoConSaldo.total_balance) : 0

  return { ingresos, salidas, deudaTotal }
}

export interface CustomerAccountReportData {
  customer: {
    name: string
    document?: string
    date?: string
  }
  records: CustomerAccountItem[]
}

interface CustomerAccountStatementReportProps {
  data: CustomerAccountReportData
}

export const downloadCustomerAccountsReportPDF = async ({
  data,
}: CustomerAccountStatementReportProps): Promise<void> => {
  const blob = await pdf(<CustomerAccountStatementReport data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reporte-cuentas-${new Date().toISOString().split('T')[0]}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

const calculateTotals = (records: CustomerAccountItem[]) => {
  return records.reduce(
    (acc, item) => ({
      debt_d_1: acc.debt_d_1 + (parseFloat(item.debt_d_1 as string) || 0),
      debt_d: acc.debt_d + (parseFloat(item.debt_d as string) || 0),
      debt_total: acc.debt_total + (parseFloat(item.debt_total as string) || 0),
      payments_d: acc.payments_d + (parseFloat(item.payments_d as string) || 0),
      debt_total_d: acc.debt_total_d + (parseFloat(item.debt_total_d as string) || 0),
    }),
    { debt_d_1: 0, debt_d: 0, debt_total: 0, payments_d: 0, debt_total_d: 0 }
  )
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  headerSection: {
    marginBottom: 10,
  },
  titleBlock: {
    marginBottom: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: { fontSize: 9, color: '#000' },
  totalsWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  totalsBlock: {
    borderWidth: 1,
    borderColor: '#000',
    width: '30%',
    marginRight: '10%',
  },
  totalsHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  totalsHeaderCell: {
    width: '33.33%',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  totalsRow: { flexDirection: 'row' },
  totalCell: {
    width: '33.33%',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingVertical: 5,
  },
  totalCellLast: { borderRightWidth: 0 },
  totalValue: { fontSize: 9, fontWeight: 'bold', color: '#000' },
  redText: { color: '#c62828' },
  blueText: { color: '#1565c0' },
  headerRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
  },
  headerCell: {
    width: '10%',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
  },
  bigHeaderCell: {
    width: '15%',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
  },
  headerCellLast: { borderRightWidth: 0 },
  dataRow: {
    flexDirection: 'row',
  },
  dataCell: {
    width: '10%',
    fontSize: 9,
    color: '#000',
    textAlign: 'right',
    padding: 4,
  },
  dataCellBig: {
    width: '15%',
    fontSize: 9,
    color: '#000',
    textAlign: 'left',
    padding: 4,
  },
  borderBottonRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  dataCellLast: { borderRightWidth: 0 },
})

const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === '') return ''
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num))
}

const CustomerAccountStatementReport = ({ data }: CustomerAccountStatementReportProps) => {
  const { customer, records } = data
  const { ingresos, salidas, deudaTotal } = calcularIngresosYSalidas(data.records)
  const totals = calculateTotals(records)

  const formattedDate = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date())

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerSection}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Reporte de estado de cuentas de cliente</Text>
            <Text style={styles.subtitle}>Cliente: {customer.name}</Text>
            <Text style={styles.subtitle}>Periodo: {customer.date}</Text>
          </View>

          <View style={{ display: 'flex' }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                marginBottom: 5,
                marginLeft: '65%',
              }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  paddingVertical: 4,
                  paddingHorizontal: 12,
                  backgroundColor: '#f0f0f0',
                  minWidth: 120,
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center' }}>
                  Deuda: {deudaTotal.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.totalsWrapper}>
              <View style={styles.totalsBlock}>
                <View style={styles.totalsHeaderRow}>
                  <Text style={styles.totalsHeaderCell}>TOTAL</Text>
                  <Text style={styles.totalsHeaderCell}>SALIDAS</Text>
                  <Text style={[styles.totalsHeaderCell, styles.totalCellLast]}>INGRESOS</Text>
                </View>
                <View style={styles.totalsRow}>
                  <View style={styles.totalCell}>
                    <Text style={styles.totalValue}></Text>
                  </View>
                  <View style={styles.totalCell}>
                    <Text style={[styles.totalValue, styles.redText]}>{salidas}</Text>
                  </View>
                  <View style={[styles.totalCell, styles.totalCellLast]}>
                    <Text style={[styles.totalValue, styles.blueText]}>{ingresos}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Cabecera de tabla */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>FECHA</Text>
          <Text style={styles.headerCell}>NRO DOC</Text>
          <Text style={styles.bigHeaderCell}>TIPO</Text>
          <Text style={styles.headerCell}>KILOS CANTI</Text>
          <Text style={styles.bigHeaderCell}>DETALLE</Text>
          <Text style={styles.headerCell}>Precio</Text>
          <Text style={styles.headerCell}>SALIDA VENTAS</Text>
          <Text style={styles.headerCell}>INGRESO PAGOS</Text>
          <Text style={[styles.headerCell, styles.headerCellLast]}>SALDO</Text>
        </View>

        {/* Filas */}
        {records.map((item, index) => (
          <View
            key={index}
            style={item.isLastOfOrder ? [styles.dataRow, styles.borderBottonRow] : styles.dataRow}
          >
            <Text style={styles.dataCell}>{item.date.split('T')[0]}</Text>
            <Text style={styles.dataCell}>{item.document_number}</Text>
            <Text style={styles.dataCellBig}>{item.type}</Text>
            <Text style={styles.dataCell}>{item.quantity}</Text>
            <Text style={[styles.dataCellBig, styles.redText]}>{item.detail}</Text>
            <Text style={[styles.dataCell, styles.redText]}>{item.price}</Text>
            <Text style={styles.dataCell}>{item.total}</Text>
            <Text style={styles.dataCell}>{item.in_payments}</Text>
            <Text style={[styles.dataCell, styles.dataCellLast, styles.blueText]}>
              {item.total_balance}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export default CustomerAccountStatementReport
