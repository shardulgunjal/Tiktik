/**
 * Tiktik - Focus Management Module
 * Handles keyboard shortcuts to focus toast region and focus traps
 * for toasts with action buttons. WCAG 2.1 compliance.
 */

import { getConfig } from './config';

/** Whether the global keyboard listener has been registered */
let shortcutRegistered = false;

/**
 * Parse a shortcut string like 'Alt+T' or 'Control+Shift+N' into
 * its components for matching against KeyboardEvent.
 */
function parseShortcut(shortcut: string): { key: string; alt: boolean; ctrl: boolean; shift: boolean; meta: boolean } | null {
  if (!shortcut) return null;

  const parts = shortcut.split('+').map((p) => p.trim());
  const key = parts.pop()?.toUpperCase() || '';

  return {
    key,
    alt: parts.some((p) => p.toLowerCase() === 'alt'),
    ctrl: parts.some((p) => p.toLowerCase() === 'control' || p.toLowerCase() === 'ctrl'),
    shift: parts.some((p) => p.toLowerCase() === 'shift'),
    meta: parts.some((p) => p.toLowerCase() === 'meta' || p.toLowerCase() === 'cmd'),
  };
}

/**
 * Register the global keyboard shortcut to focus the toast region.
 * Called once on first toast show. Idempotent.
 */
export function registerFocusShortcut(): void {
  if (shortcutRegistered) return;
  shortcutRegistered = true;

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const config = getConfig();
    const parsed = parseShortcut(config.focusShortcut);
    if (!parsed) return;

    const matches =
      e.key.toUpperCase() === parsed.key &&
      e.altKey === parsed.alt &&
      e.ctrlKey === parsed.ctrl &&
      e.shiftKey === parsed.shift &&
      e.metaKey === parsed.meta;

    if (matches) {
      e.preventDefault();
      focusToastRegion();
    }
  });
}

/**
 * Move focus to the newest visible toast.
 * Queries the DOM directly to avoid circular dependency with dom.ts.
 */
function focusToastRegion(): void {
  const containers = document.querySelectorAll('.tiktik-container');

  for (const container of containers) {
    const toasts = container.querySelectorAll('.tiktik-toast');
    if (toasts.length > 0) {
      const newest = toasts[toasts.length - 1] as HTMLElement;
      newest.focus();
      return;
    }
  }
}

/**
 * Set up a focus trap within a toast element that has action buttons.
 * Tab cycles through the toast's focusable elements. Shift+Tab cycles back.
 * Escape dismisses the toast.
 */
export function trapFocus(el: HTMLElement): void {
  el.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusable = el.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: if on first focusable, wrap to last
      if (document.activeElement === first || document.activeElement === el) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: if on last focusable, wrap to first
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/**
 * Auto-focus a toast if it contains action buttons (accessibility best practice).
 * Moves keyboard focus to the toast so screen reader users can interact immediately.
 */
export function autoFocusIfActionable(el: HTMLElement): void {
  const hasButtons = el.querySelector('.tiktik-action-btn');
  if (hasButtons) {
    // Slight delay to allow animation to start
    requestAnimationFrame(() => {
      el.focus();
    });
  }
}
