/**
 * Tiktik - Promise Toast Module (lazy-loaded)
 *
 * Handles promise-based toasts: shows a loading state, then transitions
 * to success or error based on the promise outcome.
 * This module is dynamically imported by index.ts to keep the core lightweight.
 */

import type { ToastOptions, PromiseOptions } from './types';
import { getConfig } from './config';
import { show, update } from './toast-manager';

/**
 * Show a promise toast: loading → success/error.
 *
 * @param promiseValue - The promise to track
 * @param options - Messages for loading, success, and error states
 * @param toastOptions - Optional overrides for the toast appearance
 * @returns The resolved value of the promise
 */
export async function promiseToast<T>(
  promiseValue: Promise<T>,
  options: PromiseOptions<T>,
  toastOptions?: Partial<ToastOptions>
): Promise<T> {
  const id = show({
    ...toastOptions,
    message: options.loading,
    type: 'loading',
    duration: 0,
    progress: false,
  });

  try {
    const result = await promiseValue;
    const successMsg = typeof options.success === 'function'
      ? options.success(result)
      : options.success;

    update(id, {
      message: successMsg,
      type: 'success',
      duration: toastOptions?.duration ?? getConfig().duration,
    });

    return result;
  } catch (err) {
    const errorMsg = typeof options.error === 'function'
      ? options.error(err)
      : options.error;

    update(id, {
      message: errorMsg,
      type: 'error',
      duration: toastOptions?.duration ?? getConfig().duration,
    });

    throw err;
  }
}
