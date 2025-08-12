import FormRow from '@/shared/components/form/base/FormRow'
import React, { useState } from 'react'

// Componente contador con denominación
function CashCounter({ denomination = 200 }: { denomination?: number }) {
  const [count, setCount] = useState(0)

  const increment = () => setCount((prev) => prev + 1)
  const decrement = () => setCount((prev) => Math.max(0, prev - 1))
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setCount(Math.max(0, value))
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrement}
        className="btn btn-outline-secondary px-3 py-1 text-lg font-semibold"
        style={{ minWidth: '40px' }}
      >
        -
      </button>

      <input
        type="number"
        value={count}
        onChange={handleInputChange}
        className="form-control text-center"
        style={{ width: '80px' }}
        min="0"
      />

      <button
        type="button"
        onClick={increment}
        className="btn btn-outline-secondary px-3 py-1 text-lg font-semibold"
        style={{ minWidth: '40px' }}
      >
        +
      </button>

      <span className="ml-3 font-medium text-gray-700">S/ {denomination.toFixed(2)}</span>
    </div>
  )
}

export function FrmMiddle() {
  return (
    <div className="w-[300px]">
      <FormRow label="">
        <CashCounter denomination={200} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={100} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={50} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={20} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={10} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={5} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={2} />
      </FormRow>
    </div>
  )
}
export function FrmMiddleRight() {
  return (
    <div className="w-[500px]">
      <FormRow label="">
        <CashCounter denomination={1} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={0.5} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={0.25} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={0.2} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={0.1} />
      </FormRow>
      <FormRow label="">
        <CashCounter denomination={0.05} />
      </FormRow>
    </div>
  )
}
