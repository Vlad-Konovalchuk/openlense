import type { ChangeEvent } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  TextField,
  Paper,
} from '@mui/material';
import type { ApiFiltersSupport, BackendDefaultFilters } from '../types/api';

interface FiltersConfigProps {
  apiFilters: ApiFiltersSupport;
  setApiFilters: (next: ApiFiltersSupport) => void;
  backendDefaults: BackendDefaultFilters;
  setBackendDefaults: (next: BackendDefaultFilters) => void;
}

const knownFilters: { key: keyof ApiFiltersSupport; label: string }[] = [
  { key: 'title', label: 'Title search' },
  { key: 'priceMin', label: 'Min price' },
  { key: 'priceMax', label: 'Max price' },
  { key: 'category', label: 'Category' },
];

const FiltersConfig = ({
  apiFilters,
  setApiFilters,
  backendDefaults,
  setBackendDefaults,
}: FiltersConfigProps) => {
  const toggle =
    (key: keyof ApiFiltersSupport) => (e: ChangeEvent<HTMLInputElement>) => {
      setApiFilters({ ...apiFilters, [key]: e.target.checked });
    };

  const setBackend = (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setBackendDefaults({ ...backendDefaults, [key]: e.target.value });
  };

  return (
    <Box>
      <Typography variant='subtitle1' sx={{ mb: 2 }}>
        API filters support
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {knownFilters.map((f) => (
          <Box key={f.key as string}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!apiFilters[f.key]}
                  onChange={toggle(f.key)}
                />
              }
              label={f.label}
            />
          </Box>
        ))}
      </Box>

      <Typography variant='subtitle1' sx={{ mt: 3, mb: 1 }}>
        Backend default filters (fallbacks)
      </Typography>
      <Paper variant='outlined' sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size='small'
            label='Default category'
            value={backendDefaults['category'] ?? ''}
            onChange={setBackend('category')}
          />
          <TextField
            fullWidth
            size='small'
            label='Default title'
            value={backendDefaults['title'] ?? ''}
            onChange={setBackend('title')}
          />
          <TextField
            fullWidth
            size='small'
            label='Default min price'
            value={backendDefaults['priceMin'] ?? ''}
            onChange={setBackend('priceMin')}
          />
          <TextField
            fullWidth
            size='small'
            label='Default max price'
            value={backendDefaults['priceMax'] ?? ''}
            onChange={setBackend('priceMax')}
          />
        </Box>
      </Paper>

      <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
        If an API does not support a filter, you can set a fallback value here
        to be applied server-side.
      </Typography>
    </Box>
  );
};

export default FiltersConfig;
