import { GridViewConfig } from '../types/GridViewConfig';

/**
 * In-memory store for saving and accessing grid view configurations.
 * This is a simple implementation that doesn't persist across page refreshes.
 */

// Internal storage - a Map with view name as key
const views = new Map<string, GridViewConfig>();

/**
 * Save a grid view configuration
 * @param config The grid view config to save
 */
export function saveView(config: GridViewConfig): void {
  views.set(config.name, config);
}

/**
 * Get a specific view by name
 * @param name The name of the view to retrieve 
 * @returns The grid view config or undefined if not found
 */
export function getView(name: string): GridViewConfig | undefined {
  return views.get(name);
}

/**
 * List all saved views
 * @returns Array of all saved configurations
 */
export function listViews(): GridViewConfig[] {
  return Array.from(views.values());
}

/**
 * Delete a view by name
 * @param name The name of the view to delete
 * @returns true if view was found and deleted, false otherwise
 */
export function deleteView(name: string): boolean {
  return views.delete(name);
} 