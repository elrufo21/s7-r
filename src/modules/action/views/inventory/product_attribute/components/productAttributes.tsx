import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  getSortedRowModel,
} from '@tanstack/react-table'
import Sortable from 'sortablejs'
import { GrDrag } from 'react-icons/gr'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ActionTypeEnum, FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import clsx from 'clsx'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface ProductAttribute {
  attribute_value_id: number
  name: string
  default_extra_price: number
  action?: ActionTypeEnum.INSERT | ActionTypeEnum.UPDATE | ActionTypeEnum.DELETE
}

const EditablePriceField = ({
  value,
  onChange,
}: {
  value: number
  onChange: (newValue: number) => void
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value)
    onChange(isNaN(numValue) ? 0 : numValue)
  }

  return (
    <CustomTextField
      type="number"
      value={value}
      onChange={handleChange}
      inputProps={{
        step: '0.01',
        min: '0',
      }}
    />
  )
}
interface EditableTextFieldProps {
  value: string
  onChange: (newValue: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

const EditableTextField = ({
  value,
  onChange,
  onBlur,
  placeholder = '',
  className = '',
}: EditableTextFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
  }

  return (
    <CustomTextField
      inputRef={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={className}
      fullWidth
    />
  )
}

const ProductVariantsTable = ({ setValue }: frmElementsProps) => {
  const { frmAction, formItem, setFrmIsChangedItem } = useAppStore()

  const [data, setData] = useState<ProductAttribute[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)
  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const sortableRef = useRef<Sortable | null>(null)

  const handleDelete = (attribute_value_id: number) => {
    setData((prev: any) =>
      prev.map((variant: any) =>
        variant.attribute_value_id === attribute_value_id
          ? { ...variant, action: ActionTypeEnum.DELETE }
          : variant
      )
    )
    setModifyData(true)
  }

  const updateVariant = (
    attribute_value_id: number,
    field: keyof ProductAttribute,
    value: string | number
  ) => {
    setData((prev) =>
      prev.map((variant) =>
        variant.attribute_value_id === attribute_value_id
          ? {
              ...variant,
              [field]: value,
              action:
                variant.action === ActionTypeEnum.INSERT
                  ? ActionTypeEnum.INSERT
                  : ActionTypeEnum.UPDATE,
            }
          : variant
      )
    )
    setModifyData(true)
  }
  useEffect(() => {
    if (modifyData) {
      setValue('values', data)
      setFrmIsChangedItem(true)
      setModifyData(false)
    }
  }, [data, modifyData, setFrmIsChangedItem, setValue])
  useEffect(() => {
    if (frmAction === FormActionEnum.UNDO || formItem) {
      const formatProductAttributesLines = formItem?.values
      setData(formatProductAttributesLines)
    }
  }, [formItem, setValue, frmAction])

  const columns = useMemo<ColumnDef<ProductAttribute>[]>(
    () => [
      {
        id: 'drag',
        size: 40,
        header: '',
        cell: () => (
          <div className="flex justify-center items-center">
            <span className="drag-handle cursor-grab">
              <GrDrag />
            </span>
          </div>
        ),
      },
      {
        header: 'Valor',
        accessorKey: 'name',
        cell: ({ row }) => (
          <EditableTextField
            value={row.original.name}
            onChange={(newValue) =>
              updateVariant(row.original.attribute_value_id, 'name', newValue)
            }
          />
        ),
      },
      {
        header: 'Precio Extra',
        accessorKey: 'default_extra_price',
        cell: ({ row }) => (
          <EditablePriceField
            value={row.original.default_extra_price}
            onChange={(newValue) =>
              updateVariant(row.original.attribute_value_id, 'default_extra_price', newValue)
            }
          />
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <button type="button" onClick={() => handleDelete(row.original.attribute_value_id)}>
            <RiDeleteBin2Line className="hover:text-red-400" />
          </button>
        ),
      },
    ],
    []
  )
  const filteredData = useMemo(
    () => data?.filter((row) => row.action !== ActionTypeEnum.DELETE),
    [data]
  )
  useEffect(() => {
    if (tableRef.current) {
      if (sortableRef.current) {
        sortableRef.current.destroy()
      }

      sortableRef.current = Sortable.create(tableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'bg-white',
        onEnd: (event) => {
          const oldIndex = event.oldIndex!
          const newIndex = event.newIndex!

          setData((prevData: any) => {
            const newData = [...prevData]
            const [movedItem] = newData.splice(oldIndex, 1)
            newData.splice(newIndex, 0, movedItem)
            return newData.map((item) => ({
              ...item,
              action: item.action === ActionTypeEnum.BASE ? ActionTypeEnum.UPDATE : item.action,
            }))
          })
          setModifyData(true)
        },
      })
    }
  }, [filteredData])

  const addRow = () => {
    setData((prev: ProductAttribute[] | undefined) => {
      const currentData = prev || []

      return [
        ...currentData,
        {
          attribute_value_id: Date.now(),
          name: '',
          default_extra_price: 0,
          action: ActionTypeEnum.INSERT,
          files: null,
          html_color: '#000000',
          is_custom: true,
        },
      ]
    })
    setModifyData(true)
  }

  const table = useReactTable({
    data: filteredData,
    columns,
    columnResizeMode: 'onEnd',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="flex flex-col gap-4 py-4 ">
      <div className="flex flex-col gap-4">
        <table className="w-full border-[#BBB] border relative">
          <thead className="h-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left font-bold relative ${
                      header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                    }`}
                    style={{ width: header.getSize() }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      className={clsx(
                        'flex items-center gap-2',
                        header.column.getIsSorted() && 'justify-between'
                      )}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <FaChevronUp />,
                        desc: <FaChevronDown />,
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody ref={tableRef}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.original.attribute_value_id} className="border-y-[#BBB] border-y-[1px]">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={columns[0].id}
                    style={{ width: row.getVisibleCells()[0].column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 pb-4 pl-4">
          <button type="button" className="text-[#017e84] hover:text-[#017e84]/80" onClick={addRow}>
            Agregar línea
          </button>
        </div>
      </div>
    </div>
  )
}

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
      outline: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
      outline: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      outline: 'none',
    },
  },
  '& input': {
    padding: '8px 0',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
})

export default ProductVariantsTable
