import { frmElementsProps } from '@/shared/shared.types'
import {
  AutocompleteControlled,
  DatepickerControlled,
  SelectControlled,
  TextControlled,
} from '@/shared/ui'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents w-60">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Motivo que aparece en la nota de crédito</label>
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
          <label className="o_form_label">Diario</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <AutocompleteControlled
              name={'journal_id'}
              control={control}
              errors={errors}
              options={[]}
              editConfig={{ config: editConfig }}
              fnc_loadOptions={() => {}}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Motivo de crédito</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SelectControlled
              name={'reason_id'}
              control={control}
              errors={errors}
              options={[]}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Fecha de revisión</label>
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
    </>
  )
}
