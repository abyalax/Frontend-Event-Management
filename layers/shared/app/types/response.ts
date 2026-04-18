export type TResponse<T = unknown> = {
  message?: string;
  error?: string[] | string;
  data: T;
};
