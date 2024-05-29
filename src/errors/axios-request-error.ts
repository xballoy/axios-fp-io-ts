export class AxiosRequestError extends Error {
  constructor(
    message: string,
    public readonly request: unknown,
  ) {
    super(message);
  }
}

export const isAxiosRequestError = (error: unknown): error is AxiosRequestError => error instanceof AxiosRequestError;
