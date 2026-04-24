import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export function useDeleteUser() {
  const http = useHttp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await http<TResponse<boolean>>(`${ENDPOINT.USERS}/${id}`, {
        method: 'DELETE',
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS_LIST] });
      toast.info('Delete User Successfully');
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      toast.warning(response?.message ?? 'Delete User Failed');
    },
  });
}
