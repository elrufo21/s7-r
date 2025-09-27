import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { required } from '@/shared/helpers/validators'
import { frmElementsProps } from '@/shared/shared.types'
import { AutocompleteControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useState } from 'react'

export const FrmMiddle = ({ control, errors, editConfig, watch }: frmElementsProps) => {
  const [paymentMethods, setPaymentMethods] = useState<{ value: any; label: string }[]>([])
  const { createOptions } = useAppStore()

  const fnc_load_payment_methods = async () => {
    const options = await createOptions({
      fnc_name: 'fnc_journal_payment_methods',
      filters: [[0, 'fequal', 'journal_id', watch('journal_id')]],
      action: 's2',
    })
    setPaymentMethods(options)
  }

  return (
    <>
      <FormRow label={'Metodo de pago'}>
        <AutocompleteControlled
          name={'payment_method_id'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          options={paymentMethods}
          key={'payment_method_id'}
          fnc_loadOptions={() => {
            fnc_load_payment_methods()
          }}
          rules={required()}
        />
      </FormRow>
      <BaseTextControlled
        key={'amount'}
        label="Importe"
        name={'amount'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
      />

      <BaseTextControlled
        label="Referencia de pago"
        name={'reference'}
        control={control}
        errors={errors}
        editConfig={{ config: editConfig }}
      />
    </>
  )
}
