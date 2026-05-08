import { createBarcodeDetector, createFallbackDetector, type BarcodeDetectorLike } from '~/layers/shared/app/lib/barcode';
import { isMobile } from '~/layers/shared/app/utils/mobile';

type CheckInResult = {
  success: boolean;
  message: string;
  status?: 'VALID' | 'ALREADY_USED' | 'INVALID';
  ticketId?: string;
  eventId?: string;
};

export const useQRState = () => {
  const activeTab = ref<'camera' | 'file'>('camera');
  const isCameraReady = ref(false);
  const isProcessing = ref(false);
  const isScanning = ref(false);
  const scannedCode = ref<string | null>(null);
  const selectedFile = ref<File | null>(null);
  const apiResult = ref<CheckInResult | null>(null);
  const cameraError = ref<string | null>(null);
  const videoRef = ref<HTMLVideoElement | null>(null);

  let mediaStream: MediaStream | null = null;
  let scanTimer: ReturnType<typeof setInterval> | null = null;
  let detector: BarcodeDetectorLike | null = null;
  let isDetecting = false;

  const stopScanning = () => {
    if (scanTimer) {
      clearInterval(scanTimer);
      scanTimer = null;
    }

    isScanning.value = false;
  };

  const stopCamera = () => {
    stopScanning();

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      mediaStream = null;
    }

    if (videoRef.value) videoRef.value.srcObject = null;

    isCameraReady.value = false;
  };

  const handleDetectedQr = (value: string) => {
    scannedCode.value = value;
    stopScanning();
  };

  const scanFrame = async () => {
    if (isDetecting || !detector || !videoRef.value || !isScanning.value) return;

    const video = videoRef.value;
    if (video.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) return;

    isDetecting = true;

    try {
      const detected = await detector.detect(video);
      const rawValue = detected[0]?.rawValue?.trim();
      if (rawValue) handleDetectedQr(rawValue);
    } catch (error) {
      cameraError.value = error instanceof Error ? error.message : 'Unable to scan QR code';
      stopScanning();
    } finally {
      isDetecting = false;
    }
  };

  const startScanning = () => {
    if (!detector || !videoRef.value) {
      cameraError.value = 'QR scanner is not supported in this browser';
      stopCamera();
      return;
    }

    stopScanning();
    isScanning.value = true;
    cameraError.value = null;

    scanTimer = setInterval(() => {
      void scanFrame();
    }, 1000); // scan every one seconds
  };

  const startCamera = async () => {
    if (!globalThis.window) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      cameraError.value = 'Camera access is not supported in this browser';
      return;
    }

    cameraError.value = null;

    try {
      // Try native BarcodeDetector first
      const nativeDetector = createBarcodeDetector();
      if (nativeDetector) detector = nativeDetector;
      else {
        // If native detector is not available, use fallback
        detector = createFallbackDetector();
        cameraError.value =
          'QR scanner using fallback mode - BarcodeDetector API not available in this browser. Consider using Chrome or Edge for better performance.';
      }

      let videoConstraints: MediaTrackConstraints;
      if (isMobile) {
        // On mobile, prefer rear camera for QR scanning
        videoConstraints = {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };
      } else {
        // On desktop, use any available camera (usually webcam)
        videoConstraints = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: videoConstraints,
      });

      mediaStream = stream;

      // Wait for videoRef to be available with timeout
      let videoRefWaitCount = 0;
      const maxVideoRefWait = 50; // 5 seconds max

      while (!videoRef.value && videoRefWaitCount < maxVideoRefWait) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        videoRefWaitCount++;
      }

      if (!videoRef.value) {
        cameraError.value = 'Video element not available. Please refresh the page.';
        return;
      }

      try {
        videoRef.value.srcObject = stream;
        await videoRef.value.play();

        // Wait a bit for video to be fully ready before starting scanning
        setTimeout(() => {
          startScanning();
        }, 1000);
      } catch {
        cameraError.value = 'Failed to play video stream.';
      }

      isCameraReady.value = true;
    } catch (error) {
      cameraError.value = error instanceof Error ? error.message : 'Unable to access the camera';
      stopCamera();
    }
  };

  const setSelectedFile = (file: File | null) => {
    selectedFile.value = file;
    scannedCode.value = null;
    apiResult.value = null;
  };

  const clearResult = () => {
    apiResult.value = null;
  };

  const resetScan = () => {
    scannedCode.value = null;
    selectedFile.value = null;
    apiResult.value = null;
  };

  watch(activeTab, async (tab) => {
    if (tab === 'camera') {
      await startCamera();
      return;
    }

    stopCamera();
  });

  // Watch for videoRef to be available and ready
  watch(videoRef, (newVideoRef) => {
    if (newVideoRef && isCameraReady.value && !isScanning.value) {
      setTimeout(() => {
        startScanning();
      }, 500);
    }
  });

  onMounted(async () => {
    if (activeTab.value === 'camera') {
      await startCamera();
    }
  });

  onBeforeUnmount(() => {
    stopCamera();
  });

  return {
    activeTab,
    apiResult,
    cameraError,
    clearResult,
    isCameraReady,
    isProcessing,
    isScanning,
    resetScan,
    scannedCode,
    selectedFile,
    setSelectedFile,
    startCamera,
    stopCamera,
    videoRef,
  };
};
