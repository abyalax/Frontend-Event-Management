<script lang="ts" setup>
import { toast } from "vue-sonner";
import Button from "~~/layers/shared/app/components/ui/button/Button.vue";

const handleClick = () => toast.info("Workss");
</script>
<template>
  <div class="p-6 bg-amber-600 h-11">
    <h1 class="text-2xl mb-4">Auth — Login</h1>
    <Button @click="handleClick">Login</Button>
  </div>
</template>
