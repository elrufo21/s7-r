import { StatusInvoiceEnum } from '@/modules/invoicing/invoice.types'
import { useAppStore } from '@/store/app/appStore'

export function Frm_bar_status() {
  const formItem = useAppStore((state) => state.formItem)
  const barItems = [
    { state: StatusInvoiceEnum.BORRADOR, label: 'Borrador' },
    { state: StatusInvoiceEnum.PUBLICADO, label: 'Publicado' },
    { state: StatusInvoiceEnum.CANCELADO, label: 'Cancelado' },
  ]
  return (
    <>
      {barItems.map((item) => (
        <div
          key={item.state}
          className={`c_bar_step ${item.state === (formItem?.state ?? StatusInvoiceEnum.BORRADOR) ? 'active' : ''} `}
          data-state={item.state}
        >
          <div className="bar-step">{item.label}</div>
        </div>
      ))}
    </>
  )
}
