import { ViewTypeEnum } from '@/shared/shared.types'
import { useNavigate, useLocation } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { AutocompleteTable } from '@/shared/ui/inputs/AutocompleteTable'
import { Column, Row, Table } from '@tanstack/react-table'
import { MoveLine } from '@/modules/invoicing/invoice.types'
import ProductConfig from '@/modules/action/views/inventory/products_variant/config'
import { MutableRefObject } from 'react'
import { ChangeEvent } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Dispatch, SetStateAction } from 'react'
import { Tooltip } from '@mui/material'
import { useInvoiceCalculations } from '@/modules/invoicing/hooks/useInvoiceLines'

export const ProductAutocompleteTable = ({
  row,
  column,
  table,
  formItem,
  options,
  reloadOptions,
  isReadOnly,
  setData,
  tableHelpersRef,
}: {
  row: Row<any>
  column: Column<any>
  table: Table<any>
  formItem: any
  options: any
  reloadOptions: () => void
  isReadOnly: boolean
  setData: Dispatch<SetStateAction<MoveLine[]>>
  tableHelpersRef?: MutableRefObject<
    | {
        updateLineData: (id: number, updates: any) => void
        debouncedUpdateLineData: (id: number, updates: any) => void
        handleTextFieldChange: (e: any, id: number, fieldName: string) => void
      }
    | undefined
  >
}) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    openDialog,
    closeDialogWithData,
    setNewAppDialogs,
    breadcrumb,
    setBreadcrumb,
    executeFnc,
  } = useAppStore()
  const { calculateAmounts } = useInvoiceCalculations()

  // Función para actualizar datos que usa tableHelpersRef
  const updateData = (rowId: number, data: any) => {
    if (tableHelpersRef?.current) {
      tableHelpersRef.current.updateLineData(rowId, data)
    } else {
      // Fallback si tableHelpersRef no está disponible
      setData((prev) => prev.map((item) => (item.line_id === rowId ? { ...item, ...data } : item)))
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

      // Usar la función updateData
      updateData(row.original.line_id, {
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

  const handleClickLabel = (row: Row<MoveLine>) => {
    setData((prev) =>
      prev.map((item) =>
        item.line_id === row.original.line_id ? { ...item, hasLabel: true } : item
      )
    )
  }

  const handleChangeLabel = (e: ChangeEvent<HTMLTextAreaElement>, row: Row<MoveLine>) => {
    const newValue = e.target.value

    // Actualización visual inmediata
    setData((prev) =>
      prev.map((item) =>
        item.line_id === row.original.line_id ? { ...item, label: newValue } : item
      )
    )

    // Usar debouncedUpdateLineData de tableHelpersRef si está disponible
    if (tableHelpersRef?.current) {
      tableHelpersRef.current.debouncedUpdateLineData(row.original.line_id, { label: newValue })
    }
  }

  const handleCreateProduct = async (input: string, row: Row<MoveLine>, table: Table<MoveLine>) => {
    try {
      const response = await executeFnc('fnc_product', 'i', {
        data: [
          {
            state: 'A',
            type: 'B',
            name: input,
          },
          {
            state: 'A',
          },
        ],
        product_id: null,
      })
      const product_id = response.oj_data?.product_id
      reloadOptions()
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

  const openProductDialog = async (
    title: string,
    row: Row<MoveLine>,
    table: Table<MoveLine>,
    name: string,
    parentDialogId?: string
  ) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title,
      parentId: parentDialogId,
      dialogContent: () => (
        <FrmBaseDialog
          config={ProductConfig}
          setGetData={(fn: any) => (getData = fn)}
          initialValues={{ name }}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() // 📌 Obtenemos la data antes de cerrar
              const response = await executeFnc('fnc_product', 'i', {
                data: [
                  formData,
                  {
                    state: 'A',
                  },
                ],
                product_id: null,
              })
              const product_id = response.oj_data?.product_id
              reloadOptions()
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

  return (
    <ProductField
      isReadOnly={isReadOnly}
      row={row}
      column={column}
      options={options}
      onChange={(data) => handleChangeProduct(row, data, table)}
      navFunction={navToProduct}
      onLabelClick={handleClickLabel}
      handleChangeLabel={handleChangeLabel}
      handleEditProduct={(data) => handleEditProduct(row, table, data)}
      handleCreateProduct={(input: string) => handleCreateProduct(input, row, table)}
      handleSearchOpt={() => handleSearchOpt(row, table)}
    />
  )
}

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
      <div className="flex flex-col gap-2 justify-start items-start">
        <span
          className="cursor-pointer h-10 flex items-center text-[#017e84]"
          onClick={() => navFunction(row.original.product_id ?? 0)}
        >
          {row.original.name}
        </span>
        {row.original.hasLabel && <span>{row.original.label}</span>}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <AutocompleteTable
        row={row}
        column={column!}
        onChange={onChange!}
        options={options!}
        navFunction={navFunction}
        searchOpt={handleSearchOpt}
        fnc_create={handleCreateProduct}
        editOpt={handleEditProduct}
        endContent={
          <Tooltip title="Agregar descripción" placement="bottom">
            <button
              type="button"
              className="bg-sgreen-400 text-white px-2 py-1 rounded-md"
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
          className="w-full min-h-6 text-sm resize-none !outline-none border-b-[1.5px]"
          onChange={(e) => handleChangeLabel(e, row)}
        />
      )}
    </div>
  )
}
