import React from 'react';
import AdvancedDataGrid from './AdvancedDataGrid';
import { GridColDef } from '@mui/x-data-grid-premium';
// import { GridToolbarQuickFilter } from '@mui/x-data-grid-premium';

// Define columns with grouping enabled for first 3
const testColumns: GridColDef[] = Array.from({ length: 15 }, (_, i) => ({
  field: `col${i + 1}`,
  headerName: `Column ${i + 1}`,
  width: 150, // Fixed width
  sortable: true,
  filterable: true,
  groupable: i < 3, // First 3 columns groupable
  disableColumnMenu: false,
}));

// Create 1000 dummy rows
const testRows = Array.from({ length: 1000 }, (_, i) => {
  const row: Record<string, any> = { id: i };
  testColumns.forEach((col) => {
    row[col.field] = `Row ${i + 1} ${col.headerName}`;
  });
  return row;
});

const AdvancedDataGridTestRig: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>AdvancedDataGrid Test Rig (Grouping Test 1)</h1>
      <p>Testing initial grouping setup (before initialState/slots).</p>
      <AdvancedDataGrid
        rows={testRows}
        columns={testColumns}
        height="600px"
        width="80vw"
        // Feature flags passed
        disableColumnReorder={false}
        disableRowGrouping={false}
        showToolbar
        groupingColDef={{
          headerName: 'Group',
        }}
        // No initialState or slots yet
      />
    </div>
  );
};

export default AdvancedDataGridTestRig; 