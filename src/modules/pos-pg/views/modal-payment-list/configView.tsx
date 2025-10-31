import { useEffect, useMemo, useState } from 'react'
import { Type_pos_payment_origin, TypePayment } from '../../types'
import useAppStore from '@/store/app/appStore'
import { CustomToast } from '@/components/toast/CustomToast'
import { ColumnDef } from '@tanstack/react-table'
import { formatShortDate, getHour } from '@/shared/utils/dateUtils'
import { GrTrash } from 'react-icons/gr'
import { DataTable } from '../../components/ListView'
import { frmElementsProps } from '@/shared/shared.types'
import { usePWA } from '@/hooks/usePWA'
import { offlineCache } from '@/lib/offlineCache'

export function FrmMiddle({ watch }: frmElementsProps) {
  const { isOnline } = usePWA()
  const { executeFnc } = useAppStore()
  const getPayments = async () => {
    if (isOnline) {
      const { oj_data } = await executeFnc('fnc_pos_payment', 's', [
        ['0', 'fequal', 'session_id', watch('session_id')],
        [
          0,
          'fequal',
          'origin',
          watch('typeForm') === 'pg_payments_list'
            ? Type_pos_payment_origin.PAY_DEBT
            : Type_pos_payment_origin.DIRECT_PAYMENT,
        ],
      ])
      setData(oj_data || [])
    } else {
      const offlinePayments = await offlineCache.getOfflinePaymentsByOrigin(
        watch('typeForm') === 'pg_payments_list'
          ? Type_pos_payment_origin.PAY_DEBT
          : Type_pos_payment_origin.DIRECT_PAYMENT
      )
      setData(offlinePayments || [])
    }
  }
  const [data, setData] = useState([])
  useEffect(() => {
    getPayments()
  }, [])

  const handleDelete = async (row: any) => {
    try {
      setData((prev) => prev.filter((item: any) => item.payment_id !== row.payment_id))

      await executeFnc('fnc_pos_payment', 'd', [row.payment_id])
      CustomToast({
        title: 'Exito',
        description: 'Se elimino el pago correctamente',
        type: 'success',
      })
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
        header: 'Cajero',
        accessorKey: 'user_name',
        className: ' text-left font-medium',
      },
      {
        header: 'Motivo',
        accessorKey: 'reason',
        className: ' text-left font-medium',
      },
      {
        header: 'Método de pago',
        accessorKey: 'payment_method_name',
        className: 'text-left font-medium',
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
    <div className="w-[1000px] max-h-[500px] overflow-hidden">
      {/*<DataTable columns={columns} data={data} header />*/}
      <DataTable columns={columns} data={data} searchPlaceholder="Buscar pago ..." />
    </div>
  )
}
