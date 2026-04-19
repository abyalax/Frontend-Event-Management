<script setup lang="ts">
defineProps<{ checked: boolean }>();
defineEmits<{ 'update:checked': [value: boolean] }>();
</script>

<template>
  <input
    type="checkbox"
    :checked="checked"
    class="rounded border-gray-300"
    @change="$emit('update:checked', ($event.target as HTMLInputElement).checked)"
  />
</template>
