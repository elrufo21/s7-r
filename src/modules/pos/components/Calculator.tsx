import { useCalculator } from '../context/CalculatorContext'

export default function Calculator() {
  const {
    isOpen,
    closeCalculator,
    displayValue,
    addDigit,
    operation,
    clearDisplay,
    calculateResult,
  } = useCalculator()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-80">
        <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Calculadora</h2>
          <button onClick={closeCalculator} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 bg-gray-50 text-right text-3xl font-medium border-b">
          {displayValue}
        </div>

        <div className="grid grid-cols-4">
          <button
            className="p-4 border-r border-b bg-gray-100 hover:bg-gray-200"
            onClick={() => clearDisplay()}
          >
            C
          </button>
          <button
            className="p-4 border-r border-b hover:bg-gray-100"
            onClick={() => operation('/')}
          >
            ÷
          </button>
          <button
            className="p-4 border-r border-b hover:bg-gray-100"
            onClick={() => operation('*')}
          >
            ×
          </button>
          <button className="p-4 border-b hover:bg-gray-100" onClick={() => operation('-')}>
            -
          </button>

          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('7')}>
            7
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('8')}>
            8
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('9')}>
            9
          </button>
          <button
            className="p-4 border-b hover:bg-gray-100 row-span-2"
            onClick={() => operation('+')}
          >
            +
          </button>

          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('4')}>
            4
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('5')}>
            5
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('6')}>
            6
          </button>

          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('1')}>
            1
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('2')}>
            2
          </button>
          <button className="p-4 border-r border-b hover:bg-gray-100" onClick={() => addDigit('3')}>
            3
          </button>
          <button
            className="p-4 border-b hover:bg-gray-100 row-span-2 bg-blue-500 hover:bg-blue-600 text-white"
            onClick={() => calculateResult()}
          >
            =
          </button>

          <button
            className="p-4 border-r hover:bg-gray-100 col-span-2"
            onClick={() => addDigit('0')}
          >
            0
          </button>
          <button className="p-4 border-r hover:bg-gray-100" onClick={() => addDigit('.')}>
            .
          </button>
        </div>
      </div>
    </div>
  )
}
