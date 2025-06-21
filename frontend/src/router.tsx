import MainErrorFallback from '@/components/errors/main'
import BaseLayout from '@/components/layouts/base-layout'
import HomeLayout from '@/components/layouts/home-layout'
import Notifications from '@/components/ui/notifications/components/notifications'
import AuthGuard from '@/components/auth/AuthGuard'
import { Suspense } from 'react'
import { lazy } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { Route, Routes } from 'react-router-dom'

const LoginPage = lazy(() => import('@/features/auth/components/Login'))
const RegisterPage = lazy(() => import('@/features/auth/components/Register'))
const HomePage = lazy(() => import('@/pages/Home'))
const MyPage = lazy(() => import('@/pages/MyPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound'))

function Router() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <HelmetProvider>
            <Routes>
              <Route element={<BaseLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route element={<HomeLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route
                  path="/mypage"
                  element={
                    <AuthGuard>
                      <MyPage />
                    </AuthGuard>
                  }
                />
              </Route>
            </Routes>
            <Notifications />
          </HelmetProvider>
        </ErrorBoundary>
      </Suspense>
    </div>
  )
}

export default Router
