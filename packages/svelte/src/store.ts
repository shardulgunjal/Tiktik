/**
 * @tiktik/svelte — Tiktik Store
 *
 * Pre-configured Tiktik instance exported as a module-level object.
 * Svelte's module system makes this the most idiomatic approach —
 * no providers or context needed.
 *
 * Usage:
 *   <script>
 *     import { tiktik } from '@tiktik/svelte';
 *     tiktik.success('Saved!');
 *   </script>
 */

import Tiktik from 'tiktik';
import type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
} from 'tiktik';

/** Shape of the tiktik store API */
export interface TiktikStore {
  success: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
  info: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  loading: (message: string, options?: Partial<ToastOptions>) => string;
  showToast: (options: ToastOptions) => string;
  promise: <T>(
    promiseValue: Promise<T>,
    options: PromiseOptions<T>,
    toastOptions?: Partial<ToastOptions>
  ) => Promise<T>;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  configure: (options: Partial<TiktikConfig>) => void;
  resetConfig: () => void;
}

/**
 * The tiktik store — import and use directly.
 * No wrapping provider needed (Svelte's module scope is the provider).
 */
export const tiktik: TiktikStore = {
  success: Tiktik.success,
  error: Tiktik.error,
  info: Tiktik.info,
  warning: Tiktik.warning,
  loading: Tiktik.loading,
  showToast: Tiktik.showToast,
  promise: Tiktik.promise,
  dismiss: Tiktik.dismiss,
  dismissAll: Tiktik.dismissAll,
  configure: Tiktik.configure,
  resetConfig: Tiktik.resetConfig,
};
