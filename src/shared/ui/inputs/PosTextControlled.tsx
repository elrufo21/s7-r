import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Controller } from 'react-hook-form'
import { ReactNode } from 'react'
import { GrClose } from 'react-icons/gr'

interface TextControlledProps {
  name: string
  placeholder?: string
  rules?: any
  errors: any
  control: any
  className?: string
  style?: any
  multiline?: boolean
  disabled?: boolean
  type?: string
  shrink?: boolean
  endButtons?: ReactNode // 👉 botones extras que quieras pasar desde fuera
}

export const PosTextControlled = ({
  name,
  placeholder = '',
  rules = {},
  errors,
  control,
  className = '',
  style = {},
  multiline = false,
  disabled = false,
  type = 'text',
  shrink = true,
  endButtons,
}: TextControlledProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          placeholder={placeholder}
          type={type}
          multiline={multiline}
          disabled={disabled}
          value={field.value ?? ''}
          inputProps={{ style }}
          InputLabelProps={{ shrink }}
          className={`w-full pl-3 pr-3 py-2 border rounded-md bg-white text-[16px] ${multiline ? 'h-auto' : ''} ${className}`}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          onChange={(e) => field.onChange(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {/* Botón ❌ siempre visible */}
                <IconButton size="small" onClick={() => field.onChange('')}>
                  <GrClose fontSize="small" />
                </IconButton>
                {/* Botones extras desde fuera */}
                {endButtons}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  )
}
