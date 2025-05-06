import React, { useEffect } from 'react';
// Import Premium components and types
import {
  DataGridPremium, // Use Premium component
  useGridApiRef,
  GridToolbar,
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box'; // Re-import Box
import { AdvancedDataGridProps } from './AdvancedDataGrid.types'; // This might need update too
import GridToolbarViewSelector from './components/GridToolbarViewSelector';

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
  // Explicitly defined props for the wrapper
  rows,
  columns,
  // Size props (new)
  height,
  width,
  // Feature Flags (also explicitly handled by wrapper)
  disableColumnResize = false,
  disableColumnReorder = false,
  disableRowGrouping = false,
  disableMultipleColumnsSorting = false,
  // Other props, including any existing sx prop from the caller
  sx, // Keep sx prop extraction
  // Collect ALL other props (including slots, slotProps, initialState, loading, etc.)
  ...rest // Use a simple name like rest
}: AdvancedDataGridProps<T>) => {
  // Replace useRef with useGridApiRef for proper typing and access to DataGrid API
  const apiRef = useGridApiRef();

  // Disable column virtualization to avoid disappearing columns during fast vertical scroll
  useEffect(() => {
    if (apiRef.current?.unstable_setColumnVirtualization) {
      apiRef.current.unstable_setColumnVirtualization(false);
    }
  }, [apiRef]);

  const containerHeight = height ?? '100%';
  const containerWidth = width ?? '100%';

  // Custom toolbar component that combines standard toolbar with view selector
  const CustomToolbar = React.useCallback(() => {
    return (
      <>
        <GridToolbarViewSelector />
        <GridToolbar />
      </>
    );
  }, []);

  return (
    <Box sx={{ 
      height: containerHeight,
      width: containerWidth,
      display: 'flex',
      flexDirection: 'column',
      '& .MuiDataGrid-root': {
        border: 'none',
        flex: 1,
      },
      '& .MuiDataGrid-cell': {
        borderBottom: 1,
        borderColor: 'divider',
      },
      '& .MuiDataGrid-columnHeaders': {
        borderBottom: 2,
        borderColor: 'divider',
      },
      '& .MuiDataGrid-columnHeader': {
        padding: '0 16px',
        '&:focus': {
          outline: 'none',
        },
      },
    }}> 
      <DataGridPremium<T>
        rows={rows}
        columns={columns}
        disableColumnResize={disableColumnResize}
        disableColumnReorder={disableColumnReorder}
        disableRowGrouping={disableRowGrouping}
        disableMultipleColumnsSorting={disableMultipleColumnsSorting}
        autoHeight={false}
        apiRef={apiRef}
        slots={{
          ...rest.slots,
          toolbar: CustomToolbar,
        }}
        sx={{
          ...sx,
          width: '100%',
          height: '100%',
          flex: 1,
        }}
        {...rest}
      />
    </Box>
  );
};

export default AdvancedDataGrid; 