import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { FieldMappingItem } from '@/types/api';

type FieldMappingTableProps = {
  value: FieldMappingItem[];
  onChange: (next: FieldMappingItem[]) => void;
};

const FieldMappingTable = ({ value, onChange }: FieldMappingTableProps) => {
  const update = (idx: number, key: keyof FieldMappingItem, val: string) => {
    const next = [...value];
    next[idx] = { ...next[idx], [key]: val } as FieldMappingItem;
    onChange(next);
  };

  const addRow = () =>
    onChange([...(value || []), { external: '', internal: '' }]);
  const removeRow = (idx: number) =>
    onChange(value.filter((_, i) => i !== idx));

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant='subtitle1'>Field Mapping</Typography>
        <Button
          startIcon={<AddIcon />}
          variant='outlined'
          size='small'
          onClick={addRow}
        >
          Add
        </Button>
      </Box>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>External field</TableCell>
            <TableCell>Internal field</TableCell>
            <TableCell align='right'>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(value || []).map((row, idx) => (
            <TableRow key={idx}>
              <TableCell width='45%'>
                <TextField
                  fullWidth
                  size='small'
                  value={row.external}
                  onChange={(e) => update(idx, 'external', e.target.value)}
                />
              </TableCell>
              <TableCell width='45%'>
                <TextField
                  fullWidth
                  size='small'
                  value={row.internal}
                  onChange={(e) => update(idx, 'internal', e.target.value)}
                />
              </TableCell>
              <TableCell align='right'>
                <IconButton
                  onClick={() => removeRow(idx)}
                  color='error'
                  size='small'
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {value.length === 0 && (
            <TableRow>
              <TableCell colSpan={3}>
                <Typography color='text.secondary'>
                  No mappings yet. Click Add to create one.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default FieldMappingTable;
