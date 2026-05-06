import type { FetchOptions, FetchRequest, FetchResponse } from 'ofetch';

type HttpOptions = Omit<FetchOptions, 'method'> & {
  method?:
    | 'GET'
    | 'HEAD'
    | 'PATCH'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'CONNECT'
    | 'OPTIONS'
    | 'TRACE'
    | 'get'
    | 'head'
    | 'patch'
    | 'post'
    | 'put'
    | 'delete'
    | 'connect'
    | 'options'
    | 'trace';
  __authRefreshAttempted?: boolean;
};

type HttpClient = {
  <T = unknown>(request: FetchRequest, options?: HttpOptions): Promise<T>;
  raw<T = unknown>(request: FetchRequest, options?: HttpOptions): Promise<FetchResponse<T>>;
};

const AUTH_ENDPOINTS = new Set(['/auth/login', '/auth/register', '/refresh', 'refresh']);

let refreshPromise: Promise<void> | null = null;

const normalizePath = (request: FetchRequest) => {
  if (typeof request === 'string') {
    try {
      return new URL(request, 'http://localhost').pathname.replace(/\/+$/, '') || '/';
    } catch {
      return request.replace(/\/+$/, '') || '/';
    }
  }

  if (request instanceof URL) return request.pathname.replace(/\/+$/, '') || '/';

  if (typeof Request !== 'undefined' && request instanceof Request) {
    try {
      return new URL(request.url).pathname.replace(/\/+$/, '') || '/';
    } catch {
      return request.url.replace(/\/+$/, '') || '/';
    }
  }

  return String(request.url).replace(/\/+$/, '') || '/';
};

const shouldSkipRefresh = (request: FetchRequest) => {
  const path = normalizePath(request);
  return AUTH_ENDPOINTS.has(path) || AUTH_ENDPOINTS.has(path.startsWith('/') ? path.slice(1) : `/${path}`);
};

const getResponseStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') return undefined;

  const fetchError = error as {
    status?: number;
    response?: {
      status?: number;
    };
  };

  return fetchError.status ?? fetchError.response?.status;
};

export const useHttp = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const client = $fetch.create({
    baseURL: config.public.API_URL,
    credentials: 'include',
  });

  const refreshAuth = async () => {
    refreshPromise ??= authStore.refreshToken().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  };

  const requestWithRefresh = async <T>(request: FetchRequest, options?: HttpOptions, useRaw = false): Promise<T> => {
    try {
      return useRaw ? ((await client.raw<T>(request, options)) as T) : await client<T>(request, options);
    } catch (error) {
      const status = getResponseStatus(error);
      const alreadyRetried = options?.__authRefreshAttempted ?? false;

      if (status !== 401 || alreadyRetried || shouldSkipRefresh(request)) throw error;

      try {
        await refreshAuth();
      } catch (refreshError) {
        authStore.clearAuth();
        throw refreshError;
      }

      const retryOptions = {
        ...options,
        __authRefreshAttempted: true,
      } satisfies HttpOptions;

      return useRaw ? ((await client.raw<T>(request, retryOptions)) as T) : await client<T>(request, retryOptions);
    }
  };

  const http = (async <T = unknown>(request: FetchRequest, options?: HttpOptions): Promise<T> => {
    return requestWithRefresh<T>(request, options, false);
  }) as HttpClient;

  http.raw = async <T = unknown>(request: FetchRequest, options?: HttpOptions): Promise<FetchResponse<T>> => {
    return requestWithRefresh<FetchResponse<T>>(request, options, true);
  };

  return http;
};
