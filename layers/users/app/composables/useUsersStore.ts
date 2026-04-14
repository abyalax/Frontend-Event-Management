// Pinia store for Users
// Auto-imported from app/composables/useUsersStore.ts

import { defineStore } from "pinia";
import type {
  UsersListResponse,
  CreateUserData,
  UpdateUserData,
  UsersState,
} from "./types";

export const useUsersStore = defineStore("users", () => {
  const state = ref<UsersState>({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
  });

  const usersApi = useUsersApi();

  // Getters
  const users = computed(() => state.value.users);
  const isLoading = computed(() => state.value.loading);
  const currentUser = computed(() => state.value.currentUser);

  // Actions
  async function fetchAll(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    state.value.loading = true;
    state.value.error = null;

    try {
      const response: UsersListResponse = await usersApi.getAll(params);
      state.value.users = response.users;
      return response;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  async function fetchById(id: string) {
    state.value.loading = true;
    state.value.error = null;

    try {
      const user = await usersApi.getById(id);
      state.value.currentUser = user;
      return user;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  async function create(data: CreateUserData) {
    state.value.loading = true;
    state.value.error = null;

    try {
      const user = await usersApi.create(data);
      state.value.users.push(user);
      return user;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  async function update(id: string, data: UpdateUserData) {
    state.value.loading = true;
    state.value.error = null;

    try {
      const user = await usersApi.update(id, data);
      const index = state.value.users.findIndex((u) => u.id === id);
      if (index >= 0) {
        state.value.users[index] = user;
      }
      if (state.value.currentUser?.id === id) {
        state.value.currentUser = user;
      }
      return user;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  async function delete_(id: string) {
    state.value.loading = true;
    state.value.error = null;

    try {
      await usersApi.delete(id);
      state.value.users = state.value.users.filter((u) => u.id !== id);
      if (state.value.currentUser?.id === id) {
        state.value.currentUser = null;
      }
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loading = false;
    }
  }

  return {
    // State
    users,
    currentUser,
    isLoading,

    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    delete: delete_,
  };
});
