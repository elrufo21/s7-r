import React from 'react'

interface TicketHTMLProps {
  info: {
    name: string
    order_date?: Date | string
    receipt_number?: string
    point_id?: string
    lines?: any[]
    payments?: any[]
  }
  finalCustomer?: any
}

const TicketHTML: React.FC<TicketHTMLProps> = ({ info }) => {
  const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
  const session = sessions.find((s: any) => s.point_id === info.point_id)

  const getTotalPrice = () => {
    if (!info.lines || info.lines.length === 0) {
      return '0.00'
    }

    return info.lines
      .reduce((total: number, item: any) => total + (item.amount_untaxed_total || 0), 0)
      .toFixed(2)
  }

  const total = parseFloat(getTotalPrice())

  function formatDateToDDMMYYYY(date: any) {
    const d = date instanceof Date ? date : new Date(date)

    if (isNaN(d.getTime())) {
      return 'Fecha inválida'
    }

    const day = d.getDate().toString().padStart(2, '0')
    const month = (d.getMonth() + 1).toString().padStart(2, '0')
    const year = d.getFullYear()

    let hours = d.getHours()
    const minutes = d.getMinutes().toString().padStart(2, '0')
    const seconds = d.getSeconds().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const getPaymentTotals = () => {
    if (!info.payments || info.payments.length === 0) {
      return { efectivo: 0, tarjeta: 0, yape: 0, plan: 0, transf: 0, credito: 0 }
    }

    const totals = { efectivo: 0, tarjeta: 0, yape: 0, plan: 0, transf: 0, credito: 0 }

    info.payments.forEach((payment: any) => {
      const method = payment.payment_method_name?.toLowerCase() || ''
      const amount = payment.amount || 0

      if (method.includes('efectivo')) totals.efectivo += amount
      else if (method.includes('tarjeta')) totals.tarjeta += amount
      else if (method.includes('yape')) totals.yape += amount
      else if (method.includes('plan')) totals.plan += amount
      else if (method.includes('transf')) totals.transf += amount
      else totals.credito += amount
    })

    return totals
  }
  const paymentTotals = getPaymentTotals()

  return (
    <div
      style={{
        width: '226px',
        minHeight: '600px',
        fontSize: '8px',
        fontFamily: 'monospace',
        backgroundColor: 'white',
        padding: '10px',
        color: 'black',
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Avícola "Pie Grande"</div>
        <div style={{ fontSize: '8px', marginBottom: '2px' }}>JR. HUANCAS 20 - HUANCAYO</div>
        <div style={{ fontSize: '8px', marginBottom: '2px' }}>PEDIDOS 964-612067</div>
      </div>

      {/* Control Section */}
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '5px' }}>
          CONTROL DE PESO
        </div>
        <div style={{ fontSize: '8px', marginBottom: '2px' }}>
          Nº {info.receipt_number || info.name}
        </div>
        <div style={{ fontSize: '8px', marginBottom: '2px' }}>
          FECHA {formatDateToDDMMYYYY(info.order_date || new Date())}
        </div>
        <div style={{ fontSize: '8px', fontWeight: 'bold' }}>{session?.session_name}</div>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid black',
          paddingBottom: '2px',
          marginBottom: '2px',
          fontSize: '7px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ width: '25%', textAlign: 'center' }}>Producto</div>
        <div style={{ width: '10%', textAlign: 'center' }}>Bruto</div>
        <div style={{ width: '8%', textAlign: 'center' }}>C/T</div>
        <div style={{ width: '10%', textAlign: 'center' }}>Tara</div>
        <div style={{ width: '12%', textAlign: 'center' }}>Neto</div>
        <div style={{ width: '15%', textAlign: 'center' }}>Precio</div>
        <div style={{ width: '20%', textAlign: 'center' }}>Total</div>
      </div>

      {/* Table Rows */}
      {info.lines &&
        info.lines.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              marginBottom: '2px',
              fontSize: '7px',
            }}
          >
            <div style={{ width: '25%' }}>{item.name}</div>
            <div style={{ width: '10%', textAlign: 'center' }}>{item.base_quantity}</div>
            <div style={{ width: '8%', textAlign: 'center' }}>{item.tara_quantity}</div>
            <div style={{ width: '10%', textAlign: 'center' }}>
              {(item.tara_total || 0).toFixed(1)}
            </div>
            <div style={{ width: '12%', textAlign: 'right' }}>{item.quantity}</div>
            <div style={{ width: '15%', textAlign: 'center' }}>
              {(Number(item.price_unit) || 0).toFixed(2)}
            </div>
            <div style={{ width: '20%', textAlign: 'right' }}>
              {(item.amount_untaxed_total || 0).toFixed(2)}
            </div>
          </div>
        ))}

      {/* Totales */}
      <div
        style={{
          marginTop: '10px',
          borderTop: '1px solid black',
          paddingTop: '5px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>TOTAL:</span>
          <span style={{ fontSize: '8px' }}>{total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>EFECTIVO:</span>
          <span style={{ fontSize: '8px' }}>{paymentTotals.efectivo.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>TARJETA:</span>
          <span style={{ fontSize: '8px' }}>{paymentTotals.tarjeta.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>YAPE:</span>
          <span style={{ fontSize: '8px' }}>{paymentTotals.yape.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>TRANSF:</span>
          <span style={{ fontSize: '8px' }}>{paymentTotals.transf.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
          <span style={{ fontSize: '8px', fontWeight: 'bold' }}>CREDITO:</span>
          <span style={{ fontSize: '8px' }}>{paymentTotals.credito.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '10px' }}>
        <span>S7</span>
      </div>
    </div>
  )
}

export default TicketHTML
