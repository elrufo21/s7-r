import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Código</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'code'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'name'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Prefijo del código de documento</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'code_prefix'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Nombre en Reportes</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'report_name'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Tipo interno</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'internal_type'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
      <div className="d-sm-contents">
        <div className="o_cell o_wrap_label">
          <label className="o_form_label">Pais</label>
        </div>
        <div className="o_cell">
          <div className="o_field">
            <TextControlled
              name={'country_id'}
              className={'frm_dsc'}
              placeholder={''}
              multiline={false}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
              disabled
            />
          </div>
        </div>
      </div>
    </>
  )
}
