import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import useUserStore from '@/store/persist/persistStore'
import { Suspense, lazy } from 'react'
import RecoverPassword from '@/modules/auth/components/RecoverPassword'
import ResetPassword from '@/modules/auth/components/ResetPassword'

const Login = lazy(() => import('@/modules/auth/components/Login'))

export const AppRoutes = () => {
  const { user } = useUserStore()
  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route
              path="auth/*"
              element={
                <Suspense>
                  <Login />
                </Suspense>
              }
            />
            <Route path="recover-password" element={<RecoverPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to={'/auth'} />} />
          </>
        ) : (
          <>
            <Route index element={<Navigate to={'/app'} />} />
            <Route path="/*" element={<PrivateRoutes />} />
          </>
        )}
      </Routes>
    </Router>
  )
}
