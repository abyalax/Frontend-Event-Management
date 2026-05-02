import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { EventPublic } from '../types';

export function useGetPublicEvent(id: ComputedRef<string>) {
  const http = useHttp();

  return useQuery({
    queryKey: computed(() => [QUERY_KEY.EVENT_PUBLIC_DETAIL, unref(id)]),
    queryFn: async () => {
      const eventId = unref(id);
      if (!eventId) throw new Error('Event id is required');

      const response = await http<TResponse<EventPublic>>(`${ENDPOINT.EVENTS_PUBLIC_DETAIL}/${eventId}`, {
        method: 'GET',
      });
      return response.data;
    },
    enabled: computed(() => Boolean(unref(id))),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
