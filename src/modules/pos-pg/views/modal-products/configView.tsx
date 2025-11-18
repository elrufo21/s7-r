import { frmElementsProps } from '@/shared/shared.types'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { DataTable } from '../../components/ListView'
import useAppStore from '@/store/app/appStore'

export function FrmMiddle({ watch }: frmElementsProps) {
  const {
    closeDialogWithData,
    setTemporaryProductByPositionPg,
    setTemporaryProductPg,
    selectedOrderPg,
    orderDataPg,
  } = useAppStore()
  const order = orderDataPg.find((o) => o.order_id === selectedOrderPg)
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        header: 'Producto',
        accessorKey: 'name',
        cell: (info) => <div className="uppercase ">{info.row.original.name}</div>,
      },
      {
        header: 'Precio',
        accessorKey: 'sale_price',
        cell: (row) => <div>{Number(row?.row?.original?.sale_price).toFixed(2)}</div>,
      },
    ],
    []
  )
  return (
    <DataTable
      columns={columns}
      data={watch('products')}
      searchPlaceholder="Buscar producto ..."
      onRowClick={(e) => {
        setTemporaryProductPg(e, 0)
        setTemporaryProductByPositionPg(order.position_pg, order.payment_state, e)
        closeDialogWithData(watch('dialogId'), {})
      }}
    />
  )
}
