import { defineStore } from 'pinia';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import type { TResponse } from '~/layers/shared/app/types/response';
import type { User } from '~/layers/users/app/types';
import type { AuthState } from './types';
import { computed, ref, watch } from 'vue';

const createInitialState = (): AuthState => ({
  user: undefined,
  isAuthenticated: false,
});

export const useAuthStore = defineStore('auth', () => {
  const state = ref<AuthState>(createInitialState());

  const user = computed(() => state.value.user);
  const isAuthenticated = computed(() => state.value.isAuthenticated);

  const setUser = (user: User) => {
    state.value.user = user;
    state.value.isAuthenticated = true;
    state.value.error = undefined;
  };

  const setAuthenticated = (authenticated: boolean) => {
    state.value.isAuthenticated = authenticated;
  };

  const clearAuth = () => {
    Object.assign(state.value, createInitialState());
  };

  const clearError = () => {
    state.value.error = undefined;
  };

  function hydrateFromStorage() {
    const userJson = localStorage.getItem('auth_user');

    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        setUser(user);
      } catch {
        clearAuth();
        localStorage.removeItem('auth_user');
      }
    }
  }

  const refreshToken = async () => {
    try {
      await $fetch<TResponse>(ENDPOINT.REFRESH, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  watch(
    () => state.value.user,
    (newUser) => {
      if (newUser) {
        localStorage.setItem('auth_user', JSON.stringify(newUser));
      } else {
        localStorage.removeItem('auth_user');
      }
    }
  );

  return {
    // State
    user,
    isAuthenticated,

    // Actions
    setUser,
    setAuthenticated,
    clearAuth,
    clearError,
    hydrateFromStorage,
    refreshToken,
  };
});
