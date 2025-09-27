import {
  useState,
  useMemo,
  useEffect,
  useRef,
  FocusEvent,
  ChangeEvent,
  memo,
  useCallback,
} from 'react'
import { Row, ColumnDef, Column, Table } from '@tanstack/react-table'

import useAppStore from '@/store/app/appStore'
import {
  MoveLine,
  MoveLinesTax,
  StatusInvoiceEnum,
  TotalsInvoiceType,
} from '@/modules/invoicing/invoice.types'
import { defaultProduct } from '@/modules/invoicing/constants'
import { Chip, Tooltip } from '@mui/material'
import { toast } from 'sonner'
import {
  ActionTypeEnum,
  FormActionEnum,
  frmElementsProps,
  ViewTypeEnum,
} from '@/shared/shared.types'
import { AutocompleteTable, MultiSelecTable, TextControlled } from '@/shared/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { InvoiceData, TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { GrTrash } from 'react-icons/gr'
import { useInvoiceCalculations } from '@/modules/invoicing/hooks/useInvoiceLines'
import { formatCurrency } from '@/shared/helpers/currency'
import { GrDrag } from 'react-icons/gr'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import ProductConfig from '@/modules/action/views/inventory/products_variant/config'
import { FrmBaseDialog } from '@/shared/components/core'
import UomConfig from '@/modules/action/views/inventory/unit-measurement/config'
import { useAutocompleteField } from '@/shared/components/form/hooks/useAutocompleteField'
import { DragEditableTable } from '@/shared/components/table/drag-editable-table/base-components/EditableTable'

// Componente optimizado para Cantidad que mantiene el foco
const normalizeTaxes = (taxes: MoveLinesTax[], taxOptions: any[]) => {
  if (!taxes || !taxOptions) return []

  return taxes.map((tax) => {
    // Si ya tiene value, lo retorna tal como está
    if (tax.value !== undefined) {
      return tax
    }

    // Buscar el value en las opciones
    const taxOption = taxOptions.find((option) => option.value === tax.tax_id)
    return {
      ...tax,
      value: taxOption?.amount || taxOption?.value || 0,
    }
  })
}
const QuantityField = memo(
  ({
    row,
    table,
    isReadOnly,
    calculateAmounts,
    taxOptions,
  }: {
    row: Row<MoveLine>
    table: Table<MoveLine>
    isReadOnly: boolean
    calculateAmounts: (params: any) => Promise<any>
    taxOptions: any[]
  }) => {
    const [localValue, setLocalValue] = useState(row.original.quantity?.toString() || '0')
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const { setFrmIsChangedItem } = useAppStore()

    // Sincronizar con cambios externos
    useEffect(() => {
      setLocalValue(row.original.quantity?.toString() || '0')
    }, [row.original.quantity])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue) // Actualización visual inmediata

      // Limpiar timeout anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Debounce para actualización real usando debouncedUpdateRow
      debounceRef.current = setTimeout(async () => {
        const numericValue = Number(newValue)
        if (!isNaN(numericValue)) {
          const debouncedUpdateRow = (table.options.meta as any).debouncedUpdateRow

          // Calcular amounts antes de actualizar
          try {
            const normalizedTaxes = normalizeTaxes(row.original.move_lines_taxes || [], taxOptions)

            const productParams = {
              product_id: row.original.product_id,
              quantity: numericValue,
              price: row.original.price_unit,
              taxes: normalizedTaxes,
            }

            const amount_untaxed = await calculateAmounts({
              products: table
                .getRowModel()
                .rows.map((r) => r.original)
                .map((elem) =>
                  elem.line_id === row.original.line_id ? { ...elem, quantity: numericValue } : elem
                ),
              product: productParams,
            })
            debouncedUpdateRow(row.original.line_id, {
              quantity: numericValue,
              amount_withtaxed: amount_untaxed.product.amount_withtaxed,
              amount_untaxed: amount_untaxed.product.amount_untaxed,
              amount_tax: amount_untaxed.product.amount_tax,
            })
          } catch (error) {
            console.error('Error calculando montos:', error)
            debouncedUpdateRow(row.original.line_id, { quantity: numericValue })
          }
        }
      }, 300)

      setFrmIsChangedItem(true)
    }

    /* const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
      const numericValue = Number(e.target.value)
      if (!isNaN(numericValue)) {
        const updateRow = (table.options.meta as any).updateRow

        try {
          const normalizedTaxes = normalizeTaxes(row.original.move_lines_taxes || [], taxOptions)

          const productParams = {
            product_id: row.original.product_id,
            quantity: numericValue,
            price: row.original.price_unit,
            taxes: normalizedTaxes,
          }

          const amount_untaxed = await calculateAmounts({
            products: table
              .getRowModel()
              .rows.map((r) => r.original)
              .map((elem) =>
                elem.line_id === row.original.line_id ? { ...elem, quantity: numericValue } : elem
              ),
            product: productParams,
          })

          updateRow(row.original.line_id, {
            quantity: numericValue,
            amount_untaxed,
          })
        } catch (error) {
          console.error('Error calculando montos:', error)
          updateRow(row.original.line_id, { quantity: numericValue })
        }
      }
    }*/

    if (isReadOnly) {
      return <div className="text-right px-2 py-1">{row.original.quantity}</div>
    }

    return (
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={() => {}}
        className="w-full no-spin text-right border-none outline-none bg-transparent p-1"
        min="0"
        step="1"
      />
    )
  }
)
// Componente optimizado para Precio que mantiene el foco
const PriceField = memo(
  ({
    row,
    table,
    isReadOnly,
    calculateAmounts,
    taxOptions,
  }: {
    row: Row<MoveLine>
    table: Table<MoveLine>
    isReadOnly: boolean
    calculateAmounts: (params: any) => Promise<any>
    taxOptions: any[]
  }) => {
    const [localValue, setLocalValue] = useState(row.original.price_unit?.toString() || '0')
    const debounceRef = useRef<NodeJS.Timeout | null>(null)
    const { setFrmIsChangedItem } = useAppStore()

    // Sincronizar con cambios externos
    useEffect(() => {
      setLocalValue(row.original.price_unit?.toString() || '0')
    }, [row.original.price_unit])

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue) // Actualización visual inmediata

      // Limpiar timeout anterior
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      // Debounce para actualización real usando debouncedUpdateRow
      debounceRef.current = setTimeout(async () => {
        const numericValue = Number(newValue)
        if (!isNaN(numericValue)) {
          const debouncedUpdateRow = (table.options.meta as any).debouncedUpdateRow

          // Calcular amounts antes de actualizar
          try {
            const normalizedTaxes = normalizeTaxes(row.original.move_lines_taxes || [], taxOptions)

            const productParams = {
              product_id: row.original.product_id,
              quantity: row.original.quantity,
              price: numericValue,
              taxes: normalizedTaxes,
            }

            const amount_untaxed = await calculateAmounts({
              products: table
                .getRowModel()
                .rows.map((r) => r.original)
                .map((elem) =>
                  elem.line_id === row.original.line_id
                    ? { ...elem, price_unit: numericValue }
                    : elem
                ),
              product: productParams,
            })

            debouncedUpdateRow(row.original.line_id, {
              price_unit: numericValue,
              amount_withtaxed: amount_untaxed.product.amount_withtaxed,
              amount_untaxed: amount_untaxed.product.amount_untaxed,
              amount_tax: amount_untaxed.product.amount_tax,
            })
          } catch (error) {
            console.error('Error calculando montos:', error)
            debouncedUpdateRow(row.original.line_id, { price_unit: numericValue })
          }
        }
      }, 300)

      setFrmIsChangedItem(true)
    }

    /*const handleBlur = async (e: FocusEvent<HTMLInputElement>) => {
      // Actualizar inmediatamente al perder foco
      const numericValue = Number(e.target.value)
      if (!isNaN(numericValue)) {
        const updateRow = (table.options.meta as any).updateRow

        try {
          const normalizedTaxes = normalizeTaxes(row.original.move_lines_taxes || [], taxOptions)

          const productParams = {
            product_id: row.original.product_id,
            quantity: row.original.quantity,
            price: numericValue,
            taxes: normalizedTaxes,
          }

          const amount_untaxed = await calculateAmounts({
            products: table
              .getRowModel()
              .rows.map((r) => r.original)
              .map((elem) =>
                elem.line_id === row.original.line_id ? { ...elem, price_unit: numericValue } : elem
              ),
            product: productParams,
          })

          updateRow(row.original.line_id, {
            price_unit: numericValue,
            amount_untaxed,
          })
        } catch (error) {
          console.error('Error calculando montos:', error)
          updateRow(row.original.line_id, { price_unit: numericValue })
        }
      }
    }*/

    if (isReadOnly) {
      return <div className="text-right px-2 py-1">{formatCurrency(row.original.price_unit)}</div>
    }

    return (
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        onBlur={() => {}}
        className="w-full no-spin text-right border-none outline-none bg-transparent p-1"
        min="0"
        step="0.01"
      />
    )
  }
)

// Componente ProductField optimizado
const ProductField = ({
  row,
  column,
  options,
  onChange,
  navFunction,
  onLabelClick,
  isReadOnly,
  handleChangeLabel,
  handleSearchOpt,
  handleCreateProduct,
  handleEditProduct,
}: {
  row: Row<MoveLine>
  column?: Column<MoveLine>
  options?: any[]
  onChange?: (data: any) => void
  navFunction: (id: number) => void
  onLabelClick?: (row: Row<MoveLine>) => void
  isReadOnly: boolean
  handleChangeLabel: (e: ChangeEvent<HTMLTextAreaElement>, row: Row<MoveLine>) => void
  handleSearchOpt: () => void
  handleCreateProduct: (input: string) => Promise<void>
  handleEditProduct: (input: string) => Promise<void>
}) => {
  const { setFrmIsChangedItem } = useAppStore()
  const [localLabel, setLocalLabel] = useState(row.original.label ?? '')
  const debounceLabelRef = useRef<any>(null)

  const handleLabelTextChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>, row: Row<MoveLine>) => {
      const newValue = e.target.value
      setLocalLabel(newValue)

      if (debounceLabelRef.current) {
        clearTimeout(debounceLabelRef.current)
      }

      debounceLabelRef.current = setTimeout(() => {
        handleChangeLabel(e, row)
      }, 500)

      setFrmIsChangedItem(true)
    },
    [handleChangeLabel, setFrmIsChangedItem]
  )

  useEffect(() => {
    setLocalLabel(row.original.label ?? '')
  }, [row.original.label, row.original._resetKey])

  useEffect(() => {
    return () => {
      if (debounceLabelRef.current) {
        clearTimeout(debounceLabelRef.current)
      }
    }
  }, [row.original.line_id])

  if (isReadOnly) {
    return (
      <div className="flex flex-col justify-start items-start">
        <span
          className="cursor-pointer h-10 flex items-center text-[#017e84]"
          onClick={() => navFunction(row.original.product_id ?? 0)}
        >
          {row.original.name}
        </span>
        {row.original.hasLabel && <span className="mb-[0.35rem] italic">{row.original.label}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <AutocompleteTable
        row={row}
        column={column!}
        onChange={onChange!}
        options={options!}
        navFunction={navFunction}
        placeholder=""
        searchOpt={handleSearchOpt}
        fnc_create={handleCreateProduct}
        editOpt={handleEditProduct}
        endContent={
          <Tooltip title="Agregar descripción" placement="bottom">
            <button
              type="button"
              className="bg-sgreen-400 px-2 py-1 rounded-md"
              onClick={() => onLabelClick!(row)}
            >
              <GiHamburgerMenu />
            </button>
          </Tooltip>
        }
      />
      {row.original.hasLabel && (
        <textarea
          key={`label-${row.original.line_id}-${row.original._resetKey}`}
          placeholder="Descripción del producto"
          value={localLabel}
          className="w-full min-h-6 text-sm resize-none !outline-none mb-2 italic"
          onChange={(e) => {
            handleLabelTextChange(e, row)
          }}
          onBlur={() => {}}
        />
      )}
    </div>
  )
}

// Componente para notas que mantiene el foco
const NotesField = memo(
  ({
    row,
    table,
    disabled,
    className = '',
    placeholder = '',
  }: {
    row: Row<MoveLine>
    table: Table<MoveLine>
    disabled: boolean
    className?: string
    placeholder?: string
  }) => {
    const [localValue, setLocalValue] = useState(row.original.notes || '')
    const debouncedUpdateRow = (table.options.meta as any).debouncedUpdateRow

    // Actualizar cuando cambie el valor de la fila
    useEffect(() => {
      setLocalValue(row.original.notes || '')
    }, [row.original.notes])

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue) // Actualización visual inmediata

      // Usar el debouncedUpdateRow - NO causa re-render inmediato
      debouncedUpdateRow(row.original.line_id, { notes: newValue })
    }

    return (
      <textarea
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        className={`resize-none w-full bg-transparent ${className}`}
        placeholder={placeholder}
      />
    )
  }
)

const InvoiceLines = ({ watch, setValue, control, errors, editConfig }: frmElementsProps) => {
  const isSavingRef = useRef<boolean>(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { calculateAmounts, totalInvoice } = useInvoiceCalculations()

  const {
    frmAction,
    formItem,
    executeFnc,
    setFrmIsChangedItem,
    setBreadcrumb,
    breadcrumb,
    frmLoading,
    openDialog,
    setNewAppDialogs,
    closeDialogWithData,
    setTableData,
    tableData,
    setFrmDialogAction,
  } = useAppStore()

  const {
    options: productOptions,
    loadOptions: loadProductOptions,
    reloadOptions: reloadProductOptions,
  } = useAutocompleteField({
    fncName: 'fnc_product',
    idField: 'product_id',
    nameField: 'product_name',
    formItem,
    filters: [{ column: 'state', value: 'A' }],
  })

  const {
    options: uomOptions,
    loadOptions: loadUomOptions,
    reloadOptions: reloadUomOptions,
  } = useAutocompleteField({
    fncName: 'fnc_uom',
    idField: 'uom_id',
    nameField: 'uom_name',
    formItem,
  })

  const { options: taxOptions, loadOptions: loadTaxOptions } = useAutocompleteField({
    fncName: 'fnc_tax',
    idField: 'tax_id',
    nameField: 'tax_name',
    formItem,
  })

  const isReadOnly =
    watch('state') === StatusInvoiceEnum.REGISTERED ||
    watch('state') === StatusInvoiceEnum.CANCELADO

  // Inicializar el estado con los datos del tableData si existen
  const [data, setData] = useState<MoveLine[]>(() => {
    if (tableData?.length > 0) {
      return tableData
    }
    // Si no hay tableData, intentar usar formItem
    if (formItem?.move_lines) {
      return formItem.move_lines.map((item: MoveLine) => ({
        ...item,
        hasLabel: !!item.label,
        _resetKey: Date.now(),
      }))
    }
    return []
  })

  const handleNumericFieldChange = async (
    row: Row<MoveLine>,
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    table: Table<MoveLine>,
    options: {
      fieldName: 'quantity' | 'price_unit'
      errorMessage: string
    }
  ) => {
    try {
      const updateRow = (table.options.meta as any).updateRow
      const { fieldName } = options
      const value = event.target.value

      // Creamos un objeto con la actualización específica para el campo
      const fieldUpdate = { [fieldName]: Number(value) }

      // Construimos el objeto para el cálculo con los parámetros adecuados
      const productParams = {
        product_id: row.original.product_id,
        quantity: fieldName === 'quantity' ? Number(value) : row.original.quantity,
        price: fieldName === 'price_unit' ? Number(value) : row.original.price_unit,
        taxes: row.original.move_lines_taxes,
      }

      const amount_untaxed = await calculateAmounts({
        products: table
          .getRowModel()
          .rows.map((r) => r.original)
          .map((elem) =>
            elem.line_id === row.original.line_id ? { ...elem, ...fieldUpdate } : elem
          ),
        product: productParams,
      })

      // Actualizamos la línea con el campo específico y el monto calculado
      updateRow(row.original.line_id, {
        ...fieldUpdate,
        amount_untaxed,
      })
    } catch (error) {
      toast.error(options.errorMessage)
      console.error(error)
    }
  }

  const handleChangeUdM = async (
    row: Row<MoveLine>,
    dataUdM: {
      rowId: number
      columnId: string
      option: Record<string, any>
    },
    table: Table<MoveLine>
  ) => {
    const { option } = dataUdM
    const updateRow = (table.options.meta as any).updateRow

    const fieldUpdate = {
      uom_id: option.value,
      uom_name: option.label,
    }
    updateRow(row.original.line_id, {
      ...fieldUpdate,
    })
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
      const updateRow = (table.options.meta as any).updateRow
      const { option } = dataTax
      const fieldUpdate = {
        move_lines_taxes: option.map((opt) => ({
          ...opt,
          tax_id: opt.value,
        })),
        move_lines_taxes_change: true,
      }
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
      updateRow(row.original.line_id, {
        ...fieldUpdate,
        amount_withtaxed: amount_untaxed.product.amount_withtaxed,
        amount_untaxed: amount_untaxed.product.amount_untaxed,
        amount_tax: amount_untaxed.product.amount_tax,
      })
    } catch (error) {
      console.error('Error en handleChangeTax:', error)
    }
  }
  const handleChangeProduct = async (
    row: Row<InvoiceData>,
    dataProduct: {
      rowId: number
      columnId: string
      option: Record<string, any>
    },
    table: Table<InvoiceData>
  ) => {
    try {
      const updateRow = (table.options.meta as any).updateRow
      const {
        option: { value },
      } = dataProduct

      const productData = await executeFnc('fnc_product', 's1', [String(value)])

      if (!productData?.oj_data) {
        throw new Error('Error: productData es null o undefined')
      }

      const sale_price = productData.oj_data[0]?.sale_price
      const taxes_sale = productData.oj_data[0]?.taxes_sale
      const uom_id = productData.oj_data[0]?.uom_id
      const uom_name = productData.oj_data[0]?.uom_name
      const name = productData.oj_data[0]?.name

      // Normalizar impuestos para incluir el value
      const normalizedTaxes = normalizeTaxes(taxes_sale || [], taxOptions)

      const productParams = {
        product_id: value,
        quantity: 1,
        price: sale_price || 0,
        taxes: normalizedTaxes,
      }

      const amount_untaxed = await calculateAmounts({
        products: table.getRowModel().rows.map((elem: Row<InvoiceData>) => elem.original) as any,
        product: productParams,
      })
      const fieldUpdate = {
        quantity: 1,
        product_id: value,
        name,
        price_unit: sale_price || 0,
        amount_withtaxed: amount_untaxed.product.amount_withtaxed,
        amount_untaxed: amount_untaxed.product.amount_untaxed,
        amount_tax: amount_untaxed.product.amount_tax,
        move_lines_taxes: normalizedTaxes, // Usar los impuestos normalizados
        uom_id,
        uom_name,
        move_lines_taxes_change: true,
      }

      updateRow(row.original.line_id, {
        ...fieldUpdate,
      })
    } catch (error) {
      console.error('Error en handleChangeProduct:', error)
    }
  }

  const navToProduct = async (value: number) => {
    if (!value) return

    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.name || 'Borrador',
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])

    navigate(`/action/303/detail/${value}`)
  }

  const navToUom = (value: number) => {
    setBreadcrumb([
      ...breadcrumb,
      {
        title: formItem.name,
        url: pathname,
        viewType: ViewTypeEnum.FORM,
      },
    ])
    navigate(`/action/91/detail/${value}`)
  }

  const handleClickLabel = (row: Row<MoveLine>) => {
    setData((prev) =>
      prev.map((item) =>
        item.line_id === row.original.line_id ? { ...item, hasLabel: true } : item
      )
    )
  }

  const handleChangeLabel = (
    e: ChangeEvent<HTMLTextAreaElement>,
    row: Row<MoveLine>,
    table: Table<MoveLine>
  ) => {
    const debouncedUpdateRow = (table.options.meta as any).debouncedUpdateRow
    const newValue = e.target.value

    // Actualización visual inmediata (sin triggear modifyData)
    setData((prev) =>
      prev.map((item) =>
        item.line_id === row.original.line_id ? { ...item, label: newValue } : item
      )
    )

    // Debounce la actualización real que marca el formulario como modificado
    debouncedUpdateRow(row.original.line_id, { label: newValue })
  }

  // ... (resto de las funciones openProductDialog, handleCreateProduct, etc. permanecen igual)
  const openProductDialog = async (
    title: string,
    row: Row<MoveLine>,
    table: Table<MoveLine>,
    name: string,
    parentDialogId?: string
  ) => {
    const initialValues = {
      name,
      state: 'A',
      type: 'D',
    }

    const dialogId = openDialog({
      title,
      parentId: parentDialogId,
      dialogContent: () => (
        <FrmBaseDialog config={ProductConfig} initialValues={initialValues} idDialog={dialogId} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              setFrmDialogAction({
                action: 'save',
                dialog: {
                  idDialog: dialogId,
                  afterSave: async (data: any) => {
                    const product_id = data?.product_id
                    if (product_id) {
                      reloadProductOptions()
                      await handleChangeProduct(
                        row,
                        {
                          rowId: row.original.line_id,
                          columnId: 'product_id',
                          option: { value: product_id },
                        },
                        table
                      )
                    }
                    setNewAppDialogs([])
                  },
                },
              })
            } catch (error) {
              console.error(`Error al ${title.toLowerCase()}:`, error)
            }
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const handleCreateProduct = async (input: string, row: Row<MoveLine>, table: Table<MoveLine>) => {
    try {
      const response = await executeFnc('fnc_product', 'i', {
        data: [
          {
            state: 'A',
            type: 'D',
            name: input,
            uom_id: 368,
          },
          {
            state: 'A',
          },
        ],
        product_id: null,
      })
      const product_id = response.oj_data?.product_id
      reloadProductOptions()
      if (product_id) {
        await handleChangeProduct(
          row,
          {
            rowId: row.original.line_id,
            columnId: 'product_id',
            option: { value: product_id },
          },
          table
        )
      }
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  }

  const handleEditProduct = async (row: Row<MoveLine>, table: Table<MoveLine>, name: string) => {
    openProductDialog('Crear producto', row, table, name)
  }

  const handleSearchOpt = (row: Row<MoveLine>, table: Table<MoveLine>) => {
    const dialogId = openDialog({
      title: 'Productos',
      dialogContent: () => (
        <ModalBase
          config={ProductConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option.product_id) {
              await handleChangeProduct(
                row,
                {
                  rowId: row.original.line_id,
                  columnId: 'product_id',
                  option: { value: option.product_id },
                },
                table
              )
            }
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Nuevo',
          type: 'confirm',
          onClick: () => openProductDialog('Crear producto', row, table, dialogId),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  const fnc_create_uom = async (row: Row<MoveLine>, table: Table<MoveLine>) => {
    const initialValues = {
      state: 'A',
      name: '',
    }

    const dialogId = openDialog({
      title: 'Crear unidad de medida',
      dialogContent: () => (
        <FrmBaseDialog config={UomConfig} idDialog={dialogId} initialValues={initialValues} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              setFrmDialogAction({
                action: 'save',
                dialog: {
                  idDialog: dialogId,
                  afterSave: async (data: any) => {
                    const uom_id = data?.uom_id
                    if (uom_id) {
                      reloadUomOptions()
                      await handleChangeUdM(
                        row,
                        {
                          rowId: row.original.line_id,
                          columnId: 'uom_id',
                          option: { value: uom_id },
                        },
                        table
                      )
                    }
                    setNewAppDialogs([])
                  },
                },
              })
            } catch (error) {
              console.error(error)
            }
          },
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  const fnc_search_uom = (row: Row<MoveLine>, table: Table<MoveLine>) => {
    const dialogId = openDialog({
      title: 'Unidad de medida',
      dialogContent: () => (
        <ModalBase
          config={UomConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option.uom_id) {
              await handleChangeUdM(
                row,
                {
                  rowId: row.original.line_id,
                  columnId: 'uom_id',
                  option: { value: option.uom_id },
                },
                table
              )
            }
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Crear',
          type: 'confirm',
          onClick: async () => fnc_create_uom(row, table),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  useEffect(() => {
    if (!data.length && tableData?.length > 0) {
      setData(tableData)
    }
  }, [data, tableData])

  useEffect(() => {
    if (frmAction === FormActionEnum.PRE_SAVE || isSavingRef.current) {
      return
    }

    if (errors && Object.keys(errors).length > 0) {
      return
    }

    if ((frmAction === FormActionEnum.UNDO || formItem) && !frmLoading) {
      if (tableData?.length > 0) {
        setData(tableData)
        return
      }
      if (!data.length) {
        const formatLines = formItem?.move_lines
          ? formItem?.move_lines.map((item: MoveLine) => ({
              ...item,
              hasLabel: !!item.label,
              _resetKey: Date.now(),
            }))
          : []
        setData(formatLines)
      }

      const formatLines = formItem?.move_lines
        ? formItem?.move_lines.map((item: MoveLine) => ({
            ...item,
            hasLabel: !!item.label,
            _resetKey: Date.now(),
          }))
        : []
      setData(formatLines)
    }
  }, [formItem, frmAction, tableData, errors])

  useEffect(() => {
    Promise.all([loadUomOptions(), loadProductOptions(), loadTaxOptions()])
  }, [loadUomOptions, loadProductOptions, loadTaxOptions])

  const columns = useMemo<ColumnDef<MoveLine>[]>(
    () => [
      {
        id: 'drag',
        size: 60,
        header: '',
        enableResizing: false,
        enableSorting: false,
        cell: () => {
          return (
            <div
              className={`flex justify-center items-center min-h-10 ${isReadOnly ? 'pointer-events-none' : ''}`}
            >
              <span className="drag-handle" style={{ cursor: 'grab' }}>
                <GrDrag />
              </span>
            </div>
          )
        },
      },
      {
        header: 'Producto',
        accessorKey: 'product_id',
        size: 400,
        minSize: 200,
        enableSorting: true,
        cell: ({ row, column, table }) => (
          <ProductField
            isReadOnly={isReadOnly}
            row={row}
            column={column}
            options={productOptions}
            onChange={(data) => handleChangeProduct(row, data, table)}
            navFunction={() => navToProduct(row.original.product_id)}
            onLabelClick={handleClickLabel}
            handleChangeLabel={(e, row) => handleChangeLabel(e, row, table)}
            handleEditProduct={(data) => handleEditProduct(row, table, data)}
            handleCreateProduct={(input: string) => handleCreateProduct(input, row, table)}
            handleSearchOpt={() => handleSearchOpt(row, table)}
          />
        ),
      },
      {
        header: 'Cantidad',
        accessorKey: 'quantity',
        size: 100,
        minSize: 100,
        enableSorting: true,
        meta: {
          align: 'right',
        },
        cell: ({ row, table }) => (
          <QuantityField
            row={row}
            table={table}
            isReadOnly={isReadOnly}
            calculateAmounts={calculateAmounts}
            taxOptions={taxOptions}
          />
        ),
      },
      {
        header: 'Unidad',
        accessorKey: 'uom_id',
        size: 200,
        minSize: 100,
        enableSorting: true,
        cell: ({
          row,
          column,
          table,
        }: {
          row: Row<MoveLine>
          column: Column<MoveLine>
          table: Table<MoveLine>
        }) => {
          if (watch('state') === StatusInvoiceEnum.REGISTERED) {
            return (
              <span
                className="text-teal-600 hover:cursor-pointer"
                onClick={() => navToUom(row.original.uom_id)}
              >
                {row.original.uom_name}
              </span>
            )
          }
          return (
            <AutocompleteTable
              row={row}
              column={column}
              options={uomOptions}
              onChange={(data) => handleChangeUdM(row, data, table)}
              searchOpt={() => fnc_search_uom(row, table)}
              navFunction={() => navToUom(row.original.uom_id)}
            />
          )
        },
      },
      {
        header: 'Precio',
        accessorKey: 'price_unit',
        meta: {
          align: 'right',
        },
        size: 100,
        minSize: 100,
        enableSorting: true,
        cell: ({ row, table }) => (
          <PriceField
            row={row}
            table={table}
            isReadOnly={isReadOnly}
            calculateAmounts={calculateAmounts}
            taxOptions={taxOptions}
          />
        ),
      },
      {
        header: 'Impuestos',
        accessorKey: 'move_lines_taxes',
        size: 200,
        minSize: 200,
        cell: ({
          row,
          column,
          table,
        }: {
          row: Row<MoveLine>
          column: Column<MoveLine>
          table: Table<MoveLine>
        }) => {
          if (watch('state') === StatusInvoiceEnum.REGISTERED) {
            return (
              <div className="flex flex-wrap">
                {(row.original.move_lines_taxes ?? []).map((item) => (
                  <Chip key={item.tax_id} label={item.label} size="small" className="m-1" />
                ))}
              </div>
            )
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
              options={taxOptions}
              key={`tax-${row.original.line_id}-${JSON.stringify(row.original.move_lines_taxes)}`}
            />
          )
        },
      },
      {
        header: 'amount_tax',
        accessorKey: 'amount_tax',
        size: 150,
        minSize: 80,
        enableSorting: true,
        meta: {
          align: 'right',
        },
        cell: ({ row }) => (
          <div className="text-right">{formatCurrency(row.original.amount_tax)}</div>
        ),
      },
      {
        header: 'amount_untaxed',
        accessorKey: 'amount_untaxed',
        size: 150,
        minSize: 80,
        enableSorting: true,
        meta: {
          align: 'right',
        },
        cell: ({ row }) => (
          <div className="text-right">{formatCurrency(row.original.amount_untaxed)}</div>
        ),
      },
      {
        header: 'amount_withtaxed',
        accessorKey: 'amount_withtaxed',
        size: 150,
        minSize: 80,
        enableSorting: true,
        meta: {
          align: 'right',
        },
        cell: ({ row }) => (
          <div className="text-right">{formatCurrency(row.original.amount_withtaxed)}</div>
        ),
      },
      // Columna de notas optimizada
      {
        header: '',
        accessorKey: 'label',
        maxSize: 10,
        cell: ({ row, table }) => {
          return (
            <NotesField
              row={row}
              table={table}
              disabled={isReadOnly}
              className="italic w-full disabled:bg-transparent mt-[7px]"
            />
          )
        },
        size: 0,
      },
      {
        id: 'action',
        header: '',
        size: 40,
        enableResizing: false,
        cell: ({ row, table }) => {
          if (isReadOnly) return null
          return (
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => (table.options.meta as any).deleteRow(row.original.line_id)}
              >
                <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
              </button>
            </div>
          )
        },
      },
    ],
    [productOptions, taxOptions, uomOptions, isReadOnly]
  )

  return (
    <div className="flex flex-col">
      <DragEditableTable
        data={data}
        setData={setData}
        columns={columns}
        onDataChange={(newData) => {
          // Usar un timeout para evitar actualizaciones durante el renderizado
          setTimeout(() => {
            setValue('move_lines', newData)
            setTableData(newData)
            setFrmIsChangedItem(true)
          }, 0)
        }}
        onDeleteRow={(lineId: number) => {
          setData((prevData) => {
            const newData = prevData.map((row) =>
              row.line_id === lineId ? { ...row, action: ActionTypeEnum.DELETE } : row
            )
            return newData
          })
        }}
      >
        {(modifyDataSetter) => (
          <TableActions
            onAddRow={(type) => {
              // Usar el setData primero y luego modifyDataSetter en el siguiente ciclo
              setData((prev) => [...prev, { ...defaultProduct, line_id: prev.length + 1000, type }])
              setTimeout(() => {
                modifyDataSetter(true)
              }, 0)
            }}
            disabled={frmLoading}
            watch={watch}
          />
        )}
      </DragEditableTable>

      <InvoiceTotals totals={totalInvoice} />

      <div className="w-full mt-4 flex gap-7">
        <div className="w-4/6">
          <div className="w-full">
            <TextControlled
              name={'terms_and_conditions'}
              control={control}
              errors={errors}
              multiline={true}
              className={'InputNoLineEx w-full'}
              placeholder={'Términos y condiciones'}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const TableActions = ({
  onAddRow,
  disabled = false,
  watch,
}: {
  onAddRow: (type: TypeInvoiceLineEnum) => void
  disabled?: boolean
  watch: any
}) => {
  const actions = [
    {
      label: 'Agregar línea',
      type: TypeInvoiceLineEnum.LINE,
    },
    {
      label: 'Agregar sección',
      type: TypeInvoiceLineEnum.SECTION,
    },
    {
      label: 'Agregar nota',
      type: TypeInvoiceLineEnum.NOTE,
    },
  ]
  const isReadOnly =
    watch('state') === StatusInvoiceEnum.REGISTERED ||
    watch('state') === StatusInvoiceEnum.CANCELADO

  return (
    <>
      {isReadOnly ? (
        <div className="flex gap-4 pt-[5px] pl-4 border-y-[#d8dadd] border-t-[1px]"></div>
      ) : (
        <div
          className="
        flex gap-4 pt-[10px] pb-[10px] pl-4 pr-4 border-y-[#d8dadd] border-t-[1px] hover:bg-gray-200"
        >
          {actions.map(({ label, type }) => (
            <button
              key={type}
              type="button"
              className="text-[#017e84] hover:text-[#017e84]/80"
              onClick={() => onAddRow(type)}
              disabled={disabled}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

interface TotalRowProps {
  label: string
  amount: number
  bold?: boolean
}

const TotalRow = ({ label, amount, bold = false }: TotalRowProps) => (
  <div className={`flex justify-between ${bold ? 'font-bold' : ''}`}>
    <span>{label}</span>
    <span>{formatCurrency(amount)}</span>
  </div>
)

export const InvoiceTotals = ({ totals }: { totals: TotalsInvoiceType }) => {
  const { totals: totalsInvoice, tax_totals } = totals
  return (
    <div className="flex flex-col gap-2 min-w-[200px] ml-auto p-4 bg-gray-50 rounded-md mt-4">
      {/* Subtotal */}
      <TotalRow label="Subtotal" amount={totalsInvoice.amount_untaxed || 0} />

      {/* Impuestos */}
      {tax_totals.map((tax) => (
        <TotalRow key={tax.id_tax} label={tax.name} amount={tax.amount} />
      ))}

      {/* Total */}
      <div className="border-t border-gray-300 mt-2 pt-2">
        <TotalRow label="Total" amount={totalsInvoice.amount_total} bold />
      </div>
    </div>
  )
}

export default InvoiceLines
