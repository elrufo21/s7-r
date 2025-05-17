import { ActionTypeEnum, ContentElementsProps } from '@/shared/shared.types'
import { ReactNode } from 'react'

export interface TabProp {
  name: string
  content?: (props: ContentElementsProps) => ReactNode
}

export enum ConfigStateInput {
  DISABLED = 'v',
}

export enum TypeContactEnum {
  COMPANY = 'C',
  INDIVIDUAL = 'I',
}

export enum ContactOptionEnum {
  ADD_CONTACT = 'CO',
  BILLING_ADDRESS = 'DF',
  DELIVERY_ADDRESS = 'DE',
  ANOTHER_ADDRESS = 'OD',
}

export type AccountBank = {
  bank_id: number | null
  id?: string
  bank_account_id: number | string | null
  company_id: number | null
  partner_id: number | null
  currency_id: number | null
  state: string
  company_name: string
  name: string
  currency_name: string
  bank_name: string
  number: string
  action: string
  disabled: boolean
}

export interface ContactItem {
  company_id: null
  state: string
  type: string
  name: string
  files: null
  identification_type_id: null
  identification_number: string
  partner_id_rel: null
  address_type: string
  street: string
  street_2: string
  location_sl1_id: null
  location_sl2_id: null
  location_sl3_id: null
  location_l3_name: null
  location_sl2_name: null
  location_sl3_name: null
  dsc_ubigeo: null
  zip: string
  location_country_id: null
  workstation: string
  phone: string
  mobile: string
  email: string
  website: string
  title_id: null
  categories: any[]
  list_contacts: any[]
  customer_payment_term_id: null
  price_list_id: null
  supplier_payment_term_id: null
  barcode: string
  fiscal_position_id: null
  reference: string
  industry_id: null
  internal_notes: string
  id: number
  partner_id: string
  action: ActionTypeEnum
  stateTemp: string
  afile: string
  ln1_id: string
  ln2_id: string
  ln3_id: string
  ln4_id: string
  buyer_id: string
  contacts: ContactItem[]
  ln1_name: string
  ln2_name: string
  ln3_name: string
  ln4_name: string
  files_old: File[]
  full_name: string
  parent_id: string
  seller_id: string
  title_name: string
  company_name: string
  bank_accounts: AccountBank[]
  industry_name: string
  base_parent_id: string
  price_list_name: string
  parent_full_name: string
  type_description: string
  categories_change: boolean
  company_identifier: string
  ln3_name__ln1_name: string
  identification_type_name: string
  customer_payment_term_name: string
  supplier_payment_term_name: string
  workstation__parent_full_name: string
}
