import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/tiktik.esm.js',
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/tiktik.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/tiktik.umd.js',
      format: 'umd',
      name: 'Tiktik',
      sourcemap: true,
      exports: 'named',
      globals: {
        gsap: 'gsap',
      },
    },
  ],
  external: ['gsap'],
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
