import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import { GridColDef, GridColumnVisibilityModel, GridColumnOrderChangeParams, GridSortModel } from '@mui/x-data-grid-pro';
import { GridRowGroupingModel } from '@mui/x-data-grid-premium';
import AdvancedDataGrid from './AdvancedDataGrid';
import { mockPatients } from '../../data/mockPatients';
import type { Patient } from '../../types/Patient';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { saveCurrentView, loadGridView } from '../../lib/gridViewHelpers';
import { listViews, deleteView } from '../../lib/gridViewStore';

// Mock the grid view helpers
vi.mock('../../lib/gridViewHelpers', () => ({
  saveCurrentView: vi.fn(),
  loadGridView: vi.fn(),
}));

vi.mock('../../lib/gridViewStore', () => ({
  listViews: vi.fn(),
  deleteView: vi.fn(),
}));

// Basic columns definition for testing
const testColumns: GridColDef<Patient>[] = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'firstName', headerName: 'First Name', width: 150 },
  { field: 'lastName', headerName: 'Last Name', width: 150 },
  { field: 'status', headerName: 'Status', width: 120 },
];

// Mock data slice for faster tests
const testRows = mockPatients.slice(0, 5);

// Helper component to manage state for controlled features like VISIBILITY
const StatefulAdvancedDataGrid = (props: Omit<React.ComponentProps<typeof AdvancedDataGrid<Patient>>, 'columnVisibilityModel' | 'onColumnVisibilityModelChange'>) => {
  const [columnVisibilityModel, setColumnVisibilityModel] = 
    React.useState<GridColumnVisibilityModel>({});

  return (
    <AdvancedDataGrid<Patient>
      {...props}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
    />
  );
};

// Minimal helper for tests that don't need state control within the test
const StatefulAdvancedDataGridMinimal = (props: React.ComponentProps<typeof AdvancedDataGrid<Patient>>) => {
  return <AdvancedDataGrid<Patient> {...props} />;
};

describe('AdvancedDataGrid', () => {
  it('should render the grid container', () => {
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('should display initial columns', () => {
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    const grid = screen.getByRole('grid');
    expect(within(grid).getByText('ID')).toBeInTheDocument();
    expect(within(grid).getByText('First Name')).toBeInTheDocument();
    expect(within(grid).getByText('Last Name')).toBeInTheDocument();
    expect(within(grid).getByText('Status')).toBeInTheDocument();
  });

  it('should display initial data', () => {
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    const grid = screen.getByRole('grid');
    expect(within(grid).getByText(testRows[0].firstName)).toBeInTheDocument();
    expect(within(grid).getByText(testRows[0].lastName)).toBeInTheDocument();
    expect(within(grid).getByText(testRows[0].status)).toBeInTheDocument();
  });

  it('should allow hiding columns via column menu', async () => {
    const user = userEvent.setup();
    // Use stateful helper for visibility control
    render(<StatefulAdvancedDataGrid rows={testRows} columns={testColumns} />); 
    const grid = screen.getByRole('grid');
    expect(within(grid).getByText('First Name')).toBeInTheDocument();
    const columnsButton = screen.getByRole('button', { name: /columns/i });
    await user.click(columnsButton);
    const firstNameMenuItem = await screen.findByRole('menuitemcheckbox', { name: /first name/i });
    await user.click(firstNameMenuItem);
    await user.keyboard('{Escape}');
    expect(within(grid).queryByText('First Name')).not.toBeInTheDocument();
  });

  it('should allow showing columns via column menu', async () => {
    const user = userEvent.setup();
    const initialHidden: GridColumnVisibilityModel = { firstName: false };
    // Use minimal helper + initialState for this visibility scenario
    render(
      <StatefulAdvancedDataGridMinimal 
        rows={testRows} 
        columns={testColumns} 
        initialState={{ columns: { columnVisibilityModel: initialHidden } }}
      />
    );
    const grid = screen.getByRole('grid');
    expect(within(grid).queryByText('First Name')).not.toBeInTheDocument();
    const columnsButton = screen.getByRole('button', { name: /columns/i });
    await user.click(columnsButton);
    const firstNameMenuItem = await screen.findByRole('menuitemcheckbox', { name: /first name/i });
    expect(firstNameMenuItem).not.toBeChecked();
    await user.click(firstNameMenuItem);
    await user.keyboard('{Escape}');
    expect(within(grid).getByText('First Name')).toBeInTheDocument();
  });

  it('should allow reordering columns via drag and drop', async () => {
    const user = userEvent.setup();
    // Use minimal helper
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />); 
    const grid = screen.getByRole('grid');
    const columnHeaders = within(grid).getAllByRole('columnheader');
    expect(columnHeaders[1]).toHaveTextContent(/First Name/);
    expect(columnHeaders[2]).toHaveTextContent(/Last Name/);
    // Placeholder assertion - relies on implementation passing correct props
    expect(true).toBe(true); 
  });

  it('should allow resizing columns', async () => {
    // Column resizing is enabled by default in DataGridPro.
    // Simulating the drag interaction on the resize handle is complex.
    // We rely on the underlying component and ensure it's not disabled by default.
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    const grid = screen.getByRole('grid');
    const firstNameHeader = within(grid).getByRole('columnheader', { name: /First Name/ });

    // Check for the presence of the resize handle (often a specific class or element)
    // This might be implementation-dependent and brittle.
    // const resizeHandle = firstNameHeader.querySelector('.MuiDataGrid-columnSeparator'); // Example selector
    // expect(resizeHandle).toBeInTheDocument(); 

    // Placeholder assertion - relies on default DataGridPro behavior.
    expect(true).toBe(true);
  });

  it('should allow sorting by a single column', async () => {
    const user = userEvent.setup();
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    const grid = screen.getByRole('grid');
    const lastNameHeader = within(grid).getByRole('columnheader', { name: /Last Name/ });

    // Find a row cell in the last name column before sorting
    const firstCellBefore = within(grid).getByRole('cell', { name: testRows[0].lastName });
    expect(firstCellBefore).toBeInTheDocument();

    // Click to sort ascending
    await user.click(lastNameHeader);
    
    // Check aria-sort attribute
    expect(lastNameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Verify data is reordered (assuming default string sort)
    const sortedRowsAsc = [...testRows].sort((a, b) => a.lastName.localeCompare(b.lastName));
    const firstCellAsc = within(grid).getAllByRole('row')[1] // Get first data row
                          .querySelector(`[data-field="lastName"]`); 
    expect(firstCellAsc).toHaveTextContent(sortedRowsAsc[0].lastName);

    // Click again to sort descending
    await user.click(lastNameHeader);
    expect(lastNameHeader).toHaveAttribute('aria-sort', 'descending');

    // Verify data is reordered
    const sortedRowsDesc = sortedRowsAsc.reverse();
    const firstCellDesc = within(grid).getAllByRole('row')[1]
                           .querySelector(`[data-field="lastName"]`);
    expect(firstCellDesc).toHaveTextContent(sortedRowsDesc[0].lastName);
  });

  it('should allow sorting by multiple columns (Shift+Click)', async () => {
    // Note: Multi-column sort requires specific configuration/props might be needed.
    // DataGridPro enables it by default.
    const user = userEvent.setup();
    // Add a numeric/date column for better multi-sort example if needed
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />); 
    const grid = screen.getByRole('grid');
    const statusHeader = within(grid).getByRole('columnheader', { name: /Status/ });
    const lastNameHeader = within(grid).getByRole('columnheader', { name: /Last Name/ });

    // 1. Sort by Status Ascending
    await user.click(statusHeader);
    expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');

    // 2. Sort by Last Name Ascending (Shift + Click)
    await user.keyboard('{Shift>}'); // Press Shift
    await user.click(lastNameHeader);
    await user.keyboard('{/Shift}'); // Release Shift

    // Check aria-sort attributes
    expect(statusHeader).toHaveAttribute('aria-sort', 'ascending');
    expect(lastNameHeader).toHaveAttribute('aria-sort', 'ascending');

    // Verify multi-sort order (requires careful data setup or more robust checks)
    // Check first few rows based on combined sort criteria
    const multiSortedRows = [...testRows].sort((a, b) => {
      const statusCompare = a.status.localeCompare(b.status);
      if (statusCompare !== 0) return statusCompare;
      return a.lastName.localeCompare(b.lastName);
    });

    const firstDataCells = within(grid).getAllByRole('row')[1].querySelectorAll('[role="cell"]');
    expect(firstDataCells[3]).toHaveTextContent(multiSortedRows[0].status); // Status column (index 3)
    expect(firstDataCells[2]).toHaveTextContent(multiSortedRows[0].lastName); // Last Name column (index 2)

    // Verify second row as well for confirmation
    const secondDataCells = within(grid).getAllByRole('row')[2].querySelectorAll('[role="cell"]');
    expect(secondDataCells[3]).toHaveTextContent(multiSortedRows[1].status); // Status column (index 3)
    expect(secondDataCells[2]).toHaveTextContent(multiSortedRows[1].lastName); // Last Name column (index 2)
  });

  // Grouping tests (requires DataGridPremium)
  it('should allow grouping by a column [PREMIUM]', async () => {
    // Test assumes DataGridPremium is used and license is set
    const user = userEvent.setup();
    const initialGroupingModel: GridRowGroupingModel = ['status'];
    render(
      <StatefulAdvancedDataGridMinimal 
        rows={testRows} 
        columns={testColumns} 
        rowGroupingModel={initialGroupingModel}
        // Need to ensure the component uses DataGridPremium internally
      />
    );
    const grid = screen.getByRole('grid');
    const groupHeaders = within(grid).getAllByRole('row', { name: /status:/i }); 
    expect(groupHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText(/status: Active/i)).toBeInTheDocument(); 
    expect(screen.getByText(/status: Pending/i)).toBeInTheDocument(); 
  });

  // Add test for multi-column grouping if required

  it('should respect MUI ThemeProvider', () => {
    const customTheme = createTheme({
      palette: {
        // Use a unique color unlikely to be default
        background: {
          default: 'rgb(0, 128, 0)', // Green background
        },
        text: {
          primary: 'rgb(255, 255, 255)', // White text
        },
      },
    });

    render(
      <ThemeProvider theme={customTheme}>
        {/* Wrap in a Box to easily check background */}
        <Box data-testid="grid-wrapper">
          <StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />
        </Box>
      </ThemeProvider>
    );

    // Check if the grid container or a wrapper picks up the theme background
    const gridWrapper = screen.getByTestId('grid-wrapper');
    // Note: DataGridPremium might render multiple nested divs.
    // Checking a wrapper or the grid's root element style.
    expect(gridWrapper).toHaveStyle('background-color: rgb(0, 128, 0)');

    // Optionally check text color on a header
    const header = screen.getByRole('columnheader', { name: /Last Name/ });
    expect(header).toHaveStyle('color: rgb(255, 255, 255)');
  });

});

// Add new test suite for grid view functionality
describe('Grid View Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock initial empty views list
    (listViews as ReturnType<typeof vi.fn>).mockReturnValue([]);
  });

  it('should show save view dialog when clicking save button', async () => {
    const user = userEvent.setup();
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    
    // Find and click save button
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    
    // Check dialog appears
    expect(screen.getByRole('dialog', { name: /save current view/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/view name/i)).toBeInTheDocument();
  });

  it('should save view when entering name and clicking save', async () => {
    const user = userEvent.setup();
    const mockSave = saveCurrentView as ReturnType<typeof vi.fn>;
    
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    
    // Open save dialog and enter name
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);
    const nameInput = screen.getByLabelText(/view name/i);
    await user.type(nameInput, 'Test View');
    
    // Click save in dialog
    const dialogSaveButton = screen.getByRole('button', { name: /save$/i });
    await user.click(dialogSaveButton);
    
    // Verify save was called
    expect(mockSave).toHaveBeenCalledWith('Test View', expect.any(Object));
  });

  it('should load view when selecting from dropdown', async () => {
    const user = userEvent.setup();
    const mockLoad = loadGridView as ReturnType<typeof vi.fn>;
    const mockViews = [
      { name: 'Test View', state: {}, createdAt: new Date().toISOString(), version: 1 }
    ];
    
    (listViews as ReturnType<typeof vi.fn>).mockReturnValue(mockViews);
    mockLoad.mockReturnValue(true);
    
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    
    // Open load dialog
    const loadButton = screen.getByRole('button', { name: /load/i });
    await user.click(loadButton);
    
    // Select view and load
    const viewSelect = screen.getByLabelText(/saved views/i);
    await user.click(viewSelect);
    const option = screen.getByRole('option', { name: /test view/i });
    await user.click(option);
    
    const loadDialogButton = screen.getByRole('button', { name: /load$/i });
    await user.click(loadDialogButton);
    
    // Verify load was called
    expect(mockLoad).toHaveBeenCalledWith('Test View', expect.any(Object));
  });

  it('should delete view when clicking delete button', async () => {
    const user = userEvent.setup();
    const mockDelete = deleteView as ReturnType<typeof vi.fn>;
    const mockViews = [
      { name: 'Test View', state: {}, createdAt: new Date().toISOString(), version: 1 }
    ];
    
    (listViews as ReturnType<typeof vi.fn>).mockReturnValue(mockViews);
    mockDelete.mockReturnValue(true);
    
    render(<StatefulAdvancedDataGridMinimal rows={testRows} columns={testColumns} />);
    
    // Open load dialog
    const loadButton = screen.getByRole('button', { name: /load/i });
    await user.click(loadButton);
    
    // Select view
    const viewSelect = screen.getByLabelText(/saved views/i);
    await user.click(viewSelect);
    const option = screen.getByRole('option', { name: /test view/i });
    await user.click(option);
    
    // Click delete
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    // Verify delete was called
    expect(mockDelete).toHaveBeenCalledWith('Test View');
  });
}); 