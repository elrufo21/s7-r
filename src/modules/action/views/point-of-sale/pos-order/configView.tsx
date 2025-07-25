import BaseTextControlled from '@/shared/components/form/base/BaseTextControlled'
import {
  frmElementsProps,
  ActionTypeEnum,
  TypeContactEnum,
  FormActionEnum,
} from '@/shared/shared.types'
import PosOrderLines from './components/PosOrderLines'
import { useState, useMemo, useEffect } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DndTable } from '@/shared/components/table/DndTable'
import { AutocompleteTable } from '@/shared/ui/inputs/AutocompleteTable'
import { SwitchableTextField } from '@/shared/components/table/drag-editable-table/base-components/inputs'
import { GrTrash } from 'react-icons/gr'
import { formatCurrency } from '@/shared/helpers/currency'
import useAppStore from '@/store/app/appStore'
import FormRow from '@/shared/components/form/base/FormRow'
import { ContactAutocomplete } from '@/shared/components/form/base/ContactAutocomplete'
import CompanyField from '@/shared/components/extras/CompanyField'
import { DatepickerControlled, TextControlled } from '@/shared/ui'
import { PosOrderStateEnum } from '../types'
import { formatDateTimeToDDMMYYYYHHMM } from '@/shared/utils/utils'

// Tipos específicos para Pagos POS
interface PosPayment {
  payment_id: number
  order_id?: number
  date: string
  payment_method_id: number
  payment_method_name: string
  amount: number
  card_number?: string
  card_issuer?: string
  card_holder_name?: string
  action?: ActionTypeEnum
  _resetKey?: number
}
const date = new Date()

// Pago por defecto
const defaultPosPayment: Partial<PosPayment> = {
  payment_id: 0,
  date: new Date(date.getTime() - date.getTimezoneOffset() * 60000),
  payment_method_id: 0,
  payment_method_name: '',
  amount: 0,
  card_number: '',
  card_issuer: '',
  card_holder_name: '',
  action: ActionTypeEnum.INSERT,
}

export function FrmMiddle({ control, errors, editConfig, setValue, watch }: frmElementsProps) {
  const { formItem, setFrmConfigControls } = useAppStore()
  const isEdit = watch('state') === PosOrderStateEnum.PAID
  useEffect(() => {
    setFrmConfigControls({
      name: {
        isEdit: isEdit,
      },
      order_date: {
        isEdit: isEdit,
      },
      point_name: {
        isEdit: isEdit,
      },
      session_name: {
        isEdit: isEdit,
      },
      user_name: {
        isEdit: isEdit,
      },
    })
  }, [isEdit, watch('state')])
  return (
    <>
      <BaseTextControlled
        label="Ref. de la orden"
        name={'name'}
        control={control}
        errors={errors}
        editConfig={editConfig}
      />
      <FormRow label="Fecha" editConfig={editConfig} fieldName={'order_date'}>
        <DatepickerControlled
          name={'order_date'}
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          rules={[]}
        />
      </FormRow>
      <BaseTextControlled
        label="Punto de venta"
        name={'point_name'}
        control={control}
        errors={errors}
        placeholder={''}
        editConfig={editConfig}
        navigationConfig={{ modelId: 892, recordId: formItem?.point_id }}
      />
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
        label="Usuario"
        name={'user_name'}
        control={control}
        errors={errors}
        editConfig={editConfig}
        navigationConfig={{ modelId: 2, recordId: formItem?.user_partner_id }}
      />
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
    </>
  )
}

export function FrmTab0({ watch, control, errors, setValue, editConfig }: frmElementsProps) {
  return (
    <PosOrderLines
      watch={watch}
      control={control}
      errors={errors}
      setValue={setValue}
      editConfig={editConfig}
    />
  )
}

export function FrmTab1({ watch, setValue }: frmElementsProps) {
  const { formItem, setFrmIsChangedItem, createOptions, frmAction } = useAppStore()
  const [data, setData] = useState<PosPayment[]>([])

  // Estado para manejar modificaciones
  const [modifyData, setModifyData] = useState<boolean>(false)

  // Estado para métodos de pago - usando el patrón estándar
  const [paymentMethodOptions, setPaymentMethodOptions] = useState<{ label: string; value: any }[]>(
    []
  )

  // Función para cargar métodos de pago
  const loadPaymentMethodOptions = async () => {
    try {
      const options = await createOptions({
        fnc_name: 'fnc_pos_payment_method',
        action: 's2',
        filters: [{ column: 'state', value: 'A' }], // Solo métodos activos
      })
      setPaymentMethodOptions(options)
    } catch (error) {
      console.error('Error cargando métodos de pago:', error)
    }
  }

  useEffect(() => {
    if (formItem || frmAction === FormActionEnum.UNDO || watch('payments')) {
      setData(formItem?.payments || watch('payments'))
    }
  }, [formItem, frmAction, watch('payments')])

  // Manejadores de cambios directos sobre el estado
  const handleUpdatePayment = (paymentId: number, newValues: Partial<PosPayment>) => {
    setData((prev) =>
      prev.map((payment) =>
        payment.payment_id === paymentId ? { ...payment, ...newValues } : payment
      )
    )
    setModifyData(true)
  }

  const handleDeletePayment = (paymentId: number) => {
    setData((prev) => prev.filter((payment) => payment.payment_id !== paymentId))
    setModifyData(true)
  }

  const isReadOnly = watch('state') === PosOrderStateEnum.PAID

  // Manejar cambio de método de pago
  const handleChangePaymentMethod = async (
    row: any,
    dataPaymentMethod: {
      rowId: number
      columnId: string
      option: Record<string, any>
    }
  ) => {
    const { option } = dataPaymentMethod

    const fieldUpdate = {
      payment_method_id: option.value,
      payment_method_name: option.label,
    }
    handleUpdatePayment(row.original.payment_id, fieldUpdate)
  }

  // Definir columnas de la tabla
  const columns = useMemo<ColumnDef<PosPayment>[]>(
    () => [
      {
        header: 'Fecha',
        accessorKey: 'payment_date',
        size: 120,
        minSize: 100,
        cell: ({ row }) => (
          <span className="text-sm">{formatDateTimeToDDMMYYYYHHMM(row.original.date)}</span>
        ),
      },
      {
        header: 'Método de pago',
        accessorKey: 'payment_method_id',
        size: 200,
        minSize: 150,
        cell: ({ row, column }) => {
          return isReadOnly ? (
            <div className="text-sm">{row.original.payment_method_name}</div>
          ) : (
            <AutocompleteTable
              row={row}
              column={column}
              options={paymentMethodOptions}
              onChange={(data) => handleChangePaymentMethod(row, data)}
            />
          )
        },
      },
      {
        header: 'Importe',
        accessorKey: 'amount',
        size: 120,
        minSize: 100,
        meta: {
          align: 'right',
        },
        cell: ({ row }) => (
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.amount}
            onBlur={(e) => {
              handleUpdatePayment(row.original.payment_id, {
                amount: Number(e.target.value),
              })
            }}
            onChange={() => {}}
            type="number"
          />
        ),
      },
      {
        header: 'Número de tarjeta (últimos 4 dígitos)',
        accessorKey: 'card_number',
        size: 200,
        minSize: 150,
        cell: ({ row }) => (
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.card_number || ''}
            onBlur={(e) => {
              handleUpdatePayment(row.original.payment_id, {
                card_number: e.target.value,
              })
            }}
            onChange={() => {}}
            type="text"
          />
        ),
      },
      {
        header: 'Emisor de la tarjeta',
        accessorKey: 'card_issuer',
        size: 150,
        minSize: 120,
        cell: ({ row }) => (
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.card_issuer || ''}
            onBlur={(e) => {
              handleUpdatePayment(row.original.payment_id, {
                card_issuer: e.target.value,
              })
            }}
            onChange={() => {}}
            type="text"
          />
        ),
      },
      {
        header: 'Nombre del titular de la tarjeta',
        accessorKey: 'card_holder_name',
        size: 200,
        minSize: 150,
        cell: ({ row }) => (
          <SwitchableTextField
            isReadOnly={isReadOnly}
            value={row.original.card_holder_name || ''}
            onBlur={(e) => {
              handleUpdatePayment(row.original.payment_id, {
                card_holder_name: e.target.value,
              })
            }}
            onChange={() => {}}
            type="text"
          />
        ),
      },
      {
        id: 'action',
        header: '',
        size: 40,
        enableResizing: false,
        cell: ({ row }) => (
          <div className="flex justify-center items-center">
            {watch('state') !== PosOrderStateEnum.PAID ? (
              <button
                type="button"
                onClick={() => handleDeletePayment(row.original.payment_id)}
                disabled={isReadOnly}
              >
                <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
              </button>
            ) : (
              <></>
            )}
          </div>
        ),
      },
    ],
    [paymentMethodOptions]
  )
  // Función para agregar nueva fila
  const addRow = () => {
    const newId = Math.min(...data.map((item) => item.payment_id), 0) - 1
    setData((prev) => [
      ...prev,
      {
        ...defaultPosPayment,
        payment_id: newId,
        _resetKey: Date.now(),
      } as PosPayment,
    ])
    setModifyData(true)
  }

  // Cargar opciones al montar el componente
  useEffect(() => {
    loadPaymentMethodOptions()
  }, [])

  // Manejar cambios en los datos
  useEffect(() => {
    if (modifyData) {
      setValue('payments', data)
      setFrmIsChangedItem(true)
      setValue('payments_change', true)
      setModifyData(false)
    }
  }, [modifyData, data, setValue, setFrmIsChangedItem])

  // Calcular totales
  const totals = useMemo(() => {
    const orderTotal = watch('amount_withtaxed') || 0
    const totalPaid = data
      .filter((payment) => payment.action !== ActionTypeEnum.DELETE)
      .reduce((sum, payment) => sum + (payment.amount || 0), 0)
    const difference = orderTotal - totalPaid

    return {
      total: orderTotal,
      paid: totalPaid,
      difference: difference,
    }
  }, [data, watch])

  return (
    <div className="flex flex-col">
      <DndTable
        data={data}
        setData={setData}
        columns={columns}
        id="payment_id"
        modifyData={modifyData}
        setModifyData={setModifyData}
        onDataChange={(newData) => {
          setValue('payments', newData)
          setFrmIsChangedItem(true)
        }}
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
              <div className="flex gap-4">
                {watch('state') !== PosOrderStateEnum.PAID ? (
                  <button
                    type="button"
                    className="text-[#017e84] hover:text-[#017e84]/80"
                    onClick={addRow}
                  >
                    Agregar una línea
                  </button>
                ) : (
                  <></>
                )}
              </div>
            </td>
          </tr>
        )}
      </DndTable>

      {/* Totales */}
      <PaymentTotals totals={totals} />
    </div>
  )
}

// Componente para mostrar totales
interface PaymentTotalsProps {
  totals: {
    total: number
    paid: number
    difference: number
  }
}

const PaymentTotals = ({ totals }: PaymentTotalsProps) => (
  <div className="flex flex-col gap-2 min-w-[200px] ml-auto p-4 bg-gray-50 rounded-md mt-4">
    <div className="flex justify-between">
      <span>Total:</span>
      <span className="font-medium">{formatCurrency(totals.total)}</span>
    </div>
    <div className="flex justify-between">
      <span>Pagado:</span>
      <span className="font-medium">{formatCurrency(totals.paid)}</span>
    </div>
    <div className="border-t border-gray-300 mt-2 pt-2">
      <div className="flex justify-between font-bold">
        <span>Diferencia:</span>
        <span>{formatCurrency(totals.difference)}</span>
      </div>
    </div>
  </div>
)

export function FrmTab2({ watch, control, errors, setValue, editConfig }: frmElementsProps) {
  return (
    <div className="o_group mt-4">
      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Otra información
            </div>
          </div>
          <BaseTextControlled
            label="Número de recibo"
            name={'receipt_number'}
            control={control}
            errors={errors}
            editConfig={editConfig}
            placeholder={''}
          />
          <BaseTextControlled
            label="Número de orden"
            name={'order_sequence_ft'}
            control={control}
            errors={errors}
            editConfig={editConfig}
            placeholder={''}
          />
          <CompanyField
            control={control}
            errors={errors}
            editConfig={editConfig}
            setValue={setValue}
            watch={watch}
          />
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="o_inner_group grid">
          <div className="g-col-sm-2">
            <div className="o_horizontal_separator mt-6 mb-4 text-uppercase fw-bolder small">
              Información de contacto
            </div>
          </div>

          <BaseTextControlled
            label="Correo electrónico"
            name={'partner_email'}
            control={control}
            errors={errors}
            editConfig={editConfig}
            placeholder={''}
          />

          <BaseTextControlled
            label="Celular"
            name={'partner_phone'}
            control={control}
            errors={errors}
            editConfig={editConfig}
            placeholder={''}
          />
        </div>
      </div>
    </div>
  )
}
export function FrmTab3({ control, errors, editConfig }: frmElementsProps) {
  return (
    <div className="w-full mt-5">
      <TextControlled
        name={'internal_notes'}
        control={control}
        errors={errors}
        multiline={true}
        className={'InputNoLineEx w-full'}
        // placeholder={'Notas internas'}
        editConfig={editConfig}
      />
    </div>
  )
}
