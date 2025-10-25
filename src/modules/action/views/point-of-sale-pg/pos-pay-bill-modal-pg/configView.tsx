import { frmElementsProps, ActionTypeEnum, TypeContactEnum } from '@/shared/shared.types'
import { useState, useMemo, useEffect } from 'react'
import { DndTable } from '@/shared/components/table/DndTable'
import { ColumnDef, Row } from '@tanstack/react-table'
import useAppStore from '@/store/app/appStore'
import { SelectControlled, TextControlled } from '@/shared/ui'
import { PosOrderData } from '../pos-order/config'
import { StatusChip } from '@/shared/components/table/components/StatusChip'
import { formatPlain } from '@/shared/utils/dateUtils'
import { ContactAutocomplete } from '@/shared/components/form/base/ContactAutocomplete'
import FormRow from '@/shared/components/form/base/FormRow'
import { TypeStatePayment } from '@/modules/pos/types'

export function Subtitle({ control, errors, editConfig, setValue }: frmElementsProps) {
  const { formItem } = useAppStore()
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Fecha de inicio - inline */}
      <FormRow label="Cliente" editConfig={editConfig} fieldName={'partner_id'}>
        <ContactAutocomplete
          name={'partner_id'}
          control={control}
          errors={errors}
          setValue={setValue}
          formItem={formItem}
          editConfig={editConfig}
          fnc_name={'fnc_partner'}
          idField={'partner_id'}
          nameField={'partner_name'}
          type={TypeContactEnum.INDIVIDUAL}
        />
      </FormRow>

      {/* Fecha de finalización - inline */}
      <FormRow label="Pago" editConfig={editConfig} fieldName={'payment_id'}>
        <SelectControlled
          name={'payment_id'}
          control={control}
          errors={errors}
          editConfig={editConfig}
          options={[
            { value: TypeStatePayment.PENDING_PAYMENT, label: 'Pago pendiente' },
            { value: TypeStatePayment.PARTIAL_PAYMENT, label: 'Pago parcial' },
          ]}
        />
      </FormRow>
    </div>
  )
}

export function FrmMiddle({ setValue, watch }: frmElementsProps) {
  const { formItem } = useAppStore()

  const [data, setData] = useState<any[]>([])
  const [modifyData, setModifyData] = useState<boolean>(false)
  useEffect(() => {
    if (watch('orderLines')) {
      setData(watch('orderLines'))
    }
  }, [formItem?.lines])

  useEffect(() => {
    if (modifyData) {
      setValue('lines', data, {
        shouldValidate: true,
        shouldDirty: true,
      })
      setModifyData(false)
    }
  }, [data, setValue, modifyData])

  const addOrderLine = () => {}

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      /*
            {
              header: 'Ref. de la orden',
              size: 150,
              cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.name}</div>,
            },
            */
      {
        header: 'Número de recibo',
        size: 150,
        cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.receipt_number}</div>,
      },
      {
        header: 'Fecha',
        size: 120,
        cell: ({ row }: { row: Row<PosOrderData> }) => (
          <div>{row.original.order_date ? formatPlain(row.original.order_date) : ''}</div>
        ),
      },
      {
        header: 'Sesión',
        size: 120,
        cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.session_name}</div>,
      },
      /*
            {
              header: 'Punto de venta',
              size: 150,
              cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.point_name}</div>,
            },
            */
      /*
            {
              header: 'Número de orden',
              size: 150,
              cell: ({ row }: { row: Row<PosOrderData> }) => (
                <div>{row.original.order_sequence_ft}</div>
              ),
            },
            */
      {
        header: 'Cliente',
        size: 180,
        cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.partner_name}</div>,
      },
      {
        header: 'Cajero',
        size: 150,
        cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.user_name}</div>,
      },
      {
        header: 'Total',
        size: 120,
        meta: {
          textAlign: 'text-right',
          headerAlign: 'text-right',
        },
        cell: ({ row }: { row: Row<PosOrderData> }) => (
          <div>
            {row.original.amount_withtaxed_currency
              ? row.original.amount_withtaxed_currency
              : '0.00'}
          </div>
        ),
      },

      // {
      //   header: 'Estado',
      //   size: 100,
      //   cell: ({ row }: { row: Row<PosOrderData> }) => <div>{row.original.state}</div>,
      // },

      {
        header: 'Estado',
        size: 120,
        cell: ({ row }: { row: Row<PosOrderData> }) => {
          const state = row.original.state
          const stateDescription = row.original.state_description

          return (
            <StatusChip
              value={state}
              description={stateDescription}
              textMap={{
                I: 'En curso',
                Y: 'Pago',
                C: 'Cancelado',
                RPF: 'Pagado',
                RPP: 'Pagado Parcial',
                RPE: 'Error de Pago',
              }}
              classesMap={{
                I: 'text-bg-warning',
                Y: 'text-bg-warning',
                C: 'text-bg-danger',
                RPF: 'text-bg-success',
                RPP: 'text-bg-warning',
                RPE: 'text-bg-warning',
              }}
              defaultText="Sin estado"
            />
          )
        },
      },

      {
        header: 'Estado de la factura',
        size: 100,
        cell: ({ row }: { row: Row<PosOrderData> }) => {
          const invoiceState = row.original.invoice_state
          const invoiceStateDescription = row.original.invoice_state_description

          return (
            <StatusChip
              value={invoiceState || ''}
              description={invoiceStateDescription}
              textMap={{
                T: 'Por facturar',
                P: 'Facturado parcialmente',
                F: 'Facturado por completo',
              }}
              classesMap={{
                T: 'text-bg-warning',
                P: 'text-bg-success',
                F: 'text-bg-success',
              }}
              defaultText="Sin estado"
            />
          )
        },
      },
    ]
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <DndTable
        id="line_id"
        data={data.filter((item) => item.action !== ActionTypeEnum.DELETE)}
        setData={setData}
        columns={columns}
        modifyData={modifyData}
        setModifyData={setModifyData}
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
                  : 5
              }
              className="w-full"
            >
              <div className="flex gap-4">
                <button type="button" className="text-[#017E84]" onClick={addOrderLine}>
                  Agregar línea
                </button>
              </div>
            </td>
          </tr>
        )}
      </DndTable>
    </div>
  )
}

export function FrmBottom({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Fecha de inicio - inline */}
      <FormRow label="" editConfig={editConfig} fieldName={'partner_id'}>
        <div className="flex">
          <div className="flex">
            <div className="mr-3">Importe</div>
            <TextControlled
              name={'amount'}
              control={control}
              errors={errors}
              editConfig={editConfig}
            />
          </div>
          <button className=" mr-4 w-32 bg-[#121b3c] text-white font-semibold py-2 rounded-md">
            Pagar
          </button>
        </div>
      </FormRow>
    </div>
  )
}
