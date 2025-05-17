import { createContext, useState, useContext, type ReactNode } from 'react'

export enum Operation {
  QUANTITY = 'quantity',
  PRICE = 'price',
  DISCOUNT = 'discount',
}
interface CalculatorContextType {
  isOpen: boolean
  openCalculator: () => void
  closeCalculator: () => void
  displayValue: string
  addDigit: (digit: string) => void
  operation: Operation
  setOperation: (op: Operation) => void
  clearDisplay: () => void
  calculateResult: () => void
  setClearOnNextDigit: (clear: boolean) => void
}

const CalculatorContext = createContext<CalculatorContextType | null>(null)

export const useCalculator = () => {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}

export const CalculatorProvider = ({ children }: { children: ReactNode }) => {
  const [operation, setOperation] = useState(Operation.QUANTITY)
  const [isOpen, setIsOpen] = useState(false)
  const [displayValue, setDisplayValue] = useState('0')
  const [clearOnNextDigit, setClearOnNextDigit] = useState(false)
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)

  const openCalculator = () => setIsOpen(true)
  const closeCalculator = () => setIsOpen(false)

  const addDigit = (digit: string) => {
    if (digit === '.' && displayValue.includes('.')) {
      return
    }

    if (clearOnNextDigit) {
      setDisplayValue(digit)
      setClearOnNextDigit(false)
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit)
    }
  }

  const clearDisplay = () => {
    setDisplayValue('0')
    setPreviousValue(null)
    setOperator(null)
    setClearOnNextDigit(false)
  }

  const calculateResult = () => {
    if (previousValue === null || operator === null) {
      return
    }

    const current = Number.parseFloat(displayValue)
    let result = 0

    switch (operator) {
      case '+':
        result = previousValue + current
        break
      case '-':
        result = previousValue - current
        break
      case '*':
        result = previousValue * current
        break
      case '/':
        result = previousValue / current
        break
      default:
        return
    }

    setDisplayValue(String(result))
    setPreviousValue(null)
    setOperator(null)
    setClearOnNextDigit(true)
  }

  return (
    <CalculatorContext.Provider
      value={{
        isOpen,
        openCalculator,
        closeCalculator,
        displayValue,
        addDigit,
        clearDisplay,
        calculateResult,
        operation,
        setOperation,
        setClearOnNextDigit,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  )
}
