# AdvancedDataGrid – Wrapper Sizing Notes

This note captures the root-cause and fix for the "5-rows only / no vertical scrolling" issue that occurred in the **AdvancedDataGridTestRig**.

---
## 1.  How the grid calculates its viewport

`DataGridPremium` (and the Pro/MIT variants) do **not** look at the browser window. Instead they measure **their immediate container** to decide:

* how many rows to render initially;
* whether a vertical scrollbar is needed;
* when to request more rows while scrolling (virtualisation).

The measuring is done through `ResizeObserver` + `MutationObserver`.

---
## 2.  What goes wrong when the container height is `auto` / `0 px`

If the wrapper's computed height is `0` (or some very small value):

1. The grid renders only as many rows as fit in that height — often **4-5 rows**.
2. It then waits for a resize notification, hoping the size will correct itself ⇒ visible "pause" after the first few rows.
3. Because the height never grows, the grid never creates its own scroll area ⇒ vertical scrolling is impossible.

---
## 3.  Why it happened in the Test Rig

Before the fix the wrapper was hard-coded to

```tsx
<Box sx={{ height: '100%', width: '100%' }}>
```

In the Test Rig the parent is a plain `<div>` without an explicit size. "100 %" of `auto` collapses to **0 px**, so the grid thought its viewport was 0 px high.

---
## 4.  The fix

Allow the wrapper to respect the `height` / `width` props passed by the caller and fall back to `100 %` only when they are not provided:

```tsx
const containerHeight = height ?? '100%';
const containerWidth  = width  ?? '100%';
...
<Box sx={{ height: containerHeight, width: containerWidth }}>
```

In **AdvancedDataGridTestRig** we pass

```tsx
<AdvancedDataGrid height="600px" width="80vw" ... />
```

so the wrapper becomes 600 px tall → the grid renders the full viewport immediately and attaches a working scrollbar.

---
## 5.  Practical guidelines

* **Grid inside a page section** – provide an explicit `height` (e.g. `600px`, `40vh`) or make sure every ancestor has a real, non-auto height (e.g. flex column `min-height: 0` pattern).
* **Grid intended to fill entire window** – `height: '100%'` is fine as long as `<html>, <body>` and the React root are `height: 100%`.
* When you see only a handful of rows and scrolling is disabled, first check the computed height of the grid's immediate container in dev-tools. 