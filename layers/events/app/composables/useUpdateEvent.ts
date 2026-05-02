import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { Event, UpdateEventPayload } from '../types';

export function useUpdateEvent() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { $toast } = useNuxtApp();

  return useMutation({
    mutationFn: async (params: { id: string; payload: UpdateEventPayload }) => {
      const response = await http<TResponse<Event>>(`${ENDPOINT.EVENTS}/${params.id}`, {
        method: 'PATCH',
        body: params.payload,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS_PUBLIC_LIST] });
      $toast.info('Update Event Successfully');
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      $toast.warning(response?.message ?? 'Update Event Failed');
    },
  });
}
