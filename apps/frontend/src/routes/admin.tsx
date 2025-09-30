import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
	component: RouteComponent,
});

function RouteComponent() {
	<div className='bg-white rounded-xl shadow p-6'>
		<h2 className='text-xl font-bold mb-4'>Admin Panel</h2>
		<p>
			Restricted access. Here you can add, edit, or remove data sources and
			manage their configurations.
		</p>
		{/* TODO: Add form for uploading/editing JSON config and list of sources */}
	</div>;
}
