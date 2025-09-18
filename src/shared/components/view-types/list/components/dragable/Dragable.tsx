import { GrDrag } from 'react-icons/gr'
import { Tooltip } from '@mui/material'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender } from '@tanstack/react-table'

interface DraggableRowProps {
  row: any
  index: number
  col_name: string
  rowSelection: any
  idRow: string
  viewItem: (original: any, index: number, row: any) => void
}

export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    <button type="button" className="cursor-grab" {...attributes} {...listeners}>
      <GrDrag style={{ fontSize: '17px' }} />
    </button>
  )
}

export const DraggableRow = ({
  row,
  index,
  col_name,
  rowSelection,
  idRow,
  viewItem,
}: DraggableRowProps) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.id,
  })
  return (
    <tr
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
        height: '44px',
      }}
      className={`group list-tr ${
        rowSelection[row.original[idRow] as string]
          ? '  bg-sgreen-100 hover:bg-sgreen-200 text-gray-900 border-black border-b-[1.5px] border-opacity-30'
          : 'hover:bg-gray-200  bg-white  border-b-[#000] border-black border-b-[1.5px] border-opacity-30'
      } ${row.getIsSelected() ? 'bg-[#d1ecf1]' : ''}`}
    >
      {row.getVisibleCells().map((cell: any, i: number) => {
        return row.original.groupName ? (
          <>
            {i === 0 && (
              <td className="font-bold">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            )}
            {i === 1 && (
              <td colSpan={row.getVisibleCells().length - 1} className="font-bold">
                {row.original.groupName} {` (${row.original.groupItems.length})`}{' '}
              </td>
            )}
          </>
        ) : (
          <td
            key={cell.id}
            //style={{ width: cell.column.getSize() + cell.column.id === col_name ? restWidth : 0 }}
            onClick={() => {
              if (cell.column.id !== 'select') viewItem(row.original, index, row)
            }}
            className={`${
              cell.column.id === 'select' &&
              ` left-sticky ${
                rowSelection[row.original[idRow]]
                  ? 'bg-sgreen-100 group-hover:bg-sgreen-200 text-gray-900'
                  : `border-gray-300 group-hover:bg-gray-200 ${index % 2 === 0 ? ' bg-white' : ' bg-gray-50'}`
              }`
            } ${cell.id.includes('drag-handle') ? 'hover:cursor-grab' : ''} px-2 py-3 ${cell.column.id === col_name && ' '} `}
          >
            <div className={`text-left ${cell.column.id === 'select' && ' text-hideable'}`}>
              {cell.column.id === col_name ? (
                <Tooltip arrow title={flexRender(cell.column.columnDef.cell, cell.getContext())}>
                  <div className="text-hideable" style={{ textAlign: cell.column.columnDef.align }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </Tooltip>
              ) : (
                <div className="text-hideable" style={{ textAlign: cell.column.columnDef.align }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              )}
            </div>
          </td>
        )
      })}
    </tr>
  )
}
