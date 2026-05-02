<script setup lang="ts">
import { ArrowLeft, CalendarDays, MapPin, Ticket, CreditCard, Users } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { Badge } from '~/layers/shared/app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/layers/shared/app/components/ui/select';
import { formatDate } from '~/layers/shared/app/utils/formatter';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { navigateTo } from 'nuxt/app';
import StatusBadge from '~/layers/shared/app/components/fragments/badge/StatusBadge.vue';
import { useBuyTicket, type BuyTicketRequest } from '~/layers/publics/app/composables/useBuyTicket';
import type { EventPublic } from '../../types';

const route = useRoute();
const eventId = computed(() => String(route.params.id ?? ''));
const { data, isPending } = useGetPublicEvent(eventId);
const cachedEvent = computed<EventPublic | undefined>(() => data.value ?? undefined);
const { $toast } = useNuxtApp();

// Buy ticket state
const selectedTicketId = ref<string>('');
const ticketQuantity = ref<number>(1);
const { mutate: buyTicket, isPending: isBuyingTicket } = useBuyTicket();

const goBack = () => navigateTo('/publics/events');

const handleBuyTicket = () => {
  if (!selectedTicketId.value) {
    $toast.warning('Please select a ticket');
    return;
  }

  const buyTicketData: BuyTicketRequest = {
    eventId: eventId.value,
    ticketId: selectedTicketId.value,
    quantity: ticketQuantity.value,
    description: `Purchase ticket for event ${cachedEvent.value?.title}`,
  };

  buyTicket(buyTicketData, {
    onSuccess: (response) => {
      $toast.success(`Order created successfully! Order ID: ${response.id}`);
      // Navigate to orders page
      navigateTo(`/orders`);
    },
    onError: (error) => {
      $toast.error(`Failed to buy ticket: ${error.message}`);
    },
  });
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

          <!-- Ticket Selection Form -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-white">Select Ticket</label>
              <Select v-model="selectedTicketId">
                <SelectTrigger class="w-full border-white/10 bg-white/5 text-white focus:border-sky-500 focus:ring-sky-500">
                  <SelectValue placeholder="Choose a ticket..." />
                </SelectTrigger>
                <SelectContent class="border-white/10 bg-slate-900 text-white">
                  <SelectItem
                    v-for="ticket in cachedEvent?.tickets"
                    :key="ticket.id"
                    :value="ticket.id"
                    class="text-white focus:bg-sky-500 focus:text-white"
                  >
                    {{ ticket.name }} - {{ formatPrice(ticket.price) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <label for="ticket-quantity" class="text-sm font-medium text-white">Quantity</label>
              <input
                id="ticket-quantity"
                v-model.number="ticketQuantity"
                type="number"
                min="1"
                class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <Button class="w-full" :disabled="!selectedTicketId || isBuyingTicket" @click="handleBuyTicket">
              <CreditCard class="mr-2 size-4" />
              {{ isBuyingTicket ? 'Processing...' : 'Buy Ticket Now' }}
            </Button>
          </div>

          <div class="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <img v-if="cachedEvent.bannerUrl" :src="cachedEvent.bannerUrl" :alt="cachedEvent.title" class="h-full w-full object-cover" />
            <p v-else class="mt-2 break-all text-xs text-slate-400">
              {{ 'Banner belum tersedia untuk event ini.' }}
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
