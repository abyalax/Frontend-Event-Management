import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { CreateUserPayload, User } from '../types';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';

export function useUpdateUser() {
  const http = useHttp();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateUserPayload) => {
      const response = await http<TResponse<User>>(ENDPOINT.USERS, {
        method: 'PATCH',
        body: params,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USERS_LIST] });
      toast.info('Update User Successfully');
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      toast.warning(response?.message ?? 'Update User Failed');
    },
  });
}
