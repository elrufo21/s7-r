import { FormConfig, ListFilterItem, ListGByItem, ModulesEnum } from '@/shared/shared.types'
import { OptionsType } from '@/shared/ui/inputs/input.types'
import { GroupedItemsType } from '@/shared/components/view-types/viewTypes.types'
import { FormActionEnum, ViewTypeEnum } from '@/shared/shared.types'
import { ExpandedState, Row, Table } from '@tanstack/react-table'
import { ReactNode } from 'react'

interface DialogProps {
  title: string
  content: string | ReactNode
  open: boolean
  handleConfirm?: () => Promise<void> | void
  handleCancel?: () => void
  actions: boolean
  textConfirm?: string
  isForm?: boolean
  listSearch?: any
}

export interface AppRoutesProps {
  number?: number
  name: string
  path: string
  viewType?: ViewTypeEnum
  list?: any
  index?: number
}

export interface DataResponse {
  oj_info: Record<string, any>
  oj_data: any
  oj_gby_data: Record<string, any>[] | null
  oj_audit: Record<string, any>[] | null
}
export interface PreviousDataBeforeMenu {
  formItem: any
  breadcrumb: any[] | null
  url: string | null
}

export interface AppSliceState {
  dinamicModule: ModulesEnum
  setDinamicModule: (dinamicModule: ModulesEnum) => void
  changeFavoriteId: number | null
  setChangeFavoriteId: (changeFavoriteId: number | null) => void
  canChangeGroupBy: boolean
  setCanChangeGroupBy: (canChangeGroupBy: boolean) => void
  groupedParentRow: Row<GroupedItemsType>
  previousDataBeforeMenu: PreviousDataBeforeMenu
  setPreviousDataBeforeMenu: (data: PreviousDataBeforeMenu) => void

  setGroupedParentRow: (groupedParentRow: Row<GroupedItemsType>) => void

  defaultCompany: any
  setDefaultCompany: (defaultCompany: any) => void
  usersEmpSelected: any
  setUsersEmpSelected: (usersEmpSelected: any) => void
  settingsBreadcrumb: boolean
  setSettingsBreadcrumb: (settingsBreadcrumb: boolean) => void
  hiddenTabs: string[]
  setHiddenTabs: (hiddenTabs: string[]) => void
  selectAllRows: boolean
  setSelectAllRows: (selectAllRows: boolean) => void
  listViewData: any[]
  setListViewData: (listViewData: any[]) => void
  totalItems: number
  viewTypeFromConfig: boolean
  setViewTypeFromConfig: (viewTypeFromConfig: boolean) => void
  openModal: boolean
  setOpenModal: (openModal: boolean) => void
  tabForm: number
  setTabForm: (tabForm: number) => void
  filtersLocal: any[]
  setFiltersLocal: (filters: any) => void
  prevFilters: any[]
  setPrevFilters: (prevFilters: any[]) => void
  appDialog: DialogProps
  setAppDialog: (dialog: DialogProps) => void
  appDialogsContent: any[]
  setAppDialogsContent: (appDialogsContent: any[]) => void
  appShowPrevView: boolean
  setAppShowPrevView: (value: boolean) => void

  // nav
  viewType: ViewTypeEnum
  setViewType: (viewType: ViewTypeEnum) => void
  config: FormConfig
  setConfig: (config: FormConfig) => void
  breadcrumb: {
    title: string
    url: string
    viewType: ViewTypeEnum
  }[]
  setBreadcrumb: (
    breadcrumb: {
      title: string
      url: string
      viewType: ViewTypeEnum
    }[]
  ) => void

  dataFormShow: Record<string, any>[]
  setDataFormShow: (dataFormShow: any) => void
  dataKanbanShow: { dataShow: any[]; totalPages: number; dataLength: number; counterPage: any }
  dataListShow: { dataShow: any[]; totalPages: number; dataLength: number; counterPage: any }
  setDataListShow: (dataListShow: any) => void
  setDataKanbanShow: (dataKanbanShow: any) => void
  setInitialData: (dataShow: { data?: any[]; total: number }) => void
  groupByData: Record<string, any>[]
  setGroupByData: (groupByData: Record<string, any>[]) => void
  expandedData: ExpandedState
  setExpandedData: (expandedData: ExpandedState) => void

  searchFiltersLabel: any[]
  setSearchFiltersLabel: (searchFiltersLabel: any[]) => void
  actualCurrentPage: number
  setActualCurrentPage: (actualCurrentPage: number) => void
  columnsVisibility: Record<string, Record<string, boolean>>
  setColumnsVisibility: (columVisibility: Record<string, Record<string, boolean>>) => void
}

export interface GridSliceState {
  gridError: Error | null
  itemsPerPage: number
  rowSelection: Record<string, any>
  kanbanCurrentPage: number
  table: Table<any> | null
  listCurrentPage: number
  listGroupBy: ListGByItem[]
  listFilterBy: ListFilterItem[]
  //set
  setItemsPerPage: (itemsPerPage: number) => void
  setRowSelection: (fn: any, selectAll?: boolean, listGrouped?: any[]) => void
  setKanbanCurrentPage: (page: number) => void
  setTable: (table: Table<any>) => void
  setListCurrentPage: (page: number) => void
  setListGroupBy: (data: ListGByItem[]) => void
  setListFilterBy: (data: ListFilterItem[]) => void
}

export interface DataSliceState {
  dataError: Error | null
  location: Location
  attributes: any[]
  setAttributes: (attributes: any[]) => void
  values: any[]
  setValues: (values: any[]) => void
  tableData: any[]
  setTableData: (tableData: any[]) => void
  createOptions: (params: {
    fnc_name: string
    filters?: Record<string, any>[] | string[]
    action?: string
  }) => Promise<OptionsType[]>
  executeFnc: (fnc_name: string, action: string, params: any) => Promise<DataResponse>
}

export interface FrmSliceState {
  frmError: Error | null
  frmLoading: boolean
  frmIsChanged: boolean
  frmIsChangedItem: boolean
  setFormItem: (formItem: any, formIsChanged?: boolean) => void
  formItem: any
  frmConfigControls: any
  frmAction: FormActionEnum
  frmCreater: (fnc_name: string, data: any, idfield: any, callback: any) => Promise<void>
  //set
  setFrmLoading: (frmloading: any) => void
  setFrmIsChangedItem: (frmIsChangedItem: any) => void
  setFrmIsChanged: (frmIsChanged: any) => void
  setFrmItemSelected: (
    config: any,
    toDialog?: boolean,
    updateFromSubItems?: boolean,
    data?: any,
    updateFromOriginal?: boolean
  ) => Promise<void | DataResponse>
  setFrmConfigControls: (frmConfigControls: any) => void
  setFrmAction: (frmAction: FormActionEnum) => void
  formsBranches: any[]
  setFormsBranches: (formsBranches: any[]) => void
}

export interface FiltersSliceState {
  filters: any[]
  setFilters: (filters: any[], actualCurrentPage: number) => void
}

export interface UserSliceState {
  user: any
  setUserSession: (user: any) => void
  userData: any
  userError: any
  userCiaEmp: any
  companies: any[]
  setCompanies: (companies: any[]) => void
  setUserData: () => void
  changeEmpPred: (idemp: any) => void
}
export interface ButtonProps {
  text: string
  onClick: () => void
  type: 'confirm' | 'cancel'
  className?: string
}
export interface OpenDialogProps {
  dialogContent: any
  title: string
  buttons?: ButtonProps[]
  parentId?: string
  btnCreate?: boolean
  btnDiscard?: boolean
  contactModal?: boolean
  customHeader?: any
}
export interface NewAppDialogProps {
  id: string
  parentId: string | null
  open: boolean
  title: string
  content: (closeDialogWithData: any) => any
  buttons: ButtonProps[]
  childData?: any
  btnCreate?: boolean
  btnDiscard?: boolean
  contactModal?: boolean
  customHeader?: any
}
export interface DialogSliceState {
  newAppDialogs: NewAppDialogProps[]
  setNewAppDialogs: (newAppDialogs: NewAppDialogProps[]) => void
  modalData: any[]
  setModalData: (modalData: any[]) => void
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  openDialog: ({
    dialogContent,
    title,
    buttons,
    parentId,
    btnCreate,
    btnDiscard,
    contactModal,
    customHeader,
  }: OpenDialogProps) => string
  closeDialogWithData: (dialogId: string, data: any, key?: string) => void
  frmDialogAction: any
  setFrmDialogAction: (frmDialogAction: any) => void
  frmDialogLoading: boolean
  setFrmDialogLoading: (frmDialogLoading: boolean) => void
  frmDialogItem: any
  setFrmDialogItem: (frmDialogItem: any) => void
}

export interface AppStoreProps
  extends AppSliceState,
    GridSliceState,
    DataSliceState,
    FrmSliceState,
    DialogSliceState,
    PointsOfSaleSliceState {}
export interface UserStoreProps extends UserSliceState, FiltersSliceState {}

export interface CreateOptionsParams {
  fnc_name: string
  label: string
  value: string
  filters?: Filter[]
  action?: string
}
interface Location {
  departamentos: Option[]
  provincias: Option[]
  distritos: Option[]
  paises: Option[]
}

interface Option {
  label: string
  value: any
}
export interface Filter {
  exclude: boolean
  filterBy: string
  filterValue: any
  fcol: string
}

export type ToastStatus = 'success' | 'error' | 'info' | 'warning' | 'loading'

export type SetState<T> = (
  partial: T | Partial<T> | ((state: T) => T | Partial<T>),
  replace?: boolean,
  action?: string
) => void

export interface PointsOfSaleSliceState {
  cart: any[]
  setCart: (cart: any[]) => void
  orderCart: any[]
  setOrderCart: (orderCart: any[]) => void
  selectedOrder: string
  selectedItem: string | null
  orderData: any[]
  finalCustomer: any
}
