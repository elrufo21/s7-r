interface file {
  publicUrl?: string
  url?: string
}
export interface Product {
  product_template_id: string
  product_id: string | null
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
  line_id: number | string
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

  REGISTERED = 'R',

  PARTIAL_PAYMENT = 'RPP',
  PENDING_PAYMENT = 'RPE',
  PAID = 'RPF',

  ACTIVE = 'A',
  CLOSE = 'CL',
  ALL = 'AL',
}
export enum TypeStatePayment {
  PARTIAL_PAYMENT = 'PP',
  PENDING_PAYMENT = 'PE',
  PAYMENT = 'PF',
}

export enum Operation {
  QUANTITY = 'quantity',
  PRICE = 'price',
  DISCOUNT = 'discount',
  CHANGE_PRICE = 'change_price',
}

export enum Type_pos_payment_origin {
  DOCUMENT = 'D',
  DIRECT_PAYMENT = 'P',
  PAY_DEBT = 'G',
}
export enum TypePayment {
  INPUT = 'I',
  OUTPUT = 'O',
}
