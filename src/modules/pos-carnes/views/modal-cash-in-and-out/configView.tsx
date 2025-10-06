import contactsConfig from '@/modules/pos/views/contact-index/config.tsx'
import { frmElementsProps } from '@/shared/shared.types'
import { PosTextControlled } from '@/shared/ui/inputs/PosTextControlled'
import useAppStore from '@/store/app/appStore'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { DataTable } from '../../components/ListView'
import { PaymentMethodCard } from '@/modules/pos-carnes/components/Payment'
import { ModalBase } from '@/shared/components/modals/ModalBase'
import { CustomHeader } from '../../components/CustomHeader'
import { FrmBaseDialog } from '@/shared/components/core'
import { TypeOriginPaymen, TypePayment } from '../../types'
import { formatShortDate, getHour } from '@/shared/utils/dateUtils'
import { GrTrash } from 'react-icons/gr'
import { CustomToast } from '@/components/toast/CustomToast'
enum buttonType {
  CASH_IN = 'I',
  CASH_OUT = 'O',
}

export function FrmMiddle({ control, errors, setValue, watch }: frmElementsProps) {
  const { modalData, setModalData, openDialog, closeDialogWithData, executeFnc } = useAppStore()
  const [selected, setSelected] = useState(buttonType.CASH_IN)
  const paymentMethods = watch('paymentMethods') || []
  useEffect(() => {
    setSelected(watch('type'))
  }, [])
  const fnc_create_customer = () => {
    let getData = () => ({})
    const dialogId = openDialog({
      title: 'Crear cliente',
      contactModal: true,
      dialogContent: () => (
        <FrmBaseDialog config={contactsConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()

            const rs = await executeFnc('fnc_partner', 'i', formData)
            //oj_data.partner_id
            const newData = await executeFnc('fnc_partner', 's', [[1, 'pag', 1]])
            const dataUpdate = newData.oj_data.map((item: any) => {
              if (item.partner_id === rs.oj_data.partner_id) {
                return {
                  ...item,
                  selected: true,
                }
              }
              return item
            })
            const partner = newData.oj_data.find((n) => n.partner_id === rs.oj_data.partner_id)
            setModalData(dataUpdate)
            setValue('partner_id', rs.oj_data.partner_id)
            setValue('partner_name', partner.name)
            closeDialogWithData(dialogId, {})
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialogId, {}),
        },
      ],
    })
  }

  /*
  const fnc_open_contact_modal = async () => {
    const localCustomers = watch('customers')
    if (modalData.length === 0) setModalData(localCustomers)
    const dialogId = openDialog({
      title: 'Elija un cliente',
      contactModal: true,
      dialogContent: () => (
        <ModalBase
          config={contactsConfig}
          onRowClick={(row) => {
            if (row.partner_id === watch('customer_id')) {
              closeDialogWithData(dialogId, {})
              return
            }
            setValue('partner_id', row.partner_id)
            setValue('partner_name', row.name)
            closeDialogWithData(dialogId, row)
          }}
          contactModal={true}
          // comentado openEditModal
          openEditModal={(client: any) => {
            fnc_edit_client(client)
          }}
          customHeader={<CustomHeader fnc_create_button={fnc_create_customer} />}
        />
      ),
      buttons: [
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => {
            closeDialogWithData(dialogId, {})
          },
        },
      ],
    })
  }
  */

  return (
    <div className="min-w-[700px] max-w-[700px] min-h-[290px] max-h-[290px]">
      <div className="flex flex-row gap-4">
        <div className="basis-1/2">
          <button
            className={`w-full btn btn-lg lh-lg ${selected === buttonType.CASH_IN ? 'btn-success' : 'btn-secondary'}`}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setValue('type', buttonType.CASH_IN)
              setSelected(buttonType.CASH_IN)
            }}
          >
            <span className="font-medium">Entrada de efectivo</span>
          </button>
        </div>

        <div className="basis-1/2">
          <button
            className={`w-full btn btn-lg lh-lg ${selected === buttonType.CASH_OUT ? 'btn-danger' : 'btn-secondary'}`}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              setValue('type', buttonType.CASH_OUT)
              setSelected(buttonType.CASH_OUT)
            }}
          >
            <span className="font-medium">Salida de efectivo</span>
          </button>
        </div>
      </div>

      <div className="o_inner_group flex mt-4 !mb-0">
        <div className="">
          <div className="grid grid-cols-1 gap-4 w-[230px]">
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.payment_method_id}
                method={method}
                onClick={() => {
                  setValue('payment_method_id', method.payment_method_id)
                }}
                bg={
                  watch('payment_method_id') === method.payment_method_id
                    ? 'bg-green-100 '
                    : 'bg-gray-100'
                }
              />
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <PosTextControlled
            className="!w-[200px]"
            name="amount"
            placeholder="Importe"
            control={control}
            errors={errors}
          />
          <PosTextControlled
            name="reason"
            placeholder="Motivo"
            multiline={true}
            control={control}
            errors={errors}
          />
        </div>
      </div>
    </div>
  )
}
export function FrmTab1() {
  const { executeFnc } = useAppStore()

  const getPayments = async () => {
    const { oj_data } = await executeFnc('fnc_pos_payment', 's', [
      [0, 'fequal', 'origin', TypeOriginPaymen.DIRECT_PAYMENT],
    ])
    setData(oj_data || [])
  }
  const [data, setData] = useState([])
  useEffect(() => {
    getPayments()
  }, [])

  const handleDelete = async (row) => {
    try {
      setData((prev) => prev.filter((item) => item.payment_id !== row.payment_id))

      await executeFnc('fnc_pos_payment', 'd', [row.payment_id])
      CustomToast({ title: 'Exito', description: 'Se elimino el pago', type: 'info' })
    } catch (error) {
      console.error(error)
      await getPayments()
    }
  }

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Fecha',
        accessorKey: 'date',
        cell: (info) => (
          <div className="flex flex-col truncate pointer-events-none">
            <span className="font-medium text-left pointer-events-none">
              {formatShortDate(info.row?.original?.date || '', true)}
            </span>
            <span className="text-gray-500 text-left text-sm pointer-events-none">
              {getHour(info.row.original.date || '')}
            </span>
          </div>
        ),
      },
      {
        header: 'Método de pago',
        accessorKey: 'payment_method_name',
        className: 'text-left font-medium',
      },
      {
        header: 'Motivo',
        accessorKey: 'reason',
        className: ' text-left font-medium',
      },
      {
        header: 'Tipo',
        accessorKey: 'type',
        cell: (info) => {
          if (!info?.row.original) return <></>
          const state = info?.row.original.type
          const description = state == TypePayment.INPUT ? 'Entrada' : 'Salida'
          const defineClass = (state: string) => {
            if (state === TypePayment.INPUT) return 'text-bg-info'
            if (state === TypePayment.OUTPUT) return 'text-bg-danger'
            return ''
          }
          return (
            <div className="w-full flex justify-center align-middle items-center">
              <div className={`chip_demo ${defineClass(state)}`}>{description}</div>
            </div>
          )
        },
      },
      {
        header: 'Importe',
        accessorKey: 'amount_in_currency',
        className: ' text-right font-medium',
      },
      {
        header: '',
        id: 'stateActions',
        cell: (info) => (
          <div className="flex justify-between items-center">
            <button
              className="text-gray-800 hover:text-red-600 px-2"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                handleDelete(info.row.original)
              }}
            >
              <GrTrash style={{ fontSize: '16px' }} />
            </button>
          </div>
        ),
      },
    ],
    []
  )

  return (
    <div className="w-[1000px] max-h-[500px] overflow-auto">
      <DataTable columns={columns} data={data} header />
    </div>
  )
}
