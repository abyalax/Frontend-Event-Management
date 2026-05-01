<script setup lang="ts">
import { ArrowLeft, CreditCard } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';

definePageMeta({
  requiresAuth: true,
});

const route = useRoute();
const eventId = computed(() => String(route.query.eventId ?? ''));

const goBack = () => navigateTo(eventId.value ? `/publics/events/${eventId.value}` : '/publics/events');
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
    <div class="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl">
      <Button variant="ghost" class="mb-6 text-slate-200 hover:bg-white/5 hover:text-white" @click="goBack">
        <ArrowLeft class="mr-2 size-4" />
        Back
      </Button>

      <div class="space-y-4">
        <div class="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sm text-sky-200">
          <CreditCard class="size-4" />
          Continue Payment Ticket
        </div>
        <h1 class="text-3xl font-semibold text-white">Payment flow belum dihubungkan penuh</h1>
        <p class="text-sm leading-6 text-slate-300">
          Route ini sudah tersedia supaya tombol dari detail event tidak 404. Event ID:
          <span class="font-medium text-white">{{ eventId || '-' }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
