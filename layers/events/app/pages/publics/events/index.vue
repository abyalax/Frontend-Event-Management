<script setup lang="ts">
import { CalendarDays, MapPin, Search, Sparkles, Users } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Input } from '~/layers/shared/app/components/ui/input';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import { useTableFilter } from '~/layers/shared/app/composable/filters/useTableFilter';
import StatusBadge from '../../../components/StatusBadge.vue';
import { useGetPublicEvents } from '../../../composables/useGetPublicEvents';
import type { Event as PublicEvent } from '../../../types';

const { state, search, queryParams } = useTableFilter({
  debounceSearch: 500,
  debounceFilters: 300,
});

const { data, isPending } = useGetPublicEvents(queryParams);

const events = computed<PublicEvent[]>(() => data.value?.data ?? []);
const meta = computed(() => data.value?.meta);
const totalItems = computed(() => meta.value?.totalItems ?? events.value.length);

const formatDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

const featuredEvent = computed(() => events.value[0]);

const openEventDetail = (event: PublicEvent) => {
  return navigateTo(`/publics/events/${event.id}`);
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement | null;
  if (img) img.style.display = 'none';
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 md:px-8">
      <section
        class="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-6 shadow-2xl md:p-10"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]"
        />
        <div class="relative grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-end">
          <div class="space-y-4">
            <Badge variant="outline" class="border-sky-400/30 bg-sky-400/10 text-sky-200">
              <Sparkles class="mr-2 size-3.5" />
              Events tersedia untuk publik
            </Badge>

            <div class="space-y-3">
              <h1 class="text-4xl font-semibold tracking-tight text-white md:text-5xl">Temukan event yang sedang tayang dan siap diikuti.</h1>
              <p class="max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Jelajahi event publik yang sudah dipublish, cari berdasarkan judul atau deskripsi, dan lihat jadwal serta lokasi tanpa perlu login.
              </p>
            </div>

            <div class="flex flex-wrap gap-3 text-sm text-slate-300">
              <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <Users class="size-4 text-sky-300" />
                {{ totalItems }} event dipublikasikan
              </div>
              <div class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
                <CalendarDays class="size-4 text-sky-300" />
                Update realtime dari endpoint `/events/public`
              </div>
            </div>
          </div>

          <div class="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div class="space-y-2">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Highlighted</p>
              <h2 class="text-xl font-semibold text-white">
                {{ featuredEvent?.title ?? 'Belum ada event publik' }}
              </h2>
              <p class="text-sm text-slate-300">
                {{ featuredEvent?.description ?? 'Begitu event dipublish, kartu highlight akan muncul di sini.' }}
              </p>
            </div>
            <dl class="mt-5 grid gap-3 text-sm">
              <div class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <dt class="text-slate-400">Kategori</dt>
                <dd class="font-medium text-white">{{ featuredEvent?.category?.name ?? '-' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <dt class="text-slate-400">Lokasi</dt>
                <dd class="font-medium text-white">{{ featuredEvent?.location ?? '-' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                <dt class="text-slate-400">Jadwal</dt>
                <dd class="font-medium text-white">{{ formatDate(featuredEvent?.startDate) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section class="space-y-5">
        <div
          class="flex flex-col gap-3 rounded-2xl border border-slate-200/10 bg-slate-900/50 p-4 backdrop-blur md:flex-row md:items-center md:justify-between"
        >
          <div class="relative w-full md:max-w-xl">
            <Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              v-model="search"
              placeholder="Cari event publik..."
              class="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-400"
            />
          </div>

          <div class="flex items-center gap-2 text-sm text-slate-400">
            <span>Page</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">{{ state.page }}</span>
            <span>of</span>
            <span class="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-slate-200">{{ meta?.totalPages ?? 1 }}</span>
          </div>
        </div>

        <div v-if="isPending" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="index in 6" :key="index" class="h-80 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
        </div>

        <div v-else-if="events.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="event in events"
            :key="event.id"
            class="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:border-sky-400/30"
          >
            <div class="relative h-48 overflow-hidden bg-slate-800">
              <img
                v-if="event.bannerUrl"
                :src="event.bannerUrl"
                :alt="event.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="handleImageError"
              />
              <div v-else class="flex h-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-800 to-sky-900/50">
                <div class="text-center">
                  <div class="text-lg font-semibold text-white">{{ event.title }}</div>
                  <div class="mt-1 text-xs text-slate-400">No banner image</div>
                </div>
              </div>
              <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <StatusBadge :status="event.status" />
                <Badge variant="secondary" class="bg-black/40 text-slate-100 backdrop-blur">
                  {{ event.isVirtual ? 'Virtual' : 'Offline' }}
                </Badge>
              </div>
            </div>

            <div class="space-y-4 p-5">
              <div class="space-y-2">
                <h3 class="line-clamp-2 text-lg font-semibold text-white">{{ event.title }}</h3>
                <p class="line-clamp-3 text-sm leading-6 text-slate-300">
                  {{ event.description ?? 'Tidak ada deskripsi untuk event ini.' }}
                </p>
              </div>

              <div class="grid gap-3 text-sm text-slate-300">
                <div class="flex items-center gap-2">
                  <CalendarDays class="size-4 text-sky-300" />
                  <span>{{ formatDate(event.startDate) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <MapPin class="size-4 text-sky-300" />
                  <span class="line-clamp-1">{{ event.location }}</span>
                </div>
                <div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-400">
                  Kategori: <span class="font-medium text-slate-100">{{ event.category?.name ?? '-' }}</span>
                </div>
              </div>

              <div class="flex items-center justify-between text-xs text-slate-400">
                <span>{{ event.maxAttendees ? `Max ${event.maxAttendees} peserta` : 'Kapasitas fleksibel' }}</span>
                <span>{{ event.createdAt ? formatDate(event.createdAt) : '' }}</span>
              </div>

              <div class="flex gap-2 pt-1">
                <Button class="flex-1" variant="secondary" @click="openEventDetail(event)"> Detail </Button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
          Tidak ada event publik yang cocok dengan pencarian saat ini.
        </div>

        <div
          class="flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-300 md:flex-row"
        >
          <div>Menampilkan {{ events.length }} event dari {{ totalItems }} hasil publik.</div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              class="border-white/10 bg-white/5 text-white hover:bg-white/10"
              :disabled="state.page <= 1"
              @click="state.page = Math.max(1, state.page - 1)"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              class="border-white/10 bg-white/5 text-white hover:bg-white/10"
              :disabled="state.page >= (meta?.totalPages ?? 1)"
              @click="state.page = Math.min(meta?.totalPages ?? 1, state.page + 1)"
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
