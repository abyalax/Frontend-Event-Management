import { useMutation } from '@tanstack/vue-query';
import { toast } from 'vue-sonner';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { User } from '~/layers/users/app/types';
import type { LoginPayload, LoginResponse } from '../types';

export function useLogin() {
  const http = useHttp();
  const authStore = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (params: LoginPayload) => {
      const response = await http<LoginResponse>(ENDPOINT.LOGIN, {
        method: 'POST',
        body: params,
      });
      return response;
    },
    onSuccess: (data: TResponse<User>) => {
      const user = data.data;
      toast.info(`Welcome back ${user.name}`);
      authStore.setUser(user);
      authStore.setAuthenticated(true);
      router.push('/dashboard');
    },
    onError: (error: { data: TResponse }) => {
      const response = error?.data;
      toast.warning(response?.message ?? 'Login failed');
      authStore.setAuthenticated(false);
    },
  });
}
