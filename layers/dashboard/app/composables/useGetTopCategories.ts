import { useQuery } from '@tanstack/vue-query';
import { computed, unref } from 'vue';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { QueryDashboard, TopCategory } from '../types';

export function useGetTopCategories(params: MaybeRef<QueryDashboard>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.DASHBOARD.TOP_CATEGORIES, unref(params)]),
    queryFn: async () => {
      const response = await http<TResponse<TopCategory[]>>(ENDPOINT.DASHBOARD.TOP_CATEGORIES, {
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
