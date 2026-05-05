<script setup lang="ts">
import { Tag } from 'lucide-vue-next';
import type { TopCategory } from '../types';

import { Skeleton } from '~/layers/shared/app/components/ui/skeleton';
import { Badge } from '~/layers/shared/app/components/ui/badge';

interface Props {
  data?: TopCategory[];
  pending?: boolean;
  error?: unknown;
}

defineProps<Props>();

const formatCurrency = (value: string) => {
  const num = Number.parseFloat(value);
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

const getRankVariant = (index: number) => {
  const variants: Array<'default' | 'secondary' | 'destructive' | 'outline'> = ['default', 'secondary', 'destructive', 'outline', 'secondary'];
  return variants[index] || 'secondary';
};

const getPercentage = (value: string, maxValue: string) => {
  const num = Number.parseFloat(value);
  const max = Number.parseFloat(maxValue);
  return max > 0 ? (num / max) * 100 : 0;
};
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
      <h3 class="text-sm font-medium">Top Categories</h3>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        <Badge variant="secondary" class="text-xs">Live</Badge>
      </div>
    </div>

    <div class="p-6 pt-2">
      <div v-if="pending" class="space-y-3">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between space-x-3">
          <div class="flex items-center space-x-3">
            <Skeleton class="h-8 w-8 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-32" />
              <Skeleton class="h-3 w-16" />
            </div>
          </div>
          <div class="space-y-2 text-right">
            <Skeleton class="h-4 w-24 ml-auto" />
            <Skeleton class="h-2 w-20 ml-auto" />
          </div>
        </div>
      </div>

      <div v-else-if="error" class="flex flex-col items-center justify-center py-6 text-center">
        <div class="text-destructive text-sm">Failed to load top categories data</div>
      </div>

      <div v-else-if="data && data.length > 0" class="space-y-3">
        <div
          v-for="(category, index) in data.slice(0, 5)"
          :key="category.category_id"
          class="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <div class="flex items-center space-x-3">
            <Badge :variant="getRankVariant(index)" class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
              {{ index + 1 }}
            </Badge>
            <div class="space-y-1">
              <p class="font-medium text-sm truncate max-w-xs">
                {{ category.category_name }}
              </p>
              <p class="text-xs text-muted-foreground">{{ formatNumber(category.totalorders) }} orders</p>
            </div>
          </div>
          <div class="text-right space-y-1">
            <p class="font-semibold text-sm text-green-600">
              {{ formatCurrency(category.totalsales) }}
            </p>
            <div class="w-full bg-secondary rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-300"
                :style="{ width: getPercentage(category.totalsales, data[0]?.totalsales ?? '0') + '%' }"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-8 text-center">
        <Tag class="h-12 w-12 text-muted-foreground mb-3" />
        <p class="text-sm text-muted-foreground">No categories data available</p>
      </div>
    </div>
  </div>
</template>
