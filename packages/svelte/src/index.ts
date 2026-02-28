/**
 * @tiktik/svelte — Barrel Export
 *
 * Re-exports all public APIs for the Svelte wrapper.
 *
 * Usage:
 *   import { tiktik, toast } from '@tiktik/svelte';
 */

// Store (pre-configured Tiktik instance)
export { tiktik } from './store';
export type { TiktikStore } from './store';

// Action (use:toast)
export { toast } from './action';
export type { ToastActionParam } from './action';

// Re-export core types for convenience
export type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
  ToastAction,
  ToastType,
  ToastPosition,
} from 'tiktik';
