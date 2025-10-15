import FormRow from '@/shared/components/form/base/FormRow'
import { frmElementsProps } from '@/shared/shared.types'
import { useState } from 'react'

function CashCounter({
  denomination = 200,
  setValue,
  watch,
}: {
  denomination?: number
  setValue: (name: string, value: any) => void
  watch: (name: string) => any
}) {
  const [count, setCount] = useState(0)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => Math.max(0, prev - 1))

  const handleIncrement = () => {
    setValue('total_cash', watch('total_cash') + denomination)
  }
  const handleDecrement = () => {
    setValue('total_cash', Math.max(0, watch('total_cash') - denomination))
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          handleDecrement()
          decrement()
        }}
        className="btn btn-outline-secondary px-3 py-1 text-lg font-semibold"
        style={{ minWidth: '40px' }}
      >
        -
      </button>

      <input
        type="number"
        value={count}
        className="form-control text-center"
        style={{ width: '80px' }}
        min="0"
      />

      <button
        type="button"
        onClick={() => {
          increment()
          handleIncrement()
        }}
        className="btn btn-outline-secondary px-3 py-1 text-lg font-semibold"
        style={{ minWidth: '40px' }}
      >
        +
      </button>

      <span className="ml-3 font-medium text-gray-700">S/ {denomination.toFixed(2)}</span>
    </div>
  )
}

export function FrmMiddle({ watch, setValue }: frmElementsProps) {
  return (
    <div className="w-[300px]">
      {watch('row1').map((item: any) => (
        <FormRow label="">
          <CashCounter denomination={item.value} setValue={setValue} watch={watch} />
        </FormRow>
      ))}
    </div>
  )
}
export function FrmMiddleRight({ watch, setValue }: frmElementsProps) {
  return (
    <div className="w-[500px]">
      {watch('row2').map((item: any) => (
        <FormRow label="">
          <CashCounter denomination={item.value} setValue={setValue} watch={watch} />
        </FormRow>
      ))}
    </div>
  )
}
