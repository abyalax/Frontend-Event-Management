<script setup lang="ts">
import { CalendarDays, MapPin, Search, Sparkles, Users } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Input } from '~/layers/shared/app/components/ui/input';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import { useTableFilter } from '~/layers/shared/app/composable/table/filters/useTableFilter';
import { formatDate } from '~/layers/shared/app/utils/formatter';

import { computed } from 'vue';
import { navigateTo } from 'nuxt/app';
import type { EventPublic } from '../../types';

const { state, search, queryParams } = useTableFilter({
  debounceSearch: 500,
  debounceFilters: 300,
});

const { data, isPending } = useGetPublicEvents(queryParams);

const events = computed<EventPublic[]>(() => data.value?.data ?? []);
const meta = computed(() => data.value?.meta);
const totalItems = computed(() => meta.value?.totalItems ?? events.value.length);

const featuredEvent = computed(() => events.value[0]);

const openEventDetail = (event: EventPublic) => {
  return navigateTo(`/public-events/${event.id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement | null;
  if (img) img.style.display = 'none';
};
</script>

<template>
  <!-- Main Wrapper: Menggunakan background dan foreground global -->
  <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
    <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">
      <!-- Hero Section: Menggunakan Card tokens & Primary colors -->
      <section class="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl md:p-10">
        <!-- Overlay: Disesuaikan agar tetap cantik di light/dark mode -->
        <div
          class="absolute inset-0 opacity-50 dark:opacity-100 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_40%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_35%)]"
        />

        <div class="relative grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <div class="space-y-4">
            <!-- Badge: Menggunakan token primary/secondary -->
            <Badge variant="outline" class="border-primary/20 bg-primary/10 text-primary">
              <Sparkles class="mr-2 size-3.5" />
              Events tersedia untuk publik
            </Badge>

            <div class="space-y-3">
              <h1 class="text-4xl font-semibold tracking-tight text-card-foreground md:text-5xl">
                Temukan event yang sedang tayang dan siap diikuti.
              </h1>
              <p class="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                Jelajahi event publik yang sudah dipublish, cari berdasarkan judul atau deskripsi, dan lihat jadwal serta lokasi tanpa perlu login.
              </p>
            </div>

            <div class="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                <Users class="size-4 text-primary" />
                {{ totalItems }} event dipublikasikan
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-2">
                <CalendarDays class="size-4 text-primary" />
                Update realtime
              </div>
            </div>
          </div>

          <!-- Featured Card: Menggunakan Secondary background -->
          <div class="relative rounded-2xl border border-border bg-secondary/30 p-5 backdrop-blur-sm">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">Highlighted</p>
              <h2 class="text-xl font-semibold text-card-foreground">
                {{ featuredEvent?.title ?? 'Belum ada event publik' }}
              </h2>
              <p class="text-sm text-muted-foreground">
                {{ featuredEvent?.description ?? 'Begitu event dipublish, kartu highlight akan muncul di sini.' }}
              </p>
            </div>
            <dl class="mt-5 grid gap-3 text-sm">
              <div
                v-for="label in ['Kategori', 'Lokasi', 'Jadwal']"
                :key="label"
                class="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/50 px-3 py-2"
              >
                <dt class="text-muted-foreground">{{ label }}</dt>
                <dd class="font-medium text-foreground">
                  <template v-if="label === 'Kategori'">{{ featuredEvent?.category?.name ?? '-' }}</template>
                  <template v-else-if="label === 'Lokasi'">{{ featuredEvent?.location ?? '-' }}</template>
                  <template v-else>{{ formatDate(featuredEvent?.startDate) }}</template>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- Filter Section -->
      <section class="space-y-5">
        <div class="flex flex-col gap-3 rounded-2xl border border-border bg-card/50 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div class="relative w-full md:max-w-xl">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input v-model="search" placeholder="Cari event publik..." class="border-border bg-background pl-10 focus-visible:ring-primary" />
          </div>

          <div class="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Page</span>
            <span class="rounded-md border border-border bg-background px-2 py-1 text-foreground font-medium">{{ state.page }}</span>
            <span>of</span>
            <span class="rounded-md border border-border bg-background px-2 py-1 text-foreground font-medium">{{ meta?.totalPages ?? 1 }}</span>
          </div>
        </div>

        <!-- Grid Content -->
        <div v-if="isPending" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 6" :key="index" class="h-80 animate-pulse rounded-2xl border border-border bg-muted" />
        </div>

        <div v-else-if="events.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="event in events"
            :key="event.id"
            class="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
          >
            <!-- Banner -->
            <div class="relative h-48 overflow-hidden bg-muted">
              <img
                v-if="event.bannerUrl"
                :src="event.bannerUrl"
                :alt="event.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="handleImageError"
              />
              <div v-else class="flex h-full items-center justify-center bg-linear-to-br from-muted to-secondary">
                <div class="text-center p-4">
                  <div class="text-sm font-semibold">{{ event.title }}</div>
                </div>
              </div>
              <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <StatusBadge :status="event.status" />
                <Badge variant="secondary" class="bg-background/80 backdrop-blur-sm">
                  {{ event.isVirtual ? 'Virtual' : 'Offline' }}
                </Badge>
              </div>
            </div>

            <!-- Content -->
            <div class="space-y-4 p-5">
              <div class="space-y-2">
                <h3 class="line-clamp-2 text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {{ event.title }}
                </h3>
                <p class="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {{ event.description ?? 'Tidak ada deskripsi untuk event ini.' }}
                </p>
              </div>

              <div class="grid gap-3 text-sm">
                <div class="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays class="size-4 text-primary" />
                  <span>{{ formatDate(event.startDate) }}</span>
                </div>
                <div class="flex items-center gap-2 text-muted-foreground">
                  <MapPin class="size-4 text-primary" />
                  <span class="line-clamp-1">{{ event.location }}</span>
                </div>
                <div class="rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                  Kategori: <span class="font-medium text-foreground">{{ event.category?.name ?? '-' }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-4">
                <span>{{ event.maxAttendees ? `${event.maxAttendees} peserta` : 'Kapasitas fleksibel' }}</span>
                <Button size="sm" variant="outline" class="h-8" @click="openEventDetail(event)">Detail</Button>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center text-muted-foreground">
          Tidak ada event publik yang cocok.
        </div>

        <!-- Pagination -->
        <div class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm md:flex-row">
          <div class="text-muted-foreground">
            Menampilkan <span class="font-medium text-foreground">{{ events.length }}</span> dari
            <span class="font-medium text-foreground">{{ totalItems }}</span> event.
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" :disabled="state.page <= 1" @click="state.page--"> Previous </Button>
            <Button variant="outline" size="sm" :disabled="state.page >= (meta?.totalPages ?? 1)" @click="state.page++"> Next </Button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
