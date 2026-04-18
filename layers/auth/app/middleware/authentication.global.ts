/**
 * Auth middleware - Check is user already login
 * If not yet & and not public page -> redirect to /login
 * if exist, try refresh token
 */

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore();
  const publicPages = ['/login', '/register'];

  // Skip untuk public pages
  if (publicPages.includes(to.path)) {
    console.info('[Auth Middleware] Public page, skipping:', to.path);
    return;
  }

  console.info('[Auth Middleware] Checking authentication:', to.path);

  // Hydrate dari localStorage
  if (!authStore.user) {
    authStore.hydrateFromStorage();
  }

  // If not yet login -> redirect
  if (!authStore.isAuthenticated || !authStore.user) {
    console.warn('[Auth Middleware] Not authenticated, redirecting to /login');
    return navigateTo('/login');
  }

  // Try refresh token
  try {
    await authStore.refreshToken();
    console.info('[Auth Middleware] Token refreshed');
  } catch (error) {
    console.error('[Auth Middleware] Token refresh failed:', error);
    authStore.clearAuth();
    return navigateTo('/login');
  }
});
