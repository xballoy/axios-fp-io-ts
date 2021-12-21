import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

const input = 'src/index.ts';
const externalLibs = ['axios', 'fp-ts/Either', 'fp-ts/function', 'fp-ts/TaskEither', 'io-ts/PathReporter'];

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const main = pkg.main as string;
const types = pkg.types as string;
/* eslint-enable */

const config = defineConfig([
  {
    input,
    output: {
      file: main,
      format: 'es',
    },
    external: externalLibs,
    plugins: [esbuild()],
  },
  {
    input,
    output: {
      file: types,
      format: 'es',
    },
    plugins: [dts()],
  },
]);

export default config;
