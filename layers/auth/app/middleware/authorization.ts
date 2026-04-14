export default defineNuxtRouteMiddleware((to) => {
  console.info('masuk middleware authorization: ', to.path);
});
