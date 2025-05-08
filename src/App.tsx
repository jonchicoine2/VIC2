import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LicenseInfo } from '@mui/x-license'; // Correct import for LicenseInfo
import { GridColDef } from '@mui/x-data-grid-premium';

import AdvancedDataGrid from './components/AdvancedDataGrid/AdvancedDataGrid';
import { mockPatients } from './data/mockPatients';
import type { Patient } from './types/Patient';
import './App.css'; // Keep existing styles if needed

// Set the license key for MUI Premium features
// REPLACE WITH YOUR ACTUAL KEY
LicenseInfo.setLicenseKey('YOUR_PREMIUM_LICENSE_KEY'); 

//jjc
// Define a basic theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

// Define columns for the Patient data
const patientColumns: GridColDef<Patient>[] = [
  // Use renderCell for formatting Dates
  { field: 'id', headerName: 'ID', width: 150, hideable: false }, // Example: make ID not hideable
  { field: 'firstName', headerName: 'First Name', width: 130 },
  { field: 'lastName', headerName: 'Last Name', width: 130 },
  {
    field: 'dob',
    headerName: 'Date of Birth',
    type: 'date',
    width: 120,
    valueGetter: (value) => new Date(value),
  },
  { field: 'diagnosis', headerName: 'Diagnosis', width: 180 },
  {
    field: 'admissionDate',
    headerName: 'Admission Date',
    type: 'dateTime',
    width: 180,
    valueGetter: (value) => new Date(value),
  },
  { field: 'status', headerName: 'Status', width: 100 },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures baseline styles */} 
      <h1>Advanced Patient Data Grid</h1>
      {/* Render the grid with mock data and columns */}
      <AdvancedDataGrid<Patient>
        rows={mockPatients}
        columns={patientColumns}
        // Example: Enable checkbox selection
        checkboxSelection
        // Example: Disable grouping initially if desired
        // disableRowGrouping
        // Example: Set initial sort order
        initialState={{
          sorting: {
            sortModel: [{ field: 'lastName', sort: 'asc' }],
          },
        }}
        // Pass other DataGridPremium props as needed
      />
    </ThemeProvider>
  );
}

export default App;
