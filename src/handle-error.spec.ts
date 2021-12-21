import { AxiosResponse } from 'axios';
import { AxiosRequestError } from './errors/axios-request-error';
import { AxiosResponseError } from './errors/axios-response-error';
import { handleError } from './handle-error';

describe('handleError', () => {
  let error: unknown;

  describe('when error is an AxiosError', () => {
    const getAxiosError = (message: string, response?: AxiosResponse, request?: any) => ({
      isAxiosError: true,
      message,
      response,
      request,
    });

    const getAxiosResponseMock = (): AxiosResponse => ({
      data: {
        userId: 'userId',
      },
      status: 500,
      statusText: 'OK',
      config: {
        url: 'http://localhost',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const getAxiosRequestMock = () => 'axios_request';

    describe('when a response is received', () => {
      beforeEach(() => {
        error = getAxiosError('message', getAxiosResponseMock(), getAxiosRequestMock());
      });

      it('should return an AxiosResponseError', () => {
        const result = handleError(error);

        expect(result).toBeInstanceOf(AxiosResponseError);
      });

      it('should contains message', () => {
        const result = handleError(error);

        expect(result.message).toEqual('message');
      });

      it('should contains data', () => {
        const result = handleError(error);

        expect((<AxiosResponseError>result).data).toEqual({
          userId: 'userId',
        });
      });

      it('should contains status', () => {
        const result = handleError(error);

        expect((<AxiosResponseError>result).status).toEqual(500);
      });

      it('should contains headers', () => {
        const result = handleError(error);

        expect((<AxiosResponseError>result).headers).toEqual({
          'Content-Type': 'application/json',
        });
      });
    });

    describe('when no response is received', () => {
      beforeEach(() => {
        error = getAxiosError('message', undefined, getAxiosRequestMock());
      });

      it('should return an AxiosRequestError', () => {
        const result = handleError(error);

        expect(result).toBeInstanceOf(AxiosRequestError);
      });

      it('should contains message', () => {
        const result = handleError(error);

        expect(result.message).toEqual('message');
      });

      it('should contains request', () => {
        const result = handleError(error);

        expect((<AxiosRequestError>result).request).toEqual('axios_request');
      });
    });

    describe('when an error is triggered while setting the request', () => {
      beforeEach(() => {
        error = getAxiosError('message');
      });

      it('should return an Error', () => {
        const result = handleError(error);

        expect(result).toBeInstanceOf(Error);
      });

      it('should contains message', () => {
        const result = handleError(error);

        expect(result.message).toEqual('message');
      });
    });
  });

  describe('when error is not an AxiosError', () => {
    describe('when error is instance of error', () => {
      beforeEach(() => {
        error = new Error('root_error');
      });

      it('should return the original error', () => {
        const result = handleError(error);

        expect(result).toEqual(error);
      });
    });

    describe('when error is an object', () => {
      beforeEach(() => {
        error = {
          foo: 'bar',
        };
      });

      it('should return a new error with the serialized object', () => {
        const result = handleError(error);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toEqual('{"foo":"bar"}');
      });
    });

    describe.each([
      ['null', null],
      ['undefined', undefined],
    ])('when error is %s', (_, errorCase) => {
      it('should return an error', () => {
        const result = handleError(errorCase);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toEqual('Unknown error');
      });
    });

    describe('when error is not an Error, an Object or falsy', () => {
      beforeEach(() => {
        error = 123;
      });

      it('should return a new error with the serialized valued', () => {
        const result = handleError(error);

        expect(result).toBeInstanceOf(Error);
        expect(result.message).toEqual('123');
      });
    });
  });
});
