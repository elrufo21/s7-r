import { adjustTotal } from '@/shared/helpers/helpers'
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
      .reduce((total: number, item: any) => total + (item.amount_withtaxed_total || 0), 0)
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

  // Agrupar pagos por método de pago
  const getPaymentsByMethod = () => {
    if (!info.payments || info.payments.length === 0) {
      return []
    }

    // Agrupar por payment_method_name
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

    // Convertir a array y ordenar alfabéticamente
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
        fontWeight: 'bold',
      }}
    >
      {/* Encabezado */}
      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '-2px',
          }}
        >
          AVICOLA "PIE GRANDE"
        </div>
        <div style={{ fontSize: '11px', marginBottom: '-2px', fontWeight: 'bold' }}>
          JR. HUANCAS 1048 - HUANCAYO
        </div>
        <div style={{ fontSize: '11px', marginBottom: '-2px', fontWeight: 'bold' }}>
          PEDIDOS 964642087
        </div>
      </div>

      {/* Control Section */}
      <div style={{ marginBottom: '2px', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 'bold',
            marginBottom: '0px',
          }}
        >
          CONTROL DE PESO {info.receipt_number}
        </div>
        <div style={{ fontSize: '8px', marginBottom: '3px', fontWeight: 'bold' }}>
          CAMBIAR ESTE TICKET POR BOLETA O FACTURA EN CAJA
        </div>
        {/*
        <div style={{ fontSize: '11px', marginBottom: '3px', fontWeight: 'bold' }}>
          {info.receipt_number}
        </div>
        */}

        <div style={{ fontSize: '11px', marginBottom: '3px', fontWeight: 'bold', textAlign: 'center' }}>
          FECHA {formatDateToDDMMYYYY(info.order_date || new Date())}
        </div>
        {/* <div style={{ fontSize: '11px', fontWeight: 'bold' }}>{session?.session_name}</div> */}
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>TIENDA MADRUGADA</div>
      </div>

      {/* Table Header */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid black',
          paddingBottom: '3px',
          marginBottom: '3px',
          fontSize: '10px',
          fontWeight: 'bold',
        }}
      >
        <div style={{ width: '25%', textAlign: 'left', fontSize: '12px' }}>PRODUCTO</div>
        <div style={{ width: '15%', textAlign: 'right', fontSize: '12px' }}>BRUTO</div>
        <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>TARA</div>
        <div style={{ width: '15%', textAlign: 'right', fontSize: '12px' }}>NETO</div>
        <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>PRECIO</div>
        <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>TOTAL</div>
      </div>

      {info.lines &&
        info.lines.map((item: any, index: number) => (
          <div
            key={index}
            style={{
              display: 'flex',
              marginBottom: '2px',
              fontSize: '9px',
              fontWeight: 'bold',
            }}
          >
            <div style={{ width: '25%', textAlign: 'left', fontSize: '12px' }}>{item.name.toUpperCase()}</div>
            <div style={{ width: '15%', textAlign: 'right', fontSize: '12px' }}>
              {item.base_quantity}
            </div>
            <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>
              {/* {`${item.tara_quantity}/${(item.tara_total || 0).toFixed(1)}`} */}
              {/* {`${item.tara_quantity}/${(item.tara_total || 0)}`} */}
              {item.tara_quantity > 0 &&
                <>
                  {`${item.tara_quantity}/${(item.tara_total || 0)}`}
                </>
              }
            </div>
            <div style={{ width: '15%', textAlign: 'right', fontSize: '12px' }}>
              {item.quantity}
            </div>
            <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>
              {/* {(Number(item.price_unit) || 0).toFixed(2)} */}
              {(Number(item.price_unit) || 0)}
            </div>
            <div style={{ width: '20%', textAlign: 'right', fontSize: '12px' }}>
              {/* {(item.amount_withtaxed_total || 0).toFixed(2)} */}
              {(item.amount_withtaxed_total || 0)}
            </div>
          </div>
        ))
      }

      {/* Totales */}
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
        <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
          TOTAL: {adjustTotal(total).adjusted.toFixed(2)}
        </div>

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

          <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
            {payment.method.toUpperCase()}{': '}{payment.total.toFixed(2)}
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

          <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
            TOTAL PAGADO: {totalPayments.toFixed(2)}
          </div>
        )}

        {/* Diferencia */}
        <div style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'right' }}>
          DEUDA: {totalPayments.toFixed(2)}
        </div>

      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '20px',
          marginBottom: '50px',
          paddingTop: '10px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>S7</span>
      </div>
    </div>
  )
}

export default TicketHTML
