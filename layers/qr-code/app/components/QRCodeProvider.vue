<script lang="ts" setup>
import { setupQRCodeProvider } from '../context/useQRCodeContext';

setupQRCodeProvider();
</script>

<template>
  <slot />
</template>
