import { ThemeProviderMui } from '@/shared/components/extras'
import { Toaster } from 'sonner'
import { Outlet } from 'react-router-dom'
import { MenuCompany } from '@/shared/components/navigation'
import { MenuAccount } from '@/shared/components/navigation/top-navigation/components/MenuAccount'
import { LoadingIndicator } from '@/shared/components/loaders/LoadingIndicator'
import { SyncIndicator } from '@/shared/components/loaders/SyncIndicator'
import { VerifySession } from '@/modules/auth/components/VerifySession'
import { Suspense, lazy } from 'react'
import { NewMultiDialog } from '../extras/NewMultiDialog'
import useAppStore from '@/store/app/appStore'
import { ModulesEnum } from '@/shared/shared.types'

const Dialog = lazy(() => import('@/shared/ui/Dialog/Dialog'))
const NavBuilder = lazy(() => import('@/shared/components/navigation/top-navigation/NavBuilder'))
const VirtualKeyboardDialog = lazy(() => import('@/shared/ui/Dialog/VirtualKeyboardDialog'))

export const MainLayout = () => {
  const { config } = useAppStore()
  return (
    <ThemeProviderMui>
      <VerifySession />
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          style: {
            width: 'auto',
            padding: '0.5rem 1rem',
            right: '0.5rem',
          },
        }}
        offset={20}
      />
      {config.module !== ModulesEnum.POS && (
        <header className="o_navbar">
          <nav className="o_main_navbar">
            <Suspense>
              <NavBuilder />
            </Suspense>

            <div className="o_menu_systray d-flex flex-shrink-0 ms-auto" role="menu">
              <div className="flex justify-end">
                <div className="flex items-center">
                  <MenuCompany />
                </div>
                <div className="flex items-center">
                  <MenuAccount />
                </div>
              </div>
            </div>
          </nav>
        </header>
      )}
      <div className="o_action_manager">
        <div className="o_form_view o_view_controller o_action o_xxl_form_view h-100">
          <div className="o_form_view_container">
            <Outlet />
          </div>
        </div>
      </div>
      <NewMultiDialog />
      <Dialog />
      <VirtualKeyboardDialog />
      <LoadingIndicator />
      <SyncIndicator />
    </ThemeProviderMui>
  )
}
