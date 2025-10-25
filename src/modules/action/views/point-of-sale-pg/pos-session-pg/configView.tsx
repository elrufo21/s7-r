import { frmElementsProps } from '@/shared/shared.types'
import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import FormRow from '@/shared/components/form/base/FormRow'
import { DatepickerControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { useEffect, useState } from 'react'
import { DndTable } from '@/shared/components/table/DndTable'

export function FrmTitle({ watch }: frmElementsProps) {
  return (
    <h1 className="text-[28px] font-[400] mb-0 text-gray-900">
      <span>{watch('name') || 'Nueva sesión'}</span>
    </h1>
  )
}
export function FrmMiddle({ control, errors, editConfig }: frmElementsProps) {
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
        navigationConfig={{ modelId: 440, recordId: formItem?.user_partner_id }}
      />
      <BaseTextControlled
        label="Punto de venta"
        name={'point_name'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
        navigationConfig={{ modelId: 409, recordId: formItem?.point_id }}
      />
      <FormRow label="Fecha de apertura" editConfig={editConfig} fieldName={'start_at'}>
        <DatepickerControlled
          name={'start_at'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          rules={[]}
          disableHour={false}
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
            disableHour={false}
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

export function FrmTab0({ watch }: frmElementsProps) {
  console.log('watch', watch)
  const [data, setData] = useState<any[]>([])

  const columns = [
    {
      header: 'Metodo de pago',
      accessorKey: 'payment_method_name',
      className: '!w-auto text-left',
    },
    {
      header: 'Monto',
      accessorKey: 'point_name',
      className: '!w-auto text-left',
    },
  ]
  return (
    <div>
      <DndTable
        columns={columns}
        data={data}
        setData={setData}
        id="payment_methods_id"
        onDataChange={(newData) => setData(newData)}
      >
        {(table) => (
          <tr
            style={{ height: '42px' }}
            className="group list-tr options border-gray-300 hover:bg-gray-200 border-t-black border-t-[1px]"
          >
            <td></td>
            <td
              colSpan={
                table.getRowModel().rows[0]
                  ? table.getRowModel().rows[0]?.getVisibleCells().length - 1
                  : 7
              }
              className="w-full"
            >
              <div className="flex gap-4"></div>
            </td>
          </tr>
        )}
      </DndTable>
    </div>
  )
}
