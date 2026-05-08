<script setup lang="ts">
import { computed, ref, h } from 'vue';
import { Table } from '~/layers/shared/app/components/fragments/table';
import RowDetailEvents from '~/layers/events/app/components/RowDetailEvents.vue';
import EventTableTopActions from '~/layers/events/app/components/EventTableTopActions.vue';
import type { Event } from '~/layers/events/app/types';
import { createEventColumns } from '~/layers/events/app/utils/events-columns';
import { useTableStateEvents } from '~/layers/events/app/composables/useTableStateEvents';
import { useTableFilterEvents } from '~/layers/events/app/composables/useTableFilterEvents';
import { useGetEvents } from '~/layers/events/app/composables/useGetEvents';

const expanded = ref<Event[]>([]);

// Use CRUD composable
const crud = useTableStateEvents();

// Use existing table filter and data
const { queryParams, state } = useTableFilterEvents();
const { data } = useGetEvents(queryParams);

// Merge local rows with server data
const tableData = computed(() => ({
  meta: data.value?.meta,
  links: data.value?.links,
  data: [...crud.localRows.value, ...(data.value?.data || [])],
}));

// Create CRUD columns
const eventColumns = createEventColumns(crud, expanded);

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
    v-model:expanded="expanded"
    :data="tableData"
    :columns="eventColumns"
    :column-ids="['select', 'expand', 'title', 'category', 'status', 'isVirtual', 'location', 'startDate', 'endDate', 'maxAttendees', 'actions']"
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
