import { frmElementsProps } from '@/shared/shared.types'
import {
  AutocompleteControlled,
  CheckBoxControlled,
  DatepickerControlled,
  SelectControlled,
  TextControlled,
} from '@/shared/ui'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents w-60">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Motivo</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              className="w-100"
              placeholder={'por ejemplo, "servicios de consultoría"'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Fecha de nota de debito</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <DatepickerControlled
              name={'review_date'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              rules={{}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Copiar lineas</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <CheckBoxControlled
              name={'copy_lines'}
              control={control}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents w-60">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Utilizar diario específico </label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'name'}
              className="w-100"
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents w-60">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Motivo de debito </label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'name'}
              className="w-100"
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
            />
          </div>
        </div>
      </div>
    </>
  )
}
