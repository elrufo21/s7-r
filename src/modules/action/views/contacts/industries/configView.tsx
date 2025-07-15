import { TextControlled } from '@/shared/ui'
import { frmElementsProps } from '@/shared/shared.types'
import { required } from '@/shared/helpers/Validators'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              placeholder={'por ejemplo, "Agricultura", "Construcción", "Minería", ...'}
              control={control}
              rules={required()}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre completo</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'full_name'}
              placeholder={''}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <br />
        <br />
      </div>
      {/*
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Activo</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <SwitchControlled
              name={'state_switch'}
              onChange={switchHandler}
              control={control}
              //errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
        </div>
      </div>
       */}
    </>
  )
}
