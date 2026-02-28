/**
 * @tiktik/react — Barrel Export
 *
 * Re-exports all public APIs for the React wrapper.
 *
 * Usage:
 *   import { TiktikProvider, useTiktik, TiktikToast } from '@tiktik/react';
 */

// Components
export { TiktikProvider } from './TiktikProvider';
export type { TiktikProviderProps } from './TiktikProvider';

// Hooks
export { useTiktik } from './useTiktik';

// Declarative component
export { TiktikToast } from './TiktikToast';
export type { TiktikToastProps } from './TiktikToast';

// Context (for advanced usage / testing)
export { TiktikContext } from './TiktikContext';
export type { TiktikContextValue } from './TiktikContext';

// Re-export core types for convenience (no need to import 'tiktik' separately for types)
export type {
  ToastOptions,
  TiktikConfig,
  PromiseOptions,
  ToastAction,
  ToastType,
  ToastPosition,
} from 'tiktik';
