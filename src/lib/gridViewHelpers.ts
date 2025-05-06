import { GridApi } from '@mui/x-data-grid-premium';
import { GridViewConfig } from '../types/GridViewConfig';
import { saveView, getView } from './gridViewStore';

/**
 * Save the current state of a grid as a named view
 * 
 * @param name User-friendly name for this view configuration
 * @param apiRef Reference to the grid API
 * @returns The saved grid view configuration
 */
export function saveCurrentView(
  name: string, 
  apiRef: GridApi
): GridViewConfig {
  // Extract the full state from the grid API
  const state = apiRef.exportState();
  
  // Create the view config object
  const viewConfig: GridViewConfig = {
    name,
    state,
    createdAt: new Date().toISOString(),
    version: 1,
  };
  
  // Save it to the store
  saveView(viewConfig);
  
  return viewConfig;
}

/**
 * Load a saved view into the grid
 * 
 * @param name The name of the view to load
 * @param apiRef Reference to the grid API
 * @returns true if successful, false if view not found
 */
export function loadGridView(
  name: string, 
  apiRef: GridApi
): boolean {
  const viewConfig = getView(name);
  
  if (!viewConfig) {
    return false;
  }
  
  try {
    // Apply the saved state to the grid
    apiRef.restoreState(viewConfig.state);
    
    return true;
  } catch (error) {
    console.error('Failed to load grid view:', error);
    return false;
  }
} 