import type { AxiosResponseHeaders } from 'axios';

export class AxiosResponseError extends Error {
  constructor(
    message: string,
    public readonly data: unknown,
    public readonly status: number,
    public readonly headers: AxiosResponseHeaders,
  ) {
    super(message);
  }
}

export const isAxiosResponseError = (error: unknown): error is AxiosResponseError =>
  error instanceof AxiosResponseError;
