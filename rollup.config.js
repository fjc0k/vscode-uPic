import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

module.exports = {
  input: './src/extension.ts',
  output: {
    file: './dist/extension.js',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs(), esbuild(), terser()],
}
