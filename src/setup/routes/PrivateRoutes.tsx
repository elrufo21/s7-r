import { MainLayout } from '@/shared/components/layouts/MainLayout'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ModuleLayout } from '@/shared/components/layouts/ModuleLayout'
import Pos from '@/modules/pos/pages/Pos'
import PosMeat from '@/modules/pos-carnes/pages/PosMeat'
import PointOfSaleMeatPage from '@/modules/points-of-sale-carnes/pages/PointsOfSaleMeatPage'
import PointOfSalePg from '@/modules/pos-pg/pages/PosPg'

const InvoicePage = lazy(() => import('@/modules/invoicing/pages/InvoicePage'))
const InventoryPage = lazy(() => import('@/modules/inventory/pages/InventoryPage'))
const ContactPage = lazy(() => import('@/modules/contacts/pages/ContactPage'))
const ActionPage = lazy(() => import('@/modules/action/pages/ActionPage'))
const MenuModules = lazy(() => import('@/pages/ModuleOverviewPage'))
const SettingsPage = lazy(() => import('@/modules/settings/pages/SettingsPage'))
const PointOfSalePage = lazy(() => import('@/modules/points-of-sale/pages/PointsOfSalePage'))
const PointsOfSalePg = lazy(() => import('@/modules/points-of-sale-pg/pages/PointsOfSalePgPage'))
export const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="auth/*" element={<Navigate to="/app" />} />
        <Route
          path="/app"
          element={
            <Suspense fallback="">
              <MenuModules />
            </Suspense>
          }
        />
        <Route element={<ModuleLayout />}>
          <Route
            path="points-of-sale/*"
            element={
              <Suspense fallback="">
                <PointOfSalePage />
              </Suspense>
            }
          />
          <Route
            path="points-of-sale-meat/*"
            element={
              <Suspense fallback="">
                <PointOfSaleMeatPage />
              </Suspense>
            }
          />
          <Route
            path="points-of-sale-pg/*"
            element={
              <Suspense fallback="">
                <PointsOfSalePg />
              </Suspense>
            }
          />
          <Route
            path="contacts/*"
            element={
              <Suspense fallback="">
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="inventory/*"
            element={
              <Suspense fallback="">
                <InventoryPage />
              </Suspense>
            }
          />
          <Route
            path="invoicing/*"
            element={
              <Suspense fallback="">
                <InvoicePage />
              </Suspense>
            }
          />
          <Route
            path="action/*"
            element={
              <Suspense fallback="">
                <ActionPage />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="settings/*"
          element={
            <Suspense fallback="">
              <SettingsPage />
            </Suspense>
          }
        />

        <Route
          path="pos/*"
          element={
            <Suspense fallback="">
              <Pos />
            </Suspense>
          }
        />
        <Route
          path="pos-meat/*"
          element={
            <Suspense fallback="">
              <PosMeat />
            </Suspense>
          }
        />
        <Route
          path="pos-pg/*"
          element={
            <Suspense fallback="">
              <PointOfSalePg />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
