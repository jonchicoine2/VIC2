# Grid Configuration Save & Reload – Implementation Plan

_Last updated: {{DATE}}_

## Objective
Enable users to **save** the current grid view (columns shown, column order, sort model, row-grouping model, etc.) under a memorable name and **reload** it later.  **Phase-1** stores the views in an _in-memory_ collection so no backend or localStorage is required yet.

> **Tech stack note:**  The entire grid layer is built on **@mui/x-data-grid-premium v8+** (the _Premium_ tier introduced in MUI X v8).  All helpers, types, and state operations **must** target the Premium API.  Do **not** fall back to `DataGridPro` or pre-v8 APIs that have been deprecated.

---

## Task Checklist

- [ ] 1. Baseline analysis – locate grid component & ensure `apiRef` access
- [ ] 2. Define strong TypeScript types for a grid view configuration
- [ ] 3. Implement an in-memory store (`gridViewStore.ts`)
- [ ] 4. Wire _save_ & _load_ helpers around `apiRef.exportState()` / `apiRef.restoreState()`
- [ ] 5. Add toolbar UI (Save dialog • Views dropdown • Delete option)
- [ ] 6. Verification (unit tests + manual QA)
- [ ] 7. Update this plan as each box is checked off

---

## Detailed Steps

### 1. Baseline analysis
1.1  Grep for `DataGridPremium` (or its wrapper) to find the main grid component(s).
1.2  Confirm the component uses `const apiRef = useGridApiRef()` (or add it).
1.3  Expose `apiRef` via props/context if nested children need access.

### 2. Type definitions
2.1  Create `types/GridViewConfig.ts`:
```ts
import { GridState } from '@mui/x-data-grid-premium';
export interface GridViewConfig {
  name: string;
  state: GridState;   // full grid state snapshot
  createdAt: string;  // ISO string for simplicity
}
```
2.2  Consider a `Version` field for future migrations.

### 3. In-memory store
3.1  Create `lib/gridViewStore.ts`:
```ts
import { GridViewConfig } from '../types/GridViewConfig';

const views = new Map<string, GridViewConfig>();

export function saveView(cfg: GridViewConfig) {
  views.set(cfg.name, cfg);
}
export function getView(name: string) {
  return views.get(name);
}
export function listViews() {
  return Array.from(views.values());
}
export function deleteView(name: string) {
  views.delete(name);
}
```
3.2  The store is a plain module – state resets on page refresh (OK for Phase-1).

### 4. Grid wiring helpers
4.1  `saveCurrentView(name)`
```ts
export function saveCurrentView(name: string, apiRef: GridApiCommunity) {
  const state = apiRef.current.exportState();
  saveView({ name, state, createdAt: new Date().toISOString() });
}
```
4.2  `loadView(name)` fetches config and:
```ts
apiRef.current.restoreState(cfg.state);
apiRef.current.refresh();
```
4.3  Guard against missing view / incompatible state.

### 5. Toolbar UI
5.1  Extend existing toolbar component or wrap `GridToolbar`.
5.2  Add:
- **Save View** button → opens `Dialog` with text field for view name.
- **Views** `Menu` / dropdown listing saved names.
  - Click loads view.
  - Secondary menu item or icon deletes view.
5.3  Disable Save if name already exists (or confirm overwrite).

### 6. Verification
6.1  Jest tests for `gridViewStore.ts`.
6.2  Manual walkthrough:
- Reorder columns, group, sort.
- Save as "Cardiology".
- Change layout.
- Load "Cardiology" → grid reverts.

### 7. Maintenance of this plan
After each step is implemented & merged:
1. Tick the corresponding box above.
2. Add a short note/date under _Changelog_ section.

---

## Changelog
- _May ?? 2024_ – Initial draft. 