<script setup lang="ts">
import { RotateCcw, CalendarDays } from 'lucide-vue-next';
import type { DateRange, DateValue } from 'reka-ui';

import { Button } from '~/layers/shared/app/components/ui/button';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import { Label } from '~/layers/shared/app/components/ui/label';
import { RangeCalendar } from '~/layers/shared/app/components/ui/range-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/layers/shared/app/components/ui/popover';
import { toDate } from 'reka-ui/date';

const { queryDashboard } = useQueryDashboard();

const rangeCalendar = ref<DateRange | undefined>(undefined);
const handleRangeSelect = (range: { start?: DateValue; end?: DateValue } | undefined) => {
  if (!range) {
    queryDashboard.startDate = undefined;
    queryDashboard.endDate = undefined;
    return;
  }

  if (range?.start) queryDashboard.startDate = range.start.toString();
  if (range?.end) queryDashboard.endDate = range.end.toString();
  if (!range?.start && !range?.end) {
    queryDashboard.startDate = undefined;
    queryDashboard.endDate = undefined;
  }
};

// Format dates for display
const formatDisplayDate = (date: DateValue | undefined) => {
  if (!date) return '';
  try {
    const dateObj = toDate(date);
    return dateObj.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
};

const formatDisplayRange = (rangeRefs?: DateRange | undefined) => {
  const range = unref(rangeRefs);
  if (!range) return 'Select date range';
  if (!range.start && !range.end) return 'Select date range';
  if (range.start && !range.end) return `From ${formatDisplayDate(range.start)}`;
  if (!range.start && range.end) return `Until ${formatDisplayDate(range.end)}`;
  if (range.start && range.end) return `${formatDisplayDate(range.start)} - ${formatDisplayDate(range.end)}`;
  return 'Select date range';
};

const datePresets = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 3 Months', days: 90 },
  { label: 'Last 6 Months', days: 180 },
  { label: 'Last Year', days: 365 },
];

const resetFilter = () => {
  queryDashboard.startDate = undefined;
  queryDashboard.endDate = undefined;
};

const applyPreset = (preset: { days: number }) => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - preset.days);

  queryDashboard.startDate = start.toISOString().split('T')[0];
  queryDashboard.endDate = end.toISOString().split('T')[0];
};

const isActivePreset = (preset: { days: number }) => {
  if (!queryDashboard.startDate || !queryDashboard.endDate) return false;

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - preset.days);

  const presetStart = start.toISOString().split('T')[0];
  const presetEnd = end.toISOString().split('T')[0];

  return queryDashboard.startDate === presetStart && queryDashboard.endDate === presetEnd;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="rounded-lg border bg-card text-card-foreground shadow-sm">
    <div class="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
      <h3 class="text-sm font-medium">Date Range Filter</h3>
      <Button variant="ghost" size="sm" @click="resetFilter">
        <RotateCcw class="h-4 w-4 mr-2" />
        Reset
      </Button>
    </div>

    <div class="p-6 pt-2 space-y-6">
      <!-- Range Calendar Picker -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Date Range Picker</Label>
        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline" class="w-full justify-start text-left font-normal">
              <CalendarDays class="mr-2 h-4 w-4" />
              {{ formatDisplayRange(rangeCalendar as DateRange) }}
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0" align="start">
            <RangeCalendar initial-focus @update:model-value="handleRangeSelect" />
          </PopoverContent>
        </Popover>
      </div>

      <!-- Quick Presets -->
      <div class="space-y-2">
        <Label class="text-sm font-medium">Quick Presets</Label>
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="preset in datePresets"
            :key="preset.label"
            :variant="isActivePreset(preset) ? 'default' : 'outline'"
            size="sm"
            @click="applyPreset(preset)"
          >
            {{ preset.label }}
          </Button>
        </div>
      </div>

      <!-- Current Selection Display -->
      <div>
        <Badge variant="secondary" class="text-xs">
          <span v-if="queryDashboard.startDate && queryDashboard.endDate">
            Showing data from {{ formatDate(queryDashboard.startDate) }} to {{ formatDate(queryDashboard.endDate) }}
          </span>
          <span v-else>Showing all data</span>
        </Badge>
      </div>
    </div>
  </div>
</template>
