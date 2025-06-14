import { TaxFormType } from '@/modules/invoicing/invoice.types'

export interface ContactData {
  type: string
  phone: string
  address_type: string
  email: string
  mobile: string
  company_id: number
  partner_id: number
  location_sl3_id: number
  location_sl1_id: number
  fav: string
  location_sl2_id: number
  state: string
  ref_interna: string
  company_name: string
  name: string
  location_sl3_name: string
  product_name: string
  location_l3_name: string
  location_sl2_name: string
  location_country_id: number
  sim_div: number
  level: number
  precio_venta: number
  totalItems: number
  pages: number
  groupItems: ContactData[]
  groupName: string
  kb__dsc_1: string
  categories: { color: string; label: string; full_name: string }[]
  files: { publicUrl: string }[]
  location_country_name: string
  type_description: string
  name_rel: string
  full_name: string
  partner_id_rel_base: number
  name_rel_full: string
  location_sl2_name__location_country_name: string
  pt_trab__name_rel_full: string
  //
  first: number
  last: number
  accion: string
  stateTemp: string
}

export interface InvoiceData {
  move_id: number
  company_id: string
  company_name: string
  state: string
  state2: string // VALIDAR SI SE VA A USAR O NO
  payment_state: string
  payment_state_description: string
  sent_state: string
  sent_state_description: string
  edi_state: string
  edi_state_description: string
  name: string
  partner_id: string
  partner_name: string
  invoice_date: Date
  invoice_date_due: Date
  payment_reference: string
  payment_term_id: string
  currency_id: string
  currency_name: string
  reference: string
  seller_id: string
  team_id: string
  bank_account_id: string
  delivery_date: Date
  fiscal_position_id: string
  amount_total: number
  move_lines: InvoiceItem[]
  amount_untaxed_in_currency: string
}

export interface InvoiceItem {
  tlin: TypeInvoiceLineEnum
  order_id: number
  move_id: number
  line_id: number
  product_id: number
  uom_id: string
  price_unit: number
  product_name: string
  dsc_udm: string
  quantity: number
  label: string
  discount: number
  move_lines_taxes: TaxFormType[]
  amount_untaxed: number
  amount_withtaxed: number
}

export enum TypeInvoiceLineEnum {
  LINE = 'L',
  SECTION = 'S',
  NOTE = 'N',
}

export type DataType = ContactData | InvoiceData

export type GroupByItemType = {
  groupName: string
  groupItems: GroupByItemType[]
  pages: number
  currentPage: number
  totalItems: number
  level: number
}

export enum dataStateType {
  GROUPED = 'grouped',
  FILTERED = 'filtered',
  NORMAL = 'normal',
}

export type GroupedItemsType = {
  currentPage: number
  first: number
  groupItems: Record<string, any>[]
  groupName: string
  groupKey: string | number
  last: number
  level: number
  pages: number
  parents: { key: string; value: number | string }[]
  totalItems: number
}

export enum StatusContactEnum {
  ARCHIVE = 'I',
  UNARCHIVE = 'A',
}

export interface Data_Journal {
  name: string
  payment_id: number
  state: string
  state_description: string
  amount: number
  amount_in_currency: string
  partner_name: string
  date: string
  description: string
  journal_name: string
  company_name: string
  payment_method_name: string
  currency_name: string
}
