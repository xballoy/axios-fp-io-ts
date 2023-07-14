export class DecodeError extends Error {
  constructor(
    codecName: string,
    public errors?: string[],
  ) {
    super(`Unable to decode ${codecName}`);
    this.errors = errors ?? [];
  }
}

export const isDecodeError = (error: any): error is DecodeError => error instanceof DecodeError;
