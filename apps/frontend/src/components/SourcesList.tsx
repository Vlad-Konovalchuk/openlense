import { EmptyState } from './EmptyState';

type SourcesListProps = {
  sources: any[];
  onDelete: (id: string) => void;
};

export const SourcesList = ({ sources, onDelete }: SourcesListProps) => {
  if (!sources.length) {
    return (
      <div className='bg-white shadow rounded-lg'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium text-gray-900'>API Sources</h3>
        </div>
        <EmptyState
          label="No API sources found. Click 'Add API Source' to create one."
          className='py-12'
        />
      </div>
    );
  }

  return (
    <div className='bg-white shadow rounded-lg'>
      <div className='px-6 py-4 border-b border-gray-200'>
        <h3 className='text-lg font-medium text-gray-900'>API Sources</h3>
      </div>
      <div className='divide-y divide-gray-200'>
        {sources.map((source: any) => (
          <div key={source.id} className='px-6 py-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='text-lg font-medium text-gray-900'>
                  {source.name}
                </h4>
                <p className='text-sm text-gray-500'>{source.description}</p>
                <div className='mt-2 flex items-center space-x-4 text-sm text-gray-500'>
                  <span>
                    {source.method} {source.endpoint}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      source.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {source.is_active ? 'Active' : 'Inactive'}
                  </span>
                  {source.auth_required && (
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                      Auth Required
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDelete(source.id)}
                className='text-red-600 hover:text-red-900'
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
