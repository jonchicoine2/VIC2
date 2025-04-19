import React from 'react';
// Import Premium components and types
import {
  DataGridPremium, // Use Premium component
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
  height = '80vh',
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
}: AdvancedDataGridProps<T>) => { // This defines the props type for the component using AdvancedDataGridProps interface with generic type T

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
        // Order props are handled via initialState or specific DataGridPremium features
        // Sorting props
        sortModel={sortModel}
        onSortModelChange={onSortModelChange}
        // Grouping props
        rowGroupingModel={rowGroupingModel}
        onRowGroupingModelChange={onRowGroupingModelChange}
        groupingColDef={groupingColDef} // Type is GridColDef | Partial<GridColDef> | undefined
        // Initial state
        initialState={initialState}
        // Disable virtualization to potentially fix scrolling render issues
        disableVirtualization={true} 
        // Default Premium features (can be overridden)
        // disableRowGrouping // To disable grouping if needed
        {...restOfGridProps}
      />
    </Box>
  );
};

export default AdvancedDataGrid; 