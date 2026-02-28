// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/animations.ts — All WAAPI + CSS animation logic
// ---------------------------------------------------------------------------

import type { ToastData } from './types';
import {
  isBrowser,
  prefersReducedMotion,
  getAnimationDuration,
  ENTRY_DURATION,
  EXIT_DURATION,
  REPOSITION_DURATION,
  STACK_SCALE_STEP,
  STACK_TRANSLATE_STEP,
  STACK_OPACITY_STEP,
  EASE_SPRING,
  EASE_EXIT,
  storeAnimation,
} from './utils';

// ---------------------------------------------------------------------------
// Entry animation
// ---------------------------------------------------------------------------

/**
 * Animate a toast entering the screen (scale up + fade in).
 * @param element - The toast DOM element
 * @param toastId - The toast's unique ID (for cleanup tracking)
 * @returns The Animation instance, or null if not in browser
 */
export function animateEntry(element: HTMLElement, toastId: string): Animation | null {
  if (!isBrowser()) return null;

  const duration = getAnimationDuration(ENTRY_DURATION);

  const animation = element.animate(
    [
      { transform: 'scale(0.8) translateY(-8px)', opacity: 0 },
      { transform: 'scale(1) translateY(0)', opacity: 1 },
    ],
    {
      duration,
      easing: EASE_SPRING,
      fill: 'forwards',
    }
  );

  storeAnimation(toastId, 'entry', animation);
  return animation;
}

// ---------------------------------------------------------------------------
// Exit animation
// ---------------------------------------------------------------------------

/**
 * Animate a toast exiting the screen (scale down + fade out).
 * @param element - The toast DOM element
 * @param toastId - The toast's unique ID (for cleanup tracking)
 * @returns A promise that resolves when the exit animation finishes
 */
export function animateExit(element: HTMLElement, toastId: string): Promise<void> {
  if (!isBrowser()) return Promise.resolve();

  const duration = getAnimationDuration(EXIT_DURATION);

  const animation = element.animate(
    [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(0.8)', opacity: 0 },
    ],
    {
      duration,
      easing: EASE_EXIT,
      fill: 'forwards',
    }
  );

  storeAnimation(toastId, 'exit', animation);

  return animation.finished.then(() => undefined);
}

// ---------------------------------------------------------------------------
// Stack reposition
// ---------------------------------------------------------------------------

/**
 * Animate an existing toast to its new stack position.
 * Each toast behind the front toast is scaled down, offset, and faded.
 *
 * @param element - The toast DOM element
 * @param index - Position in the visible stack (0 = front)
 * @param toastId - The toast's unique ID
 * @param position - 'top' or 'bottom' — affects translate direction
 * @returns The Animation instance, or null
 */
export function animateReposition(
  element: HTMLElement,
  index: number,
  toastId: string,
  position: 'top' | 'bottom'
): Animation | null {
  if (!isBrowser()) return null;

  const duration = getAnimationDuration(REPOSITION_DURATION);
  const scale = 1 - STACK_SCALE_STEP * index;
  const translateY = position === 'top'
    ? index * STACK_TRANSLATE_STEP
    : -(index * STACK_TRANSLATE_STEP);
  const opacity = Math.max(0, 1 - STACK_OPACITY_STEP * index);

  const animation = element.animate(
    [
      { transform: element.style.transform || 'scale(1) translateY(0)', opacity: element.style.opacity || '1' },
      { transform: `scale(${scale}) translateY(${translateY}px)`, opacity: String(opacity) },
    ],
    {
      duration,
      easing: EASE_SPRING,
      fill: 'forwards',
    }
  );

  storeAnimation(toastId, 'reposition', animation);
  return animation;
}

// ---------------------------------------------------------------------------
// Progress bar animation
// ---------------------------------------------------------------------------

/**
 * Animate the progress bar from 100% to 0% width over the toast's duration.
 * @param barElement - The progress bar DOM element
 * @param duration - Duration in ms for the countdown
 * @param toastId - The toast's unique ID
 * @returns The Animation instance, or null
 */
export function animateProgressBar(
  barElement: HTMLElement,
  duration: number,
  toastId: string
): Animation | null {
  if (!isBrowser()) return null;

  // Don't animate progress with reduced motion — just leave at 100%
  const effectiveDuration = prefersReducedMotion() ? 0 : duration;
  if (effectiveDuration <= 0 || !isFinite(duration)) return null;

  const animation = barElement.animate(
    [
      { transform: 'scaleX(1)' },
      { transform: 'scaleX(0)' },
    ],
    {
      duration: effectiveDuration,
      easing: 'linear',
      fill: 'forwards',
    }
  );

  storeAnimation(toastId, 'progress', animation);
  return animation;
}

// ---------------------------------------------------------------------------
// Morph helper (for deduplication updates)
// ---------------------------------------------------------------------------

/**
 * Apply a brief "pulse" morph animation when a toast updates in place.
 * @param element - The toast DOM element
 * @param toastId - The toast's unique ID
 * @returns The Animation instance, or null
 */
export function animateMorph(element: HTMLElement, toastId: string): Animation | null {
  if (!isBrowser()) return null;

  const duration = getAnimationDuration(200);

  const animation = element.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.02)' },
      { transform: 'scale(1)' },
    ],
    {
      duration,
      easing: EASE_SPRING,
      fill: 'forwards',
    }
  );

  return animation;
}

// ---------------------------------------------------------------------------
// Swipe fly-off animation
// ---------------------------------------------------------------------------

/**
 * Animate a toast flying off screen after a successful swipe.
 * @param element - The toast DOM element
 * @param direction - Direction of the fly-off: 'left' or 'right'
 * @param toastId - The toast's unique ID
 * @returns A promise that resolves when the animation finishes
 */
export function animateSwipeFlyOff(
  element: HTMLElement,
  direction: 'left' | 'right',
  toastId: string
): Promise<void> {
  if (!isBrowser()) return Promise.resolve();

  const duration = getAnimationDuration(200);
  const translateX = direction === 'left' ? '-120%' : '120%';

  const animation = element.animate(
    [
      { transform: element.style.transform || 'translateX(0)', opacity: 1 },
      { transform: `translateX(${translateX})`, opacity: 0 },
    ],
    {
      duration,
      easing: EASE_EXIT,
      fill: 'forwards',
    }
  );

  storeAnimation(toastId, 'exit', animation);
  return animation.finished.then(() => undefined);
}

/**
 * Animate a toast snapping back after a cancelled swipe.
 * @param element - The toast DOM element
 * @param currentTranslateX - Current X offset in px
 * @returns The Animation instance, or null
 */
export function animateSnapBack(
  element: HTMLElement,
  currentTranslateX: number
): Animation | null {
  if (!isBrowser()) return null;

  const duration = getAnimationDuration(300);

  const animation = element.animate(
    [
      { transform: `translateX(${currentTranslateX}px)` },
      { transform: 'translateX(0)' },
    ],
    {
      duration,
      easing: EASE_SPRING,
      fill: 'forwards',
    }
  );

  return animation;
}
