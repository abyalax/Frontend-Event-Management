<script setup lang="ts">
import { CreditCard, Ticket } from 'lucide-vue-next';
import { Button } from '~/layers/shared/app/components/ui/button';
import type { Order } from '../types';

interface Props {
  order: Order;
  isProcessingPayment: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  continuePayment: [id: string, amount: string];
  downloadTicket: [url: string];
}>();

const handleDownload = () => {
  const pdfUrl = props.order.items[0]?.generatedTickets?.[0]?.pdfUrl;
  if (pdfUrl) emit('downloadTicket', pdfUrl);
};
</script>

<template>
  <div class="flex gap-2">
    <!-- Payment Button -->
    <Button
      v-if="order.status === 'PENDING' && order.payment?.paymentUrl"
      size="sm"
      variant="outline"
      class="border-white/10 bg-white/5 text-white hover:bg-white/10"
      :disabled="isProcessingPayment"
      @click="emit('continuePayment', order.id, order.totalAmount.toString())"
    >
      <CreditCard class="mr-1 size-3" />
      {{ isProcessingPayment ? 'Processing...' : 'Pay' }}
    </Button>

    <!-- Ticket Button -->
    <Button
      v-if="order.status === 'PAID' && order.items.some((item) => item.generatedTickets?.length)"
      size="sm"
      variant="outline"
      class="border-white/10 bg-white/5 text-white hover:bg-white/10"
      @click="handleDownload"
    >
      <Ticket class="mr-1 size-3" />
      Ticket
    </Button>
  </div>
</template>
