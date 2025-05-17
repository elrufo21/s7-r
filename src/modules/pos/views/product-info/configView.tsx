import { TextControlled } from '@/shared/ui'
import { useEffect } from 'react'

export const FrmTitle = ({ control, errors, editConfig }) => {
  return (
    <div className="o_cell">
      <span className="text-sm">
        Almacen de productos final: <b>0</b> Unidades disponibles, <b>0</b> pronosticado
      </span>
      <br />
      <span className="text-sm">
        Almacen de materias primas: <b>0</b> Unidades disponibles, <b>0</b> pronosticado
      </span>
    </div>
  )
}

export const FrmMiddle = ({ control, errors, setValues, watch, editConfig }) => {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio sin impuesto</label>
        </div>
        <div className="o_cell">{watch('sale_price') ?? 0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">IVA</label>
        </div>
        <div className="o_cell">{watch('sale_price') ?? 0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio con impuesto</label>
        </div>
        <div className="o_cell">S/{0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Costo</label>
        </div>
        <div className="o_cell">S/{watch('cost')}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Margen</label>
        </div>
        <div className="o_cell">S/{0}</div>
      </div>
    </>
  )
}

export const FrmMiddleRight = ({ control, errors, editConfig, watch }) => {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio sin impuesto</label>
        </div>
        <div className="o_cell">{watch('sale_price') ?? 0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">IVA</label>
        </div>
        <div className="o_cell">{watch('sale_price') ?? 0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Precio con impuesto</label>
        </div>
        <div className="o_cell">S/{0}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Costo</label>
        </div>
        <div className="o_cell">S/{watch('cost')}</div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Margen</label>
        </div>
        <div className="o_cell">S/{0}</div>
      </div>
    </>
  )
}
