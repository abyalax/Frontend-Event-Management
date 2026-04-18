<script setup lang="ts">
import Page from '~~/layers/shared/app/components/layouts/Page.vue';
import P from '~~/layers/shared/app/components/ui/typography/P.vue';

definePageMeta({
  middleware: 'authorization',
});

const breadcrumbs = [
  {
    title: 'Users',
    url: '/users',
    active: false,
  },
];
</script>

<template>
  <Page title="Users" :breadcrumbs="breadcrumbs">
    <template #children>
      <P class="text-white">Ini adalah content dashboard</P>
    </template>
  </Page>
</template>
