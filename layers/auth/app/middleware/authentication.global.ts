export default defineNuxtRouteMiddleware((to) => {
  const publicPages = ['/login', '/register'];

  if (publicPages.includes(to.path)) {
    console.info('skip public pages', to.path);
    return;
  }
  console.info('masuk middleware authentication: ', to.path);
});
