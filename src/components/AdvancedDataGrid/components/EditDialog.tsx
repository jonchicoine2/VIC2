import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface EditDialogProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  row: T | null;
  onSave: (updatedRow: T) => void;
  getFields?: (row: T) => Array<keyof T>;
  validateForm?: (row: T) => Record<string, string>;
  title?: string;
}

function EditDialog<T extends Record<string, any>>(props: EditDialogProps<T>) {
  const { open, onClose, row, onSave, getFields, validateForm, title = 'Edit Item' } = props;
  const [editedRow, setEditedRow] = useState<T | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (row) {
      setEditedRow({ ...row });
    }
  }, [row]);

  if (!editedRow) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedRow(prev => prev ? { ...prev, [name]: value } : null);
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setEditedRow(prev => prev ? { ...prev, [name]: value } : null);
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDateChange = (name: string, date: Date | null) => {
    setEditedRow(prev => prev ? { ...prev, [name]: date } : null);
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const defaultValidateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    // Simple validation for required string fields
    Object.entries(editedRow).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim() === '') {
        newErrors[key] = `${key} is required`;
      }
    });
    
    return newErrors;
  };

  const handleValidateForm = (): boolean => {
    const newErrors = validateForm ? validateForm(editedRow) : defaultValidateForm();
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (handleValidateForm() && editedRow) {
      onSave(editedRow);
      onClose();
    }
  };

  // Determine which fields to render
  const fieldsToRender = getFields ? getFields(editedRow) : Object.keys(editedRow) as Array<keyof T>;
  // Filter out internal fields or IDs that shouldn't be editable
  const filteredFields = fieldsToRender.filter(
    field => typeof field === 'string' && 
    field !== 'id' && 
    field !== 'rowNumber' &&
    !field.toString().startsWith('_')
  );

  const renderField = (fieldName: keyof T) => {
    const value = editedRow[fieldName];
    const fieldNameStr = String(fieldName);
    
    // Handle Date objects
    if (value instanceof Date) {
      return (
        <DatePicker
          label={formatFieldLabel(fieldNameStr)}
          value={value}
          onChange={(date: Date | null) => handleDateChange(fieldNameStr, date)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors[fieldNameStr],
              helperText: errors[fieldNameStr],
            },
          }}
        />
      );
    }
    
    // Handle enum-like fields (often strings with limited values)
    if (
      fieldNameStr.toLowerCase().includes('type') ||
      fieldNameStr.toLowerCase().includes('status') ||
      fieldNameStr.toLowerCase().includes('gender') ||
      fieldNameStr.toLowerCase().includes('category')
    ) {
      return (
        <FormControl fullWidth error={!!errors[fieldNameStr]}>
          <InputLabel id={`${fieldNameStr}-label`}>{formatFieldLabel(fieldNameStr)}</InputLabel>
          <Select
            labelId={`${fieldNameStr}-label`}
            label={formatFieldLabel(fieldNameStr)}
            name={fieldNameStr}
            value={String(value || '')}
            onChange={handleSelectChange}
          >
            {getOptionsForField(fieldNameStr, editedRow).map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
          {errors[fieldNameStr] && <Box sx={{ color: 'error.main', mt: 0.5, fontSize: '0.75rem' }}>{errors[fieldNameStr]}</Box>}
        </FormControl>
      );
    }
    
    // Default to TextField for strings, numbers, etc.
    return (
      <TextField
        fullWidth
        label={formatFieldLabel(fieldNameStr)}
        name={fieldNameStr}
        value={value === null || value === undefined ? '' : value}
        onChange={handleChange}
        error={!!errors[fieldNameStr]}
        helperText={errors[fieldNameStr]}
        type={typeof value === 'number' ? 'number' : 'text'}
      />
    );
  };

  // Helper to format field names for display (e.g., "firstName" -> "First Name")
  const formatFieldLabel = (fieldName: string): string => {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // Insert a space before each capital letter
      .replace(/^./, str => str.toUpperCase()); // Capitalize the first letter
  };

  // Helper to get options for select fields
  const getOptionsForField = (fieldName: string, row: T): string[] => {
    // This is a simplified approach - in a real app, you might want to define these options externally
    // or dynamically fetch them based on the field type
    
    if (fieldName.toLowerCase().includes('gender')) {
      return ['Male', 'Female', 'Other'];
    }
    
    if (fieldName.toLowerCase().includes('status')) {
      return ['Active', 'Inactive', 'Pending', 'Completed', 'Cancelled', 'Archived'];
    }
    
    if (fieldName.toLowerCase() === 'bloodtype') {
      return ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    }
    
    // For other fields, we need to return at least the current value
    return [String(row[fieldName as keyof T] || '')];
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {filteredFields.map(field => (
            <Grid item xs={12} md={6} key={String(field)}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDialog; 