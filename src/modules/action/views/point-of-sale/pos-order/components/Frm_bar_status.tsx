import { PosOrderStateEnum } from '@/modules/action/views/point-of-sale/types'
import { useAppStore } from '@/store/app/appStore'

export function Frm_bar_status() {
  const formItem = useAppStore((state) => state.formItem)
  const currentState = formItem?.state ?? PosOrderStateEnum.IN_PROGRESS

  const allStates = [
    { state: PosOrderStateEnum.IN_PROGRESS || PosOrderStateEnum.PAY, label: 'En progreso' },
    { state: PosOrderStateEnum.PAID, label: 'Pagado' },
    { state: PosOrderStateEnum.REGISTERED, label: 'Registrado' },
  ]

  const visibleStates = allStates.filter((item) => {
    return item.state === PosOrderStateEnum.IN_PROGRESS || item.state === PosOrderStateEnum.PAY
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
