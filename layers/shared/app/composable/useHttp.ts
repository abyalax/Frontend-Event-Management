export const useHttp = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  return $fetch.create({
    baseURL: config.public.API_URL,
    credentials: 'include',

    async onResponseError({ response }) {
      if (response.status === 401) {
        try {
          await authStore.refreshToken();
        } catch (refreshError) {
          authStore.clearAuth();
          throw refreshError;
        }
      }
    },
  });
};
