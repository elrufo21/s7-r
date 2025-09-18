import { frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { FaCopy, FaMoneyBill } from 'react-icons/fa'
import PosModalCash from '../modal-cash/config'
import { FrmBaseDialog } from '@/shared/components/core'
import { PosTextControlled } from '@/shared/ui/inputs/PosTextControlled'

const processWatchData = (watchData: any) => {
  if (!watchData) return null
  const paymentMethods = watchData
    ?.filter(
      (value: any) =>
        value !== null &&
        typeof value === 'object' &&
        value.name &&
        value.amount !== undefined &&
        value.payment_method_id
    )
    .sort((a: any, b: any) => a.position - b.position)

  const accounts = paymentMethods
    .map((method: any) => {
      const findDetailByDescription = (searchTerms: string[]) =>
        method.details.find((d: any) =>
          searchTerms.some((term) => d.description.toLowerCase().includes(term.toLowerCase()))
        )

      const openingDetail = findDetailByDescription(['apertura', 'opening'])
      const countedDetail = findDetailByDescription(['contado', 'counted'])
      const differenceDetail = findDetailByDescription(['diferencia', 'difference'])
      const paymentsDetail = findDetailByDescription([
        `pagos en ${method.name.toLowerCase()}`,
        'pagos',
        'payments',
      ])

      return {
        name: method.name,
        balance: method.amount,
        symbol: method.symbol,
        payment_method_id: method.payment_method_id,
        details: {
          opening: openingDetail?.amount || 0,
          cash_payments: paymentsDetail?.amount || 0,
          cash_inflows_outflows: 0,
          counted: countedDetail?.amount || 0,
          difference: differenceDetail?.amount || 0,
        },
        isCash: method.is_cash === true,
        position: method.position,
      }
    })
    .sort((a: any, b: any) => {
      if (a.isCash && !b.isCash) return -1
      if (!a.isCash && b.isCash) return 1
      return a.position - b.position
    })

  const totalAmount = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0)

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
  const cashData = processWatchData(watchData.watchData)
  if (!cashData) {
    return (
      <div className="flex flex-col gap-4 w-full min-h-[100px]">
        <div className="text-center text-gray-500">Cargando datos de cierre de caja...</div>
      </div>
    )
  }

  const fnc_modal_cash = async () => {
    const { oj_data } = await executeFnc('fnc_pos_ticket', 's', [])

    const midPoint = Math.ceil(oj_data.length / 2)
    const row1 = oj_data.slice(0, midPoint)
    const row2 = oj_data.slice(midPoint)

    const initialValues = {
      row1: row1,
      row2: row2,
      total_cash: 0,
    }
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
          <div className="flex-1"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <PosTextControlled
              name={fieldName}
              control={control}
              errors={errors}
              endButtons={
                <>
                  {/* Botón de calculadora solo para efectivo */}
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
                      setValue(fieldName, account.balance)
                    }}
                    title="Copiar valor"
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
  console.log('watch', watch('closing_note'))
  return (
    <>
      <div className="flex flex-col gap-4 w-full min-h-[100px]">
        {/* Renderizar campos de input dinámicamente para TODOS los métodos de pago */}
        {cashData.accounts.map(renderInputField)}

        <>
          <div className="flex items-center gap-4 h-full">
            <label className="font-medium text-gray-700 min-w-[140px]">Nota de cierre</label>
          </div>
          <div className="flex-1">
            <PosTextControlled name="closing_note" control={control} errors={errors} />
          </div>
        </>
        <>
          <div className="flex items-center gap-4 h-full">
            <label className="font-medium text-gray-700 min-w-[140px]">Nota de apertura</label>
          </div>
          <div className="flex-1">
            <PosTextControlled name="opening_note" control={control} errors={errors} />
          </div>
        </>
      </div>
    </>
  )
}

export function FrmMiddle({ watch }: frmElementsProps) {
  const watchData = watch()
  const cashData = processWatchData(watchData.watchData)

  // Si no hay datos, mostrar mensaje de carga
  if (!cashData) {
    return (
      <div className="o_inner_group w-[500px]">
        <div className="text-center text-gray-500">Cargando datos de cierre de caja...</div>
      </div>
    )
  }

  // Función para renderizar una sección de cuenta (adaptada para cualquier método)
  const renderAccountSection = (account: any) => {
    const fieldName = account.isCash ? 'cash_count' : `pm_${account.payment_method_id}`
    const countedValue = watch(fieldName) || '0.00'
    const difference = account.balance - parseFloat(countedValue)

    return (
      <div key={`${account.name}-${account.payment_method_id}`} className="mb-4">
        <h3 className="text-base font-medium mb-2">
          {account.name}
          <span className="float-right text-lg font-bold">
            {account.symbol} {account.balance?.toFixed(2) || '0.00'}
          </span>
        </h3>
        <div className="pl-4 flex flex-col gap-1">
          {/* Renderizar apertura solo si existe */}
          {account.details.opening > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Apertura</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">{account.symbol}</span>
                <span className="text-gray-800">
                  {account.details.opening?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          )}

          {/* Renderizar pagos solo si existe */}
          {account.details.cash_payments > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Pagos en {account.name}</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">{account.symbol}</span>
                <span className="text-gray-800">
                  {account.details.cash_payments?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          )}

          {/* Campo Contado - siempre presente para todos los métodos */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">{account.symbol}</span>
              <span className="text-gray-800">{parseFloat(countedValue).toFixed(2)}</span>
            </div>
          </div>

          {/* Campo Diferencia - siempre presente para todos los métodos */}
          <div className="flex justify-between items-center">
            <span className={`${difference !== 0 ? 'text-red-500' : 'text-gray-800'} mr-1`}>
              Diferencia
            </span>
            <div className="flex items-center">
              <span className={`font-bold ${difference !== 0 ? 'text-red-500' : 'text-gray-800'}`}>
                <span>{account.symbol}</span>
                {difference.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="o_inner_group w-[500px]">
      {/* Renderizar todas las cuentas dinámicamente - funciona para cualquier método */}
      {cashData.accounts.map(renderAccountSection)}
    </div>
  )
}
