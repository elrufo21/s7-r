import { TextControlled } from '@/shared/ui'
import FormRow from './FormRow'

interface BaseTextControlledProps {
  name: string
  control: any
  errors: any
  placeholder: string
  editConfig: any
  label: string
  multiline?: boolean
}
const BaseTextControlled = ({
  name,
  control,
  errors,
  placeholder,
  editConfig,
  label,
  multiline = false,
}: BaseTextControlledProps) => {
  return (
    <FormRow label={label}>
      <TextControlled
        name={name}
        placeholder={placeholder}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        multiline={multiline}
      />
    </FormRow>
  )
}

export default BaseTextControlled
