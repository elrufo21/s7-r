import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { formatPlain } from '@/shared/utils/dateUtils'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  header: { padding: 8, marginBottom: 16, borderBottom: 1 },
  headerText: { fontSize: 14, fontWeight: 'bold' },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  boldText: { fontWeight: 'bold', fontSize: 11 },
  section: { marginTop: 20, paddingTop: 12, borderTop: 1 },
  rightHeaderRow: { flexDirection: 'row', marginBottom: 6, fontSize: 9, fontWeight: 'bold' },
  emptyCol: { width: '40%' },
  rightHeaderText: { width: '20%', textAlign: 'right' },

  mainRow: { flexDirection: 'row', marginBottom: 8, paddingVertical: 4 },
  colMethod: { width: '40%', fontWeight: 'bold', fontSize: 11 },
  colTotal: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
  colContado: { width: '20%', textAlign: 'right', fontWeight: 'bold' },
  colDiff: { width: '20%', textAlign: 'right', fontWeight: 'bold' },

  detailRow: {
    flexDirection: 'row',
    paddingVertical: 2,
  },

  detailName: { width: '40%', fontSize: 9 },
  detailTotal: { width: '20%', textAlign: 'right', fontSize: 9 },
  detailContado: { width: '20%', textAlign: 'right', fontSize: 9 },
  detailDiff: { width: '20%', textAlign: 'right', fontSize: 9 },
  nestedDetailName: {
    width: '40%',
    fontSize: 9,
    paddingLeft: 14,
  },
})

const fmts = (v) =>
  v > 0 ? `+ S/ ${v?.toFixed(2)}` : v < 0 ? `- S/ ${Math?.abs(v)?.toFixed(2)}` : `S/ 0.00`

const fmt = (v = 0) => `S/ ${v.toFixed(2)}`

const summarizeByOrigin = (in_out, paymentMethodId) => {
  const ingresos = (in_out.in || []).filter(
    (m) => m.payment_method_id === paymentMethodId && m.origin === 'P'
  )

  const salidas = (in_out.out || []).filter(
    (m) => m.payment_method_id === paymentMethodId && m.origin === 'P'
  )

  return { ingresos, salidas }
}

const CashSessionReport = ({ report, in_out }) => {
  const session = report.session[0]
  const methods = report.payment_methods

  const openingAmount = session.initial_cash || 0
  const totalGeneral = methods.reduce((s, m) => s + m.amount, 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Control de la sesión</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text>Sesión</Text>
          <Text>{report.session_name ?? ''}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Estado</Text>
          <Text>{report.state == 'R' ? 'Cerrado y registrado' : 'Activo'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Punto de venta</Text>
          <Text>{report.pos_name ?? ''}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Abierto por</Text>
          <Text>{report.user_name ?? ''}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Fecha de apertura</Text>
          <Text>{formatPlain(report.start_at) ?? ''}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Fecha de cierre</Text>
          <Text>{formatPlain(report.stop_at) ?? ''}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Saldo inicial</Text>
          <Text>{fmt(openingAmount || 0)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Saldo final</Text>
          <Text>{fmt(report.final_cash || 0)}</Text>
        </View>

        {methods.map((m, i) => {
          const esperado = m.amount ?? 0
          const contado = m.counted || 0
          const diferencia = m.difference ?? esperado - contado

          const { ingresos, salidas } = summarizeByOrigin(in_out, m.payment_method_id)

          return (
            <View key={m.payment_method_id} style={styles.section}>
              <View style={styles.rightHeaderRow}>
                <Text style={styles.emptyCol}></Text>
                <Text style={styles.emptyCol}></Text>
                <Text style={styles.rightHeaderText}>Contado</Text>
                <Text style={styles.rightHeaderText}>Diferencia</Text>
              </View>

              <View style={styles.mainRow}>
                <Text style={styles.colMethod}>{m.payment_method_name}</Text>
                <Text style={styles.colTotal}>{fmt(esperado)}</Text>
                <Text style={styles.colContado}>{fmt(contado)}</Text>
                <Text style={styles.colDiff}>S/{diferencia.toFixed(2)}</Text>
              </View>

              {i === 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailName}>Apertura</Text>
                  <Text style={styles.detailTotal}>{fmt(openingAmount)}</Text>
                  <Text style={styles.detailContado}></Text>
                  <Text style={styles.detailDiff}></Text>
                </View>
              )}

              {m.amount_sales > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailName}>Pagos por ventas</Text>
                  <Text style={styles.detailTotal}>{fmt(m.amount_sales)}</Text>
                </View>
              )}

              {m.amount_debt > 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailName}>Pagos por deudas</Text>
                  <Text style={styles.detailTotal}>{fmt(m.amount_debt)}</Text>
                </View>
              )}

              {m.amount_in_out !== 0 && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailName}>Entradas / Salidas</Text>
                  <Text style={styles.detailTotal}>{fmts(m.amount_in_out)}</Text>
                </View>
              )}
              {ingresos.length > 0 && (
                <>
                  {ingresos.map((mov, idx) => (
                    <View key={`in-${idx}`} style={styles.detailRow}>
                      <Text style={styles.nestedDetailName}>{mov.detail}</Text>
                      <Text style={styles.detailTotal}>{`+ S/ ${mov?.amount?.toFixed(2)}`}</Text>
                    </View>
                  ))}
                </>
              )}

              {salidas.length > 0 && (
                <>
                  {salidas.map((mov, idx) => (
                    <View key={`out-${idx}`} style={styles.detailRow}>
                      <Text style={styles.nestedDetailName}>{mov.detail}</Text>
                      <Text style={styles.detailTotal}>{`- S/ ${mov?.amount?.toFixed(2)}`}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}

export default CashSessionReport
