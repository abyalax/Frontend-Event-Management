import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { Order } from '../types';
import type { MetaRequest, Paginated } from '~/layers/shared/app/types/meta';

export function useGetUserOrders(params?: ComputedRef<MetaRequest>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.USER_ORDERS, unref(params)]),
    queryFn: async () => {
      const response = await http<TResponse<Paginated<Order>>>(ENDPOINT.USER_ORDERS, {
        method: 'GET',
        query: unref(params),
      });
      return response.data;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
