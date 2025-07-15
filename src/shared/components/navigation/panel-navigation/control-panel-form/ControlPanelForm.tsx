import { useState, useEffect } from 'react'
import { useAppStore } from '@/store/app/appStore'
import Stack from '@mui/material/Stack'
import { IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { RiInboxArchiveLine, RiInboxUnarchiveLine } from 'react-icons/ri'
import { HiOutlineDuplicate } from 'react-icons/hi'
import { GrTrash } from 'react-icons/gr'

import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { FormActionEnum, ViewTypeEnum, FormConfig } from '@/shared/shared.types'
import { useLocation, useNavigate } from 'react-router-dom'
import { StyledMenu } from '@/shared/components/extras/StyledMenu'
import { PageCounterForm } from './PageCounterForm'

import StatsButtonBox from '@/shared/components/extras/StatsButtonBox'
import useUserStore from '@/store/persist/persistStore'
import { Breadcrumb } from '@/shared/ui/Breadcrumb/Breadcrumb'

// import { TbCloudCheck, TbCloudOff, TbSettings } from 'react-icons/tb'
import { /*TbCloudUp, TbCloudX, TbCloudOff,*/ TbSettings } from 'react-icons/tb'

//import { TbCloudUpload } from 'react-icons/tb'
//import { MdCancelPresentation } from 'react-icons/md'
//import { IoIosUndo } from 'react-icons/io'
//import { IoArrowUndoOutline } from 'react-icons/io5'
//import { IoCloseSharp } from 'react-icons/io5'
//import { TbCloud } from 'react-icons/tb' // bien
import { WiCloudUp } from 'react-icons/wi' // bien +++
//import { LiaCloudUploadAltSolid } from 'react-icons/lia'

//import { IoIosClose } from 'react-icons/io'

//import { WiCloudRefresh } from 'react-icons/wi'
//import { MdOutlineCloudOff } from 'react-icons/md'
import { MdCloudOff } from 'react-icons/md'
//import { MdCloudQueue } from 'react-icons/md'
//import { useForm } from 'react-hook-form'
//import { StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'

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
    setListBreadcrumb,
    setBreadcrumb,
    breadcrumb,
    stats,
    setStats,
  } = useAppStore((state) => state)
  const { setAditionalFilters, aditionalFilters, filters, setFilters } = useUserStore()
  const {
    grid: { idRow },
  } = config
  const store = useAppStore()
  // Estado local para mantener la última versión válida del formItem
  const [lastValidFormItem, setLastValidFormItem] = useState(formItem)

  // Actualizar el estado local cuando formItem cambia y tiene un ID válido
  useEffect(() => {
    if (formItem && formItem[idRow]) {
      setLastValidFormItem(formItem)
    }
  }, [formItem, idRow])

  // Usar lastValidFormItem para renderizar los elementos de la i nterfaz
  // durante la carga de un nuevo registro
  const displayItem = frmLoading && !formItem?.[idRow] ? lastValidFormItem : formItem

  const handleDelete = () => {
    setAppDialog({
      title: '¡Adios Registro!',
      content: '¿Está seguro que desea eliminar este registro?',
      open: true,
      handleConfirm: async () => await DeleteRow(),
      actions: true,
    })
  }
  const buttonContext = {
    navigate,
    formItem,
    store,
    pathname,
    config,
    setAditionalFilters,
    aditionalFilters,
    filters,
    setFilters,
    setListBreadcrumb,
    setBreadcrumb,
    breadcrumb,
    setFrmAction,
  }
  const enrichButtons = (buttons: any[]) => {
    return buttons?.map((button) => ({
      ...button,
      onClick: () => {
        if (typeof button.onClick === 'function') {
          // Si ya tiene onClick, lo ejecuta con contexto
          button.onClick(buttonContext)
        }
      },
    }))
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
    if (config?.skipValidation) {
      setFrmAction(FormActionEnum.SAVE_DRAFT)
    } else {
      setFrmAction(FormActionEnum.PRE_SAVE)
    }

    setTableData([])
    setFrmIsChangedItem(false)
  }

  const handleBtnNew = async () => {
    setFormItem(config.default_values)
    setStats([])
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

  /*const handlePayment = () => {
    setBreadcrumb([
      {
        title: formItem?.name,
        url: pathname,
        viewType: ViewTypeEnum.LIST,
      },
    ])
    navigate('/action/742/detail/new')
  }*/

  return (
    // <div className="o_control_panel_main d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-lg-start gap-2 gap-lg-3 flex-grow-1">
    <div className="o_control_panel_main d-flex flex-wrap flex-lg-nowrap justify-content-between gap-2 gap-lg-3 flex-grow-1">
      <div className="o_control_panel_breadcrumbs d-flex align-items-center gap-1 order-0 h-lg-100">
        <div className="o_control_panel_main_buttons d-flex gap-1 d-empty-none d-print-none">
          <div className="d-inline-flex gap-1">
            {config.new_url && (
              <button className="btn btn-primary mr-[5px]" onClick={handleBtnNew}>
                Nuevo
              </button>
            )}
          </div>
        </div>

        <div className="ls_breadcrumb">
          <Breadcrumb />

          <div className="d-flex gap-1 text-truncate pt-[5px]">
            <div className="o_last_breadcrumb_item active d-flex gap-2 align-items-center min-w-0 lh-sm">
              <span className="min-w-0 mr-[2px] text-truncate">
                {pathname.includes('/new') ? (
                  'Nuevo'
                ) : displayItem?.[config.dsc_view] !== '' ? (
                  displayItem?.[config.dsc_view]
                ) : (
                  <span className="italic pr-px text-amber-700">Sin nombre</span>
                )}
              </span>
            </div>

            <div className="o_control_panel_breadcrumbs_actions d-inline-flex d-print-none">
              <div className="o_cp_action_menus d-flex align-items-center gap-1">
                <div className="lh-1">
                  <Stack className="grow" direction="row">
                    <>
                      <Tooltip arrow title="Acciones">
                        <IconButton
                          className="button_action actions"
                          disableRipple={true}
                          disabled={frmLoading}
                          onClick={(event) => {
                            setAnchorEl(event.currentTarget)
                          }}
                        >
                          <TbSettings style={{ fontSize: '19.5px' }} />
                        </IconButton>
                      </Tooltip>

                      <StyledMenu
                        className="menuEx"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                      >
                        <div>
                          {displayItem?.state === 'A' && (
                            <MenuItem onClick={handleChangeStatus}>
                              <ListItemIcon>
                                <RiInboxArchiveLine style={{ fontSize: '16px' }} />
                              </ListItemIcon>
                              <ListItemText>Archivar</ListItemText>
                            </MenuItem>
                          )}

                          {displayItem?.state === 'I' && (
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

                    {!pathname.includes('/new') && displayItem?.[idRow] && (
                      <Tooltip arrow title="Eliminar registro">
                        <IconButton
                          className="hover:text-red-400 button_action delete"
                          disableRipple={true}
                          disabled={frmLoading}
                          onClick={handleDelete}
                        >
                          <div style={{ paddingTop: '2.5px' }}>
                            <GrTrash style={{ fontSize: '16px' }} />
                          </div>
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ls_form_status_indicator">
          <div className="ls_form_status_indicator_buttons">
            <Stack className="grow" direction="row">
              {/*((frmState === "n" && permissions.opt_2) || (frmState === "e" && permissions.opt_3)) && (*/}
              <>
                {(frmIsChanged || frmIsChangedItem) && (
                  <>
                    <Tooltip arrow title="Guardar cambios">
                      <IconButton
                        className="button_action save"
                        disableRipple={true}
                        disabled={frmLoading}
                        onClick={handleBtnSave}
                      >
                        <div style={{ paddingTop: '1px' }}>
                          {/* <MdCloudQueue style={{ fontSize: '22px' }} /> */}
                          <WiCloudUp style={{ fontSize: '32px' }} />
                          {/* <LiaCloudUploadAltSolid style={{ fontSize: '28px' }} /> */}
                        </div>
                      </IconButton>
                    </Tooltip>

                    <Tooltip arrow title="Descartar cambios">
                      <IconButton
                        className="button_action undo"
                        disableRipple={true}
                        disabled={frmLoading}
                        onClick={handleBtnUndo}
                      >
                        <div style={{ paddingTop: '1px' }}>
                          <MdCloudOff style={{ fontSize: '23px' }} />
                        </div>
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </>
            </Stack>
          </div>
        </div>

        <div className="me-auto"></div>
      </div>

      {config?.formButtons && stats?.length > 0 && (
        <div className="o_control_panel_actions d-flex align-items-center justify-content-start justify-content-lg-around order-2 order-lg-1 w-100 mw-100 w-lg-auto">
          <div className="ls-form-buttonbox d-print-none position-relative d-flex w-md-auto o_full w-100">
            <StatsButtonBox statsData={enrichButtons(config.formButtons)} />
          </div>
        </div>
      )}

      <div className="o_control_panel_navigation order-1 order-lg-2">
        <div className="o_cp_pager text-nowrap d-flex">
          <PageCounterForm />
        </div>
      </div>
    </div>
  )
}

export default ControlPanelForm
