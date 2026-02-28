/**
 * Tiktik - Main API
 * Public-facing API for the notification library.
 *
 * Usage:
 *   import Tiktik from 'tiktik';
 *   Tiktik.success('Saved!');
 *   Tiktik.error('Something went wrong');
 *   Tiktik.promise(fetchData(), { loading: 'Loading...', success: 'Done!', error: 'Failed' });
 */

import './tiktik.css';
import type { ToastOptions, TiktikConfig, PromiseOptions } from './types';
import { configure as setConfig, getConfig, resetConfig } from './config';
import { show, dismiss, dismissAll, update } from './toast-manager';

/**
 * Configure global defaults.
 */
function configure(options: Partial<TiktikConfig>): void {
  setConfig(options);
}

/**
 * Show a toast with full options.
 * Returns the toast ID for later dismissal.
 */
function showToast(options: ToastOptions): string {
  return show(options);
}

/**
 * Show a success toast.
 */
function success(message: string, options?: Partial<ToastOptions>): string {
  return show({ ...options, message, type: 'success' });
}

/**
 * Show an error toast.
 */
function error(message: string, options?: Partial<ToastOptions>): string {
  return show({ ...options, message, type: 'error' });
}

/**
 * Show an info toast.
 */
function info(message: string, options?: Partial<ToastOptions>): string {
  return show({ ...options, message, type: 'info' });
}

/**
 * Show a warning toast.
 */
function warning(message: string, options?: Partial<ToastOptions>): string {
  return show({ ...options, message, type: 'warning' });
}

/**
 * Show a loading toast.
 */
function loading(message: string, options?: Partial<ToastOptions>): string {
  return show({ ...options, message, type: 'loading', duration: 0 });
}

/**
 * Promise-based toast: shows loading, then transitions to success or error.
 */
async function promise<T>(
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

/** The public Tiktik API object */
const Tiktik = {
  configure,
  showToast,
  success,
  error,
  info,
  warning,
  loading,
  promise,
  dismiss,
  dismissAll,
  resetConfig,
};

// Default + named exports
export default Tiktik;
export {
  configure,
  showToast,
  success,
  error,
  info,
  warning,
  loading,
  promise,
  dismiss,
  dismissAll,
  resetConfig,
};

// Re-export types
export type { ToastOptions, TiktikConfig, PromiseOptions, ToastAction, ToastType, ToastPosition } from './types';
