import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { pipe } from 'fp-ts/function';
import { TaskEither, chain, fold, fromEither, left, right, tryCatch } from 'fp-ts/TaskEither';
import { Type } from 'io-ts';
import { decodeData } from './decode-data';
import { AxiosRequestError } from './errors/axios-request-error';
import { AxiosResponseError } from './errors/axios-response-error';
import { DecodeError } from './errors/decode-error';
import { handleError } from './handle-error';

export type AxiosWrapperError = AxiosResponseError | AxiosRequestError | Error | DecodeError;

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

  request<T = any, D = any>(codec: Type<T>) {
    return (config: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.request(config));
  }

  get<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.get(url, config));
  }

  delete<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.delete(url, config));
  }

  head<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.head(url, config));
  }

  options<T = any, D = any>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.options(url, config));
  }

  post<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.post(url, data, config));
  }

  put<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.put(url, data, config));
  }

  patch<T = any, D = any>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.patch(url, data, config));
  }
}
