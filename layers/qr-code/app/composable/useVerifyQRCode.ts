import { useMutation } from '@tanstack/vue-query';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';
import type { TResponse } from '~/layers/shared/app/types/response';

export interface CheckInResponse {
  status: 'VALID' | 'ALREADY_USED' | 'INVALID';
  valid: boolean;
  ticketId?: string;
  eventId?: string;
}

type CheckInResult = TResponse<CheckInResponse>;

type CheckInPayload = {
  qrCode: string;
};

const getErrorMessage = (error: { data?: TResponse } | unknown, fallback: string) => {
  const response = error && typeof error === 'object' ? (error as { data?: TResponse }).data : undefined;
  return response?.message ?? fallback;
};

export const useVerifyQRCode = () => {
  const http = useHttp();
  const { $toast } = useNuxtApp();

  const verifyQRCode = useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await http<CheckInResult>(ENDPOINT.CHECK_IN, {
        method: 'POST',
        body: {
          qrCode,
        } satisfies CheckInPayload,
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.data.valid) {
        $toast.success('Ticket validated successfully');
        return;
      }

      if (response.data.status === 'ALREADY_USED') {
        $toast.warning('Ticket already used');
        return;
      }

      $toast.warning('Ticket invalid');
    },
    onError: (error: { data?: TResponse }) => {
      $toast.warning(getErrorMessage(error, 'Ticket invalid or already duplicated with others'));
    },
  });

  const verifyPdfTicket = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await http<CheckInResult>(ENDPOINT.CHECK_IN_PDF, {
        method: 'POST',
        body: formData,
      });

      return response;
    },
    onSuccess: (response) => {
      if (response.data.valid) {
        $toast.success('PDF ticket validated successfully');
        return;
      }

      if (response.data.status === 'ALREADY_USED') {
        $toast.warning('PDF ticket already used');
        return;
      }

      $toast.warning('PDF ticket invalid');
    },
    onError: (error: { data?: TResponse }) => {
      $toast.warning(getErrorMessage(error, 'Failed to validate PDF ticket'));
    },
  });

  return {
    verifyQRCode,
    verifyPdfTicket,
  };
};
