import React from 'react';
import Box from '@mui/material/Box';
import { GridToolbarContainer } from '@mui/x-data-grid-premium';
import GridViewSelector from './GridViewSelector';
import { GridViewConfig } from '../../../types/GridViewConfig';

interface GridToolbarViewSelectorProps {
  /**
   * Callback fired when a view is saved
   */
  onViewSaved?: (config: GridViewConfig) => void;
  
  /**
   * Callback fired when a view is loaded
   */
  onViewLoaded?: (config: GridViewConfig) => void;
  
  /**
   * Callback fired when a view is deleted
   */
  onViewDeleted?: (name: string) => void;
}

/**
 * Custom toolbar component with view save/load functionality
 */
export default function GridToolbarViewSelector({
  onViewSaved,
  onViewLoaded,
  onViewDeleted
}: GridToolbarViewSelectorProps) {
  return (
    <GridToolbarContainer>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Box component="span" sx={{ mr: 2 }}>
          Views:
        </Box>
        <GridViewSelector 
          onViewSaved={onViewSaved}
          onViewLoaded={onViewLoaded}
          onViewDeleted={onViewDeleted}
        />
      </Box>
    </GridToolbarContainer>
  );
} 