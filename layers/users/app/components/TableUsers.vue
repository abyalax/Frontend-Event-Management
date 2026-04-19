<script setup lang="ts">
import { DownloadIcon, TrashIcon } from 'lucide-vue-next';
import { h } from 'vue';
import { toast } from 'vue-sonner';
import { Table } from '~/layers/shared/app/components/fragments/table';
import type { BulkAction, TableFacetedFilter } from '~~/layers/shared/app/components/fragments/table';
import { useGetUsers } from '../composables/useGetUsers';
import type { User } from '../types';

const { queryParams, state } = useTableFilterUsers();

const { data } = useGetUsers(queryParams);

const bulkActions: BulkAction<User>[] = [
  {
    label: 'Delete Selected',
    icon: TrashIcon,
    onClick: (selectedRows) => {
      toast.info(`Delete data ${selectedRows[0]?.name}`);
    },
  },
  {
    label: 'Export Selected',
    icon: DownloadIcon,
    onClick: (selectedRows) => {
      toast.info(`Export data ${selectedRows[0]?.name}`);
    },
  },
];

const facetedFilters: TableFacetedFilter<User>[] = [
  {
    columnId: 'roles',
    title: 'Roles',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' },
      { label: 'Moderator', value: 'moderator' },
    ],
  },
];

const handleRowClick = (user: User, event?: MouseEvent) => {
  event?.stopPropagation();
  console.info('Row clicked:', user, event);
};

const handleExpandedRow = (user: User) => {
  return h('div', { class: 'p-4 bg-gray-50' }, [
    h('h3', { class: 'font-semibold mb-2' }, `Details for ${user.name}`),
    h('p', { class: 'text-sm text-gray-600' }, `Email: ${user.email}`),
    h('p', { class: 'text-sm text-gray-600' }, `Roles: ${user.roles.map((role) => role.name).join(', ')}`),
  ]);
};
</script>

<template>
  <Table
    v-model="state"
    :data="data"
    :columns="userColumns"
    :column-ids="['select', 'name', 'email', 'roles', 'actions']"
    :bulk-actions="bulkActions"
    :faceted-filter="facetedFilters"
    :on-click-row="handleRowClick"
    :expanded-row="handleExpandedRow"
    :initial-column-visibility="{
      select: true,
      name: true,
      email: true,
      roles: true,
    }"
    :pagination="true"
  />
</template>
