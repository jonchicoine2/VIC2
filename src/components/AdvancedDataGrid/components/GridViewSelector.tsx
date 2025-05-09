import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DeleteIcon from '@mui/icons-material/Delete';
import { useGridApiContext } from '@mui/x-data-grid-premium';

import { GridViewConfig } from '../../../types/GridViewConfig';
import { saveCurrentView, loadGridView } from '../../../lib/gridViewHelpers';
import { listViews, deleteView } from '../../../lib/gridViewStore';

interface GridViewSelectorProps {
  /**
   * Button variant for the save button
   * @default 'outlined'
   */
  saveButtonVariant?: 'text' | 'outlined' | 'contained';
  
  /**
   * Button variant for the load button
   * @default 'outlined'
   */
  loadButtonVariant?: 'text' | 'outlined' | 'contained';
  
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
 * A component for saving and loading grid views
 */
export default function GridViewSelector({
  saveButtonVariant = 'outlined',
  loadButtonVariant = 'outlined',
  onViewSaved,
  onViewLoaded,
  onViewDeleted,
}: GridViewSelectorProps) {
  const apiRef = useGridApiContext();
  const [savedViews, setSavedViews] = useState<GridViewConfig[]>(listViews());
  
  // Dialog states
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  
  // Form states
  const [viewName, setViewName] = useState('');
  const [selectedView, setSelectedView] = useState<string>('');
  
  // Refresh the list of saved views
  const refreshViews = () => {
    setSavedViews(listViews());
  };
  
  // Save a view
  const handleSave = () => {
    if (viewName.trim()) {
      const config = saveCurrentView(viewName, apiRef.current);
      refreshViews();
      setSaveDialogOpen(false);
      setViewName('');
      
      if (onViewSaved) {
        onViewSaved(config);
      }
    }
  };
  
  // Load a view
  const handleLoad = () => {
    if (selectedView) {
      const success = loadGridView(selectedView, apiRef.current);
      
      if (success) {
        const config = savedViews.find(v => v.name === selectedView);
        setLoadDialogOpen(false);
        
        if (config && onViewLoaded) {
          onViewLoaded(config);
        }
      }
    }
  };
  
  // Delete a view
  const handleDelete = () => {
    if (selectedView) {
      deleteView(selectedView);
      refreshViews();
      setSelectedView('');
      
      if (onViewDeleted) {
        onViewDeleted(selectedView);
      }
    }
  };

  return (
    <>
      {/* Save and Load buttons */}
      <Tooltip title="Save current view">
        <IconButton 
          onClick={() => setSaveDialogOpen(true)}
          size="small"
        >
          <SaveIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Load saved view">
        <IconButton
          onClick={() => {
            refreshViews();
            setLoadDialogOpen(true);
          }}
          size="small"
          disabled={savedViews.length === 0}
        >
          <FolderOpenIcon />
        </IconButton>
      </Tooltip>

      {/* Save Dialog */}
      <Dialog 
        open={saveDialogOpen} 
        onClose={() => setSaveDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Save Current View</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="View Name"
            type="text"
            fullWidth
            value={viewName}
            onChange={(e) => setViewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={!viewName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Load Dialog */}
      <Dialog 
        open={loadDialogOpen} 
        onClose={() => setLoadDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Load Saved View</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel id="view-select-label">Saved Views</InputLabel>
            <Select
              labelId="view-select-label"
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as string)}
              label="Saved Views"
            >
              {savedViews.map((view) => (
                <MenuItem key={view.name} value={view.name}>
                  {view.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          {selectedView && (
            <Button 
              onClick={handleDelete} 
              color="error" 
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setLoadDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleLoad} 
            variant="contained" 
            color="primary"
            disabled={!selectedView}
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 