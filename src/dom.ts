/**
 * Tiktik - DOM Module
 * Creates and manages toast DOM elements and containers.
 */

import type { ToastOptions, ToastInstance, ToastPosition } from './types';
import { getIcon, getCloseIcon } from './icons';

/** Cache of position containers */
const containers = new Map<string, HTMLElement>();

/**
 * Get or create a positioned container for toasts.
 */
export function getContainer(position: ToastPosition): HTMLElement {
  if (containers.has(position)) {
    return containers.get(position)!;
  }

  const container = document.createElement('div');
  container.className = `tiktik-container tiktik-${position}`;
  container.setAttribute('aria-live', 'assertive');
  container.setAttribute('aria-relevant', 'additions removals');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Notifications');
  document.body.appendChild(container);
  containers.set(position, container);
  return container;
}

/**
 * Build the full toast DOM element.
 */
export function createToastElement(
  options: ToastInstance['options'],
  onDismiss: () => void
): HTMLElement {
  const toast = document.createElement('div');
  toast.className = `tiktik-toast tiktik-toast--${options.type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-atomic', 'true');
  toast.setAttribute('tabindex', '0');

  if (options.ariaLabel) {
    toast.setAttribute('aria-label', options.ariaLabel);
  }

  if (options.className) {
    toast.classList.add(...options.className.split(' '));
  }

  // --- Icon ---
  const iconWrapper = document.createElement('div');
  iconWrapper.className = 'tiktik-icon';
  iconWrapper.innerHTML = options.icon || getIcon(options.type);
  toast.appendChild(iconWrapper);

  // --- Content area ---
  const content = document.createElement('div');
  content.className = 'tiktik-content';

  if (options.html) {
    content.innerHTML = options.html;
  } else {
    const msg = document.createElement('div');
    msg.className = 'tiktik-message';
    msg.textContent = options.message;
    content.appendChild(msg);
  }

  // --- Expanded content (shown on hover) ---
  if (options.expandedContent) {
    const expanded = document.createElement('div');
    expanded.className = 'tiktik-expanded';
    expanded.innerHTML = options.expandedContent;
    content.appendChild(expanded);
  }

  // --- Action buttons ---
  if (options.buttons && options.buttons.length > 0) {
    const actions = document.createElement('div');
    actions.className = 'tiktik-actions';
    options.buttons.forEach((btn) => {
      const button = document.createElement('button');
      button.className = `tiktik-action-btn ${btn.className || ''}`;
      button.textContent = btn.label;
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        btn.onClick();
      });
      actions.appendChild(button);
    });
    content.appendChild(actions);
  }

  toast.appendChild(content);

  // --- Close button ---
  const closeBtn = document.createElement('button');
  closeBtn.className = 'tiktik-close';
  closeBtn.innerHTML = getCloseIcon();
  closeBtn.setAttribute('aria-label', 'Dismiss notification');
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onDismiss();
  });
  toast.appendChild(closeBtn);

  // --- Progress bar ---
  if (options.progress && options.duration > 0) {
    const progressTrack = document.createElement('div');
    progressTrack.className = 'tiktik-progress-track';
    const progressBar = document.createElement('div');
    progressBar.className = `tiktik-progress-bar tiktik-progress--${options.type}`;
    progressTrack.appendChild(progressBar);
    toast.appendChild(progressTrack);
  }

  // --- Click handler ---
  if (options.onClick) {
    toast.style.cursor = 'pointer';
    toast.addEventListener('click', options.onClick);
  }

  // --- Keyboard dismiss (Escape) ---
  toast.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      onDismiss();
    }
  });

  return toast;
}

/**
 * Remove a container if it has no children left.
 */
export function cleanupContainer(position: ToastPosition): void {
  const container = containers.get(position);
  if (container && container.children.length === 0) {
    container.remove();
    containers.delete(position);
  }
}

/**
 * Get all active containers.
 */
export function getAllContainers(): Map<string, HTMLElement> {
  return containers;
}
