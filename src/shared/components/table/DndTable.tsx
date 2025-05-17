import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  ColumnDef,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Dispatch, ReactNode, SetStateAction, useMemo, useState } from 'react'
import { DraggableRow } from './DraggableComponent'
import { ActionTypeEnum } from '@/shared/shared.types'

interface DndTableInterface<T> {
  data: T[]
  setData: Dispatch<SetStateAction<T[]>>
  columns: ColumnDef<T>[]
  id: string
  children: (table: any) => ReactNode
  onHandleDrag?: () => void
}
export const DndTable = <T extends { [key: string]: any }>({
  data,
  setData,
  columns,
  id,
  children,
  onHandleDrag,
}: DndTableInterface<T>) => {
  const dataIds = useMemo<UniqueIdentifier[]>(() => data?.map((elem) => String(elem[id])), [data])

  const [columnResizeMode] = useState<ColumnResizeMode>('onChange')

  const table = useReactTable({
    data: useMemo(() => {
      return data.filter((elem) => elem.action !== ActionTypeEnum.DELETE)
    }, [data]),
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => String(row[id]),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode,
    enableColumnResizing: true,
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((prevData) => {
        const oldIndex = prevData.findIndex((item) => String(item[id]) === active.id)
        const newIndex = prevData.findIndex((item) => String(item[id]) === over.id)

        if (oldIndex === -1 || newIndex === -1) return prevData
        if (onHandleDrag) onHandleDrag()
        return arrayMove([...prevData], oldIndex, newIndex)
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="p-2 w-full">
        <div className="h-4" />
        <table className="list_table w-full ">
          <thead className="thead s-sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="list-th-tr left-sticky  bg-white shadow-md"
                style={{ height: '42px' }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize() === 150 ? 'auto' : header.getSize(),
                    }}
                    className={`relative items-center ${header.id === 'select' && ' left-sticky justify-center '}
                ${header.id === 'settings' && ' right-sticky  bg-gray-50'} 
                p-2 cursor-pointer ${header.column.getIsSorted() && 'bg-gray-200 '} text-left font-semibold `}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="w-full box-border flex">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `box-border active:bg-primary resizer ${table.options.columnResizeDirection} 
                        ${header.column.getIsResizing() ? 'isResizing' : ' '}`,
                            style: {
                              transform:
                                columnResizeMode === 'onEnd' && header.column.getIsResizing()
                                  ? `translateX(${
                                      (table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
                                      (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                    }px)`
                                  : '',
                            },
                          }}
                        />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
              {table.getRowModel().rows.map((row, index) => (
                <DraggableRow key={`${row.id}-${index}`} row={row} id={id} />
              ))}
            </SortableContext>
            {children(table)}
          </tbody>
        </table>
      </div>
    </DndContext>
  )
}
