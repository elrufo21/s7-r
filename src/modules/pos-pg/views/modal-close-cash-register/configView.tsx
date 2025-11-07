import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { FaCopy, FaMoneyBill } from 'react-icons/fa'
import PosModalCash from '../modal-cash/config'
import { FrmBaseDialog } from '@/shared/components/core'
import { PosTextControlled } from '@/shared/ui/inputs/PosTextControlled'
import { useState } from 'react'
const processWatchData = (watchData: any, openingAmount: number = 0) => {
  const hasData = Array.isArray(watchData) && watchData.length > 0
  if (!hasData && openingAmount <= 0) {
    return {
      title: 'Cierre de caja',
      orders: '1 método de pago',
      total_amount: 0,
      currency: 'S/',
      accounts: [
        {
          name: 'Efectivo',
          payment_method_id: 'cash',
          symbol: 'S/',
          isCash: true,
          position: 0,
          details: {
            openingBalance: 0,
            paymentsSales: 0,
            paymentsDebt: 0,
            income: 0,
            outcome: 0,
            openingAmount: 0,
            data: [],
          },
        },
      ],
    }
  }

  // Si no hay transacciones pero sí monto de apertura
  if (!hasData && openingAmount > 0) {
    return {
      title: 'Cierre de caja',
      orders: '1 método de pago',
      total_amount: openingAmount,
      currency: 'S/',
      accounts: [
        {
          name: 'Efectivo',
          payment_method_id: 'cash',
          symbol: 'S/',
          isCash: true,
          position: 0,
          details: {
            openingBalance: openingAmount,
            paymentsSales: 0,
            paymentsDebt: 0,
            income: 0,
            outcome: 0,
            openingAmount: openingAmount,
            data: [],
          },
        },
      ],
    }
  }

  // 🔹 Si sí hay transacciones, procesar normalmente
  const paymentMethodsGrouped = watchData.reduce((acc: any, tx: any) => {
    const key = tx.payment_method_name
    if (!acc[key]) {
      acc[key] = {
        name: key,
        payment_method_id: tx.payment_method_id,
        symbol: 'S/',
        isCash: tx.payment_method_name?.toLowerCase() === 'efectivo',
        position: 0,
        details: {
          openingBalance: 0,
          paymentsSales: 0,
          paymentsDebt: 0,
          income: 0,
          outcome: 0,
          openingAmount: 0,
          data: [],
        },
      }
    }

    const current = acc[key]
    current.details.data.push(tx)

    if (tx.opening_balance && current.isCash) {
      current.details.openingBalance += tx.opening_balance
      current.details.openingAmount += tx.opening_balance
    }

    if (tx.origin === 'D') current.details.paymentsSales += tx.amount
    if (tx.origin === 'G') current.details.paymentsDebt += tx.amount
    if (tx.origin === 'P' && tx.type === 'I') current.details.income += tx.amount
    if (tx.origin === 'P' && tx.type === 'O') current.details.outcome += tx.amount

    return acc
  }, {})

  // Agregar monto de apertura al efectivo
  Object.values(paymentMethodsGrouped).forEach((acc: any) => {
    if (acc.isCash) acc.details.openingAmount += openingAmount
  })

  const accounts = Object.values(paymentMethodsGrouped).sort((a: any, b: any) => {
    if (a.isCash && !b.isCash) return -1
    if (!a.isCash && b.isCash) return 1
    return a.name.localeCompare(b.name)
  })

  const totalAmount = accounts.reduce(
    (sum, acc) =>
      sum +
      acc.details.openingAmount +
      acc.details.paymentsSales +
      acc.details.paymentsDebt +
      acc.details.income -
      acc.details.outcome,
    0
  )

  return {
    title: 'Cierre de caja',
    orders: `${accounts.length} métodos de pago`,
    total_amount: totalAmount,
    currency: accounts[0]?.symbol || 'S/',
    accounts,
  }
}

export function FrmBottom({ control, errors, setValue, watch }: frmElementsProps) {
  const watchData = watch()
  const { openDialog, closeDialogWithData, executeFnc } = useAppStore()
  const openingAmount = Number(watch('openingAmount') ?? 0)
  const cashData = processWatchData(watchData.watchData, openingAmount)
  if (!cashData) {
    return (
      <div className="flex flex-col gap-4 w-full min-h-[100px]">
        <div className="text-center text-gray-500"></div>
      </div>
    )
  }

  const fnc_modal_cash = async () => {
    const { oj_data } = await executeFnc('fnc_pos_ticket', 's', [])
    const midPoint = Math.ceil(oj_data.length / 2)
    const row1 = oj_data.slice(0, midPoint)
    const row2 = oj_data.slice(midPoint)

    const initialValues = { row1, row2, total_cash: 0 }
    let getData = () => ({})

    const dialogId = openDialog({
      title: 'Conteo de efectivo',
      dialogContent: () => (
        <FrmBaseDialog
          config={PosModalCash}
          initialValues={initialValues}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Aceptar',
          type: 'confirm',
          onClick: () => {
            const formData = getData()
            setValue('cash_count', formData.total_cash)
            closeDialogWithData(dialogId, formData)
          },
        },
        {
          text: 'Cancelar',
          onClick: () => closeDialogWithData(dialogId, {}),
          type: 'cancel',
        },
      ],
    })
  }

  const renderInputField = (account: any) => {
    const fieldName = account.isCash ? 'cash_count' : `pm_${account.payment_method_id}`
    const label = account.isCash ? 'Conteo de efectivo' : `Conteo ${account.name}`

    return (
      <div key={`${account.name}-${account.payment_method_id}`} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700 min-w-[140px]">{label}</label>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <PosTextControlled
              name={fieldName}
              control={control}
              errors={errors}
              endButtons={
                <>
                  {account.isCash && (
                    <button
                      className="btn btn-secondary oe_kanban_action mr-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        fnc_modal_cash()
                      }}
                    >
                      <FaMoneyBill />
                    </button>
                  )}
                  <button
                    className="btn btn-secondary oe_kanban_action"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      const expected =
                        account.details.openingAmount +
                        account.details.paymentsSales +
                        account.details.paymentsDebt +
                        account.details.income -
                        account.details.outcome

                      setValue(fieldName, expected.toFixed(2))
                    }}
                    title="Copiar valor esperado"
                  >
                    <FaCopy />
                  </button>
                </>
              }
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-4 w-full min-h-[100px]">
      {cashData.accounts.map(renderInputField)}

      <div className="flex items-center gap-4 h-full">
        <label className="font-medium text-gray-700 min-w-[140px]">Nota de apertura</label>
      </div>
      <div className="flex-1">
        <PosTextControlled name="opening_note" control={control} errors={errors} />
      </div>

      <div className="flex items-center gap-4 h-full">
        <label className="font-medium text-gray-700 min-w-[140px]">Nota de cierre</label>
      </div>
      <div className="flex-1">
        <PosTextControlled name="closing_note" control={control} errors={errors} />
      </div>
    </div>
  )
}
export function FrmMiddle({ watch }: frmElementsProps) {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({})
  const watchData = watch()
  const openingAmount = Number(watch('openingAmount') ?? 0)

  const cashData = processWatchData(watchData.watchData, openingAmount)

  const formatSignedCurrency = (symbol: string, amount: number) => {
    if (amount === 0 || isNaN(amount)) return `${symbol} 0.00`
    return `${amount > 0 ? '+ ' : '- '}${symbol} ${Math.abs(amount).toFixed(2)}`
  }

  if (!cashData) {
    return (
      <div className="o_inner_group w-[500px]">
        <div className="text-center text-gray-500">No hay datos</div>
      </div>
    )
  }

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const renderAccountSection = (account: any) => {
    const fieldName = account.isCash ? 'cash_count' : `pm_${account.payment_method_id}`
    const countedValue = parseFloat(watch(fieldName) || '0')
    const expected =
      account.details.openingAmount +
      account.details.paymentsSales +
      account.details.paymentsDebt +
      account.details.income -
      account.details.outcome
    const difference = expected - countedValue

    const key = `${account.name}-${account.payment_method_id}`
    const isOpen = !!openSections[key]

    return (
      <div key={key} className="mb-4 ">
        <h3 className="text-base font-medium mb-2">
          {account.name}
          <span className="float-right text-lg font-bold">
            {account.symbol} {expected.toFixed(2)}
          </span>
        </h3>

        <div className="pl-4 flex flex-col gap-1">
          {account.isCash && (
            <div className="flex justify-between font-medium">
              <span>Apertura</span>
              <span>
                {account.symbol}{' '}
                {account.isCash
                  ? openingAmount.toFixed(2)
                  : (account.details.openingAmount ?? 0).toFixed(2)}
              </span>
            </div>
          )}

          {account.details.paymentsSales > 0 && (
            <div className="flex justify-between">
              <span>Pagos por ventas</span>
              <span>
                {account.symbol} {account.details.paymentsSales.toFixed(2)}
              </span>
            </div>
          )}
          {account.details.paymentsDebt > 0 && (
            <div className="flex justify-between">
              <span>Pagos por deudas</span>
              <span>
                {account.symbol} {account.details.paymentsDebt.toFixed(2)}
              </span>
            </div>
          )}

          {account.details.income - account.details.outcome !== 0 && (
            <div className=" border-gray-300 mt-2 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  toggleSection(key)
                }}
                className="flex justify-between items-center w-full text-left"
              >
                <span className="flex items-center gap-2">
                  <span className="">{isOpen ? '▲' : '▼'}</span>
                  <span className="font-normal ">Entrada y salida de efectivo</span>
                </span>
                <span className="font-normal">
                  {formatSignedCurrency(
                    account.symbol,
                    account.details.income - account.details.outcome
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2">
                  {account.details.data?.some(
                    (item) => item.type === 'I' && item.origin === 'P'
                  ) && (
                    <div>
                      <div className="mt-1 flex flex-col gap-1 text-sm text-muted">
                        {account.details.data
                          .filter((item) => item.type === 'I' && item.origin === 'P')
                          .map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span>Ingreso {item.reason || item.detail || ''}</span>
                              <span>
                                +{' '}
                                {item.amount_in_currency ||
                                  `${account.symbol} ${item.amount.toFixed(2)}`}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {account.details.data?.some(
                    (item) => item.type === 'O' && item.origin === 'P'
                  ) && (
                    <div>
                      <div className="flex flex-col gap-1 text-sm text-muted">
                        {account.details.data
                          .filter((item) => item.type === 'O' && item.origin === 'P')
                          .map((item, i) => (
                            <div key={i} className="flex justify-between">
                              <span>Salida {item.reason || item.detail || ''}</span>
                              <span>
                                -{' '}
                                {item.amount_in_currency ||
                                  `${account.symbol} ${item.amount.toFixed(2)}`}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-700">Contado</span>
            <span>
              {account.symbol} {countedValue.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className={`${difference !== 0 ? 'text-red-500' : 'text-gray-800'}`}>
              Diferencia
            </span>
            <span className={`${difference !== 0 ? 'text-red-500 font-bold' : 'text-gray-800'}`}>
              {account.symbol} {difference.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return <div className="w-[700px]">{cashData.accounts.map(renderAccountSection)}</div>
}
