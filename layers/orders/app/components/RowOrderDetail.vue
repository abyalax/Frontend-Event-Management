<script setup lang="ts">
import type { Order } from '../types';
import { formatPrice, formatDate } from '~/layers/shared/app/utils/formatter';

interface Props {
  order: Order;
}

defineProps<Props>();
</script>

<template>
  <div class="w-full p-6 bg-card text-card-foreground border-b border-border transition-colors hover:bg-accent/5">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- First column: Order Information -->
      <div class="space-y-4">
        <div>
          <h3 class="text-lg font-semibold tracking-tight text-foreground mb-1 leading-none">Order #{{ order.id }}</h3>
          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ order.items.length }} {{ order.items.length === 1 ? 'item' : 'items' }} • {{ formatPrice(order.totalAmount) }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Status</span>
          <span
            :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
              order.status === 'PAID'
                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-900/50 dark:text-emerald-400'
                : order.status === 'PENDING'
                  ? 'bg-amber-500/10 text-amber-600 border-amber-200 dark:border-amber-900/50 dark:text-amber-400'
                  : order.status === 'EXPIRED'
                    ? 'bg-red-500/10 text-red-600 border-red-200 dark:border-red-900/50 dark:text-red-400'
                    : 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-900/50 dark:text-slate-400',
            ]"
          >
            {{ order.status }}
          </span>
        </div>
      </div>

      <!-- Second column: Order Items -->
      <div class="space-y-3">
        <div class="text-xs font-medium text-muted-foreground mb-2">Order Items</div>
        <div class="space-y-2">
          <div v-for="item in order.items" :key="item.id" class="bg-muted/30 p-3 rounded-lg border border-border/30">
            <div class="flex justify-between items-start gap-2">
              <div class="flex-1">
                <div class="text-sm font-medium text-foreground">{{ item.ticketName || 'Unknown Ticket' }}</div>
                <div class="text-xs text-muted-foreground">{{ item.quantity }}x {{ formatPrice(item.price) }}</div>
              </div>
              <div class="text-sm font-mono text-foreground/90">{{ formatPrice(item.subtotal) }}</div>
            </div>
            <div v-if="item.generatedTickets && item.generatedTickets.length > 0" class="mt-2 text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <span>✓ {{ item.generatedTickets.length }} {{ item.generatedTickets.length === 1 ? 'ticket' : 'tickets' }} generated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Third column: Payment & Timing (Styled as a subtle card) -->
      <div class="bg-muted/40 p-4 rounded-xl border border-border/40 space-y-3 flex flex-col justify-center">
        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold uppercase text-muted-foreground/80">Order Date</span>
          <span class="text-sm font-mono text-foreground/90">
            {{ order.createdAt ? formatDate(order.createdAt) : '-' }}
          </span>
        </div>

        <div class="h-px bg-border/50 w-full" />

        <div class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold uppercase text-muted-foreground/80">Payment Method</span>
          <span class="text-sm font-mono text-foreground/90">
            {{ order.payment?.paymentMethod ?? '-' }}
          </span>
        </div>

        <div v-if="order.expiredAt" class="h-px bg-border/50 w-full" />

        <div v-if="order.expiredAt" class="flex flex-col gap-0.5">
          <span class="text-[10px] font-bold uppercase text-muted-foreground/80">Expires At</span>
          <span class="text-sm font-mono text-foreground/90">
            {{ formatDate(order.expiredAt) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
