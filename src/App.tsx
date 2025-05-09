import React from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LicenseInfo } from '@mui/x-license';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import About from './components/About';
import './App.css';

// IMPORTANT: Do not commit real license keys into public repos.
LicenseInfo.setLicenseKey('9bbf0ba30db5f38d5a7165fc5eed959aTz0xMTE5NzQsRT0xNzc3MTYxNTk5MDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y');

// Define a basic theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
