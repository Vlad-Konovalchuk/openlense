import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/knowledge-base')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='bg-white rounded-xl shadow p-6'>
      <h2 className='text-xl font-bold mb-4'>Knowledge Base</h2>
      <p>
        Here you will find information about each data source, available
        filters, and how data is fetched and displayed.
      </p>
      {/* TODO: Render collapsible sections/cards for each source */}
    </div>
  );
}
