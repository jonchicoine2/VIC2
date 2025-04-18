import React from 'react';
// Import Premium components and types
import {
  DataGridPremium, // Use Premium component
  GridColDef,
  GridColumnVisibilityModel,
  DataGridPremiumProps, // Use Premium props type
  GridInitialState, // Corrected: Use base type
  GridColumnOrderChangeParams,
  GridSortModel,
  GridRowGroupingModel // Keep grouping model
  // GridRowGroupingOptions removed - not directly exported?
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box';
import { AdvancedDataGridProps } from './AdvancedDataGrid.types'; // This might need update too

/**
 * An advanced data grid component built on top of MUI DataGridPremium.
 * Provides features like column hiding/showing, reordering, resizing, 
 * sorting (single/multi), and row grouping (Premium).
 * 
 * @template T The type of the data object for each row.
 * @param {AdvancedDataGridProps<T>} props The component props.
 * @returns {React.ReactElement} The rendered data grid.
 */
const AdvancedDataGrid = <T extends Record<string, any>>({
  rows,
  columns,
  height = '70vh',
  width = '100%',
  // Feature Flags
  disableColumnResize = false,
  disableColumnReorder = false,
  disableRowGrouping = false,
  disableMultipleColumnsSorting = false,
  // Explicit props
  columnVisibilityModel,
  onColumnVisibilityModelChange,
  columnOrder,
  onColumnOrderChange,
  sortModel,
  onSortModelChange,
  rowGroupingModel,
  onRowGroupingModelChange,
  groupingColDef,
  initialState,
  // Rest are picked from DataGridPremiumProps (loading, pagination, filter, etc.)
  ...restOfGridProps
}: AdvancedDataGridProps<T>) => { // Ensure AdvancedDataGridProps aligns with Premium

  return (
    <Box sx={{ height, width }}>
      {/* Use DataGridPremium */} 
      <DataGridPremium<T>
        rows={rows}
        columns={columns}
        // Pass down feature flags
        disableColumnResize={disableColumnResize}
        disableColumnReorder={disableColumnReorder}
        disableRowGrouping={disableRowGrouping}
        disableMultipleColumnsSorting={disableMultipleColumnsSorting}
        // Visibility props
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={onColumnVisibilityModelChange}
        // Order props (passed explicitly)
        columnOrder={columnOrder}
        onColumnOrderChange={onColumnOrderChange}
        // Sorting props
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        // Grouping props
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={onRowGroupingModelChange}
        groupingColDef={groupingColDef} // Type is GridColDef | Partial<GridColDef> | undefined
        // Initial state
        initialState={initialState}
        // Default Premium features (can be overridden)
        // disableRowGrouping // To disable grouping if needed
        {...restOfGridProps}
      />
    </Box>
  );
};

export default AdvancedDataGrid; 