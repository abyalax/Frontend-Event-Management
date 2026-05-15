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
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  ORDER_STATUS: (id: string) => `/orders/${id}/status`,
  ORDER_TICKETS: (id: string) => `/orders/${id}/tickets`,
  ORDER_PAYMENT_QRIS: (id: string) => `/orders/${id}/payment-qris`,

  CHECK_IN: '/check-in',
  CHECK_IN_PDF: '/check-in/pdf-upload',

  DASHBOARD: {
    TOTAL_SALES: '/dashboard/total-sales',
    TOP_EVENTS: '/dashboard/top-events',
    TOP_CATEGORIES: '/dashboard/top-categories',
  },
});
