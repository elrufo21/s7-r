import { useState } from 'react'
import { useAppStore } from '@/store/app/appStore'
import Stack from '@mui/material/Stack'
import { IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { TbCloudCheck, TbCloudOff, TbSettings } from 'react-icons/tb'
import { RiInboxArchiveLine, RiInboxUnarchiveLine } from 'react-icons/ri'
import { HiOutlineDuplicate } from 'react-icons/hi'
import { GrTrash } from 'react-icons/gr'

import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { FormActionEnum, ViewTypeEnum, FormConfig } from '@/shared/shared.types'
import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb } from '@/shared/ui/Breadcrumb/Breadcrumb'
import { StyledMenu } from '@/shared/components/extras/StyledMenu'
import { PageCounterForm } from './PageCounterForm'

type ControlPanelFormProps = {
  config: FormConfig
  viewType?: ViewTypeEnum
}

const ControlPanelForm = ({ config }: ControlPanelFormProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    frmLoading,
    setFrmLoading,
    frmIsChanged,
    setFrmIsChanged,
    frmIsChangedItem,
    setFrmIsChangedItem,
    formItem,
    setAppDialog,
    setFrmAction,
    setFormItem,
    setViewType,
    setTableData,
  } = useAppStore((state) => state)
  const {
    grid: { idRow },
  } = config

  const handleDelete = () => {
    setAppDialog({
      title: '¡Adios Registro!',
      content: '¿Está seguro que desea eliminar este registro?',
      open: true,
      handleConfirm: async () => await DeleteRow(),
      actions: true,
    })
  }
  const handleDuplicate = () => {
    handleClose()
    setTableData([])
    setFrmAction(FormActionEnum.REPLICATE)
  }

  const handleChangeStatus = () => {
    handleClose()
    setTableData([])
    setFrmAction(FormActionEnum.UPDATE_STATE)
  }

  const DeleteRow = async () => {
    setFrmLoading(true)
    setTableData([])
    setFrmAction(FormActionEnum.DELETE)
  }

  const handleBtnSave = () => {
    setFrmLoading(true)
    setFrmAction(FormActionEnum.PRE_SAVE)
    setTableData([])
    setFrmIsChangedItem(false)
  }

  const handleBtnNew = async () => {
    setFormItem(config.default_values)
    setTableData([])
    navigate(config.new_url)
  }

  const handleBtnUndo = () => {
    if (pathname.includes('/new')) {
      setViewType(config.view_default)
      return navigate(config.module_url)
    }
    setFrmAction(FormActionEnum.UNDO)
    setTableData([])
    setFrmIsChangedItem(false)
    setFrmIsChanged(false)
  }

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <div className="w-full flex gap-3 items-center">
      <div className="flex items-center">
        <button className="btn btn-primary" onClick={handleBtnNew}>
          Nuevo
        </button>
      </div>

      <div className="w-1/3">
        <div className="flex items-center c_NavMenuListEx">
          <Breadcrumb />
        </div>

        <div className="flex items-center">
          <div className="mt-1 mr-1 text-truncate" style={{ maxWidth: '300px' }}>
            {pathname.includes('/new')
              ? 'Nuevo'
              : ((formItem?.[config.dsc_view] !== '' ? (
                  formItem?.[config.dsc_view]
                ) : (
                  <span className="italic pr-px text-amber-700">Sin nombre</span>
                )) ?? 'Sin nombre')}
          </div>

          <Stack className="grow" direction="row">
            <>
              <Tooltip arrow title="Acciones">
                <IconButton
                  disabled={frmLoading}
                  onClick={(event) => {
                    setAnchorEl(event.currentTarget)
                  }}
                >
                  <TbSettings style={{ fontSize: '20px' }} />
                </IconButton>
              </Tooltip>

              <StyledMenu className="menuEx" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <div>
                  {formItem?.state === 'A' && (
                    <MenuItem onClick={handleChangeStatus}>
                      <ListItemIcon>
                        <RiInboxArchiveLine style={{ fontSize: '16px' }} />
                      </ListItemIcon>
                      <ListItemText>Archivar</ListItemText>
                    </MenuItem>
                  )}

                  {formItem?.state === 'I' && (
                    <MenuItem onClick={handleChangeStatus}>
                      <ListItemIcon>
                        <RiInboxUnarchiveLine style={{ fontSize: '16px' }} />
                      </ListItemIcon>
                      <ListItemText>Desarchivar</ListItemText>
                    </MenuItem>
                  )}
                </div>
                {!pathname.includes('/new') && (
                  <MenuItem onClick={handleDuplicate}>
                    <ListItemIcon>
                      <HiOutlineDuplicate style={{ fontSize: '16px' }} />
                    </ListItemIcon>
                    <ListItemText>Duplicar</ListItemText>
                  </MenuItem>
                )}
              </StyledMenu>
            </>
            {!pathname.includes('/new') && formItem?.[idRow] ? (
              <Tooltip arrow title="Eliminar registro">
                <IconButton
                  style={{ width: '34px', height: '34px' }}
                  disabled={frmLoading}
                  onClick={handleDelete}
                >
                  <div style={{ paddingTop: '2.5px' }}>
                    <GrTrash style={{ fontSize: '16px' }} />
                  </div>
                </IconButton>
              </Tooltip>
            ) : (
              <></>
            )}

            {/*((frmState === "n" && permissions.opt_2) || (frmState === "e" && permissions.opt_3)) && (*/}
            <>
              {(frmIsChanged || frmIsChangedItem) && (
                <>
                  <Tooltip arrow title="Guardar cambios">
                    <IconButton
                      style={{
                        width: '34px',
                        height: '34px',
                        marginLeft: '4px',
                        paddingTop: '9px',
                      }}
                      disabled={frmLoading}
                      onClick={handleBtnSave}
                    >
                      <div style={{ paddingTop: '1px' }}>
                        <TbCloudCheck style={{ fontSize: '22px' }} />
                      </div>
                    </IconButton>
                  </Tooltip>

                  <Tooltip arrow title="Descartar cambios">
                    <IconButton
                      style={{
                        width: '34px',
                        height: '34px',
                        marginLeft: '2px',
                      }}
                      disabled={frmLoading}
                      onClick={handleBtnUndo}
                    >
                      <div style={{ paddingTop: '2px' }}>
                        <TbCloudOff style={{ fontSize: '20px' }} />
                      </div>
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </>
            {/*)*/}
          </Stack>
        </div>
      </div>

      <div className="w-1/3"></div>

      <div className="w-1/3 flex justify-end">
        <PageCounterForm />
      </div>
    </div>
  )
}

export default ControlPanelForm
