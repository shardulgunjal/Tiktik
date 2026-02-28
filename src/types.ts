/**
 * Tiktik - Type Definitions
 * Core types and interfaces for the notification library.
 */

/** Toast notification type */
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default' | 'loading';

/** Position on screen */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Action button inside a toast */
export interface ToastAction {
  label: string;
  onClick: () => void;
  className?: string;
}

/** Options for a single toast */
export interface ToastOptions {
  /** The message text to display */
  message: string;
  /** Toast type - determines icon and color */
  type?: ToastType;
  /** Duration in ms before auto-dismiss (0 = persistent) */
  duration?: number;
  /** Screen position */
  position?: ToastPosition;
  /** Custom icon HTML or emoji */
  icon?: string;
  /** Show progress bar */
  progress?: boolean;
  /** Click callback on the toast body */
  onClick?: () => void;
  /** Expandable content revealed on hover */
  expandedContent?: string;
  /** Action buttons inside the toast */
  buttons?: ToastAction[];
  /** Raw HTML content (replaces message) */
  html?: string;
  /** Animation speed multiplier (1 = normal) */
  animationSpeed?: number;
  /** Extra CSS class names */
  className?: string;
  /** Custom ARIA label */
  ariaLabel?: string;
  /** Play a sound on show */
  sound?: boolean;
  /** Enable swipe-to-dismiss gesture (default: true) */
  swipeToDismiss?: boolean;
  /**
   * Headless mode: provide a custom render function that returns the toast's
   * root HTMLElement. Tiktik will manage lifecycle, timers, swipe, stacking,
   * and animations — you control the DOM structure entirely.
   *
   * The function receives the resolved options and a dismiss callback.
   * If omitted, Tiktik's default Dynamic Island pill UI is used.
   */
  render?: (options: ToastOptions, dismiss: () => void) => HTMLElement;
}

/** Promise toast messages */
export interface PromiseOptions<T = unknown> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
}

/** Global configuration */
export interface TiktikConfig {
  duration: number;
  position: ToastPosition;
  progress: boolean;
  animationSpeed: number;
  maxToasts: number;
  sound: boolean;
  theme: 'auto' | 'light' | 'dark';
  /** Stack style: 'vertical' (classic) or 'deck' (Sonner-style overlapping) */
  stackStyle: 'vertical' | 'deck';
  /** Enable swipe-to-dismiss globally */
  swipeToDismiss: boolean;
  /**
   * Keyboard shortcut to jump focus to the toast region.
   * Format: modifier keys + key, e.g. 'Alt+T', 'Control+Shift+N'.
   * Set to '' to disable. Default: 'Alt+T'.
   */
  focusShortcut: string;
}

/** Internal toast state */
export interface ToastInstance {
  id: string;
  options: Required<Pick<ToastOptions, 'message' | 'type' | 'duration' | 'position' | 'progress' | 'animationSpeed'>> & ToastOptions;
  element: HTMLElement;
  timer: ReturnType<typeof setTimeout> | null;
  remainingTime: number;
  pausedAt: number | null;
  startTime: number;
  progressElement: HTMLElement | null;
  dismissed: boolean;
}
