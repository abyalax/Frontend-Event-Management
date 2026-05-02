import { defineNuxtPlugin } from 'nuxt/app';
import { useAuthStore } from '~/layers/auth/app/composables/useAuthStore';

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  // Restore auth from localStorage on app init
  if (import.meta.client) authStore.hydrateFromStorage();
});
