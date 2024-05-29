import type { AxiosResponse } from 'axios';
import { isRight, left, right } from 'fp-ts/Either';
import type { Type } from 'io-ts';
import { PathReporter } from 'io-ts/PathReporter';
import { DecodeError } from './errors/decode-error';

export const decodeData =
  <T>(codec: Type<T>) =>
  (response: AxiosResponse<T>) => {
    const { data } = response;
    const decodedData = codec.decode(data);
    if (isRight(decodedData)) {
      return right(response);
    }
    return left(new DecodeError(codec.name, PathReporter.report(decodedData)));
  };
