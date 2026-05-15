import type { LocationQuery } from 'vue-router';

const PAYMENT_RETURN_STORAGE_KEY = 'event-management:pending-payment';

interface PaymentRedirectOrder {
  id: string;
  status: string;
  expiredAt?: string | Date | null;
  payment?: {
    paymentMethod?: string | null;
    paymentUrl?: string | null;
    expiresAt?: string | Date | null;
  } | null;
}

interface PendingPaymentReturn {
  orderId: string;
  paymentUrl: string;
  expiresAt?: string | null;
  createdAt: string;
}

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, '') ?? '';

const isHttpUrl = (url: string) => /^https?:\/\//i.test(url);

const firstQueryValue = (value?: LocationQuery[string]) => (Array.isArray(value) ? value[0] : value);

const toIsoString = (value?: string | Date | null) => {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value;
};

export function usePaymentReturn() {
  const config = useRuntimeConfig();

  const getReturnBaseUrl = () => {
    const configuredUrl = normalizeBaseUrl(String(config.public.APP_URL || ''));
    if (configuredUrl) return configuredUrl;
    if (import.meta.client) return globalThis.location.origin;
    return '';
  };

  const buildReturnUrl = (result: 'success' | 'failure') => {
    const baseUrl = getReturnBaseUrl();
    return baseUrl ? `${baseUrl}/payment/${result}` : `/payment/${result}`;
  };

  const buildReturnUrls = () => ({
    successRedirectUrl: buildReturnUrl('success'),
    failureRedirectUrl: buildReturnUrl('failure'),
  });

  const rememberPendingPayment = (order: Pick<PaymentRedirectOrder, 'id' | 'expiredAt' | 'payment'>) => {
    if (!import.meta.client || !order.payment?.paymentUrl) return;

    const payload: PendingPaymentReturn = {
      orderId: order.id,
      paymentUrl: order.payment.paymentUrl,
      expiresAt: toIsoString(order.payment.expiresAt ?? order.expiredAt ?? null),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(PAYMENT_RETURN_STORAGE_KEY, JSON.stringify(payload));
  };

  const getPendingPayment = (): PendingPaymentReturn | null => {
    if (!import.meta.client) return null;

    const raw = localStorage.getItem(PAYMENT_RETURN_STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as PendingPaymentReturn;
    } catch {
      localStorage.removeItem(PAYMENT_RETURN_STORAGE_KEY);
      return null;
    }
  };

  const clearPendingPayment = () => {
    if (import.meta.client) localStorage.removeItem(PAYMENT_RETURN_STORAGE_KEY);
  };

  const resolveReturnOrderId = (query: LocationQuery) => {
    const queryOrderId =
      firstQueryValue(query.order_id) ??
      firstQueryValue(query.orderId) ??
      firstQueryValue(query.external_id) ??
      firstQueryValue(query.externalId) ??
      firstQueryValue(query.id);

    return queryOrderId || getPendingPayment()?.orderId || '';
  };

  const openPaymentUrl = async (paymentUrl: string, orderId?: string) => {
    if (!import.meta.client) return;

    if (isHttpUrl(paymentUrl)) {
      globalThis.location.assign(paymentUrl);
      return;
    }

    if (paymentUrl.startsWith('mock://')) {
      await navigateTo(`/payment/success?order_id=${encodeURIComponent(orderId ?? '')}&provider=mock`);
      return;
    }

    globalThis.location.assign(paymentUrl);
  };

  const redirectToPayment = async (order: PaymentRedirectOrder) => {
    if (order.status === 'PAID') {
      clearPendingPayment();
      await navigateTo(`/payment/success?order_id=${encodeURIComponent(order.id)}`);
      return;
    }

    const paymentUrl = order.payment?.paymentUrl;
    if (!paymentUrl) throw new Error('Payment URL is not available for this order.');

    rememberPendingPayment(order);
    if (order.payment?.paymentMethod === 'QRIS') {
      await navigateTo(`/payment/success?order_id=${encodeURIComponent(order.id)}`);
      return;
    }

    await openPaymentUrl(paymentUrl, order.id);
  };

  return {
    buildReturnUrls,
    rememberPendingPayment,
    getPendingPayment,
    clearPendingPayment,
    resolveReturnOrderId,
    openPaymentUrl,
    redirectToPayment,
  };
}
