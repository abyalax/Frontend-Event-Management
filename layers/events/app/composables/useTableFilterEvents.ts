import { useTableFilter } from '~/layers/shared/app/composable/table/filters/useTableFilter';

export function useTableFilterEvents() {
  return useTableFilter({
    filterFields: ['status'],
    debounceSearch: 500,
    debounceFilters: 300,
  });
}
