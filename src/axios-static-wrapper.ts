import axios, { AxiosRequestConfig } from 'axios';
import { AxiosInstanceWrapper } from './axios-instance-wrapper';

class AxiosStaticWrapper extends AxiosInstanceWrapper {
  constructor() {
    super(axios.create());
  }

  // Keep the same API as axios
  // eslint-disable-next-line class-methods-use-this
  create(config?: AxiosRequestConfig): AxiosInstanceWrapper {
    return new AxiosInstanceWrapper(axios.create(config));
  }
}
export const AxiosWrapper = new AxiosStaticWrapper();
