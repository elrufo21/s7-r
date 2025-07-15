import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'

interface SelectControlledProps {
  name: string
  control: any
  rules?: any
  errors: any
  options: { label: string; value: string | number }[]
  className?: string
  editConfig?: any
  onChange?: (value: string | number) => void
  value?: string | number
  placeholder?: string
  disabled?: boolean
}

export const SelectControlled = ({
  name,
  control,
  rules = {},
  errors,
  options,
  className = '',
  editConfig = { config: {} },
  onChange,
  value,
  placeholder = '',
  disabled = false,
}: SelectControlledProps) => {
  const { config } = editConfig

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        // Modo de solo lectura/edición
        if (config?.[name]?.isEdit) {
          const optLabel = options.find((item) => item.value === field.value)?.label
          return (
            <div className={className}>
              {optLabel ? (
                <span className="text-black">{optLabel}</span>
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }

        // Modo editable
        return (
          <FormControl
            className={`InputEx Select2Ex w-full ${className}`}
            variant="standard"
            error={!!errors[name]}
            disabled={disabled}
          >
            <Select
              {...field}
              value={field.value ?? value ?? ''} // Mejor manejo de valores undefined/null
              displayEmpty
              onChange={(e) => {
                // Actualizar el valor del campo del formulario
                field.onChange(e.target.value)
                // Llamar al onChange personalizado si existe
                if (onChange) {
                  onChange(e.target.value)
                }
              }}
              inputProps={{
                'aria-label': name,
              }}
              renderValue={(selected) => {
                if (selected === '' || selected === null || selected === undefined) {
                  return <span className="text-gray-400">{placeholder}</span>
                }
                const selectedOption = options.find((opt) => opt.value === selected)
                return selectedOption?.label || selected
              }}
            >
              {/* Opciones del select */}
              {options.map((option, index) => (
                <MenuItem key={`${option.value}-${index}`} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

            {/* Mensaje de error */}
            {errors[name]?.message && <FormHelperText>{errors[name].message}</FormHelperText>}
          </FormControl>
        )
      }}
    />
  )
}
