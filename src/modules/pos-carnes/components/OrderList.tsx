import { useMemo, useEffect } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import useAppStore from '@/store/app/appStore'
import { DataTable } from './ListView'
import { GrTrash } from 'react-icons/gr'
import { TypeStateOrder, TypeStatePayment } from '../types'
import { formatShortDate, getHour } from '@/shared/utils/dateUtils'
import { OfflineCache } from '@/lib/offlineCache'

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
    label: 'Activo',
    value: TypeStateOrder.ACTIVE,
    children: [
      { label: 'En curso', value: TypeStateOrder.IN_PROGRESS },
      { label: 'Pago', value: TypeStateOrder.PAY },
    ],
  },
  {
    label: 'Cerrado',
    value: TypeStateOrder.CLOSE,
    children: [
      {
        label: 'Pago pendiente',
        value: TypeStateOrder.PENDING_PAYMENT,
      },
      {
        label: 'Pago parcial',
        value: TypeStateOrder.PARTIAL_PAYMENT,
      },
      {
        label: 'Pagado',
        value: TypeStateOrder.PAID,
      },
    ],
  },
  {
    label: 'Todo',
    value: TypeStateOrder.ALL,
  },
]

export const OrderList = () => {
  const {
    setScreen,
    orderData,
    selectedOrder,
    setSelectedOrder,
    setCart,
    executeFnc,
    deleteOrder,
    setSelectedNavbarMenu,
    paidOrders,
    setOrderSelected,
    setTotal,
    getTotalPriceByOrder,
    localMode,
    setSelectedOrderInList,
    selectedOrderInList,
  } = useAppStore()

  useEffect(() => {
    setSelectedOrderInList(orderData[orderData?.length - 1]?.order_id)
    setCart(orderData.find((o) => o.order_id === selectedOrder)?.lines || [])
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

  // Función de filtrado personalizada
  const filterFunction = (data: Order[], filterValue: string) => {
    if (filterValue === TypeStateOrder.PAID) {
      return data.filter((item: any) => item?.payment_state === TypeStatePayment.PAYMENT)
    } else if (filterValue === TypeStateOrder.ACTIVE) {
      return data.filter(
        (item: any) =>
          item?.state === TypeStateOrder.PAY || item?.state === TypeStateOrder.IN_PROGRESS
      )
    } else if (filterValue === TypeStateOrder.PENDING_PAYMENT) {
      return data.filter((item: any) => item?.payment_state === TypeStatePayment.PENDING_PAYMENT)
    } else if (filterValue === TypeStateOrder.PARTIAL_PAYMENT) {
      return data.filter((item: any) => item?.payment_state === TypeStatePayment.PARTIAL_PAYMENT)
    } else if (filterValue === TypeStateOrder.ALL) {
      return data
    } else if (filterValue === TypeStateOrder.CLOSE) {
      return data.filter((item: any) => item?.state === TypeStateOrder.REGISTERED)
    } else {
      return data.filter((item: any) => item?.state === filterValue)
    }
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
            S/ {Number(getTotalPriceByOrder(info.row.original.order_id)).toFixed(2)}
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
    [orderData, cache.getOfflinePosOrders()]
  )

  const handleDeleteClick = async (row: Order) => {
    await cache.init()
    if (localMode) {
      await cache.markOrderAsDeleted(row.order_id)
      deleteOrder(row.order_id)
      return
    }
    await executeFnc('fnc_pos_order', 'd', [row.order_id])
    deleteOrder(row.order_id)
  }

  const handleStatusChange = (value: string) => {
    // Lógica adicional si es necesaria
  }

  const handleDobleClick = async (row: Order) => {
    if (row.state === TypeStateOrder.REGISTERED || row.state === TypeStateOrder.CANCELED) return
    const existOrder = orderData.find((item) => item.order_id === row?.order_id)
    if (existOrder) {
      setSelectedOrder(row?.order_id)
      setSelectedNavbarMenu('R')
      setScreen('products')
    }
  }

  const handleRowClick = async (row: Order) => {
    setSelectedOrderInList(row.order_id)
    const orderSource = row.state === 'P' || row.state === 'E' ? paidOrders : orderData
    const order = orderSource.find((item: any) => item.order_id === row.order_id)

    if (order && order.lines) {
      setCart(order.lines)

      const total = order.lines.reduce((acc: number, line: any) => {
        const quantity = Number(line.quantity) || 0
        const price = Number(line.price_unit) || 0
        return acc + quantity * price
      }, 0)

      setTotal(total)
      setOrderSelected({ order_id: row.order_id, state: row.state })
    } else {
      setOrderSelected({ order_id: row.order_id, state: row.state })
      setCart([])
      setTotal(0)
    }
  }

  return (
    <div className="w-full h-full">
      <DataTable
        columns={columns as any}
        data={orderData}
        enablePagination={true}
        enableSearch={true}
        pageSize={10}
        searchPlaceholder="Buscar órdenes ..."
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        filterFunction={filterFunction}
        className="rounded-lg"
        selectedRowId={selectedOrderInList}
        rowIdField="order_id"
        onRowClick={(row: any) => {
          handleRowClick(row)
        }}
        onRowDoubleClick={(row: any) => {
          handleDobleClick(row)
        }}
      />
    </div>
  )
}
