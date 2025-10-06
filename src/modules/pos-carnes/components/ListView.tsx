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
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io'

export type FilterOption = {
  value: string
  label: string
  children?: FilterOption[]
}

export type DataTableProps<TData extends object, TValue = any> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  onRowDoubleClick?: (row: TData) => void
  enablePagination?: boolean
  enableSearch?: boolean
  pageSize?: number
  searchPlaceholder?: string
  statusOptions?: FilterOption[]
  onStatusChange?: (value: string) => void
  onSearchChange?: (value: string) => void
  filterFunction?: (data: TData[], filterValue: string) => TData[]
  noDataMessage?: string
  className?: string
  isLoading?: boolean
  header?: boolean
  selectedRowId?: string
  rowIdField?: keyof TData
}

// Componente de Dropdown Jerárquico
function HierarchicalDropdown({
  options,
  selectedValue,
  onSelect,
}: {
  options: FilterOption[]
  selectedValue: string
  onSelect: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const findSelectedLabel = (opts: FilterOption[], value: string): string => {
    for (const opt of opts) {
      if (opt.value === value) return opt.label
      if (opt.children) {
        const childLabel = findSelectedLabel(opt.children, value)
        if (childLabel) return childLabel
      }
    }
    return ''
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[150px] text-left"
      >
        {findSelectedLabel(options, selectedValue) || 'Seleccionar'}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-20 min-w-[200px]">
            {options.map((option) => (
              <div key={option.value}>
                <button
                  onClick={() => {
                    onSelect(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    selectedValue === option.value ? 'bg-blue-50 text-blue-600 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
                {option.children && (
                  <div className="pl-4 bg-gray-50">
                    {option.children.map((child) => (
                      <button
                        key={child.value}
                        onClick={() => {
                          onSelect(child.value)
                          setIsOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                          selectedValue === child.value
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : ''
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function DataTable<TData extends { isSelected?: boolean }, TValue = any>({
  columns,
  data,
  onRowClick,
  onRowDoubleClick,
  enablePagination = true,
  enableSearch = true,
  pageSize = 20,
  searchPlaceholder = '',
  statusOptions,
  onStatusChange,
  onSearchChange,
  filterFunction,
  noDataMessage = 'No se encontraron resultados',
  className = '',
  isLoading = false,
  header = false,
  selectedRowId,
  rowIdField = 'order_id' as keyof TData,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: data?.length > 0 ? data?.length : pageSize,
  })
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>(
    statusOptions && statusOptions.length > 0 ? statusOptions[0].value : ''
  )
  const [displayData, setDisplayData] = useState<TData[]>([])

  // Aplicar filtros
  useEffect(() => {
    if (filterFunction) {
      const filtered = filterFunction(data, selectedStatus)
      setDisplayData(filtered)
    } else {
      setDisplayData(data)
    }
  }, [data, selectedStatus, filterFunction])

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
    initialState: {
      pagination: {
        pageSize: data.length,
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
        <div className="pos-controls-order-list border-b border-gray-200 py-2 pr-2 pl-3">
          <div className="pos-search-bar">
            <BiSearch className="mt-[3px] text-gray-400" size={20} />
            <input
              type="text"
              value={globalFilter || ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-2 outline-none text-gray-500 text-xl w-96"
            />

            {statusOptions && statusOptions.length > 0 && (
              <div className="flex items-center">
                <div className="relative inline-block">
                  <HierarchicalDropdown
                    options={statusOptions}
                    selectedValue={selectedStatus}
                    onSelect={handleStatusChange}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center ">
            {enablePagination && (
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
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full table-auto">
            {header && (
              <thead className="sticky top-0 bg-gray-50 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-gray-200">
                    {headerGroup.headers.map((header) => {
                      const columnDef = header.column.columnDef as any
                      const headerClassName = columnDef.className || ''

                      return (
                        <th
                          key={header.id}
                          className={`p-3 text-sm font-medium text-gray-600 ${headerClassName}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>
            )}
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
                      {row.getVisibleCells().map((cell) => {
                        const columnDef = cell.column.columnDef as any
                        const cellClassName = columnDef.className || ''

                        return (
                          <td
                            key={cell.id}
                            className={`p-3 ${cellClassName}`}
                            onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row.original)}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )
                      })}
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
