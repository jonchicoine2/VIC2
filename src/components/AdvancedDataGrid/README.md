# AdvancedDataGrid Component

This component provides an advanced data grid experience built on top of MUI DataGridPremium.

## Features

*   Displays tabular data with Material UI styling.
*   Column Visibility Control (Show/Hide columns via menu).
*   Column Reordering (Drag-and-drop column headers).
*   Column Resizing (Drag column separators).
*   Sorting (Click header for single column, Shift+Click for multi-column).
*   Row Grouping (Premium feature - drag headers to group or use `rowGroupingModel` prop).
*   MUI Theming support.
*   Pagination, Filtering, Density Selection (inherited from DataGridPremium).
*   Checkbox Selection (optional).

## Props

See `AdvancedDataGrid.types.ts` and the JSDoc comments for detailed prop descriptions. Key props include:

*   `rows`: (Required) Array of data objects.
*   `columns`: (Required) Array of `GridColDef` column definitions.
*   `height`: Height of the grid container (default: '70vh').
*   `width`: Width of the grid container (default: '100%').
*   `checkboxSelection`: Boolean to enable row selection checkboxes.
*   `disableColumnResize`: Boolean to disable column resizing.
*   `disableColumnReorder`: Boolean to disable column reordering.
*   `disableRowGrouping`: Boolean to disable row grouping.
*   `disableMultipleColumnsSorting`: Boolean to disable multi-sort.
*   Props for controlled state (e.g., `sortModel`, `onSortModelChange`, `rowGroupingModel`, `onRowGroupingModelChange`, etc.).
*   `initialState`: Set initial state for features like sorting, filtering, etc.
*   `apiRef`: Access the DataGrid API.
*   `slots`, `slotProps`: Customize internal components.

## Usage Example

```tsx
import React from 'react';
import AdvancedDataGrid from './AdvancedDataGrid';
import { mockPatients } from '../../data/mockPatients'; // Assuming mock data
import type { Patient } from '../../types/Patient';
import { GridColDef } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license';

// IMPORTANT: Set license key for Premium features
LicenseInfo.setLicenseKey('YOUR_PREMIUM_LICENSE_KEY');

const columns: GridColDef<Patient>[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'firstName', headerName: 'First Name', width: 130 },
  // ... other columns
];

function MyComponent() {
  return (
    <AdvancedDataGrid<Patient>
      rows={mockPatients}
      columns={columns}
      checkboxSelection
      initialState={{
        sorting: {
          sortModel: [{ field: 'lastName', sort: 'asc' }],
        },
      }}
    />
  );
}

export default MyComponent;
```

## Premium License

Remember that using MUI DataGridPremium features (like Row Grouping) in production requires a commercial license. Set your license key using `LicenseInfo.setLicenseKey('YOUR_KEY');` at the root of your application. 