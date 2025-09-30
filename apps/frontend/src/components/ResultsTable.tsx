import type { SearchResult } from '../types/search';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Chip from '@mui/material/Chip';

interface ResultsTableProps {
  results: SearchResult[];
}

const ResultsTable = ({ results }: ResultsTableProps) => (
  <Table
    sx={{ minWidth: 650, background: 'white', borderRadius: 2, boxShadow: 1 }}
  >
    <TableHead>
      <TableRow>
        <TableCell>Title</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Source</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {results.map((result) => (
        <TableRow key={result.id} hover>
          <TableCell>
            <div style={{ fontWeight: 600 }}>{result.title}</div>
            <div style={{ fontSize: 12, color: '#888' }}>
              {result.description}
            </div>
          </TableCell>
          <TableCell>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>
              ${result.price.toLocaleString()}
            </span>
            {result.priceChange !== undefined && (
              <span style={{ marginLeft: 8, fontSize: 12, color: '#22c55e' }}>
                {result.priceChange > 0
                  ? `+${result.priceChange}%`
                  : `${result.priceChange}%`}
              </span>
            )}
          </TableCell>
          <TableCell>
            <Chip label={result.sourceLabel} color='primary' size='small' />
          </TableCell>
          <TableCell sx={{ fontSize: 12, color: '#888' }}>
            {result.date}
          </TableCell>
          <TableCell>
            <IconButton
              href={result.link}
              target='_blank'
              rel='noopener noreferrer'
              color='primary'
            >
              <OpenInNewIcon />
            </IconButton>
            <IconButton color='default'>
              <FavoriteBorderIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ResultsTable;
