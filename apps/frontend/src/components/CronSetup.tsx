import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';

type CronSetupProps = {
  value: any;
  onChange: (next: any) => void;
  onManualTrigger?: () => void;
};

const CronSetup = ({ value, onChange, onManualTrigger }: CronSetupProps) => {
  return (
    <Box>
      <Grid container spacing={2} alignItems='center'>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={value.enabled}
                onChange={(e) =>
                  onChange({ ...value, enabled: e.target.checked })
                }
              />
            }
            label='Enable cron'
          />
        </Grid>
        <Grid item>
          <Typography>Frequency</Typography>
          <Select
            size='small'
            value={value.frequency}
            onChange={(e) =>
              onChange({ ...value, frequency: e.target.value as any })
            }
            sx={{ ml: 2, minWidth: 160 }}
          >
            <MenuItem value='6h'>Every 6 hours</MenuItem>
            <MenuItem value='12h'>Every 12 hours</MenuItem>
            <MenuItem value='daily'>Daily</MenuItem>
            <MenuItem value='weekly'>Weekly</MenuItem>
          </Select>
        </Grid>
        {onManualTrigger && (
          <Grid item>
            <Typography
              variant='body2'
              sx={{ cursor: 'pointer' }}
              onClick={onManualTrigger}
            >
              Manual trigger
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CronSetup;
