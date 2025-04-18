import { GridColDef, DataGridPremiumProps, GridRowGroupingModel, GridGroupingColDefOverride } from '@mui/x-data-grid-premium';
import { GridSortModel, GridColumnOrderChangeParams } from '@mui/x-data-grid-pro';

/**
 * Props for the AdvancedDataGrid component.
 * Leverages MUI DataGridPremium features.
 * @template T The type of the data object for each row.
 */
export interface AdvancedDataGridProps<T extends Record<string, any>> 
  // Pick relevant props from DataGridPremiumProps to expose as base
  extends Pick<
    DataGridPremiumProps<T>, 
    'loading' | 'autoHeight' | 'checkboxSelection' | 'disableRowSelectionOnClick' |
    'pagination' | 'pageSizeOptions' | 'paginationModel' | 'onPaginationModelChange' |
    'sortingMode' | 'sortModel' | 'onSortModelChange' |
    'filterMode' | 'filterModel' | 'onFilterModelChange' |
    'density' | 'onStateChange' | 
    'columnVisibilityModel' | 'onColumnVisibilityModelChange' |
    'rowGroupingModel' | 'onRowGroupingModelChange' |
    'groupingColDef' | 
    'initialState' | 
    'apiRef' | // Expose apiRef for advanced control
    'slots' | 'slotProps' // Use slots/slotProps (MUI v6+ style)
    // Add more premium features as needed: aggregation, excel export, etc.
  >
{
  /** The data rows to display. */
  rows: T[];
  /** The column definitions. */
  columns: GridColDef<T>[]; 
  /** Optional height for the grid container. Defaults to '70vh'. */
  height?: string | number;
  /** Optional width for the grid container. Defaults to '100%'. */
  width?: string | number;
  
  // --- Feature Flags --- 
  /** Set to true to disable column resizing. Defaults to false. */
  disableColumnResize?: boolean;
  /** Set to true to disable column reordering. Defaults to false. */
  disableColumnReorder?: boolean;
  /** Set to true to disable row grouping. Defaults to false. */
  disableRowGrouping?: boolean;
  /** Set to true to disable multi-column sorting. Defaults to false. */
  disableMultipleColumnsSorting?: boolean;

  // --- Explicit props (might override Picked ones if needed) ---
  /** Controlled column order state. */
  columnOrder?: string[];
  /** Callback fired when column order changes. */
  onColumnOrderChange?: (params: GridColumnOrderChangeParams) => void; 
} 