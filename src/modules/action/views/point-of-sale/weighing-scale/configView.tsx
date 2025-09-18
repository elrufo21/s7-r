import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import { frmElementsProps } from '@/shared/shared.types'

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
      <BaseTextControlled
        label={'Código'}
        name={'code'}
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
      />
    </>
  )
}
