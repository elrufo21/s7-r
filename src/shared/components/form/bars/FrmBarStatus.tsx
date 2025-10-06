import { useAppStore } from '@/store/app/appStore'
import { FormConfig } from '@/shared/shared.types'
import { useFormContext, useWatch } from 'react-hook-form'
import { useEffect, useState, useRef } from 'react'

export function FrmBarStatus({
  config,
  watch = null,
  control = undefined,
}: {
  config: any
  watch?: any
  control?: any
}) {
  const formItem = useAppStore((state) => state.formItem)
  const statusBarConfig: FormConfig['statusBarConfig'] | undefined = config?.statusBarConfig

  const formContext = useFormContext()
  const usedControl = control ?? formContext?.control

  // choose the field name to observe (hooks must be called unconditionally)
  const stateField = statusBarConfig?.stateField ?? 'state'

  // subscribe to the field value in the form (react-hook-form)
  const watchedState = useWatch({ control: usedControl, name: stateField })

  // helper to compute the current state using priority: watchedState > formItem > watch() > fallback
  const getCurrentState = (fallbackStates: any[] = [], defaultState?: string) => {
    if (watchedState !== undefined && watchedState !== null) return watchedState
    if (formItem?.[stateField] !== undefined && formItem?.[stateField] !== null)
      return formItem[stateField]
    if (typeof watch === 'function') {
      const v = watch(stateField)
      if (v !== undefined && v !== null) return v
    }
    return defaultState ?? fallbackStates[0]?.state
  }

  // local resolved state and prev ref to detect when formItem updates
  const [resolvedState, setResolvedState] = useState<string | undefined>(() =>
    getCurrentState(
      statusBarConfig?.visibleStates ?? statusBarConfig?.allStates ?? [],
      statusBarConfig?.defaultState
    )
  )
  const prevFormItemStateRef = useRef<any>(formItem?.[stateField])

  // effect: recompute resolvedState when watchedState or the store value change
  useEffect(() => {
    const fallbackStates = statusBarConfig?.visibleStates ?? statusBarConfig?.allStates ?? []
    const computed = getCurrentState(fallbackStates, statusBarConfig?.defaultState)

    // priority: watchedState > detect store change > computed fallback
    if (watchedState !== undefined && watchedState !== null) {
      if (computed !== resolvedState) setResolvedState(computed)
      prevFormItemStateRef.current = formItem?.[stateField]
      return
    }

    const prev = prevFormItemStateRef.current
    const curr = formItem?.[stateField]
    if (prev !== curr) {
      setResolvedState(curr ?? computed)
      prevFormItemStateRef.current = curr
      return
    }

    if (computed !== resolvedState) setResolvedState(computed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedState, formItem?.[stateField]])

  if (!statusBarConfig) return null

  // render using resolvedState as source of truth
  if (statusBarConfig.visibleStates?.length) {
    if (statusBarConfig.isStatic) {
      return (
        <>
          {statusBarConfig.visibleStates.map((item, index) => (
            <div
              key={Array.isArray(item.state) ? item.state.join('-') : item.state}
              className={`c_bar_step ${index === (statusBarConfig.staticActiveIndex ?? 0) ? 'active' : ''}`}
              data-state={Array.isArray(item.state) ? item.state.join('-') : item.state}
            >
              <div className="bar-step">{item.label}</div>
            </div>
          ))}
        </>
      )
    }

    const isActive = (item: any) => {
      if (Array.isArray(item.state)) return item.state.includes(resolvedState)
      return item.state === resolvedState
    }

    return (
      <>
        {statusBarConfig.visibleStates.map((item) => (
          <div
            key={Array.isArray(item.state) ? item.state.join('-') : item.state}
            className={`c_bar_step truncate ${isActive(item) ? 'active ' : ''}`}
            data-state={Array.isArray(item.state) ? item.state.join('-') : item.state}
          >
            <div className="bar-step truncate">{item.label}</div>
          </div>
        ))}
      </>
    )
  }

  if (statusBarConfig.allStates?.length) {
    const currentState = (resolvedState ?? statusBarConfig.defaultState ?? '') as string
    const visibleStates = statusBarConfig.filterLogic
      ? statusBarConfig.filterLogic(currentState, statusBarConfig.allStates)
      : statusBarConfig.allStates

    return (
      <>
        {visibleStates.map((item) => (
          <div
            key={Array.isArray(item.state) ? item.state.join('-') : item.state}
            className={`c_bar_step truncate ${item.state === currentState ? 'active' : ''}`}
            data-state={Array.isArray(item.state) ? item.state.join('-') : item.state}
          >
            <div className="bar-step truncate">{item.label}</div>
          </div>
        ))}
      </>
    )
  }

  return null
}
