# Grid Configuration Save & Reload – Implementation Plan

_Last updated: May 2024_

## Objective
Enable users to **save** the current grid view (columns shown, column order, sort model, row-grouping model, etc.) under a memorable name and **reload** it later.  **Phase-1** stores the views in an _in-memory_ collection so no backend or localStorage is required yet.

> **Tech stack note:**  The entire grid layer is built on **@mui/x-data-grid-premium v8+** (the _Premium_ tier introduced in MUI X v8).  All helpers, types, and state operations **must** target the Premium API.  Do **not** fall back to `DataGridPro` or pre-v8 APIs that have been deprecated.

---

## Task Checklist

- [x] 1. Baseline analysis – locate grid component & ensure `apiRef` access
- [x] 2. Define strong TypeScript types for a grid view configuration
- [x] 3. Implement an in-memory store (`gridViewStore.ts`)
- [x] 4. Wire _save_ & _load_ helpers around `apiRef.exportState()` / `apiRef.restoreState()`
- [x] 5. Add toolbar UI (Save dialog • Views dropdown • Delete option)
- [x] 6. Verification (unit tests + manual QA)
- [x] 7. Update this plan as each box is checked off

---

## Detailed Steps

### 1. Baseline analysis
1.1  ✅ Found `DataGridPremium` wrapper in `src/components/AdvancedDataGrid/AdvancedDataGrid.tsx`.
1.2  ✅ Current implementation uses `const apiRef = React.useRef<any>(null)` - needs upgrading to proper `useGridApiRef()`.
1.3  ✅ The `apiRef` is passed to `DataGridPremium` but needs type refinement.

**Findings:**
- AdvancedDataGrid is a wrapper around DataGridPremium v8+
- It exposes all DataGridPremium props through rest props
- Current apiRef is typed as `any` and uses React.useRef instead of the MUI hook
- Need to update apiRef to use `useGridApiRef` from '@mui/x-data-grid-premium'
- No direct toolbar customization visible yet; will need to be added

### 2. Type definitions
2.1  ✅ Created `types/GridViewConfig.ts` with proper typing.
2.2  ✅ Added a version field for future migrations.

**Implementation:** See `src/types/GridViewConfig.ts`

### 3. In-memory store
3.1  ✅ Created `lib/gridViewStore.ts` with Map-based implementation.
3.2  ✅ Implemented basic CRUD operations (save, get, list, delete).

**Implementation:** See `src/lib/gridViewStore.ts`

### 4. Grid wiring helpers
4.1  ✅ Created `lib/gridViewHelpers.ts` with save and load functionality.
4.2  ✅ Implemented error handling for loading views.

**Implementation:** See `src/lib/gridViewHelpers.ts`

### 5. Toolbar UI
5.1  ✅ Created `GridViewSelector` component with save/load dialogs.
5.2  ✅ Implemented:
- **Save View** button → opens `Dialog` with text field for view name.
- **Views** `Menu` / dropdown listing saved names.
  - Click loads view.
  - Secondary menu item or icon deletes view.
5.3  ✅ Added proper error handling and state management.

**Implementation:** See `src/components/AdvancedDataGrid/components/GridViewSelector.tsx`

### 6. Verification
6.1  ✅ Added comprehensive test suite in `AdvancedDataGrid.test.tsx`:
- Save view dialog functionality
- Load view functionality
- Delete view functionality
- Error handling
6.2  Manual walkthrough completed:
- Reorder columns, group, sort.
- Save as "Cardiology".
- Change layout.
- Load "Cardiology" → grid reverts.

### 7. Maintenance of this plan
After each step is implemented & merged:
1. ✅ Ticked all completed boxes above.
2. ✅ Added notes under _Changelog_ section.

---

## Changelog
- _May 2024_ – Initial draft.
- _May 2024_ - Completed baseline analysis of grid component.
- _May 2024_ - Created GridViewConfig type with proper interface.
- _May 2024_ - Implemented in-memory grid view store.
- _May 2024_ - Added grid view helper functions for save/load operations.
- _May 2024_ - Implemented GridViewSelector component with save/load dialogs.
- _May 2024_ - Added GridToolbarViewSelector component.
- _May 2024_ - Integrated view selector into AdvancedDataGrid toolbar.
- _May 2024_ - Added comprehensive test suite.