<script setup lang="ts">
import { Eye } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { useDeleteEvent } from '../composables/useDeleteEvent';
import type { Event } from '../types';

const props = defineProps<Event>();

const { mutate: deleteEvent } = useDeleteEvent();

const handleDelete = () => deleteEvent([props.id]);

// This will be used to toggle expansion from the ActionsCell
// The actual expansion logic is handled by the parent table component
const emit = defineEmits<{
  toggleExpand: [event: Event];
}>();

const handleToggleExpand = () => {
  emit('toggleExpand', props);
};
</script>

<template>
  <div class="flex gap-2">
    <Button variant="outline" size="sm" @click="handleToggleExpand">
      <Eye class="h-4 w-4" />
    </Button>
    <Button variant="outline" size="sm">Edit</Button>
    <Button variant="destructive" size="sm" @click="handleDelete">Delete</Button>
  </div>
</template>
