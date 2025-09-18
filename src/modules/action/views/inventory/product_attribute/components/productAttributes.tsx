import React, { useState, useEffect, useMemo, useRef } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { RiDeleteBin2Line } from 'react-icons/ri'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ActionTypeEnum, FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { DndTable } from '@/shared/components/table/DndTable'

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
  /*const filteredData = useMemo(
    () => data?.filter((row) => row.action !== ActionTypeEnum.DELETE),
    [data]
  )*/

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

  return (
    <DndTable
      data={data}
      setData={setData}
      setModifyData={setModifyData}
      columns={columns}
      id="attribute_value_id"
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
              <button type="button" className="text-[#017E84]" onClick={addRow}>
                Agregar línea
              </button>
            </div>
          </td>
        </tr>
      )}
    </DndTable>
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
