import React from 'react';
import Header from '../components/Header';

const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
	<div className='min-h-screen bg-gray-50'>
		<Header />
		<main className='max-w-6xl mx-auto p-6'>{children}</main>
	</div>
);

export default MainLayout;
