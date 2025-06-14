import { FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { ReactNode, useEffect } from 'react'
import { Enum_Payment_State } from '@/modules/invoicing/invoice.types'

export function Frm_bar_buttons({ setValue, watch }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const setFrmConfigControls = useAppStore((state) => state.setFrmConfigControls)
  const { setAppDialog } = useAppStore()

  const validateForm = (): string[] => {
    const errors: string[] = []
    return errors
  }

  const generateMessageDialog = (errors: string[]): ReactNode => (
    <div className="w-full p-5">
      {errors.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  )

  const onCancel = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setAppDialog({
        title: 'Operación no válida',
        content: generateMessageDialog(errors),
        open: true,
        actions: false,
      })
      return
    }

    setValue('state', Enum_Payment_State.CANCELLED)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }

  const onConfirm = () => {
    const errors = validateForm()
    if (errors.length > 0) {
      setAppDialog({
        title: 'Operación no válida',
        content: generateMessageDialog(errors),
        open: true,
        actions: false,
      })
      return
    }

    setValue('state', Enum_Payment_State.IN_PROCESS)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }

  const resetDraft = () => {
    setValue('state', Enum_Payment_State.DRAFT)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }

  const isEdit =
    watch('state') === Enum_Payment_State.IN_PROCESS ||
    watch('state') === Enum_Payment_State.PAID ||
    watch('state') === Enum_Payment_State.CANCELLED

  useEffect(() => {
    setFrmConfigControls({
      company_id: { isEdit },
      memo: { isEdit },
      currency_id: { isEdit },
      amount: { isEdit },
      partner_id: { isEdit },
      date: { isEdit },
      payment_type: { isEdit },
      journal_id: { isEdit },
      payment_method_id: { isEdit },
      bank_account_id: { isEdit },
    })
  }, [setFrmConfigControls, isEdit])

  // ✅ Mostrar solo "Reestablecer a borrador" si está cancelado
  if (watch('state') === Enum_Payment_State.CANCELLED) {
    return (
      <button className="btn btn-secondary" onClick={resetDraft}>
        Reestablecer a borrador
      </button>
    )
  }

  // ✅ Mostrar "Reestablecer a borrador" y "Marcar como enviado" si está en proceso
  if (watch('state') === Enum_Payment_State.IN_PROCESS) {
    return (
      <>
        <button className="btn btn-secondary" onClick={resetDraft}>
          Reestablecer a borrador
        </button>
        <button className="btn btn-secondary">Marcar como enviado</button>
      </>
    )
  }

  // ✅ Estados por defecto (ej. borrador): Confirmar y Cancelar
  return (
    <>
      <button className="btn btn-primary" onClick={onConfirm}>
        Confirmar
      </button>
      <button className="btn btn-secondary" onClick={onCancel}>
        Cancelar
      </button>
    </>
  )
}
