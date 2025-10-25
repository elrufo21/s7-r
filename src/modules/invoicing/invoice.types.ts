import { InvoiceItem, TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { ActionTypeEnum } from '@/shared/shared.types'

export enum InvoiceEnum_payment_state {
  NO_PAYMENT = 'N',
  PARTIAL_PAYMENT = 'R',
  IN_PROCESS = 'I',
  PAID = 'P',
}

export enum InvoiceEnum_sent_state {
  UNSENT = 'U',
  SENT = 'S',
}

export enum InvoiceEnum_edi_state {
  TO_SEND = 'T',
}

export enum StatusInvoiceEnum {
  BORRADOR = 'D', // BORRADOR
  REGISTERED = 'R', // REGISTRADO
  CANCELADO = 'C', // CANCELADO

  FULL_PAYMENT = 'FP', // PAGO COMPLETO
  PARTIAL_PAYMENT = 'PP', // PAGO PARCIAL
}

export enum Enum_Payment_State {
  DRAFT = 'D',
  IN_PROCESS = 'I',
  PAID = 'P',
  REFUSED = 'R',
  CANCELLED = 'C',
}

export type ProductSelectType = {
  rowId: number
  columnId: keyof InvoiceItem
  option: ProductFormType & { label: string; value: string }
}
export type ProductFormType = {
  files: { [key: string]: any }[]
  dsc_cat_full: null
  product_name: string
  fav: boolean
  product_id: number
  label: string
  precio_venta: number
  ref_interna: string
  tag_imp_c: null
  tag_imp_v: TaxFormType[]
  tpdt_dsc: string
  value: number
}

export type TaxSelectType = {
  rowId: number
  columnId: keyof InvoiceItem
  option: (TaxFormType & { label: string; value: number })[]
}
export type TaxFormType = {
  label: string
  value: string
  aimp: null
  timp: string
  order_id: number
  unece: null
  company_id: number
  tax_id: number
  id_tbt: null
  state: string
  calculo: string
  company_name: string
  dsc_imp: string
  dsc_tbt: null
  id_aigv: null
  tax_idg: number
  location_country_id: null
  importe: number
  nom_imp: string
  nom_impg: string
  incluido_precio: boolean
  afecta_subsecuentes: boolean
}

export type TotalsInvoiceType = {
  totals: Record<string, number>
  tax_totals: { name: string; amount: number; id_tax: number }[]
}

export interface MoveLine {
  label: string
  type: TypeInvoiceLineEnum
  name: string
  hasLabel: boolean
  uom_id: number
  uom_name: string
  line_id: number
  discount: null
  order_id: number
  quantity: number
  amount_tax: number
  price_unit: number
  product_id: number
  amount_untaxed: number
  amount_discount: number
  amount_withtaxed: number
  move_lines_taxes: MoveLinesTax[]
  amount_untaxed_in_currency: string
  action: ActionTypeEnum
  move_lines_taxes_change: boolean
  notes: string
  _resetKey?: number
}

export interface MoveLinesTax {
  label: string
  tax_id: number
  value?: string | number
}

export enum Enum_Journal_State {
  DRAFT = 'D',
  IN_PROCESS = 'I',
  PAID = 'P',
  REFUSED = 'R',
}
