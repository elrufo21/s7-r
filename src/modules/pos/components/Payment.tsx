// import { HiOutlineBackspace } from 'react-icons/hi'
import { HiOutlineBackspace } from 'react-icons/hi2'

import { useRef, useState } from 'react'
import React from 'react'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useParams } from 'react-router-dom'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { FrmBaseDialog } from '@/shared/components/core'
import clientConfig from '@/modules/contacts/views/contact-index/config'
import contactsConfig from '../views/contact-index/config'
import { CustomHeader } from './CustomHeader'

// Definición de la interfaz para los pagos
interface PaymentItem {
  payment_id: string
  payment_method_name: string
  amount: number
  payment_method_id: number
  company_id: number
  state: string
  session_id: string
  order_id: number | string
  date: Date
  currency_id: number
}

const Payment = () => {
  const { pointId } = useParams()

  const sessions = JSON.parse(localStorage.getItem('sessions') ?? '[]')
  const { session_id } = sessions.find((s: any) => s.point_id === Number(pointId))
  const {
    setScreen,
    getTotalPriceByOrder,
    selectedOrder,
    executeFnc,
    orderData,
    setHandleChange,
    setBackToProducts,
    addPaymentToOrder,
    updatePaymentInOrder,
    removePaymentFromOrder,
    setOrderData,
    paymentMethods,
    finalCustomer,
    defaultPosSessionData,
    modalData,
    setModalData,
    openDialog,
    closeDialogWithData,
    setFinalCustomer,
    setSelectedOrder,
    setFrmIsChanged,
  } = useAppStore()
  const finalCustomerRef = useRef(finalCustomer)
  const [selectedPaymentId, setSelectedPaymentId] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [isFirstDigit, setIsFirstDigit] = useState(true)
  const { userData } = useUserStore()
  const currentOrder = orderData?.find((o) => o.order_id === selectedOrder)
  const payments = currentOrder?.payments || []

  const getTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0)
  }

  // Calcula el cambio (si se pagó en exceso)
  const getChange = () => {
    const total = getTotalPriceByOrder(selectedOrder)
    const paid = getTotalPaid()
    return Math.max(0, paid - total)
  }

  // Calcula el monto restante por pagar
  const getRemainingAmount = () => {
    const total = getTotalPriceByOrder(selectedOrder)
    const paid = getTotalPaid()
    return Math.max(0, total - paid)
  }

  const handlePaymentMethodClick = (method: string, payment_method_id: number) => {
    setFrmIsChanged(true)
    const id = crypto.randomUUID()
    const remaining = getRemainingAmount()

    const newPayment: PaymentItem = {
      payment_id: id,
      company_id: userData.company_id,
      state: 'A',
      session_id: session_id,
      order_id: selectedOrder,
      date: new Date(),
      currency_id: 1,
      amount: remaining,
      payment_method_id,
      payment_method_name: method,
    }

    addPaymentToOrder(selectedOrder, newPayment)
    setSelectedPaymentId(id)
    setInputAmount(remaining.toFixed(2))
    setIsFirstDigit(true)
    setHandleChange(true)
  }

  const handleNumpadClick = (value: string) => {
    if (!selectedPaymentId) return
    setFrmIsChanged(true)
    const paymentIndex = payments.findIndex((p) => p.payment_id === selectedPaymentId)
    if (paymentIndex === -1) return

    let newAmount = inputAmount

    if (value === 'backspace') {
      if (newAmount.length <= 1 || (newAmount.length === 2 && newAmount.includes('.'))) {
        newAmount = '0'
        setIsFirstDigit(true)
      } else {
        newAmount = newAmount.slice(0, -1)
      }
    } else if (value === '+/-') {
      newAmount = newAmount.startsWith('-') ? newAmount.substring(1) : '-' + newAmount
    } else if (value === '.') {
      if (!newAmount.includes('.')) {
        if (isFirstDigit) {
          newAmount = '0.'
          setIsFirstDigit(false)
        } else {
          newAmount += '.'
        }
      }
    } else if (['+10', '+20', '+50'].includes(value)) {
      const addValue = parseInt(value.substring(1))
      const currentValue = parseFloat(newAmount) || 0
      newAmount = (currentValue + addValue).toFixed(2)
      setIsFirstDigit(true)
    } else {
      if (isFirstDigit) {
        newAmount = value
        setIsFirstDigit(false)
      } else {
        newAmount += value
      }
      setHandleChange(true)
    }

    setInputAmount(newAmount)

    const updatedPayment = {
      ...payments[paymentIndex],
      amount: parseFloat(newAmount) || 0,
    }

    updatePaymentInOrder(selectedOrder, updatedPayment)
  }

  const handleSelectPayment = (id: string) => {
    setSelectedPaymentId(id)
    const payment = payments.find((p) => p.payment_id === id)
    setInputAmount(payment ? payment.amount.toFixed(2) : '')
    setIsFirstDigit(true)
  }

  const handleRemovePayment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFrmIsChanged(true)
    removePaymentFromOrder(selectedOrder, id)

    if (selectedPaymentId === id) {
      setSelectedPaymentId('')
      setInputAmount('')
      setIsFirstDigit(true)
    }
    setHandleChange(true)
  }

  const handleValidatePayment = async () => {
    const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
    const { userData } = state
    const data = orderData.find((item) => item.order_id === selectedOrder)
    const newPayments = data?.payments?.filter((item: any) => item.amount !== 0)
    if (!data) return

    const updatedData = {
      ...data,
      name: data.name,
      state: 'P',
      order_date: data.order_date || new Date(),
      user_id: userData?.user_id,
      session_id: typeof data.order_id === 'string' ? session_id : undefined,
      currency_id: 1,
      company_id: userData?.company_id,
      invoice_state: data.invoice_state || 'P',
      partner_id: finalCustomer?.partner_id,
      lines: data.lines?.map((item: any, i: number) => ({
        line_id: item?.line_id,
        order_id: selectedOrder,
        position: i + 1,
        product_id: item?.product_id,
        quantity: item?.quantity,
        uom_id: item?.uom_id,
        price_unit: item?.price_unit,
        notes: null,
        amount_untaxed: item?.price_unit,
        amount_tax: 0,
        amount_withtaxed: item?.price_unit,
        amount_untaxed_total: item?.price_unit * item?.quantity,
        amount_tax_total: item?.price_unit * item?.quantity,
        amount_withtaxed_total: item?.price_unit * item?.quantity,
      })),
      order_id: selectedOrder,
      payments: newPayments,
      amount_untaxed:
        data.lines?.reduce((total: number, item: any) => total + (item?.price_unit || 0), 0) || 0,
      amount_withtaxed:
        data.lines?.reduce(
          (total: number, item: any) => total + (item?.price_unit || 0) * (item?.quantity || 0),
          0
        ) || 0,
      amount_total: getTotalPriceByOrder(selectedOrder),
    }
    const { oj_data } = await executeFnc(
      'fnc_pos_order',
      typeof data.order_id === 'string' ? 'i' : 'u',
      updatedData
    )
    if (oj_data?.order_id) {
      setSelectedOrder(oj_data?.order_id)
    }
    const orders = await executeFnc('fnc_pos_order', 's_pos', [
      [0, 'fequal', 'point_id', pointId],
      [
        0,
        'multi_filter_in',
        [
          { key_db: 'state', value: 'I' },
          { key_db: 'state', value: 'Y' },
        ],
      ],
    ])
    setOrderData(orders?.oj_data || [])
    setFrmIsChanged(false)
    setScreen('invoice')
  }

  /*Clientes*/

  const fetchClients = async () => {
    try {
      const { oj_data } = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
      setModalData(oj_data)
    } catch (err) {
      console.error('Error al obtener clientes:', err)
    }
  }
  const fnc_create_customer = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear cliente',
      contactModal: true,
      dialogContent: () => (
        <FrmBaseDialog config={contactsConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const rs = await executeFnc('fnc_partner', 'i', formData)
            //oj_data.partner_id
            const newData = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
            const dataUpdate = newData.oj_data.map((item: any) => {
              if (item.partner_id === rs.oj_data.partner_id) {
                return {
                  ...item,
                  selected: true,
                }
              }
              return item
            })
            setModalData(dataUpdate)
            setFinalCustomer(dataUpdate.find((item: any) => item.selected === true))
            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  const fnc_open_contact_modal = () => {
    if (modalData.length === 0) fetchClients()
    const dialogId = openDialog({
      title: 'Elija un cliente',
      contactModal: true,
      dialogContent: () => (
        <ModalBase
          config={contactsConfig}
          onRowClick={(row) => {
            if (row.partner_id === finalCustomer.partner_id) {
              setFinalCustomer({})
              closeDialogWithData(dialogId, row)
              return
            }
            setFinalCustomer(row)
            closeDialogWithData(dialogId, row)
          }}
          contactModal={true}
          openEditModal={(client: any) => {
            fnc_edit_client(client)
          }}
        />
      ),
      customHeader: <CustomHeader fnc_create_button={fnc_create_customer} />,
      buttons: [
        {
          text: 'Descartar',
          type: 'confirm',
          onClick: () => {
            setFinalCustomer({
              partner_id: defaultPosSessionData.partner_id,
              partner_name: defaultPosSessionData.name,
            })
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  const fnc_edit_client = async (client: any) => {
    const { oj_data } = await executeFnc('fnc_partner', 's1', [client.partner_id.toString()])
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Editar Cliente',

      dialogContent: () => (
        <FrmBaseDialog
          config={clientConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={oj_data[0]}
        />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() as any
              await executeFnc('fnc_partner', 'u', formData)
              const rs = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
              if (finalCustomer) {
                const newData = rs.oj_data.map((item: any) => {
                  if (item.partner_id === finalCustomerRef.current?.partner_id) {
                    return {
                      ...item,
                      selected: true,
                    }
                  }
                  return item
                })
                setModalData(newData)
                closeDialogWithData(dialogId, {})
                return
              }

              setModalData(rs.oj_data)
              closeDialogWithData(dialogId, {})
            } catch (err) {
              console.error('Error al actualizar cliente:', err)
            }
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  return (
    <>
      <div className="product-screen">
        <div className="leftpanel">
          <div className="payment-methods-container">
            {/* <div className="paymentmethods-container mb-3 flex-grow-1"> */}
            <div className="payment-methods flex flex-col gap-2">
              {paymentMethods.map((method) => (
                <div
                  key={method.payment_method_id}
                  // className="button paymentmethod btn btn-secondary btn-lg flex-fill"
                  className="btn2 btn2-white fs-3 lh-lg"
                >
                  <div
                    // className="payment-method-display flex items-center gap-2 text-left cursor-pointer"
                    className="flex items-center gap-2 text-left cursor-pointer"
                    onClick={() => handlePaymentMethodClick(method.name, method.payment_method_id)}
                  >
                    <div className="c_imageEx_50 self-center">
                      {method?.files?.[0]?.publicUrl && (
                        <img
                          src={method?.files?.[0]?.publicUrl}
                          alt={method.name}
                          width={200}
                          height={200}
                        />
                      )}
                    </div>
                    <span className="payment-name">{method.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* </div> */}
          </div>

          {/*
          <div className="order-container">

            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-6xl mb-4">
                <svg
                  fill="#858585"
                  height="70px"
                  width="70px"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 60.013 60.013"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    {' '}
                    <path d="M11.68,12.506l-0.832-5h-2.99c-0.447-1.72-1.999-3-3.858-3c-2.206,0-4,1.794-4,4s1.794,4,4,4c1.859,0,3.411-1.28,3.858-3 h1.294l0.5,3H9.624l0.222,1.161l0,0.003c0,0,0,0,0,0l2.559,13.374l1.044,5.462h0.001l1.342,7.015 c-2.468,0.186-4.525,2.084-4.768,4.475c-0.142,1.405,0.32,2.812,1.268,3.858c0.949,1.05,2.301,1.652,3.707,1.652h2 c0,3.309,2.691,6,6,6s6-2.691,6-6h11c0,3.309,2.691,6,6,6s6-2.691,6-6h4c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4.35 c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4h-11.7c-0.826-2.327-3.043-4-5.65-4s-4.824,1.673-5.65,4H15 c-0.842,0-1.652-0.362-2.224-0.993c-0.577-0.639-0.848-1.461-0.761-2.316c0.152-1.509,1.546-2.69,3.173-2.69h0.781 c0.02,0,0.038,0,0.06,0l6.128-0.002L33,41.501v-0.001l7.145-0.002L51,41.496v-0.001l4.024-0.001c2.751,0,4.988-2.237,4.988-4.987 V12.494L11.68,12.506z M4,10.506c-1.103,0-2-0.897-2-2s0.897-2,2-2s2,0.897,2,2S5.103,10.506,4,10.506z M46,45.506 c2.206,0,4,1.794,4,4s-1.794,4-4,4s-4-1.794-4-4S43.794,45.506,46,45.506z M23,45.506c2.206,0,4,1.794,4,4s-1.794,4-4,4 s-4-1.794-4-4S20.794,45.506,23,45.506z M58.013,21.506H51v-7.011l7.013-0.002V21.506z M42,39.498v-6.991h7v6.989L42,39.498z M42,30.506v-7h7v7H42z M24,39.503v-6.997h7v6.995L24,39.503z M24,30.506v-7h7v7H24z M13.765,23.506H22v7h-6.895L13.765,23.506z M49,21.506h-7v-7h7V21.506z M40,21.506h-7V14.5l7-0.002V21.506z M31,14.506v7h-7v-7H31z M33,23.506h7v7h-7V23.506z M51,23.506h7v7 h-7V23.506z M22,14.504v7.003h-8.618l-1.34-7L22,14.504z M15.487,32.506H22v6.997l-5.173,0.002L15.487,32.506z M33,32.506h7v6.992 L33,39.5V32.506z M55.024,39.494L51,39.495v-6.989h7.013v4C58.013,38.154,56.672,39.494,55.024,39.494z"></path>{' '}
                  </g>
                </svg>
              </div>

              <p className="text-gray-500">Comience a agregar productos</p>
            </div>

          </div>
*/}

          {/* ------------------------------------------------ ini */}
          <div className="order-bottom">
            {/*
            <div className="order-summary p-3">
              <div className="flex justify-between text-gray-500">
                <span>Impuestos</span>
                <span>S/ 0:00</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-1">
                <span>Total</span>
                <span>S/ 333.33</span>
              </div>
            </div>
             */}
            {/*-------------*/}

            <div className="pads">
              <div className="control-buttons">
                <button
                  className="btn2 btn2-white lh-lg text-truncate w-auto text-action"
                  onClick={() => {
                    fnc_open_contact_modal()
                  }}
                >
                  {finalCustomer.name ? finalCustomer.name : defaultPosSessionData.name}
                </button>
              </div>

              {/* --------------------- */}

              <div className="subpads">
                <div className="numpad">
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('1')}
                  >
                    1
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('2')}
                  >
                    2
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('3')}
                  >
                    3
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg`}
                    onClick={() => handleNumpadClick('+10')}
                  >
                    +10
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('4')}
                  >
                    4
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('5')}
                  >
                    5
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('6')}
                  >
                    6
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg `}
                    onClick={() => handleNumpadClick('+20')}
                  >
                    +20
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('7')}
                  >
                    7
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('8')}
                  >
                    8
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('9')}
                  >
                    9
                  </button>

                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-lg`}
                    onClick={() => handleNumpadClick('+50')}
                  >
                    +50
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg o_colorlist_item_numpad_color_3"
                    onClick={() => handleNumpadClick('+/-')}
                  >
                    +/-
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg"
                    onClick={() => handleNumpadClick('0')}
                  >
                    0
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg o_colorlist_item_numpad_color_2"
                    onClick={() => handleNumpadClick('.')}
                  >
                    .
                  </button>

                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-lg justify-items-center o_colorlist_item_numpad_color_1"
                    onClick={() => handleNumpadClick('backspace')}
                  >
                    <HiOutlineBackspace style={{ fontSize: '28px' }} />
                    {/* <LiaBackspaceSolid style={{ fontSize: '30px' }} /> */}
                  </button>
                </div>

                <div className="actionpad d-flex flex-row gap-2">
                  <button
                    // className="btn btn-secondary btn-lg flex-grow py-4"
                    className="btn2 btn2-white btn-lg flex-auto min-h-[70px]"
                    onClick={() => {
                      setScreen('products')
                      setBackToProducts(true)
                    }}
                  >
                    Regresar
                  </button>
                  <button
                    // className="btn btn-primary btn-lg flex-grow py-4 bg-purple-700"
                    className="btn btn-primary btn-lg flex-auto min-h-[70px] bg-purple-700"
                    onClick={() => handleValidatePayment()}
                    disabled={getRemainingAmount() > 0}
                  >
                    Validar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------ fin */}
        </div>
        {/* ---------------------------------------- derecho ini */}
        {/* <div className="rightpanel"> */}
        {/* <div className="rightpanel-sub-1"> */}

        {/* Panel central con resumen de pagos */}
        <div className="center-content flex flex-col flex-grow-1 gap-4 p-4">
          {/* Total a pagar */}
          <section className="paymentlines-container">
            {/* <div className="text-[100px] text-center text-[RGBA(17,34,29,1)]"> */}
            <div className="text-[100px] text-center text-[#283833]">
              {/* S/ {getTotalPriceByOrder(selectedOrder).toFixed(2)} */}
              <span className="text-[60%] opacity-[0.7]">S/ </span>
              <span className="">{getTotalPriceByOrder(selectedOrder).toFixed(2)}</span>
            </div>
          </section>

          <div className="payment-summary d-flex flex-grow-1 flex-column gap-1 overflow-y-auto py-3">
            <div className="paymentlines d-flex flex-column overflow-y-auto gap-2 mb-4">
              {/* --------------------------------- */}

              {payments.length > 0 ? (
                payments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    // className={`payment-line ${selectedPaymentId === payment.payment_id ? 'bg-blue-50 border-blue-300' : ''
                    className={`payment-line ${
                      selectedPaymentId === payment.payment_id ? 'select' : ''
                    }`}
                    onClick={() => handleSelectPayment(payment.payment_id)}
                  >
                    <div className="payment-info">
                      <div>{payment.payment_method_name}</div>
                      <div className="payment-amount px-3">S/ {payment.amount.toFixed(2)}</div>
                    </div>

                    <button
                      // className="ml-3 text-gray-500 hover:text-red-500"
                      className="ml-3 text-red-500 text-[26px]"
                      onClick={(e) => handleRemovePayment(payment.payment_id, e)}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-bg-light border text-center py-4 text-xl">
                  Seleccione un método de pago
                </div>
              )}
              {/* --------------------------------- */}
            </div>

            {/* Saldo restante y cambio */}
            {payments.length > 0 && (
              <section className="payment-result border-top pt-3">
                {getRemainingAmount() > 0 ? (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-remaining flex justify-between w-full">
                      <span className="label pr-2">Restantes</span>
                      <span className="amount self-end mr-5 pr-5 text-danger">
                        S/ {getRemainingAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : getChange() > 0 ? (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-change flex justify-between w-full">
                      <span className="label pr-2 text-success">Cambio</span>
                      <span className="amount self-end mr-5 pr-5 text-success">
                        S/ {getChange().toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-exact flex justify-between w-full">
                      <span className="label pr-2">Restantes</span>
                      <span className="amount self-end mr-5 pr-5 text-success">
                        S/ {getRemainingAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        {/* </div> */}
        {/* </div> */}
        {/* ---------------------------------------- derecho fin */}
      </div>
    </>
  )
}

export default Payment
