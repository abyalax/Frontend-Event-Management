<script setup lang="ts">
import { AlertCircle, Camera, CheckCircle, FileText, Loader2, Send, UploadCloud, X } from 'lucide-vue-next';
import { useQRCodeContext } from '../context/useQRCodeContext';

const {
  activeTab,
  apiResult,
  cameraError,
  isCameraReady,
  isProcessing,
  isScanning,
  scannedCode,
  selectedFile,
  setSelectedFile,
  sendToApi,
  videoRef,
} = useQRCodeContext();

const { $toast } = useNuxtApp();

const canSubmit = computed(() => {
  if (isProcessing.value) return false;
  if (activeTab.value === 'file') return Boolean(selectedFile.value);
  return Boolean(scannedCode.value);
});

const resultSummary = computed(() => {
  if (!apiResult.value) return null;

  return apiResult.value.success
    ? {
        tone: 'success',
        title: 'Berhasil Validasi',
        icon: CheckCircle,
      }
    : {
        tone: 'error',
        title: 'Gagal Validasi',
        icon: AlertCircle,
      };
});

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  if (file.type !== 'application/pdf') {
    $toast.warning('Hanya file PDF yang didukung untuk upload tiket');
    input.value = '';
    return;
  }

  setSelectedFile(file);
}

function handleFileDrop(event: DragEvent) {
  const file = event.dataTransfer?.files?.[0];
  if (!file) return;

  if (file.type !== 'application/pdf') {
    $toast.warning('Hanya file PDF yang didukung untuk upload tiket');
    return;
  }

  setSelectedFile(file);
}
</script>

<template>
  <section class="grid gap-6">
    <Card class="overflow-hidden border-border bg-card shadow-xl">
      <Tabs v-model="activeTab" class="w-full">
        <TabsList class="grid h-12 w-full grid-cols-2 rounded-none border-b border-border bg-muted/50">
          <TabsTrigger value="camera" class="flex items-center justify-center data-[state=active]:bg-background">
            <Camera class="mr-2 size-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="file" class="flex items-center justify-center data-[state=active]:bg-background">
            <FileText class="mr-2 size-4" />
            PDF Ticket
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" class="mt-0 p-0">
          <div class="relative aspect-square w-full overflow-hidden bg-black">
            <video ref="videoRef" class="h-full w-full object-cover" autoplay muted playsinline />

            <div v-if="!isCameraReady && !cameraError" class="absolute inset-0 flex items-center justify-center p-8">
              <div class="space-y-3 text-center">
                <Loader2 class="mx-auto size-8 animate-spin text-primary" />
                <p class="text-sm text-slate-400">Initializing camera...</p>
              </div>
            </div>

            <div v-if="cameraError" class="absolute inset-0 flex items-center justify-center bg-black/85 p-8 text-center">
              <div class="max-w-sm space-y-3">
                <AlertCircle class="mx-auto size-8 text-destructive" />
                <p class="font-medium text-destructive">Camera scanner unavailable</p>
                <p class="text-sm text-slate-300">{{ cameraError }}</p>
              </div>
            </div>

            <div v-else class="pointer-events-none absolute inset-0 z-10 border-40 border-black/45">
              <div class="relative h-full w-full rounded-2xl border-2 border-primary/50">
                <div class="absolute left-0 top-0 size-8 -translate-x-1 -translate-y-1 border-l-4 border-t-4 border-primary" />
                <div class="absolute right-0 top-0 size-8 translate-x-1 -translate-y-1 border-r-4 border-t-4 border-primary" />
                <div class="absolute bottom-0 left-0 size-8 -translate-x-1 translate-y-1 border-b-4 border-l-4 border-primary" />
                <div class="absolute bottom-0 right-0 size-8 translate-x-1 translate-y-1 border-b-4 border-r-4 border-primary" />

                <div v-if="isScanning" class="absolute inset-x-6 top-1/2 h-0.5 -translate-y-1/2 bg-primary shadow-[0_0_24px_rgba(59,130,246,0.85)]" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-4 py-3">
            <p class="text-xs text-muted-foreground">Posisikan QR code di dalam bingkai. Scanner akan mengisi kode otomatis.</p>
            <span v-if="isScanning" class="text-xs font-medium text-primary">Scanning...</span>
          </div>
        </TabsContent>

        <TabsContent value="file" class="mt-0 p-8">
          <div
            class="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-10 transition-colors hover:border-primary/50 hover:bg-muted/50"
            @dragover.prevent
            @drop.prevent="handleFileDrop"
          >
            <input type="file" accept="application/pdf" class="absolute inset-0 cursor-pointer opacity-0" @change="handleFileSelect" />

            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UploadCloud class="size-8" />
            </div>

            <h3 class="text-lg font-medium">Klik atau drop file PDF tiket</h3>
            <p class="mt-1 text-center text-sm text-muted-foreground">Backend akan membaca QR code langsung dari PDF ticket.</p>

            <div v-if="selectedFile" class="mt-6 flex w-full items-center gap-3 rounded-lg border border-border bg-background p-3">
              <div class="flex h-10 w-10 items-center justify-center rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <FileText class="size-5" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">{{ selectedFile.name }}</p>
                <p class="text-xs text-muted-foreground">{{ (selectedFile.size / 1024).toFixed(2) }} KB</p>
              </div>
              <Button variant="ghost" size="icon" @click.stop="setSelectedFile(null)">
                <X class="size-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>

    <Card v-if="scannedCode || selectedFile || isProcessing" class="border-primary/20 bg-primary/5">
      <div class="flex items-center gap-4 p-6">
        <div class="flex-1 space-y-1">
          <p class="text-xs font-semibold uppercase tracking-wider text-primary">Ticket Ready</p>
          <p v-if="activeTab === 'camera'" class="break-all font-mono text-sm">
            {{ scannedCode ?? 'Waiting for QR code...' }}
          </p>
          <p v-else class="break-all font-mono text-sm">
            {{ selectedFile?.name ?? 'Waiting for PDF...' }}
          </p>
        </div>

        <Button :disabled="!canSubmit" @click="sendToApi">
          <Loader2 v-if="isProcessing" class="mr-2 size-4 animate-spin" />
          <Send v-else class="mr-2 size-4" />
          Verify Ticket
        </Button>
      </div>
    </Card>

    <div
      v-if="apiResult"
      class="flex gap-3 rounded-xl border p-4"
      :class="
        resultSummary?.tone === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400'
          : 'border-destructive/20 bg-destructive/10 text-destructive'
      "
    >
      <component :is="resultSummary?.icon ?? AlertCircle" class="size-5 shrink-0" />
      <div class="text-sm">
        <p class="font-bold">{{ resultSummary?.title ?? 'Gagal Validasi' }}</p>
        <p>{{ apiResult.message }}</p>
      </div>
    </div>
  </section>
</template>
