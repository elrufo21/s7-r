import { FormControl, FormHelperText, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'

interface SelectControlledProps {
  name: string
  control: any
  rules?: any
  errors: any
  options: { label: string; value: string }[]
  className?: string
  editConfig?: any
  onChange?: any
  value?: string
}

export const SelectControlled = ({
  name,
  control,
  rules = {},
  errors,
  options,
  className = '',
  editConfig = { config: {} },
  onChange = () => {},
  value = '',
}: SelectControlledProps) => {
  const { config } = editConfig
  return (
    <Controller
      name={name}
      control={control}
      // onLoad
      rules={rules}
      render={({ field }) => {
        if (config?.[name]?.isEdit) {
          let optlabel = options.find((item) => item.value === field.value)?.label
          return (
            <>
              <div className={className}>
                {optlabel ? optlabel : <span className="text-transparent">-</span>}
              </div>
            </>
          )
        }
        return (
          <>
            <FormControl
              className={`InputEx Select2Ex w-full ${className}`}
              variant="standard"
              error={errors[name] ? true : false}
            >
              <Select
                {...field}
                value={field.value || '' || value}
                //value={field.value === '1' ? 'CO' : field.value}
                displayEmpty
                onChange={(e) => onChange(e.target.value)}
                inputProps={{
                  'aria-label': 'Without label',
                }}
              >
                {options.map((option, index) => {
                  return (
                    <MenuItem key={index} value={option.value}>
                      {option.label}
                    </MenuItem>
                  )
                })}
              </Select>
              {errors[name]?.message && <FormHelperText>{errors[name]?.message}</FormHelperText>}
            </FormControl>
          </>
        )
      }}
    />
  )
}
