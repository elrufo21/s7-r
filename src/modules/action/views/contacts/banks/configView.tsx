import { TextControlled } from '@/shared/ui'

import { frmElementsProps } from '@/shared/shared.types'
import AddressField from '@/shared/components/extras/AddressField'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <TextControlled
        name={'name'}
        className={'frm_dsc'}
        placeholder={''}
        multiline={true}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}

export function FrmMiddle({ setValue, control, errors, editConfig, watch }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Código de identificación bancaria (BIC/SWIFT)</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'code_id'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        {/* <div className="o_cell o_wrap_label"> */}
        <div className="o_cell">
          <label className="o_form_label">Dirección del banco</label>
        </div>
        <AddressField
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          watch={watch}
          setValue={setValue}
        />
      </div>
    </>
  )
}

export function FrmMiddleRight({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Teléfono</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'phone'}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Correo electrónico</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'email'}
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
