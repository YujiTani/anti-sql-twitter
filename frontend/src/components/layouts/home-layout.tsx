import Head from '@/components/seo/head';
import { Outlet } from 'react-router-dom';
import { BaseLayoutProps } from './base-layout';
import Header from '../ui/headers/components/header';

function HomeLayout({ title = 'Home | Eco Quest' }: BaseLayoutProps) {
  return (
    <>
      <Head title={title} />
      <div className="flex h-dvh flex-col">
        <Header />
        <div className="mx-auto w-full max-w-screen-xl flex-grow px-4 sm:px-6 lg:px-8">
          <main className="flex items-center justify-center py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
