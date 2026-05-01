<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { ChevronDown, ChevronRight } from 'lucide-vue-next';

interface Props {
  expanded: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  toggle: [];
}>();

const localExpanded = ref(props.expanded);

const isExpanded = computed(() => localExpanded.value);

// Watch for prop changes and update local state
watch(
  () => props.expanded,
  (newValue) => {
    localExpanded.value = newValue;
  }
);

const handleClick = (e: MouseEvent) => {
  e.stopPropagation();
  emit('toggle');
};
</script>

<template>
  <button class="p-1 hover:bg-muted rounded transition-colors" @click="handleClick">
    <ChevronRight v-if="!isExpanded" class="h-4 w-4" />
    <ChevronDown v-else class="h-4 w-4" />
  </button>
</template>
