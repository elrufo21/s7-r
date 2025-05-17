import { useSortable } from '@dnd-kit/sortable'
import { flexRender, Row } from '@tanstack/react-table'
import { CSS } from '@dnd-kit/utilities'
import { GrDrag } from 'react-icons/gr'
import { CSSProperties } from 'react'
import { TypeInvoiceLineEnum } from '../view-types/viewTypes.types'

export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    <button type="button" {...attributes} {...listeners} className="hover:cursor-grab">
      <GrDrag style={{ fontSize: '17px' }} />
    </button>
  )
}

export const DraggableRow = <T extends { [key: string]: any }>({
  row,
  id,
}: {
  row: Row<T>
  id: string
}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: String(row.original[id]),
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }

  if (row.original.type && row.original.type !== TypeInvoiceLineEnum.LINE) {
    const columns = row.getVisibleCells()
    const lastColumn = columns[columns.length - 1]
    const dscIndex = columns.findIndex((cell) => cell.column.id === 'label')
    const dscCol = columns[dscIndex]

    return (
      <tr ref={setNodeRef} style={style} className="border-t-black border-t-[1px]">
        <td key={columns[0].id} style={{ width: columns[0].column.getSize() }}>
          {flexRender(columns[0].column.columnDef.cell, columns[0].getContext())}
        </td>
        {dscCol && (
          <td
            colSpan={columns.length - 2}
            key={dscCol.id}
            className={`text-left ${row.original.tlin === 'S' ? `o_section` : `o_note`}`}
          >
            {flexRender(dscCol.column.columnDef.cell, dscCol.getContext())}
          </td>
        )}
        <td key={lastColumn.id} style={{ width: lastColumn.column.getSize() }}>
          {flexRender(lastColumn.column.columnDef.cell, lastColumn.getContext())}
        </td>
      </tr>
    )
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-t-black border-t-[1px]">
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="px-2">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  )
}
