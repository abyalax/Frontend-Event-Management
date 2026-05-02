<script setup lang="ts">
import type { Event } from '../types';

interface Props {
  event: Event;
}

defineProps<Props>();
</script>

<template>
  <div class="w-full p-6 bg-card text-card-foreground border-b border-border transition-colors hover:bg-accent/5">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- First column: Main Identity -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-foreground mb-1 leading-none">
            {{ event.title }}
          </h3>
          <p v-if="event.description" class="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {{ event.description }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Mode</span>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
              event.isVirtual
                ? 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-900/50 dark:text-blue-400'
                : 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 dark:text-emerald-400',
            ]"
          >
            {{ event.isVirtual ? 'Virtual' : 'Offline' }}
          </span>
        </div>
      </div>

      <!-- Second column: Context & Resources -->
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <span class="text-xs font-medium text-muted-foreground min-w-17.5">Category</span>
          <span class="text-sm font-medium">{{ event.category?.name ?? '-' }}</span>
        </div>

        <div class="flex items-start gap-3">
          <span class="text-xs font-medium text-muted-foreground min-w-17.5 mt-0.5">Location</span>
          <span class="text-sm text-foreground/80">{{ event.location }}</span>
        </div>

        <div v-if="event.bannerUrl" class="flex items-start gap-3">
          <span class="text-xs font-medium text-muted-foreground min-w-17.5 mt-0.5">Banner</span>
          <a
            :href="event.bannerUrl"
            target="_blank"
            class="text-sm text-primary underline-offset-4 hover:underline break-all transition-all font-medium"
          >
            View Resource
          </a>
        </div>
      </div>

      <!-- Third column: Timing (Styled as a subtle card) -->
      <div class="bg-muted/40 p-4 rounded-xl border border-border/40 space-y-3 flex flex-col justify-center">
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold uppercase text-muted-foreground/80">Start Date</span>
          <span class="text-sm font-mono text-foreground/90">
            {{ event.startDate ? new Date(event.startDate).toLocaleString() : '-' }}
          </span>
        </div>

        <div class="h-px bg-border/50 w-full" />

        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold uppercase text-muted-foreground/80">End Date</span>
          <span class="text-sm font-mono text-foreground/90">
            {{ event.endDate ? new Date(event.endDate).toLocaleString() : '-' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
