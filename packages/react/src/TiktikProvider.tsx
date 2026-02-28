/**
 * @tiktik/react — TiktikProvider
 *
 * Wraps your React app to initialize Tiktik configuration and provide
 * the toast API via React context. All useTiktik() hooks read from this.
 *
 * Usage:
 *   <TiktikProvider config={{ theme: 'dark', stackStyle: 'deck' }}>
 *     <App />
 *   </TiktikProvider>
 */

import React, { useEffect, useMemo, type ReactNode } from 'react';
import Tiktik from 'tiktik';
import type { TiktikConfig } from 'tiktik';
import { TiktikContext, type TiktikContextValue } from './TiktikContext';

/** Props for TiktikProvider */
export interface TiktikProviderProps {
  /** Partial Tiktik configuration (merged with defaults) */
  config?: Partial<TiktikConfig>;
  /** React children */
  children: ReactNode;
}

/**
 * TiktikProvider — initializes Tiktik and provides its API to the tree.
 *
 * Configuration is applied on mount and whenever `config` prop changes.
 * The context value is memoized since the Tiktik API methods are stable references.
 */
export function TiktikProvider({ config, children }: TiktikProviderProps) {
  // Apply config on mount and when it changes
  useEffect(() => {
    if (config) {
      Tiktik.configure(config);
    }
  }, [config]);

  // Memoize context value — Tiktik methods are stable module-level functions
  const value = useMemo<TiktikContextValue>(
    () => ({
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
    }),
    []
  );

  return React.createElement(
    TiktikContext.Provider,
    { value },
    children
  );
}
