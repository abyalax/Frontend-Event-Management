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
import { useBuyTicket, type BuyTicketRequest, type PaymentOption } from '~/layers/publics/app/composables/useBuyTicket';
import type { EventPublic } from '../../types';
import { useAuthStore } from '~/layers/auth/app/composables/useAuthStore';

const route = useRoute();
const eventId = computed(() => String(route.params.id ?? ''));
const { data, isPending } = useGetPublicEvent(eventId);
const cachedEvent = computed<EventPublic | undefined>(() => data.value ?? undefined);
const { $toast } = useNuxtApp();
const authStore = useAuthStore();

// Buy ticket state
const selectedTicketId = ref<string>('');
const ticketQuantity = ref<number>(1);
const selectedPaymentOption = ref<PaymentOption>('INVOICE');
const { mutate: buyTicket, isPending: isBuyingTicket } = useBuyTicket();
const { buildReturnUrls, redirectToPayment } = usePaymentReturn();

const goBack = () => navigateTo('/public-events');

const handleBuyTicket = () => {
  if (!selectedTicketId.value) {
    $toast.warning('Please select a ticket');
    return;
  }

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    const currentUrl = route.fullPath;
    navigateTo(`/login?redirect=${encodeURIComponent(currentUrl)}`);
    return;
  }

  const buyTicketData: BuyTicketRequest = {
    eventId: eventId.value,
    ticketId: selectedTicketId.value,
    quantity: ticketQuantity.value,
    description: `Purchase ticket for event ${cachedEvent.value?.title}`,
    paymentMethod: selectedPaymentOption.value.startsWith('EWALLET_DANA') ? 'EWALLET_DANA' : selectedPaymentOption.value,
    ewalletType:
      selectedPaymentOption.value === 'EWALLET_DANA' ? 'DANA' : selectedPaymentOption.value === 'EWALLET_SHOPEEPAY' ? 'SHOPEEPAY' : undefined,
    ...buildReturnUrls(),
  };

  buyTicket(buyTicketData, {
    onSuccess: async (response) => {
      $toast.success('Order created. Redirecting to secure payment page.');
      await redirectToPayment(response);
    },
    onError: (error: unknown) => {
      const status = typeof error === 'object' && error && 'status' in error ? (error as { status?: number }).status : undefined;
      if (status === 401) {
        navigateTo('/login');
        return;
      }
      $toast.warning('Failed to create payment. Please try again.');
    },
  });
};
</script>

<template>
  <!-- Main Wrapper -->
  <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
    <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 md:px-8">
      <!-- Top Navigation -->
      <div class="flex items-center justify-between gap-4">
        <Button variant="ghost" @click="goBack">
          <ArrowLeft class="mr-2 size-4" />
          Back to Events
        </Button>
        <Badge variant="outline" class="text-muted-foreground"> Public detail </Badge>
      </div>

      <!-- Skeleton / Pending State -->
      <section v-if="isPending" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="h-150 animate-pulse rounded-3xl border border-border bg-muted" />
        <div class="h-150 animate-pulse rounded-3xl border border-border bg-muted" />
      </section>

      <!-- Content State -->
      <section v-else-if="cachedEvent" class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <!-- Main Event Card -->
        <div class="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <!-- Hero Banner -->
          <div class="relative h-80 bg-muted md:h-115">
            <img v-if="cachedEvent.bannerUrl" :src="cachedEvent.bannerUrl" :alt="cachedEvent.title" class="h-full w-full object-cover" />
            <div v-else class="flex h-full items-center justify-center bg-linear-to-br from-muted to-secondary/50">
              <div class="text-center">
                <div class="text-2xl font-semibold text-foreground">{{ cachedEvent.title }}</div>
                <div class="mt-2 text-sm text-muted-foreground">Banner belum tersedia</div>
              </div>
            </div>

            <div class="absolute left-4 top-4 flex flex-wrap gap-2">
              <StatusBadge :status="cachedEvent.status" />
              <Badge variant="secondary" class="bg-background/80 backdrop-blur-md text-foreground">
                {{ cachedEvent.isVirtual ? 'Virtual' : 'Offline' }}
              </Badge>
            </div>
          </div>

          <!-- Event Information Body -->
          <div class="space-y-6 p-6 md:p-8">
            <div class="space-y-3">
              <h1 class="text-3xl font-semibold tracking-tight text-card-foreground md:text-4xl">
                {{ cachedEvent.title }}
              </h1>
              <p class="text-sm leading-relaxed text-muted-foreground md:text-base">
                {{ cachedEvent.description ?? 'Tidak ada deskripsi untuk event ini.' }}
              </p>
            </div>

            <!-- Detail Grid Blocks -->
            <div class="grid gap-3 md:grid-cols-2">
              <div class="rounded-2xl border border-border bg-muted/30 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays class="size-4 text-primary" />
                  Jadwal
                </div>
                <div class="text-sm font-medium">{{ formatDate(cachedEvent.startDate) }}</div>
                <div class="mt-1 text-xs text-muted-foreground">Sampai {{ formatDate(cachedEvent.endDate) }}</div>
              </div>

              <div class="rounded-2xl border border-border bg-muted/30 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin class="size-4 text-primary" />
                  Lokasi
                </div>
                <div class="text-sm font-medium">{{ cachedEvent.location }}</div>
                <div class="mt-1 text-xs text-muted-foreground">{{ cachedEvent.category?.name ?? 'Tanpa kategori' }}</div>
              </div>

              <div class="rounded-2xl border border-border bg-muted/30 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Users class="size-4 text-primary" />
                  Kapasitas
                </div>
                <div class="text-sm font-medium">
                  {{ cachedEvent.maxAttendees ? `${cachedEvent.maxAttendees} peserta` : 'Tidak dibatasi' }}
                </div>
                <div class="mt-1 text-xs text-muted-foreground">{{ cachedEvent.isVirtual ? 'Mode virtual' : 'Event offline' }}</div>
              </div>

              <div class="rounded-2xl border border-border bg-muted/30 p-4">
                <div class="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <Ticket class="size-4 text-primary" />
                  Event ID
                </div>
                <div class="break-all text-sm font-medium">{{ cachedEvent.id }}</div>
                <div class="mt-1 text-xs text-muted-foreground">Oleh {{ cachedEvent.createdBy }}</div>
              </div>
            </div>

            <!-- Timestamps footer -->
            <div class="flex flex-wrap gap-4 pt-4 border-t border-border">
              <div v-for="(val, label) in { Created: cachedEvent.createdAt, Updated: cachedEvent.updatedAt }" :key="label">
                <p class="text-[10px] uppercase tracking-widest text-muted-foreground">{{ label }}</p>
                <p class="text-xs font-medium">{{ formatDate(val) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar / Checkout Section -->
        <aside class="h-fit space-y-6 rounded-3xl border border-border bg-card p-6 shadow-xl lg:sticky lg:top-8">
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Actions</p>
            <h2 class="text-xl font-semibold">Lanjutkan ke transaksi</h2>
            <p class="text-sm leading-relaxed text-muted-foreground">Pilih jenis tiket dan tentukan jumlah pesanan Anda.</p>
          </div>

          <!-- Transaction Form -->
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Select Ticket</label>
              <Select v-model="selectedTicketId">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Choose a ticket..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="ticket in cachedEvent?.tickets" :key="ticket.id" :value="ticket.id">
                    {{ ticket.name }} - {{ formatPrice(ticket.price) }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="space-y-2">
              <label for="ticket-quantity" class="text-sm font-medium">Quantity</label>
              <!-- Input menggunakan style base Shadcn (bisa diganti component Input) -->
              <input
                id="ticket-quantity"
                v-model.number="ticketQuantity"
                type="number"
                min="1"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Payment Method</label>
              <Select v-model="selectedPaymentOption">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Choose a payment method..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INVOICE">Xendit Invoice</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="EWALLET_SHOPEEPAY">ShopeePay</SelectItem>
                  <SelectItem value="EWALLET_DANA">DANA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button class="w-full shadow-lg" size="lg" :disabled="!selectedTicketId || isBuyingTicket" @click="handleBuyTicket">
              <CreditCard class="mr-2 size-4" />
              {{ isBuyingTicket ? 'Processing...' : 'Buy Ticket Now' }}
            </Button>
          </div>

          <!-- Small Banner Info -->
          <div class="overflow-hidden rounded-xl border border-border bg-muted/20">
            <img
              v-if="cachedEvent.bannerUrl"
              :src="cachedEvent.bannerUrl"
              alt=""
              class="aspect-video w-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all"
            />
            <div v-else class="p-4 text-center">
              <p class="text-xs text-muted-foreground italic">Banner belum tersedia</p>
            </div>
          </div>
        </aside>
      </section>

      <!-- Error State -->
      <section v-else class="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
          <Ticket class="size-6" />
        </div>
        <h1 class="text-2xl font-semibold">Event tidak ditemukan</h1>
        <p class="mt-2 text-muted-foreground">Data event ini tidak tersedia atau telah dihapus.</p>
        <Button class="mt-6" variant="outline" @click="goBack">Kembali ke Daftar Event</Button>
      </section>
    </div>
  </div>
</template>
