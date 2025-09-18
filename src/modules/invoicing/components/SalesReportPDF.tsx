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

const salesReportData = {
  company_id: 1,
  company_name: 'Agropetunia',
  ln1_id: 604,
  ln1_name: 'Perú',
  location_country_id: 604,
  location_country_name: 'Perú',
  report_name: 'Reporte diario de ventas Z',
  session_id: 'PUNTO DE VENTA DOS/00008',
  date_start: '2025-07-02T01:16:11',
  date_end: '2025-07-02T01:16:29',
  date_generated: '2025-07-03',
  sales_data: {
    categories: [
      {
        category_name: 'Chairs',
        quantity: 6.0,
        total_amount: 420.0,
        currency: 'S/',
      },
    ],
    products: [
      {
        product_id: 7777,
        ref_interna: 'FURN_7777',
        product_name: 'Office Chair',
        quantity: 6.0,
        uom_name: 'Unidades',
        precio_venta: 70.0,
        total_amount: 420.0,
        currency: 'S/',
      },
    ],
    sales_total: {
      total_quantity: 6.0,
      total_amount: 420.0,
      currency: 'S/',
    },
    sales_taxes: [
      {
        tax_id: 1,
        nom_imp: 'IGV 18%',
        tax_rate: 18.0,
        tax_amount: 75.6,
        base_amount: 420.0,
        currency: 'S/',
      },
    ],
    sales_tax_total: {
      total_tax_amount: 75.6,
      total_base_amount: 420.0,
      currency: 'S/',
    },
  },
  refunds_data: {
    categories: [
      {
        category_name: 'Chairs',
        quantity: 6.0,
        total_amount: -420.0,
        currency: 'S/',
      },
    ],
    products: [
      {
        product_id: 7777,
        ref_interna: 'FURN_7777',
        product_name: 'Office Chair',
        quantity: 6.0,
        uom_name: 'Unidades',
        precio_venta: 70.0,
        total_amount: -420.0,
        currency: 'S/',
      },
    ],
    refunds_total: {
      total_quantity: 6.0,
      total_amount: -420.0,
      currency: 'S/',
    },
    refunds_taxes: [
      {
        tax_id: 1,
        nom_imp: 'IGV 18%',
        tax_rate: 18.0,
        tax_amount: -75.6,
        base_amount: -420.0,
        currency: 'S/',
      },
    ],
    refunds_tax_total: {
      total_tax_amount: -75.6,
      total_base_amount: -420.0,
      currency: 'S/',
    },
  },
  payments_data: [
    {
      payment_method: 'Efectivo',
      terminal_name: 'PUNTO DE VENTA DOS/00008',
      amount: 0.0,
      currency: 'S/',
    },
    {
      payment_method: 'Efectivo',
      terminal_name: 'POS Agropetunia/00007',
      amount: -495.6,
      currency: 'S/',
    },
    {
      payment_method: 'Efectivo',
      terminal_name: 'POS 2 Agropetunia/00007',
      amount: 495.6,
      currency: 'S/',
    },
  ],
  discounts_data: {
    discount_count: 0,
    total_discount_amount: 0.0,
    currency: 'S/',
  },
  session_control: {
    session_total: 0.0,
    transaction_count: 4,
    currency: 'S/',
  },
  cash_register_data: [
    {
      register_name: 'Efectivo PUNTO DE VENTA DOS/00008',
      expected_amount: 0.0,
      counted_amount: 0.0,
      difference_amount: 0.0,
      currency: 'S/',
    },
  ],
}

// Funciones auxiliares
const formatDate = (dateString: string) => {
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

const formatDateShort = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatAmount = (amount: number, currency: string) => {
  return `${currency}${amount.toFixed(2)}`
}

const SalesReportPDF = () => (
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
        <Text style={styles.sectionTitle}>Ventas</Text>

        {/* Categorías */}
        {salesReportData.sales_data.categories.map((category, index) => (
          <View key={`category-${index}`} style={styles.productRow}>
            <Text>{category.category_name}</Text>
            <Text>{category.quantity}</Text>
            <Text>{formatAmount(category.total_amount, category.currency)}</Text>
          </View>
        ))}

        {/* Productos */}
        {salesReportData.sales_data.products.map((product, index) => (
          <View key={`product-${index}`} style={styles.productRow}>
            <Text>
              [{product.ref_interna}] {product.product_name}
            </Text>
            <Text>
              {product.quantity} {product.uom_name}
            </Text>
            <Text>{formatAmount(product.total_amount, product.currency)}</Text>
          </View>
        ))}

        {/* Total de ventas */}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>{salesReportData.sales_data.sales_total.total_quantity}</Text>
          <Text>
            {formatAmount(
              salesReportData.sales_data.sales_total.total_amount,
              salesReportData.sales_data.sales_total.currency
            )}
          </Text>
        </View>

        {/* Impuestos sobre las ventas */}
        <Text style={styles.subSectionTitle}>Impuestos sobre las ventas</Text>
        {salesReportData.sales_data.sales_taxes.map((tax, index) => (
          <View key={`sales-tax-${index}`} style={styles.row}>
            <Text>{tax.nom_imp}</Text>
            <Text>{formatAmount(tax.tax_amount, tax.currency)}</Text>
            <Text>{formatAmount(tax.base_amount, tax.currency)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>
            {formatAmount(
              salesReportData.sales_data.sales_tax_total.total_tax_amount,
              salesReportData.sales_data.sales_tax_total.currency
            )}
          </Text>
          <Text>
            {formatAmount(
              salesReportData.sales_data.sales_tax_total.total_base_amount,
              salesReportData.sales_data.sales_tax_total.currency
            )}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reembolsos</Text>

        {/* Categorías de reembolsos */}
        {salesReportData.refunds_data.categories.map((category, index) => (
          <View key={`refund-category-${index}`} style={styles.row}>
            <Text>{category.category_name}</Text>
            <Text>{category.quantity}</Text>
            <Text>{formatAmount(category.total_amount, category.currency)}</Text>
          </View>
        ))}

        {/* Productos reembolsados */}
        {salesReportData.refunds_data.products.map((product, index) => (
          <View key={`refund-product-${index}`} style={styles.productRow}>
            <Text>
              [{product.ref_interna}] {product.product_name}
            </Text>
            <Text>
              {product.quantity} {product.uom_name}
            </Text>
            <Text>{formatAmount(product.total_amount, product.currency)}</Text>
          </View>
        ))}

        {/* Total de reembolsos */}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>{salesReportData.refunds_data.refunds_total.total_quantity}</Text>
          <Text>
            {formatAmount(
              salesReportData.refunds_data.refunds_total.total_amount,
              salesReportData.refunds_data.refunds_total.currency
            )}
          </Text>
        </View>

        {/* Impuestos sobre los reembolsos */}
        <Text style={styles.subSectionTitle}>Impuestos sobre los reembolsos</Text>
        {salesReportData.refunds_data.refunds_taxes.map((tax, index) => (
          <View key={`refund-tax-${index}`} style={styles.row}>
            <Text>{tax.nom_imp}</Text>
            <Text>{formatAmount(tax.tax_amount, tax.currency)}</Text>
            <Text>{formatAmount(tax.base_amount, tax.currency)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>
            {formatAmount(
              salesReportData.refunds_data.refunds_tax_total.total_tax_amount,
              salesReportData.refunds_data.refunds_tax_total.currency
            )}
          </Text>
          <Text>
            {formatAmount(
              salesReportData.refunds_data.refunds_tax_total.total_base_amount,
              salesReportData.refunds_data.refunds_tax_total.currency
            )}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pagos</Text>
        {salesReportData.payments_data.map((payment, index) => (
          <View key={`payment-${index}`} style={styles.paymentRow}>
            <Text>
              {payment.payment_method} {payment.terminal_name}
            </Text>
            <Text>{formatAmount(payment.amount, payment.currency)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Descuentos</Text>
        <View style={styles.row}>
          <Text>Número de descuentos: {salesReportData.discounts_data.discount_count}</Text>
        </View>
        <View style={styles.row}>
          <Text>
            Importe de los descuentos:{' '}
            {formatAmount(
              salesReportData.discounts_data.total_discount_amount,
              salesReportData.discounts_data.currency
            )}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Control de la sesión</Text>
        <View style={styles.row}>
          <Text>
            Total:{' '}
            {formatAmount(
              salesReportData.session_control.session_total,
              salesReportData.session_control.currency
            )}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>Número de transacciones: {salesReportData.session_control.transaction_count}</Text>
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
          {salesReportData.cash_register_data.map((register, index) => (
            <View key={`register-${index}`} style={styles.tableRow}>
              <Text style={styles.tableCellLeft}>{register.register_name}</Text>
              <Text style={styles.tableCellCenter}>
                {formatAmount(register.expected_amount, register.currency)}
              </Text>
              <Text style={styles.tableCellCenter}>
                {formatAmount(register.counted_amount, register.currency)}
              </Text>
              <Text style={styles.tableCellRight}>
                {formatAmount(register.difference_amount, register.currency)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
)

export default SalesReportPDF
