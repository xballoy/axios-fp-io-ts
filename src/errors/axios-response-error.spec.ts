import { AxiosResponseError, isAxiosResponseError } from './axios-response-error';

describe('AxiosResponseError', () => {
  describe('instance', () => {
    it('should be an instance of AxiosRequestError', () => {
      const result = new AxiosResponseError('message', 'data', 200, {});

      expect(result).toBeInstanceOf(AxiosResponseError);
    });

    it('should an instance of Error', () => {
      const result = new AxiosResponseError('message', 'data', 200, {});

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('properties', () => {
    describe('AxiosResponseError#message', () => {
      it('should contain message', () => {
        const message = 'message';

        const error = new AxiosResponseError(message, 'data', 200, {});

        expect(error.message).toEqual(message);
      });
    });

    describe('AxiosResponseError#data', () => {
      it('should contain data', () => {
        const data = 'data';

        const error = new AxiosResponseError('message', data, 200, {});

        expect(error.data).toEqual(data);
      });
    });

    describe('AxiosResponseError#status', () => {
      it('should contain status', () => {
        const status = 200;

        const error = new AxiosResponseError('message', 'data', status, {});

        expect(error.status).toEqual(status);
      });
    });

    describe('AxiosResponseError#headers', () => {
      it('should contain headers', () => {
        const headers = {
          'Content-Type': 'application/json',
        };

        const error = new AxiosResponseError('message', 'data', 200, headers);

        expect(error.headers).toEqual(headers);
      });
    });
  });
});

describe('isAxiosResponseError', () => {
  it('should return true when AxiosRequestError', () => {
    const error = new AxiosResponseError('message', 'data', 200, {});

    const result = isAxiosResponseError(error);

    expect(result).toBe(true);
  });

  it('should return false when another error', () => {
    const error = new Error();

    const result = isAxiosResponseError(error);

    expect(result).toBe(false);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty object', {}],
  ])('should return false when %s', (_, error) => {
    const result = isAxiosResponseError(error);

    expect(result).toBe(false);
  });
});
