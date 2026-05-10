import type { ColumnDef } from '@tanstack/vue-table';
import { h } from 'vue';
import { ExpandButton } from '~/layers/shared/app/components/fragments/table';
import StatusBadge from '~/layers/shared/app/components/fragments/badge/StatusBadge.vue';
import type { Event } from '../types';
import CheckboxHeader from '~/layers/shared/app/components/fragments/input/CheckboxHeader.vue';
import CheckboxCell from '~/layers/shared/app/components/fragments/input/CheckboxCell.vue';
import { Input } from '~/layers/shared/app/components/ui/input';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/layers/shared/app/components/ui/select';
import { Switch } from '~/layers/shared/app/components/ui/switch';
import { Trash2 } from 'lucide-vue-next';
import type { AcceptableValue } from 'reka-ui';
import { formatDate } from '~/layers/shared/app/utils/formatter';
import DatePicker from '~/layers/shared/app/components/fragments/date-picker/DatePicker.vue';
import BannerUpload from '~/layers/events/app/components/BannerUpload.vue';

type Params = {
  crud: {
    isRowEditable: (row: Event) => boolean;
    getFieldValue: <K extends keyof Event>(row: Event, field: K) => Event[K];
    handleFieldChange: <K extends keyof Event>(row: Event, field: K, value: Event[K]) => void;
    getCategoryName: (categoryId: number) => string;
    getStatusLabel: (status: string) => string;
    EVENT_STATUSES: Array<{ label: string; value: string }>;
    MOCK_CATEGORIES: Array<{ id: number; name: string }>;
    isNewRow: (row: Event) => boolean;
    handleDelete: (row: Event) => void;
  };
  expanded: Ref<Event[]>;
};

export const useColumnEvents = (params: Params): ColumnDef<Event>[] => {
  const { crud, expanded } = params;

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
      cell: (context) => {
        const event = context.row.original;
        if (crud.isNewRow(event)) return h('span', { class: 'text-xs text-muted-foreground' }, 'New');
        return h(CheckboxCell, {
          context: { row: context.row },
        });
      },
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },
    {
      id: 'expand',
      header: () => null,
      cell: ({ row }) => {
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
      size: 300,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'flex flex-col gap-1' }, [
            h('div', { class: 'font-medium' }, event.title),
            event.description ? h('div', { class: 'text-xs text-muted-foreground line-clamp-1' }, event.description) : null,
          ]);
        }
        return h('div', { class: 'flex flex-col gap-1 min-w-0' }, [
          h(Input, {
            modelValue: crud.getFieldValue(event, 'title'),
            'onUpdate:modelValue': (v: string | number) => crud.handleFieldChange(event, 'title', v as string),
            placeholder: 'Event title',
            class: 'h-8 w-full',
            onClick: (e: MouseEvent) => e.stopPropagation(),
            onFocus: (e: FocusEvent) => e.stopPropagation(),
          }),
          h(Input, {
            modelValue: crud.getFieldValue(event, 'description') ?? undefined,
            'onUpdate:modelValue': (v: string | number) => crud.handleFieldChange(event, 'description', v as string),
            placeholder: 'Event description',
            class: 'h-8 w-full text-xs',
            onClick: (e: MouseEvent) => e.stopPropagation(),
            onFocus: (e: FocusEvent) => e.stopPropagation(),
          }),
        ]);
      },
    },
    {
      id: 'category',
      accessorFn: (row) => crud.getCategoryName?.(row.categoryId) ?? '-',
      header: 'Category',
      size: 150,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'capitalize' }, crud.getCategoryName?.(event.categoryId) ?? '-');
        }
        return h(
          Select,
          {
            modelValue: crud.getFieldValue(event, 'categoryId'),
            'onUpdate:modelValue': (v: AcceptableValue) => crud.handleFieldChange(event, 'categoryId', v as number),
            onClick: (e: MouseEvent) => e.stopPropagation(),
            onFocus: (e: FocusEvent) => e.stopPropagation(),
          },
          {
            default: () => [
              h(SelectTrigger, { class: 'h-8 w-full min-w-0' }, () =>
                h('span', { class: 'truncate' }, crud.getCategoryName?.(crud.getFieldValue(event, 'categoryId')) || 'Select…')
              ),
              h(SelectContent, {}, () => crud.MOCK_CATEGORIES?.map((cat) => h(SelectItem, { key: cat.id, value: cat.id }, () => cat.name))),
            ],
          }
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: ({ row }) => {
        const event = row.original;
        const value = crud.getFieldValue(event, 'status');

        if (!crud.isRowEditable(event)) {
          return h(StatusBadge, {
            status: String(value),
          });
        }

        return h(
          Select,
          {
            modelValue: value,
            'onUpdate:modelValue': (v: AcceptableValue) => crud.handleFieldChange(event, 'status', v as string),
            onClick: (e: MouseEvent) => e.stopPropagation(),
            onFocus: (e: FocusEvent) => e.stopPropagation(),
          },
          {
            default: () => [
              h(SelectTrigger, { class: 'h-8 w-full min-w-0' }, () => h('span', { class: 'truncate' }, crud.getStatusLabel?.(value) || 'Select…')),
              h(SelectContent, {}, () =>
                crud.EVENT_STATUSES?.map((status) => h(SelectItem, { key: status.value, value: status.value }, () => status.label))
              ),
            ],
          }
        );
      },
    },
    {
      accessorKey: 'isVirtual',
      header: 'Mode',
      size: 100,
      cell: ({ row }) => {
        const event = row.original;
        const value = crud.getFieldValue(event, 'isVirtual');

        if (!crud.isRowEditable(event)) {
          return h(
            'span',
            {
              class: value
                ? 'inline-flex rounded-md border border-sky-200 bg-sky-100 px-2 py-1 text-xs font-medium text-sky-800'
                : 'inline-flex rounded-md border border-slate-200 bg-slate-100 px-2 py-1 text-xs font-medium text-slate-800',
            },
            value ? 'Virtual' : 'Offline'
          );
        }

        return h('div', { class: 'flex items-center gap-2' }, [
          h(Switch, {
            checked: value,
            'onUpdate:checked': (v: boolean) => crud.handleFieldChange(event, 'isVirtual', v),
            onClick: (e: MouseEvent) => e.stopPropagation(),
          }),
          h('span', { class: 'text-xs' }, value ? 'Virtual' : 'Offline'),
        ]);
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      size: 200,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'max-w-[18rem] truncate' }, String(event.location ?? '-'));
        }
        return h(Input, {
          modelValue: crud.getFieldValue(event, 'location'),
          'onUpdate:modelValue': (v: string | number) => crud.handleFieldChange(event, 'location', v as string),
          placeholder: 'Event location',
          class: 'h-8 w-full min-w-0',
          onClick: (e: MouseEvent) => e.stopPropagation(),
          onFocus: (e: FocusEvent) => e.stopPropagation(),
        });
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Start Date',
      size: 180,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'whitespace-nowrap' }, formatDate(event.startDate));
        }
        return h(DatePicker, {
          modelValue: crud.getFieldValue(event, 'startDate'),
          'onUpdate:modelValue': (v: string) => crud.handleFieldChange(event, 'startDate', v),
          placeholder: 'Start date',
          class: 'w-full',
          onChange: (v: string) => crud.handleFieldChange(event, 'startDate', v),
        });
      },
    },
    {
      accessorKey: 'endDate',
      header: 'End Date',
      size: 180,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'whitespace-nowrap' }, formatDate(event.endDate));
        }
        return h(DatePicker, {
          modelValue: crud.getFieldValue(event, 'endDate'),
          'onUpdate:modelValue': (v: string) => crud.handleFieldChange(event, 'endDate', v),
          placeholder: 'End date',
          class: 'w-full',
          onChange: (v: string) => crud.handleFieldChange(event, 'endDate', v),
        });
      },
    },
    {
      accessorKey: 'maxAttendees',
      header: 'Max Attendees',
      size: 120,
      cell: ({ row }) => {
        const event = row.original;
        if (!crud.isRowEditable(event)) {
          return h('div', { class: 'whitespace-nowrap' }, String(event.maxAttendees ?? '-'));
        }
        return h(Input, {
          type: 'number',
          modelValue: crud.getFieldValue(event, 'maxAttendees') ?? undefined,
          'onUpdate:modelValue': (v: string | number) => crud.handleFieldChange(event, 'maxAttendees', v ? Number(v) : null),
          placeholder: 'Unlimited',
          class: 'h-8 w-full min-w-0',
          onClick: (e: MouseEvent) => e.stopPropagation(),
          onFocus: (e: FocusEvent) => e.stopPropagation(),
        });
      },
    },
    {
      accessorKey: 'bannerUrl',
      header: 'Banner',
      size: 200,
      cell: ({ row }) => {
        const event = row.original;
        // Use a unique key for each BannerUpload instance to prevent component reuse issues
        const bannerKey = `banner-${event.id || (event as Event & { _tmpId?: string })._tmpId || 'unknown'}`;
        return h(BannerUpload, {
          key: bannerKey,
          event,
          crud,
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 80,
      cell: ({ row }) => {
        const event = row.original;
        return h('div', { class: 'flex gap-1' }, [
          h(
            Button,
            {
              variant: 'ghost',
              size: 'icon',
              class: 'h-8 w-8 text-destructive hover:text-destructive',
              onClick: (e: MouseEvent) => {
                e.stopPropagation();
                crud.handleDelete(event);
              },
            },
            () => h(Trash2, { class: 'w-4 h-4' })
          ),
        ]);
      },
    },
  ];
};
