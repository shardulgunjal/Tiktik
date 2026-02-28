// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/types.ts — All TypeScript interfaces, zero `any` types
// ---------------------------------------------------------------------------

/**
 * Toast visual type — determines color accent and aria-live behavior.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Position of the toast container on screen.
 */
export type ToastPosition = 'top' | 'bottom';

/**
 * Internal lifecycle state of a toast instance.
 */
export type ToastState = 'entering' | 'idle' | 'expanding' | 'collapsing' | 'exiting' | 'dismissed';

// ---------------------------------------------------------------------------
// Options passed by the consumer
// ---------------------------------------------------------------------------

/**
 * Options accepted by `Tiktik.showToast()`.
 */
export interface ToastOptions {
  /** Text content of the toast. */
  message: string;
  /** Visual type — affects icon color, progress bar, and aria-live level. */
  type: ToastType;
  /** Auto-dismiss duration in ms. Use `Infinity` to require manual dismiss. */
  duration: number;
  /** Vertical position of the toast container. */
  position: ToastPosition;
  /** Custom icon — an inline SVG string or an SVGElement. */
  icon: string | SVGElement | undefined;
  /** Show a progress bar counting down to auto-dismiss. */
  progress: boolean;
  /** Deduplication key. Toasts with the same id update in place. */
  id: string | undefined;
  /** Called when the toast body is clicked. */
  onClick: (() => void) | undefined;
  /** Called after the toast is fully dismissed (exit animation complete). */
  onDismiss: (() => void) | undefined;
}

// ---------------------------------------------------------------------------
// Global configuration
// ---------------------------------------------------------------------------

/**
 * Custom renderer function signature.
 * Returns an HTMLElement that completely replaces the default toast template.
 */
export type CustomRenderer = (toast: ToastData) => HTMLElement;

/**
 * Library-wide configuration set via `Tiktik.configure()`.
 */
export interface TiktikConfig {
  /** Default toast type when none is specified. */
  type: ToastType;
  /** Default auto-dismiss duration in ms. */
  duration: number;
  /** Default position. */
  position: ToastPosition;
  /** Show progress bar by default. */
  progress: boolean;
  /** Custom renderer — replaces default DOM template. */
  renderer: CustomRenderer | undefined;
  /** Enable audio cues (opt-in). */
  audio: boolean;
}

// ---------------------------------------------------------------------------
// Internal toast data (stored in the queue)
// ---------------------------------------------------------------------------

/**
 * Full internal representation of a toast instance.
 */
export interface ToastData {
  /** Unique identifier (user-supplied or auto-generated). */
  id: string;
  /** Text content. */
  message: string;
  /** Visual type. */
  type: ToastType;
  /** Auto-dismiss duration in ms. */
  duration: number;
  /** Vertical position. */
  position: ToastPosition;
  /** Custom icon. */
  icon: string | SVGElement | undefined;
  /** Whether to show a progress bar. */
  progress: boolean;
  /** Click callback. */
  onClick: (() => void) | undefined;
  /** Dismiss callback. */
  onDismiss: (() => void) | undefined;
  /** Current lifecycle state. */
  state: ToastState;
  /** Timestamp (ms) when the toast was created. */
  createdAt: number;
  /** Reference to the root DOM element, set after mounting. */
  element: HTMLElement | null;
  /** Remaining time in ms (for pause/resume on hover). */
  remaining: number;
  /** Timestamp of when the auto-dismiss timer was last started. */
  timerStart: number;
  /** Handle returned by setTimeout for auto-dismiss. */
  timerId: ReturnType<typeof setTimeout> | null;
  /** WAAPI Animation for the progress bar, if active. */
  progressAnimation: Animation | null;
}

// ---------------------------------------------------------------------------
// Promise toast options
// ---------------------------------------------------------------------------

/**
 * Options for `Tiktik.promise()`.
 * @template T — Resolved value type of the wrapped promise.
 */
export interface PromiseToastOptions<T> {
  /** Message (or factory) shown while the promise is pending. */
  loading: string;
  /** Message (or factory) shown on resolve. */
  success: string | ((data: T) => string);
  /** Message (or factory) shown on reject. */
  error: string | ((err: unknown) => string);
  /** Extra options forwarded to the underlying toast. */
  duration?: number;
  position?: ToastPosition;
  id?: string;
}

// ---------------------------------------------------------------------------
// Cleanup map types
// ---------------------------------------------------------------------------

/**
 * A stored event listener entry for cleanup.
 */
export interface ListenerEntry {
  target: EventTarget;
  event: string;
  handler: EventListenerOrEventListenerObject;
  options?: boolean | AddEventListenerOptions;
}

/**
 * Stored WAAPI animations for a single toast (keyed by purpose).
 */
export interface AnimationEntry {
  entry?: Animation;
  exit?: Animation;
  reposition?: Animation;
  progress?: Animation;
}
