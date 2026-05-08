import { useVerifyQRCode } from './useVerifyQRCode';
import { useQRState } from './useQRState';

export const useSendQR = () => {
  const { activeTab, apiResult, clearResult, isProcessing, resetScan, scannedCode, selectedFile } = useQRState();

  const { verifyQRCode, verifyPdfTicket } = useVerifyQRCode();
  const { $toast } = useNuxtApp();

  const sendToApi = async () => {
    if (isProcessing.value) return;

    clearResult();
    isProcessing.value = true;

    try {
      if (activeTab.value === 'file') {
        if (!selectedFile.value) {
          $toast.warning('Pilih file PDF tiket terlebih dahulu');
          return;
        }

        const response = await verifyPdfTicket.mutateAsync(selectedFile.value);

        let message;
        if (response.data.status === 'VALID') {
          message = 'PDF ticket validated successfully';
        } else if (response.data.status === 'ALREADY_USED') {
          message = 'PDF ticket already used';
        } else {
          message = 'PDF ticket invalid';
        }

        apiResult.value = {
          success: Boolean(response.data.valid),
          status: response.data.status,
          ticketId: response.data.ticketId,
          eventId: response.data.eventId,
          message,
        };

        if (response.data.valid) resetScan();
        return;
      }

      if (!scannedCode.value) {
        $toast.warning('Scan QR code terlebih dahulu');
        return;
      }

      const response = await verifyQRCode.mutateAsync(scannedCode.value);

      let message;
      if (response.data.status === 'VALID') {
        message = 'Ticket validated successfully';
      } else if (response.data.status === 'ALREADY_USED') {
        message = 'Ticket already used';
      } else {
        message = 'Ticket invalid';
      }

      apiResult.value = {
        success: Boolean(response.data.valid),
        status: response.data.status,
        ticketId: response.data.ticketId,
        eventId: response.data.eventId,
        message,
      };

      if (response.data.valid) {
        resetScan();
      }
    } catch {
      apiResult.value = {
        success: false,
        message: 'Ticket tidak valid atau gagal diproses.',
      };
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    sendToApi,
  };
};
