// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/gestures.ts — Swipe-to-dismiss (lazy-loaded chunk)
//   Touch + mouse swipe, rubber-band, snap back, fly off
// ---------------------------------------------------------------------------

import {
  isBrowser,
  SWIPE_THRESHOLD,
  SWIPE_RUBBER_START,
  SWIPE_RUBBER_FACTOR,
  addTrackedListener,
} from './utils';
import { animateSwipeFlyOff, animateSnapBack } from './animations';
import { isRTL } from './dom';

/**
 * State tracked during an active swipe gesture.
 */
interface SwipeState {
  startX: number;
  currentX: number;
  swiping: boolean;
}

/**
 * Attach swipe-to-dismiss gesture handlers to a toast element.
 * Supports both touch and mouse (pointer) events.
 * RTL: inverts swipe directions.
 *
 * @param element - The toast DOM element
 * @param toastId - The toast's unique ID
 * @param onDismiss - Callback fired when the swipe exceeds the threshold
 */
export function attachSwipeGesture(
  element: HTMLElement,
  toastId: string,
  onDismiss: (id: string) => void
): void {
  if (!isBrowser()) return;

  const state: SwipeState = {
    startX: 0,
    currentX: 0,
    swiping: false,
  };

  const rtlMultiplier = isRTL() ? -1 : 1;

  // --- Pointer / touch start ---
  function onPointerStart(clientX: number): void {
    state.startX = clientX;
    state.currentX = clientX;
    state.swiping = true;
    element.style.transition = 'none';
  }

  // --- Pointer / touch move ---
  function onPointerMove(clientX: number): void {
    if (!state.swiping) return;

    state.currentX = clientX;
    let deltaX = (state.currentX - state.startX) * rtlMultiplier;

    // Apply rubber-band resistance beyond SWIPE_RUBBER_START
    if (Math.abs(deltaX) > SWIPE_RUBBER_START) {
      const excess = Math.abs(deltaX) - SWIPE_RUBBER_START;
      const sign = deltaX > 0 ? 1 : -1;
      deltaX = sign * (SWIPE_RUBBER_START + excess * SWIPE_RUBBER_FACTOR);
    }

    const displayDeltaX = deltaX * rtlMultiplier;
    element.style.transform = `translateX(${displayDeltaX}px)`;
    element.style.opacity = String(Math.max(0.3, 1 - Math.abs(deltaX) / (SWIPE_THRESHOLD * 2)));
  }

  // --- Pointer / touch end ---
  function onPointerEnd(): void {
    if (!state.swiping) return;
    state.swiping = false;

    const deltaX = (state.currentX - state.startX) * rtlMultiplier;
    const absDelta = Math.abs(deltaX);

    // Remove inline transition override
    element.style.transition = '';

    if (absDelta >= SWIPE_THRESHOLD) {
      // Fly off in the direction of the swipe
      const direction = deltaX > 0 ? 'right' : 'left';
      const flyDirection = isRTL()
        ? (direction === 'left' ? 'right' : 'left')
        : direction;

      animateSwipeFlyOff(element, flyDirection, toastId).then(() => {
        onDismiss(toastId);
      });
    } else {
      // Snap back
      const currentTranslate = (state.currentX - state.startX);
      animateSnapBack(element, currentTranslate);
      element.style.opacity = '1';
    }
  }

  // --- Touch events ---
  addTrackedListener(toastId, element, 'touchstart', ((e: Event) => {
    const te = e as TouchEvent;
    if (te.touches.length !== 1) return;
    onPointerStart(te.touches[0].clientX);
  }) as EventListener, { passive: true });

  addTrackedListener(toastId, element, 'touchmove', ((e: Event) => {
    const te = e as TouchEvent;
    if (te.touches.length !== 1) return;
    onPointerMove(te.touches[0].clientX);
  }) as EventListener, { passive: true });

  addTrackedListener(toastId, element, 'touchend', (() => {
    onPointerEnd();
  }) as EventListener);

  addTrackedListener(toastId, element, 'touchcancel', (() => {
    onPointerEnd();
  }) as EventListener);

  // --- Mouse events (for desktop swipe) ---
  addTrackedListener(toastId, element, 'mousedown', ((e: Event) => {
    const me = e as MouseEvent;
    // Only left button
    if (me.button !== 0) return;
    onPointerStart(me.clientX);

    // Track mouse move and up on window (capture outside toast bounds)
    const onMouseMove = (moveEvent: MouseEvent) => {
      onPointerMove(moveEvent.clientX);
    };

    const onMouseUp = () => {
      onPointerEnd();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }) as EventListener);
}
