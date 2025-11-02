import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import MainLayout from '../layouts/MainLayout';

const RootLayout = () => (
  <>
    <MainLayout>
      <Outlet />
    </MainLayout>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
