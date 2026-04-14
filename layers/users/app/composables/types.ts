// Type definitions for Users layer
// Auto-imported from app/composables/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: "user" | "admin";
  status?: "active" | "inactive";
}

export interface UsersListResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UsersState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}
