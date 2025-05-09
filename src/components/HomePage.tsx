import React, { useState } from 'react';
import { GridColDef } from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import AdvancedDataGrid from './AdvancedDataGrid/AdvancedDataGrid';
import AdvancedDataGridTestRig from './AdvancedDataGrid/AdvancedDataGridTestRig';
import { mockPatients } from '../data/mockPatients';
import type { Patient } from '../types/Patient';

const HomePage = () => {
  const [showTestRig, setShowTestRig] = useState(false);
  const [rows, setRows] = useState<Patient[]>(mockPatients);

  const handleRowUpdate = (updatedRow: Patient) => {
    setRows(prevRows => 
      prevRows.map(row => row.id === updatedRow.id ? updatedRow : row)
    );
  };

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

  // Custom validation function for the patient edit form
  const validatePatientForm = (patient: Patient): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!patient.firstName) errors.firstName = 'First name is required';
    if (!patient.lastName) errors.lastName = 'Last name is required';
    if (!patient.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(patient.email)) {
      errors.email = 'Email is invalid';
    }
    if (!patient.phone) errors.phone = 'Phone is required';
    if (!patient.diagnosis) errors.diagnosis = 'Diagnosis is required';
    
    return errors;
  };

  return (
    <Box sx={{
      padding: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Stack direction="row" spacing={2} sx={{ marginBottom: 2, flexShrink: 0 }}>
        <Button variant="contained" onClick={() => setShowTestRig(false)} disabled={!showTestRig}>
          Load Main App
        </Button>
        <Button variant="contained" onClick={() => setShowTestRig(true)} disabled={showTestRig}>
          Load Test Rig
        </Button>
      </Stack>

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        {showTestRig ? (
          <AdvancedDataGridTestRig />
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <h1 style={{ flexShrink: 0, margin: '0 0 16px 0' }}>Patient Data Grid Example</h1>
            <Box sx={{ flexGrow: 1, width: '100%', overflow: 'hidden' }}>
              <AdvancedDataGrid<Patient>
                rows={rows}
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
                editable={true}
                onRowUpdate={handleRowUpdate}
                validateEditForm={validatePatientForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage; 