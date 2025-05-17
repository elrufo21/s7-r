import { FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
//import { UseFormWatch } from 'react-hook-form'
import { useEffect } from 'react'
import { StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { InvoicePdf } from '@/modules/invoicing/components/InvoicePdf'
//import { FrmBaseDialog } from '@/shared/components/core/Dialog/FrmBaseDialog'
export function Frm_bar_buttons({ setValue, watch }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const setFrmConfigControls = useAppStore((state) => state.setFrmConfigControls)
  /*const {
    appDialogs,
    setAppDialogs,
    createOptions,
    formItem,
    frmCreater,
    setFrmDialogAction,
    setBreadcrumb,
    breadcrumb,
  } = useAppStore((state) => state)
  */
  const openDialog = useAppStore((state) => state.openDialog)
  const closeDialogWithData = useAppStore((state) => state.closeDialogWithData)

  /*const fnc_create_edit = (value: any) => {
    let values = {}
    if (typeof value === 'object') {
      values = { ...value }
    } else {
      values = { name: value, type: 'C' }
    }

    setAppDialogs([
      ...appDialogs,
      {
        action: 'modalAction.CREATE',
        idDialog: appDialogs.length,
        title: 'Crear empresa relacionada',
        content: (fnClose) => (
          <FrmBaseDialog
            config={modalContactConfig}
            values={values}
            fnClose={() => {}}
            idDialog={appDialogs.length}
          />
        ),
        open: true,
        type: 'form',
        afterSave: fncAfterSave,
        onConfirm: saveDialogForm,
        buttonActions: [ButtonOptions.SAVE_AND_CLOSE, ButtonOptions.DISCARD],
      },
    ])
  }*/
  /*
  const validateForm = (watch: UseFormWatch<any>): string[] => {
    const errors: string[] = []
    if (!watch('partner_id')) {
      errors.push(
        'El campo "Factura de cliente" es obligatorio, complételo para validar la factura del cliente.'
      )
    }
    if (!watch('name')) {
      errors.push(
        'El campo "Cliente" es obligatorio, complételo para validar la factura del cliente.'
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

   const onConfirm = () => {
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

    setValue('state', StatusInvoiceEnum.PUBLICADO)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
*/
  const resetDraft = () => {
    setValue('state', StatusInvoiceEnum.BORRADOR)
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  const isEdit = watch('state') === StatusInvoiceEnum.PUBLICADO

  useEffect(() => {
    setFrmConfigControls({
      name: {
        isEdit,
      },
      partner_id: {
        isEdit,
      },
      invoice_date: {
        isEdit,
      },
      reference: {
        isEdit,
      },
      invoice_date_due: {
        isEdit,
      },
      payment_term_id: {
        isEdit,
      },
      currency_id: {
        isEdit,
      },
    })
  }, [setFrmConfigControls, isEdit])

  if (watch('state') === StatusInvoiceEnum.PUBLICADO)
    return (
      <>
        <button className="btn btn-primary">Enviar e imprimir</button>
        <button className="btn btn-secondary">Registrar pago</button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            const dialog = openDialog({
              title: 'Vista previa',
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
        <button className="btn btn-secondary">Nota de crédito</button>
        <button className="btn btn-secondary" onClick={resetDraft}>
          Reestablecer a borrador
        </button>
      </>
    )
  return (
    <>
      <button className="btn btn-primary" onClick={() => {}}>
        Confirmar
      </button>
      <button className="btn btn-secondary">Cancelar</button>
    </>
  )
}
