import React from 'react'
import { Type_pos_payment_origin, TypePayment } from '../types'

interface PaymentTicketProps {
  info: {
    name: string
    order_date?: Date | string
    receipt_number?: string
    point_id?: string
    payments?: any[]
    amount_total?: number
    amount_residual?: number
    type?: TypePayment
    origin?: Type_pos_payment_origin
  }
}

const PaymentTicketHtml: React.FC<PaymentTicketProps> = ({ info }) => {
  const formatDate = (date: any): string => {
    if (typeof date === 'string') {
      date = date.replace(/(\.\d{3})\d+/, '$1')
    }

    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) return 'Fecha inválida'

    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()

    return `${day}/${month}/${year}`
  }

  const groupPaymentsByMethod = () => {
    if (!info.payments?.length) return []

    const grouped = info.payments.reduce((acc: any, payment: any) => {
      const methodName = payment.payment_method_name || 'Sin método'
      if (!acc[methodName]) {
        acc[methodName] = { method: methodName, total: 0 }
      }
      acc[methodName].total += payment.amount || 0
      return acc
    }, {})

    return Object.values(grouped).sort((a: any, b: any) => a.method.localeCompare(b.method))
  }

  const paymentsByMethod = groupPaymentsByMethod()
  const totalPaid = paymentsByMethod.reduce((sum: number, p: any) => sum + p.total, 0)

  return (
    <div
      style={{
        width: '300px',
        minHeight: '400px',
        fontSize: '11px',
        fontFamily: 'Courier New, monospace',
        backgroundColor: 'white',
        padding: '20px 15px',
        paddingTop: '50px',
        paddingBottom: '50px',
        color: '#000',
        fontWeight: 'bold',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>
          Avícola "PIE GRANDE"
        </div>
        <div style={{ fontSize: '12px', marginBottom: '8px' }}>JR. HUANCAS Nº 1048 HUANCAYO</div>
        {info.origin === Type_pos_payment_origin.PAY_DEBT ? (
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            PAGO DE CLIENTE
          </div>
        ) : (
          <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            {info.type === 'I'
              ? 'ENTRADA DE EFECTIVO'
              : info.type === 'O'
                ? 'SALIDA DE EFECTIVO'
                : ''}
          </div>
        )}
      </div>

      <div
        style={{
          padding: '10px',
          marginBottom: '15px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
          {info.receipt_number || 'PG-000000000000'}
        </div>
      </div>

      {/* CLIENTE */}
      {info.name && (
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            PAGO CLIENTE: {info.name?.toUpperCase() || 'SIN NOMBRE'}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
          {formatDate(info.order_date || new Date())}
        </div>
      </div>

      <div
        style={{
          marginBottom: '15px',
        }}
      >
        <div
          style={{
            display: 'flex',
            padding: '8px 6px',
            fontSize: '12px',
            borderBottom: '2px solid #000',
          }}
        >
          <div style={{ width: '60%', textAlign: 'left' }}>TIPO DE PAGO</div>
          <div style={{ width: '40%', textAlign: 'right' }}>MONTO</div>
        </div>

        {paymentsByMethod.length > 0 ? (
          paymentsByMethod.map((payment: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                padding: '10px 6px',
                fontSize: '12px',
              }}
            >
              <div style={{ width: '60%', textAlign: 'left' }}>{payment.method.toUpperCase()}</div>
              <div style={{ width: '40%', textAlign: 'right' }}>
                {Number(payment.total).toFixed(2)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: '15px', textAlign: 'center', fontSize: '11px', color: '#666' }}>
            Sin pagos registrados
          </div>
        )}
      </div>

      <div style={{ marginBottom: '40px', minHeight: '30px' }}></div>

      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S7</span>
      </div>
    </div>
  )
}
export default PaymentTicketHtml
