// Pinia store for Auth
// Auto-imported from app/composables/useAuthStore.ts

import { defineStore } from "pinia";
import type { AuthState } from "./types";

export const useAuthStore = defineStore("auth", () => {
  const state = ref<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loadingAuth: false,
    error: null,
  });

  const authApi = useAuthApi();

  // Getters
  const user = computed(() => state.value.user);
  const isAuthenticated = computed(() => state.value.isAuthenticated);
  const isLoading = computed(() => state.value.loadingAuth);

  // Actions
  async function login(email: string, password: string) {
    state.value.loadingAuth = true;
    state.value.error = null;

    try {
      const { token, user: loginUser } = await authApi.login({
        email,
        password,
      });

      state.value.token = token;
      state.value.user = loginUser;
      state.value.isAuthenticated = true;

      // Store token (implement based on your needs)
      localStorage.setItem("auth_token", token);

      return loginUser;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loadingAuth = false;
    }
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      state.value.user = null;
      state.value.token = null;
      state.value.isAuthenticated = false;
      localStorage.removeItem("auth_token");
    }
  }

  async function register(name: string, email: string, password: string) {
    state.value.loadingAuth = true;
    state.value.error = null;

    try {
      const { token, user: newUser } = await authApi.register({
        name,
        email,
        password,
      });

      state.value.token = token;
      state.value.user = newUser;
      state.value.isAuthenticated = true;

      localStorage.setItem("auth_token", token);

      return newUser;
    } catch (error) {
      state.value.error = String(error);
      throw error;
    } finally {
      state.value.loadingAuth = false;
    }
  }

  async function checkAuth() {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    state.value.token = token;
    const user = await authApi.verifyToken();
    if (user) {
      state.value.user = user;
      state.value.isAuthenticated = true;
    }
  }

  return {
    // State
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    logout,
    register,
    checkAuth,
  };
});
