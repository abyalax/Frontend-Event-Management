import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ENDPOINT } from '~/layers/shared/app/common/const/endpoint';
import { useHttp } from '~/layers/shared/app/composable/useHttp';

const mocks = vi.hoisted(() => {
  const refreshToken = vi.fn();
  const clearAuth = vi.fn();
  const httpClient = vi.fn();
  const fetchCreate = vi.fn(() => httpClient);

  return {
    refreshToken,
    clearAuth,
    httpClient,
    fetchCreate,
  };
});

vi.mock('~/layers/auth/app/composables/useAuthStore', () => ({
  useAuthStore: () => ({
    user: undefined,
    isAuthenticated: false,
    refreshToken: mocks.refreshToken,
    clearAuth: mocks.clearAuth,
    hydrateFromStorage: vi.fn(),
    setAuthenticated: vi.fn(),
    setUser: vi.fn(),
  }),
}));

vi.stubGlobal('$fetch', {
  create: mocks.fetchCreate,
});

describe('useHttp', () => {
  beforeEach(() => {
    mocks.refreshToken.mockReset();
    mocks.clearAuth.mockReset();
    mocks.httpClient.mockReset();
    mocks.fetchCreate.mockClear().mockReturnValue(mocks.httpClient);
  });

  it('retries the original request after a successful refresh', async () => {
    mocks.httpClient
      .mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }))
      .mockResolvedValueOnce({ data: { ok: true } });
    mocks.refreshToken.mockResolvedValueOnce(undefined);

    const http = useHttp();
    const result = await http<{ data: { ok: boolean } }>(ENDPOINT.EVENTS, {
      method: 'GET',
    });

    expect(result).toEqual({ data: { ok: true } });
    expect(mocks.refreshToken).toHaveBeenCalledTimes(1);
    expect(mocks.httpClient).toHaveBeenCalledTimes(2);
    expect(mocks.fetchCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        credentials: 'include',
      }),
    );
  });

  it('skips refresh for auth endpoints', async () => {
    mocks.httpClient.mockRejectedValueOnce(Object.assign(new Error('Unauthorized'), { status: 401 }));

    const http = useHttp();

    await expect(
      http(ENDPOINT.LOGIN, {
        method: 'POST',
        body: { email: 'john@example.com', password: 'secret' },
      }),
    ).rejects.toThrow('Unauthorized');

    expect(mocks.refreshToken).not.toHaveBeenCalled();
    expect(mocks.httpClient).toHaveBeenCalledTimes(1);
  });
});
