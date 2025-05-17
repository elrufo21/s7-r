export enum TaxType {
  PURCHASE = 'purchases',
  SALE = 'sales',
}

export type Tax = {
  label: string
  value: number
  type: string
  operation: string
}

export enum TypeProductEnum {
  GOODS = 'B',
  SERVICES = 'S',
  COMBO = 'C',
}
export enum InvoicePolicyEnum {
  CUANTITY_ORDERED = 'CO',
  CUANTITY_DELIVERED = 'CE',
}

export interface AttributeValue {
  attribute_value_id: string
  name: string
  value: string
}

export interface Attribute {
  id: string
  attribute_id: string
  name?: string
  values: AttributeValue[]
  valuesData: AttributeValue[]
  values_change?: boolean
}

export interface TableRow {
  id: string
  attribute_id?: string
  values: AttributeValue[]
  valuesData?: AttributeValue[]
  values_change?: boolean
  [key: string]: any
}

export interface AutocompleteData {
  rowId: number
  columnId: string
  option: Record<string, any>
}
export interface AttributeTable {
  attribute_id: string | number | null
  values: AttributeValue[]
  valuesData?: AttributeValue[]
  attribute_name?: string
  values_change?: boolean
}
