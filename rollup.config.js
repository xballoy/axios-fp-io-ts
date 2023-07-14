import { defineConfig } from 'rollup';
import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json' assert { type: 'json' };

const input = 'src/index.ts';
const externalLibs = ['axios', 'fp-ts/Either', 'fp-ts/function', 'fp-ts/TaskEither', 'io-ts/PathReporter'];

const { main, types } = pkg;

export default defineConfig([
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
