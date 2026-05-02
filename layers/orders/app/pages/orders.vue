<script setup lang="ts">
import { PERMISSIONS } from '~/layers/shared/app/common/const/permission';
import Page from '~/layers/shared/app/components/layouts/Page.vue';
import TableOrders from '~/layers/orders/app/components/TableOrders.vue';

definePageMeta({
  middleware: 'authorization',
  requiresAuth: true,
  requiresPermissions: [PERMISSIONS.ORDER.READ],
});

const breadcrumbs = [
  {
    title: 'Home',
    url: '/orders',
    active: false,
  },
];
</script>

<template>
  <Page title="My Orders" :breadcrumbs="breadcrumbs">
    <template #children>
      <TableOrders />
    </template>
  </Page>
</template>
