// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/dom.ts — DOM creation, templates, icon/close slot, RTL detection
// ---------------------------------------------------------------------------

import type { ToastData, ToastPosition } from './types';
import { isBrowser, addTrackedListener, TYPE_COLORS } from './utils';
import { injectStyles } from './styles';

// ---------------------------------------------------------------------------
// Container cache — one per position
// ---------------------------------------------------------------------------

const containers = new Map<ToastPosition, HTMLElement>();

/**
 * Detect if the current document is in RTL mode.
 * @returns `true` when `document.documentElement.dir === 'rtl'`
 */
export function isRTL(): boolean {
  if (!isBrowser()) return false;
  return document.documentElement.dir === 'rtl';
}

/**
 * Get or create the toast container for a given position.
 * Injects styles on first call. Container is appended to document.body.
 *
 * @param position - 'top' or 'bottom'
 * @returns The container HTMLElement
 */
export function getContainer(position: ToastPosition): HTMLElement {
  if (!isBrowser()) {
    // Return a stub for SSR (should never actually be used)
    return document.createElement('div');
  }

  injectStyles();

  const existing = containers.get(position);
  if (existing && existing.isConnected) return existing;

  const container = document.createElement('div');
  container.className = `tiktik__container tiktik__container--${position}`;
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Notifications');

  if (isRTL()) {
    container.classList.add('tiktik__container--rtl');
  }

  document.body.appendChild(container);
  containers.set(position, container);
  return container;
}

/**
 * Remove a container if it has no children.
 * @param position - The position of the container
 */
export function cleanupContainer(position: ToastPosition): void {
  const container = containers.get(position);
  if (container && container.childElementCount === 0) {
    container.remove();
    containers.delete(position);
  }
}

// ---------------------------------------------------------------------------
// Default type icons (inline SVGs)
// ---------------------------------------------------------------------------

const TYPE_ICONS: Record<string, string> = {
  success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
};

// ---------------------------------------------------------------------------
// Toast element creation
// ---------------------------------------------------------------------------

/**
 * Create the DOM element for a toast.
 *
 * @param toast - The toast data used to populate the template
 * @param onClose - Callback to trigger toast dismissal
 * @returns The root HTMLElement for the toast
 */
export function createToastElement(
  toast: ToastData,
  onClose: (id: string) => void
): HTMLElement {
  const el = document.createElement('div');
  el.className = `tiktik__toast tiktik__toast--${toast.type}`;
  el.id = `toast-${toast.id}`;

  // Accessibility
  el.setAttribute('role', 'alert');
  const ariaLive = toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite';
  el.setAttribute('aria-live', ariaLive);
  el.setAttribute('aria-atomic', 'true');

  // Clickable?
  if (toast.onClick) {
    el.classList.add('tiktik__toast--clickable');
    el.setAttribute('tabindex', '0');
    addTrackedListener(toast.id, el, 'click', (e: Event) => {
      // Don't fire onClick if close button was clicked
      if ((e.target as HTMLElement).closest('.tiktik__close')) return;
      toast.onClick?.();
    });
    addTrackedListener(toast.id, el, 'keydown', (e: Event) => {
      const ke = e as KeyboardEvent;
      if (ke.key === 'Enter' || ke.key === ' ') {
        ke.preventDefault();
        toast.onClick?.();
      }
    });
  }

  // --- Icon slot ---
  const iconSlot = document.createElement('div');
  iconSlot.className = `tiktik__icon tiktik__icon--${toast.type}`;

  if (toast.icon) {
    if (typeof toast.icon === 'string') {
      iconSlot.innerHTML = toast.icon;
    } else {
      // SVGElement passed directly
      iconSlot.appendChild(toast.icon.cloneNode(true));
    }
  } else {
    iconSlot.innerHTML = TYPE_ICONS[toast.type] ?? TYPE_ICONS.info;
  }

  el.appendChild(iconSlot);

  // --- Message ---
  const messageEl = document.createElement('span');
  messageEl.className = 'tiktik__message';
  messageEl.textContent = toast.message;
  el.appendChild(messageEl);

  // --- Close button ---
  const closeBtn = document.createElement('button');
  closeBtn.className = 'tiktik__close';
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.innerHTML = '×';
  addTrackedListener(toast.id, closeBtn, 'click', (e: Event) => {
    e.stopPropagation();
    onClose(toast.id);
  });
  el.appendChild(closeBtn);

  // --- Progress bar ---
  if (toast.progress && isFinite(toast.duration)) {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'tiktik__progress';

    const progressBar = document.createElement('div');
    progressBar.className = `tiktik__progress-bar tiktik__progress-bar--${toast.type}`;
    progressBar.setAttribute('data-progress-bar', toast.id);

    progressContainer.appendChild(progressBar);
    el.appendChild(progressContainer);
  }

  return el;
}

/**
 * Update a toast element in place (for deduplication).
 * Updates message, type classes, and icon.
 *
 * @param element - The existing toast DOM element
 * @param toast - The updated toast data
 */
export function updateToastElement(element: HTMLElement, toast: ToastData): void {
  // Update message text
  const messageEl = element.querySelector('.tiktik__message');
  if (messageEl) {
    messageEl.textContent = toast.message;
  }

  // Update type class
  element.className = element.className.replace(
    /tiktik__toast--(success|error|info|warning)/,
    `tiktik__toast--${toast.type}`
  );

  // Update icon
  const iconSlot = element.querySelector('.tiktik__icon');
  if (iconSlot) {
    // Update icon color class
    iconSlot.className = `tiktik__icon tiktik__icon--${toast.type}`;

    if (toast.icon) {
      if (typeof toast.icon === 'string') {
        iconSlot.innerHTML = toast.icon;
      } else {
        iconSlot.innerHTML = '';
        iconSlot.appendChild(toast.icon.cloneNode(true));
      }
    } else {
      iconSlot.innerHTML = TYPE_ICONS[toast.type] ?? TYPE_ICONS.info;
    }
  }

  // Update aria-live
  const ariaLive = toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite';
  element.setAttribute('aria-live', ariaLive);

  // Update progress bar color if present
  const progressBar = element.querySelector('.tiktik__progress-bar');
  if (progressBar) {
    progressBar.className = `tiktik__progress-bar tiktik__progress-bar--${toast.type}`;
  }
}

/**
 * Get the progress bar element for a toast.
 * @param toastId - The toast's unique ID
 * @returns The progress bar element, or null
 */
export function getProgressBar(toastId: string): HTMLElement | null {
  if (!isBrowser()) return null;
  return document.querySelector(`[data-progress-bar="${toastId}"]`);
}

/**
 * Expand a toast to its full card state (on hover / long message).
 * @param element - The toast DOM element
 */
export function expandToast(element: HTMLElement): void {
  element.classList.add('tiktik__toast--expanded');
}

/**
 * Collapse a toast back to its pill state.
 * @param element - The toast DOM element
 */
export function collapseToast(element: HTMLElement): void {
  element.classList.remove('tiktik__toast--expanded');
}

/**
 * Set the spinner icon on a toast (for promise loading state).
 * @param element - The toast DOM element
 */
export function setSpinnerIcon(element: HTMLElement): void {
  const iconSlot = element.querySelector('.tiktik__icon');
  if (!iconSlot) return;

  iconSlot.className = 'tiktik__spinner';
  iconSlot.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="40 20" stroke-linecap="round"/></svg>`;
}

/**
 * Set the icon to a checkmark (for promise success state).
 * @param element - The toast DOM element
 */
export function setSuccessIcon(element: HTMLElement): void {
  const iconSlot = element.querySelector('.tiktik__spinner') || element.querySelector('.tiktik__icon');
  if (!iconSlot) return;

  iconSlot.className = 'tiktik__icon tiktik__icon--success';
  iconSlot.innerHTML = TYPE_ICONS.success;
}

/**
 * Set the icon to an X (for promise error state).
 * @param element - The toast DOM element
 */
export function setErrorIcon(element: HTMLElement): void {
  const iconSlot = element.querySelector('.tiktik__spinner') || element.querySelector('.tiktik__icon');
  if (!iconSlot) return;

  iconSlot.className = 'tiktik__icon tiktik__icon--error';
  iconSlot.innerHTML = TYPE_ICONS.error;
}
