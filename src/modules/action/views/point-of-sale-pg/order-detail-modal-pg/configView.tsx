import { frmElementsProps, ActionTypeEnum } from '@/shared/shared.types'
import React, { useState, useMemo, useEffect } from 'react'
import { DndTable } from '@/shared/components/table/DndTable'
import { ColumnDef, Row, Column } from '@tanstack/react-table'
import { formatCurrency } from '@/shared/helpers/currency'
import useAppStore from '@/store/app/appStore'
import { InputTextTable } from '@/shared/ui/inputs/InputTextTable'
import { ProductAutocompleteTable } from '@/shared/components/form/table/ProductAutocompleteTable'
import { UnitAutocompleteTable } from '@/shared/components/form/table/UnitAutocompleteTable'
import { DatepickerControlled } from '@/shared/ui'
import { FaRegTrashAlt } from 'react-icons/fa'

export function Subtitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Fecha de inicio - inline */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Fecha de inicio</label>
        <div className="flex-1">
          <DatepickerControlled
            rules={true}
            name="date_start"
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
      </div>

      {/* Fecha de finalización - inline */}
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Fecha de finalización</label>
        <div className="flex-1">
          <DatepickerControlled
            rules={true}
            name="date_end"
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
      </div>
    </div>
  )
}

export function FrmMiddle({ setValue }: frmElementsProps) {
  const { formItem } = useAppStore()

  const [orderLinesData, setOrderLinesData] = useState<any[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)

  useEffect(() => {
    if (formItem?.lines) {
      setOrderLinesData(formItem.lines)
    }
  }, [formItem?.lines])

  useEffect(() => {
    if (modifyData) {
      setValue('lines', orderLinesData, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setModifyData(false)
    }
  }, [orderLinesData, setValue, modifyData])

  const addOrderLine = () => {
    const newRow = {
      line_id: `temp-${orderLinesData.length}`,
      order_id: null,
      product_id: null,
      product_name: '',
      quantity: 1,
      price_unit: 0,
      amount_untaxed: 0,
      amount_tax: 0,
      amount_withtaxed: 0,
      uom_id: null,
      uom_name: '',
      action: ActionTypeEnum.INSERT,
    }
    setOrderLinesData([...orderLinesData, newRow])
  }

  const handleChange = (data: any, id: string | number, field: string) => {
    const { option } = data

    setOrderLinesData((prev) => {
      const newData = prev.map((item) => {
        if (item.line_id === id) {
          return {
            ...item,
            [field]: option,
            action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
          }
        }
        return item
      })

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
  }

  const handleDelete = (id: string | number) => {
    setOrderLinesData((prev) => {
      const newData = prev.map((item) =>
        item.line_id === id ? { ...item, action: ActionTypeEnum.DELETE } : item
      )

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
  }

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        header: 'Producto',
        accessorKey: 'product_name',
        size: 250,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <ProductAutocompleteTable
            row={row}
            column={column}
            onChange={(data: any) => handleChange(data, row.original.line_id, 'product_id')}
          />
        ),
      },
      {
        header: 'Cantidad',
        accessorKey: 'quantity',
        size: 100,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <InputTextTable
            row={row}
            column={column}
            type="number"
            onBlur={(data) => handleChange(data, row.original.line_id, 'quantity')}
          />
        ),
      },
      {
        header: 'Unidad',
        accessorKey: 'uom_name',
        size: 100,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <UnitAutocompleteTable
            row={row}
            column={column}
            onChange={(data) => handleChange(data, row.original.line_id, 'uom_id')}
          />
        ),
      },
      {
        header: 'Precio Unit.',
        accessorKey: 'price_unit',
        size: 120,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <InputTextTable
            row={row}
            column={column}
            type="number"
            onBlur={(data) => handleChange(data, row.original.line_id, 'price_unit')}
          />
        ),
      },
      {
        header: 'Total',
        accessorKey: 'amount_withtaxed',
        size: 120,
        cell: ({ row }: { row: Row<any> }) => (
          <div className="text-right font-medium">
            {formatCurrency(row.original.amount_withtaxed || 0)}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        size: 80,
        cell: ({ row }) => {
          return (
            <FaRegTrashAlt
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.original.line_id)}
            />
          )
        },
      },
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <DndTable
        id="line_id"
        data={orderLinesData.filter((item) => item.action !== ActionTypeEnum.DELETE)}
        setData={setOrderLinesData}
        columns={columns}
        modifyData={modifyData}
        setModifyData={setModifyData}
      >
        {(table) => (
          <tr
            style={{ height: '42px' }}
            className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px]"
          >
            <td></td>
            <td
              colSpan={
                table.getRowModel().rows[0]
                  ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                  : 5
              }
              className="w-full"
            >
              <div className="flex gap-4">
                <button type="button" className="text-[#017E84]" onClick={addOrderLine}>
                  Agregar línea
                </button>
              </div>
            </td>
          </tr>
        )}
      </DndTable>
    </div>
  )
}
