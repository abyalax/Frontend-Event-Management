import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { RegisterPayload } from '../types';

export function useRegister() {
  const http = useHttp();
  const { push } = useRouter();

  return useMutation({
    mutationFn: async (params: RegisterPayload) => {
      const response = await http<TResponse>(ENDPOINT.REGISTER, {
        method: 'POST',
        body: params,
      });
      return response.data;
    },
    onSuccess: () => push('/login'),
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      toast.warning(response?.message ?? 'Register account failed');
    },
  });
}
