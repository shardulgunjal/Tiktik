// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// vite.config.ts — Library build configuration
//
// Builds 3 formats: ES (with code splitting), CJS (with code splitting), UMD (single bundle).
// UMD requires inlineDynamicImports, so we set it flag and accept a larger UMD bundle.
// ---------------------------------------------------------------------------

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isVercel = process.env.VERCEL === '1';

  if (isVercel) {
    // When deploying to Vercel, build the demo page (index.html)
    return {
      build: {
        outDir: 'dist',
        emptyOutDir: true,
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
        },
      },
    };
  }

  // Otherwise, build the library
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'Tiktik',
        formats: ['es', 'cjs', 'umd'],
        fileName: (format) => {
          if (format === 'cjs') return 'tiktik.cjs';
          if (format === 'es') return 'tiktik.es.js';
          return `tiktik.${format}.js`;
        },
      },
      chunkSizeWarningLimit: 10,
      rollupOptions: {
        output: {
          // UMD needs inlineDynamicImports. ES/CJS benefit from code splitting.
          // When inlineDynamicImports is true, all formats will produce single files.
          // This is acceptable since the total bundle is small.
          inlineDynamicImports: true,
        },
      },
      target: 'es2020',
      minify: true,
      sourcemap: true,
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
