import { FormActionEnum, frmElementsProps } from '@/shared/shared.types'
import useAppStore from '@/store/app/appStore'
import PosPaymentModalConfig from '../../payment-modal/config'
import { useEffect } from 'react'
import { FrmBaseDialog } from '@/shared/components/core'
import { PosOrderStateEnum } from '../../types'
import { TypeStateOrder, TypeStatePayment } from '@/modules/pos/types'

export function Frm_bar_buttons({ watch, setValue }: frmElementsProps) {
  const setFrmAction = useAppStore((state) => state.setFrmAction)
  const { openDialog, closeDialogWithData, setFrmDialogAction } = useAppStore((state) => state)

  const setFrmConfigControls = useAppStore((state) => state.setFrmConfigControls)

  useEffect(() => {
    setFrmConfigControls({
      session_name: {
        isEdit: true,
      },
      point_name: {
        isEdit: true,
      },
      name: {
        isEdit: true,
      },
      order_date: {
        isEdit: true,
      },
      user_name: {
        isEdit: true,
      },
      partner_id: {
        isEdit: watch('state') === PosOrderStateEnum.PAID,
      },
    })
  }, [setFrmConfigControls, watch('state')])

  const openModal = () => {
    let getData = () => ({})
    console.log(getData)
    const dialog = openDialog({
      title: 'Pagar',
      dialogContent: () => (
        <FrmBaseDialog config={PosPaymentModalConfig} setGetData={(fn: any) => (getData = fn)} />
      ),
      buttons: [
        {
          text: 'Guardar y cerrar',
          type: 'confirm',
          onClick: async () => {
            pay_order()
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

  const return_order = () => {
    setValue('state', 'N')
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  const returnRegistered = () => {
    if (watch('dialogId')) {
      setValue('state', TypeStateOrder.REGISTERED)
      setFrmDialogAction('u')
    } else {
      setValue('state', TypeStateOrder.REGISTERED)
      setFrmAction(FormActionEnum.PRE_SAVE)
    }
  }
  const pay_order = () => {
    setValue('state', 'I')
    setFrmAction(FormActionEnum.PRE_SAVE)
  }
  const cancelOrder = () => {
    if (watch('dialogId')) {
      setFrmDialogAction('u')
      setValue('state', TypeStateOrder.CANCELED)
      //setFrmAction(FormActionEnum.PRE_SAVE)
    } else {
      setValue('state', TypeStateOrder.CANCELED)
      setFrmAction(FormActionEnum.PRE_SAVE)
    }
  }

  return (
    <>
      {watch('state') === PosOrderStateEnum.PAID && (
        <>
          <button className="btn btn-secondary" onClick={() => {}}>
            Factura
          </button>

          <button className="btn btn-secondary" onClick={return_order}>
            Devolver producto
          </button>
        </>
      )}
      {(watch('payment_state') == TypeStatePayment.PARTIAL_PAYMENT ||
        watch('payment_state') == TypeStatePayment.PENDING_PAYMENT) && <></>}
      {watch('state') === PosOrderStateEnum.CANCELED && (
        <button className="btn btn-secondary" onClick={returnRegistered}>
          Restablecer a Registrado
        </button>
      )}
      {watch('state') === PosOrderStateEnum.REGISTERED && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            cancelOrder()
          }}
        >
          Cancelar
        </button>
      )}
    </>
  )
}
