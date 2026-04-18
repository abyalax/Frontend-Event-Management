/**
 * Authorization middleware - Check permissions based on route meta
 *
 * Route meta structure:
 * {
 *   path: '/admin/users',
 *   component: () => import('~/pages/admin/users.vue'),
 *   meta: {
 *     requiresAuth: true,
 *     requiresPermissions: ['user:read'],
 *     requireAll: true // optional
 *   }
 * }
 */

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresPermissions?: string[];
    requireAll?: boolean;
  }
}

export default defineNuxtRouteMiddleware((to) => {
  const { canAccessRoute } = useAuthorize();

  console.info('[Authorization Middleware] Checking:', to.path);
  console.info('[Authorization Middleware] Full route meta:', to.meta);

  // Skip if route does not require auth
  if (!to.meta.requiresAuth) {
    console.info('[Authorization Middleware] Route not require auth, skipping');
    return;
  }

  // Allow if there is no permission requirement
  if (!to.meta.requiresPermissions || to.meta.requiresPermissions.length === 0) {
    console.info('[Authorization Middleware] No permission requirement');
    return;
  }

  const requiredPermissions = to.meta.requiresPermissions;
  const requireAll = to.meta.requireAll !== false;

  console.info('[Authorization Middleware] Required:', requiredPermissions, 'requireAll:', requireAll);

  // Check authorization
  const isAuthorized = canAccessRoute(requiredPermissions, requireAll);

  if (!isAuthorized) {
    console.warn('[Authorization Middleware] Not authorized for:', to.path);
    return navigateTo('/unauthorized');
  }

  console.info('[Authorization Middleware] Authorized');
});
