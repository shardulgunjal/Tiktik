/**
 * @tiktik/react — useTiktik Hook
 *
 * The primary way to access Tiktik's toast API from any React component.
 * Must be used inside a <TiktikProvider>.
 *
 * Usage:
 *   const { success, error, promise } = useTiktik();
 *   success('Saved!');
 */

import { useContext } from 'react';
import { TiktikContext, type TiktikContextValue } from './TiktikContext';

/**
 * Hook to access all Tiktik toast methods.
 *
 * @throws Error if used outside of a <TiktikProvider>.
 * @returns The full TiktikContextValue with all toast methods.
 */
export function useTiktik(): TiktikContextValue {
  const context = useContext(TiktikContext);

  if (!context) {
    throw new Error(
      'useTiktik() must be used within a <TiktikProvider>. ' +
      'Wrap your app (or the relevant subtree) with <TiktikProvider>.'
    );
  }

  return context;
}
