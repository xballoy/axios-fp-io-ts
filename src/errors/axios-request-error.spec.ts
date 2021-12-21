import { AxiosRequestError, isAxiosRequestError } from './axios-request-error';

describe('AxiosRequestError', () => {
  describe('instance', () => {
    it('should be an instance of AxiosRequestError', () => {
      const result = new AxiosRequestError('message', 'request');

      expect(result).toBeInstanceOf(AxiosRequestError);
    });

    it('should be an instance of Error', () => {
      const result = new AxiosRequestError('message', 'request');

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('properties', () => {
    describe('AxiosRequestError#message', () => {
      it('should contain message', () => {
        const message = 'message';

        const error = new AxiosRequestError(message, 'request');

        expect(error.message).toEqual(message);
      });
    });

    describe('AxiosRequestError#request', () => {
      it('should contain request', () => {
        const request = 'request';

        const error = new AxiosRequestError('message', request);

        expect(error.request).toEqual(request);
      });
    });
  });
});

describe('isAxiosResponseError', () => {
  it('should return true when AxiosRequestError', () => {
    const error = new AxiosRequestError('message', 'request');

    const result = isAxiosRequestError(error);

    expect(result).toBe(true);
  });

  it('should return false when another error', () => {
    const error = new Error();

    const result = isAxiosRequestError(error);

    expect(result).toBe(false);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty object', {}],
  ])('should return false when %s', (_, error) => {
    const result = isAxiosRequestError(error);

    expect(result).toBe(false);
  });
});
