import { Enum_Payment_State } from '@/modules/invoicing/invoice.types'
import { useAppStore } from '@/store/app/appStore'

export function Frm_bar_status() {
  const formItem = useAppStore((state) => state.formItem)
  const currentState = formItem?.state ?? Enum_Payment_State.DRAFT

  const allStates = [
    { state: Enum_Payment_State.DRAFT, label: 'Borrador' },
    { state: Enum_Payment_State.IN_PROCESS, label: 'En proceso' },
    { state: Enum_Payment_State.PAID, label: 'Pagado' },
    { state: Enum_Payment_State.CANCELLED, label: 'Cancelado' },
  ]

  // Definir qué estados mostrar según el estado actual
  const visibleStates = allStates.filter((item) => {
    if (currentState === Enum_Payment_State.DRAFT) {
      return item.state !== Enum_Payment_State.CANCELLED
    }
    if (currentState === Enum_Payment_State.IN_PROCESS) {
      return item.state !== Enum_Payment_State.CANCELLED
    }
    if (currentState === Enum_Payment_State.CANCELLED) {
      return true // Mostrar todos
    }
    return true // Por defecto, mostrar todos
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
