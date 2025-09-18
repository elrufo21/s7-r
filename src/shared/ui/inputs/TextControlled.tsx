import { TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { FocusEvent, useRef, useState, useEffect } from 'react'
//import useAppStore from '@/store/app/appStore'

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
  /*const { setVKeyboardOpen, setFocusedInputRef, setFocusedFieldOnChange } = useAppStore(
    (state) => state
  )*/
  const { config } = editConfig
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [keyboardHover /*, setKeyboardHover*/] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleBlur = (e: FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
    if (handleOnChanged) handleOnChanged(e.target.value)
    setTimeout(() => {
      if (!keyboardHover) setShowKeyboard(false)
    }, 100)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowKeyboard(false)
      }
    }
    if (showKeyboard) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showKeyboard])

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => {
        if (config?.[name]?.isEdit) {
          return (
            <div className={`DivEx ${className}`}>
              {field.value ? (
                <span
                  onClick={() => {
                    if (typeof navigateLink === 'function') {
                      navigateLink()
                    }
                  }}
                  className={`${
                    typeof navigateLink === 'function' ? 'cursor-pointer text-teal-600' : ''
                  }`}
                >
                  {field.value}
                </span>
              ) : (
                <span className="text-transparent">-</span>
              )}
            </div>
          )
        }

        return (
          <div ref={containerRef} style={{ position: 'relative' }}>
            <TextField
              {...field}
              placeholder={placeholder}
              type={type ?? 'text'}
              variant="standard"
              inputRef={(el) => {
                field.ref(el)
                inputRef.current = el
              }}
              multiline={multiline}
              disabled={disabled ?? false}
              value={field.value ?? ''}
              inputProps={{ style }}
              InputLabelProps={{ shrink }}
              className={`InputEx w-full ${multiline ? 'h-auto' : ''} ${className}`}
              error={!!errors[name]}
              helperText={errors[name]?.message}
              onChange={(e) => {
                field.onChange(e)
                handleChange?.(e.target.value)
              }}
              onBlur={handleBlur}
              onClick={() => {
                // Guardar ref en store y abrir teclado
                // setFocusedInputRef(inputRef)
                //setFocusedFieldOnChange(field.onChange)
                //setShowKeyboard(true)
                //setVKeyboardOpen(true)
              }}
              onFocus={() => {
                // Guardar ref en store y abrir teclado
                //   setFocusedInputRef(inputRef)
                // setFocusedFieldOnChange(field.onChange)
                // setShowKeyboard(true)
                //setVKeyboardOpen(true)
              }}
            />
          </div>
        )
      }}
    />
  )
}
