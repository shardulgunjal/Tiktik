import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

/**
 * Rollup Configuration for Tiktik
 *
 * Dynamic imports are used in the source for swipe, focus, and promise
 * modules — they are inlined for all output formats. The lazy caching
 * pattern in toast-manager.ts ensures these modules only initialize
 * when first needed (e.g., swipe only loads when swipeToDismiss is true).
 *
 * For tree-shaking bundlers (webpack, Vite), the dynamic import()
 * boundaries are preserved as genuine split points when consumers
 * re-bundle with their own tooling.
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tiktik.esm.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/tiktik.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
    },
    {
      file: 'dist/tiktik.umd.js',
      format: 'umd',
      name: 'Tiktik',
      sourcemap: true,
      exports: 'named',
      inlineDynamicImports: true,
    },
  ],
  plugins: [
    postcss({
      inject: true,
      minimize: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist/types',
    }),
    terser(),
  ],
};
