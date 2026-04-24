<script setup lang="ts">
import { Button } from '~/layers/shared/app/components/ui/button';
import type { User } from '../types';

const props = defineProps<User>();

const { mutate: deleteUser } = useDeleteUser();

const handleDelete = () => deleteUser(props.id);
</script>

<template>
  <div class="flex gap-2">
    <Button variant="outline" size="sm">Edit</Button>
    <Button variant="destructive" size="sm" @click="handleDelete">Delete</Button>
  </div>
</template>
