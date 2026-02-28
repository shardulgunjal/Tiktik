/**
 * @tiktik/vue — Barrel Export
 *
 * Re-exports all public APIs for the Vue wrapper.
 *
 * Usage:
 *   import { TiktikPlugin, useTiktik } from '@tiktik/vue';
 */

// Plugin
export { TiktikPlugin, TiktikKey } from './plugin';
export type { TiktikAPI } from './plugin';

// Composable
export { useTiktik } from './useTiktik';

// Re-export core types for convenience
export type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
  ToastAction,
  ToastType,
  ToastPosition,
} from 'tiktik';
