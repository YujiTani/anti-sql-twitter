import { Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import MainErrorFallback from '@/components/errors/main';
import { HelmetProvider } from 'react-helmet-async';
import BaseLayout from '@/components/layouts/base-layout';
import HomeLayout from '@/components/layouts/home-layout';
import Notifications from '@/components/ui/notifications/components/notifications';

const LoginPage = lazy(() => import('@/features/auth/components/Login'));
const HomePage = lazy(() => import('@/pages/Home'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

function Router() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <HelmetProvider>
            <Routes>
              <Route element={<BaseLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
              <Route element={<HomeLayout />}>
                <Route path="/home" element={<HomePage />} />
              </Route>
            </Routes>
            <Notifications />
          </HelmetProvider>
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default Router;
