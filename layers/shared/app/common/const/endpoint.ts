export const ENDPOINT = Object.freeze({
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',

  USERS: '/users',
  EVENTS: '/events',
  EVENTS_PUBLISH: '/events/publish',
  EVENTS_PUBLIC: '/events/public',
  EVENTS_PUBLIC_DETAIL: '/events/public',

  ORDERS: '/orders',
  BUY_TICKET: '/orders/buy-ticket',
  USER_ORDERS: '/orders/user/my-orders',

  CHECK_IN: '/check-in',
  CHECK_IN_PDF: '/check-in/pdf-upload',

  PAYMENT_WEBHOOK_INVOICE: '/payments/webhook/invoice',

  DASHBOARD: {
    TOTAL_SALES: '/dashboard/total-sales',
    TOP_EVENTS: '/dashboard/top-events',
    TOP_CATEGORIES: '/dashboard/top-categories',
  },
});
