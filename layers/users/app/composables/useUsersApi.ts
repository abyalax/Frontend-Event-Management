// API service for Users
// Auto-imported from app/composables/useUsersApi.ts

import type { User, CreateUserData, UpdateUserData, UsersListResponse } from './types';

const config = useRuntimeConfig();
const baseUrl = config.public.apiBaseUrl;

export function useUsersApi() {
  async function getAll(params?: { page?: number; limit?: number; search?: string }): Promise<UsersListResponse> {
    const query = new URLSearchParams();

    if (params?.page) query.append('page', String(params.page));
    if (params?.limit) query.append('limit', String(params.limit));
    if (params?.search) query.append('search', params.search);

    try {
      const url: string = `${baseUrl}/users?${query.toString()}`;
      return await $fetch<UsersListResponse>(url);
    } catch (error) {
      console.error('GetAll users error:', error);
      throw error;
    }
  }

  async function getById(id: string): Promise<User> {
    try {
      return await $fetch<User>(`${baseUrl}/users/${id}`);
    } catch (error) {
      console.error('GetById user error:', error);
      throw error;
    }
  }

  async function create(data: CreateUserData): Promise<User> {
    try {
      return await $fetch<User>(`${baseUrl}/users`, {
        method: 'POST',
        body: data,
      });
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async function update(id: string, data: UpdateUserData): Promise<User> {
    try {
      return await $fetch<User>(`${baseUrl}/users/${id}`, {
        method: 'PUT',
        body: data,
      });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async function delete_(id: string): Promise<void> {
    try {
      await $fetch<null>(`${baseUrl}/users/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  return {
    getAll,
    getById,
    create,
    update,
    delete: delete_,
  };
}
