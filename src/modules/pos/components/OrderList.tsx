import { useMemo, useEffect } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import useAppStore from '@/store/app/appStore'
import { DataTable } from './ListView'
import { GrTrash } from 'react-icons/gr'

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
}

const statusOptions = [
  {
    label: 'Activo',
    value: 'A',
    children: [
      { label: 'En curso', value: 'I' },
      { label: 'Pago', value: 'Y' },
      // { label: 'Recepción', value: 'R' },
    ],
  },
  {
    label: 'Pagado',
    value: 'P',
  },
]

export const OrderList = () => {
  const {
    setScreen,
    orderData,
    setSelectedOrder,
    setCart,
    addNewOrder,
    executeFnc,
    deleteOrder,
    setSelectedNavbarMenu,
    paidOrders,
    setOrderSelected,
    setTotal,
  } = useAppStore()

  const columnHelper = createColumnHelper<Order>()

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'date',
        columns: [
          columnHelper.accessor('date', {
            cell: () => (
              <div className="flex flex-col">
                <span className="font-medium">06/05/2025</span>
                <span className="text-gray-500 text-sm">18:40</span>
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
              <div className="flex flex-col truncate">
                <span className="font-medium">{info.row.original.order_sequence_ft}</span>
                <span className="text-gray-500 text-sm">{info.row.original.receipt_number}</span>
              </div>
            ),
            header: 'Documento',
          }),
        ],
      }),
      columnHelper.accessor('partner_name', {
        // cell: (info) => info.getValue(),

        cell: (info) => <span className="font-medium truncate">{info.getValue()}</span>,
        // cell: (info) => <span className="fw-bolder">{info.getValue()}</span>,
      }),
      columnHelper.accessor('amount_withtaxed_in_currency', {
        // cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        cell: (info) => (
          <div className="font-medium text-right min-w-[100px] truncate">
            {/* S/&nbsp;{Number.parseFloat(info.row.original.amount_withtaxed_in_currency).toFixed(2)} */}
            {info.row.original.amount_withtaxed_in_currency}
          </div>
        ),
      }),
      columnHelper.accessor('state', {
        cell: (info) => (
          <div className="flex justify-between items-center min-w-[80px]">
            <span
              className={`px-3 py-1 rounded-md text-sm ${
                info.getValue() === 'C' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {/*{info.getValue() === 'C' ? 'En curso' : 'Pago'}*/}
              {info.row.original.state_description}
            </span>
            {/* 
            <button
              className="text-gray-800 hover:text-red-600 px-2"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteClick(info.row.original)
              }}
            >
              <GrTrash
                style={{ fontSize: '15px' }}
              // className="hover:text-red-600 cursor-pointer"
              // onClick={() => handleDelete(row.original.bank_account_id)}
              />

            </button> */}
          </div>
        ),
      }),
      columnHelper.accessor('state', {
        cell: (info) => (
          <div className="flex justify-between items-center">
            {info.row.original.state !== 'P' && (
              <button
                className="text-gray-800 hover:text-red-600 px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteClick(info.row.original)
                }}
              >
                <GrTrash
                  style={{ fontSize: '16px' }}
                  // className="hover:text-red-600 cursor-pointer"
                  // onClick={() => handleDelete(row.original.bank_account_id)}
                />
              </button>
            )}
          </div>
        ),
      }),
    ],
    []
  )
  useEffect(() => {
    if (orderData.length === 0) {
      addNewOrder({})
    }
  }, [orderData])
  const handleDeleteClick = async (row: Order) => {
    await executeFnc('fnc_pos_order', 'd', [row.order_id])
    deleteOrder(row.order_id)
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      //
    } else {
      //
    }
  }

  const handleDobleClick = async (row: Order) => {
    if (row.state === 'P') return
    const existOrder = orderData.find((item) => item.order_id === row?.order_id)
    if (existOrder) {
      setSelectedOrder(row?.order_id)
      setSelectedNavbarMenu('R')
      setScreen('products')
      return
    }
  }

  const handleRowClick = async (row: Order) => {
    const orderSource = row.state === 'P' ? paidOrders : orderData
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
        //noDataMessage={loading ? 'Cargando órdenes ...' : 'No se encontraron órdenes'}
        className="rounded-lg"
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
