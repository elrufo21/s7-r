export enum TaxType {
  PURCHASE = 'purchase',
  SALE = 'sale',
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
