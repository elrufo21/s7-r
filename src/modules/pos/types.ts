interface file {
  publicUrl?: string
  url?: string
}
export interface Product {
  product_template_id: string
  product_id: string
  name: string
  size: string
  price: number
  files: file[]
  category: string
  quantity?: number
  base_quantity?: number
  custom_price?: number
  cost?: number
  category_id?: string
  sale_price?: any
  uom_name?: string
  uom_id?: string
  taraQuantity?: number
  taraValue?: number
  taraTotal?: number
  price_unit?: number
  tara_value?: number
  tara_quantity?: number
  tara_total?: number
}

export interface CartItem extends Product {
  quantity: number
  price_unit: number
}

export interface Category {
  category_id: string
  name: string
  icon: string
}

export enum TypeStateOrder {
  CANCELED = 'C',
  IN_PROGRESS = 'I',
  PAY = 'Y',
  PAID = 'P',
  REGISTERED = 'R',
  PENDING_PAYMENT = 'E',
}

export enum Operation {
  QUANTITY = 'quantity',
  PRICE = 'price',
  DISCOUNT = 'discount',
}
