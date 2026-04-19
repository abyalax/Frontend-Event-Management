import type { ColumnDef } from '@tanstack/vue-table';
import type { Component } from 'vue';
import type { Paginated } from '~~/layers/shared/app/types/meta';

export { default as BulkActions } from './ui/BulkActions.vue';
export { default as ColumnVisibilitySelector } from './ui/ColumnVisibilitySelector.vue';
export { default as FacetedFilter } from './ui/FacetedFilter.vue';
export { default as Table } from './ui/Table.vue';
export { default as TablePagination } from './ui/TablePagination.vue';

export interface Option {
  label: string;
  value: number;
}

export type Options = Option[];

export interface BulkAction<T = unknown> {
  icon: Component;
  label: string;
  onClick: (selectedRows: T[]) => void;
}

export interface FacetedFilterOption {
  label: string;
  value: string;
  icon?: Component;
}

export interface TableFacetedFilter<T = unknown> {
  columnId: keyof T;
  title: string;
  options: FacetedFilterOption[];
}

export interface TableVirtualizer {
  virtualizeAt: number;
}

export type TableData<T> = Paginated<T>; // use new standar paginate structure

export interface TableProps<T = unknown> {
  bulkActions?: BulkAction<T>[];
  columns: ColumnDef<T>[];
  columnIds: string[];
  freezeColumnIds?: string[];
  data?: TableData<T>;
  topActions?: Component;
  virtualizer?: TableVirtualizer;
  initialColumnVisibility?: Record<string, boolean>;
  perPageOptions?: Options;
  pagination?: { initialState?: Record<string, unknown> } | boolean;
  menufilter?: Component[];
  facetedFilter?: TableFacetedFilter<T>[];
  expandedRow?: (record: T) => Component;
  onClickRow: (data: T, event?: MouseEvent) => void;
}
