import { useState } from 'react'

enum buttonType {
  CASH_IN = 'cash_in',
  CASH_OUT = 'cash_out',
}

export const CustomHeaderCashInAndOut = () => {
  const [selected, setSelected] = useState(buttonType.CASH_IN)
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2 min-w-[1000px] 
                 top-0 bg-white z-50 fixed"
    >
      <div>
        <button
          className={`btn btn-lg lh-lg me-2 rounded-sm border border-gray-300 ${selected === buttonType.CASH_IN ? 'btn-primary' : ''}`}
          onClick={() => setSelected(buttonType.CASH_IN)}
        >
          <span className="font-medium">Entrada de efectivo</span>
        </button>
        <button
          className={`btn btn-lg lh-lg me-2 rounded-sm border border-gray-300 ${selected === buttonType.CASH_OUT ? 'btn-primary' : ''}`}
          onClick={() => setSelected(buttonType.CASH_OUT)}
        >
          <span className="font-medium">Salida de efectivo</span>
        </button>
      </div>
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            S/.
          </div>

          <input
            type="text"
            className="w-[20rem] pl-10 pr-10 py-2 border rounded-md bg-white text-[16px]"
          />
        </div>
      </div>
    </div>
  )
}
