import { StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { useAppStore } from '@/store/app/appStore'

export function Frm_bar_status() {
  const formItem = useAppStore((state) => state.formItem)
  const currentState = formItem?.state ?? StatusInvoiceEnum.BORRADOR

  const allStates = [
    { state: StatusInvoiceEnum.BORRADOR, label: 'Borrador' },
    { state: StatusInvoiceEnum.PUBLICADO, label: 'Registrado' },
    { state: StatusInvoiceEnum.CANCELADO, label: 'Cancelado' },
  ]

  const visibleStates = allStates.filter((item) => {
    if (currentState === StatusInvoiceEnum.CANCELADO) {
      return item.state === StatusInvoiceEnum.BORRADOR || item.state === StatusInvoiceEnum.CANCELADO
    }

    return item.state === StatusInvoiceEnum.BORRADOR || item.state === StatusInvoiceEnum.PUBLICADO
  })

  return (
    <>
      {visibleStates.map((item) => (
        <div
          key={item.state}
          className={`c_bar_step ${item.state === currentState ? 'active' : ''}`}
          data-state={item.state}
        >
          <div className="bar-step">{item.label}</div>
        </div>
      ))}
    </>
  )
}
