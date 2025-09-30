import type { Pagination as IPaginationProps } from '../types/common';
import MuiPagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationProps {
  pagination: IPaginationProps;
  onPageChange: (page: number) => void;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const { page, total, pageSize } = pagination;
  const totalPages = Math.ceil(total / pageSize);
  return (
    <Stack direction='row' justifyContent='center' mt={4}>
      <MuiPagination
        count={totalPages}
        page={page}
        onChange={(_, value) => onPageChange(value)}
        color='primary'
        shape='rounded'
      />
    </Stack>
  );
};

export default Pagination;
