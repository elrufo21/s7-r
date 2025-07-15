import { required } from '@/shared/helpers/validators'
import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'

export function FrmTitle({ control, errors, editConfig }: frmElementsProps) {
  return (
    <>
      <TextControlled
        name={'name'}
        className={'frm_dsc'}
        placeholder={'por ejemplo, tienda en lima'}
        control={control}
        multiline={true}
        rules={required()}
        errors={errors}
        editConfig={{ config: editConfig }}
      />
      <br />
      <br />
      <br />
    </>
  )
}
