import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export interface ProcessPaymentRequest {
  id: string;
  external_id: string;
  status: string;
  amount: string;
}

export function useProcessPayment() {
  const http = useHttp();
  const config = useRuntimeConfig();
  const queryClient = useQueryClient();
  const { $toast } = useNuxtApp();

  return useMutation({
    mutationFn: async (paymentData: ProcessPaymentRequest) => {
      const response = await http<TResponse<{ received: boolean }>>(ENDPOINT.PAYMENT_WEBHOOK_INVOICE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Callback-Token': config.public.XENDIT_CALLBACK_TOKEN,
        },
        body: paymentData,
      });
      return response.data;
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_ORDERS] });
      $toast.success('Payment Successfully');
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      $toast.warning(response?.message ?? 'Failed to process payment');
    },
  });
}
