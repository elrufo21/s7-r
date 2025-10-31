import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'

const sampleData = []

export const downloadAccountsReportPDF = async (data: any[]) => {
  const blob = await pdf(<AccountsReport data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reporte-cuentas-${new Date().toISOString().split('T')[0]}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

const calculateTotals = (data) => {
  return data.reduce(
    (acc, item) => ({
      debt_d_1: acc.debt_d_1 + (parseFloat(item.debt_d_1) || 0),
      debt_d: acc.debt_d + (parseFloat(item.debt_d) || 0),
      debt_total: acc.debt_total + (parseFloat(item.debt_total) || 0),
      payments_d: acc.payments_d + (parseFloat(item.payments_d) || 0),
      debt_total_d: acc.debt_total_d + (parseFloat(item.debt_total_d) || 0),
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: '#000',
  },
  totalsBlock: {
    borderWidth: 1,
    borderColor: '#000',
    width: '75%',
  },
  totalsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  totalsRow: {
    flexDirection: 'row',
  },
  totalCell: {
    width: '20%',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000',
    paddingVertical: 5,
  },
  totalCellLast: {
    borderRightWidth: 0,
  },
  emptyCell: {
    width: '25%',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  totalValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000',
  },
  redText: {
    color: '#c62828',
  },
  blueText: {
    color: '#1565c0',
  },
  headerRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f8f8f8',
  },
  headerCell: {
    width: '15%',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
  },
  customerCell: {
    width: '25%',
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 4,
  },
  headerCellLast: {
    borderRightWidth: 0,
  },
  dataRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  dataCell: {
    width: '15%',
    fontSize: 9,
    color: '#000',
    textAlign: 'right',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  dataCustomerCell: {
    width: '25%',
    fontSize: 9,
    color: '#000',
    textAlign: 'left',
    padding: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#d0d0d0',
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
  dataCellLast: {
    borderRightWidth: 0,
  },
})

const formatNumber = (num) => {
  if (num === null || num === undefined || num === '') return ''
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num))
}

const AccountsReport = ({ data, reportDate = new Date() }) => {
  const totals = calculateTotals(data)

  const formattedDate = new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(reportDate)

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerSection}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>Reporte de cuentas de cliente</Text>
            <Text style={styles.subtitle}>Actualizado hasta el {formattedDate}</Text>
          </View>

          {/* Totales */}
          <View style={styles.totalsBlock}>
            <Text style={styles.totalsTitle}>TOTALES</Text>
            <View style={styles.totalsRow}>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>{formatNumber(totals.debt_d_1)}</Text>
              </View>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>{formatNumber(totals.debt_d)}</Text>
              </View>
              <View style={styles.totalCell}>
                <Text style={styles.totalValue}>{formatNumber(totals.debt_total_d)}</Text>
              </View>
              <View style={styles.totalCell}>
                <Text style={[styles.totalValue, styles.redText]}>
                  {formatNumber(totals.payments_d)}
                </Text>
              </View>
              <View style={[styles.totalCell, styles.totalCellLast]}>
                <Text style={[styles.totalValue, styles.blueText]}>
                  {formatNumber(totals.debt_total)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Cabecera de tabla */}
        <View style={styles.headerRow}>
          <Text style={styles.customerCell}>Clientes</Text>
          <Text style={styles.headerCell}>DEUDA HASTA{'\n'}AYER</Text>
          <Text style={styles.headerCell}>DEUDA{'\n'}DEL DÍA</Text>
          <Text style={styles.headerCell}>TOTAL DEUDA</Text>
          <Text style={styles.headerCell}>PAGOS{'\n'}DEL DÍA</Text>
          <Text style={[styles.headerCell, styles.headerCellLast]}>DEUDA FINAL</Text>
        </View>

        {/* Filas de datos */}
        {data.map((item, index) => (
          <View key={index} style={styles.dataRow}>
            <Text style={styles.dataCustomerCell}>{item.partner_name}</Text>
            <Text style={styles.dataCell}>{formatNumber(item.debt_d_1)}</Text>
            <Text style={styles.dataCell}>{formatNumber(item.debt_d)}</Text>
            <Text style={styles.dataCell}>{formatNumber(item.debt_total_d)}</Text>
            <Text style={[styles.dataCell, styles.redText]}>{formatNumber(item.payments_d)}</Text>
            <Text style={[styles.dataCell, styles.dataCellLast, styles.blueText]}>
              {formatNumber(item.debt_total)}
            </Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}

export default AccountsReport
