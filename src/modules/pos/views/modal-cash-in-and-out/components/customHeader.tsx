import { useState } from 'react'

enum buttonType {
  CASH_IN = 'cash_in',
  CASH_OUT = 'cash_out',
}

export const CustomHeaderCashInAndOut = () => {
  const [selected, setSelected] = useState(buttonType.CASH_IN)
  console.log('selected', selected)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border-b gap-2">
      <div>
        <button
          className={`btn  btn-lg lh-lg me-2 rounded-sm border border-gray-300 ${selected === buttonType.CASH_IN ? 'btn-primary' : ''}`}
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
        <input type="text" placeholder="/S" className="input input-bordered w-full" />
      </div>
    </div>
  )
}
