import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Controller } from 'react-hook-form'
import { ReactNode, useRef, useState, useEffect, useCallback } from 'react'
import { GrClose } from 'react-icons/gr'
import { createPortal } from 'react-dom'
import { NumericKeyboard } from './keys/NumericKeyboard'
import VirtualKeyboard from './keys/VirtualKeyBoard'

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
  endButtons?: ReactNode
  enableVirtualKeyboard?: boolean
  useNumericKeyboard?: boolean
  isInsideModal?: boolean
  autocompleteProp?: string
}

let globalKeyboardState: {
  activeInputRef: HTMLInputElement | HTMLTextAreaElement | null
  showKeyboard: boolean
  setShowKeyboard: ((show: boolean) => void) | null
} = {
  activeInputRef: null,
  showKeyboard: false,
  setShowKeyboard: null,
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
  enableVirtualKeyboard = true,
  useNumericKeyboard = false,
  isInsideModal = false,
  autocompleteProp = 'off',
}: TextControlledProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [keyboardPosition, setKeyboardPosition] = useState<any>({ position: 'bottom' })
  const activeInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (showKeyboard) {
      globalKeyboardState.showKeyboard = true
      globalKeyboardState.setShowKeyboard = setShowKeyboard
      globalKeyboardState.activeInputRef = activeInputRef.current
    }
  }, [showKeyboard])

  const calculateKeyboardPosition = useCallback(() => {
    if (!containerRef.current) return { position: 'bottom' as const }

    if (isInsideModal) {
      const inputRect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const windowMiddle = windowHeight / 2

      if (inputRect.top < windowMiddle) {
        return { position: 'bottom' as const }
      } else {
        return { position: 'top' as const }
      }
    }

    const inputRect = containerRef.current.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const keyboardHeight = useNumericKeyboard ? 350 : 280

    const spaceBelow = windowHeight - inputRect.bottom
    const spaceAbove = inputRect.top

    if (spaceBelow < keyboardHeight && spaceAbove > keyboardHeight) {
      return { position: 'top' as const }
    }

    return { position: 'bottom' as const }
  }, [useNumericKeyboard, isInsideModal])

  const handleVirtualKeyPress = useCallback(
    (key: string) => {
      const input = activeInputRef.current
      if (!input) return

      const currentValue = input.value || ''
      let newValue = currentValue

      switch (key) {
        case 'Backspace':
          newValue = currentValue.slice(0, -1)
          break
        case 'Space':
          newValue = currentValue + ' '
          break
        case 'Clear':
          newValue = ''
          break
        case '+/-':
          if (currentValue.startsWith('-')) {
            newValue = currentValue.substring(1)
          } else if (currentValue.length > 0) {
            newValue = '-' + currentValue
          }
          break
        default:
          newValue = currentValue + (capsLock ? key.toUpperCase() : key.toLowerCase())
      }

      const isTextArea = input instanceof HTMLTextAreaElement
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        isTextArea ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
        'value'
      )?.set

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(input, newValue)
        const inputEvent = new Event('input', { bubbles: true })
        input.dispatchEvent(inputEvent)
        input.focus()
      }
    },
    [capsLock]
  )

  const toggleKeyboard = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (inputRef.current) {
        activeInputRef.current = inputRef.current
        globalKeyboardState.activeInputRef = inputRef.current
      }

      if (
        globalKeyboardState.showKeyboard &&
        globalKeyboardState.setShowKeyboard &&
        !showKeyboard
      ) {
        globalKeyboardState.setShowKeyboard(false)
      }

      const position = calculateKeyboardPosition()
      setKeyboardPosition(position)
      setShowKeyboard((prev) => !prev)
    },
    [showKeyboard, calculateKeyboardPosition]
  )

  const closeKeyboard = useCallback(() => {
    setShowKeyboard(false)
    globalKeyboardState.showKeyboard = false
    globalKeyboardState.activeInputRef = null
  }, [])

  const toggleCapsLock = useCallback(() => {
    setCapsLock((prev) => !prev)
  }, [])

  const handleInputFocus = useCallback(() => {
    if (inputRef.current) {
      activeInputRef.current = inputRef.current

      if (
        globalKeyboardState.showKeyboard &&
        globalKeyboardState.activeInputRef !== inputRef.current
      ) {
        if (globalKeyboardState.setShowKeyboard) {
          globalKeyboardState.setShowKeyboard(false)
        }
      }
    }

    if (enableVirtualKeyboard && !showKeyboard) {
      const position = calculateKeyboardPosition()
      setKeyboardPosition(position)
      setShowKeyboard(true)

      if (inputRef.current) {
        activeInputRef.current = inputRef.current
        globalKeyboardState.activeInputRef = inputRef.current
        globalKeyboardState.showKeyboard = true
        globalKeyboardState.setShowKeyboard = setShowKeyboard
      }
    }
  }, [enableVirtualKeyboard, showKeyboard, calculateKeyboardPosition])

  const renderKeyboard = () => {
    if (!enableVirtualKeyboard || !showKeyboard) return null

    const keyboardComponent = useNumericKeyboard ? (
      <NumericKeyboard
        onKeyPress={handleVirtualKeyPress}
        onClose={closeKeyboard}
        position={keyboardPosition}
      />
    ) : (
      <VirtualKeyboard
        onKeyPress={handleVirtualKeyPress}
        onClose={closeKeyboard}
        capsLock={capsLock}
        onCapsLockToggle={toggleCapsLock}
        position={keyboardPosition}
      />
    )

    return createPortal(keyboardComponent, document.body)
  }

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <div ref={containerRef} style={{ position: 'relative' }}>
          <TextField
            {...field}
            placeholder={placeholder}
            type={type}
            multiline={multiline}
            disabled={disabled}
            value={field.value ?? ''}
            inputProps={{ style }}
            inputRef={(el) => {
              field.ref(el)
              inputRef.current = el
            }}
            InputLabelProps={{ shrink }}
            className={`w-full pl-3 pr-3 py-2 rounded-md bg-white text-[16px] ${multiline ? 'h-auto' : ''} ${className}`}
            error={!!errors[name]}
            helperText={errors[name]?.message}
            onChange={(e) => field.onChange(e.target.value)}
            onFocus={handleInputFocus}
            autoComplete={autocompleteProp}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => field.onChange('')}>
                    <GrClose fontSize="small" />
                  </IconButton>

                  {endButtons}
                </InputAdornment>
              ),
            }}
          />

          {renderKeyboard()}
        </div>
      )}
    />
  )
}
