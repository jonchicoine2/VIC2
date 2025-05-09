import { GridInitialState } from '@mui/x-data-grid-premium';

/**
 * Represents a saved grid view configuration (columns, sorting, grouping etc).
 */
export interface GridViewConfig {
  /** Unique name for this view */
  name: string;
  
  /** Complete grid state snapshot from apiRef.exportState() */
  state: GridInitialState;
  
  /** ISO string of when this view was created/updated */
  createdAt: string;
  
  /** Version number for future schema migrations */
  version: 1;
} 