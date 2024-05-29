import axios, { type AxiosError } from 'axios';
import { AxiosRequestError } from './errors/axios-request-error';
import { AxiosResponseError } from './errors/axios-response-error';

const handleAxiosError = (error: AxiosError) => {
  const { message } = error;
  if (error.response) {
    const { data, status, headers } = error.response;

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return new AxiosResponseError(message, data, status, headers);
  }
  if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    return new AxiosRequestError(message, error.request);
  }
  // Something happened in setting up the request that triggered an Error
  return new Error(message);
};

export const handleError = (error: unknown) => {
  if (!error) {
    return new Error('Unknown error');
  }

  if (axios.isAxiosError(error)) {
    return handleAxiosError(error);
  }

  if (error instanceof Error) {
    return error;
  }

  if (typeof error === 'object') {
    return new Error(JSON.stringify(error));
  }

  return new Error(String(error));
};
