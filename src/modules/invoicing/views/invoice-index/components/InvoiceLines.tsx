import { useState, useMemo, useEffect, useRef, FocusEvent, ChangeEvent, useCallback } from 'react'
import { Row, ColumnDef, Column, Table } from '@tanstack/react-table'

import useAppStore from '@/store/app/appStore'
import { MoveLine, StatusInvoiceEnum, TotalsInvoiceType } from '@/modules/invoicing/invoice.types'
import { defaultProduct } from '@/modules/invoicing/constants'
import { Chip } from '@mui/material'
import { toast } from 'sonner'
import {
  ActionTypeEnum,
  FormActionEnum,
  frmElementsProps,
  ViewTypeEnum,
} from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { useInvoiceCalculations } from '@/modules/invoicing/hooks/useInvoiceLines'
import { formatCurrency } from '@/shared/helpers/currency'
import { GrDrag } from 'react-icons/gr'
import { SwitchableTextField } from '@/shared/components/table/drag-editable-table/base-components/inputs'
import { UnitAutocompleteTable } from '@/shared/components/form/table/UnitAutocompleteTable'
import { useAutocompleteField } from '@/shared/components/form/hooks/useAutocompleteField'
import { ProductAutocompleteTable } from '@/shared/components/form/table/ProductAutocompleteTable'
import { TaxAutocompleteTable } from '@/shared/components/form/table/TaxAutocompleteTable'
import { DragEditableTable } from '@/shared/components/table/drag-editable-table/base-components/table'
//reusable component

// end reusable component
export const InvoiceLines = ({
  watch,
  setValue,
  errors,
  control,
  editConfig,
}: frmElementsProps) => {
  const isSavingRef = useRef<boolean>(false)

  const [modifyData, setModifyData] = useState<boolean>(false)

  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { calculateAmounts, totalInvoice } = useInvoiceCalculations()
  const {
    options: uomOptions,
    reloadOptions: reloadUomOptions,
    loadOptions: loadUomOptions,
  } = useAutocompleteField({
    fncName: 'fnc_uom',
    idField: 'uom_id',
    nameField: 'uom_name',
  })
  const {
    options: productOptions,
    reloadOptions: reloadProductOptions,
    loadOptions: loadProductOptions,
  } = useAutocompleteField({
    fncName: 'fnc_product',
    idField: 'product_id',
    nameField: 'product_name',
  })
  const {
    options: taxOptions,
    reloadOptions: reloadTaxOptions,
    loadOptions: loadTaxOptions,
  } = useAutocompleteField({
    fncName: 'fnc_tax',
    idField: 'tax_id',
    nameField: 'tax_name',
  })

  const {
    frmAction,
    formItem,
    setFrmIsChangedItem,
    setBreadcrumb,
    breadcrumb,
    frmLoading,
    tableData,
  } = useAppStore()

  const isReadOnly = watch('state') === StatusInvoiceEnum.PUBLICADO

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

  const tableHelpersRef = useRef<{
    updateLineData: (id: number, updates: Partial<MoveLine>) => void
    debouncedUpdateLineData: (id: number, updates: Partial<MoveLine>) => void
    handleTextFieldChange: (
      e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      id: number,
      fieldName: string
    ) => void
    handleDelete: (id: number) => void
    addRow: (type: string) => void
  }>()

  //COLUMNS
  const handleChangeLabel = (e: ChangeEvent<HTMLTextAreaElement>, row: Row<MoveLine>) => {
    if (tableHelpersRef.current) {
      tableHelpersRef.current.handleTextFieldChange(e, row.original.line_id, 'label')
    } else {
      const newValue = e.target.value

      setData((prev) =>
        prev.map((item) =>
          item.line_id === row.original.line_id ? { ...item, label: newValue } : item
        )
      )

      setTimeout(() => {
        setData((prev) =>
          prev.map((item) =>
            item.line_id === row.original.line_id
              ? {
                  ...item,
                  label: newValue,
                  action:
                    item.action !== ActionTypeEnum.INSERT
                      ? ActionTypeEnum.UPDATE
                      : ActionTypeEnum.INSERT,
                }
              : item
          )
        )
        setModifyData(true)
      }, 300)
    }
  }

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
      const { fieldName } = options
      const value = event.target.value

      const fieldUpdate = { [fieldName]: Number(value) }

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

      if (tableHelpersRef.current) {
        tableHelpersRef.current.updateLineData(row.original.line_id, {
          ...fieldUpdate,
          amount_untaxed,
        })
      } else {
        setData((prev) =>
          prev.map((item) =>
            item.line_id === row.original.line_id
              ? {
                  ...item,
                  ...fieldUpdate,
                  amount_untaxed,
                  action:
                    item.action !== ActionTypeEnum.INSERT
                      ? ActionTypeEnum.UPDATE
                      : ActionTypeEnum.INSERT,
                }
              : item
          )
        )
        setModifyData(true)
      }
    } catch (error) {
      toast.error(options.errorMessage)
      console.error(error)
    }
  }

  const handleQuantityChange = (
    row: Row<MoveLine>,
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
    table: Table<MoveLine>
  ) => {
    handleNumericFieldChange(row, event, table, {
      fieldName: 'quantity',
      errorMessage: 'Error al actualizar cantidad',
    })
  }

  const handlePriceChange = (
    row: Row<MoveLine>,
    event: FocusEvent<HTMLInputElement>,
    table: Table<MoveLine>
  ) => {
    handleNumericFieldChange(row, event, table, {
      fieldName: 'price_unit',
      errorMessage: 'Error al actualizar precio',
    })
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

  //TABLE HELPERS
  const getTableHelpers = useCallback((helpers: any) => {
    tableHelpersRef.current = helpers
  }, [])

  const TableActions = ({
    onAddRow,
    disabled,
    watch,
  }: {
    onAddRow?: (type: TypeInvoiceLineEnum) => void
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
    const isReadOnly = watch('state') === StatusInvoiceEnum.PUBLICADO
    return (
      <>
        {isReadOnly ? (
          <div className="flex gap-4 pt-[5px] pl-4 border-y-[#d8dadd] border-t-[1px]"></div>
        ) : (
          <div className="flex gap-4 pt-[10px] pb-[10px] pl-4 pr-4 border-y-[#d8dadd] border-t-[1px]">
            {actions.map(({ label, type }) => (
              <button
                key={type}
                type="button"
                className="text-[#017e84] hover:text-[#017e84]/80"
                onClick={() => {
                  if (tableHelpersRef.current?.addRow) {
                    tableHelpersRef.current.addRow(type)
                  } else if (onAddRow) {
                    onAddRow(type)
                  }
                }}
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

  const customDeleteHandler = (lineId: number) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.line_id === lineId ? { ...row, action: ActionTypeEnum.DELETE } : row
      )
    )
    setModifyData(true)
  }

  useEffect(() => {
    Promise.all([loadUomOptions(), loadProductOptions(), loadTaxOptions()])
  }, [loadUomOptions, loadProductOptions, loadTaxOptions])

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

    if (frmAction === FormActionEnum.UNDO || formItem) {
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
          <ProductAutocompleteTable
            row={row}
            column={column}
            table={table}
            isReadOnly={isReadOnly}
            formItem={formItem}
            tableHelpersRef={tableHelpersRef}
            options={productOptions}
            reloadOptions={reloadProductOptions}
            setData={setData}
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
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.quantity}
            onBlur={(e) => handleQuantityChange(row, e, table)}
            type="number"
            onChange={() => setFrmIsChangedItem(true)}
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
        }: {
          row: Row<MoveLine>
          column: Column<MoveLine>
          table: Table<MoveLine>
        }) => {
          if (watch('state') === StatusInvoiceEnum.PUBLICADO) {
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
            <UnitAutocompleteTable
              row={row}
              column={column}
              formItem={formItem}
              tableHelpersRef={tableHelpersRef}
              options={uomOptions}
              reloadOptions={reloadUomOptions}
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
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.price_unit}
            onBlur={(e) => handlePriceChange(row, e, table)}
            onChange={() => setFrmIsChangedItem(true)}
            type="number"
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
          if (watch('state') === StatusInvoiceEnum.PUBLICADO) {
            return (
              <div className="flex flex-wrap">
                {(row.original.move_lines_taxes ?? []).map((item) => (
                  <Chip key={item.tax_id} label={item.label} size="small" className="m-1" />
                ))}
              </div>
            )
          }
          return (
            <TaxAutocompleteTable
              row={row}
              column={column}
              table={table}
              options={taxOptions}
              reloadOptions={reloadTaxOptions}
              tableHelpersRef={tableHelpersRef}
              key={`tax-${row.original.line_id}-${JSON.stringify(row.original.move_lines_taxes)}`}
            />
          )
        },
      },
      {
        header: 'Importe',
        accessorKey: 'amount_untaxed',
        size: 80,
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
        accessorKey: 'label',
        header: '',
        maxSize: 10,
        cell: ({ row }) => {
          const isNote = row.original.type === TypeInvoiceLineEnum.NOTE
          const isSection = row.original.type === TypeInvoiceLineEnum.SECTION
          if (isNote || isSection) {
            return (
              <textarea
                value={row.original.label || ''}
                placeholder={`Ingrese una ${isNote ? 'nota' : 'sección'}...`}
                className={`italic w-full ${isNote ? '' : 'font-bold'} disabled:bg-transparent`}
                onChange={(e) => handleChangeLabel(e, row)}
                disabled={isReadOnly}
              />
            )
          }
          return null
        },
        size: 0,
      },
    ],
    [productOptions, taxOptions, uomOptions, isReadOnly]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="table-details overflow-x-auto flex flex-col">
        <DragEditableTable
          columns={columns}
          setValue={setValue}
          listName={'move_lines'}
          idTable={'line_id'}
          modifyData={modifyData}
          setModifyData={setModifyData}
          data={data}
          setData={setData}
          onDelete={customDeleteHandler}
          isReadOnly={isReadOnly}
          debounceDelay={300}
          getTableHelpers={getTableHelpers}
          defaultRowData={(type: TypeInvoiceLineEnum) => ({
            ...defaultProduct,
            type,
            quantity: 1,
            price_unit: 0,
            amount_untaxed: 0,
          })}
        />
        <TableActions disabled={frmLoading} watch={watch} />
      </div>

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

const InvoiceTotals = ({ totals }: { totals: TotalsInvoiceType }) => {
  const { totals: totalsInvoice, tax_totals } = totals
  return (
    <div className="flex flex-col gap-2 min-w-[200px] ml-auto p-4 bg-gray-50 rounded-md">
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
