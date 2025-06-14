import { frmElementsProps } from '@/shared/shared.types'
import { DatepickerControlled } from '@/shared/ui'
import { required } from '@/shared/helpers/validators'

interface custom_frm_elementsProps extends frmElementsProps {
  fieldName: string
  startToday?: boolean
  labelName?: string
  rulers?: boolean
}

const Cf_date = ({
  control,
  errors,
  editConfig,
  fieldName,
  startToday = false,
  labelName = 'Fecha',
  rules,
}: custom_frm_elementsProps) => {
  console.log('starttoday', startToday)
  /* useEffect(() => {
    if(!formItem?.[fieldName] &&){

    }
    setValue(fieldName, new Date())
  }, [])*/
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">{labelName}</label>
      </div>
      <div className="o_cell">
        <div className="o_field">
          <DatepickerControlled
            name={fieldName}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
            rules={rules ? required : {}}
            startToday={startToday}
          />
        </div>
      </div>
    </div>
  )
}

export default Cf_date
