import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import ActionsCellEvent from '../components/ActionsCellEvent.vue';
import { ExpandButton } from '~/layers/shared/app/components/fragments/table';
import StatusBadge from '~/layers/shared/app/components/fragments/badge/StatusBadge.vue';
import type { Event } from '../types';
import CheckboxHeader from '~/layers/shared/app/components/fragments/input/CheckboxHeader.vue';
import CheckboxCell from '~/layers/shared/app/components/fragments/input/CheckboxCell.vue';

const formatDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export const createEventColumns = (expanded: Ref<Event[]>): ColumnDef<Event>[] => {
  const isRowExpanded = (row: Event): boolean => {
    return expanded.value.some((item) => item.id === row.id);
  };

  const toggleRowExpansion = (row: Event) => {
    const isExpanded = expanded.value.some((item) => item.id === row.id);
    if (isExpanded) {
      expanded.value = expanded.value.filter((item) => item.id !== row.id);
    } else {
      expanded.value = [...expanded.value, row];
    }
  };

  return [
    {
      id: 'select',
      header: (context) =>
        h(CheckboxHeader, {
          context: { table: context.table },
        }),
      cell: (context) =>
        h(CheckboxCell, {
          context: { row: context.row },
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'expand',
      header: () => null,
      cell: ({ row }) => {
        // Use manual expansion state passed from parent
        const isExpanded = isRowExpanded(row.original);

        return h(ExpandButton, {
          expanded: isExpanded,
          'onUpdate:expanded': () => toggleRowExpansion(row.original),
          key: `expand-${row.id}`,
        });
      },
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: (context) => {
        const title = context.row.getValue('title') as string;
        const description = context.row.original.description;

        return h('div', { class: 'flex flex-col gap-1' }, [
          h('div', { class: 'font-medium' }, title),
          description ? h('div', { class: 'text-xs text-muted-foreground line-clamp-1' }, description) : null,
        ]);
      },
    },
    {
      id: 'category',
      accessorFn: (row) => row.category?.name ?? '-',
      header: 'Category',
      cell: (context) => h('div', { class: 'capitalize' }, String(context.row.getValue('category') ?? '-')),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (context) =>
        h(StatusBadge, {
          status: String(context.row.getValue('status')),
        }),
    },
    {
      accessorKey: 'isVirtual',
      header: 'Mode',
      cell: (context) => {
        const isVirtual = Boolean(context.row.original.isVirtual);
        return h(
          'span',
          {
            class: isVirtual
              ? 'inline-flex rounded-md border border-sky-200 bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800'
              : 'inline-flex rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800',
          },
          isVirtual ? 'Virtual' : 'Offline'
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: (context) => h('div', { class: 'max-w-[18rem] truncate' }, String(context.row.getValue('location') ?? '-')),
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      cell: (context) => h('div', { class: 'whitespace-nowrap' }, formatDate(context.row.original.startDate)),
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      cell: (context) => h('div', { class: 'whitespace-nowrap' }, formatDate(context.row.original.endDate)),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) =>
        h(ActionsCellEvent, {
          ...row.original,
          onToggleExpand: () => row.toggleExpanded(),
        }),
    },
  ];
};
