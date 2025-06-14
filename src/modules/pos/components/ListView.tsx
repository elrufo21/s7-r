import { useState, useEffect } from 'react'
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
import { SelectControlled } from '@/shared/ui'
import { useForm } from 'react-hook-form'

import { IoMdArrowDropleft } from 'react-icons/io'
import { IoMdArrowDropright } from 'react-icons/io'

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
  noDataMessage = 'No data found',
  className = '',
  isLoading = false,
  header = false,
}: DataTableProps<TData, TValue>) {
  const { control } = useForm()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  })

  const [globalFilter, setGlobalFilter] = useState<string>('')

  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusOptions && statusOptions.length > 0 ? statusOptions[0].value : ''
  )

  const table = useReactTable({
    data,
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
                  <SelectControlled
                    name="status"
                    options={statusOptions}
                    onChange={handleStatusChange}
                    control={control}
                    value={selectedStatus}
                    className="w-[80px] text-xl"
                    errors={{}}
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
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b  border-gray-200 hover:bg-gray-50 cursor-pointer ${(row.original?.isSelected as boolean) ? 'bg-green-50' : ''}`}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
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
