import { Checkbox } from '@mui/material'
import { useEffect, useState } from 'react'

interface CheckboxTableCellProps {
  row: any
  column: any
  onChange: (data: { rowId: number; columnId: string; checked: boolean }) => void
}

export const CheckboxTableCell = ({ row, column, onChange }: CheckboxTableCellProps) => {
  const [checked, setChecked] = useState(row.original[column.id] || false)

  const handleChange = () => {
    const newChecked = !checked
    setChecked(newChecked)
    onChange({ rowId: row.index, columnId: column.id, checked: newChecked })
  }

  useEffect(() => {
    setChecked(row.original[column.id] || false)
  }, [row.original, column.id])

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Checkbox checked={checked} onClick={handleChange} />
    </div>
  )
}
