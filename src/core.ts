// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/core.ts — Toast lifecycle, queue, deduplication, state management
// ---------------------------------------------------------------------------

import type {
  ToastOptions,
  ToastData,
  TiktikConfig,
  ToastType,
  ToastState,
} from './types';
import {
  isBrowser,
  uid,
  MAX_VISIBLE_TOASTS,
  DEFAULT_DURATION,
  addTrackedListener,
  removeTrackedListeners,
  cancelAnimations,
  getAnimation,
} from './utils';
import {
  getContainer,
  cleanupContainer,
  createToastElement,
  updateToastElement,
  getProgressBar,
  expandToast,
  collapseToast,
} from './dom';
import {
  animateEntry,
  animateExit,
  animateReposition,
  animateProgressBar,
  animateMorph,
} from './animations';

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

/** All active toasts (visible + queued), keyed by id. */
const toastMap = new Map<string, ToastData>();

/** Ordered list of visible toast IDs (front → back). */
const visibleIds: string[] = [];

/** Queued toast IDs waiting for a visible slot. */
const queuedIds: string[] = [];

/** Global configuration (merged with defaults). */
let config: TiktikConfig = {
  type: 'info',
  duration: DEFAULT_DURATION,
  position: 'top',
  progress: false,
  renderer: undefined,
  audio: false,
};

/** Stack-change listeners for the demo live counter. */
type StackChangeListener = (visible: number, queued: number) => void;
const stackListeners: StackChangeListener[] = [];

// ---------------------------------------------------------------------------
// Public: configure
// ---------------------------------------------------------------------------

/**
 * Merge partial configuration into the global defaults.
 * SSR-safe: does not access the DOM.
 *
 * @param overrides - Partial configuration to merge
 */
export function configure(overrides: Partial<TiktikConfig>): void {
  config = { ...config, ...overrides };
}

/**
 * Get current configuration (read-only copy).
 * @returns The current TiktikConfig
 */
export function getConfig(): Readonly<TiktikConfig> {
  return { ...config };
}

// ---------------------------------------------------------------------------
// Public: stack change listener
// ---------------------------------------------------------------------------

/**
 * Register a callback that fires on every stack change (add/remove/queue).
 * @param listener - Callback receiving (visibleCount, queuedCount)
 */
export function onStackChange(listener: StackChangeListener): void {
  stackListeners.push(listener);
}

/** Notify all stack-change listeners. */
function emitStackChange(): void {
  const v = visibleIds.length;
  const q = queuedIds.length;
  for (const fn of stackListeners) {
    fn(v, q);
  }
}

// ---------------------------------------------------------------------------
// Public: showToast
// ---------------------------------------------------------------------------

/**
 * Show a toast notification with the given options.
 * - SSR-safe: returns a uid and no-ops DOM work if not in a browser.
 * - Deduplication: if a toast with the same id exists, updates it in place.
 *
 * @param options - Partial toast options (merged with config defaults)
 * @returns The toast's unique ID
 */
export function showToast(options: Partial<ToastOptions> & { message: string }): string {
  const toastId = options.id ?? uid();

  // --- Deduplication: update existing toast in place ---
  const existing = toastMap.get(toastId);
  if (existing && existing.state !== 'dismissed') {
    existing.message = options.message;
    existing.type = options.type ?? existing.type;
    if (existing.element && isBrowser()) {
      updateToastElement(existing.element, existing);
      animateMorph(existing.element, toastId);
    }
    return toastId;
  }

  // --- Build toast data ---
  const toast: ToastData = {
    id: toastId,
    message: options.message,
    type: options.type ?? config.type,
    duration: options.duration ?? config.duration,
    position: options.position ?? config.position,
    icon: options.icon,
    progress: options.progress ?? config.progress,
    onClick: options.onClick,
    onDismiss: options.onDismiss,
    state: 'entering',
    createdAt: Date.now(),
    element: null,
    remaining: options.duration ?? config.duration,
    timerStart: 0,
    timerId: null,
    progressAnimation: null,
  };

  toastMap.set(toastId, toast);

  // SSR bail-out
  if (!isBrowser()) return toastId;

  // --- Visible or queued? ---
  if (visibleIds.length < MAX_VISIBLE_TOASTS) {
    mountToast(toast);
  } else {
    queuedIds.push(toastId);
  }

  emitStackChange();
  return toastId;
}

// ---------------------------------------------------------------------------
// Public: updateToast (used by promise.ts)
// ---------------------------------------------------------------------------

/**
 * Update a toast's message and/or type in the internal map.
 * If the toast is visible, updates the DOM element too.
 *
 * @param id - The toast ID
 * @param updates - Fields to update
 */
export function updateToast(id: string, updates: { message?: string; type?: string }): void {
  const toast = toastMap.get(id);
  if (!toast) return;

  if (updates.message !== undefined) toast.message = updates.message;
  if (updates.type !== undefined) toast.type = updates.type as ToastType;

  if (toast.element && isBrowser()) {
    updateToastElement(toast.element, toast);
  }
}

// ---------------------------------------------------------------------------
// Public: dismiss
// ---------------------------------------------------------------------------

/**
 * Dismiss one or all toasts.
 * @param id - Specific toast ID to dismiss. Omit to dismiss all.
 */
export function dismiss(id?: string): void {
  if (id) {
    dismissOne(id);
  } else {
    // Dismiss all
    const allIds = [...visibleIds, ...queuedIds];
    for (const tid of allIds) {
      dismissOne(tid);
    }
  }
}

// ---------------------------------------------------------------------------
// Internal: mount a toast into the DOM
// ---------------------------------------------------------------------------

function mountToast(toast: ToastData): void {
  const container = getContainer(toast.position);

  const element = createToastElement(toast, dismiss);
  toast.element = element;
  toast.state = 'entering';

  // Insert at the top (front of the stack)
  if (container.firstChild) {
    container.insertBefore(element, container.firstChild);
  } else {
    container.appendChild(element);
  }

  visibleIds.unshift(toast.id);

  // Entry animation
  const entryAnim = animateEntry(element, toast.id);
  if (entryAnim) {
    entryAnim.finished.then(() => {
      toast.state = 'idle';
      startAutoExpandCheck(toast);
    }).catch(() => { /* cancelled */ });
  } else {
    toast.state = 'idle';
    startAutoExpandCheck(toast);
  }

  // Start auto-dismiss timer
  startTimer(toast);

  // Start progress bar animation
  if (toast.progress && isFinite(toast.duration)) {
    const bar = getProgressBar(toast.id);
    if (bar) {
      toast.progressAnimation = animateProgressBar(bar, toast.duration, toast.id);
    }
  }

  // Hover: expand + pause timer
  addTrackedListener(toast.id, element, 'mouseenter', () => {
    expandToast(element);
    pauseTimer(toast);
  });

  addTrackedListener(toast.id, element, 'mouseleave', () => {
    collapseToast(element);
    resumeTimer(toast);
  });

  // Keyboard focus: Alt+T to focus container
  // (registered once on document, but we check for it here)
  ensureGlobalKeyListener();

  // Lazy-load gestures on first touch/mousedown
  let gesturesLoaded = false;
  const loadGestures = () => {
    if (gesturesLoaded) return;
    gesturesLoaded = true;
    import(/* webpackChunkName: "tiktik-gestures" */ './gestures').then(({ attachSwipeGesture }) => {
      attachSwipeGesture(element, toast.id, dismiss);
    });
  };

  addTrackedListener(toast.id, element, 'touchstart', loadGestures, { passive: true, once: true });
  addTrackedListener(toast.id, element, 'mousedown', loadGestures, { once: true });

  // Reflow existing toasts
  reflowStack(toast.position);
}

// ---------------------------------------------------------------------------
// Internal: Auto-expand for long messages
// ---------------------------------------------------------------------------

function startAutoExpandCheck(toast: ToastData): void {
  if (!toast.element) return;
  const messageEl = toast.element.querySelector('.tiktik__message');
  if (!messageEl) return;

  // If the message overflows the collapsed width, auto-expand
  if (messageEl.scrollWidth > messageEl.clientWidth) {
    expandToast(toast.element);
  }
}

// ---------------------------------------------------------------------------
// Internal: dismiss a single toast
// ---------------------------------------------------------------------------

function dismissOne(id: string): void {
  const toast = toastMap.get(id);
  if (!toast || toast.state === 'dismissed' || toast.state === 'exiting') return;

  toast.state = 'exiting';
  clearTimer(toast);

  // Cancel progress animation
  if (toast.progressAnimation) {
    try { toast.progressAnimation.cancel(); } catch { /* noop */ }
    toast.progressAnimation = null;
  }

  const doCleanup = () => {
    toast.state = 'dismissed';

    // Remove from visible/queued lists
    const visIdx = visibleIds.indexOf(id);
    if (visIdx !== -1) visibleIds.splice(visIdx, 1);

    const qIdx = queuedIds.indexOf(id);
    if (qIdx !== -1) queuedIds.splice(qIdx, 1);

    // Remove element from DOM
    if (toast.element) {
      toast.element.remove();
      toast.element = null;
    }

    // Cleanup tracked resources
    removeTrackedListeners(id);
    cancelAnimations(id);

    // Fire onDismiss callback
    toast.onDismiss?.();

    // Remove from map
    toastMap.delete(id);

    // Promote a queued toast if available
    promoteFromQueue(toast.position);

    // Reflow remaining stack
    reflowStack(toast.position);

    // Cleanup empty container
    cleanupContainer(toast.position);

    emitStackChange();
  };

  if (toast.element && isBrowser()) {
    animateExit(toast.element, id).then(doCleanup).catch(doCleanup);
  } else {
    doCleanup();
  }
}

// ---------------------------------------------------------------------------
// Internal: queue promotion
// ---------------------------------------------------------------------------

function promoteFromQueue(position: string): void {
  if (queuedIds.length === 0) return;
  if (visibleIds.length >= MAX_VISIBLE_TOASTS) return;

  // Find first queued toast matching this position
  const idx = queuedIds.findIndex(id => {
    const t = toastMap.get(id);
    return t && t.position === position;
  });

  if (idx === -1) return;

  const nextId = queuedIds.splice(idx, 1)[0];
  const nextToast = toastMap.get(nextId);
  if (nextToast) {
    mountToast(nextToast);
  }
}

// ---------------------------------------------------------------------------
// Internal: reflow stack (animate existing toasts to new positions)
// ---------------------------------------------------------------------------

function reflowStack(position: string): void {
  if (!isBrowser()) return;

  const toastsAtPosition = visibleIds
    .map(id => toastMap.get(id))
    .filter((t): t is ToastData =>
      t !== undefined && t.position === position && t.element !== null
    );

  for (let i = 0; i < toastsAtPosition.length; i++) {
    const toast = toastsAtPosition[i];
    if (toast.element) {
      animateReposition(toast.element, i, toast.id, toast.position);
    }
  }
}

// ---------------------------------------------------------------------------
// Internal: auto-dismiss timer
// ---------------------------------------------------------------------------

function startTimer(toast: ToastData): void {
  if (!isFinite(toast.duration)) return;

  toast.timerStart = Date.now();
  toast.remaining = toast.remaining || toast.duration;

  toast.timerId = setTimeout(() => {
    dismissOne(toast.id);
  }, toast.remaining);
}

function pauseTimer(toast: ToastData): void {
  if (toast.timerId !== null) {
    clearTimeout(toast.timerId);
    toast.timerId = null;
    toast.remaining -= Date.now() - toast.timerStart;
  }

  // Pause progress bar animation
  if (toast.progressAnimation) {
    try { toast.progressAnimation.pause(); } catch { /* noop */ }
  }
}

function resumeTimer(toast: ToastData): void {
  if (!isFinite(toast.duration)) return;
  if (toast.state === 'exiting' || toast.state === 'dismissed') return;

  toast.timerStart = Date.now();
  toast.timerId = setTimeout(() => {
    dismissOne(toast.id);
  }, toast.remaining);

  // Resume progress bar animation
  if (toast.progressAnimation) {
    try { toast.progressAnimation.play(); } catch { /* noop */ }
  }
}

function clearTimer(toast: ToastData): void {
  if (toast.timerId !== null) {
    clearTimeout(toast.timerId);
    toast.timerId = null;
  }
}

// ---------------------------------------------------------------------------
// Internal: global keyboard listener (Alt+T)
// ---------------------------------------------------------------------------

let globalKeyListenerAttached = false;

function ensureGlobalKeyListener(): void {
  if (globalKeyListenerAttached || !isBrowser()) return;
  globalKeyListenerAttached = true;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === 't') {
      // Focus the first visible toast container
      const container = document.querySelector('.tiktik__container') as HTMLElement | null;
      if (container) {
        const firstToast = container.querySelector('.tiktik__toast') as HTMLElement | null;
        if (firstToast) {
          firstToast.focus();
        }
      }
    }
  });
}
