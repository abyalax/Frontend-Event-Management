<script lang="ts" setup>
import { toast } from "vue-sonner";
import ConfirmDialog from "../confirm/ConfirmDialog.vue";

const open = defineModel<boolean>("open", { default: false });
const handleAction = () => toast.info("This button is just cosmetics UI");
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Sign Out"
    desc="Are you sure you want to sign out? You will need to sign in again to access your account."
    destructive
    :is-loading="false"
    class="sm:max-w-sm"
    @confirm="handleAction"
  />
</template>
