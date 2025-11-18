import React from 'react'

interface TicketHTMLSimpleProps {
  info: {
    name?: string
    order_date?: Date | string
    receipt_number?: string
    point_id?: string
    partner_name?: string
    lines?: any[]
  }
}

const TicketHTMLSimple: React.FC<TicketHTMLSimpleProps> = ({ info }) => {
  function formatDate(date: any) {
    const d = date instanceof Date ? date : new Date(date)
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const hh = d.getHours()
    const mi = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`
  }
  const getPaymentsByMethod = () => {
    if (!info.payments || info.payments.length === 0) {
      return []
    }

    const grouped = info.payments.reduce((acc: any, payment: any) => {
      const methodName = payment.payment_method_name || 'Sin método'
      if (!acc[methodName]) {
        acc[methodName] = {
          method: methodName,
          total: 0,
        }
      }
      acc[methodName].total += payment.amount || 0
      return acc
    }, {})

    return Object.values(grouped).sort((a: any, b: any) => a.method.localeCompare(b.method))
  }
  const paymentsByMethod = getPaymentsByMethod()
  const totalPayments = paymentsByMethod.reduce((sum: number, p: any) => sum + p.total, 0)
  return (
    <div
      style={{
        width: '300px',
        minHeight: '600px',
        fontSize: '12px',
        fontFamily: 'monospace',
        backgroundColor: 'white',
        padding: '8px',
        paddingTop: '50px',
        paddingBottom: '50px',
        color: 'black',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>AVICOLA "PIE GRANDE"</div>
        <div style={{ fontSize: '11px' }}>JR. HUANCAS 1048 - HUANCAYO</div>
        <div style={{ fontSize: '11px' }}>PEDIDOS 964642087</div>
      </div>

      <div style={{ marginBottom: '2px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>
          CONTROL DE PESO {info.receipt_number}
        </div>

        <div style={{ fontSize: '8px' }}>CAMBIAR ESTE TICKET POR BOLETA O FACTURA EN CAJA</div>

        <div style={{ fontSize: '11px', marginTop: '2px' }}>
          FECHA {formatDate(info.order_date || new Date())}
        </div>

        <div style={{ fontSize: '14px', marginTop: '2px', textTransform: 'uppercase' }}>
          {info?.partner_name ?? ''}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: '11px',
        }}
      >
        <div style={{ width: '24%', border: '1px solid #000' }}>TIPO</div>
        <div style={{ width: '14%', textAlign: 'center', border: '1px solid #000' }}>C/T</div>
        <div style={{ width: '24%', textAlign: 'center', border: '1px solid #000' }}>P BRUTO</div>
        <div style={{ width: '14%', textAlign: 'center', border: '1px solid #000' }}>TARA</div>
        <div style={{ width: '24%', textAlign: 'center', border: '1px solid #000' }}>P NETO</div>
      </div>

      {/**<div style={{ width: '20%', textAlign: 'right', border: '1px solid #000' }}>TOTAL</div>*/}
      {info.lines?.map((item: any, i: number) => (
        <div key={i}>
          <div
            style={{
              display: 'flex',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                width: '24%',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontWeight: 'bold',
              }}
            >
              {item.short_name || item.name}
            </div>
            <div style={{ width: '14%', textAlign: 'center' }}>{item.tara_quantity}</div>
            <div style={{ width: '24%', textAlign: 'right' }}>
              {item.base_quantity ? item.base_quantity : '0'}
            </div>
            <div style={{ width: '14%', textAlign: 'center' }}>
              {item.tara_total ? item.tara_total : '0'}
            </div>
            <div style={{ width: '24%', textAlign: 'right' }}>{item.quantity}</div>
          </div>
        </div>
      ))}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          fontSize: '11px',
          borderTop: '1px solid #000',
          borderBottom: '1px solid #000',
        }}
      >
        <div style={{ width: '38%', textAlign: 'center' }}>Producto</div>
        <div style={{ width: '20%', textAlign: 'center' }}>P.NETO</div>
        <div style={{ width: '20%', textAlign: 'center' }}>PRECIO</div>
        <div style={{ width: '22%', textAlign: 'center' }}>TOTAL</div>
      </div>
      {info.lines?.map((item: any, i: number) => (
        <div key={i}>
          <div
            style={{
              display: 'flex',
              fontSize: '12px',
            }}
          >
            <div
              style={{
                width: '38%',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            >
              {item.short_name || item.name}
            </div>
            <div style={{ width: '20%', textAlign: 'right' }}>{item.quantity}</div>
            <div style={{ width: '20%', textAlign: 'right' }}>
              {item.price_unit ? item.price_unit : '0'}
            </div>
            <div style={{ width: '22%', textAlign: 'right' }}>
              {item.amount_withtaxed_total.toFixed(2) || 0}
            </div>
          </div>
        </div>
      ))}
      <div
        style={{
          marginTop: '3px',
          borderTop: '1px solid black',
          paddingTop: '6px',
        }}
      >
        {/* Total general */}
        {/*
        <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>DEUDA: {adjustTotal(total).adjusted}</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            // borderBottom: '1px solid black',
            paddingBottom: '4px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>TOTAL:</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {adjustTotal(total).adjusted}
          </span>
        </div>
        */}
        <div style={{ fontSize: '12px', textAlign: 'right' }}>TOTAL: {info?.amount_total}</div>

        {/* Métodos de pago dinámicos */}
        {paymentsByMethod.map((payment: any, index: number) => (
          // <div
          //   key={index}
          //   style={{
          //     display: 'flex',
          //     justifyContent: 'space-between',
          //     marginBottom: '3px',
          //   }}
          // >
          //   <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
          //     {payment.method.toUpperCase()}:
          //   </span>
          //   <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{payment.total.toFixed(2)}</span>
          // </div>

          <div style={{ fontSize: '12px', textAlign: 'right' }}>
            {payment.method.toUpperCase()}
            {': '}
            {payment.total.toFixed(2)}
          </div>
        ))}

        {/* Total de pagos (si hay más de un método) */}
        {paymentsByMethod.length > 1 && (
          // <div
          //   style={{
          //     display: 'flex',
          //     justifyContent: 'space-between',
          //     marginTop: '6px',
          //     paddingTop: '4px',
          //     borderTop: '1px solid black',
          //   }}
          // >
          //   <span style={{ fontSize: '11px', fontWeight: 'bold' }}>TOTAL PAGADO:</span>
          //   <span style={{ fontSize: '11px', fontWeight: 'bold' }}>{totalPayments.toFixed(2)}</span>
          // </div>

          <div style={{ fontSize: '12px', textAlign: 'right' }}>
            TOTAL PAGADO: {totalPayments.toFixed(2)}
          </div>
        )}

        {/* Diferencia */}
        {parseFloat(info?.amount_residual) !== 0 && (
          <div style={{ fontSize: '12px', textAlign: 'right' }}>
            DEUDA:
            {Number(info?.amount_residual) % 1 === 0
              ? Number(info?.amount_residual).toString()
              : Number(info?.amount_residual).toFixed(2)}
          </div>
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          paddingTop: '10px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S7</span>
      </div>
    </div>
  )
}

export default TicketHTMLSimple
