<script setup lang="ts">
import Page from '~~/layers/shared/app/components/layouts/Page.vue';
import P from '~~/layers/shared/app/components/ui/typography/P.vue';

definePageMeta({
  layout: 'user-layout',
  middleware: 'authorization',
});

const breadcrumbs = [
  {
    title: 'Home',
    url: '/users',
    active: false,
  },
];

const { data: list } = await useFetch('/api/users');
const { data: user } = await useFetch('/api/users/1');

console.info(list.value);
console.info(user.value);
</script>

<template>
  <Page title="Users" :breadcrumbs="breadcrumbs">
    <template #children>
      <P class="text-red-600">Ini adalah content master data user page</P>
    </template>
  </Page>
</template>
