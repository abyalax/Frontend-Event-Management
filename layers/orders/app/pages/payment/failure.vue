<script setup lang="ts">
import { ExternalLink, RefreshCw, ShoppingCart, XCircle } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import { formatDate } from '~/layers/shared/app/utils/formatter';

const route = useRoute();
const orderId = ref('');
const { resolveReturnOrderId, openPaymentUrl } = usePaymentReturn();
const { $toast } = useNuxtApp();

onMounted(() => {
  orderId.value = resolveReturnOrderId(route.query);
});

const { data: status, isFetching, refetch } = useGetOrderStatus(orderId);

const canRetry = computed(() => status.value?.status === 'PENDING' && Boolean(status.value?.paymentUrl));

const retryPayment = async () => {
  if (!status.value?.paymentUrl) {
    $toast.warning('Payment URL is not available for this order.');
    return;
  }
  await openPaymentUrl(status.value.paymentUrl, orderId.value);
};
</script>

<template>
  <div class="min-h-screen bg-background px-4 py-10 text-foreground">
    <section class="mx-auto max-w-2xl space-y-6 rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex gap-4">
          <div class="flex size-14 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <XCircle class="size-7" />
          </div>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Payment Failed</p>
            <h1 class="mt-1 text-2xl font-semibold">Payment was not completed</h1>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ orderId ? 'Check the order status below or retry payment if it is still pending.' : 'Open My Orders to review your transaction.' }}
            </p>
          </div>
        </div>

        <Button v-if="orderId" variant="outline" :disabled="isFetching" @click="refetch()">
          <RefreshCw :class="['mr-2 size-4', isFetching ? 'animate-spin' : '']" />
          Refresh
        </Button>
      </div>

      <div v-if="orderId" class="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 sm:grid-cols-2">
        <div>
          <p class="text-xs text-muted-foreground">Order ID</p>
          <p class="mt-1 break-all font-mono text-sm">{{ orderId }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Order status</p>
          <p class="mt-1 font-medium">{{ status?.status ?? '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Payment status</p>
          <p class="mt-1 font-medium">{{ status?.paymentStatus ?? '-' }}</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Expires at</p>
          <p class="mt-1 font-medium">{{ formatDate(status?.expiredAt ?? undefined) }}</p>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <Button v-if="canRetry" variant="outline" @click="retryPayment">
          <ExternalLink class="mr-2 size-4" />
          Retry Payment
        </Button>
        <Button @click="navigateTo('/orders')">
          <ShoppingCart class="mr-2 size-4" />
          Open My Orders
        </Button>
      </div>
    </section>
  </div>
</template>
