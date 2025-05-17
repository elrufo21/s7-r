import { useEffect, useRef } from 'react'

interface IndeterminateCheckboxProps {
  indeterminate: boolean
  className: string
}

export const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: IndeterminateCheckboxProps) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = indeterminate
      }
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' cursor-pointer checkboxEx'}
      {...rest}
    />
  )
}
