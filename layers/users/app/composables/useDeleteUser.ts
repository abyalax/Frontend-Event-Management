import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { CreateUserPayload, User } from '../types';

export function useDeleteUser() {
  const http = useHttp();

  return useMutation({
    mutationFn: async (params: CreateUserPayload) => {
      const response = await http<TResponse<User>>(ENDPOINT.USERS, {
        method: 'DELETE',
        body: params,
      });
      return response;
    },
    onSuccess: () => toast.info('Delete User Successfully'),
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      toast.warning(response?.message ?? 'Delete User Failed');
    },
  });
}
