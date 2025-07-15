import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from '@react-pdf/renderer'
import { FaDownload, FaCircleArrowRight, FaClockRotateLeft } from 'react-icons/fa6'
import { formatDateToDDMMYYYY } from '@/shared/utils/utils'
import { MoveLine } from '../invoice.types'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

const styles = StyleSheet.create({
  qrContainer: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: '15',
  },
  qrImage: {
    width: 100,
    height: 100,
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 20,
    left: 0,
    right: 0,
    // textAlign: 'center',
    color: 'grey',

    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'solid',

    marginLeft: '30px',
    marginRight: '30px',

    // paddingTop: '10px',
  },

  page: {
    backgroundColor: '#fff',
    color: '#262626',
    fontFamily: 'Helvetica',
    fontSize: '12px',
    padding: '30px 30px',
  },

  table: {
    width: '100%',
    marginVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    minHeight: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    // backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  headerText: {
    fontWeight: 'bold',
  },
  /*
  tableCell: {
    flex: 1,
    padding: 5,
    textAlign: 'left',
  },
  */
  tableCellDescription: {
    flex: 3,
    padding: 5,
    textAlign: 'left',
  },
  tableCellAmount: {
    flex: 1,
    padding: 5,
    textAlign: 'right',
  },

  // ----------------------------------------------------

  textAlignRight: {
    textAlign: 'right',
  },
  textItalic: {
    fontStyle: 'italic',
  },
  textBold: {
    fontWeight: 'bold',
  },
  marginBottom10: {
    marginBottom: 10,
  },
  marginBottom5: {
    marginBottom: 5,
  },
  marginTop10: {
    marginTop: 10,
  },
  marginTop5: {
    marginTop: 5,
  },
  width_50: {
    width: '50%',
  },

  title_style_1: {
    fontSize: 20,
    color: '#5d4765',
  },
  section_1_Col: {
    marginBottom: 20,
  },
  section_2_Col: {
    flexDirection: 'row',
    gap: 30,
    // marginBottom: 20,
  },

  // ----------------------------------------------------
  company: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company_logo: {
    height: 80,
    width: 100,
    marginRight: 20,
  },
  company_details: {},
  customer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginTop: 20,
    marginBottom: 20,
  },
  section_or_note: {
    flex: 5,
    padding: 5,
  },

  totals: {
    display: 'flex',
    alignItems: 'flex-end',
  },

  // flexDirection: 'row',
  // justifyContent: 'space-between',

  // {/* <Text style={[styles.title, styles.textBold]}>Factura {info.name}</Text> */}
  // <View style={{ flex: 5, padding: 5 }}>
  // style={item.type === TypeInvoiceLineEnum.NOTE ? { fontStyle: 'italic' } : {}}
  // <Text>S/ {(item.quantity * item.price_unit).toFixed(2)}</Text>
  // padding: '20px 40px',
})

// Exportar el componente PDF interno para poder generarlo como blob
function numeroALetras(num: any) {
  const unidades = [
    'CERO',
    'UNO',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
  ]
  const decenas = [
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
  ]
  const decenas2 = [
    'VEINTE',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ]
  const centenas = [
    'CIEN',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ]

  function convertir(num: any) {
    let n = parseInt(num, 10)
    if (n < 10) return unidades[n]
    if (n < 20) return decenas[n - 10]
    if (n < 100) {
      const dec = Math.floor(n / 10)
      const uni = n % 10
      return decenas2[dec - 2] + (uni ? ' Y ' + unidades[uni] : '')
    }
    if (n < 1000) {
      const cen = Math.floor(n / 100)
      const resto = n % 100
      let centena = cen === 1 && resto > 0 ? 'CIENTO' : centenas[cen - 1]
      return centena + (resto ? ' ' + convertir(resto) : '')
    }
    if (n < 1000000) {
      const mil = Math.floor(n / 1000)
      const resto = n % 1000
      let miles = mil === 1 ? 'MIL' : convertir(mil) + ' MIL'
      return miles + (resto ? ' ' + convertir(resto) : '')
    }
    return '***'
  }

  let [entero, decimal] = num.toFixed(2).split('.')
  let letras = convertir(entero)
  return `SON: ${letras} Y ${decimal}/100 SOLES`
}

export const InvoicePDF = ({ watch }: { watch: any }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('')
  const info = watch()
  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = `${info.name}|${info.partner_name}|${info.invoice_date}|${info.total || 1400}`
        const dataURL = await QRCode.toDataURL(qrData, {
          width: 100,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
        setQrCodeDataURL(dataURL)
      } catch (err) {
        console.error('Error generando QR:', err)
      }
    }

    generateQR()
  }, [info.name, info.partner_name, info.invoice_date, info.total])
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.company}>
          <Image
            style={styles.company_logo}
            src="https://upload.wikimedia.org/wikipedia/commons/6/60/UNITEC_logo.jpg"
          />
          <View style={styles.company_details}>
            <Text style={styles.textBold}>Importadora de Repuestos CHAVARRI</Text>
            <Text>Avenida real 754</Text>
            <Text>El tambo, Huancayo, Junin - Peru</Text>
            <Text>RUC: 20557365487</Text>
          </View>
        </View>

        <View style={styles.customer}>
          <Text style={styles.textBold}>Cliente</Text>
          <Text style={styles.textBold}>{info.partner_name}</Text>
          <Text>Avenida real 754</Text>
          <Text>El tambo, Huancayo, Junin - Peru</Text>
          <Text>RUC: 20557365487</Text>
        </View>

        <View style={styles.section_1_Col}>
          <Text style={[styles.title_style_1]}>Factura {info.name}</Text>
        </View>

        <View style={[styles.section_2_Col, styles.marginBottom10]}>
          <View style={styles.width_50}>
            <Text style={[styles.marginBottom5, styles.textBold]}>Fecha de factura</Text>
            <Text>{info.invoice_date ? formatDateToDDMMYYYY(info.invoice_date) : '-'}</Text>
          </View>
          <View style={styles.width_50}>
            <Text style={[styles.marginBottom5, styles.textBold]}>Fecha de vencimiento</Text>
            <Text>{info.invoice_date_due ? formatDateToDDMMYYYY(info.invoice_date_due) : '-'}</Text>
          </View>
        </View>

        <View style={styles.table}>
          {/* Table head */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCellDescription]}>
              <Text style={styles.headerText}>Descripción</Text>
            </View>
            <View style={styles.tableCellAmount}>
              <Text style={styles.headerText}>Cantidad</Text>
            </View>
            <View style={styles.tableCellAmount}>
              <Text style={styles.headerText}>Unitario</Text>
            </View>
            {/*
            <View style={styles.tableCell}>
              <Text style={styles.headerText}>Impuestos</Text>
            </View>
            */}
            <View style={styles.tableCellAmount}>
              <Text style={styles.headerText}>Importe</Text>
            </View>
          </View>

          {/* Table body */}
          {info.move_lines.map((item: MoveLine, index: number) => (
            <View key={index} style={styles.tableRow}>
              {item.type === TypeInvoiceLineEnum.SECTION && item.name === null ? (
                <View style={styles.section_or_note}>
                  <Text style={styles.textBold}>{item.label}</Text>
                </View>
              ) : item.type === TypeInvoiceLineEnum.NOTE || (item.label && item.name === null) ? (
                <View style={styles.section_or_note}>
                  <Text style={item.type === TypeInvoiceLineEnum.NOTE ? styles.textItalic : {}}>
                    {item.label}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={[styles.tableCellDescription]}>
                    <Text>{item.name}</Text>
                    <Text>{item?.label}</Text>
                  </View>
                  <View style={styles.tableCellAmount}>
                    <Text>{item.quantity + ' ' + item.uom_name}</Text>
                  </View>
                  <View style={styles.tableCellAmount}>
                    <Text>{item.price_unit}</Text>
                  </View>
                  {/*
                  <View style={styles.tableCell}>
                    <Text>
                      {(item.move_lines_taxes ?? []).map((elem) => elem.label).join(', ')}
                    </Text>
                  </View>
                  */}
                  <View style={styles.tableCellAmount}>
                    <Text>{(item.quantity * item.price_unit).toFixed(2)}</Text>
                  </View>
                </>
              )}
            </View>
          ))}
        </View>

        {/* ------------------------------------------------------------------------ */}

        <View style={styles.section_2_Col}>
          <View style={styles.width_50}></View>

          <View
            style={[
              styles.width_50,
              {
                borderTop: '1px solid #000',
              },
            ]}
          >
            <View style={[styles.section_2_Col, styles.marginTop5]}>
              <View style={styles.width_50}>
                <Text style={[]}>Subtotal</Text>
              </View>
              <View style={styles.width_50}>
                <Text style={styles.textAlignRight}>
                  S/ {info?.amount_untaxed?.toFixed(2) || '0.00'}
                </Text>
              </View>
            </View>

            <View style={[styles.section_2_Col, styles.marginTop5]}>
              <View style={styles.width_50}>
                <Text style={[]}>IGV</Text>
              </View>
              <View style={styles.width_50}>
                <Text style={styles.textAlignRight}>S/ 200.00</Text>
              </View>
            </View>

            <View
              style={[
                styles.section_2_Col,
                styles.marginTop5,
                styles.textBold,
                {
                  borderTop: '1px solid #000',
                  paddingTop: '5',
                },
              ]}
            >
              <View style={styles.width_50}>
                <Text style={[]}>Total</Text>
              </View>
              <View style={styles.width_50}>
                <Text style={styles.textAlignRight}>S/ {info?.amount_total?.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ------------------------------------------------------------------------ */}

        <View style={{ marginTop: '20', fontSize: '10px' }}>
          <Text style={styles.textBold}>{numeroALetras(info.amount_total || 0)}</Text>
        </View>
        <View style={styles.section_2_Col}>
          <View style={styles.qrContainer}>
            {qrCodeDataURL && <Image style={styles.qrImage} src={qrCodeDataURL} />}
          </View>
        </View>
        {/* ------------------------------------------------------------------------ */}

        {/* Totals */}
        {/*
        <View style={styles.totals}>
          <View
            style={{
              minWidth: '256px',
              padding: '20px 40px',
              borderTop: '1px solid #000',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text>Subtotal</Text>
              <Text>${(info.subtotal || 0).toFixed(2)}</Text>
            </View>

            {(info.taxes || []).map((tax: any, index: number) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <Text>{tax.label}</Text>
                <Text>${(tax.amount || 0).toFixed(2)}</Text>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Text style={styles.textBold}>Total</Text>
              <Text style={styles.textBold}>${(info.total || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
       

        {/* <View style={styles.pageNumber} fixed> */}
        <View style={styles.pageNumber}>
          <Text style={styles.marginTop5}>Facturacion Electronica S7</Text>
        </View>
      </Page>
    </Document>
  )
}

export const InvoicePdf = ({ watch }: { watch: any }) => {
  const calculateTotals = () => {
    const lines = watch('move_lines') || []
    const subtotal = lines
      .filter(
        (item: MoveLine) =>
          item.type !== TypeInvoiceLineEnum.SECTION && item.type !== TypeInvoiceLineEnum.NOTE
      )
      .reduce((sum: number, item: MoveLine) => sum + (item.amount_untaxed || 0), 0)

    const taxesMap = new Map()
    lines.forEach((item: MoveLine) => {
      if (
        item.move_lines_taxes &&
        item.type !== TypeInvoiceLineEnum.SECTION &&
        item.type !== TypeInvoiceLineEnum.NOTE
      ) {
        item.move_lines_taxes.forEach((tax: any) => {
          const amount = (item.amount_untaxed || 0) * (tax.amount / 100)
          const currentAmount = taxesMap.get(tax.tax_id) || { label: tax.label, amount: 0 }
          taxesMap.set(tax.tax_id, {
            label: tax.label,
            amount: currentAmount.amount + amount,
          })
        })
      }
    })

    const taxes = Array.from(taxesMap.values())
    const taxTotal = taxes.reduce((sum: number, tax: any) => sum + tax.amount, 0)

    return {
      subtotal,
      taxes,
      total: subtotal + taxTotal,
    }
  }

  const totals = calculateTotals()

  const handlePay = () => {}

  return (
    <div className="flex w-full gap-4 mx-auto my-10 px-6 h-[78vh] overflow-hidden">
      <div className="mt-6 flex flex-col gap-2 justify-start items-center w-1/3">
        <span className="text-3xl font-semibold pb-3"> S/ {totals.total.toFixed(2)}</span>
        <div className="flex gap-2 items-center text-xs font-light pb-3">
          <FaClockRotateLeft size={12} /> 2 días retraso{' '}
        </div>
        <button
          className="w-full flex items-center justify-center bg-[#714B67] border-[1.5px] border-[#FFFFFF] text-white px-4 py-2 rounded-md transition duration-300"
          onClick={handlePay}
        >
          <FaCircleArrowRight className="pr-2" size={20} /> Pagar ahora
        </button>
        <PDFDownloadLink
          document={<InvoicePDF watch={watch} />}
          fileName="invoice.pdf"
          className="w-full"
        >
          <button className="w-full flex items-center justify-center bg-[#eeeeee] border-[1.5px] border-[#f1f1f1] text-white px-4 py-2 rounded-md transition duration-300">
            <FaDownload className="pr-2" size={20} /> Descargar
          </button>
        </PDFDownloadLink>
      </div>
      <div className="w-full ">
        <PDFViewer width="100%" height="100%">
          <InvoicePDF watch={watch} />
        </PDFViewer>
      </div>
    </div>
  )
}

// Exponer el componente PDF interno
InvoicePdf.InvoicePDF = InvoicePDF
