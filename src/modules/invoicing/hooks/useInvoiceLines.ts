import { useState } from 'react'
import { MoveLine, TotalsInvoiceType } from '../invoice.types'

import { MoveLinesTax } from '../invoice.types'
import useAppStore from '@/store/app/appStore'

export const useInvoiceCalculations = () => {
  const [totalInvoice, setTotalInvoice] = useState<TotalsInvoiceType>({
    totals: { amount_total: 0 },
    tax_totals: [],
  })
  const { executeFnc } = useAppStore()

  const calculateAmounts = async (params: {
    products: MoveLine[]
    product: {
      product_id: number
      quantity: number
      price: number
      taxes: MoveLinesTax[]
    }
  }) => {
    const productInfo = await executeFnc('fnc_product', 'get_amounts', params)
    if (!productInfo?.oj_data) {
      throw new Error('Error al calcular montos')
    }

    setTotalInvoice({
      totals: productInfo.oj_data[0].totals,
      tax_totals: productInfo.oj_data[0].tax_totals,
    })

    return productInfo.oj_data[0].product.amount_untaxed
  }

  return {
    totalInvoice,
    calculateAmounts,
  }
}
