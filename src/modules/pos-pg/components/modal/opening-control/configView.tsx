import { frmElementsProps } from '@/shared/shared.types'
import FormRow from '@/shared/components/form/base/FormRow'
import useAppStore from '@/store/app/appStore'
import { FrmBaseDialog } from '@/shared/components/core'
import PosModalCash from '@/modules/pos/views/modal-cash/config'
import { FaMoneyBill } from 'react-icons/fa'
import { PosTextControlled } from '@/shared/ui/inputs/PosTextControlled'

export function FrmMiddle({ control, errors, setValue }: frmElementsProps) {
  const { openDialog, closeDialogWithData, executeFnc } = useAppStore()
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
            setValue('initial_cash', formData.total_cash)
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
  return (
    <div className="w-[500px]">
      <div className="flex items-center gap-4">
        <label className="font-medium min-w-[140px]">Efectivo de apertura</label>
        <div className="flex items-center gap-4 z-10">
          <div className="flex ">
            <PosTextControlled
              name={'initial_cash'}
              control={control}
              errors={errors}
              endButtons={
                <button
                  className="btn z-100 btn-secondary oe_kanban_action cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    fnc_modal_cash()
                  }}
                >
                  <FaMoneyBill />
                </button>
              }
            />
          </div>
          {/* Botón de calculadora solo para efectivo */}
        </div>
      </div>
      <FormRow label="Nota de apertura" className="mt-4">
        <PosTextControlled
          className="col-12 w-[500px]"
          name="opening_note"
          control={control}
          errors={errors}
          multiline
        />
      </FormRow>
    </div>
  )
}
