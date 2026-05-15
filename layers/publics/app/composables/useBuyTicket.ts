import { useMutation } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export type PaymentOption = 'INVOICE' | 'QRIS' | 'EWALLET_SHOPEEPAY' | 'EWALLET_DANA';

export interface BuyTicketRequest {
  eventId?: string;
  ticketId: string;
  quantity: number;
  description?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
  paymentMethod?: PaymentOption;
  ewalletType?: 'OVO' | 'DANA' | 'SHOPEEPAY' | 'LINKAJA';
}

export interface OrderResponse {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  expiredAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  payment?: {
    id: string;
    externalId: string;
    status: string;
    amount: number;
    paymentMethod: string;
    paymentUrl?: string | null;
    paidAt?: string | null;
    expiresAt?: string | null;
  } | null;
}

export function useBuyTicket() {
  const http = useHttp();

  return useMutation({
    mutationFn: async (buyTicketData: BuyTicketRequest) => {
      const response = await http<TResponse<OrderResponse>>(ENDPOINT.BUY_TICKET, {
        method: 'POST',
        body: buyTicketData,
      });
      return response.data;
    },
  });
}
