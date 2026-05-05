<script setup lang="ts">
import { DollarSign, FileText } from 'lucide-vue-next';
import type { TotalSales } from '../types';

import { Skeleton } from '~/layers/shared/app/components/ui/skeleton';
import { Badge } from '~/layers/shared/app/components/ui/badge';

interface Props {
  data?: TotalSales;
  pending?: boolean;
  error?: unknown;
}

defineProps<Props>();

const formatCurrency = (value: string) => {
  const num = Number.parseFloat(value);
  if (Number.isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatNumber = (value: string) => {
  const num = Number.parseInt(value);
  return new Intl.NumberFormat('id-ID').format(num);
};

const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString('id-ID');
});
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
      <h3 class="text-sm font-medium">Total Sales</h3>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        <Badge variant="secondary" class="text-xs">Live</Badge>
      </div>
    </div>

    <div class="p-6 pt-2">
      <div v-if="pending" class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-8 w-24" />
          </div>
          <div class="space-y-2">
            <Skeleton class="h-4 w-20" />
            <Skeleton class="h-8 w-24" />
          </div>
        </div>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-6 text-center">
        <div class="text-destructive text-sm">Failed to load total sales data</div>
      </div>

      <div v-else-if="data" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center space-x-2">
            <div class="p-2 bg-blue-100 rounded-lg">
              <DollarSign class="h-4 w-4 text-blue-600" />
            </div>
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground">Total Revenue</p>
              <p class="text-xl font-bold text-blue-600">
                {{ formatCurrency(data.totalSales) }}
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div class="p-2 bg-green-100 rounded-lg">
              <FileText class="h-4 w-4 text-green-600" />
            </div>
            <div class="space-y-1">
              <p class="text-xs text-muted-foreground">Total Orders</p>
              <p class="text-xl font-bold text-green-600">
                {{ formatNumber(data.totalOrders) }}
              </p>
            </div>
          </div>
        </div>

        <div class="text-xs text-muted-foreground text-center">Data updated {{ lastUpdated }}</div>
      </div>
    </div>
  </div>
</template>
