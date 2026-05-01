<script setup lang="ts">
import { PERMISSIONS } from '~/layers/shared/app/common/const/permission';
import Page from '~~/layers/shared/app/components/layouts/Page.vue';

definePageMeta({
  middleware: 'authorization',
  requiresAuth: true,
  requiresPermissions: [PERMISSIONS.EVENT.READ],
});

const breadcrumbs = [
  {
    title: 'Home',
    url: '/events',
    active: false,
  },
];
</script>

<template>
  <Page title="Events" :breadcrumbs="breadcrumbs">
    <template #children>
      <TableEvents />
    </template>
  </Page>
</template>
