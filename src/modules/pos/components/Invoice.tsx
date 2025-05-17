import { Document, Page, Text, View, Image, StyleSheet, PDFViewer } from '@react-pdf/renderer'
import { useCart } from '../context/CartContext'
import { useEffect, useState } from 'react'
import { MoveLine } from '@/modules/invoicing/invoice.types'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { BiCheckCircle, BiPaperPlane } from 'react-icons/bi'
import { FaPrint } from 'react-icons/fa'
import TicketWithExistingData from './Ticket'
import TicketPDF from './Ticket'

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

const styles = StyleSheet.create({
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

const Invoice = () => {
  const [order, setOrder] = useState({})
  const { orderCart, selectedOrder, orderData, cart, getTotalPrice, finalCustomer } = useCart()
  useEffect(() => {
    setOrder(orderCart.find((o) => o.id_order === selectedOrder))
  }, [orderCart])
  console.log('order', finalCustomer)
  const info = { ...order, move_lines: order?.cart?.filter((c) => c.action !== 'd') }
  return (
    <div className="receipt-screen screen h-100 bg-100">
      <div className="screen-content d-flex flex-column h-100">
        <div className="default-view d-flex flex-lg-row flex-column overflow-hidden flex-grow-1">
          <div className="actions d-flex flex-column justify-content-between flex-lg-grow-1 flex-grow-0 flex-shrink-1 flex-basis-0 border-end">
            <div className="o_payment_successful d-flex flex-column w-100 w-xxl-75 p-3 pt-xxl-5 mx-auto">
              <div className="d-flex flex-column align-items-center mb-3 p-1 p-lg-3 border border-success rounded-3 bg-success-subtle text-success fs-3 bg-green-100">
                <i className="fa fa-fw fa-2x fa-check-circle">
                  <BiCheckCircle size={50} />
                </i>
                <span className="fs-3 fw-bolder">Pago exitoso</span>
                <div className="fs-4 fw-bold d-flex justify-content-center align-items-center gap-2">
                  <span>S/&nbsp;{getTotalPrice().toFixed(2)}</span>
                  <span className="bg-green-600 edit-order-payment badge bg-success text-white rounded cursor-pointer pt-1">
                    Editar pago
                  </span>
                </div>
              </div>

              <div className="receipt-options d-flex flex-column gap-2">
                <div className="d-flex gap-1">
                  <button
                    className="button print btn btn-lg btn-secondary w-100 py-3"
                    type="button"
                  >
                    <i className="fa fa-print me-1">
                      <FaPrint />
                    </i>
                    Imprimir recibo completo
                  </button>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="d-flex">
                    <input
                      type="text"
                      className="send-receipt-email-input o_input position-relative p-3 border border-end-0 rounded-start-2 text-body"
                      placeholder="e.g. john.doe@mail.com"
                    />
                    <div>
                      <button
                        className="btn btn-primary btn-lg lh-lg rounded-start-0 h-100"
                        style={{ width: '8rem' }}
                        disabled
                        type="button"
                      >
                        <i className="fa fa-paper-plane">
                          <BiPaperPlane size={30} />
                        </i>
                      </button>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="sending-receipt-management d-flex gap-1"></div>
                  </div>
                </div>

                <div className="notice text-center"></div>
              </div>
            </div>

            <div
              id="action_btn_desktop"
              className="validation-buttons d-flex w-100 gap-2 p-2 sticky-bottom"
            >
              <button
                className="button next validation btn btn-primary btn-lg w-100 py-4 lh-lg highlight"
                name="done"
                type="button"
              >
                Nueva orden
              </button>
            </div>
          </div>

          <div className="pos-receipt-container d-flex flex-grow-1 flex-lg-grow-0 w-100 w-lg-50 user-select-none justify-content-center bg-200 text-center overflow-hidden">
            <div className="d-inline-block m-2 m-lg-3 p-3 border rounded text-start overflow-y-auto w-full">
              {' '}
              <div className="w-full h-full">
                <TicketPDF info={info} finalCustomer={finalCustomer} />
                {/*
                <PDFViewer width="100%" height="100%">
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
                        <Text style={styles.textBold}>{finalCustomer.name}</Text>
                        <Text>Avenida real 754</Text>
                        <Text>El tambo, Huancayo, Junin - Peru</Text>
                        <Text>RUC: 20557365487</Text>
                      </View>

                      <View style={styles.section_1_Col}>
                        <Text style={[styles.title_style_1]}>Factura {info.name}</Text>
                      </View>

                      <View style={[styles.section_2_Col, styles.marginBottom10]}>
                        <View style={styles.width_50}>
                          <Text style={[styles.marginBottom5, styles.textBold]}>
                            Fecha de factura
                          </Text>
                          <Text>
                            {info.invoice_date ? formatDateToDDMMYYYY(info.invoice_date) : '-'}
                          </Text>
                        </View>
                        <View style={styles.width_50}>
                          <Text style={[styles.marginBottom5, styles.textBold]}>
                            Fecha de vencimiento
                          </Text>
                          <Text>
                            {info.invoice_date_due
                              ? formatDateToDDMMYYYY(info.invoice_date_due)
                              : '-'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.table}>
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

                          <View style={styles.tableCellAmount}>
                            <Text style={styles.headerText}>Importe</Text>
                          </View>
                        </View>

                        {info?.move_lines?.map((item: MoveLine, index: number) => (
                          <View key={index} style={styles.tableRow}>
                            {item.type === TypeInvoiceLineEnum.SECTION ? (
                              <View style={styles.section_or_note}>
                                <Text style={styles.textBold}>{item.label}</Text>
                              </View>
                            ) : item.type === TypeInvoiceLineEnum.NOTE || item.label ? (
                              <View style={styles.section_or_note}>
                                <Text
                                  style={
                                    item.type === TypeInvoiceLineEnum.NOTE ? styles.textItalic : {}
                                  }
                                >
                                  {item.label}
                                </Text>
                              </View>
                            ) : (
                              <>
                                <View style={[styles.tableCellDescription]}>
                                  <Text>{item.name}</Text>
                                </View>
                                <View style={styles.tableCellAmount}>
                                  <Text>{item.quantity + ' ' + item.uom_name}</Text>
                                </View>
                                <View style={styles.tableCellAmount}>
                                  <Text>{item.price_unit}</Text>
                                </View>

                                <View style={styles.tableCellAmount}>
                                  <Text>{(item.quantity * item.sale_price).toFixed(2)}</Text>
                                </View>
                              </>
                            )}
                          </View>
                        ))}
                      </View>


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
                                S/ {Number.parseFloat(getTotalPrice()).toFixed(2)}
                              </Text>
                            </View>
                          </View>

                          <View style={[styles.section_2_Col, styles.marginTop5]}>
                            <View style={styles.width_50}>
                              <Text style={[]}>IGV</Text>
                            </View>
                            <View style={styles.width_50}>
                              <Text style={styles.textAlignRight}>S/ 0.00</Text>
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
                              <Text style={styles.textAlignRight}>
                                S/ {Number.parseFloat(getTotalPrice()).toFixed(2)}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      <View style={{ marginTop: '20', fontSize: '10px' }}>
                        <Text style={styles.textBold}>
                          {numeroALetras(Number.parseFloat(getTotalPrice()))}
                        </Text>
                      </View>

                      <View style={styles.pageNumber}>
                        <Text style={styles.marginTop5}>Facturacion Electronica S7</Text>
                      </View>
                    </Page>
                  </Document>
                </PDFViewer>
                 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
