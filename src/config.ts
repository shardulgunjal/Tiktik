/**
 * Tiktik - Configuration Module
 * Manages global defaults and per-toast overrides.
 */

import type { TiktikConfig } from './types';

/** Sensible defaults */
const defaultConfig: TiktikConfig = {
  duration: 3000,
  position: 'top-center',
  progress: false,
  animationSpeed: 1,
  maxToasts: 5,
  sound: false,
  theme: 'auto',
  stackStyle: 'deck',
  swipeToDismiss: true,
};

/** Active configuration (clone of defaults) */
let currentConfig: TiktikConfig = { ...defaultConfig };

/**
 * Merge user-supplied partial config into the active config.
 */
export function configure(options: Partial<TiktikConfig>): void {
  currentConfig = { ...currentConfig, ...options };

  // Apply theme class to body
  document.body.classList.remove('tiktik-light', 'tiktik-dark');
  if (currentConfig.theme === 'dark') {
    document.body.classList.add('tiktik-dark');
  } else if (currentConfig.theme === 'light') {
    document.body.classList.add('tiktik-light');
  }
}

/**
 * Get the current active config (read-only copy).
 */
export function getConfig(): TiktikConfig {
  return { ...currentConfig };
}

/**
 * Reset config back to defaults.
 */
export function resetConfig(): void {
  currentConfig = { ...defaultConfig };
}
