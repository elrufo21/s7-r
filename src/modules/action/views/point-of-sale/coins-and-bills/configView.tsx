import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import { frmElementsProps } from '@/shared/shared.types'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <BaseTextControlled
        label="Nombre"
        name={'name'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
      />
      <BaseTextControlled
        label="Valor"
        name={'value'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
      />
    </>
  )
}
