import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LicenseInfo } from '@mui/x-license';
import { GridColDef, GridToolbar } from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import AdvancedDataGrid from './components/AdvancedDataGrid/AdvancedDataGrid';
import AdvancedDataGridTestRig from './components/AdvancedDataGrid/AdvancedDataGridTestRig';
import { mockPatients } from './data/mockPatients';
import type { Patient } from './types/Patient';
import './App.css'; // Keep existing styles if needed

// IMPORTANT: Do not commit real license keys into public repos.
LicenseInfo.setLicenseKey('9bbf0ba30db5f38d5a7165fc5eed959aTz0xMTE5NzQsRT0xNzc3MTYxNTk5MDAwLFM9cHJlbWl1bSxMTT1zdWJzY3JpcHRpb24sUFY9aW5pdGlhbCxLVj0y');

//jjc
// Define a basic theme
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
  },
});

// Define columns for the Patient data
const patientColumns: GridColDef<Patient>[] = [
  { field: 'rowNumber', headerName: '#', width: 60, type: 'number' },
  { field: 'id', headerName: 'ID', width: 220, hideable: true },
  { field: 'firstName', headerName: 'First Name', width: 130, groupable: true },
  { field: 'lastName', headerName: 'Last Name', width: 130, groupable: true },
  { field: 'gender', headerName: 'Gender', width: 90 },
  {
    field: 'dob',
    headerName: 'Date of Birth',
    type: 'date',
    width: 120,
    valueGetter: (params: any) => {
      if (!params?.row?.dob) return null;
      return new Date(params.row.dob);
    },
    valueFormatter: (params: any) => {
      const raw = params?.value;
      if (!raw) return '';
      return new Date(raw as string | number | Date).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    }
  },
  { field: 'bloodType', headerName: 'Blood Type', width: 100 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'diagnosis', headerName: 'Diagnosis', width: 180, groupable: true },
  
  {
    field: 'admissionDate',
    headerName: 'Admission Date',
    type: 'dateTime',
    width: 160,
    valueGetter: (params: any) => {
      if (!params?.row?.admissionDate) return null;
      return new Date(params.row.admissionDate);
    },
    valueFormatter: (params: any) => {
      const raw = params?.value;
      if (!raw) return '';
      return new Date(raw as string | number | Date).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
      });
    }
  },
  { field: 'status', headerName: 'Status', width: 100 },
];

function App() {
  const [showTestRig, setShowTestRig] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        padding: 2,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'  // Add this to prevent any unwanted scrolling
      }}>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 2, flexShrink: 0 }}> {/* Buttons don't shrink */}
          <Button variant="contained" onClick={() => setShowTestRig(false)} disabled={!showTestRig}>
            Load Main App
          </Button>
          <Button variant="contained" onClick={() => setShowTestRig(true)} disabled={showTestRig}>
            Load Test Rig
          </Button>
        </Stack>

        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}> {/* Added minHeight: 0 for flexGrow */}
          {showTestRig ? (
            <AdvancedDataGridTestRig />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <h1 style={{ flexShrink: 0, margin: '0 0 16px 0' }}>Patient Data Grid Example</h1> {/* Adjust margin */}
              <Box sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
                <AdvancedDataGrid<Patient>
                  rows={mockPatients}
                  columns={patientColumns}
                  checkboxSelection
                  disableColumnMenu={false}
                  height="100%"
                  width="100%"
                  disableColumnReorder={false}
                  disableRowGrouping={false}
                  groupingColDef={{
                    headerName: 'Group',
                  }}
                  showToolbar
                  initialState={{
                    sorting: {
                      sortModel: [{ field: 'lastName', sort: 'asc' }],
                    },
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
