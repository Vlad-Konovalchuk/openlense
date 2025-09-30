import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const Header = () => (
  <AppBar position='static' color='inherit' elevation={1}>
    <Toolbar sx={{}}>
      <Typography variant='h6' color='primary' sx={{ fontWeight: 700 }}>
        OpenLense
      </Typography>
      <Stack sx={{ flexGrow: 1, ml: 8 }} direction='row'>
        <Button color='primary' href='/'>
          Home
        </Button>
        <Button color='primary' href={'/knowledge-base'}>
          Knowledge Base
        </Button>
      </Stack>
    </Toolbar>
  </AppBar>
);

export default Header;
