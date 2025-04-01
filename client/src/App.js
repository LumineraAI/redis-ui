import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red } from '@mui/material/colors';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KeyExplorer from './pages/KeyExplorer';
import KeyDetails from './pages/KeyDetails';
import Stats from './pages/Stats';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#dc382c', // Redis red
    },
    secondary: {
      main: '#2b2b2b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/keys" element={<KeyExplorer />} />
            <Route path="/keys/:key" element={<KeyDetails />} />
            <Route path="/stats" element={<Stats />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;