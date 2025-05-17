import { ThemeProvider, createTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

const muiTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    fontFamily: 'var(--font-body)',
    subtitle1: {
      fontFamily: 'var(--font-body)',
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
        },
      },
    },
  },
})

export const ThemeProviderMui = ({ children }: { children: ReactNode }) => {
  return <ThemeProvider theme={muiTheme}>{children}</ThemeProvider>
}
