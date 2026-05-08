<script setup lang="ts">
import { ref, computed } from 'vue';
import type { DateValue } from 'reka-ui';
import { Calendar } from '~/layers/shared/app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '~/layers/shared/app/components/ui/popover';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import { cn } from '~/layers/shared/app/lib/utils';
import { formatDate } from '~/layers/shared/app/utils/formatter';
import { CalendarDate } from '@internationalized/date';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Select date',
  class: '',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string];
}>();

const isOpen = ref(false);

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder;
  return formatDate(props.modelValue);
});

const calendarValue = computed(() => {
  if (!props.modelValue) return undefined;
  // Convert string to CalendarDate for Calendar component
  const date = new Date(props.modelValue);
  return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
});

const handleDateSelect = (date: DateValue | undefined) => {
  if (!date) return;

  // Convert DateValue to native Date for ISO string conversion
  const nativeDate = new Date(date.toString());
  const isoString = nativeDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM format

  emit('update:modelValue', isoString);
  emit('change', isoString);
  isOpen.value = false;
};

const handleClear = (e: MouseEvent) => {
  e.stopPropagation();
  emit('update:modelValue', '');
  emit('change', '');
  isOpen.value = false;
};

const handleButtonClick = (e: MouseEvent) => {
  e.stopPropagation();
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="cn('w-full justify-start text-left font-normal h-8', !modelValue && 'text-muted-foreground', props.class)"
        :disabled="disabled"
        @click="handleButtonClick"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ displayValue }}
        <Button v-if="modelValue" variant="ghost" size="sm" class="ml-auto h-6 w-6 p-0" @click="handleClear"> × </Button>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar initial-focus :model-value="calendarValue" @update:model-value="handleDateSelect" />
    </PopoverContent>
  </Popover>
</template>
