import { AxiosWrapper } from './axios-static-wrapper';

export { AxiosRequestError, isAxiosRequestError } from './errors/axios-request-error';
export { AxiosResponseError, isAxiosResponseError } from './errors/axios-response-error';
export { DecodeError, isDecodeError } from './errors/decode-error';

export type { AxiosWrapperError } from './axios-instance-wrapper';

// Library entry point
// eslint-disable-next-line import/no-default-export
export default AxiosWrapper;
