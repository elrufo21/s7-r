import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
{
  /**
     <div className="d-sm-contents w-52">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">Código de identificación bancaria (BIC/SWIFT)</label>
      </div>
      <div className="o_cell">
        <div className="o_field">
          <TextControlled
            name={'name'}
            control={control}
            errors={errors}
            placeholder={'por ejemplo, nota'}
            editConfig={{ config: editConfig }}
            multiline={true}
          />
        </div>
      </div>
    </div> */
}
export const FrmMiddle = ({ control, errors, editConfig }: frmElementsProps) => {
  return (
    <div className="w-[800px] mt-3">
      <div className="d-sm-contents w-52">
        <div className="o_cell mt-3">
          <div className="o_field">
            <TextControlled
              name={'name'}
              control={control}
              errors={errors}
              placeholder={''}
              editConfig={{ config: editConfig }}
              multiline={true}
              multilineRows={4}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
