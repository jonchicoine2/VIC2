import { GridColDef, DataGridPremiumProps} from '@mui/x-data-grid-premium';
//import { GridSortModel, GridColumnOrderChangeParams } from '@mui/x-data-grid-pro';

/**
 * Props specific to the AdvancedDataGrid wrapper component.
 * @template T The type of the data object for each row.
 */
interface AdvancedDataGridWrapperProps<T extends Record<string, any>> {
  /** The data rows to display. */
  rows: T[];
  /** The column definitions. */
  columns: GridColDef<T>[]; 
  /** Optional height for the grid container. Defaults to '80vh'. */
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
  // Note: columnOrder/onColumnOrderChange are handled by DataGridPremium directly
  // if passed via ...rest, so maybe don't need explicit definition here unless
  // the wrapper itself needs to intercept them.
  // Keeping them for now just in case, but they aren't used in the wrapper itself.
  /** Controlled column order state. */
  // columnOrder?: string[]; 
  /** Callback fired when column order changes. */
  // onColumnOrderChange?: (params: GridColumnOrderChangeParams) => void; 
}

/**
 * Combined props for AdvancedDataGrid:
 * Includes wrapper-specific props plus all optional DataGridPremiumProps.
 */
export type AdvancedDataGridProps<T extends Record<string, any>> = 
  AdvancedDataGridWrapperProps<T> & Partial<Omit<DataGridPremiumProps<T>, 'rows' | 'columns'>>; // Allow all other Premium props, ensuring rows/columns types are consistent 