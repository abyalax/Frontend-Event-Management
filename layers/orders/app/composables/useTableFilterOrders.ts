import { useTableFilter } from '~/layers/shared/app/composable/filters/useTableFilter';

export function useTableFilterOrders() {
  return useTableFilter({
    filterFields: ['status'],
    debounceSearch: 500,
    debounceFilters: 300,
  });
}
