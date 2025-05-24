import Head from '@/components/seo/head';
import { Outlet } from 'react-router-dom';

export type BaseLayoutProps = {
  title?: string;
  description?: string;
};

function BaseLayout({
  title = 'Eco Quest',
  description = 'An application for eco-friendly quests',
}: BaseLayoutProps) {
  return (
    <>
      <Head title={title} description={description} />
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <main className="flex h-screen w-screen items-center justify-center">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default BaseLayout;
