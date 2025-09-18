import { frmElementsProps, TypeContactEnum } from '@/shared/shared.types'
import { ContactAutocomplete } from '../form/base/ContactAutocomplete'

interface CfContactProps extends frmElementsProps {
  formItem: any
  textLabel: string
  fieldId?: string
  fieldName?: string
  type?: TypeContactEnum
}

const Cf_contact = ({
  control,
  errors,
  setValue,
  formItem,
  editConfig,
  textLabel,
  fieldId = 'partner_id',
  fieldName = 'partner_name',
  type = TypeContactEnum.INDIVIDUAL,
}: CfContactProps) => {
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">{textLabel}</label>
      </div>
      <div className="o_cell">
        <ContactAutocomplete
          name={fieldId}
          control={control}
          errors={errors}
          setValue={setValue}
          formItem={formItem}
          editConfig={editConfig}
          fnc_name={'fnc_partner'}
          idField={fieldId}
          nameField={fieldName}
          type={type}
        />
      </div>
    </div>
  )
}
export default Cf_contact
