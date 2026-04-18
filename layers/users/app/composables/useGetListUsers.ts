import { useQuery } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { QUERY_KEY } from '~/layers/shared/app/common/const/querykey';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { Paginated } from '~/layers/shared/app/types/meta';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { User } from '../types';

export function useGetListUsers() {
  const http = useHttp();

  return useQuery({
    queryKey: [QUERY_KEY.USERS_LIST],
    queryFn: async () => {
      const response = await http<TResponse<Paginated<User>>>(ENDPOINT.USERS, {
        method: 'get',
      });
      return response.data;
    },
  });
}
