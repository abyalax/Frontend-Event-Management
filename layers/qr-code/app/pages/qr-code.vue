<script setup lang="ts">
import { QrCode, ScanLine, ShieldCheck, Zap } from 'lucide-vue-next';
import ScannerQRCode from '../components/ScannerQRCode.vue';
import QRCodeProvider from '../components/QRCodeProvider.vue';
</script>

<template>
  <QRCodeProvider>
    <div class="bg-background text-foreground">
      <div class="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
        <header class="space-y-2">
          <div class="flex items-center gap-3 text-primary">
            <div class="flex size-10 items-center justify-center rounded-2xl bg-primary/10">
              <QrCode class="size-5" />
            </div>
            <div>
              <h1 class="text-2xl font-bold tracking-tight">Check-in Ticket</h1>
              <p class="text-sm text-muted-foreground">Scan QR langsung dari kamera atau unggah PDF tiket ke backend untuk divalidasi.</p>
            </div>
          </div>
        </header>

        <ScannerQRCode />

        <footer class="flex items-center justify-center gap-4 text-muted-foreground">
          <div class="flex items-center gap-1.5 text-xs">
            <ShieldCheck class="size-3" />
            <span>Backend-verified</span>
          </div>
          <div class="h-1 w-1 rounded-full bg-border" />
          <div class="flex items-center gap-1.5 text-xs">
            <ScanLine class="size-3" />
            <span>Camera & PDF flow</span>
          </div>
          <div class="h-1 w-1 rounded-full bg-border" />
          <div class="flex items-center gap-1.5 text-xs">
            <Zap class="size-3" />
            <span>Instant processing</span>
          </div>
        </footer>
      </div>
    </div>
  </QRCodeProvider>
</template>
