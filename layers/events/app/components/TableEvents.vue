<script setup lang="ts">
import { Send, Trash } from 'lucide-vue-next';
import { h } from 'vue';
import { Table, type BulkAction, type TableFacetedFilter } from '~/layers/shared/app/components/fragments/table';
import { RowDetailEvents } from '~/layers/events/app/components';
import type { Event } from '~/layers/events/app/types';
import { createEventColumns } from '~/layers/events/app/utils/events-columns';

const selected = ref<Event[]>([]);
const expanded = ref<Event[]>([]);

const eventColumns = createEventColumns(expanded);

const { queryParams, state } = useTableFilterEvents();
const { data } = useGetEvents(queryParams);
const publishEventsMutation = usePublishEvents();
const deleteEventMutation = useDeleteEvent();

const bulkActions: BulkAction<Event>[] = [
  {
    label: 'Publish Events',
    icon: Send,
    onClick: (selectedRows) => {
      const eventsToPublish = selectedRows.filter((event) => event.status !== 'PUBLISHED');
      const eventIds = eventsToPublish.map((event) => event.id);
      publishEventsMutation.mutate(eventIds);
      selected.value = [];
    },
    disabled: (selectedRows) => {
      return selectedRows.every((event) => event.status === 'PUBLISHED');
    },
  },
  {
    label: 'Delete Events',
    icon: Trash,
    onClick: (selectedRows) => {
      const eventIds = selectedRows.map((event) => event.id);
      deleteEventMutation.mutate(eventIds);
      selected.value = [];
    },
    disabled: (selectedRows) => selectedRows.length === 0,
  },
];

const facetedFilters: TableFacetedFilter<Event>[] = [
  {
    columnId: 'status',
    title: 'Status',
    options: [
      { label: 'Draft', value: 'draft' },
      { label: 'Published', value: 'published' },
      { label: 'Cancelled', value: 'cancelled' },
      { label: 'Completed', value: 'completed' },
    ],
  },
];

const handleRowClick = (_event: Event, nativeEvent?: MouseEvent) => {
  nativeEvent?.stopPropagation();
};

const handleExpandedRow = (event: Event) =>
  h(RowDetailEvents, {
    event: event,
  });
</script>

<template>
  <Table
    v-model:filter="state"
    v-model:selected="selected"
    v-model:expanded="expanded"
    :data="data"
    :columns="eventColumns"
    :column-ids="['select', 'expand', 'title', 'category', 'status', 'isVirtual', 'location', 'startDate', 'endDate', 'actions']"
    :bulk-actions="bulkActions"
    :faceted-filter="facetedFilters"
    :on-click-row="handleRowClick"
    :expanded-row="handleExpandedRow"
    :initial-column-visibility="{
      select: true,
      expand: true,
      title: true,
      category: true,
      status: true,
      isVirtual: true,
      location: true,
      startDate: true,
      endDate: true,
    }"
    :pagination="true"
  />
</template>
