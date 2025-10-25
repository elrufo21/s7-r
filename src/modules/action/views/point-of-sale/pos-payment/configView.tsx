import { TypeOriginPaymen, TypePayment } from '@/modules/pos-carnes/types'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'

export function FrmMiddle({ control, errors, editConfig, watch, setValue }: frmElementsProps) {
  const { formItem, setFrmConfigControls } = useAppStore()

  useEffect(() => {
    setFrmConfigControls({
      session_name: {
        isEdit: true,
      },
      order_name: {
        isEdit: true,
      },
      amount_in_currency: {
        isEdit: true,
      },
      payment_method_name: {
        isEdit: true,
      },
      reason: { isEdit: true },
      type: { isEdit: true },
    })
  }, [])
  useEffect(() => {
    if (!formItem) return

    if (formItem.session_name) setValue('session_name', formItem.session_name)
    if (formItem.order_name) setValue('order_name', formItem.order_name)
    if (formItem.amount_in_currency) setValue('amount_in_currency', formItem.amount_in_currency)
    if (formItem.payment_method_name) setValue('payment_method_name', formItem.payment_method_name)
    if (formItem.reason) setValue('reason', formItem.reason)
  }, [formItem])
  return (
    <>
      {formItem?.origin === TypeOriginPaymen.DIRECT_PAYMENT ? (
        <>
          <BaseTextControlled
            label="Motivo"
            name={'reason'}
            control={control}
            errors={errors}
            editConfig={editConfig}
          />
          <FormRow label="Tipo" fieldName="type" editConfig={editConfig}>
            <div>{`${formItem.type === TypePayment.INPUT ? 'Entrada' : 'Salida'}`}</div>
          </FormRow>
        </>
      ) : (
        <>
          <BaseTextControlled
            label="Sesión"
            name={'session_name'}
            control={control}
            errors={errors}
            placeholder={''}
            editConfig={editConfig}
            navigationConfig={{ modelId: 889, recordId: formItem?.session_id }}
          />
          <BaseTextControlled
            label="Orden"
            name={'order_name'}
            control={control}
            errors={errors}
            placeholder={''}
            editConfig={editConfig}
            navigationConfig={{ modelId: 888, recordId: formItem?.order_id }}
          />
        </>
      )}

      <BaseTextControlled
        label="Importe"
        name={'amount_in_currency'}
        control={control}
        errors={errors}
        editConfig={editConfig}
        isNumeric
      />
      <BaseTextControlled
        label="Método de pago"
        name={'payment_method_name'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
        navigationConfig={{ modelId: 891, recordId: formItem?.payment_method_id }}
      />
    </>
  )
}
