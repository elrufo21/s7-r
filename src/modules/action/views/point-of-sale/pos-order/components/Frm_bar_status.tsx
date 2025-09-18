import { TypeStateOrder } from '@/modules/pos/types'
import { useAppStore } from '@/store/app/appStore'

export function Frm_bar_status() {
  const formItem = useAppStore((state) => state.formItem)
  const currentState = formItem?.state ?? TypeStateOrder.IN_PROGRESS

  const allStates = [
    //{ state: TypeStateOrder.IN_PROGRESS || TypeStateOrder.PAY, label: 'En progreso' },
    //{ state: TypeStateOrder.PAID, label: 'Pagado' },
    { state: TypeStateOrder.REGISTERED, label: 'Registrado' },
    { state: TypeStateOrder.CANCELED, label: 'Cancelado' },
    // { state: TypeStateOrder.PENDING_PAYMENT, label: 'Pendiente de pago' },
  ]

  const visibleStates = allStates.filter((item) => {
    return item.state === TypeStateOrder.IN_PROGRESS || item.state === TypeStateOrder.PAY
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
