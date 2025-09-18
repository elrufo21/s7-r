import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled, TextControlled } from '@/shared/ui'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Por ejemplo, Almacén principal'}
      multiline={true}
      control={control}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmMiddle({ control, errors, editConfig = {} }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre Corto</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              control={control}
              errors={errors}
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
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Empresa</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'company_id'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Dirección</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'partner_id'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              options={[]}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  )
}
