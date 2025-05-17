import { ActionTypeEnum } from '@/shared/shared.types'
import { MoveLine } from './invoice.types'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'

export const defaultProduct: MoveLine = {
  name: 'Buscar un producto',
  uom_name: '',
  line_id: 0,
  product_id: 0,
  label: '',
  hasLabel: false,
  quantity: 1,
  price_unit: 1,
  order_id: 0,
  uom_id: 0,
  move_lines_taxes: [],
  amount_untaxed: 0.0,
  amount_withtaxed: 0.0,
  amount_tax: 0.0,
  amount_discount: 0.0,
  amount_untaxed_in_currency: '0.0',
  discount: null,
  action: ActionTypeEnum.INSERT,
  type: TypeInvoiceLineEnum.LINE,
  move_lines_taxes_change: false,
}
