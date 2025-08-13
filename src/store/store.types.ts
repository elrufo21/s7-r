import { FormConfig, ListFilterItem, ListGByItem, ModulesEnum } from '@/shared/shared.types'
import { OptionsType } from '@/shared/ui/inputs/input.types'
import { GroupedItemsType } from '@/shared/components/view-types/viewTypes.types'
import { FormActionEnum, ViewTypeEnum } from '@/shared/shared.types'
import { ExpandedState, Row, Table } from '@tanstack/react-table'
import React, { ReactNode } from 'react'
import { Operation } from '@/modules/pos/context/CalculatorContext'

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
  dataFormShow?: any[]
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

  // sync loading state
  syncLoading: boolean
  setSyncLoading: (syncLoading: boolean) => void

  // nav
  viewType: ViewTypeEnum
  setViewType: (viewType: ViewTypeEnum) => void
  config: FormConfig
  setConfig: (config: FormConfig) => void
  listBreadcrumb: {
    title: string
    url: string
    viewType: ViewTypeEnum
    diary?: { title: string; value: number }
  }[]
  setListBreadcrumb: (
    listBreadcrumb: {
      title: string
      url: string
      viewType: ViewTypeEnum
      diary?: { title: string; value: number }
    }[]
  ) => void
  breadcrumb: {
    title: string
    url: string
    viewType: ViewTypeEnum
    diary?: { title: string; value: number }
    haveSecondaryList?: boolean
  }[]
  setBreadcrumb: (
    breadcrumb: {
      title: string
      url: string
      viewType: ViewTypeEnum
      diary?: { title: string; value: number }
      haveSecondaryList?: boolean
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
  stats: any[]
  setStats: (stats: any[]) => void
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
  aditionalFilters: any[]
  setAditionalFilters: (aditionalFilters: any) => void
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
  fullScreen?: boolean
  disableClose?: boolean
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
  fullScreen?: boolean
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
    fullScreen,
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
    PointsOfSaleSliceState,
    VKeyboardSliceState {}
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
interface Product {
  product_template_id: string
  product_id: string
  name: string
  size: string
  price: number
  category: string
  quantity?: number
  custom_price?: number
  cost?: number
  category_id?: string
  sale_price?: any
  uom_name?: string
  uom_id?: string
}
export interface BluetoothConfig {
  service_Uuid: string
  character_Uuid: string
  device_name: string
}
export interface PointsOfSaleSliceState {
  isWeightMode: boolean
  setIsWeightMode: (isWeightMode: boolean) => void
  bluetooth_config: BluetoothConfig
  setBluetoothConfig: (bluetooth_config: BluetoothConfig) => void
  device: any
  setDevice: (device: any) => void
  connected: boolean
  setConnected: (connected: boolean) => void
  weightValue: number
  setWeightValue: (weightValue: number) => void
  containers: any[]
  setContainers: (containers: any[]) => void
  orderSelected: { order_id: string; state: string } | null
  setOrderSelected: (orderSelected: { order_id: string; state: string } | null) => void
  total: number
  setTotal: (total: number) => void
  paidOrders: any[]
  setPaidOrders: (paidOrders: any[]) => void
  paymentMethods: any[]
  setPaymentMethods: (paymentMethods: any[]) => void
  defaultPosSessionData: {
    partner_id: number
    name: string
    currency_id?: number
  }
  setDefaultPosSessionData: (defaultPosSessionData: {
    partner_id: number
    name: string
    currency_id?: number
  }) => void
  backToProducts: boolean
  setBackToProducts: (backToProducts: boolean) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedNavbarMenu: string
  setSelectedNavbarMenu: (menu: string) => void
  filteredProducts: Product[]
  setFilteredProducts: (products: Product[]) => void
  filterProducts: () => void
  fetchProducts: () => Promise<void>
  displayValue: string
  setDisplayValue: (value: string) => void
  clearOnNextDigit: boolean
  setClearOnNextDigit: (clear: boolean) => void
  addDigit: (digit: string) => void
  clearDisplay: () => void
  handleChange: boolean
  setHandleChange: (handleChange: boolean) => void
  payments: any[]
  setPayments: (payments: any[]) => void
  addPaymentToOrder: (order_id: string, payment: any) => void
  updatePaymentInOrder: (order_id: string, updatedPayment: any) => void
  removePaymentFromOrder: (order_id: string, payment_id: string) => void
  setFinalCustomer: (finalCustomer: any) => void
  session_id: number | null
  setSessionId: (session_id: number | null) => void
  operation: Operation
  setOperation: (operation: Operation) => void
  screen: string
  setScreen: (screen: string) => void
  customers: any[]
  setCustomers: (customers: any[]) => void
  products: any[]
  setProducts: (product: any[]) => void
  cart: any[]
  setCart: (cart: any[]) => void
  orderCart: any[]
  setOrderCart: (orderCart: any[]) => void
  selectedOrder: string
  setSelectedOrder: (selectedOrder: string) => void
  setOrderData: (orderData: any[]) => void
  selectedItem: string | null
  setSelectedItem: (selectedItem: string | null) => void
  orderData: {
    order_id: string
    name: string
    lines: any[]
    state: string
    payments?: any[]
    pos_status?: string
    partner_id?: number
    partner_name?: string
    order_date?: Date
    invoice_state?: string
  }[]
  finalCustomer: any
  categories: any[]
  setCategories: (categories: any[]) => void
  addProductToOrder: (order_id: number | string, product: Product, new_quantity: number) => void
  addNewOrder: ({
    date,
    user_id,
    point_id,
    session_id,
    company_id,
    partner_id,
  }: {
    date: Date
    user_id: number
    point_id: number
    session_id: number
    company_id: number
    partner_id: number
  }) => void
  setProductQuantityInOrder: (
    order_id: number | string,
    product: string | number,
    exact_quantity: number
  ) => void
  setProductPriceInOrder: (
    order_id: number | string,
    product: string | number,
    new_price: number
  ) => void
  toggleProductQuantitySign: (order_id: number | string, product_id: string) => void
  toggleProductPriceSign: (order_id: number | string, product_id: string) => void
  getProductQuantityInOrder: (order_id: number | string, product: string | number) => number
  getProductTaraValue: (order_id: number | string, product_id: string | number) => number
  getProductTaraQuantity: (order_id: number | string, product_id: string | number) => number
  deleteProductInOrder: (order_id: number | string, product_id: string) => void
  getTotalPriceByOrder: (order_id: number | string) => number
  deleteOrder: (order_id: number | string) => void
  updateOrderFromServer: (updatedOrder: any) => void
  changeToPayment: (order_id: number | string) => void
  changeToPaymentLocal: (order_id: number | string) => void
  updateMoveId: (oldMoveId: string, newMoveId: string) => void

  // Nueva función para centralizar la carga
  initializePointOfSale: (pointId: string, isOnline: boolean) => Promise<void>

  // Funciones para cache en localStorage con namespace seguro
  getOrSetLocalStorage: <T>(key: string, fetchFn: () => Promise<T>) => Promise<T>
  clearPosCache: () => void
  getPosCacheInfo: () => Promise<Record<string, string>>
  forceReloadPosData: (pointId: string, isOnline: boolean) => Promise<void>
  refreshAllCache: () => Promise<void>
  setTaraValue: (order_id: string, product_id: string | number, taraValue: number) => void
  setTaraQuantity: (order_id: string, product_id: string | number, taraQuantity: number) => void
  calculateEffectiveQuantity: (
    base_quantity: number,
    taraValue: number,
    taraQuantity: number
  ) => number
  calculateTaraTotal: (taraValue: number, taraQuantity: number) => number
  getProductPrice: (product_id: string, selectedOrder: string) => number
}

export interface VKeyboardSliceState {
  vKeyboardOpen: boolean
  setVKeyboardOpen: (vKeyboardOpen: boolean) => void
  vKeyboardValue: string
  setVKeyboardValue: (vKeyboardValue: string) => void
  focusedInputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement> | null
  setFocusedInputRef: (
    focusedInputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement> | null
  ) => void
  focusedFieldOnChange: ((value: any) => void) | null
  setFocusedFieldOnChange: (fn: ((value: any) => void) | null) => void
}
