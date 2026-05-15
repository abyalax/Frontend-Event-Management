import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { OrderStatus } from '../types';

export interface OrderStatusResponse {
  orderId: string;
  status: OrderStatus;
  paymentStatus?: string | null;
  paymentUrl?: string | null;
  expiredAt?: string | null;
}

const shouldPollStatus = (data?: OrderStatusResponse) => data?.status === 'PENDING' || data?.paymentStatus === 'PENDING';

export function useGetOrderStatus(orderId: Ref<string>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.ORDER_STATUS, orderId.value]),
    enabled: computed(() => Boolean(orderId.value)),
    queryFn: async () => {
      const response = await http<TResponse<OrderStatusResponse>>(ENDPOINT.ORDER_STATUS(orderId.value), {
        method: 'GET',
        cache: 'no-store',
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: (query) => (shouldPollStatus(query.state.data) ? 3000 : false),
  });
}
