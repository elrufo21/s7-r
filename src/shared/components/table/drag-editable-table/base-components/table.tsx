import {
  useState,
  useMemo,
  useEffect,
  useRef,
  ReactNode,
  ChangeEvent,
  Suspense,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react'
import {
  useReactTable,
  getCoreRowModel,
  Row,
  ColumnDef,
  Table,
  flexRender,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table'

import Sortable from 'sortablejs'
import useAppStore from '@/store/app/appStore'
import { MenuItem } from '@mui/material'

import NavMenuList from '@/shared/components/navigation/top-navigation/components/NavMenuList'
import { LuSettings2 } from 'react-icons/lu'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'
import { GrTrash } from 'react-icons/gr'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'
import clsx from 'clsx'
import { ActionTypeEnum } from '@/shared/shared.types'

const DraggableRow = <T extends Record<string, any>>({
  row,
  idTable,
}: {
  row: Row<T>
  idTable: string
}) => {
  let columns = row.getVisibleCells()
  let lastColumn = columns[columns.length - 1]
  let dscIndex = columns.findIndex((cell) => cell.column.id === 'label')
  let dscCol = columns[dscIndex]
  const resetKey = row.original._resetKey || row.id

  return (
    <tr
      className="border-y-[#d8dadd] border-y-[1px]"
      key={`row-${row.original[idTable]}-${resetKey}`}
    >
      <>
        {row.original.type !== TypeInvoiceLineEnum.LINE ? (
          <>
            <td key={columns[0].id} style={{ width: columns[0].column.getSize() }}>
              {flexRender(columns[0].column.columnDef.cell, columns[0].getContext())}
            </td>
            {dscCol && (
              <td
                colSpan={columns.length - 2}
                key={dscCol.id}
                className={`text-left ${row.original.type === 'S' ? `o_section` : `o_note`}`}
              >
                {flexRender(dscCol.column.columnDef.cell, dscCol.getContext())}
              </td>
            )}
            <td key={lastColumn.id} style={{ width: lastColumn.column.getSize() }}>
              {flexRender(lastColumn.column.columnDef.cell, lastColumn.getContext())}
            </td>
          </>
        ) : (
          row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              style={{
                width: cell.column.getSize(),
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))
        )}
      </>
    </tr>
  )
}
const TableConfig = <T extends Record<string, any>>({ table }: { table: Table<T> }) => {
  return (
    <Suspense>
      <NavMenuList menu={''} icon={<LuSettings2 />} className="table-details-conf">
        {table.getAllLeafColumns().map((column, i) => {
          if (column.id === 'drag-handle' || column.id === 'settings') return null
          if (!column.columnDef.header) return null
          return (
            <MenuItem onClick={(e) => e.stopPropagation()} key={i}>
              <div className="group p-1 gap-3 absolute left-0">
                <label className="flex g ml-2 font-medium cursor-pointer gap-3 ">
                  <input
                    className={`m-1 group-hover:bg-sgreen-400 group-hover:text-sgreen-200 cursor-pointer accent-sgreen-400 ${
                      column.getIsVisible() ? ` text-sgreen-400` : ` bg-gray-100`
                    }`}
                    {...{
                      type: 'checkbox',
                      checked: column.getIsVisible(),
                      onChange: column.getToggleVisibilityHandler(),
                    }}
                  />
                  {column.columnDef.header as ReactNode}
                </label>
              </div>
            </MenuItem>
          )
        })}
      </NavMenuList>
    </Suspense>
  )
}

export const DragEditableTable = <T extends Record<string, any>>({
  columns,
  setValue,
  listName,
  idTable,
  modifyData,
  setModifyData,
  data,
  setData,
  buttons,
  onDelete,
  isReadOnly = false,
  debounceDelay = 300,
  getTableHelpers,
  defaultRowData,
}: {
  columns: ColumnDef<T>[]
  setValue: any
  listName: string
  idTable: string
  modifyData: boolean
  setModifyData: Dispatch<SetStateAction<boolean>>
  data: T[]
  setData: Dispatch<SetStateAction<T[]>>
  buttons?: ReactNode
  onDelete?: (id: number) => void
  isReadOnly?: boolean
  debounceDelay?: number
  getTableHelpers?: (helpers: {
    updateLineData: (id: number, updates: Partial<T>) => void
    debouncedUpdateLineData: (id: number, updates: Partial<T>) => void
    handleTextFieldChange: (
      e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
      id: number,
      fieldName: string
    ) => void
    handleDelete: (id: number) => void
    addRow: (type: TypeInvoiceLineEnum) => void
  }) => void
  defaultRowData?: (type: TypeInvoiceLineEnum) => Partial<T>
}) => {
  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const sortableRef = useRef<Sortable | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const { setTableData, setFrmIsChangedItem } = useAppStore()

  // Función de eliminación dentro del componente
  const handleDelete = useCallback(
    (id: number) => {
      if (onDelete) {
        onDelete(id)
      } else {
        // Implementación por defecto
        setData((prevData) =>
          prevData.map((row) =>
            row[idTable] === id ? { ...row, action: ActionTypeEnum.DELETE } : row
          )
        )
        setModifyData(true)
      }
    },
    [idTable, onDelete, setData, setModifyData]
  )

  // Implementación de la función de debounce
  const useDebounce = (callback: any, delay: number) => {
    const timeoutRef = useRef<any>(null)

    const debouncedCallback = useCallback(
      (...args: any[]) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          callback(...args)
        }, delay)
      },
      [callback, delay]
    )

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return debouncedCallback
  }

  // Función para actualizar datos con debounce
  const updateLineData = useCallback(
    (id: number, updates: Partial<T>) => {
      setData((prev) =>
        prev.map((item) =>
          item[idTable] === id
            ? {
                ...item,
                ...updates,
                action:
                  item.action !== ActionTypeEnum.INSERT
                    ? ActionTypeEnum.UPDATE
                    : ActionTypeEnum.INSERT,
              }
            : item
        )
      )
      setModifyData(true)
    },
    [idTable, setData, setModifyData]
  )

  // Versión con debounce de updateLineData
  const debouncedUpdateLineData = useDebounce((id: number, updates: Partial<T>) => {
    updateLineData(id, updates)
  }, debounceDelay)

  // Función para manejar cambios en campos de texto con debounce
  const handleTextFieldChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, id: number, fieldName: string) => {
      const newValue = e.target.value

      // Actualización visual inmediata (sin triggear modifyData)
      setData((prev) =>
        prev.map((item) => (item[idTable] === id ? { ...item, [fieldName]: newValue } : item))
      )

      // Debounce la actualización real que marca el formulario como modificado
      debouncedUpdateLineData(id, { [fieldName]: newValue } as Partial<T>)
    },
    [debouncedUpdateLineData, idTable, setData]
  )

  // Filtrar datos eliminados
  const filteredData = useMemo(
    () => data.filter((row) => row.action !== ActionTypeEnum.DELETE),
    [data]
  )

  const enhancedColumns = useMemo(() => {
    // Verificar si ya existe una columna de acción
    const hasActionColumn = columns.some((col) => col.id === 'action')

    if (hasActionColumn || isReadOnly) {
      return columns
    }

    // Agregar columna de acción si no existe
    return [
      ...columns,
      {
        id: 'action',
        header: '',
        size: 40,
        enableResizing: false,
        cell: ({ row }: { row: Row<T> }) => (
          <div className="flex justify-center items-center">
            <button type="button" onClick={() => handleDelete(row.original[idTable])}>
              <GrTrash style={{ fontSize: '14px' }} className="hover:text-red-400" />
            </button>
          </div>
        ),
      } as ColumnDef<T>,
    ]
  }, [columns, handleDelete, idTable, isReadOnly])

  // Función para añadir una nueva fila
  const addRow = useCallback(
    (type: TypeInvoiceLineEnum) => {
      // Generar un ID único negativo para nuevas filas
      const newId = Math.min(...data.map((row) => Number(row[idTable])), 0) - 1

      // Obtener datos por defecto según el tipo
      const defaultData = defaultRowData ? defaultRowData(type) : {}

      // Crear la nueva fila con valores por defecto
      const newRowData = {
        [idTable]: newId,
        action: ActionTypeEnum.INSERT,
        type,
        _resetKey: Date.now(),
        ...defaultData,
      } as unknown as T

      // Añadir la fila al estado
      setData((prevData) => [...prevData, newRowData])
      setModifyData(true)
    },
    [data, idTable, setData, setModifyData, defaultRowData]
  )

  // Proporcionar las funciones de ayuda al componente padre
  useEffect(() => {
    if (getTableHelpers) {
      getTableHelpers({
        updateLineData,
        debouncedUpdateLineData,
        handleTextFieldChange,
        handleDelete,
        addRow,
      })
    }
  }, [
    updateLineData,
    debouncedUpdateLineData,
    handleTextFieldChange,
    handleDelete,
    addRow,
    getTableHelpers,
  ])

  useEffect(() => {
    if (tableRef.current) {
      if (sortableRef.current) {
        sortableRef.current.destroy()
      }

      sortableRef.current = Sortable.create(tableRef.current, {
        animation: 150,
        handle: '.drag-handle',
        ghostClass: 'bg-white',
        onEnd: (event) => {
          const oldIndex = event.oldIndex!
          const newIndex = event.newIndex!

          if (filteredData.length > 1) {
            setData((prevData) => {
              const visibleData = prevData.filter((item) => item.action !== ActionTypeEnum.DELETE)
              const deletedData = prevData.filter((item) => item.action === ActionTypeEnum.DELETE)

              const [movedItem] = visibleData.splice(oldIndex, 1)
              visibleData.splice(newIndex, 0, {
                ...movedItem,
                action:
                  movedItem.action === ActionTypeEnum.BASE
                    ? ActionTypeEnum.UPDATE
                    : movedItem.action,
              })

              return [...visibleData, ...deletedData]
            })

            setModifyData(true)
          }
        },
      })
    }
  }, [filteredData])

  useEffect(() => {
    if (modifyData) {
      setValue(listName, data)
      setTableData(data)
      setFrmIsChangedItem(true)
      setModifyData(false)
    }
  }, [modifyData])

  const table = useReactTable({
    data: filteredData,
    columns: enhancedColumns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })
  return (
    <div className="table-details overflow-x-auto flex flex-col">
      <div className="relative">
        <table className="w-full">
          <thead className="h-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                    className={`text-right font-bold justify-end px-[10px] relative ${
                      header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="w-full box-border flex">
                      <div className="flex items-center w-full">
                        <div
                          className={clsx(
                            'flex items-center gap-2 flex-grow',
                            {
                              'justify-end text-right':
                                (header.column.columnDef.meta as any)?.align === 'right',
                              'justify-center text-center':
                                (header.column.columnDef.meta as any)?.align === 'center',
                              'justify-start text-left':
                                !(header.column.columnDef.meta as any)?.align ||
                                (header.column.columnDef.meta as any)?.align === 'left',
                            },
                            header.column.getIsSorted() && 'gap-2'
                          )}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: <FaChevronUp />,
                            desc: <FaChevronDown />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `box-border active:bg-primary resizer ${table.options.columnResizeDirection} 
                                  ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                          }}
                        />
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody ref={tableRef}>
            {table.getRowModel().rows.map((row) => (
              <DraggableRow
                key={`row-${row.original[idTable]}-${row.index}`}
                row={row as Row<T>}
                idTable={idTable}
              />
            ))}
          </tbody>
        </table>
        <TableConfig table={table} />
      </div>
      {buttons && buttons}
    </div>
  )
}
