<script setup lang="ts">
import { RotateCcw, CalendarDays, Filter } from 'lucide-vue-next';
import type { DateRange, DateValue } from 'reka-ui';

import { Button } from '~/layers/shared/app/components/ui/button';
import { RangeCalendar } from '~/layers/shared/app/components/ui/range-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/layers/shared/app/components/ui/popover';
import { toDate } from 'reka-ui/date';

const { queryDashboard } = useQueryDashboard();

const rangeCalendar = ref<DateRange>();
const handleRangeSelect = (range: DateRange) => {
  // Update the rangeCalendar ref first
  rangeCalendar.value = range;

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

const formatDisplayRange = (rangeRefs?: DateRange) => {
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
  <div class="flex justify-start">
    <Popover>
      <PopoverTrigger as-child>
        <Button variant="secondary" class="gap-2 shadow-sm border-dashed">
          <Filter class="h-4 w-4" />
          <span>Filters</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" :side-offset="8" class="w-80 p-0 shadow-xl border-border/50">
        <!-- Header minimalis -->
        <div class="flex items-center justify-between border-b px-4 py-2.5 bg-muted/30">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground"> Date Range Filter </span>
          <Button variant="ghost" size="sm" class="h-7 px-2 text-[11px] text-muted-foreground hover:text-destructive" @click="resetFilter">
            <RotateCcw class="h-3 w-3 mr-1" />
            Reset
          </Button>
        </div>

        <div class="p-4 space-y-5">
          <!-- Range Picker Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-xs font-medium text-foreground/70">
              <CalendarDays class="h-3.5 w-3.5" />
              <span>Select Period</span>
            </div>

            <Popover>
              <PopoverTrigger as-child>
                <Button variant="outline" size="sm" class="inline-flex w-auto max-w-full justify-start text-left font-normal bg-background px-3">
                  <span class="truncate whitespace-nowrap">
                    {{ formatDisplayRange(rangeCalendar) }}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0" align="start" :side-offset="8">
                <RangeCalendar initial-focus @update:model-value="handleRangeSelect" />
              </PopoverContent>
            </Popover>
          </div>

          <!-- Quick Presets -->
          <div class="space-y-2">
            <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-tight"> Quick Selection </span>
            <div class="flex flex-wrap gap-1.5">
              <Button
                v-for="preset in datePresets"
                :key="preset.label"
                :variant="isActivePreset(preset) ? 'default' : 'secondary'"
                class="h-7 text-[11px] px-2.5 py-0 rounded-md"
                @click="applyPreset(preset)"
              >
                {{ preset.label }}
              </Button>
            </div>
          </div>

          <!-- Selection Summary -->
          <div class="rounded-md bg-muted/50 p-2 border border-border/20">
            <p class="text-[10px] text-muted-foreground text-center leading-relaxed">
              <template v-if="queryDashboard.startDate && queryDashboard.endDate">
                Showing data from <br />
                <span class="font-medium text-foreground">{{ formatDate(queryDashboard.startDate) }}</span>
                to
                <span class="font-medium text-foreground">{{ formatDate(queryDashboard.endDate) }}</span>
              </template>
              <template v-else> Showing all available data </template>
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>
