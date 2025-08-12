import { frmElementsProps } from '@/shared/shared.types'
import { TextControlled } from '@/shared/ui'
import useAppStore from '@/store/app/appStore'
import { FaCopy, FaMoneyBill } from 'react-icons/fa'
import PosModalCash from '../modal-cash/config'
import { FrmBaseDialog } from '@/shared/components/core'

export function FrmBottom({ control, errors, editConfig }: frmElementsProps) {
  const { openDialog, closeDialogWithData } = useAppStore()
  const fnc_modal_cash = () => {
    const dialogId = openDialog({
      title: 'Conteo de efectivo',
      dialogContent: () => <FrmBaseDialog config={PosModalCash} />,
      buttons: [
        {
          text: 'Cancelar',
          onClick: () => closeDialogWithData(dialogId, {}),
          type: 'cancel',
        },
      ],
    })
  }
  return (
    <div className="flex flex-col gap-4 w-full min-h-[100px]">
      <div className="flex items-center gap-4">
        <label className="font-medium text-gray-700 min-w-[140px]">Conteo de efectivo</label>
        <div className="flex-1"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <TextControlled
            name="cash_count"
            control={control}
            errors={errors}
            editConfig={{ config: editConfig }}
          />
        </div>
        <button
          className="btn btn-secondary oe_kanban_action "
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            fnc_modal_cash()
          }}
        >
          <FaMoneyBill />
        </button>
        <button className="btn btn-secondary oe_kanban_action">
          <FaCopy />
        </button>
      </div>

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

export function FrmMiddle() {
  return (
    <div className="o_inner_group w-[500px]">
      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">Efectivo POS</h3>
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Apertura</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-gray-700">Entrada y salida de</span>
              <span className="text-gray-700 ml-1">efectivo</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">Cuenta de cliente</h3>
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">Tarjeta</h3>
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">Efectivo POS 2</h3>
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-medium mb-2">Tarjeta 2</h3>
        <div className="pl-4 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Contado</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Diferencia</span>
            <div className="flex items-center">
              <span className="text-gray-600 mr-1">S/</span>
              <span className="text-gray-800">0.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
