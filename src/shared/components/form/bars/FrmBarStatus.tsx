import { useAppStore } from '@/store/app/appStore'
import { FormConfig } from '@/shared/shared.types'

export function FrmBarStatus() {
  const { config } = useAppStore()
  const formItem = useAppStore((state) => state.formItem)

  const statusBarConfig: FormConfig['statusBarConfig'] = config?.statusBarConfig

  if (!statusBarConfig) return null

  // Caso 1: Estados visibles fijos (más simple y común)
  if (statusBarConfig.visibleStates?.length) {
    // Caso estático: no depende del formItem
    if (statusBarConfig.isStatic) {
      return (
        <>
          {statusBarConfig.visibleStates.map((item, index) => (
            <div
              key={item.state}
              className={`c_bar_step ${
                index === (statusBarConfig.staticActiveIndex ?? 0) ? 'active' : ''
              }`}
              data-state={item.state}
            >
              <div className="bar-step">{item.label}</div>
            </div>
          ))}
        </>
      )
    }

    // Caso dinámico: basado en formItem
    const stateField = statusBarConfig.stateField || 'state'
    const currentState =
      formItem?.[stateField] ??
      statusBarConfig.defaultState ??
      statusBarConfig.visibleStates[0]?.state

    const isActive = (item: any) => {
      if (Array.isArray(item.state)) {
        return item.state.includes(currentState)
      }
      return item.state === currentState
    }

    return (
      <>
        {statusBarConfig.visibleStates.map((item) => (
          <div
            key={Array.isArray(item.state) ? item.state.join('-') : item.state}
            className={`c_bar_step truncate ${isActive(item) ? 'active ' : ''}`}
            data-state={item.state}
          >
            <div className="bar-step truncate">{item.label}</div>
          </div>
        ))}
      </>
    )
  }

  // Caso 2: Lógica compleja con allStates + filterLogic (casos especiales)
  if (statusBarConfig.allStates?.length) {
    const stateField = statusBarConfig.stateField || 'state'
    const currentState =
      formItem?.[stateField] ?? statusBarConfig.defaultState ?? statusBarConfig.allStates[0]?.state

    const visibleStates = statusBarConfig.filterLogic
      ? statusBarConfig.filterLogic(currentState, statusBarConfig.allStates)
      : statusBarConfig.allStates

    return (
      <>
        {visibleStates.map((item) => (
          <div
            key={item.state}
            className={`c_bar_step truncate ${item.state === currentState ? 'active' : ''}`}
            data-state={item.state}
          >
            <div className="bar-step truncate">{item.label}</div>
          </div>
        ))}
      </>
    )
  }

  return null
}
