import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export function usePublishEvents() {
  const http = useHttp();
  const queryClient = useQueryClient();
  const { $toast } = useNuxtApp();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await http<TResponse<{ message: string; affected: number }>>(ENDPOINT.EVENTS_PUBLISH, {
        method: 'POST',
        body: { ids },
      });
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.EVENTS_PUBLIC_LIST] });
      $toast.info(`Published ${response.data?.affected || 0} events successfully`);
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      $toast.warning(response?.message ?? 'Publish Events Failed');
    },
  });
}
