import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'

export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
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
    })
  }, [])

  return (
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
      <BaseTextControlled
        label="Importe"
        name={'amount_in_currency'}
        control={control}
        errors={errors}
        editConfig={editConfig}
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
