import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import type { DataSource } from '../types/search';

interface SourceSelectorProps {
	sources: DataSource[];
	onChange: (id: string) => void;
}

const SourceSelector = ({ sources, onChange }: SourceSelectorProps) => (
	<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
		<FormGroup row>
			{sources.map((source) => (
				<FormControlLabel
					key={source.id}
					control={
						<Checkbox
							size='small'
							checked={source.selected}
							onChange={() => onChange(source.id)}
							color='primary'
						/>
					}
					label={source.name}
				/>
			))}
		</FormGroup>
	</Box>
);

export default SourceSelector;
