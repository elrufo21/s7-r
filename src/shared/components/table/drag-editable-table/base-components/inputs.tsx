import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ChangeEvent, ComponentType, FocusEvent, KeyboardEvent, useRef } from 'react'

// Higher-Order Component para manejar estado de solo lectura
function withReadOnlyCheck<
  EditProps extends object,
  ReadOnlyProps extends Record<string, unknown> = Record<string, unknown>,
>(
  EditComponent: ComponentType<EditProps>,
  ReadOnlyComponent: ComponentType<ReadOnlyProps>,
  getReadOnlyProps: (editProps: EditProps) => ReadOnlyProps
) {
  // El componente resultante recibe los props del componente editable más isReadOnly
  return function ReadOnlyWrapper({ isReadOnly, ...props }: EditProps & { isReadOnly: boolean }) {
    if (isReadOnly) {
      // Transformamos los props de edición a props de solo lectura
      const readOnlyProps = getReadOnlyProps(props as EditProps)
      return <ReadOnlyComponent {...readOnlyProps} />
    }

    // Si no es de solo lectura, pasamos los props originales al componente editable
    return <EditComponent {...(props as EditProps)} />
  }
}

// Componentes base
const EditableTextField = ({
  value,
  onBlur,
  onChange,
  type = 'text',
  className = '',
}: {
  value: string | number
  onBlur: (e: FocusEvent<HTMLInputElement>) => void
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  className?: string
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputRef.current) {
        inputRef.current.blur()
      }
    }
  }

  return (
    <CustomTextField
      inputRef={inputRef}
      type={type}
      defaultValue={value}
      onBlur={onBlur}
      className={className}
      onChange={onChange}
      onKeyDown={handleKeyDown}
    />
  )
}

const ReadOnlyText = ({ value }: { value: string | number }) => (
  <span className="block py-1 text-right">{value}</span>
)

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
