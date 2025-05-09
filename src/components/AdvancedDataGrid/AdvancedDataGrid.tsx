import React, { useEffect, useState, useCallback } from 'react';
// Import Premium components and types
import {
  DataGridPremium, // Use Premium component
  useGridApiRef,
  GridToolbar,
  GridColDef,
  GridActionsCellItem
} from '@mui/x-data-grid-premium';
import Box from '@mui/material/Box'; // Re-import Box
import EditIcon from '@mui/icons-material/Edit';
import { AdvancedDataGridProps } from './AdvancedDataGrid.types'; // This might need update too
import GridToolbarViewSelector from './components/GridToolbarViewSelector';
import EditDialog from './components/EditDialog';

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
  // Edit functionality props
  editable = false,
  onRowUpdate,
  getEditDialogFields,
  validateEditForm,
  // Other props, including any existing sx prop from the caller
  sx, // Keep sx prop extraction
  // Collect ALL other props (including slots, slotProps, initialState, loading, etc.)
  ...rest // Use a simple name like rest
}: AdvancedDataGridProps<T>) => {
  // Replace useRef with useGridApiRef for proper typing and access to DataGrid API
  const apiRef = useGridApiRef();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<T | null>(null);
  const [localRows, setLocalRows] = useState<T[]>(rows);

  // Update local rows when external rows change
  useEffect(() => {
    setLocalRows(rows);
  }, [rows]);

  // Disable column virtualization to avoid disappearing columns during fast vertical scroll
  useEffect(() => {
    if (apiRef.current?.unstable_setColumnVirtualization) {
      apiRef.current.unstable_setColumnVirtualization(false);
    }
  }, [apiRef]);

  const handleEditClick = useCallback((row: T) => {
    setCurrentRow(row);
    setEditDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setCurrentRow(null);
  }, []);

  const handleSaveRow = useCallback((updatedRow: T) => {
    // Update local state
    setLocalRows(prevRows => 
      prevRows.map(row => row.id === updatedRow.id ? updatedRow : row)
    );
    
    // Call external handler if provided
    if (onRowUpdate) {
      onRowUpdate(updatedRow);
    }
  }, [onRowUpdate]);

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

  // Add edit action column if editable is true
  const columnsWithActions: GridColDef<T>[] = React.useMemo(() => {
    if (!editable) return columns;

    const hasActionsColumn = columns.some(col => col.field === 'actions');
    
    if (hasActionsColumn) {
      // If actions column already exists, we need to modify it to include our edit action
      return columns.map(col => {
        if (col.field === 'actions' && col.type === 'actions') {
          return {
            ...col,
            getActions: (params: any) => {
              // Get existing actions if any
              const existingActions = col.getActions ? col.getActions(params) : [];
              // Add our edit action
              return [
                ...existingActions,
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  onClick={() => handleEditClick(params.row)}
                />
              ];
            }
          };
        }
        return col;
      });
    } else {
      // If no actions column exists, add one
      return [
        ...columns,
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 100,
          getActions: (params: any) => [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              onClick={() => handleEditClick(params.row)}
            />
          ]
        }
      ];
    }
  }, [columns, editable, handleEditClick]);

  return (
    <>
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
          rows={localRows}
          columns={columnsWithActions}
          disableColumnResize={disableColumnResize}
          disableColumnReorder={disableColumnReorder}
          disableRowGrouping={disableRowGrouping}
          disableMultipleColumnsSorting={disableMultipleColumnsSorting}
          autoHeight={false}
          disableVirtualization
          apiRef={apiRef}
          showToolbar
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
      
      {editable && (
        <EditDialog<T>
          open={editDialogOpen}
          onClose={handleDialogClose}
          row={currentRow}
          onSave={handleSaveRow}
          getFields={getEditDialogFields}
          validateForm={validateEditForm}
          title={`Edit ${currentRow?.id ? `#${currentRow.id}` : 'Item'}`}
        />
      )}
    </>
  );
};

export default AdvancedDataGrid; 