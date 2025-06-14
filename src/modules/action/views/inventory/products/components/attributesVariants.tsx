import useAppStore from '@/store/app/appStore'
import { toast } from 'sonner'
import { useEffect, useMemo, useState } from 'react'
import { Attribute, AttributeTable } from '../products.type'
import { ColumnDef, Row } from '@tanstack/react-table'
import { GrDrag } from 'react-icons/gr'
import { AutocompleteTable } from '@/shared/ui'
import { useAttributesOptions } from '@/modules/action/hooks/useProductsLines'
import { MultiSelecTableAttributes } from '@/shared/ui/inputs/MultiSelectTableAttributes'
import { FormActionEnum, frmElementsProps, ItemStatusTypeEnum } from '@/shared/shared.types'
import { GrTrash } from 'react-icons/gr'
import AttributesConfig from '@/modules/action/views/inventory/product_attribute/config'
import { FrmBaseDialog } from '@/shared/components/core'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { DndTable } from '@/shared/components/table/DndTable'

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
              <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
            </button>
          </div>
        ),
      },
    ],
    [tableData, attributes, values]
  )

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
    <DndTable
      data={data}
      setData={setData}
      columns={columns}
      id="attribute_id"
      modifyData={modifyData}
      setModifyData={setModifyData}
    >
      {(table) => (
        <tr
          style={{ height: '42px' }}
          className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px] no-drag"
        >
          <td></td>
          <td
            colSpan={
              table.getRowModel().rows[0]
                ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                : 10
            }
            className="w-full align-middle"
          >
            <div className="flex gap-4 pl-4 pr-4">
              <button
                type="button"
                className="text-[#017e84] hover:text-[#017e84]/80"
                onClick={addRow}
              >
                Agregar línea
              </button>
            </div>
          </td>
        </tr>
      )}
    </DndTable>
  )
}
export default AttributesVariantsTable
