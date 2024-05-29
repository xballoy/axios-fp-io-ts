import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { type TaskEither, chain, fold, fromEither, left, right, tryCatch } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import type { Type } from 'io-ts';
import { decodeData } from './decode-data';
import type { AxiosRequestError } from './errors/axios-request-error';
import type { AxiosResponseError } from './errors/axios-response-error';
import type { DecodeError } from './errors/decode-error';
import { handleError } from './handle-error';

export type AxiosWrapperError = AxiosResponseError | AxiosRequestError | Error | DecodeError;

// biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
const executeRequestAndValidateData = <T = any, D = any>(
  codec: Type<T>,
  fn: () => Promise<AxiosResponse<T, D>>,
): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
  pipe(
    tryCatch(fn, (reason) => handleError(reason)),
    chain((response) => pipe(response, decodeData(codec), fromEither)),
    fold(
      (error) => left(error),
      (response) => right(response),
    ),
  );

export class AxiosInstanceWrapper {
  constructor(private readonly instance: AxiosInstance) {}

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  request<T = any, D = any>(codec: Type<T>) {
    return (config: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.request(config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  get<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.get(url, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  delete<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.delete(url, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  head<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.head(url, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  options<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.options(url, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  post<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.post(url, data, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  put<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.put(url, data, config));
  }

  // biome-ignore lint/suspicious/noExplicitAny: matches Axios typings
  patch<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.patch(url, data, config));
  }
}
