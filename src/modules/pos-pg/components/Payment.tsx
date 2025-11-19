// import { HiOutlineBackspace } from 'react-icons/hi'
import { HiOutlineBackspace } from 'react-icons/hi2'

import { useRef, useState, useEffect } from 'react'
import React from 'react'
import useAppStore from '@/store/app/appStore'
import useUserStore from '@/store/persist/persistStore'
import { useParams } from 'react-router-dom'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { FrmBaseDialog } from '@/shared/components/core'
import clientConfig from '@/modules/contacts/views/contact-index/config'
import contactsConfig from '../views/contact-index/config'
import { CustomHeader } from './CustomHeader'
import { offlineCache } from '@/lib/offlineCache'
import { usePWA } from '@/hooks/usePWA'
import { Type_pos_payment_origin, TypePayment, TypeStateOrder, TypeStatePayment } from '../types'
import { adjustTotal } from '@/shared/helpers/helpers'
import { now, setCurrentTimeIfToday } from '@/shared/utils/dateUtils'

import IconButton from '@mui/material/IconButton'
import { IoClose } from 'react-icons/io5'

// Definición de la interfaz para los pagos
interface PaymentItem {
  payment_id: string
  payment_method_name: string
  amount: number
  payment_method_id: number
  company_id: number
  state: string
  order_id: number | string
  date: Date
  currency_id: number
}

export const PaymentMethodCard = ({
  method,
  onClick,
  bg = 'white',
}: {
  method: { payment_method_id: number; name: string; files?: { publicUrl: string }[] }
  onClick: (method: string, payment_method_id: number) => void
  bg: string
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let url: string | null = null
    let isMounted = true

    async function loadImage() {
      const blob = await offlineCache.getPaymentMethodImage(method.payment_method_id)
      if (blob && isMounted) {
        url = URL.createObjectURL(blob)
        setImageUrl(url)
      } else if (isMounted) {
        setImageUrl(method?.files?.[0]?.publicUrl || null)
      }
    }

    loadImage()

    return () => {
      isMounted = false
      if (url) URL.revokeObjectURL(url)
    }
  }, [method.payment_method_id, method?.files])

  return (
    <div key={method.payment_method_id} className={`btn2 btn2-white fs-3 lh-mlg ${bg}`}>
      <div
        className="flex items-center gap-2 text-left cursor-pointer"
        onClick={() => onClick(method.name, method.payment_method_id)}
      >
        <div className="c_imageEx_50 self-center">
          {imageUrl && <img src={imageUrl} alt={method.name} width={200} height={200} />}
        </div>
        <span className="payment-name">{method.name}</span>
      </div>
    </div>
  )
}

const Payment = () => {
  const { pointId } = useParams()
  const { isOnline } = usePWA()
  const sessions = JSON.parse(localStorage.getItem('sessions') ?? '[]')
  const { session_id } = sessions.find((s: any) => s.point_id === Number(pointId))
  const {
    setScreenPg,
    getTotalPriceByOrderPg,
    selectedOrderPg,
    executeFnc,
    orderDataPg,
    setHandleChangePg,
    setBackToProductsPg,
    addPaymentToOrderPg,
    updatePaymentInOrderPg,
    removePaymentFromOrderPg,
    setOrderDataPg,
    paymentMethodsPg,
    finalCustomerPg,
    defaultPosSessionDataPg,
    modalData,
    setModalData,
    openDialog,
    closeDialogWithData,
    setFinalCustomerPg,
    setFrmIsChanged,
    frmLoading,
    localModePg,
    updateOrderPartnerPg,
    dateInvoice,
    setDateInvoice,
  } = useAppStore()
  const [is_change, setIsChange] = useState(false)
  const finalCustomerRef = useRef(finalCustomerPg)
  const [selectedPaymentId, setSelectedPaymentId] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [isFirstDigit, setIsFirstDigit] = useState(true)
  const { userData } = useUserStore()
  const currentOrder = orderDataPg?.find((o) => o.order_id === selectedOrderPg)
  const payments = currentOrder?.payments || []

  useEffect(() => {
    if (
      payments.length === 0 &&
      paymentMethodsPg.length > 0 &&
      selectedOrderPg &&
      currentOrder.payment_state === TypeStatePayment.PAYMENT && currentOrder?.partner_id === defaultPosSessionDataPg.partner_id
    ) {
      const firstMethod = paymentMethodsPg[0]
      const id = crypto.randomUUID()
      const orderTotal = adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted

      const newPayment: PaymentItem = {
        payment_id: id,
        company_id: userData.company_id,
        state: 'A',
        order_id: selectedOrderPg,
        date: setCurrentTimeIfToday(dateInvoice),
        currency_id: 1,
        amount: orderTotal,
        payment_method_id: firstMethod.payment_method_id,
        payment_method_name: firstMethod.name,
      }

      addPaymentToOrderPg(selectedOrderPg, newPayment)
      setSelectedPaymentId(id)
      setInputAmount(Math.abs(orderTotal).toFixed(2))
      setIsFirstDigit(true)
      setHandleChangePg(true)
      setFrmIsChanged(true)
    }
  }, [paymentMethodsPg.length, selectedOrderPg])

  useEffect(() => {
    setFinalCustomerPg({
      partner_id:
        orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_id ||
        defaultPosSessionDataPg.partner_id,
      name:
        orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_name ||
        defaultPosSessionDataPg.name,
    })
    if (is_change) {
      if (orderDataPg.find((item) => item.order_id === selectedOrderPg)?.partner_id) {
        /* setFinalCustomer({
          partner_id: orderData.find((item) => item.order_id === selectedOrder)?.partner_id,
          name: orderData.find((item) => item.order_id === selectedOrder)?.partner_name,
        })*/
      }
      if (orderDataPg?.find((item) => item?.order_id === selectedOrderPg)?.pos_status === 'Y')
        setIsChange(false)
    }
  }, [is_change, orderDataPg, selectedOrderPg])

  const getTotalPaid = () => {
    return payments.reduce((sum, payment) => sum + payment.amount, 0)
  }

  const getChange = () => {
    const total = adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted
    const paid = getTotalPaid()
    return Math.max(0, paid - total)
  }

  const getRemainingAmount = () => {
    const total = adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted
    const paid = getTotalPaid()
    return Math.max(0, total - paid)
  }

  const handlePaymentMethodClick = (method: string, payment_method_id: number) => {
    setFrmIsChanged(true)
    const id = crypto.randomUUID()

    const orderTotal = adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted
    const totalPaid = getTotalPaid()
    const remaining = orderTotal < 0 ? orderTotal - totalPaid : getRemainingAmount()
    const newPayment: PaymentItem = {
      payment_id: id,
      company_id: userData.company_id,
      state: 'A',
      order_id: selectedOrderPg,
      date: setCurrentTimeIfToday(dateInvoice),
      currency_id: 1,
      amount: remaining,
      payment_method_id,
      payment_method_name: method,
    }

    addPaymentToOrderPg(selectedOrderPg, newPayment)
    setSelectedPaymentId(id)
    setInputAmount(Math.abs(remaining).toFixed(2))
    setIsFirstDigit(true)
    setHandleChangePg(true)
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
        if (isFirstDigit || newAmount === '0') {
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
      setIsFirstDigit(false)
    } else {
      // Números del 0-9
      if (isFirstDigit) {
        newAmount = value
        setIsFirstDigit(false)
      } else {
        newAmount += value
      }
      setHandleChangePg(true)
    }

    // Permitir ingresar cualquier valor sin restricciones
    let finalAmount = parseFloat(newAmount) || 0

    setInputAmount(newAmount)

    const updatedPayment = {
      ...payments[paymentIndex],
      amount: finalAmount,
    }

    updatePaymentInOrderPg(selectedOrderPg, updatedPayment)
  }

  const handleSelectPayment = (id: string) => {
    setSelectedPaymentId(id)
    const payment = payments.find((p) => p.payment_id === id)
    if (payment) {
      const amountStr = Math.abs(payment.amount).toFixed(2)
      setInputAmount(amountStr)
      setIsFirstDigit(true)
    } else {
      setInputAmount('')
      setIsFirstDigit(true)
    }
  }

  const handleRemovePayment = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFrmIsChanged(true)
    removePaymentFromOrderPg(selectedOrderPg, id)

    if (selectedPaymentId === id) {
      setSelectedPaymentId('')
      setInputAmount('')
      setIsFirstDigit(true)
    }
    setHandleChangePg(true)
  }

  const validatePayment = () => {
    let message = ''
    if (getRemainingAmount() === 0) return
    if (getRemainingAmount() === adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted) {
      message = 'Se creara una orden de venta al crédito'
    }
    if (getRemainingAmount() !== adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted) {
      message = 'Se creara una orden de venta con pago parcial'
    }
    return message
  }

  const modalValidateMethod = async () => {
    /*const message = validatePayment()
    if (message) {
      const dialogId = openDialog({
        title: '',
        dialogContent: () => (
          <div className="p-4 rounded-xl bg-gray-100 text-xl text-gray-800 shadow-sm">
            {message}
          </div>
        ),
        buttons: [
          {
            text: 'Confirmar',
            type: 'confirm',
            onClick: async () => {
              await handleValidatePayment()
              setDateInvoice(new Date())

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
    } else {
      handleValidatePayment()
    }*/
   handleValidatePayment()
  }

  const handleValidatePayment = async () => {
    let paymentState = TypeStatePayment.PAYMENT

    if (getRemainingAmount() === adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted) {
      paymentState = TypeStatePayment.PENDING_PAYMENT
    }
    if (
      getRemainingAmount() !== adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted &&
      getRemainingAmount() !== 0
    ) {
      paymentState = TypeStatePayment.PARTIAL_PAYMENT
    }
    const { state } = JSON.parse(localStorage.getItem('session-store') ?? '{}')
    const { userData } = state
    const data = orderDataPg.find((item) => item.order_id === selectedOrderPg)
    const newPayments = data?.payments?.filter((item: any) => item.amount !== 0)
    const amount_payment = () => {
      const totalPaid = getTotalPaid()
      if (paymentState === TypeStatePayment.PAYMENT) {
        return adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted
      } else if (paymentState === TypeStatePayment.PARTIAL_PAYMENT) {
        return totalPaid
      } else if (paymentState === TypeStatePayment.PENDING_PAYMENT) {
        return 0
      }
    }

    if (!data) return
    const updatedData = {
      ...data,
      name: data.name,
      state: TypeStateOrder.REGISTERED,
      order_date: setCurrentTimeIfToday(dateInvoice),
      session_id: typeof data.order_id === 'string' ? session_id : undefined,
      currency_id: 1,
      company_id: data.company_id,
      invoice_state: data.invoice_state || 'T',
      partner_id: finalCustomerPg?.partner_id,
      payment_state: paymentState,
      combined_states: TypeStateOrder.REGISTERED + paymentState,
      point_id: pointId,
      lines: data.lines?.map((item: any, i: number) => ({
        line_id: item?.line_id,
        order_id: selectedOrderPg,
        position: i + 1,
        product_id: item?.product_id,
        name: item?.name,
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
        tara_value: item?.tara_value,
        tara_quantity: item?.tara_quantity,
        base_quantity: item?.base_quantity,
        tara_total: item?.tara_total,
        uom_name: item?.uom_name,
      })),
      order_id: selectedOrderPg,
      payments: newPayments?.map((p) => ({
        ...p,
        user_id: userData?.user_id,
        state: 'R',
        origin: Type_pos_payment_origin.DOCUMENT,
        type: TypePayment.INPUT,
        date: setCurrentTimeIfToday(dateInvoice),
      })),
      amount_untaxed: adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted,
      amount_withtaxed: adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted,
      amount_total: adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted,
      amount_adjustment: adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).residual,
      amount_payment: amount_payment(),
      amount_residual: getRemainingAmount().toFixed(2),
    }

    if (!isOnline || localModePg) {
      await offlineCache.saveOrderOffline({
        ...updatedData,
        action: typeof data.order_id === 'string' ? 'i' : 'u',
      })
      const orders = await offlineCache.getOfflinePosOrders()
      setDateInvoice(new Date())
      setOrderDataPg(orders)
      setFrmIsChanged(true)

      setScreenPg('invoice')
      return
    }
    await executeFnc('fnc_pos_order', typeof data.order_id === 'string' ? 'i' : 'u', updatedData)
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

    setOrderDataPg(orders?.oj_data || [])
    setDateInvoice(new Date())
    setFrmIsChanged(false)
    setScreenPg('invoice')
    return
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
            setFinalCustomerPg(dataUpdate.find((item: any) => item.selected === true))
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

  const fnc_open_contact_modal = async () => {
    const localCustomers = await offlineCache.getOfflineContacts()
    if (modalData.length === 0) setModalData(localCustomers)
    const dialogId = openDialog({
      title: 'Elija un cliente',
      contactModal: true,
      dialogContent: () => (
        <ModalBase
          config={contactsConfig}
          onRowClick={(row) => {
            if (row.partner_id === finalCustomerPg.partner_id) {
              setFinalCustomerPg({})
              setIsChange(true)
              setHandleChangePg(true)
              closeDialogWithData(dialogId, row)
              return
            }
            setIsChange(true)
            updateOrderPartnerPg(selectedOrderPg, row.partner_id, row.name)
            setHandleChangePg(true)
            closeDialogWithData(dialogId, row)
          }}
          contactModal={true}
          openEditModal={(client: any) => {
            fnc_edit_client(client)
          }}
          customHeader={<CustomHeader fnc_create_button={fnc_create_customer} />}
        />
      ),
      buttons: [
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            setFinalCustomerPg({
              partner_id: defaultPosSessionDataPg.partner_id,
              partner_name: defaultPosSessionDataPg.name,
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
              if (finalCustomerPg) {
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

  const handleSymbolsClick = () => {
    if (!selectedOrderPg || !selectedPaymentId) return
    const currentPayment = payments.find((p) => p.payment_id === selectedPaymentId)
    if (!currentPayment) return
    const newAmount = currentPayment.amount * -1
    const updatedPayment = {
      ...currentPayment,
      amount: newAmount,
    }
    updatePaymentInOrderPg(selectedOrderPg, updatedPayment)
    setInputAmount(Math.abs(newAmount).toString())
  }
  useEffect(() => {
    if (!selectedPaymentId && payments.length > 0) {
      const lastPayment = payments[payments.length - 1]
      setSelectedPaymentId(lastPayment.payment_id)

      setInputAmount(Math.abs(lastPayment.amount).toFixed(2))
      setIsFirstDigit(true)
    }
  }, [payments, selectedPaymentId])
  return (
    <>
      <div className="product-screen">
        <div className="leftpanel">
          <div className="payment-methods-container">
            <div className="payment-methods flex flex-col gap-2">
              {paymentMethodsPg.map((method) => (
                <PaymentMethodCard
                  bg=""
                  key={method.payment_method_id}
                  method={method}
                  onClick={!frmLoading ? handlePaymentMethodClick : () => { }}
                />
              ))}
            </div>
          </div>

          <div className="order-bottom">
            <div className="pads">
              <div className="control-buttons">
                <button
                  className="btn2 btn2-white touch-lh-m text-truncate w-auto text-action"
                  onClick={() => {
                    fnc_open_contact_modal()
                  }}
                >
                  {finalCustomerPg.name ? finalCustomerPg.name : defaultPosSessionDataPg.name}
                </button>
              </div>

              <div className="subpads">
                <div className="numpad">
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('1')}
                  >
                    1
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('2')}
                  >
                    2
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('3')}
                  >
                    3
                  </button>
                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg`}
                    onClick={() => handleNumpadClick('+10')}
                  >
                    +10
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('4')}
                  >
                    4
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('5')}
                  >
                    5
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('6')}
                  >
                    6
                  </button>
                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg `}
                    onClick={() => handleNumpadClick('+20')}
                  >
                    +20
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('7')}
                  >
                    7
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('8')}
                  >
                    8
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('9')}
                  >
                    9
                  </button>
                  <button
                    className={`numpad-button btn2 btn2-white fs-3 lh-mlg`}
                    onClick={() => handleNumpadClick('+50')}
                  >
                    +50
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg o_colorlist_item_numpad_color_3"
                    onClick={() => {
                      handleSymbolsClick()
                    }}
                  >
                    +/-
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg"
                    onClick={() => handleNumpadClick('0')}
                  >
                    0
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg o_colorlist_item_numpad_color_2"
                    onClick={() => handleNumpadClick('.')}
                  >
                    .
                  </button>
                  <button
                    className="numpad-button btn2 btn2-white fs-3 lh-mlg justify-items-center o_colorlist_item_numpad_color_1"
                    onClick={() => handleNumpadClick('backspace')}
                  >
                    <HiOutlineBackspace style={{ fontSize: '28px' }} />
                  </button>
                </div>

                <div className="actionpad d-flex flex-row gap-2">
                  <button
                    className="btn2 btn2-white btn-lg flex-auto min-h-[70px]"
                    onClick={() => {
                      setScreenPg('products')
                      setBackToProductsPg(true)
                    }}
                  >
                    Regresar
                  </button>
                  <button
                    className="btn btn-primary btn-lg flex-auto min-h-[70px]"
                    onClick={() => modalValidateMethod()}
                    disabled={frmLoading}
                  >
                    Validar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="center-content flex flex-col flex-grow-1 gap-4 p-4">
          <section className="paymentlines-container">
            <div className="text-[100px] text-center text-[#283833]">
              <span className="text-[60%] opacity-[0.7]">S/ </span>
              <span className="">
                {adjustTotal(getTotalPriceByOrderPg(selectedOrderPg)).adjusted}
              </span>
            </div>
          </section>

          <div className="payment-summary d-flex flex-grow-1 flex-column gap-1 overflow-y-auto py-3">
            <div className="paymentlines d-flex flex-column overflow-y-auto gap-4 mb-4">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <div
                    key={payment.payment_id}
                    className={`payment-line ${selectedPaymentId === payment.payment_id ? 'select' : ''
                      }`}
                    onClick={() => handleSelectPayment(payment.payment_id)}
                  >
                    <div className="payment-info">
                      <div>{payment.payment_method_name}</div>
                      <div className="payment-amount px-3">S/ {payment.amount.toFixed(2)}</div>
                    </div>

                    <IconButton
                      onClick={(e) => handleRemovePayment(payment.payment_id, e)}
                      aria-label="close"
                      className="!ml-3 !bg-red-100 hover:!bg-red-200"
                    >
                      <IoClose style={{ fontSize: '30px' }} className="" />
                    </IconButton>
                  </div>
                ))
              ) : (
                <div className="text-bg-light border text-center py-4 text-xl">
                  Seleccione un método de pago
                </div>
              )}
            </div>

            {payments.length > 0 && (
              <section className="payment-result border-top pt-3">
                {getRemainingAmount() > 0 ? (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-remaining flex justify-between w-full">
                      <span className="label pr-2 text-danger">Restante</span>
                      <span className="amount self-end text-danger text-2xl">
                        S/ {getRemainingAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : getChange() > 0 ? (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-change flex justify-between w-full">
                      <span className="label pr-2 text-success">Cambio</span>
                      <span className="amount self-end text-success text-2xl">
                        S/ {getChange().toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="payment-status-container flex justify-between text-xl">
                    <div className="payment-status-exact flex justify-between w-full">
                      <span className="label pr-2 text-success">Restante</span>
                      <span className="amount self-end text-success text-2xl">
                        S/ {getRemainingAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment
