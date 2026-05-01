<script setup lang="ts">
import { ArrowLeft, CalendarDays, ExternalLink, MapPin, Ticket, CreditCard, Users } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import type { Event as PublicEvent } from '../../../types/index';

const route = useRoute();
const eventId = computed(() => String(route.params.id ?? ''));
const { data, isPending } = useGetPublicEvent(eventId);
const cachedEvent = computed<PublicEvent | undefined>(() => data.value ?? undefined);

const formatDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(date);
};

const goBack = () => navigateTo('/publics/events');

const openCreateOrder = () => {
  return navigateTo({ path: '/orders/create', query: { eventId: eventId.value } });
};

const continuePaymentTicket = () => {
  return navigateTo({ path: '/payments/continue', query: { eventId: eventId.value } });
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <div class="flex items-center justify-between gap-4">
        <Button variant="ghost" class="text-slate-200 hover:bg-white/5 hover:text-white" @click="goBack">
          <ArrowLeft class="mr-2 size-4" />
          Back to Events
        </Button>
        <Badge variant="outline" class="border-white/10 bg-white/5 text-slate-200"> Public detail </Badge>
      </div>

      <section v-if="isPending" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="h-155 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        <div class="h-155 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </section>

      <section v-else-if="cachedEvent" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 shadow-2xl">
          <div class="relative h-80 bg-slate-800 md:h-115">
            <img v-if="cachedEvent.bannerUrl" :src="cachedEvent.bannerUrl" :alt="cachedEvent.title" class="h-full w-full object-cover" />
            <div v-else class="flex h-full items-center justify-center bg-linear-to-br from-slate-800 via-slate-800 to-sky-900/50">
              <div class="text-center">
                <div class="text-2xl font-semibold text-white">{{ cachedEvent.title }}</div>
                <div class="mt-2 text-sm text-slate-400">Banner belum tersedia</div>
              </div>
            </div>

            <div class="absolute left-4 top-4 flex flex-wrap gap-2">
              <StatusBadge :status="cachedEvent.status" />
              <Badge variant="secondary" class="bg-black/40 text-slate-100 backdrop-blur">
                {{ cachedEvent.isVirtual ? 'Virtual' : 'Offline' }}
              </Badge>
            </div>
          </div>

          <div class="space-y-5 p-6 md:p-8">
            <div class="space-y-3">
              <h1 class="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {{ cachedEvent.title }}
              </h1>
              <p class="text-sm leading-6 text-slate-300 md:text-base">
                {{ cachedEvent.description ?? 'Tidak ada deskripsi untuk event ini.' }}
              </p>
            </div>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <CalendarDays class="size-4 text-sky-300" />
                  Jadwal
                </div>
                <div class="text-sm font-medium text-white">{{ formatDate(cachedEvent.startDate) }}</div>
                <div class="mt-1 text-xs text-slate-400">Sampai {{ formatDate(cachedEvent.endDate) }}</div>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <MapPin class="size-4 text-sky-300" />
                  Lokasi
                </div>
                <div class="text-sm font-medium text-white">{{ cachedEvent.location }}</div>
                <div class="mt-1 text-xs text-slate-400">{{ cachedEvent.category?.name ?? 'Tanpa kategori' }}</div>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Users class="size-4 text-sky-300" />
                  Kapasitas
                </div>
                <div class="text-sm font-medium text-white">
                  {{ cachedEvent.maxAttendees ? `${cachedEvent.maxAttendees} peserta` : 'Tidak dibatasi' }}
                </div>
                <div class="mt-1 text-xs text-slate-400">{{ cachedEvent.isVirtual ? 'Mode virtual' : 'Event offline' }}</div>
              </div>

              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-slate-400">
                  <Ticket class="size-4 text-sky-300" />
                  Event ID
                </div>
                <div class="break-all text-sm font-medium text-white">{{ cachedEvent.id }}</div>
                <div class="mt-1 text-xs text-slate-400">Created by {{ cachedEvent.createdBy }}</div>
              </div>
            </div>

            <div class="grid gap-3 md:grid-cols-3">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-slate-400">Category ID</div>
                <div class="mt-2 text-sm font-medium text-white">{{ cachedEvent.categoryId || '-' }}</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-slate-400">Created At</div>
                <div class="mt-2 text-sm font-medium text-white">{{ formatDate(cachedEvent.createdAt) }}</div>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div class="text-xs uppercase tracking-[0.2em] text-slate-400">Updated At</div>
                <div class="mt-2 text-sm font-medium text-white">{{ formatDate(cachedEvent.updatedAt) }}</div>
              </div>
            </div>
          </div>
        </div>

        <aside class="space-y-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Actions</p>
            <h2 class="text-xl font-semibold text-white">Lanjutkan ke transaksi</h2>
            <p class="text-sm leading-6 text-slate-300">Gunakan tombol berikut untuk masuk ke flow order dan pembayaran tiket.</p>
          </div>

          <div class="space-y-3">
            <Button class="w-full justify-start" @click="openCreateOrder">
              <CreditCard class="mr-2 size-4" />
              Create Order
            </Button>

            <Button
              variant="outline"
              class="w-full justify-start border-white/10 bg-white/5 text-white hover:bg-white/10"
              @click="continuePaymentTicket"
            >
              <ExternalLink class="mr-2 size-4" />
              Continue Payment Ticket
            </Button>
          </div>

          <div class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <p class="font-medium text-white">Banner</p>
            <p class="mt-2 break-all text-xs text-slate-400">
              {{ cachedEvent.bannerUrl ?? 'Banner belum tersedia untuk event ini.' }}
            </p>
          </div>
        </aside>
      </section>

      <section v-else class="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
        <h1 class="text-2xl font-semibold text-white">Event tidak ditemukan</h1>
        <p class="mt-2 text-sm text-slate-300">Data event ini tidak ditemukan dari endpoint publik.</p>
        <div class="mt-6 flex justify-center">
          <Button @click="goBack">Back to Events</Button>
        </div>
      </section>
    </div>
  </div>
</template>
