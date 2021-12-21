# Axios IO-TS

[![Build](https://github.com/xballoy/axios-fp-io-ts/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/xballoy/axios-fp-io-ts/actions/workflows/build.yml)

A wrapper around `axios` which uses `io-ts` to validate the received response.

## Installation

To install the stable version:

```shell
npm install axios-fp-io-ts
```

You must also install peer dependencies listed by:

```shell
npm info "axios-fp-io-ts@latest" peerDependencies
```

## Usage

```typescript
import { AxiosResponse } from 'axios';
import axiosWrapper, {
  AxiosWrapperError,
  isAxiosRequestError,
  isAxiosResponseError,
  isDecodeError,
} from 'axios-fp-io-ts';
import { Either, isRight } from 'fp-ts/Either';
import * as t from 'io-ts';

const getUsers = async () => {
  const UsersCodec = t.array(
    t.type({
      userId: t.string,
      name: t.string,
    }),
    'Users'
  );
  type Users = t.TypeOf<typeof UsersCodec>;

  const eitherResponse: Either<AxiosWrapperError, AxiosResponse> = await axiosWrapper.get(UsersCodec)(
    'https://localhost/users'
  )();

  if (isRight(eitherResponse)) {
    // response.right is an AxiosResponse
    const { data, config, status, statusText, headers, request } = eitherResponse.right;

    // Data is a valid list of User as defined by UsersCodec
    const users: Users = data;
    console.log(users);
  } else {
    // response.left is an AxiosWrapperError

    // You can use the type guards to get a more specific error
    if (isDecodeError(eitherResponse.left)) {
      // Narrowed to DecodeError

      // Get the message
      console.log(eitherResponse.left.message);

      // Get the list of errors
      console.log(eitherResponse.left.errors);
    } else if (isAxiosResponseError(eitherResponse.left)) {
      // Narrowed to AxiosResponseError

      // Get the message
      console.log(eitherResponse.left.message);

      // Get the data (type is unknown)
      console.log(eitherResponse.left.data);

      // Get the response headers
      console.log(eitherResponse.left.headers);

      // Get the response status
      console.log(eitherResponse.left.status);
    } else if (isAxiosRequestError(eitherResponse.left)) {
      // Narrowed to AxiosResponseError

      // Get the message
      console.log(eitherResponse.left.message);

      // Get the request
      console.log(eitherResponse.left.request);
    } else {
      // Narrowed to Error

      // Get the message
      console.log(eitherResponse.left.message);
    }
  }
};
```

## License

[MIT](./LICENSE.md)
