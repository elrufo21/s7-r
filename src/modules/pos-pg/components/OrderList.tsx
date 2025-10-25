import { useMemo, useEffect } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import useAppStore from '@/store/app/appStore'
import { DataTable } from './ListView'
import { GrTrash } from 'react-icons/gr'
import { TypeStateOrder, TypeStatePayment } from '../types'
import { formatShortDate, getHour } from '@/shared/utils/dateUtils'
import { OfflineCache } from '@/lib/offlineCache'
import { Enum_Payment_State } from '@/modules/invoicing/invoice.types'

type Order = {
  order_id: string
  date: string
  time: string
  orderNumber: string
  orderCode: string
  client: string
  amount: string
  status: string
  invoice_date: string
  name: string
  partner_name: string
  state: string
  id?: number | string
  amount_withtaxed_in_currency: string
  order_name: string
  order_sequence_ft: string
  receipt_number: string
  state_description: string
  payment_state: string
  combined_states: string
}

const statusOptions = [
  {
    label: 'Pagado',
    value: TypeStateOrder.PAID,
  },
  {
    label: 'Pago pendiente',
    value: TypeStateOrder.PENDING_PAYMENT,
  },
  {
    label: 'Pago parcial',
    value: TypeStateOrder.PARTIAL_PAYMENT,
  },
  {
    label: 'Todo',
    value: TypeStateOrder.ALL,
  },
]

export const OrderList = () => {
  const {
    setScreenPg,
    orderDataPg,
    selectedOrderPg,
    setSelectedOrderPg,
    setCartPg,
    executeFnc,
    deleteOrderPg,
    setSelectedNavbarMenuPg,
    paidOrdersPg,
    setOrderSelectedPg,
    setTotalPg,
    getTotalPriceByOrderPg,
    localModePg,
    setSelectedOrderInListPg,
    selectedOrderInListPg,
  } = useAppStore()
  useEffect(() => {
    setSelectedOrderInListPg(orderDataPg[orderDataPg?.length - 1]?.order_id)
    setCartPg(orderDataPg.find((o) => o.order_id === selectedOrderPg)?.lines || [])
  }, [])

  const cache = new OfflineCache()

  const columnHelper = createColumnHelper<Order>()

  const stateLabels: Record<string, string> = {
    I: 'En curso',
    Y: 'Pago',
    R: 'Registrado',
    // C: 'Cancelado',

    RPE: 'Pago pendiente',
    RPP: 'Pago parcial',
    RPF: 'Pagado',

    CPE: 'Cancelado',
    CPP: 'Cancelado',
    CPF: 'Cancelado',
  }

  const filterFunction = (data: Order[], filterValue: string) => {
    if (filterValue === TypeStateOrder.ALL) {
      return data.filter((item: any) => {
        const paymentState = item?.payment_state || item?.payment_state
        return item.state !== 'Y' && item.state !== 'I'
      })
    }

    if (filterValue === TypeStateOrder.PAID) {
      const filtered = data.filter((item: any) => {
        const paymentState = item?.payment_state || item?.payment_state
        return paymentState === 'PF' && item.state === 'R'
      })
      return filtered
    }

    if (filterValue === TypeStateOrder.PENDING_PAYMENT) {
      const filtered = data.filter((item: any) => {
        const paymentState = item?.payment_state || item?.payment_state
        return paymentState === 'PE' && item.state === 'R'
      })
      return filtered
    }

    if (filterValue === TypeStateOrder.PARTIAL_PAYMENT) {
      const filtered = data.filter((item: any) => {
        const paymentState = item?.payment_state || item?.payment_state
        return paymentState === 'PP' && item.state === 'R'
      })
      return filtered
    }

    return data
  }

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'date',
        columns: [
          columnHelper.accessor('date', {
            cell: (info) => (
              <div
                className="flex flex-col truncate pointer-events-none"
                onDoubleClick={() => handleDobleClick(info.row.original)}
              >
                <span
                  // className="font-medium pointer-events-none"
                  /*className={`font-medium pointer-events-none ${info.row.original.state == 'C' ? 'text-red-600' : 'text-black'
                    }`}*/
                  className={`grid-col ${info.row.original.combined_states} font-medium pointer-events-none`}
                >
                  {formatShortDate(info.row?.original?.order_date || '')}
                </span>

                <span
                  // className="text-gray-500 text-sm pointer-events-none"
                  /*className={`text-sm pointer-events-none ${info.row.original.state == 'C' ? 'text-red-600' : 'text-black'
                    }`}*/
                  className={`grid-col ${info.row.original.combined_states} text-sm pointer-events-none`}
                >
                  {getHour(info.row.original.order_date || '')}
                </span>
              </div>
            ),
            header: 'Fecha',
          }),
        ],
      }),
      columnHelper.group({
        id: 'name',
        columns: [
          columnHelper.accessor('order_name', {
            cell: (info) => (
              <div className="flex flex-col truncate pointer-events-none">
                {/*
                <span className="font-medium pointer-events-none">
                  {String(info.row.original.order_sequence).padStart(4, '0')}
                </span>
                <span className="text-gray-500 text-sm pointer-events-none">
                  {info.row.original.receipt_number}
                </span>
                */}

                <span
                  /*className={`font-medium pointer-events-none ${info.row.original.state == 'C' ? 'text-red-600' : 'text-black'
                    }`}*/
                  className={`grid-col ${info.row.original.combined_states} font-medium pointer-events-none`}
                >
                  {info.row.original.receipt_number}
                </span>
              </div>
            ),
            header: 'Documento',
          }),
        ],
      }),
      columnHelper.accessor('partner_name', {
        cell: (info) => (
          <span
            // className="font-medium truncate pointer-events-none"
            /*className={`font-medium truncate pointer-events-none ${info.row.original.state == 'C' ? 'text-red-600' : 'text-black'
              }`}*/
            className={`grid-col ${info.row.original.combined_states} font-medium truncate pointer-events-none`}
          >
            {info.row.original.partner_name || 'Sin cliente'}
          </span>
        ),
      }),
      columnHelper.accessor('amount_withtaxed_in_currency', {
        cell: (info) => (
          <div
            // className="font-medium text-right min-w-[100px] truncate pointer-events-none"
            /*className={`font-medium text-right min-w-[100px] truncate pointer-events-none ${info.row.original.state == 'C' ? 'text-red-600' : 'text-black'
              }`}*/
            className={`grid-col ${info.row.original.combined_states} font-medium text-right min-w-[100px] truncate pointer-events-none`}
          >
            S/ {Number(getTotalPriceByOrderPg(info.row.original.order_id)).toFixed(2)}
          </div>
        ),
      }),
      columnHelper.accessor('combined_states', {
        id: 'stateLabel',
        cell: (info) => {
          const value = info.getValue()
          return (
            <div className="flex justify-between items-center min-w-[80px] pointer-events-none">
              <span
                // className={`px-3 py-1 rounded-md text-sm bg-gray-200 text-gray-800`}
                /*className={`px-3 py-1 rounded-md text-sm ${info.row.original.state == 'C' ? 'bg-red-400 text-white' : 'bg-gray-200 text-gray-800'
                  }`}*/
                className={`grid-col-chip ${info.row.original.combined_states} px-3 py-1 rounded-md text-sm`}
              >
                {stateLabels[value] || 'Desconocido'}
              </span>
            </div>
          )
        },
      }),
      columnHelper.accessor('state', {
        id: 'stateActions',
        cell: (info) => (
          <div className="flex justify-between items-center">
            {info.row.original.state !== TypeStateOrder.REGISTERED &&
              info.row.original.state !== TypeStateOrder.CANCELED && (
                <button
                  className="text-gray-800 hover:text-red-600 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClick(info.row.original)
                  }}
                >
                  <GrTrash style={{ fontSize: '16px' }} />
                </button>
              )}
          </div>
        ),
      }),
    ],
    [orderDataPg, cache.getOfflinePosOrders()]
  )

  const handleDeleteClick = async (row: Order) => {
    await cache.init()
    if (localModePg) {
      await cache.markOrderAsDeleted(row.order_id)
      deleteOrderPg(row.order_id)
      return
    }
    await executeFnc('fnc_pos_order', 'd', [row.order_id])
    deleteOrderPg(row.order_id)
  }

  const handleStatusChange = (value: string) => {
    // Lógica adicional si es necesaria
  }

  const handleDobleClick = async (row: Order) => {
    if (row.state === TypeStateOrder.REGISTERED || row.state === TypeStateOrder.CANCELED) return
    const existOrder = orderDataPg.find((item) => item.order_id === row?.order_id)
    if (existOrder) {
      setSelectedOrderPg(row?.order_id)
      setSelectedNavbarMenuPg('R')
      setScreenPg('products')
    }
  }

  const handleRowClick = async (row: Order) => {
    setSelectedOrderInListPg(row.order_id)
    const orderSource = row.state === 'P' || row.state === 'E' ? paidOrdersPg : orderDataPg
    const order = orderSource.find((item: any) => item.order_id === row.order_id)

    if (order && order.lines) {
      setCartPg(order.lines)

      const total = order.lines.reduce((acc: number, line: any) => {
        const quantity = Number(line.quantity) || 0
        const price = Number(line.price_unit) || 0
        return acc + quantity * price
      }, 0)

      setTotalPg(total)
      setOrderSelectedPg({ order_id: row.order_id, state: row.state })
    } else {
      setOrderSelectedPg({ order_id: row.order_id, state: row.state })
      setCartPg([])
      setTotalPg(0)
    }
  }

  return (
    <div className="w-full h-full">
      <DataTable
        columns={columns as any}
        data={orderDataPg}
        enablePagination={false}
        enableSearch={true}
        pageSize={10}
        searchPlaceholder="Buscar órdenes ..."
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        filterFunction={filterFunction}
        className="rounded-lg"
        selectedRowId={selectedOrderInListPg}
        rowIdField="order_id"
        onRowClick={(row: any) => {
          handleRowClick(row)
        }}
        onRowDoubleClick={(row: any) => {
          handleDobleClick(row)
        }}
        enablePagination={false}
        defaultStatus={TypeStateOrder.ALL}
      />
    </div>
  )
}
