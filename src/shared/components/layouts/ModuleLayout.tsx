import { Outlet } from 'react-router-dom'
import useAppStore from '@/store/app/appStore'
import { ViewTypeEnum } from '@/shared/shared.types'
import { Suspense, lazy } from 'react'

const ControlPanel = lazy(
  () => import('@/shared/components/navigation/panel-navigation/control-panel/ControlPanel')
)
const ControlPanelForm = lazy(
  () =>
    import('@/shared/components/navigation/panel-navigation/control-panel-form/ControlPanelForm')
)

export const ModuleLayout = () => {
  const { config, viewType } = useAppStore()
  return (
    <>
      {/* <div className="o_control_panel d-flex flex-column gap-3 gap-lg-1 px-4 pt-2 pb-4"> */}
      <div className={`o_control_panel gap-lg-1 ${viewType === ViewTypeEnum.FORM ? 'form' : ''}`}>
        {viewType === ViewTypeEnum.FORM ? (
          <Suspense fallback={null}>
            <ControlPanelForm config={config} />
          </Suspense>
        ) : (
          <Suspense fallback={null}>
            <ControlPanel config={config} viewType={viewType} />
          </Suspense>
        )}
      </div>
      <Outlet />
    </>
  )
}
