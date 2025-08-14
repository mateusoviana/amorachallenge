import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#fc94fc',
      light: '#ffb3ff',
      dark: '#c965c9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#04144c',
      light: '#1a2b6b',
      dark: '#020d2e',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      color: '#04144c',
    },
    h2: {
      fontWeight: 600,
      color: '#04144c',
    },
    h3: {
      fontWeight: 600,
      color: '#04144c',
    },
    h4: {
      fontWeight: 500,
      color: '#04144c',
    },
    h5: {
      fontWeight: 500,
      color: '#04144c',
    },
    h6: {
      fontWeight: 500,
      color: '#04144c',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0 2px 8px rgba(252, 148, 252, 0.3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});
