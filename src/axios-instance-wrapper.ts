import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { type TaskEither, chain, fold, fromEither, left, right, tryCatch } from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import type { Type } from 'io-ts';
import { decodeData } from './decode-data';
import type { AxiosRequestError } from './errors/axios-request-error';
import type { AxiosResponseError } from './errors/axios-response-error';
import type { DecodeError } from './errors/decode-error';
import { handleError } from './handle-error';

type AxiosResponseDataType = AxiosResponse['data'];
type AxiosRequestDataType = AxiosRequestConfig['data'];

export type AxiosWrapperError = AxiosResponseError | AxiosRequestError | Error | DecodeError;

const executeRequestAndValidateData = <T = AxiosResponseDataType, D = AxiosRequestDataType>(
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

  request<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (config: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.request(config));
  }

  get<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.get(url, config));
  }

  delete<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.delete(url, config));
  }

  head<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.head(url, config));
  }

  options<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.options(url, config));
  }

  post<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.post(url, data, config));
  }

  put<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.put(url, data, config));
  }

  patch<T = AxiosResponseDataType, D = AxiosRequestDataType>(codec: Type<T>) {
    return (url: string, data?: D, config?: AxiosRequestConfig<D>): TaskEither<AxiosWrapperError, AxiosResponse<T>> =>
      executeRequestAndValidateData<T, D>(codec, () => this.instance.patch(url, data, config));
  }
}
