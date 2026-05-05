export const ENDPOINT = Object.freeze({
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: 'refresh',

  USERS: '/users',
  EVENTS: '/events',
  EVENTS_PUBLISH: '/events/publish',
  EVENTS_PUBLIC: '/events/public',
  EVENTS_PUBLIC_DETAIL: '/events/public',

  ORDERS: '/orders',
  BUY_TICKET: '/orders/buy-ticket',
  USER_ORDERS: '/orders/user/my-orders',

  PAYMENT_WEBHOOK_INVOICE: '/payments/webhook/invoice',

  DASHBOARD: {
    TOTAL_SALES: '/dashboard/total-sales',
    TOP_EVENTS: '/dashboard/top-events',
    TOP_CATEGORIES: '/dashboard/top-categories',
  },
});
