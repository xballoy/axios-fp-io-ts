import { AxiosResponse } from 'axios';
import { isLeft, isRight } from 'fp-ts/Either';
import * as t from 'io-ts';
import { decodeData } from './decode-data';
import { DecodeError } from './errors/decode-error';

describe('decodeData', () => {
  const UserCodec = t.type(
    {
      userId: t.string,
      name: t.string,
    },
    'User',
  );
  let axiosResponse: AxiosResponse;

  const getAxiosResponse = (data: unknown) => ({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  });

  describe('when data matches the codec', () => {
    beforeEach(() => {
      axiosResponse = getAxiosResponse({
        userId: '123',
        name: 'John Doe',
      });
    });

    it('should return right', () => {
      const result = decodeData(UserCodec)(axiosResponse);

      expect(isRight(result)).toBe(true);
    });

    it('should return AxiosResponse', () => {
      const result = decodeData(UserCodec)(axiosResponse);

      if (!isRight(result)) {
        fail('result should be right');
      }

      expect(result.right).toEqual(axiosResponse);
    });
  });

  describe('when data does not match the codec', () => {
    beforeEach(() => {
      axiosResponse = getAxiosResponse({
        userId: '123',
      });
    });

    it('should return left', () => {
      const result = decodeData(UserCodec)(axiosResponse);

      expect(isLeft(result)).toBe(true);
    });

    it('should return DecodeError', () => {
      const result = decodeData(UserCodec)(axiosResponse);

      if (!isLeft(result)) {
        fail('result should be left');
      }

      expect(result.left).toBeInstanceOf(DecodeError);
      expect(result.left.message).toEqual('Unable to decode User');
      expect(result.left.errors).toEqual(['Invalid value undefined supplied to : User/name: string']);
    });
  });
});
