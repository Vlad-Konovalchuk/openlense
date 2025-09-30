import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

interface ResultsViewToggleProps {
  view: 'list' | 'grouped';
  onChange: (view: 'list' | 'grouped') => void;
}

const ResultsViewToggle = ({ view, onChange }: ResultsViewToggleProps) => (
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={(_, val) => val && onChange(val)}
    size='small'
    sx={{ mb: 2 }}
  >
    <ToggleButton value='list'>List View</ToggleButton>
    <ToggleButton value='grouped'>Grouped View</ToggleButton>
  </ToggleButtonGroup>
);

export default ResultsViewToggle;
