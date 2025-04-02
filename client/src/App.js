import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, grey } from '@mui/material/colors';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import KeyExplorer from './pages/KeyExplorer';
import KeyDetails from './pages/KeyDetails';
import Stats from './pages/Stats';
import Clients from './pages/Clients';

// Define base typography and components to share between themes
const baseThemeOptions = {
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
          // Box shadow will be handled by palette mode
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          // Ensure AppBar background uses theme palette
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Ensure Drawer background uses theme palette
        },
      },
    },
  },
};

// Create light theme instance
const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
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
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[800],
    },
  },
  components: {
    ...baseThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseThemeOptions.components.MuiCard.styleOverrides.root,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

// Create dark theme instance
const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#e57373', // Lighter Redis red for dark mode
    },
    secondary: {
      main: '#bdbdbd',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: grey[500],
    },
  },
  components: {
    ...baseThemeOptions.components,
    MuiCard: {
      styleOverrides: {
        root: {
          ...baseThemeOptions.components.MuiCard.styleOverrides.root,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)', // Darker shadow for dark theme
        },
      },
    },
  },
});

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme || 'light';
  });

  // Apply theme class to body for non-MUI components using index.css variables
  useEffect(() => {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${themeMode}-theme`);
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Select the MUI theme object based on the mode
  const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures background color and basic styles match the theme */}
      <Router>
        <Layout themeMode={themeMode} toggleTheme={toggleTheme}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/keys" element={<KeyExplorer />} />
            <Route path="/keys/:key" element={<KeyDetails />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/clients" element={<Clients />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;