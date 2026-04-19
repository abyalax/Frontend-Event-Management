<script setup lang="ts">
import Page from '~~/layers/shared/app/components/layouts/Page.vue';
import P from '~~/layers/shared/app/components/ui/typography/P.vue';

definePageMeta({
  middleware: 'authorization',
});

const breadcrumbs = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    active: true,
  },
];
</script>

<template>
  <Page title="Dashboard" :breadcrumbs="breadcrumbs">
    <template #children>
      <P class="text-white">Ini adalah content dashboard</P>
    </template>
  </Page>
</template>
