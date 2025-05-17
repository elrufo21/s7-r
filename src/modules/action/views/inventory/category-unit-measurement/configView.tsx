import { DndTable } from '@/shared/components/table/DndTable'
import { ActionTypeEnum, frmElementsProps } from '@/shared/shared.types'
import { AutocompleteTable, InputTextTable, SelectTable, TextControlled } from '@/shared/ui'
import { SwitchTable } from '@/shared/ui/inputs/SwitchTable'
import useAppStore from '@/store/app/appStore'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'

export function FrmMiddle({ control, errors, editConfig = {} }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      control={control}
      errors={errors}
      placeholder={'por ejemplo, unidad'}
      editConfig={{ config: editConfig }}
      multiline={true}
      rules={{ required: true }}
    />
  )
}

interface Unit {
  uom_id: string | number
  name: string
  type: string
  factor: number | null
  rounding: number | null
  state: boolean
  action: string
}

export const FrmTab1 = ({ setValue }: frmElementsProps) => {
  const [dataUnits, setDataUnits] = useState<Unit[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)
  const formItem = useAppStore((state) => state.formItem)

  useEffect(() => {
    if (formItem?.units) {
      setDataUnits(formItem.units.map((u: any) => ({ ...u, state: u.state === 'A' })))
    }
  }, [formItem?.units])

  useEffect(() => {
    if (modifyData) {
      setValue('units', dataUnits, { shouldValidate: true, shouldDirty: true })
      setModifyData(false)
    }
  }, [dataUnits])

  const unitsMeasurement = useCallback(async () => {
    return [
      { value: '0', label: 'Más grande que la unidad de medida de referencia' },
      { value: '1', label: 'Unidad de medida de referencia para esta categoría' },
      { value: '2', label: 'Más pequeña que la unidad de medida de referencia' },
    ]
  }, [])

  const handleDeleteUnitMeasurement = (uom_id: string | number) => {
    const updatedData = dataUnits.map((item) =>
      item.uom_id === uom_id ? { ...item, action: ActionTypeEnum.DELETE } : item
    )
    setDataUnits(updatedData)
    setModifyData(true)
  }

  const handleChange = (data: any, uom_id: string | number, name: string) => {
    const { option } = data

    let newData = dataUnits.map((item) => {
      if (item.uom_id === uom_id) {
        return {
          ...item,
          [name]: name === 'state' ? !item.state : option,
          action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
        }
      }
      return item
    })

    if (name === 'type' && option === '1') {
      const previousRefUnit = dataUnits.find((item) => item.type === '1' && item.uom_id !== uom_id)

      if (previousRefUnit) {
        newData = newData.map((item) =>
          item.uom_id === previousRefUnit.uom_id
            ? {
                ...item,
                type: '2',
                action: item.action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : item.action,
              }
            : item
        )
      }
    }
    if (JSON.stringify(newData) !== JSON.stringify(dataUnits)) {
      setDataUnits([...newData])
      setModifyData(true)
    }
  }

  const columns: ColumnDef<Unit>[] = useMemo(
    () => [
      {
        header: () => <div className="text-left font-semibold w-full">Unidad de medida</div>,
        accessorKey: 'name',

        cell: ({ row, column }) => (
          <InputTextTable
            row={row}
            column={column}
            onBlur={(data) => {
              handleChange(data, row.original.uom_id, 'name')
            }}
          />
        ),
      },
      {
        header: 'Tipo',
        accessorKey: 'type',

        cell: ({ row, column }) => (
          <div className={`${row.original.type === '1' ? 'font-bold' : ''}`}>
            <SelectTable
              key={row.original.uom_id}
              row={row}
              column={column}
              fnc_options={unitsMeasurement}
              onChange={(data) => handleChange(data, row.original.uom_id, 'type')}
              className="truncate"
            />
          </div>
        ),
      },
      {
        header: 'Categoría de UNSPSC',
        accessorKey: 'unspsc_code',
        cell: ({ row, column }) => (
          <AutocompleteTable onChange={() => {}} row={row} column={column} options={[]} />
        ),
      },
      {
        header: () => <div className="text-left font-semibold w-full">Proporción</div>,
        accessorKey: 'factor',
        cell: ({ row, column }) => (
          <InputTextTable
            row={row}
            column={column}
            onBlur={(data) => handleChange(data, row.original.uom_id, 'factor')}
          />
        ),
      },
      {
        header: 'Precisión de redondeo',
        accessorKey: 'rounding',
        cell: ({ row, column }) => (
          <InputTextTable
            row={row}
            column={column}
            onBlur={(data) => handleChange(data, row.original.uom_id, 'rounding')}
          />
        ),
      },
      {
        header: 'Activo',
        accessorKey: 'state',
        size: 50,
        cell: ({ row, column }) => (
          <div className="place-items-start">
            <SwitchTable
              key={row.original.uom_id}
              row={row}
              column={column}
              onChange={(data) => handleChange(data, row.original.uom_id, 'state')}
            />
          </div>
        ),
      },
      {
        id: 'config',
        header: '',
        align: 'right',
        size: 50,
        cell: ({ row }) => {
          return (
            <FaRegTrashAlt
              className="hover:text-red-600 cursor-pointer"
              onClick={() => handleDeleteUnitMeasurement(row.original.uom_id)}
            />
          )
        },
      },
    ],
    [dataUnits]
  )

  const handleAddRow = () => {
    const lastRow = dataUnits[dataUnits.length - 1]
    if (!lastRow || lastRow.name !== '') {
      const newRow = {
        uom_id: `temp-${dataUnits.length}`,
        state: true,
        name: '',
        type: '0',
        unspsc_code: null,
        factor: 1,
        rounding: 1,
        action: ActionTypeEnum.INSERT,
      }
      setDataUnits([...dataUnits, newRow])
    }
  }
  return (
    <div className="flex flex-col gap-4">
      <DndTable
        id="id_cba"
        data={dataUnits.filter((item) => item.action !== ActionTypeEnum.DELETE)}
        setData={setDataUnits}
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
                <button type="button" className="text-[#017E84]" onClick={handleAddRow}>
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
