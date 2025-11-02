type JsonEditorProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  errorText?: string;
  isLoading?: boolean;
};

function JsonEditor({
  value,
  onChange,
  errorText,
  onSubmit,
  isLoading,
}: JsonEditorProps) {
  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          JSON Configuration
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className='w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm'
          placeholder='Paste your JSON configuration here...'
        />
        {errorText && <p className='mt-1 text-sm text-red-600'>{errorText}</p>}
      </div>
      <div className='flex space-x-2 justify-end'>
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50'
        >
          {isLoading ? 'Creating...' : 'Create Source'}
        </button>
      </div>
    </div>
  );
}

export default JsonEditor;
