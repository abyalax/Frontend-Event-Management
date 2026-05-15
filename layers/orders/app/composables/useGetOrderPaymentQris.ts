import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export interface OrderPaymentQrisResponse {
  orderId: string;
  qrCodeDataUrl: string;
  qrString: string;
}

export function useGetOrderPaymentQris(orderId: Ref<string>, enabled: Ref<boolean>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => ['get-order-payment-qris', orderId.value]),
    enabled: computed(() => Boolean(orderId.value) && enabled.value),
    queryFn: async () => {
      const response = await http<TResponse<OrderPaymentQrisResponse>>(ENDPOINT.ORDER_PAYMENT_QRIS(orderId.value), {
        method: 'GET',
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnMount: true,
  });
}
