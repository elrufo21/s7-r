import { HiOutlineBackspace } from 'react-icons/hi'
import { useState } from 'react'
import React from 'react'
import useAppStore from '@/store/app/appStore'

// Definición de la interfaz para los pagos
interface PaymentItem {
  id: string
  method: string
  amount: number
}

// Enum para los métodos de pago
const PaymentMethod = {
  Cash: 'Efectivo',
  Cheque: 'Cheque',
  Card: 'Tarjeta',
  ClientAccount: 'Cuenta de cliente',
}

// Componente principal de pago
const Payment = () => {
  const { setScreen, getTotalPriceByOrder, selectedOrder } = useAppStore()
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [selectedPaymentId, setSelectedPaymentId] = useState('')
  const [inputAmount, setInputAmount] = useState('')
  const [visibleNumberPad, setVisibleNumberPad] = useState(true)
  const [isFirstDigit, setIsFirstDigit] = useState(true)

  // Calcula el total actual pagado
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

  // Agrega un nuevo método de pago
  const handlePaymentMethodClick = (method: string) => {
    // Verificar si este método de pago ya existe
    const existingPayment = payments.find((p) => p.method === method)

    if (existingPayment) {
      // Si ya existe, seleccionarlo
      setSelectedPaymentId(existingPayment.id)
      setInputAmount(existingPayment.amount.toFixed(2))
      setIsFirstDigit(true)
      return
    }

    const id = crypto.randomUUID()
    const remaining = getRemainingAmount()

    const newPayment: PaymentItem = {
      id,
      method,
      amount: remaining,
    }

    setPayments([...payments, newPayment])
    setSelectedPaymentId(id)
    setInputAmount(remaining.toFixed(2))
    setIsFirstDigit(true)
  }

  // Maneja los clics en el teclado numérico
  const handleNumpadClick = (value: string) => {
    if (!selectedPaymentId) return

    // Encuentra el pago seleccionado
    const paymentIndex = payments.findIndex((p) => p.id === selectedPaymentId)
    if (paymentIndex === -1) return

    let newAmount = inputAmount

    if (value === 'backspace') {
      // Elimina el último carácter
      if (newAmount.length <= 1 || (newAmount.length === 2 && newAmount.includes('.'))) {
        newAmount = '0'
        setIsFirstDigit(true)
      } else {
        newAmount = newAmount.slice(0, -1)
      }
    } else if (value === '+/-') {
      // Cambia el signo
      newAmount = newAmount.startsWith('-') ? newAmount.substring(1) : '-' + newAmount
    } else if (value === '.') {
      // Añade el punto decimal si no existe
      if (!newAmount.includes('.')) {
        if (isFirstDigit) {
          newAmount = '0.'
          setIsFirstDigit(false)
        } else {
          newAmount += '.'
        }
      }
    } else if (['+10', '+20', '+50'].includes(value)) {
      // Añade el valor al monto actual
      const addValue = parseInt(value.substring(1))
      const currentValue = parseFloat(newAmount) || 0
      newAmount = (currentValue + addValue).toFixed(2)
      setIsFirstDigit(true)
    } else {
      // Añade el dígito al monto
      if (isFirstDigit) {
        newAmount = value
        setIsFirstDigit(false)
      } else {
        newAmount += value
      }
    }

    setInputAmount(newAmount)

    // Actualiza el monto en el pago seleccionado
    const updatedPayments = [...payments]
    updatedPayments[paymentIndex] = {
      ...updatedPayments[paymentIndex],
      amount: parseFloat(newAmount) || 0,
    }

    setPayments(updatedPayments)
  }

  // Completa el pago
  /* const handleCompletePay = () => {
    if (getRemainingAmount() > 0) {
      alert('Debe cubrir el monto total para completar el pago')
      return
    }

    // Aquí se implementaría la lógica para finalizar el pago
    console.log('Pago completado:', payments)
    alert('Pago procesado correctamente')
  }
*/
  // Selecciona un pago existente
  const handleSelectPayment = (id: string) => {
    setSelectedPaymentId(id)
    const payment = payments.find((p) => p.id === id)
    setInputAmount(payment ? payment.amount.toFixed(2) : '')
    setIsFirstDigit(true)
  }

  // Elimina un pago de la lista
  const handleRemovePayment = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPayments(payments.filter((p) => p.id !== id))
    if (selectedPaymentId === id) {
      setSelectedPaymentId('')
      setInputAmount('')
      setIsFirstDigit(true)
    }
  }

  return (
    <div className="payment-screen flex h-full">
      {/* Panel izquierdo con métodos de pago y teclado numérico */}
      <div className="leftpanel h-full flex flex-col">
        <div className="paymentmethods-container mb-3 flex-grow-1">
          <div className="paymentmethods flex flex-col gap-2">
            {/* Método de pago: Efectivo */}
            <div className="button paymentmethod btn btn-secondary btn-lg flex-fill">
              <div
                className="payment-method-display flex items-center gap-2 text-left cursor-pointer"
                onClick={() => handlePaymentMethodClick(PaymentMethod.Cash)}
              >
                <img
                  className="payment-method-icon"
                  src="https://kunitaros.odoo.com/point_of_sale/static/src/img/money.png"
                  alt="Efectivo"
                />
                <span className="payment-name">Efectivo</span>
              </div>
            </div>

            {/* Método de pago: Cheque */}
            <div className="button paymentmethod btn btn-secondary btn-lg flex-fill">
              <div
                className="payment-method-display flex items-center gap-2 text-left cursor-pointer"
                onClick={() => handlePaymentMethodClick(PaymentMethod.Cheque)}
              >
                <img
                  className="payment-method-icon"
                  src="https://kunitaros.odoo.com/point_of_sale/static/src/img/card-bank.png"
                  alt="Cheque"
                />
                <span className="payment-name">Cheque</span>
              </div>
            </div>

            {/* Método de pago: Tarjeta */}
            <div className="button paymentmethod btn btn-secondary btn-lg flex-fill">
              <div
                className="payment-method-display flex items-center gap-2 text-left cursor-pointer"
                onClick={() => handlePaymentMethodClick(PaymentMethod.Card)}
              >
                <img
                  className="payment-method-icon"
                  src="https://kunitaros.odoo.com/point_of_sale/static/src/img/card-bank.png"
                  alt="Tarjeta"
                />
                <span className="payment-name">Tarjeta</span>
              </div>
            </div>

            {/* Método de pago: Cuenta de cliente */}
            <div className="button paymentmethod btn btn-secondary btn-lg flex-fill">
              <div
                className="payment-method-display flex items-center gap-2 text-left cursor-pointer"
                onClick={() => handlePaymentMethodClick(PaymentMethod.ClientAccount)}
              >
                <img
                  className="payment-method-icon"
                  src="https://kunitaros.odoo.com/point_of_sale/static/src/img/pay-later.png"
                  alt="Cuenta de cliente"
                />
                <span className="payment-name">Cuenta de cliente</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teclado numérico y botones de control */}
        <div className="order-bottom">
          <div className="pads">
            <div className="control-buttons flex mb-2">
              <button className="btn btn-secondary">Nota</button>
              <button className="btn btn-secondary ml-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {visibleNumberPad && (
              <div className="subpads mt-2">
                <div className="numpad grid grid-cols-4 gap-1">
                  {/* Primera fila */}
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('1')}
                  >
                    1
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('2')}
                  >
                    2
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('3')}
                  >
                    3
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-green-100"
                    onClick={() => handleNumpadClick('+10')}
                  >
                    +10
                  </button>

                  {/* Segunda fila */}
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('4')}
                  >
                    4
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('5')}
                  >
                    5
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('6')}
                  >
                    6
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-green-100"
                    onClick={() => handleNumpadClick('+20')}
                  >
                    +20
                  </button>

                  {/* Tercera fila */}
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('7')}
                  >
                    7
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('8')}
                  >
                    8
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('9')}
                  >
                    9
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-green-100"
                    onClick={() => handleNumpadClick('+50')}
                  >
                    +50
                  </button>

                  {/* Cuarta fila */}
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-yellow-100"
                    onClick={() => handleNumpadClick('+/-')}
                  >
                    +/-
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3"
                    onClick={() => handleNumpadClick('0')}
                  >
                    0
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-yellow-100"
                    onClick={() => handleNumpadClick('.')}
                  >
                    .
                  </button>
                  <button
                    className="numpad-button btn btn-secondary fs-3 bg-red-100"
                    onClick={() => handleNumpadClick('backspace')}
                  >
                    <HiOutlineBackspace className="text-2xl" />
                  </button>
                </div>

                <div className="actionpad d-flex flex-row gap-2">
                  <button
                    className="btn btn-secondary btn-lg flex-grow py-4"
                    onClick={() => setVisibleNumberPad(false)}
                  >
                    Regresar
                  </button>
                  <button
                    className="btn btn-primary btn-lg flex-grow py-4 bg-purple-700"
                    onClick={() => setScreen('invoice')}
                    disabled={getRemainingAmount() > 0}
                  >
                    Validar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel central con resumen de pagos */}
      <div className="center-content flex flex-col flex-grow-1 gap-4 p-4">
        {/* Total a pagar */}
        <section className="paymentlines-container">
          <div className="total text-center text-success">
            S/ {getTotalPriceByOrder(selectedOrder).toFixed(2)}
          </div>
        </section>

        {/* Lista de pagos */}
        <div className="payment-summary flex flex-col flex-grow-1 gap-2 overflow-y-auto">
          <div className="paymentlines flex flex-col overflow-y-auto gap-2 mb-3">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className={`paymentline flex items-center bg-view border rounded-lg ${
                    selectedPaymentId === payment.id ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => handleSelectPayment(payment.id)}
                >
                  <div className="payment-infos flex items-center justify-between w-full px-3 py-3 cursor-pointer text-xl">
                    <div>{payment.method}</div>
                    <div className="payment-amount px-3">
                      S/ {payment.amount.toFixed(2)}
                      <button
                        className="ml-2 text-gray-500 hover:text-red-500"
                        onClick={(e) => handleRemovePayment(payment.id, e)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-bg-light border text-center py-4 text-xl">
                Seleccione un método de pago
              </div>
            )}
          </div>

          {/* Saldo restante y cambio */}
          {payments.length > 0 && (
            <section className="paymentlines-container border-top pt-3">
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
    </div>
  )
}

export default Payment
