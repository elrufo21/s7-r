import { FormControl, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

interface SelectTableProps {
  row: any
  column: any
  fnc_options: () => Promise<{ value: string; label: string }[]>
  onChange: (data: { rowId: number; columnId: string; option: string }) => void
  className?: string
}

export const SelectTable = ({
  row,
  column,
  fnc_options,
  onChange,
  className = '',
}: SelectTableProps) => {
  const inputRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(row.original[column.id] || '')
  const [options, setOptions] = useState<any[]>([])

  const loadOptions = async () => {
    const opts = await fnc_options()
    setOptions(opts)
  }

  const handleOnChange = (e: SelectChangeEvent<any>) => {
    const selectedValue = e.target.value
    setCurrentValue(selectedValue)
    onChange({ rowId: row.index, columnId: column.id, option: selectedValue })
  }

  const handleClick = () => setIsEditing(true)

  useEffect(() => {
    setCurrentValue(row.original[column.id] || '')
  }, [row.original, column.id])

  return isEditing ? (
    <FormControl className="InputEx o_form_label" variant="standard" fullWidth>
      <Select
        displayEmpty
        inputRef={inputRef}
        inputProps={{ 'aria-label': 'Without label' }}
        onOpen={loadOptions}
        value={currentValue || ''}
        onChange={handleOnChange}
        onBlur={() => setIsEditing(false)} // Se cierra cuando pierde el foco
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <div className={`input-text-table ${className} min-w-0`} onClick={handleClick}>
      {options.find((opt) => opt.value === currentValue)?.label || '-'}
    </div>
  )
}
