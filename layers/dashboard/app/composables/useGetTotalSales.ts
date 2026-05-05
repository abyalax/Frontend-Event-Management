import { useQuery } from '@tanstack/vue-query';
import { computed, unref } from 'vue';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { QueryDashboard, TotalSales } from '../types';

export function useGetTotalSales(params: MaybeRef<QueryDashboard>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.DASHBOARD.TOTAL_SALES, unref(params)]),
    queryFn: async () => {
      const response = await http<TResponse<TotalSales>>(ENDPOINT.DASHBOARD.TOTAL_SALES, {
        method: 'GET',
        query: unref(params),
      });
      return response.data;
    },
    staleTime: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
