import React, { useState, useEffect } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  PaginationState,
} from '@tanstack/react-table'
import { BiLoader, BiSearch } from 'react-icons/bi'

import { IoMdArrowDropleft } from 'react-icons/io'
import { IoMdArrowDropright } from 'react-icons/io'
import HierarchicalDropdown from './hierarchical-dropdown'
import useAppStore from '@/store/app/appStore'
import { useParams } from 'react-router-dom'
import { TypeStateOrder, TypeStatePayment } from '../types'
import { offlineCache } from '@/lib/offlineCache'

export type DataTableProps<TData extends object, TValue = any> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  enablePagination?: boolean
  enableSearch?: boolean
  pageSize?: number
  searchPlaceholder?: string
  statusOptions?: { value: string; label: string }[]
  onStatusChange?: (value: string) => void
  onSearchChange?: (value: string) => void
  noDataMessage?: string
  className?: string
  isLoading?: boolean
  header?: boolean
  selectedRowId?: string
  rowIdField?: keyof TData
}

export function DataTable<TData extends { isSelected?: boolean }, TValue = any>({
  columns,
  data,
  onRowClick,
  onRowDoubleClick,
  enablePagination = true,
  enableSearch = true,
  pageSize = 20,
  searchPlaceholder = 'Search...',
  statusOptions,
  onStatusChange,
  onSearchChange,
  noDataMessage = 'No se encontraron resultados',
  className = '',
  isLoading = false,
  header = false,
  selectedRowId,
  rowIdField = 'order_id' as keyof TData,
}: DataTableProps<TData, TValue>) {
  const { executeFnc, setPaidOrders } = useAppStore()
  const { pointId } = useParams()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: data.length > 0 ? data.length : pageSize, // Mostrar todos los elementos si hay datos
  })

  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusOptions && statusOptions.length > 0 ? statusOptions[0].value : ''
  )
  const [displayData, setDisplayData] = useState<TData[]>([])

  useEffect(() => {
    const fetchDataForStatus = async () => {
      const orders = await offlineCache.getOfflinePosOrders()
      if (selectedStatus === TypeStateOrder.PAID) {
        const ordersFiltered = orders.filter(
          (item: any) => item?.payment_state === TypeStatePayment.PAYMENT
        )
        setDisplayData(ordersFiltered)
        setPaidOrders(ordersFiltered)
      } else if (selectedStatus === 'A') {
        setDisplayData(
          data.filter(
            (item: any) =>
              item?.state === TypeStateOrder.PAY || item?.state === TypeStateOrder.IN_PROGRESS
          )
        )
      } else if (selectedStatus === TypeStateOrder.PENDING_PAYMENT) {
        const orders = data.filter(
          (item: any) => item?.payment_state === TypeStatePayment.PENDING_PAYMENT
        )
        setDisplayData(orders)
        setPaidOrders(orders)
      } else if (selectedStatus === TypeStateOrder.PARTIAL_PAYMENT) {
        const orders = data.filter(
          (item: any) => item?.payment_state === TypeStatePayment.PARTIAL_PAYMENT
        )
        setDisplayData(orders)
        setPaidOrders(orders)
      } else if (selectedStatus === TypeStateOrder.ALL) {
        const ordersFiltered = orders
        setDisplayData(ordersFiltered)
        setPaidOrders(ordersFiltered)
      } else if (selectedStatus === TypeStateOrder.CLOSE) {
        setDisplayData(data.filter((item: any) => item?.state === TypeStateOrder.REGISTERED))
      } else {
        setDisplayData(data.filter((item: any) => item?.state === selectedStatus))
      }
    }
    fetchDataForStatus()
  }, [data, selectedStatus, executeFnc, pointId])
  // Actualizar el pageSize cuando cambian los datos para mostrar toda la lista
  useEffect(() => {
    if (displayData.length > 0) {
      setPagination((prev) => ({
        ...prev,
        pageSize: displayData.length,
      }))
    }
  }, [displayData])

  const table = useReactTable({
    data: displayData,
    columns,
    state: {
      pagination,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: false,
    pageCount: Math.ceil(data.length / pagination.pageSize),
    // Configurar para mostrar todos los datos
    initialState: {
      pagination: {
        pageSize: data.length, // Mostrar todos los elementos
      },
    },
  })

  const handleStatusChange = (e: string) => {
    const value = e
    setSelectedStatus(value)
    if (onStatusChange) {
      onStatusChange(value)
    }
  }

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(globalFilter)
    }
  }, [globalFilter, onSearchChange])

  return (
    <div className={`w-full bg-white shadow-sm h-full flex flex-col ${className} `}>
      {(enableSearch || enablePagination || statusOptions) && (
        // <div className="flex justify-between items-center border-b border-gray-200">
        <div className="pos-controls-order-list border-b border-gray-200 py-2 pr-2 pl-3">
          <div className="pos-search-bar">
            {/* <BiSearch className="ml-3 mt-[3px] text-gray-400" size={20} /> */}
            <BiSearch className="mt-[3px] text-gray-400" size={20} />
            <input
              type="text"
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              // className="py-3 pl-2 outline-none text-gray-500 text-xl w-96"
              className="pl-2 outline-none text-gray-500 text-xl w-96"
            />

            {statusOptions && statusOptions.length > 0 && (
              // <div className="flex items-center px-4 py-3">
              <div className="flex items-center">
                <div className="relative inline-block">
                  <HierarchicalDropdown
                    options={statusOptions}
                    selectedValue={selectedStatus}
                    onSelect={handleStatusChange}
                  />

                  {/*
                  <select
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="pl-3 pr-8 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-sm"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                 */}
                </div>
              </div>
            )}
          </div>
          {/* 
          {enableSearch && (
            <div className="relative flex items-center border-r border-gray-200 ">
              <BiSearch className="ml-3 text-gray-400" size={16} />
              <input
                type="text"
                value={globalFilter || ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder}
                className="py-3 pl-2 outline-none text-gray-500 text-sm w-96"
              />
            </div>
          )}
           */}

          <div className="flex items-center ">
            {enablePagination && (
              // <div className="flex items-center px-4 py-3">
              <div className="flex items-center">
                <span className="text-gray-800 text-base whitespace-nowrap">
                  {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  -
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    data.length
                  )}{' '}
                  / {data.length}
                </span>

                <div className="flex ml-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className={`${!table.getCanPreviousPage() ? 'text-gray-300' : 'text-gray-600'} mx-1 btn2 btn2-secondary`}
                    style={{ paddingLeft: '0.45rem', paddingRight: '0.55rem' }}
                  >
                    {/* btn2 btn2-secondary lh-lg text-truncate w-auto text-action */}
                    <IoMdArrowDropleft size={24} />
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className={`${!table.getCanNextPage() ? 'text-gray-300' : 'text-gray-600'} ml-1 btn2 btn2-secondary`}
                    style={{ paddingLeft: '0.55rem', paddingRight: '0.45rem' }}
                  >
                    <IoMdArrowDropright size={24} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            {header && (
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 text-left text-sm font-medium text-gray-600"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
          </table>
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full table-auto">
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="p-6 text-center">
                    <div className="flex justify-center items-center">
                      <BiLoader className="mr-2 h-5 w-5 animate-spin" />
                      <span>Cargando datos...</span>
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => {
                  const isSelected = selectedRowId && row.original[rowIdField] === selectedRowId
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-gray-200 hover:bg-[#0000000E] cursor-pointer ${
                        isSelected ? 'bg-[#e6f2f3] border-blue-300' : ''
                      }`}
                      onClick={() => onRowClick && onRowClick(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="p-3"
                          onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-3 text-center text-gray-500">
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

/*function ChevronDown({ size = 16, className = '' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}*/
