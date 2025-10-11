import { MouseEvent, ReactNode, useEffect } from 'react'
import Button from '@mui/material/Button'
import useAppStore from '@/store/app/appStore'
import { IoMdSettings } from 'react-icons/io'
import { RiInboxArchiveLine, RiInboxUnarchiveLine } from 'react-icons/ri'
import { HiOutlineDuplicate } from 'react-icons/hi'
import { BiExport } from 'react-icons/bi'
import { GrTrash } from 'react-icons/gr'
import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useState } from 'react'
import { HiMiniXMark } from 'react-icons/hi2'
import { downloadExcel } from '@/shared/utils/utils'
import { FormConfig, TypePermitionAction } from '@/shared/shared.types'
import { ActionTypeEnum } from '@/shared/shared.types'
import { useActionModule } from '@/shared/hooks/useModule'
import useUserStore from '@/store/persist/persistStore'
import { useParams } from 'react-router-dom'
import { SearchFiltersEnum } from '@/shared/components/navigation/navigation.types'
import { offlineCache } from '@/lib/offlineCache'

interface StyledMenuProps extends MenuProps {
  children?: ReactNode
}
const StyledMenu = styled((props: StyledMenuProps) => (
  <Menu
    {...props}
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}))

interface SelectRowsOptionsProps {
  config: FormConfig
}

export const SelectRowsOptions = ({ config }: SelectRowsOptionsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [canDelete, setCanDelete] = useState(false)
  const [canCreate, setCanCreate] = useState(false)

  useEffect(() => {
    const checkPermission = async (action: TypePermitionAction) => {
      const rs = await offlineCache.getPermissionById(`${config.form_id}-${action}`)
      switch (action) {
        case TypePermitionAction.DELETE:
          if (!rs) return setCanDelete(true)
          setCanDelete(rs?.value === true)
          break
        case TypePermitionAction.CREATE:
          if (!rs) return setCanCreate(true)
          setCanCreate(rs?.value === true)
          break
        default:
          break
      }
    }
    checkPermission(TypePermitionAction.DELETE)
    checkPermission(TypePermitionAction.CREATE)
  }, [config.form_id])
  const {
    rowSelection,
    setRowSelection,
    itemsPerPage,
    setAppDialog,
    totalItems,
    setSelectAllRows,
    selectAllRows,
  } = useAppStore((state) => state)
  const { filters, user } = useUserStore()
  const fnc_name = config.fnc_name
  const id_action = useParams()
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    permision(TypePermitionAction.DELETE)

    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const selectAll = () => {
    setSelectAllRows(true)
  }

  useEffect(() => {
    setSelectAllRows(itemsPerPage === rowSelection.length)
  }, [rowSelection])

  const handleOptions = async (action: ActionTypeEnum) => {
    handleClose()
    const idItems = Object.keys(rowSelection).filter((elem) => rowSelection[elem])
    if (action === ActionTypeEnum.EXPORT) {
      //const dataExport = gridData.filter((grid) => idItems.includes(String(grid.partner_id)))
      downloadExcel([])
    } else if (action === ActionTypeEnum.ARCHIVE) {
      setAppDialog({
        title: 'Confirmación',
        content: '¿Está seguro de que desea archivar todos los registros seleccionados?',
        open: true,
        handleConfirm: () => {
          handleOptions_execute(action, idItems)
        },
        textConfirm: 'Archivar',
        actions: true,
      })
    } else if (action === ActionTypeEnum.DELETE) {
      setAppDialog({
        title: 'Confirmación',
        content: '¿Está seguro de que desea eliminar todos los registros seleccionados?',
        open: true,
        handleConfirm: () => {
          handleOptions_execute(action, idItems)
        },
        textConfirm: 'Eliminar',
        actions: true,
      })
    } else {
      handleOptions_execute(action, idItems)
    }
  }

  const { mutate: actionModule, isPending } = useActionModule({
    filters: [...filters, ...(config?.aditionalFilters ? config.aditionalFilters : [])],
    module: config.module,
    fncName: fnc_name,
    id: id_action['*'] ?? '',
  })
  const handleOptions_execute = async (action: ActionTypeEnum, idItems: string[]) => {
    if (isPending) return

    const customFilters = [
      ...filters.filter(
        (elem) => [SearchFiltersEnum.GROUP_BY, SearchFiltersEnum.PAGINATION].indexOf(elem[1]) === -1
      ),
      [filters.length + 1, 'list_select_all'],
    ]
    actionModule(
      {
        action,
        filters: selectAllRows ? customFilters : idItems,
        fnc_name,
      },
      {
        onSuccess() {
          setRowSelection(() => ({}))
        },
        onError() {},
      }
    )
  }

  const permision = async (action: TypePermitionAction) => {
    const rs = await offlineCache.getPermissionById(`${config.form_id}-${action}`)
    if (rs.value) {
      return true
    } else {
      return false
    }
  }
  const options = [
    {
      title: 'Exportar',
      action: ActionTypeEnum.EXPORT,
      icon: <BiExport style={{ fontSize: '16px' }} />,
    },
    {
      title: 'Archivar',
      action: ActionTypeEnum.ARCHIVE,
      icon: <RiInboxArchiveLine style={{ fontSize: '16px' }} />,
    },
    {
      title: 'Desarchivar',
      action: ActionTypeEnum.UNARCHIVE,
      icon: <RiInboxUnarchiveLine style={{ fontSize: '16px' }} />,
    },
    {
      title: 'Duplicar',
      action: ActionTypeEnum.DUPLICATE,
      icon: <HiOutlineDuplicate style={{ fontSize: '16px' }} />,
    },
    {
      title: 'Eliminar',
      action: ActionTypeEnum.DELETE,
      icon: <GrTrash style={{ fontSize: '14px' }} />,
    },
  ].filter((opt) => {
    if (opt.action === ActionTypeEnum.DELETE) return canDelete
    if (opt.action === ActionTypeEnum.DUPLICATE) return canCreate
    return true
  })

  return (
    <div className="w-full flex mx-5 gap-3 justify-center">
      <div className="flex">
        <div className="i_list_selection_box">
          <span>{`${selectAllRows ? 'Todos' : ''}`}</span>
          <span className="font-bold">{`${selectAllRows ? totalItems : Object.values(rowSelection).filter((valor) => valor).length}`}</span>
          <span>seleccionado(s)</span>
          {!selectAllRows && itemsPerPage < totalItems && (
            <button className="i_list_select_domain" onClick={selectAll}>
              ➔ Seleccionar todos {`${totalItems}`}
            </button>
          )}
          <HiMiniXMark
            className="i_list_unselect_all"
            onClick={() => {
              setRowSelection(() => ({}))
              setSelectAllRows(false)
            }}
          />
        </div>
      </div>

      <div className="flex">
        <Button
          className="btn btn-secondary btn_2"
          startIcon={<IoMdSettings style={{ fontSize: '16px' }} />}
          onClick={handleClick}
        >
          Acciones
        </Button>

        <StyledMenu
          className="menuEx"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem key={option.title} onClick={() => handleOptions(option.action)}>
              <ListItemIcon>{option.icon}</ListItemIcon>
              <ListItemText>{option.title}</ListItemText>
            </MenuItem>
          ))}
        </StyledMenu>
      </div>
    </div>
  )
}
