import { frmElementsProps } from '@/shared/shared.types'

export const FrmTitle = ({ watch }: frmElementsProps) => {
  const stockFinal = watch('stock_final') ?? 0
  const forecastFinal = watch('forecast_final') ?? 0
  const stockRaw = watch('stock_raw') ?? 0
  const forecastRaw = watch('forecast_raw') ?? 0

  return (
    <div className="o_cell">
      <span className="text-sm">
        Almacén de productos final: <b>{stockFinal}</b> Unidades disponibles, <b>{forecastFinal}</b>{' '}
        pronosticado
      </span>
      <br />
      <span className="text-sm">
        Almacén de materias primas: <b>{stockRaw}</b> Unidades disponibles, <b>{forecastRaw}</b>{' '}
        pronosticado
      </span>
    </div>
  )
}

export const FrmMiddle = ({ watch }: frmElementsProps) => {
  const salePrice = watch('sale_price') ?? 0
  const cost = watch('cost') ?? 0
  const currency = watch('currency_symbol') ?? 'S/'
  const ivaPercent = 0.18 // 18% fijo, se puede sacar de taxes_sale
  const iva = salePrice * ivaPercent
  const priceWithTax = salePrice + iva
  const margen = salePrice - cost

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio sin impuesto</label>
        </div>
        <div className="o_cell">
          {currency}
          {salePrice}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">IVA</label>
        </div>
        <div className="o_cell">
          {currency}
          {iva.toFixed(2)}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio con impuesto</label>
        </div>
        <div className="o_cell">
          {currency}
          {priceWithTax.toFixed(2)}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Costo</label>
        </div>
        <div className="o_cell">
          {currency}
          {cost}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Margen</label>
        </div>
        <div className="o_cell">
          {currency}
          {margen}
        </div>
      </div>
    </>
  )
}

export const FrmMiddleRight = ({ watch }: frmElementsProps) => {
  const salePrice = watch('sale_price') ?? 0
  const cost = watch('cost') ?? 0
  const currency = watch('currency_symbol') ?? 'S/'
  const ivaPercent = 0.18
  const iva = salePrice * ivaPercent
  const priceWithTax = salePrice + iva
  const margen = salePrice - cost

  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio sin impuesto</label>
        </div>
        <div className="o_cell">
          {currency}
          {salePrice}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">IVA</label>
        </div>
        <div className="o_cell">
          {currency}
          {iva.toFixed(2)}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio con impuesto</label>
        </div>
        <div className="o_cell">
          {currency}
          {priceWithTax.toFixed(2)}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Costo</label>
        </div>
        <div className="o_cell">
          {currency}
          {cost}
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Margen</label>
        </div>
        <div className="o_cell">
          {currency}
          {margen}
        </div>
      </div>
    </>
  )
}
