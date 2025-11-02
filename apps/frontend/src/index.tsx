import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css';
import { createQueryClient } from '@/services/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
const queryClient = createQueryClient();

const router = createRouter({ routeTree });

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
