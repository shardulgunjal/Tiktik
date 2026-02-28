/**
 * Tiktik - Swipe-to-Dismiss Module
 * Handles pointer-based drag gestures to swipe toasts away horizontally.
 * Uses GSAP for spring-back animation when available, CSS fallback otherwise.
 */

/** Swipe threshold in pixels — beyond this, the toast is dismissed */
const SWIPE_THRESHOLD = 120;

/** Opacity at full swipe distance */
const MIN_OPACITY = 0.3;

/** Velocity threshold for quick flick dismiss (px/ms) */
const VELOCITY_THRESHOLD = 0.5;

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  startTime: number;
  isDragging: boolean;
  isHorizontal: boolean | null;
}

/**
 * Attach swipe-to-dismiss behavior to a toast element.
 * Returns a cleanup function to remove listeners.
 */
export function attachSwipe(
  el: HTMLElement,
  onDismiss: () => void
): () => void {
  const state: SwipeState = {
    startX: 0,
    startY: 0,
    currentX: 0,
    startTime: 0,
    isDragging: false,
    isHorizontal: null,
  };

  function onPointerDown(e: PointerEvent) {
    // Don't intercept clicks on buttons or close
    if ((e.target as HTMLElement).closest('.tiktik-close, .tiktik-action-btn')) return;

    state.startX = e.clientX;
    state.startY = e.clientY;
    state.currentX = 0;
    state.startTime = Date.now();
    state.isDragging = true;
    state.isHorizontal = null;

    el.classList.add('tiktik-swiping');
    el.style.transition = 'none'; // Disable animations during direct manipulation
    el.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!state.isDragging) return;

    const deltaX = e.clientX - state.startX;
    const deltaY = e.clientY - state.startY;

    // Determine direction on first significant move
    if (state.isHorizontal === null && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      state.isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
      if (!state.isHorizontal) {
        // Vertical gesture — abort swipe, let browser handle scroll
        state.isDragging = false;
        el.classList.remove('tiktik-swiping');
        return;
      }
    }

    if (!state.isHorizontal) return;

    state.currentX = deltaX;

    // Map drag distance to opacity
    const progress = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);
    const opacity = 1 - progress * (1 - MIN_OPACITY);

    el.style.setProperty('--tiktik-swipe-x', `${deltaX}px`);
    el.style.opacity = String(opacity);
  }

  function onPointerUp(e: PointerEvent) {
    if (!state.isDragging) return;
    state.isDragging = false;
    el.classList.remove('tiktik-swiping');

    const deltaX = e.clientX - state.startX;
    const elapsed = Date.now() - state.startTime;
    const velocity = Math.abs(deltaX) / elapsed;

    const shouldDismiss =
      Math.abs(deltaX) > SWIPE_THRESHOLD || velocity > VELOCITY_THRESHOLD;

    if (shouldDismiss) {
      // Animate off-screen in the swipe direction
      const direction = deltaX > 0 ? 1 : -1;
      animateSwipeOut(el, direction, onDismiss);
    } else {
      // Spring back to origin
      animateSpringBack(el);
    }
  }

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);
  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);

  // Return cleanup function
  return () => {
    el.removeEventListener('pointerdown', onPointerDown);
    el.removeEventListener('pointermove', onPointerMove);
    el.removeEventListener('pointerup', onPointerUp);
    el.removeEventListener('pointercancel', onPointerUp);
  };
}

/**
 * Animate the toast flying off-screen after a successful swipe.
 */
function animateSwipeOut(
  el: HTMLElement,
  direction: number,
  onDismiss: () => void
): void {
  el.style.transition = 'transform 0.3s ease-in, opacity 0.3s ease-in';
  el.style.setProperty('--tiktik-swipe-x', `${direction * window.innerWidth}px`);
  el.style.opacity = '0';
  setTimeout(onDismiss, 300);
}

/**
 * Spring the toast back to its original position after an aborted swipe.
 */
function animateSpringBack(el: HTMLElement): void {
  el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease';
  el.style.setProperty('--tiktik-swipe-x', '0px');
  el.style.opacity = '1';
  
  // Clean up inline styles after animation
  setTimeout(() => {
    // Restore the deck stacking transition rules
    el.style.transition = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease, box-shadow 0.2s ease, translate 0.2s ease';
  }, 500);
}
