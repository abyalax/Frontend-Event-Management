import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDebounceFn } from '~/layers/shared/app/composable/useDebounceFn';
import type { FilterFieldConfig, QueryParams, TableState, UseTableFilterOptions, UseTableFilterReturn } from './index';

/**
 * Generic table filter + pagination hook with automatic URL sync
 * Handles: search, pagination, sorting, custom filters (number/boolean/string/array)
 * Auto-detects field types from naming patterns. Type-safe coercion. Zero watcher loops.
 *
 * Type Auto-Detection (when using string field names):
 * - Fields ending with '_id', '_count', '_level', etc. -> number
 * - Fields starting with 'is_', 'has_', 'can_', etc. -> boolean
 * - Everything else -> string
 *
 * @param options - Configuration options
 * @returns Hook return object
 *
 * @example
 * // Auto-detected types (no explicit config needed)
 * const { state, search, filterRefs, sortByModel, queryParams, updateOptions } = useTableFilter({
 *   filterFields: [
 *     'category_id',      // Auto-detected as number (ends with _id)
 *     'user_id',          // Auto-detected as number (ends with _id)
 *     'is_active',        // Auto-detected as boolean (starts with is_)
 *     'sku',              // Auto-detected as string (no pattern match)
 *     'status',           // Auto-detected as string (no pattern match)
 *   ]
 * })
 *
 * @example
 * // Explicit types override auto-detection
 * const { state, search, filterRefs, sortByModel, queryParams, updateOptions } = useTableFilter({
 *   filterFields: [
 *     'category_id',                           // Auto-detected: number
 *     { name: 'status_code', type: 'string' }, // Explicit override: string
 *     { name: 'is_active', type: 'boolean' },  // Explicit: boolean
 *     { name: 'category_ids', type: 'array' }, // Explicit: array
 *   ]
 * })
 *
 * @example
 * // With default values and custom debounce
 * const { state, search, filterRefs, sortByModel, queryParams, updateOptions } = useTableFilter({
 *   filterFields: [
 *     { name: 'company_id', type: 'number', defaultValue: 1 },
 *     { name: 'status', type: 'string', debounceMs: 300 },
 *   ],
 *   debounceSearch: 800
 * })
 */
export function useTableFilter<T extends Record<string, unknown> = Record<string, never>>(
  options: UseTableFilterOptions = {}
): UseTableFilterReturn<T> {
  const router = useRouter();
  const route = useRoute();

  const { filterFields = [], debounceSearch = 500, debounceFilters = 500, syncUrl = true } = options;

  // Normalize filter config to standard format
  const normalizedFilters = normalizeFilterConfig(filterFields);

  // Flags to prevent watcher loops
  const isUpdatingFromRoute = ref(false);

  const baseState = {
    page: Number(route.query.page) || 1,
    limit: Number(route.query.limit) || 10,
    search: (route.query.search as string) ?? '',
    sort_by: route.query.sort_by,
    sort_order: route.query.sort_order,
  };

  // Initialize filter fields in state with proper type coercion
  const filterState = normalizedFilters.reduce(
    (acc, fieldConfig) => {
      const { name, type, defaultValue = null } = fieldConfig;
      const routeValue = route.query[name];

      acc[name] = coerceValue(routeValue, type || 'string', defaultValue);
      return acc;
    },
    {} as Record<string, unknown>
  );

  const state = reactive<TableState<T>>({
    ...baseState,
    ...filterState,
  } as TableState<T>);

  // Create reactive refs for each filter (for v-model binding in components)
  const search = ref(state.search);
  const filterRefs = normalizedFilters.reduce(
    (acc, fieldConfig) => {
      acc[fieldConfig.name] = ref(state[fieldConfig.name]);
      return acc;
    },
    {} as Record<string, Ref<unknown>>
  );

  const queryParams = computed(() => {
    const params: Record<string, unknown> = {
      page: state.page,
      limit: state.limit,
    };

    if (state.search?.trim()) params.search = state.search;
    if (state.sort_by) params.sort_by = state.sort_by;
    if (state.sort_order) params.sort_order = state.sort_order;

    // Filter fields - only include if not null/undefined/empty
    normalizedFilters.forEach(({ name, type }) => {
      const value = state[name];

      // Skip null/undefined/empty values
      if (value === null || value === undefined || value === '') return;
      if (type === 'array') {
        if (Array.isArray(value) && value.length > 0) {
          // Vue Router will encode this as repeated query params
          params[name] = value;
        }
        return;
      }

      // Always include boolean false (it's a valid filter state)
      if (type === 'boolean' || value !== null) {
        params[name] = value;
      }
    });

    return params as QueryParams<T>;
  });

  // Watch search with debounce
  const debouncedSearch = useDebounceFn((value: string) => {
    state.search = value;
    state.page = 1;
  }, debounceSearch);

  watch(search, (newValue) => {
    debouncedSearch(newValue ?? '');
  });

  // Watch each filter field with debounce
  const debouncedFilterChange = useDebounceFn(() => {
    state.page = 1;
  }, debounceFilters);

  normalizedFilters.forEach((fieldConfig) => {
    const { name } = fieldConfig;
    const filterRef = filterRefs[name];
    if (filterRef) {
      watch(filterRef, (newValue) => {
        // Skip if this change came from route update
        if (isUpdatingFromRoute.value) return;

        (state as Record<string, unknown>)[name] = newValue;
        debouncedFilterChange();
      });
    }
  });

  // Watch sort and order changes, reset page
  watch(
    () => state.sort_by,
    (newSort, oldSort) => {
      if (isUpdatingFromRoute.value) return;
      // Reset page only if sort actually changed (not on initial mount)
      if (oldSort !== undefined && newSort !== oldSort) {
        state.page = 1;
      }
    }
  );

  watch(
    () => state.sort_order,
    (newOrder, oldOrder) => {
      if (isUpdatingFromRoute.value) return;
      if (oldOrder !== undefined && newOrder !== oldOrder) {
        state.page = 1;
      }
    }
  );

  // Watch limit changes, reset page
  watch(
    () => state.limit,
    (newLimit, oldLimit) => {
      if (isUpdatingFromRoute.value) return;
      if (oldLimit !== undefined && newLimit !== oldLimit) {
        state.page = 1;
      }
    }
  );

  // Watch state -> update URL (if enabled)
  // Use async to wait for route watcher to complete first
  if (syncUrl) {
    watch(
      state,
      async () => {
        if (isUpdatingFromRoute.value) return;

        // Wait for route update watchers to finish before syncing back
        await nextTick();

        // Convert QueryParams to LocationQueryRaw format for Vue Router
        const routeQuery: Record<string, string | null | undefined> = {};
        Object.entries(queryParams.value).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Arrays become multiple query params with same key
            value.forEach((v) => {
              const strValue = String(v);
              if (strValue) {
                routeQuery[key] = routeQuery[key] ? routeQuery[key] + ',' + strValue : strValue;
              }
            });
          } else if (value !== null && value !== undefined) {
            const strValue = String(value);
            routeQuery[key] = strValue || null;
          }
        });

        router.replace({ query: routeQuery });
      },
      { deep: true }
    );
  }

  // Watch URL -> update state
  watch(
    () => route.query,
    (q) => {
      isUpdatingFromRoute.value = true;

      // Update base fields
      search.value = (q.search as string) ?? '';
      if (q.page) state.page = Number(q.page);
      if (q.limit) state.limit = Number(q.limit);

      if (q.sort_by) state.sort_by = q.sort_by as string;
      if (q.sort_order) state.sort_order = q.sort_order as string;

      // Update filter fields with proper type coercion
      normalizedFilters.forEach((fieldConfig) => {
        const { name, type } = fieldConfig;
        if (q[name] !== undefined) {
          filterRefs[name]!.value = coerceValue(q[name], type || 'string', null);
        }
      });

      // Use nextTick to ensure all state updates are done before unlocking
      nextTick(() => {
        isUpdatingFromRoute.value = false;
      });
    },
    { deep: true }
  );

  return {
    state: state as TableState<T>,
    search,
    filterRefs,
    queryParams,
  };
}

/**
 * Normalize filter config to standard FilterFieldConfig format
 * Auto-detects type from field name patterns:
 * - Ends with '_id', '_count', '_level', etc. -> 'number'
 * - Starts with 'is_', 'has_' -> 'boolean'
 * - Otherwise -> 'string'
 *
 * @private
 */
function normalizeFilterConfig(filterFields: Array<FilterFieldConfig | string>): FilterFieldConfig[] {
  const normalized: FilterFieldConfig[] = [];

  // Number field patterns
  const numberSuffixes = ['_id', '_count', '_level', '_year', '_month', '_day', '_score', '_rate', '_price', '_amount', '_quantity'];
  const booleanPrefixes = ['is_', 'has_', 'can_', 'should_', 'will_'];

  // Process filterFields (can be strings or objects)
  filterFields.forEach((field) => {
    if (typeof field === 'string') {
      // Auto-detect type from field name
      let detectedType: 'number' | 'boolean' | 'string' = 'string'; // default to string

      // Check for boolean patterns
      const boolMatch = booleanPrefixes.some((prefix) => field.startsWith(prefix));
      if (boolMatch) {
        detectedType = 'boolean';
      }

      // Check for number patterns (takes precedence)
      const numMatch = numberSuffixes.some((suffix) => field.endsWith(suffix));
      if (numMatch) {
        detectedType = 'number';
      }

      normalized.push({ name: field, type: detectedType, defaultValue: null });
    } else if (typeof field === 'object' && field.name) {
      normalized.push({
        name: field.name,
        type: field.type || detectTypeFromName(field.name),
        defaultValue: field.defaultValue ?? null,
        debounceMs: field.debounceMs,
      });
    }
  });

  return normalized;
}

/**
 * Auto-detect field type from field name
 * @private
 */
function detectTypeFromName(fieldName: string): 'number' | 'boolean' | 'string' {
  const numberSuffixes = ['_id', '_count', '_level', '_year', '_month', '_day', '_score', '_rate', '_price', '_amount', '_quantity'];
  const booleanPrefixes = ['is_', 'has_', 'can_', 'should_', 'will_'];

  // Check for boolean patterns
  const boolMatch = booleanPrefixes.some((prefix) => fieldName.startsWith(prefix));
  if (boolMatch) {
    return 'boolean';
  }

  // Check for number patterns
  const numMatch = numberSuffixes.some((suffix) => fieldName.endsWith(suffix));
  if (numMatch) {
    return 'number';
  }

  // Default to string
  return 'string';
}

/**
 * Coerce URL query value to correct type
 * @private
 */
function coerceValue(value: unknown, type: 'number' | 'boolean' | 'string' | 'array', defaultValue: unknown): unknown {
  if (value === undefined || value === '') return defaultValue ?? null;

  switch (type) {
    case 'number':
      return value !== null && value !== undefined ? Number(value) : null;

    case 'boolean':
      if (value === 'true') return true;
      if (value === 'false') return false;
      return defaultValue ?? null;

    case 'array':
      // Support:
      // - ?tags=a&tags=b  -> ['a','b']
      // - ?tags=a,b       -> ['a','b']
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return value.split(',').filter(Boolean);
      return defaultValue ?? [];

    case 'string':
      return value ?? null;

    default:
      return value;
  }
}
