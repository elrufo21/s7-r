// PASO 1: SwitchableTextField con useCallback y memo
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  ChangeEvent,
  ComponentType,
  FocusEvent,
  KeyboardEvent,
  useRef,
  useState,
  useEffect,
  memo,
  useCallback,
} from 'react'

// Higher-Order Component para manejar estado de solo lectura
function withReadOnlyCheck<
  EditProps extends object,
  ReadOnlyProps extends Record<string, unknown> = Record<string, unknown>,
>(
  EditComponent: ComponentType<EditProps>,
  ReadOnlyComponent: ComponentType<ReadOnlyProps>,
  getReadOnlyProps: (editProps: EditProps) => ReadOnlyProps
) {
  return function ReadOnlyWrapper({ isReadOnly, ...props }: EditProps & { isReadOnly: boolean }) {
    if (isReadOnly) {
      const readOnlyProps = getReadOnlyProps(props as EditProps)
      return <ReadOnlyComponent {...readOnlyProps} />
    }

    return <EditComponent {...(props as EditProps)} />
  }
}

// COMPONENTE MEMOIZADO para evitar re-renders
const EditableTextField = memo(
  ({
    value,
    onBlur,
    onChange,
    type = 'text',
    className = '',
    textAlign = 'right',
  }: {
    value: string | number
    onBlur: (e: FocusEvent<HTMLInputElement>) => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    type?: string
    className?: string
    textAlign?: string
  }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [localValue, setLocalValue] = useState(String(value || ''))
    const [isFocused, setIsFocused] = useState(false)

    // Solo actualizar cuando no esté enfocado
    useEffect(() => {
      if (!isFocused) {
        setLocalValue(String(value || ''))
      }
    }, [value, isFocused])

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (inputRef.current) {
          inputRef.current.blur()
        }
      }
    }, [])

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value)
        onChange(e)
      },
      [onChange]
    )

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        setLocalValue(e.target.value)
        onBlur(e)
      },
      [onBlur]
    )

    const handleFocus = useCallback(() => {
      setIsFocused(true)
    }, [])

    return (
      <CustomTextField
        inputRef={inputRef}
        type={type}
        value={localValue}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={className}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        sx={{
          '& input': {
            textAlign: textAlign,
          },
        }}
      />
    )
  }
)

const ReadOnlyText = memo(({ value }: { value: string | number }) => (
  <span className="block py-1 text-right">{value}</span>
))

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      border: 'none',
      outline: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
      outline: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
      outline: 'none',
    },
  },
  '& input': {
    padding: '8px 10px',
    textAlign: 'right',
    fontSize: '14px',
  },
  '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
    display: 'none',
  },
  '& input[type=number]': {
    MozAppearance: 'textfield',
  },
})

export const SwitchableTextField = withReadOnlyCheck(
  EditableTextField,
  ReadOnlyText,
  (editProps) => ({
    value: editProps.value,
  })
)
