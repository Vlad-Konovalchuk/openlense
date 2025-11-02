import { createFileRoute } from '@tanstack/react-router';
import Button from '@mui/material/Button';
import SourceSelector from '../components/SourceSelector';
import FilterForm from '../components/FilterForm';
import ResultsViewToggle from '../components/ResultsViewToggle';
import SortDropdown from '../components/SortDropdown';
import ResultsTable from '../components/ResultsTable';
import Pagination from '../components/Pagination';
import { searchMockResults } from '../mocks/searchMocks';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className='bg-white rounded-2xl shadow-lg p-8 max-w-[1100px] mx-auto mt-8'>
      <h2 className='text-2xl font-bold mb-6'>Search Data Sources</h2>
      <div className='flex flex-row gap-8 items-start mb-6'>
        <div className='flex-2 min-w-[220px]'>
          <SourceSelector sources={[]} onChange={() => {}} />
        </div>
        <div className='flex-3 min-w-[320px]'>
          <FilterForm filter={{}} categories={[]} onChange={() => {}} />
        </div>
        <div className='flex flex-col gap-3 items-end min-w-[160px]'>
          <Button
            variant='contained'
            color='primary'
            size='small'
            className='w-full mb-1'
          >
            Search All Sources
          </Button>
          <Button
            variant='outlined'
            color='primary'
            size='small'
            className='w-full'
          >
            Save Preset
          </Button>
        </div>
      </div>
      <div className='mb-6 flex items-center justify-between'>
        <span className='text-gray-600 text-base'>Found 0 results</span>
        <div className='flex gap-4 items-center'>
          <ResultsViewToggle view='list' onChange={() => {}} />
          <SortDropdown options={[]} value='relevance' onChange={() => {}} />
        </div>
      </div>
      <ResultsTable results={searchMockResults} />
      <Pagination
        pagination={{ page: 1, pageSize: 10, total: 0 }}
        onPageChange={() => {}}
      />
    </div>
  );
}
