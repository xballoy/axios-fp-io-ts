import { describe, expect, it } from 'vitest';
import { AxiosInstanceWrapper } from './axios-instance-wrapper';
import { AxiosWrapper } from './axios-static-wrapper';

describe('AxiosStaticWrapper', () => {
  it('should be an instance of AxiosInstanceWrapper', () => {
    expect(AxiosWrapper).toBeInstanceOf(AxiosInstanceWrapper);
  });

  describe('create', () => {
    it('should return an instance of AxiosInstanceWrapper', () => {
      const result = AxiosWrapper.create({});

      expect(result).toBeInstanceOf(AxiosInstanceWrapper);
    });
  });
});
