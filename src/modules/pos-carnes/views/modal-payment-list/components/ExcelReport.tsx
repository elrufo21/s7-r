import * as XLSX from 'xlsx'

interface Payment {
  amount: number
}

interface OrderData {
  order_id: number
  partner_name: string
  receipt_number: string
  order_date: string
  amount_withtaxed: number
  amount_residual?: number
  user_name?: string
  payments?: Payment[] | null
}

const sumPayments = (payments?: Payment[] | null) => {
  if (!payments || payments.length === 0) return 0
  return payments.reduce((s, p) => s + (p?.amount ?? 0), 0)
}

const getPOSFromReceipt = (receiptNumber: string) => {
  const parts = (receiptNumber || '').split('-')
  return parts[0] || receiptNumber || '-'
}

export function generateExcel(orders: OrderData[]): XLSX.WorkBook {
  const wb = XLSX.utils.book_new()

  // Ordenar por cliente
  const sortedOrders = [...orders].sort((a, b) => a.partner_name.localeCompare(b.partner_name))

  const data = sortedOrders.map((o) => {
    const computedResidual =
      typeof o.amount_residual === 'number'
        ? o.amount_residual
        : Math.max(0, o.amount_withtaxed - sumPayments(o.payments))

    return {
      Cliente: o.partner_name,
      Fecha: new Date(o.order_date).toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      Total: o.amount_withtaxed,
      Adeudo: computedResidual,
      POS: getPOSFromReceipt(o.receipt_number),
      Cajero: o.user_name || '-',
    }
  })

  const sheet = XLSX.utils.json_to_sheet(data)

  // Anchos de columna
  sheet['!cols'] = [
    { wch: 25 }, // Cliente
    { wch: 12 }, // Fecha
    { wch: 12 }, // Total
    { wch: 12 }, // Adeudo
    { wch: 8 }, // POS
    { wch: 20 }, // Cajero
  ]

  // Formato de moneda para columnas Total y Adeudo
  const range = XLSX.utils.decode_range(sheet['!ref']!)
  for (let R = range.s.r + 1; R <= range.e.r; R++) {
    // Total (columna C, índice 2)
    const totalCell = XLSX.utils.encode_cell({ r: R, c: 2 })
    if (sheet[totalCell]) {
      sheet[totalCell].z = '"S/."#,##0.00'
    }

    // Adeudo (columna D, índice 3)
    const adeudoCell = XLSX.utils.encode_cell({ r: R, c: 3 })
    if (sheet[adeudoCell]) {
      sheet[adeudoCell].z = '"S/."#,##0.00'
    }
  }

  // Aplicar estilos
  applyTableStyle(sheet, range, '#4472C4', '#D9E2F3')

  // Agregar filtros
  sheet['!autofilter'] = { ref: XLSX.utils.encode_range(range) }

  XLSX.utils.book_append_sheet(wb, sheet, 'Ventas por Cliente')

  return wb
}

function applyTableStyle(
  sheet: XLSX.WorkSheet,
  range: XLSX.Range,
  headerColor: string,
  rowColor: string
) {
  const borderStyle = {
    top: { style: 'thin', color: { rgb: 'D0D0D0' } },
    bottom: { style: 'thin', color: { rgb: 'D0D0D0' } },
    left: { style: 'thin', color: { rgb: 'D0D0D0' } },
    right: { style: 'thin', color: { rgb: 'D0D0D0' } },
  }

  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })
      if (!sheet[cellAddress]) continue

      if (R === 0) {
        // Header
        sheet[cellAddress].s = {
          font: {
            bold: true,
            color: { rgb: 'FFFFFF' },
            sz: 11,
            name: 'Calibri',
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: headerColor.replace('#', '') },
          },
          alignment: {
            horizontal: 'center',
            vertical: 'center',
            wrapText: false,
          },
          border: borderStyle,
        }
      } else {
        // Data rows
        const isEvenRow = R % 2 === 0
        sheet[cellAddress].s = {
          font: {
            sz: 10,
            name: 'Calibri',
            color: { rgb: '000000' },
          },
          fill: {
            patternType: 'solid',
            fgColor: { rgb: isEvenRow ? rowColor.replace('#', '') : 'FFFFFF' },
          },
          alignment: {
            horizontal: C === 0 ? 'left' : 'center', // Cliente alineado a la izquierda
            vertical: 'center',
            wrapText: false,
          },
          border: borderStyle,
        }
      }
    }
  }
}
