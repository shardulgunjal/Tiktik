// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/utils.ts — uid(), clamp(), isBrowser(), named constants, cleanup helpers
// ---------------------------------------------------------------------------

import type { ListenerEntry, AnimationEntry } from './types';

// ---------------------------------------------------------------------------
// Named constants (all magic numbers live here)
// ---------------------------------------------------------------------------

/** Maximum number of toasts visible at once; extras are queued. */
export const MAX_VISIBLE_TOASTS = 5;

/** Default auto-dismiss duration in ms. */
export const DEFAULT_DURATION = 3000;

/** Z-index base for the toast container. */
export const Z_INDEX = 999999;

/** Entry animation duration in ms. */
export const ENTRY_DURATION = 400;

/** Exit animation duration in ms. */
export const EXIT_DURATION = 250;

/** Morph transition duration in ms. */
export const MORPH_DURATION = 320;

/** Stack reposition animation duration in ms. */
export const REPOSITION_DURATION = 300;

/** Stack scale step per index behind front. */
export const STACK_SCALE_STEP = 0.05;

/** Stack translateY step (px) per index behind front. */
export const STACK_TRANSLATE_STEP = 10;

/** Stack opacity step per index behind front. */
export const STACK_OPACITY_STEP = 0.15;

/** Swipe dismiss threshold in px. */
export const SWIPE_THRESHOLD = 80;

/** Swipe rubber-band starts at this distance (px). */
export const SWIPE_RUBBER_START = 40;

/** Swipe rubber-band resistance factor. */
export const SWIPE_RUBBER_FACTOR = 0.4;

/** Collapsed pill dimensions. */
export const COLLAPSED_MIN_WIDTH = 120;
export const COLLAPSED_HEIGHT = 36;

/** Expanded pill dimensions. */
export const EXPANDED_MIN_WIDTH = 300;
export const EXPANDED_MAX_WIDTH = 420;
export const EXPANDED_MIN_HEIGHT = 64;

/** Entry easing — spring overshoot. */
export const EASE_SPRING = 'cubic-bezier(0.34,1.56,0.64,1)';

/** Exit easing — ease out. */
export const EASE_EXIT = 'cubic-bezier(0.4,0,1,1)';

/** Toast type accent colors. */
export const TYPE_COLORS: Record<string, string> = {
  success: '#22c55e',
  error: '#ef4444',
  info: '#3b82f6',
  warning: '#f59e0b',
};

/** Unique ID counter — simple numeric increment. */
let idCounter = 0;

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/**
 * Generate a unique ID string for a toast.
 * @returns A unique string like "tiktik-42"
 */
export function uid(): string {
  return `tiktik-${++idCounter}`;
}

/**
 * Clamp a number between min and max (inclusive).
 * @param value - The value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns The clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Check if code is running in a browser environment (not SSR).
 * @returns `true` when `window` and `document` are available
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Check if the user prefers reduced motion.
 * @returns `true` if reduced motion is preferred or not in browser
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get effective animation duration, respecting reduced-motion preference.
 * @param duration - The intended duration in ms
 * @returns 0 if reduced motion is preferred, otherwise the original duration
 */
export function getAnimationDuration(duration: number): number {
  return prefersReducedMotion() ? 0 : duration;
}

// ---------------------------------------------------------------------------
// Cleanup maps — prevent memory leaks
// ---------------------------------------------------------------------------

/** Map of toast id → array of registered event listeners. */
const listenerMap = new Map<string, ListenerEntry[]>();

/** Map of toast id → WAAPI animations. */
const animationMap = new Map<string, AnimationEntry>();

/**
 * Register an event listener for a toast, tracking it for cleanup.
 * @param toastId - The toast's unique ID
 * @param target - The EventTarget to listen on
 * @param event - Event name
 * @param handler - Event handler
 * @param options - addEventListener options
 */
export function addTrackedListener(
  toastId: string,
  target: EventTarget,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  target.addEventListener(event, handler, options);
  const entries = listenerMap.get(toastId) ?? [];
  entries.push({ target, event, handler, options });
  listenerMap.set(toastId, entries);
}

/**
 * Remove all tracked event listeners for a toast.
 * @param toastId - The toast's unique ID
 */
export function removeTrackedListeners(toastId: string): void {
  const entries = listenerMap.get(toastId);
  if (!entries) return;
  for (const { target, event, handler, options } of entries) {
    target.removeEventListener(event, handler, options);
  }
  listenerMap.delete(toastId);
}

/**
 * Store a WAAPI animation reference for a toast.
 * @param toastId - The toast's unique ID
 * @param key - Animation purpose key
 * @param animation - The Animation instance
 */
export function storeAnimation(
  toastId: string,
  key: keyof AnimationEntry,
  animation: Animation
): void {
  const entry = animationMap.get(toastId) ?? {};
  entry[key] = animation;
  animationMap.set(toastId, entry);
}

/**
 * Cancel and remove all stored WAAPI animations for a toast.
 * @param toastId - The toast's unique ID
 */
export function cancelAnimations(toastId: string): void {
  const entry = animationMap.get(toastId);
  if (!entry) return;
  for (const anim of Object.values(entry)) {
    if (anim) {
      try { anim.cancel(); } catch { /* already finished */ }
    }
  }
  animationMap.delete(toastId);
}

/**
 * Get a stored animation for a toast.
 * @param toastId - The toast's unique ID
 * @param key - Animation purpose key
 * @returns The Animation instance, or undefined
 */
export function getAnimation(
  toastId: string,
  key: keyof AnimationEntry
): Animation | undefined {
  return animationMap.get(toastId)?.[key];
}
