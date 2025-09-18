import { ActionTypeEnum } from '@/shared/shared.types'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import { ColumnDef } from '@tanstack/react-table'
import clsx from 'clsx'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { FaChevronDown } from 'react-icons/fa'
import { useEffect } from 'react'
import { FaChevronUp } from 'react-icons/fa'
import Sortable from 'sortablejs'
import { LuSettings2 } from 'react-icons/lu'
import { MenuItem } from '@mui/material'
import NavMenuList from '@/shared/components/navigation/top-navigation/components/NavMenuList'
import { TypeInvoiceLineEnum } from '@/shared/components/view-types/viewTypes.types'

export const DragEditableTable = <T extends Record<string, any>>({
  data,
  setData,
  columns,
  onDataChange,
  onDeleteRow,
  children,
}: {
  data: T[]
  setData: Dispatch<SetStateAction<T[]>>
  columns: ColumnDef<T>[]
  onDataChange: (newData: T[]) => void
  onDeleteRow?: (id: number) => void
  children?: (setModifyData: Dispatch<SetStateAction<boolean>>) => ReactNode
}) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [modifyData, setModifyData] = useState<boolean>(false)
  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const sortableRef = useRef<Sortable | null>(null)
  const isUpdatingRef = useRef<boolean>(false)

  const filteredData = useMemo(
    () => data.filter((row) => row.action !== ActionTypeEnum.DELETE),
    [data]
  )

  // Función de actualización genérica incorporada al componente
  const updateLineData = useCallback(
    (id: number | string, updates: Partial<T>) => {
      if (isUpdatingRef.current) return

      setData((prev) =>
        prev.map((row) => {
          // Busca el registro por ID (asume que tiene una propiedad line_id o id)
          const rowId = (row as any).line_id !== undefined ? (row as any).line_id : (row as any).id

          if (rowId === id) {
            // Maneja el campo action si existe
            const action = (row as any).action
            let newAction = action

            if (action !== undefined) {
              newAction =
                action !== ActionTypeEnum.INSERT ? ActionTypeEnum.UPDATE : ActionTypeEnum.INSERT
            }

            return {
              ...row,
              ...updates,
              ...(action !== undefined ? { action: newAction } : {}),
            }
          }
          return row
        })
      )
      setModifyData(true)
    },
    [setData]
  )

  // Función para el manejo de la eliminación
  const handleDelete = useCallback(
    (lineId: number) => {
      if (onDeleteRow && !isUpdatingRef.current) {
        isUpdatingRef.current = true
        onDeleteRow(lineId)
        // Usamos un setTimeout para asegurar que esta actualización
        // ocurra en el siguiente ciclo de renderizado
        setTimeout(() => {
          setModifyData(true)
          isUpdatingRef.current = false
        }, 0)
      }
    },
    [onDeleteRow]
  )

  // Implementación de useDebounce dentro del componente
  const useTableDebounce = (callback: any, delay: number) => {
    const timeoutRef = useRef<any>(null)

    // Limpieza al desmontar
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [])

    return useCallback(
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
  }

  // Creamos la versión con debounce de updateLineData
  const debouncedUpdateLineData = useTableDebounce(updateLineData, 300)

  //drag
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
              const visibleData = prevData.filter(
                (item: any) => item.action !== ActionTypeEnum.DELETE
              )
              const deletedData = prevData.filter(
                (item: any) => item.action === ActionTypeEnum.DELETE
              )

              // Remover el ítem movido
              const [movedItem] = visibleData.splice(oldIndex, 1)
              // Insertarlo en la nueva posición
              visibleData.splice(newIndex, 0, movedItem)

              // Actualizar TODOS los visibles con action: UPDATE (sin importar su estado original)
              const updatedVisibleData = visibleData.map((item: any) => ({
                ...item,
                action: ActionTypeEnum.UPDATE,
              }))

              return [...updatedVisibleData, ...deletedData]
            })

            setModifyData(true)
          }
        },
      })
    }
  }, [filteredData])
  useEffect(() => {
    if (modifyData) {
      const timeoutId = setTimeout(() => {
        onDataChange?.(data)
        setModifyData(false)
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [modifyData, onDataChange, data])

  const table = useReactTable({
    data: filteredData,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnResizing: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    meta: {
      updateRow: updateLineData, // Función de actualización inmediata
      debouncedUpdateRow: debouncedUpdateLineData, // Función de actualización con debounce
      deleteRow: handleDelete, // Agregar la función de eliminación
    },
  })

  return (
    <>
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
                  key={`row-${(row.original as any).line_id}-${row.index}`}
                  row={row as Row<T>}
                />
              ))}
            </tbody>
          </table>
          <TableConfig table={table as Table<T>} />
        </div>
      </div>
      {typeof children === 'function' && children(setModifyData)}
    </>
  )
}

const TableConfig = <T extends Record<string, any>>({ table }: { table: Table<T> }) => {
  return (
    <Suspense>
      <NavMenuList menu={''} icon={<LuSettings2 />} className="table-details-conf ">
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

export const DraggableRow = <T extends Record<string, any>>({ row }: { row: Row<T> }) => {
  let columns = row.getVisibleCells()
  let lastColumn = columns[columns.length - 1]
  let dscIndex = columns.findIndex((cell) => cell.column.id === 'label')
  let dscCol = columns[dscIndex]
  const resetKey = row.original._resetKey || row.id

  return (
    <tr
      className="border-y-[#d8dadd] border-y-[1px]"
      key={`row-${row.original.line_id}-${resetKey}`}
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
