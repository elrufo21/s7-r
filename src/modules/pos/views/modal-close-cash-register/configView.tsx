import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { FaCopy, FaMoneyBill } from 'react-icons/fa'
import PosModalCash from '../modal-cash/config'
import { FrmBaseDialog } from '@/shared/components/core'
const cashCloseData = {
  cash_register_closure: {
    title: 'Closing cash register',
    orders: '2 orders',
    total_amount: 3651.86,
    currency: 'S/',
    accounts: [
      {
        name: 'Cash',
        balance: 1073.84,
        details: {
          opening: 300.0,
          cash_payments: 773.84,
          cash_inflows_outflows: 0.0,
          counted: 1.0,
          difference: -1072.84,
        },
      },
      {
        name: 'Card',
        balance: 2878.02,
        details: {
          counted: 2878.02,
          difference: 0.0,
        },
      },
    ],
    cash_count: {
      amount: 1,
    },
    card_number: {
      amount: 2878.02,
    },
    notes: {
      opening_note: 'nota de apertura 33',
      closing_note: 'Add a closing note...',
    },
    actions: ['Close cash register', 'Discard', 'Cash inflow/outflow', 'Daily sale'],
  },
}

export function FrmBottom({ control, errors, editConfig, setValue }: frmElementsProps) {
  const { openDialog, closeDialogWithData, executeFnc } = useAppStore()
  const cashData = cashCloseData.cash_register_closure

  const fnc_modal_cash = async () => {
    const { oj_data } = await executeFnc('fnc_pos_ticket', 's', [])

    // Dividir la data en dos filas
    const midPoint = Math.ceil(oj_data.length / 2)
    const row1 = oj_data.slice(0, midPoint)
    const row2 = oj_data.slice(midPoint)

    const initialValues = {
      row1: row1,
      row2: row2,
    }
    const dialogId = openDialog({
      title: 'Conteo de efectivo',
      dialogContent: () => <FrmBaseDialog config={PosModalCash} initialValues={initialValues} />,
      buttons: [
        {
          text: 'Cancelar',
          onClick: () => closeDialogWithData(dialogId, {}),
          type: 'cancel',
        },
      ],
    })
  }

  // Función para renderizar campos de input según el tipo de cuenta
  const renderInputField = (account: any) => {
    const isCash = account.name === 'Cash'
    const fieldName = isCash ? 'cash_count' : 'card_number'
    const label = isCash ? 'Conteo de efectivo' : 'Tarjeta Número'

    return (
      <div key={account.name} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700 min-w-[140px]">{label}</label>
          <div className="flex-1"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <TextControlled
              name={fieldName}
              control={control}
              errors={errors}
              editConfig={{ config: editConfig }}
            />
          </div>
          {isCash && (
            <button
              className="btn btn-secondary oe_kanban_action"
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
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full min-h-[100px]">
      {/* Renderizar campos de input dinámicamente */}
      {cashData.accounts.map(renderInputField)}

      <div className="flex items-center gap-4 h-full">
        <label className="font-medium text-gray-700 min-w-[140px]">Nota de cierre</label>
      </div>
      <div className="flex-1">
        <TextControlled
          name="closing_note"
          control={control}
          errors={errors}
          editConfig={{ config: editConfig }}
          multiline={true}
          multilineRows={5}
        />
      </div>
    </div>
  )
}

export function FrmMiddle({ watch }: frmElementsProps) {
  const cashData = cashCloseData.cash_register_closure

  // Función para renderizar una sección de cuenta
  const renderAccountSection = (account: any) => {
    const isCash = account.name === 'Cash'

    return (
      <div key={account.name} className="mb-4">
        <h3 className="text-base font-medium mb-2">
          {account.name === 'Cash'
            ? 'Efectivo'
            : account.name === 'Card'
              ? 'Tarjeta'
              : account.name === 'Customer_Account'
                ? 'Cuenta de cliente'
                : account.name}
          <span className="float-right text-lg font-bold">
            S/ {account.balance?.toFixed(2) || '0.00'}
          </span>
        </h3>
        <div className="pl-4 flex flex-col gap-1">
          {/* Renderizar campos específicos según el tipo de cuenta */}
          {isCash && account.details.opening !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Apertura</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">S/</span>
                <span className="text-gray-800">
                  {account.details.opening?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          )}

          {isCash && account.details.cash_payments !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Pagos en efectivo</span>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">S/</span>
                <span className="text-gray-800">
                  {account.details.cash_payments?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          )}

          {isCash && account.details.cash_inflows_outflows !== undefined && (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-gray-700">Entrada y salida de</span>
                <span className="text-gray-700 ml-1">efectivo</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-1">S/</span>
                <span className="text-gray-800">
                  {account.details.cash_inflows_outflows?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          )}

          {/* Campo Contado - siempre presente */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">
                {isCash
                  ? watch('cash_count') || '0.00'
                  : account.name === 'Card'
                    ? watch('card_number') || '0.00'
                    : account.details.counted?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>

          {/* Campo Diferencia - siempre presente */}
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">
                {isCash
                  ? (account.balance - parseFloat(watch('cash_count') || '0'))?.toFixed(2) || '0.00'
                  : account.name === 'Card'
                    ? (account.balance - parseFloat(watch('card_number') || '0'))?.toFixed(2) ||
                      '0.00'
                    : account.details.difference?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="o_inner_group w-[500px]">
      {/* Renderizar todas las cuentas dinámicamente */}
      {cashData.accounts.map(renderAccountSection)}
    </div>
  )
}
