import { useMutation } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export interface BuyTicketRequest {
  eventId?: string;
  ticketId: string;
  quantity: number;
  description?: string;
  successRedirectUrl?: string;
  failureRedirectUrl?: string;
}

export interface OrderResponse {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  totalAmount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
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
