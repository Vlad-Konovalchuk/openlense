import type { Filter } from '../types/search';
import type { Option } from '../types/common';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

interface FilterFormProps {
  filter: Filter;
  categories: Option[];
  onChange: (field: keyof Filter, value: any) => void;
}

const FilterForm = ({ filter, categories, onChange }: FilterFormProps) => (
  <Box
    component='form'
    sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}
  >
    <Box>
      <InputLabel shrink>Price Range</InputLabel>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          type='number'
          label='Min'
          size='small'
          value={filter.priceMin ?? ''}
          onChange={(e) =>
            onChange(
              'priceMin',
              e.target.value === '' ? undefined : Number(e.target.value),
            )
          }
          sx={{ width: 80 }}
        />
        <TextField
          type='number'
          label='Max'
          size='small'
          value={filter.priceMax ?? ''}
          onChange={(e) =>
            onChange(
              'priceMax',
              e.target.value === '' ? undefined : Number(e.target.value),
            )
          }
          sx={{ width: 80 }}
        />
      </Box>
    </Box>
    <FormControl size='small' sx={{ minWidth: 160 }}>
      <InputLabel id='category-label'>Category</InputLabel>
      <Select
        labelId='category-label'
        value={filter.category ?? ''}
        label='Category'
        onChange={(e) => onChange('category', e.target.value)}
        size='small'
      >
        <MenuItem value=''>All Categories</MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    <TextField
      label='Keywords'
      size='small'
      placeholder='Enter keywords...'
      value={filter.keywords ?? ''}
      onChange={(e) => onChange('keywords', e.target.value)}
      sx={{ minWidth: 180 }}
    />
  </Box>
);

export default FilterForm;
