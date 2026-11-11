import { createTheme } from '@mui/material/styles';
import { plPL } from '@mui/material/locale';

export const theme = createTheme(
  {
    palette: {
      primary: { main: '#c2410c' },
      background: { default: '#f5f5f4' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: { body: { overflowWrap: 'break-word' } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { textTransform: 'none' } },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: 'none' } },
      },
    },
  },
  plPL,
);
