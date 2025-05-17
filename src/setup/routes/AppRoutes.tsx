import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import useUserStore from '@/store/persist/persistStore'
import { Suspense, lazy } from 'react'

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
