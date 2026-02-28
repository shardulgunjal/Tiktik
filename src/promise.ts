// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/promise.ts — Promise-based toast wrapper (lazy-loaded chunk)
//   Spinner SVG, path morph to checkmark/×, state transitions
// ---------------------------------------------------------------------------

import type { PromiseToastOptions, ToastData, ToastType, ToastPosition } from './types';
import { isBrowser, uid } from './utils';
import {
  setSpinnerIcon,
  setSuccessIcon,
  setErrorIcon,
  updateToastElement,
} from './dom';
import { animateMorph } from './animations';

// ---------------------------------------------------------------------------
// Spinner SVG
// ---------------------------------------------------------------------------

/** Inline SVG spinner for the loading state. */
const SPINNER_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="40 20" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------------------
// Promise toast handler
// ---------------------------------------------------------------------------

/**
 * Internal handler for promise-based toasts.
 * Called by `Tiktik.promise()` — this module is dynamically imported.
 *
 * @template T - The resolved value type of the promise
 * @param promise - The promise to track
 * @param options - Promise toast display options
 * @param showToast - Reference to core's showToast function
 * @param updateToast - Reference to core's updateToast function
 * @param dismissToast - Reference to core's dismiss function
 * @returns The toast ID used for tracking
 */
export function handlePromiseToast<T>(
  promise: Promise<T>,
  options: PromiseToastOptions<T>,
  showToast: (opts: Partial<import('./types').ToastOptions> & { message: string }) => string,
  updateToast: (id: string, updates: { message?: string; type?: string }) => void,
  dismissToast: (id?: string) => void
): string {
  const toastId = options.id ?? uid();

  // Show loading toast (infinite duration — no auto-dismiss)
  showToast({
    message: options.loading,
    type: 'info',
    duration: Infinity,
    position: options.position,
    id: toastId,
    progress: false,
  });

  // Set spinner icon on the toast element
  if (isBrowser()) {
    // Wait for next tick to ensure the toast element exists
    requestAnimationFrame(() => {
      const el = document.getElementById(`toast-${toastId}`);
      if (el) {
        setSpinnerIcon(el);
      }
    });
  }

  // Track the promise
  promise
    .then((data: T) => {
      const message = typeof options.success === 'function'
        ? options.success(data)
        : options.success;

      // Update the toast to success state
      updateToast(toastId, { message, type: 'success' });

      if (isBrowser()) {
        requestAnimationFrame(() => {
          const el = document.getElementById(`toast-${toastId}`);
          if (el) {
            setSuccessIcon(el);
            animateMorph(el, toastId);
          }
        });
      }

      // Auto-dismiss after the configured (or default) duration
      const dismissDuration = options.duration ?? 3000;
      if (isFinite(dismissDuration)) {
        setTimeout(() => {
          dismissToast(toastId);
        }, dismissDuration);
      }
    })
    .catch((err: unknown) => {
      const message = typeof options.error === 'function'
        ? options.error(err)
        : options.error;

      // Update the toast to error state
      updateToast(toastId, { message, type: 'error' });

      if (isBrowser()) {
        requestAnimationFrame(() => {
          const el = document.getElementById(`toast-${toastId}`);
          if (el) {
            setErrorIcon(el);
            animateMorph(el, toastId);
          }
        });
      }

      // Auto-dismiss after the configured (or default) duration
      const dismissDuration = options.duration ?? 5000;
      if (isFinite(dismissDuration)) {
        setTimeout(() => {
          dismissToast(toastId);
        }, dismissDuration);
      }
    });

  return toastId;
}
