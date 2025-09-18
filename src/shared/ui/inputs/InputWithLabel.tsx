import { TextControlled } from './TextControlled'

interface InputWithLabelProps {
  label: string
  name: string
  control: any
  errors: any
  placeholder?: string
  editConfig: any
  multiline?: boolean
  rules?: any
}

export const InputWithLabel = ({
  label,
  name,
  control,
  errors,
  placeholder = '',
  editConfig,
  multiline = false,
  rules = {},
}: InputWithLabelProps) => {
  return (
    <div className="d-sm-contents">
      <div className="o_cell o_wrap_label">
        <label className="o_form_label">{label}</label>
      </div>
      <div className="o_cell">
        <div className="o_field">
          <TextControlled
            name={name}
            control={control}
            errors={errors}
            placeholder={placeholder}
            editConfig={editConfig}
            multiline={multiline}
            rules={rules}
          />
        </div>
      </div>
    </div>
  )
}
