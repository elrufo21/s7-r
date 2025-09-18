import { ActionTypeEnum, FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { UseFormWatch } from 'react-hook-form'
import { ReactNode } from 'react'
import { Enum_Payment_State, StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { InvoicePdf } from '@/modules/invoicing/components/InvoicePdf'
import { FrmBaseDialog } from '@/shared/components/core'
import sendInvoiceConfig from '@/modules/invoicing/views/modal-send-invoice/config'
import creditNoteConfig from '@/modules/invoicing/views/modal-credit-note/config'
import debitNoteConfig from '@/modules/invoicing/views/modal-debit-note/config'
import PaymentTermsConfig from '../../modal-payment/config'

export function Frm_bar_buttons({ setValue, watch }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const setAppDialog = useAppStore((state) => state.setAppDialog)
  const closeDialogWithData = useAppStore((state) => state.closeDialogWithData)
  const { openDialog, formItem, executeFnc } = useAppStore((state) => state)

  const validateForm = (watch: UseFormWatch<any>): string[] => {
    const errors: string[] = []
    if (!watch('partner_id')) {
      errors.push(
        'El campo "Cliente" es obligatorio, complételo para validar la factura del cliente.'
      )
    }
    if (!watch('c51_id')) {
      errors.push(
        'El campo "Tipo de operacion" es obligatorio, complételo para validar la factura del cliente.'
      )
    }
    if (!watch('document_type_id')) {
      errors.push(
        'El campo "Tipo de documento" es obligatorio, complételo para validar la factura del cliente.'
      )
    }

    if (!watch('move_lines')?.length)
      errors.push('Debe agregar "líneas de factura" antes de validar.')
    return errors
  }

  const generateMessageDialog = (errors: string[]): ReactNode => (
    <div className="w-full p-5">
      {errors.map((err, index) => (
        <p key={index}>{err}</p>
      ))}
    </div>
  )

  const onConfirm = async () => {
    setFrmAction(FormActionEnum.PRE_SAVE)
    const errors = validateForm(watch)

    if (errors.length > 0) {
      setAppDialog({
        title: 'Operación no válida',
        content: generateMessageDialog(errors),
        open: true,
        actions: false,
      })
      return
    }
    if (
      watch('journal_id') &&
      watch('currency_id') &&
      watch('document_type_id') &&
      watch('c51_id') &&
      watch('partner_id')
    ) {
      setValue('state', StatusInvoiceEnum.PUBLICADO)
    }
  }
  const onCancel = () => {
    const errors = validateForm(watch)
    if (errors.length > 0) {
      setAppDialog({
        title: 'Operación no válida',
        content: generateMessageDialog(errors),
        open: true,
        actions: false,
      })
      return
    }

    setValue('state', StatusInvoiceEnum.CANCELADO)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }

  const resetDraft = () => {
    setValue('state', StatusInvoiceEnum.BORRADOR)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }

  const openModal = () => {
    let getData = () => ({})
    const dialog = openDialog({
      title: 'Pagar',
      dialogContent: () => (
        <FrmBaseDialog
          config={PaymentTermsConfig}
          values={{
            memo: formItem?.name,
            move_id: formItem?.move_id,
            partner_id: formItem?.partner_id,
            date: new Date(),
            state: Enum_Payment_State.IN_PROCESS,
            payment_type: 'R',
          }}
          setGetData={(fn: any) => (getData = fn)}
        />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            const formData = getData()
            const res = await executeFnc('fnc_payment', ActionTypeEnum.INSERT, formData)
            console.log(res)
            setFrmAction(FormActionEnum.PRE_SAVE)
            closeDialogWithData(dialog, {})
          },
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialog, {}),
        },
      ],
    })
  }
  const fnc_open_credit_note = async () => {
    const dialog = openDialog({
      title: 'Nota de crédito',
      dialogContent: () => <FrmBaseDialog config={creditNoteConfig} />,
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: () => closeDialogWithData(dialog, {}),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialog, {}),
        },
      ],
    })
  }

  const fnc_open_debit_note = async () => {
    const dialog = openDialog({
      title: 'Nota de debito',
      dialogContent: () => <FrmBaseDialog config={debitNoteConfig} />,
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: () => closeDialogWithData(dialog, {}),
        },
        {
          text: 'Cerrar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialog, {}),
        },
      ],
    })
  }

  const sendInvoice = async () => {
    const initialValues = {
      to: watch('partner_id.email'),
      subject: 'Factura ' + watch('name'),
      message: `
      Apreciable Petirojo,
  
      Aquí encontrará su factura INV/2025/00003 por 118,00 de Petirojo. Realice su pago lo más pronto posible.
  
      Utilice la siguiente referencia para realizar su pago: INV/2025/00003 .
    `,
    }
    const dialog = openDialog({
      title: 'Enviar',
      dialogContent: () => (
        <FrmBaseDialog config={sendInvoiceConfig} initialValues={initialValues} />
      ),
      buttons: [
        {
          text: 'Enviar',
          type: 'confirm',
          onClick: () => closeDialogWithData(dialog, {}),
        },
        {
          text: 'Descartar',
          type: 'cancel',
          onClick: () => closeDialogWithData(dialog, {}),
        },
      ],
    })
  }
  if (watch('state') === StatusInvoiceEnum.PUBLICADO)
    return (
      <>
        <button className="btn btn-primary" onClick={sendInvoice}>
          Enviar
        </button>
        <button className="btn btn-primary">Imprimir</button>
        <button
          className="btn btn-primary"
          onClick={() => {
            openModal()
          }}
        >
          Pagar
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const dialog = openDialog({
              title: 'Vista previa',
              fullScreen: true,
              dialogContent: () => <InvoicePdf watch={watch} />,
              buttons: [
                {
                  text: 'Cerrar',
                  type: 'cancel',
                  onClick: () => {
                    closeDialogWithData(dialog, {})
                  },
                },
              ],
            })
          }}
        >
          Vista previa
        </button>
        <button className="btn btn-secondary" onClick={() => fnc_open_credit_note()}>
          Nota de crédito
        </button>
        <button className="btn btn-secondary" onClick={() => fnc_open_debit_note()}>
          Nota de débito
        </button>
        <button className="btn btn-secondary" onClick={resetDraft}>
          Restablecer a borrador
        </button>
      </>
    )
  if (watch('state') === StatusInvoiceEnum.CANCELADO)
    return (
      <button className="btn btn-secondary" onClick={resetDraft}>
        Restablecer a borrador
      </button>
    )
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
