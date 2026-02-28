// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/index.ts — Public API entry, all exports
// ---------------------------------------------------------------------------

import type {
  ToastOptions,
  TiktikConfig,
  PromiseToastOptions,
  ToastType,
} from './types';
import { uid } from './utils';
import {
  showToast as coreShowToast,
  dismiss as coreDismiss,
  configure as coreConfigure,
  updateToast,
  onStackChange,
  getConfig,
} from './core';

// ---------------------------------------------------------------------------
// Type re-exports
// ---------------------------------------------------------------------------

export type {
  ToastOptions,
  TiktikConfig,
  PromiseToastOptions,
  ToastType,
};

// ---------------------------------------------------------------------------
// Public API — Tiktik namespace
// ---------------------------------------------------------------------------

/**
 * Tiktik — Dynamic Island–style notification library.
 * All methods are SSR-safe and tree-shakeable.
 */
export const Tiktik = {
  /**
   * Show a toast notification.
   * @param options - Toast configuration
   * @returns The toast's unique ID
   */
  showToast(options: Partial<ToastOptions> & { message: string }): string {
    return coreShowToast(options);
  },

  /**
   * Show a success toast.
   * @param message - Toast message text
   * @param options - Optional overrides
   * @returns The toast's unique ID
   */
  success(message: string, options?: Partial<ToastOptions>): string {
    return coreShowToast({ ...options, message, type: 'success' });
  },

  /**
   * Show an error toast.
   * @param message - Toast message text
   * @param options - Optional overrides
   * @returns The toast's unique ID
   */
  error(message: string, options?: Partial<ToastOptions>): string {
    return coreShowToast({ ...options, message, type: 'error' });
  },

  /**
   * Show an info toast.
   * @param message - Toast message text
   * @param options - Optional overrides
   * @returns The toast's unique ID
   */
  info(message: string, options?: Partial<ToastOptions>): string {
    return coreShowToast({ ...options, message, type: 'info' });
  },

  /**
   * Show a warning toast.
   * @param message - Toast message text
   * @param options - Optional overrides
   * @returns The toast's unique ID
   */
  warning(message: string, options?: Partial<ToastOptions>): string {
    return coreShowToast({ ...options, message, type: 'warning' });
  },

  /**
   * Show a promise-tracking toast with loading → success/error states.
   * Dynamically imports the promise module on first use.
   *
   * @template T - Resolved value type
   * @param promise - The promise to track
   * @param options - Promise toast options (loading, success, error messages)
   * @returns The toast's unique ID
   */
  promise<T>(promise: Promise<T>, options: PromiseToastOptions<T>): string {
    const toastId = options.id ?? uid();

    // Dynamic import of promise handler — lazy-loaded chunk
    import(/* webpackChunkName: "tiktik-promise" */ './promise').then(
      ({ handlePromiseToast }) => {
        handlePromiseToast(
          promise,
          { ...options, id: toastId },
          coreShowToast,
          updateToast,
          coreDismiss
        );
      }
    );

    // Show loading toast immediately (before dynamic import resolves)
    return coreShowToast({
      message: options.loading,
      type: 'info',
      duration: Infinity,
      position: options.position,
      id: toastId,
      progress: false,
    });
  },

  /**
   * Dismiss one or all toasts.
   * @param id - Specific toast ID. Omit to dismiss all.
   */
  dismiss(id?: string): void {
    coreDismiss(id);
  },

  /**
   * Update global configuration defaults.
   * SSR-safe: does not access the DOM.
   *
   * @param defaults - Partial config to merge
   */
  configure(defaults: Partial<TiktikConfig>): void {
    coreConfigure(defaults);
  },

  /**
   * Register a listener for stack changes (useful for live counters).
   * @param listener - Called with (visibleCount, queuedCount) on every change
   */
  onStackChange(listener: (visible: number, queued: number) => void): void {
    onStackChange(listener);
  },
};
