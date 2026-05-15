import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { Order } from '../types';

export function useGetOrder(orderId: Ref<string>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.ORDER_DETAIL, orderId.value]),
    enabled: computed(() => Boolean(orderId.value)),
    queryFn: async () => {
      const response = await http<TResponse<Order>>(ENDPOINT.ORDER_DETAIL(orderId.value), {
        method: 'GET',
        cache: 'no-store',
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
