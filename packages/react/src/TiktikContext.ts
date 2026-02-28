/**
 * @tiktik/react — TiktikContext
 *
 * Internal React context that provides the Tiktik API to all children.
 * Created by TiktikProvider, consumed by useTiktik().
 */

import { createContext } from 'react';
import type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
} from 'tiktik';

/** Shape of the Tiktik context value */
export interface TiktikContextValue {
  /** Show a success toast */
  success: (message: string, options?: Partial<ToastOptions>) => string;
  /** Show an error toast */
  error: (message: string, options?: Partial<ToastOptions>) => string;
  /** Show an info toast */
  info: (message: string, options?: Partial<ToastOptions>) => string;
  /** Show a warning toast */
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  /** Show a loading toast (persistent until dismissed) */
  loading: (message: string, options?: Partial<ToastOptions>) => string;
  /** Show a toast with full options */
  showToast: (options: ToastOptions) => string;
  /** Promise-based toast: loading → success/error */
  promise: <T>(
    promiseValue: Promise<T>,
    options: PromiseOptions<T>,
    toastOptions?: Partial<ToastOptions>
  ) => Promise<T>;
  /** Dismiss a toast by ID */
  dismiss: (id: string) => void;
  /** Dismiss all active toasts */
  dismissAll: () => void;
  /** Update global configuration */
  configure: (options: Partial<TiktikConfig>) => void;
  /** Reset configuration to defaults */
  resetConfig: () => void;
}

/**
 * React context — undefined when used outside of TiktikProvider.
 */
export const TiktikContext = createContext<TiktikContextValue | undefined>(undefined);
