// API service for Auth
// Auto-imported from app/composables/useAuthApi.ts

import { toast } from 'vue-sonner';
import type { LoginCredentials, RegisterData, LoginResponse, User } from './types';

const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;

export function useAuthApi() {
  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      return await $fetch<LoginResponse>(`${baseUrl}/auth/login`, {
        method: 'POST',
        body: credentials,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      await $fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function register(data: RegisterData): Promise<LoginResponse> {
    try {
      return await $fetch<LoginResponse>(`${baseUrl}/auth/register`, {
        method: 'POST',
        body: data,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async function verifyToken(): Promise<User | null> {
    try {
      return await $fetch<User | null>(`${baseUrl}/auth/verify`);
    } catch (error) {
      toast.error((error as Error).message);
      return null;
    }
  }

  return {
    login,
    logout,
    register,
    verifyToken,
  };
}
