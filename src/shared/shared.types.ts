import { ReactNode } from 'react'
import { UseFormWatch } from 'react-hook-form'
import { RibbonConfig } from './components/form/bars/RibbonRender'

export enum ViewTypeEnum {
  BASE = '',
  KANBAN = 'kanban',
  LIST = 'list',
  DRAGLIST = 'draglist',
  FORM = 'form',
  LIBRE = 'libre',
}

export interface CompanyProps {
  zip: string | null
  nif: string | null
  website: string | null
  phone: string | null
  street: string
  email: string
  mobile: string | null
  street_2: string
  company_id: number
  partner_id: number
  location_sl3_id: number
  location_sl1_id: number
  location_sl2_id: number
  children: '' | null
  state: string
  company_name: string
  location_sl3_name: string
  location_l3_name: string
  location_sl2_name: string
  location_country_id: number
  cod_tdir: null
  files: null
  location_country_name: string
}

export enum ItemStatusTypeEnum {
  ACTIVE = 'A',
  INACTIVE = 'I',
}

export enum ActionTypeEnum {
  BASE = '',
  CREATE = 'c',
  INSERT = 'i',
  UPDATE = 'u',
  DELETE = 'd',
  EXPORT = 'export',
  ARCHIVE = 'sa',
  UNARCHIVE = 'sd',
  DUPLICATE = 'r',
  UPDATE_STATUS = 'us',
}

export enum ConfigType {
  MODAL = 'modal',
  KANBAN = 'kanban',
}

export interface Ubigeo {
  location_sl2_id: string
  location_sl3_id: string
  location_country_id: string
}

export enum ButtonOptions {
  SAVE_AND_CLOSE = 'save-and-close',
  SAVE_AND_CREATE = 'save-and-create',
  SAVE = 'save',
  CLOSE = 'close',
  DISCARD = 'discard',
  DELETE = 'delete',
  SELECT = 'select',
  NEW = 'new',
}

export interface Dialog {
  title: string
  open: boolean
  type: string
  buttonActions: string[]
  onConfirm?: (dialog: Dialog, createOne: boolean, fncClose?: () => void) => void
  onDelete?: () => void
  handleSelectOptions?: (dialog: Dialog, text: ButtonOptions) => void
}

export enum FormActionEnum {
  PRE_SAVE = 'ps',
  UPDATE_STATE = 'us',
  UNDO = 'u',
  DELETE = 'd',
  REPLICATE = 'r',
  UPDATE_FAVORITE = 'uf',
  BASE = '',
  SAVE_DRAFT = 'sd',
}

type Sublista = [number, string, string[], string, string]

export type FiltersDataType = Sublista[]

export type FiltersOptionType = {
  column: string
  value: string | number
}

export enum ModulesEnum {
  BASE = '',
  CONTACTS = 'contacts',
  INVENTORY = 'inventory',
  SALES = 'sales',
  INVOICING = 'invoicing',
  SETTINGS = 'settings',
  ACTION = 'action',
  POINTS_OF_SALE = 'points-of-sale',
  POS = 'pos',
  POINTS_OF_SALE_MEAT = 'points-of-sale-meat',
  POINTS_OF_SALE_PG = 'points-of-sale-pg',
}

export type ListGByItem = {
  title: string
  key: string
  key_gby: string
}
export type ListFilterItem = {
  group: string
  key: string
  key_db?: string
  title: string
  value: string
  type: string
  default?: boolean
}
export type ListInputItem = {
  dsc: string
  key: string
  default: boolean
}

export type FormConfig = {
  form_id?: number | string
  aditionalFilters?: any[]
  fieldLabels?: Record<string, string>
  fnc_name: string
  type_config?: ConfigType
  module: ModulesEnum
  module_url: string
  title: string
  dsc?: string
  dsc_view: string
  views: ViewTypeEnum[]
  view_default: ViewTypeEnum
  form?: any
  no_content_title?: string
  no_content_dsc?: string
  item_url: string
  new_url: string
  isFavoriteColumn?: boolean
  formTitle?: string
  formButtons?: any
  skipValidation?: boolean
  ribbonList?: RibbonConfig

  fnc_valid: (data: any, formItem?: any) => any

  default_values: any

  grid: {
    idRow: string
    col_name?: string
    isDragable?: boolean
    idRow_db?: string
    list?: {
      columns: any
    }
    kanban?: any
    totalColumns?: string[]
  }

  filters: Array<{
    group?: string
    title?: string
    collapsible?: boolean
    list: Array<ListFilterItem>
  }>

  group_by?: Array<{
    list: Array<ListGByItem>
  }>

  filters_columns: Array<ListInputItem>
  visibility_columns: Record<string, boolean>

  configControls?: Record<string, any>

  form_inputs: {
    imagenFields: string[]
    auditoria: boolean
    preserveTagPlaceholder?: boolean
    frm_middle_width?: string

    frm_photo?: (props: frmElementsProps) => ReactNode
    frm_top_title?: (props: frmElementsProps) => ReactNode
    frm_title?: (props: frmElementsProps) => ReactNode
    frm_sub_title?: (props: frmElementsProps) => ReactNode
    frm_middle?: (props: frmElementsProps) => ReactNode
    frm_middle_right?: (props: frmElementsProps) => ReactNode
    frm_middle_bottom?: (props: frmElementsProps) => ReactNode
    frm_bar_buttons?: (props: frmElementsProps) => ReactNode
    frm_bar_status?: (props: frmElementsProps) => ReactNode
    frm_star?: (props: frmElementsProps) => ReactNode

    tabs?: Array<TabProp>
  }

  statusBarConfig?: {
    visibleStates?: Array<{
      state: string | string[]
      label: string
    }>
    allStates?: Array<{
      state: string | string[]
      label: string
    }>
    filterLogic?: (
      currentState: string,
      allStates: Array<{ state: string | string[]; label: string }>
    ) => Array<{ state: string | string[]; label: string }>

    stateField?: string
    defaultState?: string
    isStatic?: boolean
    staticActiveIndex?: number
  }
}

export interface TabProp {
  name: string
  content?: (props: ContentElementsProps) => ReactNode
}

export interface frmElementsProps {
  watch: UseFormWatch<any>
  errors: any
  control: any
  frmState?: any
  setValue: any
  editConfig: any
  fnc_name?: string
  options?: any[]
  label?: boolean
  setError?: any
}

export interface ContentElementsProps extends frmElementsProps {
  idDialog?: number
  type_config?: ConfigType
}

export type FormConfigs = {
  [key: `Frm_${string}_config`]: FormConfig
  [key: `Frm_${string}_config_modal`]: FormConfig
}

export enum ConfigStateInput {
  DISABLED = 'v',
}

export enum TypeContactEnum {
  COMPANY = 'C',
  INDIVIDUAL = 'I',
}

export enum ButtonTextEnum {
  SAVE_AND_CLOSE = 'Guardar y cerrar',
  SAVE_AND_CREATE = 'Guardar y crear uno',
  SAVE = 'Guardar',
  CLOSE = 'Cerrar',
  DISCARD = 'Descartar',
  DELETE = 'Eliminar',
  NEW = 'Nuevo',
  SELECT = 'Seleccionar',
}

export enum TypePermitionAction {
  CREATE = 'create',
  VIEW = 'view',
  NEW = 'new',
  UPDATE = 'update',
  DELETE = 'delete',
  COPY = 'copy',
  ARCHIVATE = 'archivate',
}
