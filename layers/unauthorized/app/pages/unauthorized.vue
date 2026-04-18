<script setup lang="ts">
import { ArrowLeft, Home, ShieldAlert } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { Button } from '~/layers/shared/app/components/ui/button';

const router = useRouter();

const goBack = () => router.back();
const goHome = () => router.push('/');
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-md">
      <div class="flex justify-center">
        <div class="p-6 bg-destructive/10 rounded-full">
          <ShieldAlert class="w-16 h-16 text-destructive" />
        </div>
      </div>

      <div class="space-y-2">
        <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">Akses Ditolak</h1>
        <p class="text-muted-foreground text-lg">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi admin atau kembali ke beranda.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button variant="outline" class="w-full sm:w-auto flex items-center gap-2" @click="goBack">
          <ArrowLeft class="w-4 h-4" />
          Kembali
        </Button>

        <Button class="w-full sm:w-auto flex items-center gap-2" @click="goHome">
          <Home class="w-4 h-4" />
          Ke Beranda
        </Button>
      </div>
    </div>
  </div>
</template>
