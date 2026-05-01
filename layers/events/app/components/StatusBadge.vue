<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const statusClasses: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-800 border-amber-200',
  published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  completed: 'bg-sky-100 text-sky-800 border-sky-200',
};

const normalizedStatus = computed(() => props.status?.toLowerCase?.() ?? '');
const badgeClass = computed(() => statusClasses[normalizedStatus.value] ?? 'bg-slate-100 text-slate-800 border-slate-200');
</script>

<template>
  <span class="inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium capitalize" :class="badgeClass">
    {{ status }}
  </span>
</template>
