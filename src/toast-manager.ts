/**
 * Tiktik - Toast Manager
 * Manages the lifecycle of all active toast notifications.
 * Integrates swipe-to-dismiss, deck stacking, and accessibility features.
 *
 * Swipe and focus modules are lazy-loaded on demand to keep the core
 * bundle lightweight. They are cached after first load.
 */

import type { ToastOptions, ToastInstance, ToastPosition } from './types';
import { getConfig } from './config';
import { getContainer, createToastElement, cleanupContainer } from './dom';
import { getIcon } from './icons';
import { animateIn, animateOut, animateProgress, animateReflow, animateContentChange, applyDeckLayout } from './animations';

// --- Lazy module caches ---
type SwipeModule = typeof import('./swipe');
type FocusModule = typeof import('./focus');

let swipeModuleCache: SwipeModule | null = null;
let focusModuleCache: FocusModule | null = null;

async function getSwipeModule(): Promise<SwipeModule> {
  if (!swipeModuleCache) {
    swipeModuleCache = await import('./swipe');
  }
  return swipeModuleCache;
}

async function getFocusModule(): Promise<FocusModule> {
  if (!focusModuleCache) {
    focusModuleCache = await import('./focus');
  }
  return focusModuleCache;
}

/** Active toasts indexed by ID */
const activeToasts = new Map<string, ToastInstance>();

/** Counter for unique IDs */
let idCounter = 0;

/** Track deck hover listeners per container */
const deckListeners = new Map<string, { enter: () => void; leave: () => void }>();

/**
 * Generate a unique toast ID.
 */
function generateId(): string {
  return `tiktik-${++idCounter}-${Date.now()}`;
}

/**
 * Show a toast notification.
 * Returns the toast ID for programmatic dismissal.
 */
export function show(userOptions: ToastOptions): string {
  const config = getConfig();
  const id = generateId();

  // Merge defaults + user options
  const options: ToastInstance['options'] = {
    ...userOptions,
    message: userOptions.message,
    type: userOptions.type || 'default',
    duration: userOptions.duration ?? config.duration,
    position: userOptions.position || config.position,
    progress: userOptions.progress ?? config.progress,
    animationSpeed: userOptions.animationSpeed ?? config.animationSpeed,
  };

  // Enforce max toasts
  enforceMaxToasts(options.position, config.maxToasts);

  const container = getContainer(options.position);

  // Build DOM
  const element = createToastElement(options, () => dismiss(id));

  // Create toast instance
  const instance: ToastInstance = {
    id,
    options,
    element,
    timer: null,
    remainingTime: options.duration,
    pausedAt: null,
    startTime: Date.now(),
    progressElement: element.querySelector('.tiktik-progress-bar'),
    dismissed: false,
  };

  activeToasts.set(id, instance);

  // Insert into container (bottom positions insert at top, top positions append)
  if (options.position.startsWith('bottom')) {
    container.insertBefore(element, container.firstChild);
  } else {
    container.appendChild(element);
  }

  // Lazy-load focus module (idempotent — only registers shortcut once)
  getFocusModule().then((mod) => {
    mod.registerFocusShortcut();
    mod.autoFocusIfActionable(element);
  });

  // Animate in
  animateIn(element, options.animationSpeed);

  // Apply stacking layout
  const isDeck = config.stackStyle === 'deck';
  if (isDeck) {
    applyDeckLayout(container, false);
    setupDeckHover(container, options.position);
  } else {
    animateReflow(container);
  }

  // Start progress bar
  let progressController: ReturnType<typeof animateProgress> | null = null;
  if (options.progress && instance.progressElement && options.duration > 0) {
    progressController = animateProgress(
      instance.progressElement,
      options.duration,
      options.animationSpeed
    );
  }

  // Start auto-dismiss timer
  if (options.duration > 0) {
    instance.timer = setTimeout(() => dismiss(id), options.duration);
  }

  // --- Lazy-load swipe module ---
  const enableSwipe = options.swipeToDismiss ?? config.swipeToDismiss;
  if (enableSwipe) {
    getSwipeModule().then((mod) => {
      mod.attachSwipe(element, () => dismiss(id));
    });
  }

  // --- Pause on hover ---
  element.addEventListener('mouseenter', () => {
    if (instance.dismissed) return;
    instance.pausedAt = Date.now();
    instance.remainingTime -= (instance.pausedAt - instance.startTime);

    if (instance.timer) {
      clearTimeout(instance.timer);
      instance.timer = null;
    }

    progressController?.pause();
    element.classList.add('tiktik-hover');
  });

  element.addEventListener('mouseleave', () => {
    if (instance.dismissed) return;
    instance.startTime = Date.now();
    instance.pausedAt = null;

    if (options.duration > 0 && instance.remainingTime > 0) {
      instance.timer = setTimeout(() => dismiss(id), instance.remainingTime);
    }

    progressController?.resume();
    element.classList.remove('tiktik-hover');
  });

  return id;
}

/**
 * Set up hover listeners on a container for deck expand/collapse.
 */
function setupDeckHover(container: HTMLElement, position: ToastPosition): void {
  if (deckListeners.has(position)) return; // Already set up

  const enter = () => {
    container.classList.add('tiktik-expanded');
    applyDeckLayout(container, true);
  };
  const leave = () => {
    container.classList.remove('tiktik-expanded');
    applyDeckLayout(container, false);
  };

  container.addEventListener('mouseenter', enter);
  container.addEventListener('mouseleave', leave);
  deckListeners.set(position, { enter, leave });
}

/**
 * Clean up deck hover listeners for a position.
 */
function cleanupDeckHover(position: ToastPosition): void {
  const listeners = deckListeners.get(position);
  if (!listeners) return;

  const container = document.querySelector(`.tiktik-${position}`);
  if (container) {
    container.removeEventListener('mouseenter', listeners.enter);
    container.removeEventListener('mouseleave', listeners.leave);
  }
  deckListeners.delete(position);
}

/**
 * Dismiss a toast by ID.
 */
export function dismiss(id: string): void {
  const instance = activeToasts.get(id);
  if (!instance || instance.dismissed) return;

  instance.dismissed = true;

  if (instance.timer) {
    clearTimeout(instance.timer);
    instance.timer = null;
  }

  const position = instance.options.position;
  const config = getConfig();

  animateOut(instance.element, instance.options.animationSpeed).then(() => {
    activeToasts.delete(id);
    cleanupContainer(position);

    // Re-apply stacking layout
    const container = document.querySelector(`.tiktik-${position}`);
    if (container) {
      if (config.stackStyle === 'deck') {
        applyDeckLayout(container as HTMLElement, container.classList.contains('tiktik-expanded'));
      } else {
        animateReflow(container as HTMLElement);
      }
    } else {
      cleanupDeckHover(position);
    }
  });
}

/**
 * Dismiss all active toasts.
 */
export function dismissAll(): void {
  const ids = Array.from(activeToasts.keys());
  ids.forEach((id) => dismiss(id));
}

/**
 * Update a toast's content (used for promise transitions).
 */
export function update(
  id: string,
  newOptions: Partial<ToastOptions>
): void {
  const instance = activeToasts.get(id);
  if (!instance || instance.dismissed) return;

  const el = instance.element;

  // Update type class
  if (newOptions.type) {
    el.className = el.className.replace(/tiktik-toast--\w+/, `tiktik-toast--${newOptions.type}`);
    instance.options.type = newOptions.type;
  }

  // Update icon
  if (newOptions.type || newOptions.icon) {
    const iconEl = el.querySelector('.tiktik-icon');
    if (iconEl) {
      iconEl.innerHTML = newOptions.icon || getIcon(newOptions.type || instance.options.type);
    }
  }

  // Update message
  if (newOptions.message) {
    const msgEl = el.querySelector('.tiktik-message');
    if (msgEl) {
      msgEl.textContent = newOptions.message;
    }
    instance.options.message = newOptions.message;
  }

  // Morph animation
  animateContentChange(el, instance.options.animationSpeed);

  // Reset timer if duration changed
  if (newOptions.duration !== undefined) {
    if (instance.timer) clearTimeout(instance.timer);
    instance.options.duration = newOptions.duration;
    instance.remainingTime = newOptions.duration;
    instance.startTime = Date.now();

    if (newOptions.duration > 0) {
      instance.timer = setTimeout(() => dismiss(id), newOptions.duration);
    }
  }
}

/**
 * Enforce max visible toasts for a position. Oldest are dismissed first.
 */
function enforceMaxToasts(position: ToastPosition, max: number): void {
  const positionToasts = Array.from(activeToasts.values()).filter(
    (t) => t.options.position === position && !t.dismissed
  );

  while (positionToasts.length >= max) {
    const oldest = positionToasts.shift();
    if (oldest) dismiss(oldest.id);
  }
}
