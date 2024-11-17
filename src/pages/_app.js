import { ThemeProvider, CssBaseline } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { SnackbarProvider  } from '../app/components/SnackbarProvider';

const theme = createTheme();

function MyApp({ Component, pageProps }) {
  return (
  <SnackbarProvider >
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Component {...pageProps} />
    </ThemeProvider>
  </SnackbarProvider>
  );
}

export default MyApp;
