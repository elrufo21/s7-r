import { ViewTypeEnum } from '@/shared/shared.types'
import { useNavigate, useLocation } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { AutocompleteTable } from '@/shared/ui/inputs/AutocompleteTable'
import { Column, Row } from '@tanstack/react-table'
import { MoveLine } from '@/modules/invoicing/invoice.types'
import UomConfig from '@/modules/action/views/inventory/unit-measurement/config'
import { MutableRefObject } from 'react'

export const UnitAutocompleteTable = ({
  row,
  column,
  formItem,
  updateLineData,
  options,
  reloadOptions,
  tableHelpersRef,
}: {
  row: Row<any>
  column: Column<any>
  formItem: any
  updateLineData?: (rowId: number, data: any) => void
  options: any
  reloadOptions: () => void
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

  // Función para actualizar datos que usa tableHelpersRef si está disponible
  const updateData = (rowId: number, data: any) => {
    if (tableHelpersRef?.current) {
      tableHelpersRef.current.updateLineData(rowId, data)
    } else if (updateLineData) {
      updateLineData(rowId, data)
    }
  }

  const fnc_create_uom = async (row: Row<MoveLine>) => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear unidad de medida',
      dialogContent: () => (
        <FrmBaseDialog config={UomConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            try {
              const formData = getData() // 📌 Obtenemos la data antes de cerrar
              const response = await executeFnc('fnc_uom', 'i', formData)
              const uom_id = response.oj_data?.uom_id
              reloadOptions()
              if (uom_id) {
                await handleChangeUdM(row, {
                  rowId: row.original.line_id,
                  columnId: 'uom_id',
                  option: { value: uom_id },
                })
              }
              setNewAppDialogs([]) // Cierra todos los diálogos
            } catch (error) {
              console.error(error)
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

  const handleChangeUdM = async (
    row: Row<MoveLine>,
    dataUdM: {
      rowId: number
      columnId: string
      option: Record<string, any>
    }
  ) => {
    const { option } = dataUdM

    const fieldUpdate = {
      uom_id: option.value,
      uom_name: option.label,
    }

    // Usar la nueva función updateData
    updateData(row.original.line_id, {
      ...fieldUpdate,
    })
  }

  const fnc_search_uom = (row: Row<MoveLine>) => {
    const dialogId = openDialog({
      title: 'Unidad de medida',
      dialogContent: () => (
        <ModalBase
          config={UomConfig}
          multiple={false}
          onRowClick={async (option) => {
            if (option.uom_id) {
              await handleChangeUdM(row, {
                rowId: row.original.line_id,
                columnId: 'uom_id',
                option: { value: option.uom_id },
              })
            }
            setNewAppDialogs([])
          }}
        />
      ),
      buttons: [
        {
          text: 'Crear',
          type: 'confirm',
          onClick: async () => fnc_create_uom(row),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
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

  return (
    <AutocompleteTable
      row={row}
      column={column}
      options={options}
      onChange={(data) => handleChangeUdM(row, data)}
      searchOpt={() => fnc_search_uom(row)}
      navFunction={() => navToUom(row.original.uom_id)}
    />
  )
}
