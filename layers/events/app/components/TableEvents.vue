<script setup lang="ts">
import { computed, ref, h } from 'vue';
import { Send } from 'lucide-vue-next';
import { Table } from '~/layers/shared/app/components/fragments/table';
import type { BulkAction } from '~/layers/shared/app/components/fragments/table';
import RowDetailEvents from '~/layers/events/app/components/RowDetailEvents.vue';
import EventTableTopActions from '~/layers/events/app/components/EventTableTopActions.vue';
import type { Event } from '~/layers/events/app/types';
import { useTableStateEvents } from '~/layers/events/app/composables/useTableStateEvents';
import { useTableFilterEvents } from '~/layers/events/app/composables/useTableFilterEvents';
import { useGetEvents } from '~/layers/events/app/composables/useGetEvents';
import { usePublishEvents } from '~/layers/events/app/composables/usePublishEvents';

const expanded = ref<Event[]>([]);
const selected = ref<Event[]>([]);

// Use CRUD composable
const crud = useTableStateEvents();
const publishEventsMutation = usePublishEvents();
const { $toast } = useNuxtApp();

// Use existing table filter and data
const { queryParams, state } = useTableFilterEvents();
const { data } = useGetEvents(queryParams);

// Merge local rows with server data
const tableData = computed(() => ({
  meta: data.value?.meta,
  links: data.value?.links,
  data: [...crud.localRows.value, ...(data.value?.data || [])],
}));

const eventColumns = useColumnEvents({ crud, expanded });

const bulkActions: BulkAction<Event>[] = [
  {
    label: 'Publish Selected',
    icon: Send,
    disabled: (rows) => rows.length === 0 || publishEventsMutation.isPending.value,
    onClick: async (rows) => {
      const ids = rows.map((row) => row.id).filter(Boolean);
      if (ids.length === 0) {
        $toast.warning('No valid events selected');
        return;
      }
      await publishEventsMutation.mutateAsync(ids);
    },
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
    :data="tableData"
    :columns="eventColumns"
    :column-ids="['select', 'expand', 'title', 'category', 'status', 'isVirtual', 'location', 'startDate', 'endDate', 'maxAttendees', 'actions']"
    :bulk-actions="bulkActions"
    :top-actions="() => h(EventTableTopActions, { crud })"
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
      maxAttendees: true,
    }"
    :pagination="true"
  />
</template>
