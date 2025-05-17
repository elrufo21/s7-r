import { DndTable } from '@/shared/components/table/DndTable'
import { ActionTypeEnum, frmElementsProps } from '@/shared/shared.types'
import { InputTextTable, TextControlled } from '@/shared/ui'
import { CheckboxTableCell } from '@/shared/ui/inputs/CheckboxTable'
import { Column, ColumnDef, Row } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { RowDragHandleCell } from '@/shared/components/table/DraggableComponent'
import useAppStore from '@/store/app/appStore'
export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre del atributo</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export function FrmTab1({ setValue }: frmElementsProps) {
  const { formItem } = useAppStore()

  const [productAttributesValues, setProductAttributesValues] = useState<any[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)

  useEffect(() => {
    if (formItem?.values) {
      setProductAttributesValues(formItem.values)
    }
  }, [formItem?.values])

  useEffect(() => {
    if (modifyData) {
      setValue('values', productAttributesValues, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setModifyData(false)
    }
  }, [productAttributesValues])

  const addProductAttributesValues = () => {
    const newRow = {
      attribute_value_id: `temp-${productAttributesValues.length}`,
      order_id: null,
      name: '',
      is_custom: true,
      html_color: '#000000',
      files: null,
      default_extra_price: '0',
      action: ActionTypeEnum.INSERT,
      label: '',
      value: `temp-${productAttributesValues.length}`,
    }
    setProductAttributesValues([...productAttributesValues, newRow])
  }

  const handleChange = (data: any, id: string | number, field: string) => {
    const { option } = data

    setProductAttributesValues((prev) => {
      const newData = prev.map((item) => {
        if (item.attribute_value_id === id) {
          return {
            ...item,
            [field]: field === 'is_custom' ? !item.is_custom : option,
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
    setProductAttributesValues((prev) => {
      const newData = prev.map((item) =>
        item.attribute_value_id === id ? { ...item, action: ActionTypeEnum.DELETE } : item
      )

      if (JSON.stringify(newData) !== JSON.stringify(prev)) {
        setModifyData(true)
        return newData
      }
      return prev
    })
  }

  const columns: ColumnDef<any>[] = useMemo(() => {
    const baseColumns = [
      {
        id: 'drag-handle',
        header: '',
        cell: ({ row }: { row: Row<any> }) => <RowDragHandleCell rowId={row.id} />,
        size: 40,
      },
      {
        header: 'Valor',
        accessorKey: 'name',
        size: 500,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <InputTextTable
            row={row}
            column={column}
            onBlur={(data) => handleChange(data, row.original.attribute_value_id, 'name')}
          />
        ),
      },
      {
        header: 'Texto Libre',
        accessorKey: 'is_custom',
        size: 160,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <CheckboxTableCell
            row={row}
            column={column}
            onChange={(data) => handleChange(data, row.original.attribute_value_id, 'is_custom')}
          />
        ),
      },
    ]

    const priceColumn = [
      {
        header: 'Precio adicional predeterminado',
        accessorKey: 'default_extra_price',
        size: 200,
        cell: ({ row, column }: { row: Row<any>; column: Column<any> }) => (
          <InputTextTable
            row={row}
            column={column}
            onBlur={(data) =>
              handleChange(data, row.original.attribute_value_id, 'default_extra_price')
            }
          />
        ),
      },
    ]

    return [
      ...baseColumns,
      ...priceColumn,
      {
        id: 'config',
        header: '',
        cell: ({ row }) => {
          return (
            <FaRegTrashAlt
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDelete(row.original.attribute_value_id)}
            />
          )
        },
        size: 80,
      },
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <DndTable
        id="attribute_value_id"
        data={productAttributesValues.filter((item) => item.action !== ActionTypeEnum.DELETE)}
        setData={setProductAttributesValues}
        columns={columns}
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
                  : 10
              }
              className="w-full"
            >
              <div className="flex gap-4">
                <button
                  type="button"
                  className="text-[#017E84]"
                  onClick={addProductAttributesValues}
                >
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
