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
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { GrTrash } from 'react-icons/gr'
import { useInvoiceCalculations } from '@/modules/invoicing/hooks/useInvoiceLines'
import { formatCurrency } from '@/shared/helpers/currency'
import { GrDrag } from 'react-icons/gr'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import ProductConfig from '@/modules/action/views/inventory/products_variant/config'
import { FrmBaseDialog } from '@/shared/components/core'
import UomConfig from '@/modules/action/views/inventory/unit-measurement/config'
import { useAutocompleteField } from '@/shared/components/form/hooks/useAutocompleteField'
import { SwitchableTextField } from '@/shared/components/table/drag-editable-table/base-components/inputs'
import { DragEditableTable } from '@/shared/components/table/drag-editable-table/base-components/EditableTable'

// Para componentes más complejos como el AutocompleteTable
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
  if (isReadOnly) {
    return (
      // <div className="flex flex-col gap-2 justify-start items-start">
      <div className="flex flex-col justify-start items-start">
        <span
          className="cursor-pointer h-10 flex items-center text-[#017e84]"
          onClick={() => navFunction(row.original.product_id ?? 0)}
        >
          {row.original.name}
        </span>
        {row.original.hasLabel && <span className="mb-2 italic">{row.original.label}</span>}
      </div>
    )
  }

  return (
    // <div className="flex flex-col gap-2 justify-center items-center">
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
              className="bg-sgreen-400  px-2 py-1 rounded-md"
              onClick={() => onLabelClick!(row)}
            >
              <GiHamburgerMenu />
            </button>
          </Tooltip>
        }
      />
      {row.original.hasLabel && (
        <textarea
          placeholder="Descripción del producto"
          defaultValue={row.original.label}
          className="w-full min-h-6 text-sm resize-none !outline-none mb-2 italic"
          onChange={(e) => handleChangeLabel(e, row)}
        />
      )}
    </div>
  )
}

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
    watch('state') === StatusInvoiceEnum.PUBLICADO || watch('state') === StatusInvoiceEnum.CANCELADO

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

      updateRow(row.original.line_id, {
        ...fieldUpdate,
        amount_untaxed,
      })
    } catch (error) {
      console.error('Error en handleChangeTax:', error)
    }
  }

  const handleChangeProduct = async (
    row: Row<MoveLine>,
    dataProduct: {
      rowId: number
      columnId: string
      option: Record<string, any>
    },
    table: Table<MoveLine>
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

      const productParams = {
        product_id: value,
        quantity: 1,
        price: sale_price,
        taxes: taxes_sale,
      }

      const amount_untaxed = await calculateAmounts({
        products: table.getRowModel().rows.map((elem: Row<MoveLine>) => elem.original),
        product: productParams,
      })

      const fieldUpdate = {
        quantity: 1,
        product_id: value,
        name,
        price_unit: sale_price,
        amount_untaxed,
        move_lines_taxes: taxes_sale,
        uom_id,
        uom_name,
      }

      updateRow(row.original.line_id, {
        ...fieldUpdate,
        amount_untaxed,
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
        title: formItem?.name || 'Producto',
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
  const openProductDialog = async (
    title: string,
    row: Row<MoveLine>,
    table: Table<MoveLine>,
    name: string,
    parentDialogId?: string
  ) => {
    // Necesitamos inicializar valores limpios para cada nueva apertura del modal
    const initialValues = {
      name,
      // Establecemos valores predeterminados limpios para evitar mensajes de error al abrir
      state: 'A',
      type: 'B',
    }

    const dialogId = openDialog({
      title,
      parentId: parentDialogId,
      dialogContent: () => (
        <FrmBaseDialog
          config={ProductConfig}
          initialValues={initialValues}
          idDialog={dialogId} // Pasamos el ID para que FrmBaseDialog pueda identificarse
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              // 1. setFrmDialogAction activa executeAction() dentro de FrmBaseDialog
              // 2. executeAction ejecuta trigger() que valida todos los campos
              // 3. Si hay errores, se muestran automáticamente en el formulario
              // 4. Si no hay errores, se ejecuta la función afterSave con los datos válidos
              setFrmDialogAction({
                action: 'save', // Acción 'save' que activa la validación
                dialog: {
                  idDialog: dialogId, // ID del diálogo para identificarlo
                  afterSave: async (data: any) => {
                    // Esta función solo se ejecuta si la validación fue exitosa
                    const product_id = data?.product_id
                    if (product_id) {
                      // Actualizamos las opciones disponibles
                      reloadProductOptions()
                      // Actualizamos el producto seleccionado en la línea
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
                    // Cerramos todos los diálogos
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
            // Simplemente cerramos el diálogo sin hacer nada
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }

  // 📌 Crear un producto sin abrir diálogo
  const handleCreateProduct = async (input: string, row: Row<MoveLine>, table: Table<MoveLine>) => {
    try {
      const response = await executeFnc('fnc_product', 'i', {
        data: [
          {
            state: 'A',
            type: 'B',
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

  // 📌 Editar un producto (reutiliza `openProductDialog`)
  const handleEditProduct = async (row: Row<MoveLine>, table: Table<MoveLine>, name: string) => {
    openProductDialog('Crear producto', row, table, name)
  }

  // 📌 Abrir buscador de productos
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
    // Valores iniciales limpios para el modal
    const initialValues = {
      // Establecemos valores predeterminados para evitar errores al abrir
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
              // Mismo mecanismo que en openProductDialog
              // 1. Activamos la validación interna del formulario
              // 2. Solo continúa si todos los campos son válidos
              setFrmDialogAction({
                action: 'save',
                dialog: {
                  idDialog: dialogId,
                  afterSave: async (data: any) => {
                    // Esta función solo se ejecuta si la validación fue exitosa
                    const uom_id = data?.uom_id
                    if (uom_id) {
                      // Actualizamos la lista de unidades de medida
                      reloadUomOptions()
                      // Seleccionamos la nueva unidad en la línea
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
                    // Cerramos el diálogo
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
            // Cerramos el diálogo sin hacer nada
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

    // Añadir una verificación adicional para saber si estamos en un estado de validación fallida
    // Si hay errores en el formulario, no deberíamos restablecer las líneas
    if (errors && Object.keys(errors).length > 0) {
      return
    }

    if (frmAction === FormActionEnum.UNDO || formItem) {
      if (tableData?.length > 0) {
        setData(tableData)
        return
      }
      console.log('formItem', formItem)
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
      console.log('formItem', formItem)

      const formatLines = formItem?.move_lines
        ? formItem?.move_lines.map((item: MoveLine) => ({
            ...item,
            hasLabel: !!item.label,
            _resetKey: Date.now(),
          }))
        : []
      console.log('formatLines', formatLines)
      setData(formatLines)
    }
  }, [formItem, frmAction, tableData, errors])

  console.log('FormItem', formItem?.move_lines, watch('move_lines'))
  const debounceQuantityRef = useRef<any>(null)
  const debounceePriceRef = useRef<any>(null)
  // Handlers para cambios inmediatos (onChange)
  const handleQuantityTextChange = useCallback(
    (e: any, row: Row<MoveLine>, table: Table<MoveLine>) => {
      if (debounceQuantityRef.current) {
        clearTimeout(debounceQuantityRef.current)
      }

      debounceQuantityRef.current = setTimeout(() => {
        handleQuantityChange(row, e, table)
        // Aquí puedes agregar lógica adicional si necesitas
        // Por ejemplo, validaciones en tiempo real
      }, 100)

      // Marcar como cambiado inmediatamente
      setFrmIsChangedItem(true)
    },
    [setFrmIsChangedItem]
  )
  const handlePriceTextChange = useCallback(
    (e: any, row: Row<MoveLine>, table: Table<MoveLine>) => {
      if (debounceePriceRef.current) {
        clearTimeout(debounceePriceRef.current)
      }

      debounceePriceRef.current = setTimeout(() => {
        handlePriceChange(row, e, table)
      }, 100)

      setFrmIsChangedItem(true)
    },
    [setFrmIsChangedItem]
  )

  const PriceCell = memo(({ row, table }: { row: Row<MoveLine>; table: Table<MoveLine> }) => (
    <SwitchableTextField
      isReadOnly={isReadOnly}
      value={row.original.price_unit}
      onBlur={() => {}}
      onChange={(e) => handlePriceTextChange(e, row, table)}
      type="number"
    />
  ))
  const QuantityCell = memo(({ row, table }: { row: Row<MoveLine>; table: Table<MoveLine> }) => (
    <SwitchableTextField
      isReadOnly={isReadOnly}
      value={row.original.quantity}
      onBlur={() => {}}
      type="number"
      onChange={(e) => handleQuantityTextChange(e, row, table)}
    />
  ))
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
            navFunction={navToProduct}
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
        cell: ({ row, table }) => <QuantityCell row={row} table={table} />,
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
        cell: ({ row, table }) => <PriceCell row={row} table={table} />,
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
      /** FULL WIDTH */
      {
        accessorKey: 'label',
        header: '',
        maxSize: 10,
        cell: ({ row, table }) => {
          const isNote = row.original.type === TypeInvoiceLineEnum.NOTE
          const isSection = row.original.type === TypeInvoiceLineEnum.SECTION
          if (isNote || isSection) {
            return (
              <textarea
                value={row.original.label || ''}
                placeholder={`Ingrese una ${isNote ? 'nota' : 'sección'}...`}
                className={`italic w-full ${isNote ? '' : 'font-bold'} disabled:bg-transparent mt-[7px]`}
                onChange={(e) => handleChangeLabel(e, row, table)}
                disabled={isReadOnly}
              />
            )
          }
          return null
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
    [
      productOptions,
      taxOptions,
      uomOptions,
      isReadOnly,
      handleQuantityTextChange,
      handlePriceTextChange,
    ]
  )

  return (
    // <div className="flex flex-col gap-4">
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
  const isReadOnly = watch('state') === StatusInvoiceEnum.PUBLICADO
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
