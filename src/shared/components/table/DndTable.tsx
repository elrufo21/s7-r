import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { ActionTypeEnum } from '@/shared/shared.types'
import Sortable from 'sortablejs'
import clsx from 'clsx'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

interface DndTableInterface<T> {
  data: T[]
  setData: Dispatch<SetStateAction<T[]>>
  columns: ColumnDef<T>[]
  id: string
  children: (table: any) => ReactNode
  onHandleDrag?: () => void
  onDataChange?: (newData: T[]) => void
  modifyData?: boolean
  setModifyData?: Dispatch<SetStateAction<boolean>>
}

export const DndTable = <T extends { [key: string]: any }>({
  data,
  setData,
  columns,
  id,
  children,
  onHandleDrag,
  onDataChange,
  modifyData,
  setModifyData,
}: DndTableInterface<T>) => {
  const [sorting, setSorting] = useState<SortingState>([])

  const tableRef = useRef<HTMLTableSectionElement | null>(null)
  const sortableRef = useRef<Sortable | null>(null)
  const isUpdatingRef = useRef<boolean>(false)

  const filteredData = useMemo(
    () => data?.filter((row) => row.action !== ActionTypeEnum.DELETE),
    [data]
  )

  // Función de actualización genérica incorporada al componente
  const updateLineData = useCallback(
    (itemId: number | string, updates: Partial<T>) => {
      if (isUpdatingRef.current) return

      setData((prev) =>
        prev.map((row) => {
          const rowId = row[id]

          if (rowId === itemId) {
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
    [setData, id, setModifyData]
  )

  // Función para el manejo de la eliminación
  const handleDelete = useCallback(
    (itemId: number | string) => {
      if (!isUpdatingRef.current) {
        isUpdatingRef.current = true
        setData((prev) =>
          prev.map((row) => {
            const rowId = row[id]
            if (rowId === itemId) {
              return {
                ...row,
                action: ActionTypeEnum.DELETE,
              }
            }
            return row
          })
        )
        // Usamos un setTimeout para asegurar que esta actualización
        // ocurra en el siguiente ciclo de renderizado
        setTimeout(() => {
          setModifyData(true)
          isUpdatingRef.current = false
        }, 0)
      }
    },
    [setData, id, setModifyData]
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

  // Configuración del drag and drop con SortableJS
  useEffect(() => {
    if (tableRef.current) {
      // Limpiar instancia anterior si existe
      if (sortableRef.current) {
        try {
          sortableRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying sortable instance:', error)
        }
        sortableRef.current = null
      }

      // Crear nueva instancia de Sortable
      try {
        sortableRef.current = Sortable.create(tableRef.current, {
          animation: 150,
          handle: '.drag-handle',
          ghostClass: 'bg-white',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          filter: '[data-no-drag="true"], .no-drag',
          onEnd: (event) => {
            const oldIndex = event.oldIndex
            const newIndex = event.newIndex

            if (
              oldIndex !== undefined &&
              newIndex !== undefined &&
              oldIndex !== newIndex &&
              filteredData.length > 1
            ) {
              setData((prevData) => {
                const visibleData = prevData.filter(
                  (item: any) => item.action !== ActionTypeEnum.DELETE
                )
                const deletedData = prevData.filter(
                  (item: any) => item.action === ActionTypeEnum.DELETE
                )

                // Verificar que los índices sean válidos
                if (
                  oldIndex >= 0 &&
                  oldIndex < visibleData.length &&
                  newIndex >= 0 &&
                  newIndex < visibleData.length
                ) {
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
                }

                return prevData
              })

              setModifyData(true)
              if (onHandleDrag) onHandleDrag()
            }
          },
        })
      } catch (error) {
        console.error('Error creating sortable instance:', error)
      }
    }

    // Cleanup function
    return () => {
      if (sortableRef.current) {
        try {
          sortableRef.current.destroy()
        } catch (error) {
          console.warn('Error destroying sortable instance during cleanup:', error)
        } finally {
          sortableRef.current = null
        }
      }
    }
  }, [filteredData?.length, onHandleDrag, setModifyData]) // Agregado setModifyData a las dependencias

  // Efecto para notificar cambios en los datos
  useEffect(() => {
    if (modifyData) {
      const timeoutId = setTimeout(() => {
        onDataChange?.(data)
        setModifyData(false)
      }, 0)

      return () => clearTimeout(timeoutId)
    }
  }, [modifyData, onDataChange, data, setModifyData])

  const table = useReactTable({
    data: filteredData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => String(row[id]),
    columnResizeMode: 'onChange', // Fijo en onChange para evitar problemas
    columnResizeDirection: 'ltr', // Agregado explícitamente
    enableColumnResizing: true,
    enableSorting: true,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    meta: {
      updateRow: updateLineData, // Función de actualización inmediata
      debouncedUpdateRow: debouncedUpdateLineData, // Función de actualización con debounce
      deleteRow: handleDelete, // Función de eliminación
    },
  })

  return (
    // <div className="p-2 w-full">
    <div className="w-full">
      <table className="w-full min-w-full table-fixed">
        <thead className="thead sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-white border-b border-gray-200"
              style={{ height: '42px' }}
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  style={{
                    width: header.getSize(),
                    minWidth: header.column.columnDef.minSize || 50,
                  }}
                  className={clsx('relative p-2 text-left font-semibold ', 'bg-white select-none', {
                    'cursor-pointer hover:bg-gray-50': header.column.getCanSort(),
                    'bg-gray-100': header.column.getIsSorted(),
                  })}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center justify-between w-full min-w-0">
                      <div className="flex items-center min-w-0 flex-1">
                        <div
                          className={clsx('flex items-center gap-2 min-w-0 flex-1', {
                            'justify-end': (header.column.columnDef.meta as any)?.align === 'right',
                            'justify-center':
                              (header.column.columnDef.meta as any)?.align === 'center',
                            'justify-start':
                              !(header.column.columnDef.meta as any)?.align ||
                              (header.column.columnDef.meta as any)?.align === 'left',
                          })}
                        >
                          <span className="truncate">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {{
                            asc: <FaChevronUp className="text-xs flex-shrink-0" />,
                            desc: <FaChevronDown className="text-xs flex-shrink-0" />,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </div>

                      {/* Resizer mejorado */}
                      <div
                        className={clsx(
                          'absolute right-0 top-0 h-full w-1 cursor-col-resize',
                          'hover:bg-blue-400 active:bg-blue-500',
                          'opacity-0 hover:opacity-100 transition-opacity',
                          {
                            'opacity-100 bg-blue-500': header.column.getIsResizing(),
                          }
                        )}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        onDoubleClick={() => header.column.resetSize()}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody ref={tableRef}>
          {table.getRowModel().rows.map((row, index) => (
            <DraggableRow key={`${row.id}-${index}`} row={row} />
          ))}
        </tbody>
      </table>
      {children && children(table)}
    </div>
  )
}

// Componente de fila arrastrable mejorado
export const DraggableRow = <T extends Record<string, any>>({ row }: { row: Row<T> }) => {
  const resetKey = (row.original as any)._resetKey || row.id

  return (
    <tr
      className="border-y-[#d8dadd] border-y-[1px] h-[44px]"
      style={{ height: '44px' }}
      key={`row-${row.id}-${resetKey}`}
    >
      {row.getVisibleCells().map((cell) => (
        <td
          key={cell.id}
          style={{
            width: cell.column.getSize(),
            minWidth: cell.column.columnDef.minSize || 50,
          }}
        >
          <div className="truncate">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </div>
        </td>
      ))}
    </tr>
  )
}
