import { DecodeError, isDecodeError } from './decode-error';

describe('DecodeError', () => {
  describe('instance', () => {
    it('should be an instance of DecodeError', () => {
      const result = new DecodeError('CodecName');

      expect(result).toBeInstanceOf(DecodeError);
    });

    it('should an instance of Error', () => {
      const result = new DecodeError('CodecName');

      expect(result).toBeInstanceOf(Error);
    });
  });

  describe('properties', () => {
    describe('DecodeError#message', () => {
      it('should contain message', () => {
        const codecName = 'CodecName';

        const error = new DecodeError(codecName);

        expect(error.message).toEqual('Unable to decode CodecName');
      });
    });

    describe('DecodeError#errors', () => {
      describe.each([
        ['undefined', undefined],
        ['null', null],
      ])('when errors is %s', (_, errors) => {
        it('should contain an empty list of errors', () => {
          const error = new DecodeError('CodecName', errors as unknown as string[]);

          expect(error.errors).toHaveLength(0);
        });
      });

      describe('when errors is defined', () => {
        it('should contain an empty list of errors', () => {
          const errors = ['error1', 'error2'];
          const error = new DecodeError('CodecName', errors);

          expect(error.errors).toHaveLength(2);
          expect(error.errors).toEqual(errors);
        });
      });
    });
  });
});

describe('isDecodeError', () => {
  it('should return true when DecodeError', () => {
    const error = new DecodeError('message');

    const result = isDecodeError(error);

    expect(result).toBe(true);
  });

  it('should return false when another error', () => {
    const error = new Error();

    const result = isDecodeError(error);

    expect(result).toBe(false);
  });

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['empty object', {}],
  ])('should return false when %s', (_, error) => {
    const result = isDecodeError(error);

    expect(result).toBe(false);
  });
});
