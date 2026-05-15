<script setup lang="ts">
import { Table, type TableFacetedFilter } from '~/layers/shared/app/components/fragments/table';
import { useGetUserOrders } from '~/layers/orders/app/composables/useGetUserOrders';
import { useTableFilterOrders } from '~/layers/orders/app/composables/useTableFilterOrders';
import { useOrderColumns } from '~/layers/orders/app/composables/useOrderColumns';
import type { Order } from '../types';
import RowOrderDetail from './RowOrderDetail.vue';

const selected = ref<Order[]>([]);
const expanded = ref<Order[]>([]);

const { state, queryParams } = useTableFilterOrders();
const { data } = useGetUserOrders(queryParams);
const { redirectToPayment } = usePaymentReturn();
const { $toast } = useNuxtApp();

const payingOrderId = ref<string | null>(null);

const continuePayment = async (order: Order) => {
  try {
    payingOrderId.value = order.id;
    await redirectToPayment(order);
  } catch (error) {
    $toast.warning(error instanceof Error ? error.message : 'Failed to continue payment');
  } finally {
    payingOrderId.value = null;
  }
};

const downloadTicket = (pdfUrl?: string) => {
  if (pdfUrl) window.open(pdfUrl, '_blank');
};

const orderColumns = useOrderColumns({ continuePayment, downloadTicket, payingOrderId, expanded });

const facetedFilters: TableFacetedFilter<Order>[] = [
  {
    columnId: 'status',
    title: 'Status',
    options: [
      { label: 'Pending', value: 'PENDING' },
      { label: 'Paid', value: 'PAID' },
      { label: 'Expired', value: 'EXPIRED' },
      { label: 'Cancelled', value: 'CANCELLED' },
    ],
  },
];

const handleExpandedRow = (order: Order) =>
  h(RowOrderDetail, {
    order: order,
  });
</script>

<template>
  <Table
    v-model:filter="state"
    v-model:selected="selected"
    v-model:expanded="expanded"
    :data="data"
    :columns="orderColumns"
    :column-ids="['select', 'expand', 'id', 'createdAt', 'totalAmount', 'status', 'items', 'actions']"
    :faceted-filter="facetedFilters"
    :expanded-row="handleExpandedRow"
    :initial-column-visibility="{
      select: true,
      expand: true,
      id: true,
      createdAt: true,
      totalAmount: true,
      status: true,
      items: true,
      actions: true,
    }"
    :pagination="true"
  />
</template>
