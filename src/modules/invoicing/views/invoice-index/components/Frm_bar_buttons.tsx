import { ActionTypeEnum, FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import { UseFormWatch } from 'react-hook-form'
import { Enum_Payment_State, StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { InvoicePdf } from '@/modules/invoicing/components/InvoicePdf'
import { FrmBaseDialog } from '@/shared/components/core'
import sendInvoiceConfig from '@/modules/invoicing/views/modal-send-invoice/config'
import creditNoteConfig from '@/modules/invoicing/views/modal-credit-note/config'
import debitNoteConfig from '@/modules/invoicing/views/modal-debit-note/config'
import PaymentTermsConfig from '../../modal-payment/config'
import { CustomToast } from '@/components/toast/CustomToast'
import { getRequiredFieldErrors } from '@/shared/helpers/validators'

export function Frm_bar_buttons({ setValue, watch }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const closeDialogWithData = useAppStore((state) => state.closeDialogWithData)
  const { openDialog, formItem, executeFnc } = useAppStore((state) => state)

  const validateForm = (watch: UseFormWatch<any>): Record<string, any> => {
    const errors: Record<string, any> = {}

    if (!watch('partner_id')) {
      errors.partner_id = {
        type: 'required',
        message: 'El campo "Cliente" es obligatorio',
      }
    }
    if (!watch('c51_id')) {
      errors.c51_id = {
        type: 'required',
        message: 'El campo "Tipo de operación" es obligatorio',
      }
    }
    if (!watch('document_type_id')) {
      errors.document_type_id = {
        type: 'required',
        message: 'El campo "Tipo de documento" es obligatorio',
      }
    }
    if (!watch('move_lines')?.length) {
      errors.move_lines = {
        type: 'required',
        message: 'Debe agregar líneas de factura',
      }
    }

    return errors
  }

  const onConfirm = async () => {
    setFrmAction(FormActionEnum.PRE_SAVE)
    const errorsObj = validateForm(watch)

    if (Object.keys(errorsObj).length > 0) {
      const missingFields = getRequiredFieldErrors(errorsObj, {
        partner_id: 'Cliente',
        c51_id: 'Tipo de operación',
        document_type_id: 'Tipo de documento',
        move_lines: 'Líneas de factura',
      })

      const missingFieldsItems = (
        <ul className="space-y-2 my-2">
          {missingFields.map((field, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span className="text-sm text-white">
                {index + 1}. {field}
              </span>
            </li>
          ))}
        </ul>
      )

      CustomToast({
        title: 'Campos obligatorios',
        description: missingFieldsItems,
        type: 'error',
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
      setValue('state', StatusInvoiceEnum.REGISTERED)
    }
  }

  const onCancel = () => {
    const errorsObj = validateForm(watch)

    if (Object.keys(errorsObj).length > 0) {
      const missingFields = getRequiredFieldErrors(errorsObj, {
        partner_id: 'Cliente',
        c51_id: 'Tipo de operación',
        document_type_id: 'Tipo de documento',
        move_lines: 'Líneas de factura',
      })

      const missingFieldsItems = (
        <ul className="space-y-2 my-2">
          {missingFields.map((field, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
              <span className="text-sm text-white">
                {index + 1}. {field}
              </span>
            </li>
          ))}
        </ul>
      )

      CustomToast({
        title: 'Campos obligatorios',
        description: missingFieldsItems,
        type: 'error',
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
    let getData = (): Record<string, any> => ({})

    const dialog = openDialog({
      title: 'Pagar',
      dialogContent: () => (
        <FrmBaseDialog
          config={PaymentTermsConfig}
          values={{
            [`memo-${dialog}`]: formItem?.name,
            move_id: formItem?.move_id,
            partner_id: formItem?.partner_id,
            date: new Date(),
            state: Enum_Payment_State.IN_PROCESS,
            payment_type: 'R',
            dialog_id: dialog,
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
            const errorsObj: Record<string, any> = {}

            if (!formData[`journal_id-${dialog}`]) {
              errorsObj.journal_id = {
                type: 'required',
                message: 'El campo "Diario" es obligatorio',
              }
            }

            if (!formData[`payment_method_id-${dialog}`]) {
              errorsObj.payment_method_id = {
                type: 'required',
                message: 'Seleccione un método de pago',
              }
            }

            const missingFields = getRequiredFieldErrors(errorsObj, {
              journal_id: 'Diario',
              payment_method_id: 'Método de pago',
            })

            if (missingFields.length > 0) {
              const missingFieldsItems = (
                <ul className="space-y-2 my-2">
                  {missingFields.map((field, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <span className="text-sm text-white">
                        {index + 1}. {field}
                      </span>
                    </li>
                  ))}
                </ul>
              )

              CustomToast({
                title: 'Campos obligatorios',
                description: missingFieldsItems,
                type: 'error',
              })

              return
            }
            formData.journal_id = formData[`journal_id-${dialog}`]
            formData.payment_method_id = formData[`payment_method_id-${dialog}`]
            formData.date = formData[`date-${dialog}`]
            formData.memo = formData[`memo-${dialog}`]

            delete formData[`journal_id-${dialog}`]
            delete formData[`payment_method_id-${dialog}`]
            delete formData[`date-${dialog}`]
            delete formData[`memo-${dialog}`]
            await executeFnc('fnc_payment', ActionTypeEnum.INSERT, formData)
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

  if (watch('state') === StatusInvoiceEnum.REGISTERED)
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
