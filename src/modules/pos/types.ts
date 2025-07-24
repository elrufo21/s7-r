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
  custom_price?: number
  cost?: number
  category_id?: string
  sale_price?: any
  uom_name?: string
  uom_id?: string
}

export interface CartItem extends Product {
  quantity: number
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
}

export enum Operation {
  QUANTITY = 'quantity',
  PRICE = 'price',
  DISCOUNT = 'discount',
}
