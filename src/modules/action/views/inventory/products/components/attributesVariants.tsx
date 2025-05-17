import useAppStore from '@/store/app/appStore'
import { toast } from 'sonner'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Attribute, AttributeTable } from '../products.type'
import Sortable from 'sortablejs'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { AutocompleteTable } from '@/shared/ui'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useAttributesOptions } from '@/modules/action/hooks/useProductsLines'
import clsx from 'clsx'
import { MultiSelecTableAttributes } from '@/shared/ui/inputs/MultiSelectTableAttributes'
import { FormActionEnum, frmElementsProps, ItemStatusTypeEnum } from '@/shared/shared.types'
import { RiDeleteBin2Line } from 'react-icons/ri'
import AttributesConfig from '@/modules/action/views/inventory/product_attribute/config'
import { FrmBaseDialog } from '@/shared/components/core'
import { ModalBase } from '@/shared/components/modals/ModalBase'

const AttributesVariantsTable = ({ setValue }: frmElementsProps) => {
  const {
    frmAction,
    formItem,
    setFrmIsChangedItem,
    tableData,
    setTableData,
    executeFnc,
    openDialog,
    setNewAppDialogs,
    closeDialogWithData,
    setTabForm,
  } = useAppStore()
  const { attributes, values, loadAttributes } = useAttributesOptions()

  const [data, setData] = useState<any[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)
  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const sortableRef = useRef<Sortable | null>(null)
  useEffect(() => {
    loadAttributes()
  }, [loadAttributes])
  const updateLineData = (attribute_id: number | string, updates: Partial<AttributeTable>) => {
    setData((prev) =>
      prev.map((row) =>
        row.attribute_id === attribute_id
          ? { ...row, ...updates, attributes_change: true, attribute_id: updates.attribute_id }
          : row
      )
    )
  }
  useEffect(() => {
    if (modifyData) {
      setValue('attributes', data)
      setTableData(data)
      setValue('attributes_change', true)
      setFrmIsChangedItem(true)
      setModifyData(false)
    }
  }, [data, modifyData, setFrmIsChangedItem, setValue, setTableData])

  useEffect(() => {
    if (formItem || frmAction === FormActionEnum.UNDO) {
      if (tableData.length === 0) {
        setData(formItem.attributes)
        return
      }
      setData(tableData || formItem.attributes)
    }
  }, [formItem, setValue, frmAction])

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
              attributes_changed: true,
            }))
          })
          setModifyData(true)
        },
      })
    }
  }, [data])
  const handleAttributeChange = async (
    row: any,
    dataAttribute: {
      rowId: number | string | null
      columnId: string
      option: Record<string, any>
    }
  ) => {
    const {
      option: { value, label },
    } = dataAttribute

    const duplicateIndex = data.findIndex(
      (item) => item.attribute_id === value && item.attribute_id !== row.original.attribute_id
    )

    if (duplicateIndex !== -1) {
      toast.error(
        `El atributo "${label}" ya está seleccionado en otra fila. Se eliminará la selección duplicada.`
      )

      setData((prev) => prev.filter((item) => item.attribute_id !== row.original.attribute_id))
      setModifyData(true)
      return
    }

    updateLineData(row.original.attribute_id, {
      attribute_id: value,
      values: [],
      attribute_name: label,
    })

    setModifyData(true)
  }

  const handleValuesChange = async (
    row: any,
    dataAttribute: {
      rowId: number
      columnId: string
      option: Record<string, any>
    }
  ) => {
    const selectedOptions = Array.isArray(dataAttribute.option)
      ? dataAttribute.option
      : [dataAttribute.option]

    setData((prev) =>
      prev.map((item) =>
        item.attribute_id === row.original.attribute_id
          ? {
              ...item,
              values_change: true,
              values: selectedOptions.map((option) => ({
                attribute_value_id: option.attribute_value_id,
                value: option.attribute_value_id,
                label: option.name,
                name: option.name,
              })),
            }
          : item
      )
    )
    setModifyData(true)
  }
  const handleDeleteRow = async (index: any) => {
    setData((prev) => {
      const updated = prev.filter((_, i) => i !== index)
      return updated
    })
    setModifyData(true)
    return
  }
  const handleCreateAttribute = async (input: string, row: Row<AttributeTable>) => {
    try {
      const response = await executeFnc('fnc_product_attributes_template', 'i', {
        name: input,
        attribute_id: null,
        create_variant: 'always',
        display_type: 'radio',
        group_id: null,
        state: ItemStatusTypeEnum.ACTIVE,
        values: [],
      })
      const attribute_id = response.oj_data?.attribute_id
      loadAttributes()

      if (attribute_id) {
        await handleAttributeChange(row, {
          rowId: row.original.attribute_id,
          columnId: 'attribute_id',
          option: { value: attribute_id },
        })
      }
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  }
  const handleCreateValue = async (input: any, row: Row<AttributeTable>) => {
    try {
      const response = await executeFnc('fnc_product_attributes_template', 'i2', {
        name: input.value,
        attribute_id: row.original.attribute_id,
      })
      const attribute_value_id = response.oj_data?.attribute_value_id

      const currentRow = data.find((item) => item.attribute_id === row.original.attribute_id)
      const currentValues = currentRow?.values || []

      const updatedValues = [
        ...currentValues,
        {
          value: attribute_value_id,
          attribute_value_id,
          name: input.value,
          label: input.value,
        },
      ]

      setData((prev) =>
        prev.map((item) =>
          item.attribute_id === row.original.attribute_id
            ? {
                ...item,
                values_change: true,
                values: updatedValues,
              }
            : item
        )
      )

      setModifyData(true)
      loadAttributes()
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  }

  const createEditAttribute = (row: Row<AttributeTable>, data: any) => {
    openAttributeDialog('Crear atributo', row, data)
  }
  const searchAttribute = (row: Row<AttributeTable>) => {
    const dialogId = openDialog({
      title: 'Productos',
      dialogContent: () => (
        <ModalBase
          config={AttributesConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option.attribute_id) {
              await handleAttributeChange(row, {
                rowId: row.original.attribute_id,
                columnId: 'product_id',
                option: { value: option.attribute_id },
              })
            }
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Nuevo',
          type: 'confirm',
          onClick: () => openAttributeDialog('Crear producto', row),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  const openAttributeDialog = async (title: string, row: Row<AttributeTable>, name?: string) => {
    let getData = () => ({})
    setTabForm(0)
    const dialogId = openDialog({
      title,
      dialogContent: () => (
        <FrmBaseDialog
          config={AttributesConfig}
          initialValues={{ name: name }}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData()
              const response = await executeFnc('fnc_product_attributes_template', 'i', formData)
              const attribute_id = response.oj_data?.attribute_id
              loadAttributes()

              if (attribute_id) {
                await handleAttributeChange(row, {
                  rowId: row.original.attribute_id,
                  columnId: 'attribute_id',
                  option: { value: attribute_id },
                })
              }

              setNewAppDialogs([]) // Cierra todos los diálogos
            } catch (error) {
              console.error(`Error al ${title.toLowerCase()}:`, error)
            }
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }
  const columns = useMemo<ColumnDef<Attribute>[]>(
    () => [
      {
        id: `drag`,
        size: 40,
        header: '',
        cell: () => (
          <div className="flex justify-center items-center" key={`drag-${crypto.randomUUID()}`}>
            <span className="drag-handle cursor-grab">
              <GrDrag />
            </span>
          </div>
        ),
      },
      {
        header: 'Atributo',
        accessorKey: 'attribute_id',
        size: 100,
        cell: ({ row, column }: { row: any; column: any }) => (
          <div className="flex flex-col gap-2 justify-center items-center">
            <AutocompleteTable
              key={`attr-${row.index}-${row.original.attribute_id || row.original.id}`}
              row={row}
              column={column}
              options={attributes}
              onChange={(data) => handleAttributeChange(row, data)}
              fnc_create={(data) => handleCreateAttribute(data, row)}
              createOpt={true}
              editOpt={(data) => createEditAttribute(row, data)}
              searchOpt={() => searchAttribute(row)}
            />
          </div>
        ),
      },
      {
        header: 'Valores',
        accessorKey: 'values',
        size: 200,
        cell: ({ row, column }: { row: any; column: any }) => (
          <MultiSelecTableAttributes
            key={`values-${row.index}-${row.original.attribute_id || row.original.id}`}
            row={row}
            column={column}
            onChange={(data) => handleValuesChange(row, data)}
            options={values[row.original.attribute_id] || []}
            createOpt={true}
            fnc_create={(data) => handleCreateValue(data, row)}
          />
        ),
      },
      {
        header: '',
        accessorKey: 'actions',
        size: 50,
        cell: ({ row }: { row: any }) => (
          <div className="flex justify-center">
            <button type="button" onClick={() => handleDeleteRow(row.index)}>
              <RiDeleteBin2Line style={{ fontSize: '17px' }} className="hover:text-red-400" />
            </button>
          </div>
        ),
      },
    ],
    [tableData, attributes, values]
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: 'onEnd',
    columnResizeDirection: 'ltr',
    enableColumnResizing: true,
  })

  const addRow = () => {
    setData((prev) => [
      ...prev,
      {
        order_id: prev.length + 1,
        values: [],
        attribute_name: '',
        label: '',
      },
    ])
    setModifyData(true)
  }
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
              <tr key={row.original.attribute_id} className="border-y-[#BBB] border-y-[1px]">
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
export default AttributesVariantsTable
