import type { Option } from '../types/common';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

type SortDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

const SortDropdown = ({ options, value, onChange }: SortDropdownProps) => (
  <FormControl size='small' sx={{ minWidth: 140 }}>
    <InputLabel id='sort-label'>Sort by</InputLabel>
    <Select
      labelId='sort-label'
      value={value}
      label='Sort by'
      onChange={(e) => onChange(e.target.value)}
      size='small'
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default SortDropdown;
