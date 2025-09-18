import { useAppStore } from '@/store/app/appStore'
import Stack from '@mui/material/Stack'
import { IconButton } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'
import { TbSettings } from 'react-icons/tb'
import { SelectRowsOptions } from './components/SelectRowsOptions'

import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { BiImport, BiExport } from 'react-icons/bi'
import { ViewTypeIcons } from './components/ViewTypeIcons'
import { PageCounterList } from './components/PageCounterList'
import { PageCounterKanban } from './components/PageCounterKanban'
import { SearchInput } from './components/SearchInput'
import { ViewTypeEnum } from '@/shared/shared.types'
import { MouseEvent, ReactNode, useState } from 'react'
import { FormConfig } from '@/shared/shared.types'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/persist/persistStore'
import { Breadcrumb } from '@/shared/ui/Breadcrumb/Breadcrumb'

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

type FrmWebOptionsProps = {
  config: FormConfig
  viewType: ViewTypeEnum
}

const ControlPanel = ({ config, viewType }: FrmWebOptionsProps) => {
  const navigate = useNavigate()

  const { rowSelection, setViewType, dataKanbanShow, setFormItem, dataListShow, setDataFormShow } =
    useAppStore()

  const { filters, setFilters } = useUserStore()

  const {
    filtersLocal,
    setFiltersLocal,
    searchFiltersLabel,
    setSearchFiltersLabel,
    listFilterBy,
    setListGroupBy,
    setListFilterBy,
    actualCurrentPage,
    setExpandedData,
    setPrevFilters,
    prevFilters,
    setActualCurrentPage,
    setKanbanCurrentPage,
    setListCurrentPage,
    listCurrentPage,
    setGroupByData,
    listGroupBy,
    setListViewData,
    dataListShow: { counterPage, totalPages },
    breadcrumb,
  } = useAppStore()
  const views = config.views
  const changeView = (view: ViewTypeEnum) => {
    if (view) {
      setViewType(view)
    }
  }

  const handleBtnNew = () => {
    setFormItem(config.default_values)
    setDataFormShow([])
    navigate(config.new_url)
  }

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div className="o_control_panel_main d-flex flex-wrap flex-lg-nowrap justify-content-between align-items-lg-start gap-3 flex-grow-1">
      <div className="o_control_panel_breadcrumbs d-flex align-items-center gap-3 order-0 h-lg-100">
        {!!config.new_url && (
          <div className="o_control_panel_main_buttons d-flex gap-1 d-empty-none d-print-none">
            <div className="d-xl-inline-flex gap-1">
              {config.item_url !== null && (
                <div className="flex items-center">
                  <button className="btn btn-primary" onClick={handleBtnNew}>
                    Nuevo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="o_breadcrumb d-flex gap-1 text-truncate">
          <div className="o_last_breadcrumb_item active d-flex fs-4 min-w-0 align-items-center">
            <div className="text-gray-800 text-base text-truncate" style={{ marginBottom: '1px' }}>
              {breadcrumb.find((item) => item.haveSecondaryList) && <Breadcrumb />}
              {config.title}
            </div>
          </div>

          <div className="o_control_panel_breadcrumbs_actions d-inline-flex">
            <Stack className="grow" direction="row">
              <Tooltip arrow title="Acciones">
                <IconButton onClick={handleClick}>
                  <TbSettings style={{ fontSize: '20px' }} />
                </IconButton>
              </Tooltip>

              <StyledMenu className="menuEx" anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem>
                  <ListItemIcon>
                    <BiImport style={{ fontSize: '16px' }} />
                  </ListItemIcon>
                  <ListItemText>Importar registros</ListItemText>
                </MenuItem>

                {viewType === ViewTypeEnum.LIST && (
                  <MenuItem onClick={handleClose}>
                    <ListItemIcon>
                      <BiExport style={{ fontSize: '16px' }} />
                    </ListItemIcon>
                    <ListItemText>Exportar todo</ListItemText>
                  </MenuItem>
                )}
              </StyledMenu>
            </Stack>
          </div>
        </div>
      </div>

      <div className="o_control_panel_actions d-empty-none d-flex align-items-center justify-content-start justify-content-lg-around order-2 order-lg-1 w-100 w-lg-auto self-center">
        {ViewTypeEnum.LIST && Object.values(rowSelection).filter((valor) => valor).length > 0 ? (
          <SelectRowsOptions config={config} />
        ) : (
          <SearchInput
            config={config}
            setFilters={setFilters}
            filtersLocal={filtersLocal}
            setFiltersLocal={setFiltersLocal}
            searchFiltersLabel={searchFiltersLabel}
            setSearchFiltersLabel={setSearchFiltersLabel}
            listFilterBy={listFilterBy}
            setListGroupBy={setListGroupBy}
            setListFilterBy={setListFilterBy}
            actualCurrentPage={actualCurrentPage}
            setExpandedData={setExpandedData}
            setPrevFilters={setPrevFilters}
            prevFilters={prevFilters}
            setActualCurrentPage={setActualCurrentPage}
            setKanbanCurrentPage={setKanbanCurrentPage}
            setListCurrentPage={setListCurrentPage}
            setGroupByData={setGroupByData}
            listGroupBy={listGroupBy}
            setListViewData={setListViewData}
            setViewType={setViewType}
          />
        )}
      </div>

      <div
        className={`o_control_panel_navigation flex-md-nowrap order-1 order-lg-2 flex-grow-1 h-lg-100 ${config?.views?.length > 1 ? 'gap-3 gap-lg-1 gap-xl-3' : ''}`}
      >
        <div role="search" className="o_cp_pager text-nowrap">
          <nav className="o_pager d-flex gap-2 h-100">
            {(!!dataKanbanShow.dataLength || !!dataListShow.dataLength) && (
              <Stack direction="row" className={`${views?.length > 1 && 'ml-2'}`}>
                {viewType === ViewTypeEnum.LIST && (
                  <PageCounterList
                    counterPage={counterPage}
                    totalPages={totalPages}
                    listCurrentPage={listCurrentPage}
                    setListCurrentPage={setListCurrentPage}
                    actualCurrentPage={actualCurrentPage}
                    setActualCurrentPage={setActualCurrentPage}
                    filters={filters}
                    setFilters={setFilters}
                  />
                )}
                {viewType === ViewTypeEnum.KANBAN && <PageCounterKanban />}
              </Stack>
            )}
          </nav>
        </div>

        <nav className="o_cp_switch_buttons d-print-none d-xl-inline-flex btn-group">
          {views?.length > 1 && (
            <ViewTypeIcons listViews={views} viewType={viewType} changeView={changeView} />
          )}
        </nav>
      </div>
    </div>
  )
}

export default ControlPanel
