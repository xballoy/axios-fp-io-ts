import { fail } from 'node:assert';
import { isLeft, isRight } from 'fp-ts/Either';
import * as t from 'io-ts';
import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import type { AxiosInstanceWrapper } from './axios-instance-wrapper';
import { AxiosWrapper } from './axios-static-wrapper';
import { AxiosRequestError } from './errors/axios-request-error';
import { AxiosResponseError } from './errors/axios-response-error';
import { DecodeError } from './errors/decode-error';
import { server } from './mocks/server';

describe('AxiosInstanceWrapper', () => {
  const ENDPOINT_MOCK = 'https://localhost';
  const UserCodec = t.type(
    {
      userId: t.string,
      name: t.string,
    },
    'User',
  );
  const VALID_DATA = {
    userId: 'userId',
    name: 'John Doe',
  };
  const INVALID_DATA = {
    userId: 'userId',
  };

  let cut: AxiosInstanceWrapper;

  type Method = 'get' | 'delete' | 'head' | 'options' | 'post' | 'put' | 'patch';
  const mockServerResponse = (method: Method, status: number, data: unknown) => {
    server.use(
      http[method](
        ENDPOINT_MOCK,
        () =>
          new Response(JSON.stringify(data), {
            status,
            headers: {
              'Content-Type': 'application/json',
            },
          }),
      ),
    );
  };

  beforeEach(() => {
    cut = AxiosWrapper.create();
  });

  describe('request', () => {
    describe.each([
      ['get' as const],
      ['delete' as const],
      ['options' as const],
      ['post' as const],
      ['put' as const],
      ['patch' as const],
    ])('%s', (method) => {
      describe('when response is successful', () => {
        describe('when data matches the codec', () => {
          beforeEach(() => {
            mockServerResponse(method, 200, VALID_DATA);
          });

          it('should return an AxiosResponse', async () => {
            const result = await cut.request(UserCodec)({
              method,
              url: ENDPOINT_MOCK,
            })();

            if (!isRight(result)) {
              fail('result should be right');
            }

            expect(result.right.data).toEqual(VALID_DATA);
            expect(result.right.status).toBeTruthy();
            expect(result.right.headers).toBeTruthy();
            expect(result.right.config).toBeTruthy();
            expect(result.right.request).toBeTruthy();
          });
        });

        describe('when data does not match the codec', () => {
          beforeEach(() => {
            mockServerResponse(method, 200, INVALID_DATA);
          });

          it('should return a DecodeError', async () => {
            const result = await cut.request(UserCodec)({
              method,
              url: ENDPOINT_MOCK,
            })();

            if (!isLeft(result)) {
              fail('result should be left');
            }

            expect(result.left).toBeInstanceOf(DecodeError);
          });
        });
      });

      describe('when response is not successful', () => {
        beforeEach(() => {
          mockServerResponse(method, 500, 'error');
        });

        it('should return a AxiosResponseError', async () => {
          const result = await cut.request(UserCodec)({
            method,
            url: ENDPOINT_MOCK,
          })();

          if (!isLeft(result)) {
            fail('result should be left');
          }

          expect(result.left).toBeInstanceOf(AxiosResponseError);
        });
      });
    });
  });

  describe.each([
    ['get' as const],
    ['delete' as const],
    ['options' as const],
    ['post' as const],
    ['put' as const],
    ['patch' as const],
  ])('%s', (method) => {
    describe('when response is successful', () => {
      describe('when data matches the codec', () => {
        beforeEach(() => {
          mockServerResponse(method, 200, VALID_DATA);
        });

        it('should return an AxiosResponse', async () => {
          const result = await cut[method](UserCodec)(ENDPOINT_MOCK)();

          if (!isRight(result)) {
            fail('result should be right');
          }

          expect(result.right.data).toEqual(VALID_DATA);
          expect(result.right.status).toBeTruthy();
          expect(result.right.headers).toBeTruthy();
          expect(result.right.config).toBeTruthy();
          expect(result.right.request).toBeTruthy();
        });
      });

      describe('when data does not match the codec', () => {
        beforeEach(() => {
          mockServerResponse(method, 200, INVALID_DATA);
        });

        it('should return a DecodeError', async () => {
          const result = await cut[method](UserCodec)(ENDPOINT_MOCK)();

          if (!isLeft(result)) {
            fail('result should be left');
          }

          expect(result.left).toBeInstanceOf(DecodeError);
        });
      });
    });

    describe('when response is not successful', () => {
      beforeEach(() => {
        mockServerResponse(method, 500, 'error');
      });

      it('should return an AxiosResponseError', async () => {
        const result = await cut[method](UserCodec)(ENDPOINT_MOCK)();

        if (!isLeft(result)) {
          fail('result should be left');
        }

        expect(result.left).toBeInstanceOf(AxiosResponseError);
      });
    });

    describe('when intended exception', () => {
      beforeEach(() => {
        server.use(http[method](ENDPOINT_MOCK, () => HttpResponse.error()));
      });

      it('should return an AxiosResponseError', async () => {
        const result = await cut[method](UserCodec)(ENDPOINT_MOCK)();

        if (!isLeft(result)) {
          fail('result should be left');
        }

        expect(result.left).toBeInstanceOf(AxiosRequestError);
      });
    });
  });
});
