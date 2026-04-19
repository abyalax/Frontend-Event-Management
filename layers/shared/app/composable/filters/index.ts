import type { SortOrder } from '../../types/meta';

/**
 * Filter field configuration with type information
 */
export interface FilterFieldConfig {
  name: string;
  /**
   * Data type: 'number' | 'boolean' | 'string' | 'array'
   * If omitted, auto-detected from field name:
   * - '_id', '_count', '_level' suffixes → 'number'
   * - 'is_', 'has_', 'can_' prefixes → 'boolean'
   * - Otherwise → 'string'
   */
  type?: 'number' | 'boolean' | 'string' | 'array';
  defaultValue?: unknown;
  debounceMs?: number;
}

/**
 * Options to configure useTableFilter hook
 */
export interface UseTableFilterOptions {
  /**
   * Filter field configurations or names
   * String fields are auto-typed based on naming patterns:
   * - 'category_id' → number (ends with _id)
   * - 'is_active' → boolean (starts with is_)
   * - 'sku' → string (no pattern)
   *
   * @example
   * // Simple auto-detection
   * filterFields: ['category_id', 'is_active', 'sku']
   *
   * @example
   * // Explicit override
   * filterFields: [
   *   'category_id',
   *   { name: 'is_active', type: 'boolean' },
   *   { name: 'status_code', type: 'string' }
   * ]
   */
  filterFields?: Array<FilterFieldConfig | string>;

  /**
   * Debounce delay for search input in milliseconds
   * @default 500
   */
  debounceSearch?: number;

  /**
   * Debounce delay for filter changes in milliseconds
   * @default 500
   */
  debounceFilters?: number;

  /**
   * Sync state to URL query params
   * @default true
   */
  syncUrl?: boolean;
}

/**
 * Query parameters object sent to API
 */
export type QueryParams<T extends Record<string, unknown> = Record<string, never>> = {
  page: number;
  limit: number;
  search?: string;
  sort_by?: string;
  sort_order?: SortOrder;
} & T;

/**
 * Table state containing pagination, sorting, search, and filters
 */
export type TableState<T extends Record<string, unknown> = Record<string, never>> = {
  page: number;
  limit: number;
  search: string;
  sort_by: string;
  sort_order: string;
} & T;

/**
 * Return type of useTableFilter hook
 */
export interface UseTableFilterReturn<T extends Record<string, unknown> = Record<string, never>> {
  /**
   * Reactive state object containing page, limit, search, sort, filters
   */
  state: TableState<T>;

  /**
   * Reactive ref for search input
   */
  search: Ref<string | undefined>;

  /**
   * Object containing reactive refs for each filter field
   * Access with: filterRefs.category_id.value
   */
  filterRefs: {
    [key: string]: Ref<unknown>;
  };

  /**
   * Computed query parameters to send to API
   * Automatically filters out null/undefined values
   */
  queryParams: ComputedRef<QueryParams<T>>;
}
