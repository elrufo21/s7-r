import { useEffect, useState } from 'react'

interface ColorPickerTableCellProps {
  row: any
  column: any
  onChange: (data: { rowId: number; columnId: string; color: string }) => void
}

export const ColorPickerTableCell = ({ row, column, onChange }: ColorPickerTableCellProps) => {
  const [color, setColor] = useState(row.original[column.id] || '#000000')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = event.target.value
    setColor(newColor)
    onChange({ rowId: row.index, columnId: column.id, color: newColor })
  }

  useEffect(() => {
    setColor(row.original[column.id] || '#000000')
  }, [row.original, column.id])

  return (
    <div className="relative w-4 h-4">
      <input
        type="color"
        value={color}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div
        className="w-4 h-4 rounded-full border border-solid  border-gray-600"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
