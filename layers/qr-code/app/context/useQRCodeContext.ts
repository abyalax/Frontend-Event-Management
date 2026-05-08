import { createContext } from '~/layers/shared/app/utils/createContext';
import { useQRState } from '../composable/useQRState';
import { useSendQR } from '../composable/useSendQR';
import { useVerifyQRCode } from '../composable/useVerifyQRCode';

type CheckInResult = {
  success: boolean;
  message: string;
  status?: 'VALID' | 'ALREADY_USED' | 'INVALID';
  ticketId?: string;
  eventId?: string;
};

type QRCodeContextType = {
  // State management
  activeTab: Ref<'camera' | 'file'>;
  apiResult: Ref<CheckInResult | null>;
  cameraError: Ref<string | null>;
  isCameraReady: Ref<boolean>;
  isProcessing: Ref<boolean>;
  isScanning: Ref<boolean>;
  scannedCode: Ref<string | null>;
  selectedFile: Ref<File | null>;
  videoRef: Ref<HTMLVideoElement | null>;

  // State actions
  clearResult: () => void;
  resetScan: () => void;
  setSelectedFile: (file: File | null) => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;

  // API actions
  sendToApi: () => Promise<void>;

  // Verification mutations
  verifyQRCode: ReturnType<typeof useVerifyQRCode>['verifyQRCode'];
  verifyPdfTicket: ReturnType<typeof useVerifyQRCode>['verifyPdfTicket'];
};

const [useQRCodeContext, provideQRCodeContext] = createContext<QRCodeContextType>('QRCode');

let contextInstance: QRCodeContextType | null = null;

function setupQRCodeProvider() {
  // Return existing instance if already created (singleton pattern)
  if (contextInstance) {
    return contextInstance;
  }

  // Initialize all composables
  const qrState = useQRState();
  const { sendToApi } = useSendQR();
  const { verifyQRCode, verifyPdfTicket } = useVerifyQRCode();

  // Create unified context
  const context: QRCodeContextType = {
    // State from useQRState
    activeTab: qrState.activeTab,
    apiResult: qrState.apiResult,
    cameraError: qrState.cameraError,
    isCameraReady: qrState.isCameraReady,
    isProcessing: qrState.isProcessing,
    isScanning: qrState.isScanning,
    scannedCode: qrState.scannedCode,
    selectedFile: qrState.selectedFile,
    videoRef: qrState.videoRef,

    // Actions from useQRState
    clearResult: qrState.clearResult,
    resetScan: qrState.resetScan,
    setSelectedFile: qrState.setSelectedFile,
    startCamera: qrState.startCamera,
    stopCamera: qrState.stopCamera,

    // Actions from useSendQR
    sendToApi,

    // Mutations from useVerifyQRCode
    verifyQRCode,
    verifyPdfTicket,
  };

  contextInstance = provideQRCodeContext(context);
  return contextInstance;
}

export { useQRCodeContext, setupQRCodeProvider };
