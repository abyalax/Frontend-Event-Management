/**
 * Auth middleware - Check is user already login
 * If not yet & and not public page -> redirect to /login
 * if exist, try refresh token
 */

import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';
import { useAuthStore } from '../composables/useAuthStore';
import { LIST_PUBLIC_PAGES } from '~/layers/shared/app/common/const/pages';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();

  if (LIST_PUBLIC_PAGES.some((page) => to.path.startsWith(page))) return;
  if (!authStore.user) authStore.hydrateFromStorage();

  // If not yet login -> redirect
  if (!authStore.isAuthenticated || !authStore.user) return navigateTo('/login');

  // Only refresh token if we have a valid session
  // The actual token expiration will be handled by HTTP interceptors
});
