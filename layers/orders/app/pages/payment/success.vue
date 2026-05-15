<script setup lang="ts">
import { CheckCircle2, Clock3, ExternalLink, RefreshCw, Ticket, XCircle } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { formatDate, formatPrice } from '~/layers/shared/app/utils/formatter';
import { PaymentMethod } from '~/layers/orders/app/types';

const route = useRoute();
const orderId = ref('');
const { resolveReturnOrderId, clearPendingPayment, openPaymentUrl } = usePaymentReturn();
const { $toast } = useNuxtApp();

onMounted(() => {
  orderId.value = resolveReturnOrderId(route.query);
});

const { data: status, isPending: isStatusPending, isFetching, refetch } = useGetOrderStatus(orderId);
const { data: order } = useGetOrder(orderId);

const isPaid = computed(() => status.value?.status === 'PAID' || ['PAID', 'SETTLED'].includes(status.value?.paymentStatus ?? ''));
const isExpired = computed(() => status.value?.status === 'EXPIRED' || status.value?.paymentStatus === 'EXPIRED');
const isFailed = computed(() => status.value?.status === 'CANCELLED' || status.value?.paymentStatus === 'FAILED');
const isWaiting = computed(() => Boolean(orderId.value) && !isPaid.value && !isExpired.value && !isFailed.value);
const isQrisPayment = computed(() => order.value?.payment?.paymentMethod === PaymentMethod.QRIS);
const generatedTickets = computed(() => order.value?.items.flatMap((item) => item.generatedTickets ?? []) ?? []);
const { data: qrisPayment } = useGetOrderPaymentQris(
  orderId,
  computed(() => isWaiting.value && isQrisPayment.value)
);

watch(isPaid, (paid) => {
  if (!paid) return;
  clearPendingPayment();
  $toast.success('Payment confirmed. Your ticket is being prepared.');
});

const retryPayment = async () => {
  const paymentUrl = status.value?.paymentUrl ?? order.value?.payment?.paymentUrl;
  if (isQrisPayment.value) {
    $toast.info('Scan the QRIS code on this page to complete payment.');
    return;
  }
  if (!paymentUrl) {
    $toast.warning('Payment URL is not available for this order.');
    return;
  }
  await openPaymentUrl(paymentUrl, orderId.value);
};
</script>

<template>
  <div class="min-h-screen bg-background px-4 py-10 text-foreground">
    <section class="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
      <div v-if="!orderId" class="space-y-5 text-center">
        <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <Clock3 class="size-7" />
        </div>
        <div>
          <h1 class="text-2xl font-semibold">Order payment not found</h1>
          <p class="mt-2 text-sm text-muted-foreground">Open My Orders to continue or verify your latest transaction.</p>
        </div>
        <Button @click="navigateTo('/orders')">Open My Orders</Button>
      </div>

      <div v-else class="space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex gap-4">
            <div
              :class="[
                'flex size-14 shrink-0 items-center justify-center rounded-full',
                isPaid
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : isExpired || isFailed
                    ? 'bg-red-500/10 text-red-500'
                    : 'bg-amber-500/10 text-amber-500',
              ]"
            >
              <CheckCircle2 v-if="isPaid" class="size-7" />
              <XCircle v-else-if="isExpired || isFailed" class="size-7" />
              <Clock3 v-else class="size-7" />
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Payment Status</p>
              <h1 class="mt-1 text-2xl font-semibold">
                {{ isPaid ? 'Payment confirmed' : isExpired ? 'Payment expired' : isFailed ? 'Payment failed' : 'Waiting for Xendit confirmation' }}
              </h1>
              <p class="mt-2 text-sm text-muted-foreground">
                Order <span class="font-mono text-foreground">{{ orderId }}</span>
              </p>
            </div>
          </div>

          <Button variant="outline" :disabled="isFetching" @click="refetch()">
            <RefreshCw :class="['mr-2 size-4', isFetching ? 'animate-spin' : '']" />
            Refresh
          </Button>
        </div>

        <div class="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-muted-foreground">Order status</p>
            <p class="mt-1 font-medium">{{ status?.status ?? (isStatusPending ? 'Checking...' : '-') }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Payment status</p>
            <p class="mt-1 font-medium">{{ status?.paymentStatus ?? '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Total</p>
            <p class="mt-1 font-medium">{{ order ? formatPrice(order.totalAmount) : '-' }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Expires at</p>
            <p class="mt-1 font-medium">{{ formatDate(status?.expiredAt ?? order?.expiredAt ?? undefined) }}</p>
          </div>
        </div>

        <div v-if="isWaiting" class="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          Xendit will confirm this payment through the backend webhook. This page checks the order status automatically every few seconds.
        </div>

        <div v-if="isWaiting && isQrisPayment" class="rounded-2xl border border-border bg-background p-4">
          <div class="flex flex-col items-center gap-4 text-center">
            <img
              v-if="qrisPayment?.qrCodeDataUrl"
              :src="qrisPayment.qrCodeDataUrl"
              alt="QRIS payment code"
              class="size-70 max-w-full rounded-lg border border-border bg-white p-3"
            />
            <div
              v-else
              class="flex size-70 max-w-full items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground"
            >
              Loading QRIS...
            </div>
            <p class="max-w-sm text-sm text-muted-foreground">
              Scan this QRIS code from your payment app. The order status updates automatically after Xendit sends the webhook.
            </p>
          </div>
        </div>

        <div v-if="isPaid && generatedTickets.length" class="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">{{ generatedTickets.length }} ticket ready.</p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row">
          <Button v-if="isWaiting && !isQrisPayment" variant="outline" @click="retryPayment">
            <ExternalLink class="mr-2 size-4" />
            Reopen Payment
          </Button>
          <Button @click="navigateTo('/orders')">
            <Ticket class="mr-2 size-4" />
            Open My Orders
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>
