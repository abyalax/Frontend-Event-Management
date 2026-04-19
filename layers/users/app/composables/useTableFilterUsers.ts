import { useTableFilter } from '~/layers/shared/app/composable/filters/useTableFilter';

export function useTableFilterUsers() {
  return useTableFilter({
    filterFields: ['role_id', 'is_active'],
    debounceSearch: 500,
    debounceFilters: 300,
  });
}
