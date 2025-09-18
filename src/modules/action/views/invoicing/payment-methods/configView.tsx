import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import { required } from '@/shared/helpers/validators'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'name'}
      className={'frm_dsc'}
      placeholder={'Nombre'}
      multiline={true}
      control={control}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmTab1({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'description'}
      className={'frm_dsc'}
      placeholder={'Descripción'}
      multiline={true}
      control={control}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}

export function FrmTab2({ control, errors, editConfig }: frmElementsProps) {
  return (
    <TextControlled
      name={'description'}
      className={'frm_dsc'}
      placeholder={'Descripción'}
      multiline={true}
      control={control}
      rules={required()}
      errors={errors}
      editConfig={{ config: editConfig }}
    />
  )
}
