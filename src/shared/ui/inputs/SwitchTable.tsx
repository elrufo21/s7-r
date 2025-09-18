import { Switch } from '@mui/material'

interface SwitchTableProps {
  row: any
  column: any
  onChange: (data: { rowId: number; columnId: string; value: boolean }) => void
}

export const SwitchTable = (props: SwitchTableProps) => {
  const { row, column, onChange } = props
  const align = column.columnDef.align

  const parseValueToBoolean = (value: any): boolean => {
    return value === true
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked
    onChange({
      rowId: row.index,
      columnId: column.id,
      value: newValue,
    })
  }

  return (
    <div className="switch-table-wrapper inputEx_table" style={{ textAlign: align }}>
      <Switch
        checked={parseValueToBoolean(row.original[column.id])}
        onChange={handleToggle}
        className="switch-table"
      />
    </div>
  )
}
