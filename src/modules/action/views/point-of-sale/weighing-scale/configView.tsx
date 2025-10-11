import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { frmElementsProps } from '@/shared/shared.types'
import { SelectControlled } from '@/shared/ui'

export const FrmMiddle = ({ control, errors, editConfig }: frmElementsProps) => {
  return (
    <>
      <BaseTextControlled
        label={'Nombre'}
        name={'name'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        required={true}
      />
      <FormRow label="Tipo" fieldName="type">
        <SelectControlled
          control={control}
          errors={errors}
          name="type"
          options={[
            { label: '', value: '' },
            { label: 'Balanza electronica', value: 'ES' },
          ]}
        />
      </FormRow>
      <BaseTextControlled
        label={'Codigo'}
        name={'code'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        required={true}
      />
      <BaseTextControlled
        label={'Character uuid '}
        name={'character_uuid'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        required={true}
      />
      <BaseTextControlled
        label={'Descripción'}
        name={'description'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
        multiline={true}
      />
    </>
  )
}
