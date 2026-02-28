// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// vite.config.ts — Dual-mode build configuration
//
// - Default / dev / Vercel: builds the docs website (React app)
// - Library mode (--mode lib): builds ES/CJS/UMD bundles for NPM
// ---------------------------------------------------------------------------

import { defineConfig, type UserConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // Library build for NPM publishing
  if (mode === 'lib') {
    const config: UserConfig = {
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
    return config;
  }

  // Docs website build (default, dev, and Vercel)
  const config: UserConfig = {
    plugins: [react(), tailwindcss()],
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@docs': resolve(__dirname, 'docs'),
        'tiktiktoast': resolve(__dirname, 'node_modules/tiktiktoast'),
      },
    },
  };
  return config;
});
