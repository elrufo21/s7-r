import { TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { FocusEvent } from 'react'

interface TextControlledProps {
  name: string
  placeholder?: string
  rules?: any
  errors: any
  control: any
  className?: string
  style?: any
  multiline?: boolean
  editConfig?: any
  shrink?: boolean
  handleOnChanged?: ((value: string) => void) | null
  handleChange?: ((value: string) => void) | null
  disabled?: boolean
  type?: string
  navigateLink?: () => void
  multilineRows?: number
}

export const TextControlled = ({
  name,
  placeholder = '',
  rules = {},
  errors,
  control,
  className = '',
  style = {},
  multiline = false,
  editConfig = { config: {} },
  shrink = true,
  handleOnChanged = null,
  disabled,
  type,
  navigateLink,
  handleChange,
}: TextControlledProps) => {
  const { config } = editConfig

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
    if (handleOnChanged) handleOnChanged(e.target.value)
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (config?.[name]?.isEdit) {
          return (
            <div className={'DivEx ' + className}>
              {field.value ? field.value : <span className="text-transparent">-</span>}
            </div>
          )
        }

        return (
          <TextField
            {...field}
            placeholder={placeholder}
            type={type ?? 'text'}
            variant="standard"
            inputRef={field.ref}
            multiline={multiline}
            //rows={multilineRows ? multilineRows : 1}
            disabled={disabled ?? false}
            value={field.value ? field.value : ''}
            inputProps={{ style }}
            //readOnly={readOnly}
            InputLabelProps={{ shrink }}
            // className={`${className ? className : "InputEx w-full"}`}
            //className={`InputEx w-full  + className`}
            className={`InputEx w-full ${multiline ? 'h-auto' : ''} ${className}`}
            error={errors[name] ? true : false}
            helperText={errors[name] && errors[name]?.message}
            onChange={(e) => {
              field.onChange(e)
              handleChange?.(e.target.value)
            }}
            onBlur={handleBlur}
            onClick={() => {
              navigateLink?.()
            }}
          />
        )
      }}
    ></Controller>
  )
}
