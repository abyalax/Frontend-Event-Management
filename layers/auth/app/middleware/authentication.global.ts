/**
 * Auth middleware - Check is user already login
 * If not yet & and not public page -> redirect to /login
 * if exist, try refresh token
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const publicPages = ['/login', '/register'];

  if (publicPages.includes(to.path)) return;
  if (!authStore.user) authStore.hydrateFromStorage();

  // If not yet login -> redirect
  if (!authStore.isAuthenticated || !authStore.user) return navigateTo('/login');
  try {
    await authStore.refreshToken();
  } catch (error) {
    console.error('[Auth Middleware] Token refresh failed:', error);
    authStore.clearAuth();
    return navigateTo('/login');
  }
});
