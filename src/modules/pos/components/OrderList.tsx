import { useState, useMemo, useEffect } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import useAppStore from '@/store/app/appStore'
import { DataTable } from './ListView'
import { GrTrash } from 'react-icons/gr'
import { useCart } from '../context/CartContext'
import { useSearch } from '../context/SearchContext'

type Order = {
  move_id: string
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
  amount_total_in_currency: string
  state: string
  id?: number | string
  amount_total: number
}

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'P', label: 'Publicado' },
  { value: 'D', label: 'Borrador' },
]

export const OrderList = () => {
  const { cartFill, setOrderCart, setSelectedOrder, orderCart } = useCart()
  const { executeFnc } = useAppStore()
  const { setScreen, setSelectedNavbarMenu } = useSearch()
  const [loading, setLoading] = useState<boolean>(true)
  const [filteredData, setFilteredData] = useState<Order[]>([])
  useEffect(() => {
    setFilteredData(orderCart)
  }, [orderCart])
  console.log('filteredData', filteredData)

  const columnHelper = createColumnHelper<Order>()

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: 'date',
        columns: [
          columnHelper.accessor('date', {
            cell: () => (
              <div className="flex flex-col">
                {/* <span className="font-medium">{info.getValue()}</span> */}
                {/* <span className="text-gray-500 text-sm">{info.row.original.invoice_date}</span> */}

                <span className="font-medium">06/05/2025</span>
                {/* <span className="fw-bolder">06/05/2025</span> */}

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
          columnHelper.accessor('name', {
            cell: (info) => (
              <div className="flex flex-col">
                <span className="font-medium">{info.getValue()}</span>
                {/* <span className="fw-bolder">{info.getValue()}</span> */}

                <span className="text-gray-500 text-sm">{info.row.original.name}</span>
              </div>
            ),
            header: 'Documento',
          }),
        ],
      }),
      columnHelper.accessor('partner_name', {
        // cell: (info) => info.getValue(),

        cell: (info) => (
          <span className="font-medium">{info.getValue() || 'Empresa CONTRATISTAS'}</span>
        ),
        // cell: (info) => <span className="fw-bolder">{info.getValue()}</span>,
      }),
      columnHelper.accessor('amount_total_in_currency', {
        // cell: (info) => <span className="font-medium">{info.getValue()}</span>,
        cell: (info) => (
          <div className="font-medium text-right">
            S/&nbsp;{Number.parseFloat(info.row.original.amount_total).toFixed(2)}
          </div>
        ),
      }),
      columnHelper.accessor('pos_status', {
        cell: (info) => (
          <div className="flex justify-between items-center">
            <span
              className={`px-3 py-1 rounded-md text-sm ${
                info.getValue() === 'C' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {info.getValue() === 'C' ? 'En curso' : 'Pago'}
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
            </button>
          </div>
        ),
      }),
    ],
    []
  )
  useEffect(() => {
    if (orderCart.length === 0) {
      const order_id = crypto.randomUUID()
      setOrderCart([{ id_order: order_id, number_order: 1, name: order_id, cart: [] }])
      setSelectedOrder(order_id)
    }
  }, [orderCart])

  const handleDeleteClick = async (row: Order) => {
    setFilteredData((prevData) => prevData.filter((order) => order.move_id !== row.move_id))
    setOrderCart((prevData) => prevData.filter((order) => order.id_order !== row.move_id))
    await executeFnc('fnc_account_move', 'd', [row.move_id])
  }

  const handleStatusChange = (value: string) => {
    if (value === 'all') {
      setFilteredData(orderCart)
    } else {
      setFilteredData(orderCart.filter((order) => order.state === value))
    }
  }

  const handleDobleClick = async (row: Order) => {
    const existOrder = orderCart.find((item) => item.id_order === row?.id_order)
    console.log('existOrder', existOrder, row, orderCart)
    if (existOrder) {
      setSelectedOrder(row?.id_order)
      setSelectedNavbarMenu('R')
      setScreen('product')
      return
    }
    /* setSelectedOrder(row?.move_id)
    /*const res = await fetchInvoice(row?.move_id)
    const dataCart = res[0]?.move_lines.map((item: any) => ({
      product_id: item.product_id,
      name: item.name,
      sale_price: item.price_unit,
      quantity: item.quantity,
      uom_name: item.uom_name,
    }))

    setOrderCart((prevOrderCart) => [
      ...prevOrderCart,
      {
        id_order: res[0]?.move_id,
        number_order: prevOrderCart.length ? prevOrderCart.length + 1 : 1,
        cart: dataCart,
      },
    ])
    setSelectedOrder(res[0]?.move_id)
    setScreen('product')
    */
  }

  const handleRowClick = async (row: Order) => {
    console.log('row', row)
    // const res = await fetchInvoice(row?.move_id)
    /* const dataCart = res[0]?.move_lines.map((item: any) => ({
      product_id: item.product_id,
      name: item.name,
      sale_price: item.price_unit || 0,
      quantity: item.quantity,
      uom_name: item.uom_name,
      uom_id: item.uom_id,
    }))*/
    cartFill(orderCart.find((item) => item.id_order === row?.id_order)?.cart || [])
  }

  return (
    <div className="w-full h-full">
      <DataTable
        columns={columns as any}
        data={filteredData}
        enablePagination={true}
        enableSearch={true}
        pageSize={10}
        searchPlaceholder="Buscar órdenes ..."
        statusOptions={statusOptions}
        onStatusChange={handleStatusChange}
        noDataMessage={loading ? 'Cargando órdenes ...' : 'No se encontraron órdenes'}
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
