import { frmElementsProps } from '@/shared/shared.types'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { DatepickerControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useEffect } from 'react'

export function FrmTitle({ watch }: frmElementsProps) {
  return (
    <>
      <div>
        <h1>{watch('name') || 'Nueva sesión'}</h1>
      </div>
    </>
  )
}
export function FrmMiddle({ control, errors, editConfig, watch }: frmElementsProps) {
  const { formItem, setFrmConfigControls } = useAppStore()

  useEffect(() => {
    setFrmConfigControls({
      user_name: {
        isEdit: true,
      },
      point_name: {
        isEdit: true,
      },
      start_at: {
        isEdit: true,
      },
      stop_at: {
        isEdit: true,
      },
      initial_cash_in_currency: {
        isEdit: true,
      },
      final_cash_in_currency: {
        isEdit: true,
      },
    })
  }, [])

  return (
    <>
      <BaseTextControlled
        label="Abierta por"
        name={'user_name'}
        control={control}
        errors={errors}
        editConfig={editConfig}
        navigationConfig={{ modelId: 2, recordId: formItem?.user_partner_id }}
      />
      <BaseTextControlled
        label="Punto de venta"
        name={'point_name'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
        navigationConfig={{ modelId: 892, recordId: formItem?.point_id }}
      />
      <FormRow label="Fecha de apertura" editConfig={editConfig} fieldName={'start_at'}>
        <DatepickerControlled
          name={'start_at'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          rules={[]}
        />
      </FormRow>
      {formItem?.state == 'R' && (
        <FormRow label="Fecha de cierre" editConfig={editConfig} fieldName={'stop_at'}>
          <DatepickerControlled
            name={'stop_at'}
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
            rules={[]}
          />
        </FormRow>
      )}
      <BaseTextControlled
        name={'initial_cash_in_currency'}
        control={control}
        errors={errors}
        editConfig={editConfig}
        label={'Saldo inicial'}
      />
      {formItem?.state == 'R' && (
        <BaseTextControlled
          name={'final_cash_in_currency'}
          control={control}
          errors={errors}
          editConfig={editConfig}
          label={'Saldo final'}
        />
      )}
    </>
  )
}
