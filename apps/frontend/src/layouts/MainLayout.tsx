import type { FC } from 'react';
import Header from '@/components/Header';

const MainLayout: FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className='min-h-screen bg-gray-50'>
    <Header />
    <main className='max-w-6xl mx-auto p-6'>{children}</main>
  </div>
);

export default MainLayout;
