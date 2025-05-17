import { Column, Row, Table } from '@tanstack/react-table'
import { MoveLine, MoveLinesTax } from '@/modules/invoicing/invoice.types'
import { MultiSelecTable } from '@/shared/ui'
import { useInvoiceCalculations } from '@/modules/invoicing/hooks/useInvoiceLines'
import { MutableRefObject } from 'react'

export const TaxAutocompleteTable = ({
  row,
  column,
  table,
  options,
  updateLineData,
  tableHelpersRef,
}: {
  row: Row<any>
  column: Column<any>
  table: Table<any>
  options: any
  reloadOptions: () => void
  updateLineData?: (rowId: number, data: any) => void
  tableHelpersRef?: MutableRefObject<
    | {
        updateLineData: (id: number, updates: any) => void
        debouncedUpdateLineData: (id: number, updates: any) => void
        handleTextFieldChange: (e: any, id: number, fieldName: string) => void
      }
    | undefined
  >
}) => {
  const { calculateAmounts } = useInvoiceCalculations()

  // Función para actualizar datos que usa tableHelpersRef si está disponible
  const updateData = (rowId: number, data: any) => {
    if (tableHelpersRef?.current) {
      tableHelpersRef.current.updateLineData(rowId, data)
    } else if (updateLineData) {
      updateLineData(rowId, data)
    }
  }

  const handleChangeTax = async (
    row: Row<MoveLine>,
    dataTax: {
      rowId: number
      columnId: string
      option: MoveLinesTax[]
      row?: Row<MoveLine>
    },
    table: Table<MoveLine>
  ) => {
    try {
      const { option } = dataTax
      const fieldUpdate = { move_lines_taxes: option, move_lines_taxes_change: true }
      const productParams = {
        product_id: row.original.product_id,
        quantity: row.original.quantity,
        price: row.original.price_unit,
        taxes: option,
      }

      const amount_untaxed = await calculateAmounts({
        products: table.getRowModel().rows.map((elem: Row<MoveLine>) => elem.original),
        product: productParams,
      })

      updateData(row.original.line_id, {
        ...fieldUpdate,
        amount_untaxed,
      })
    } catch (error) {
      console.error('Error en handleChangeTax:', error)
    }
  }

  return (
    <MultiSelecTable
      row={row}
      column={column}
      listName={`move_lines_taxes`}
      itemName={`tax_id`}
      onChange={(data) => {
        handleChangeTax(row, data, table)
      }}
      options={options}
      key={`tax-${row.original.line_id}-${JSON.stringify(row.original.move_lines_taxes)}`}
    />
  )
}
