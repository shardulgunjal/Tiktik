// ---------------------------------------------------------------------------
// Tiktik — Dynamic Island Toast Library
// src/styles.ts — Injects <style id="tiktik-styles"> once on first use
// ---------------------------------------------------------------------------

import { isBrowser } from './utils';
import {
  Z_INDEX,
  COLLAPSED_MIN_WIDTH,
  COLLAPSED_HEIGHT,
  EXPANDED_MIN_WIDTH,
  EXPANDED_MAX_WIDTH,
  EXPANDED_MIN_HEIGHT,
  MORPH_DURATION,
  EASE_SPRING,
  TYPE_COLORS,
} from './utils';

/** ID of the injected <style> element. */
const STYLE_ID = 'tiktik-styles';

/** Whether the styles have already been injected. */
let injected = false;

/**
 * Inject the Tiktik stylesheet into the document head.
 * No-ops if already injected or not in a browser.
 */
export function injectStyles(): void {
  if (!isBrowser() || injected) return;
  if (document.getElementById(STYLE_ID)) {
    injected = true;
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = getStylesheet();
  document.head.appendChild(style);
  injected = true;
}

/**
 * Build the full CSS stylesheet as a string.
 * @returns The complete Tiktik CSS
 */
function getStylesheet(): string {
  return `
/* =========================================================================
   Tiktik — Dynamic Island Toast Styles
   ========================================================================= */

/* --- CSS Custom Properties (Theme Tokens) --- */
:root {
  --tiktik-bg: #000000;
  --tiktik-text: #ffffff;
  --tiktik-radius-pill: 9999px;
  --tiktik-radius-card: 24px;
  --tiktik-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
  --tiktik-z-index: ${Z_INDEX};
  --tiktik-font-size: 14px;
  --tiktik-duration: ${MORPH_DURATION}ms;
}

/* --- Container --- */
.tiktik__container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: var(--tiktik-z-index);
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  gap: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.tiktik__container--top {
  top: 0;
}

.tiktik__container--bottom {
  bottom: 0;
  flex-direction: column-reverse;
}

.tiktik__container--rtl {
  direction: rtl;
}

/* --- Toast Pill --- */
.tiktik__toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: ${COLLAPSED_MIN_WIDTH}px;
  height: ${COLLAPSED_HEIGHT}px;
  padding: 0 16px;
  border-radius: var(--tiktik-radius-pill);
  background: var(--tiktik-bg);
  box-shadow: var(--tiktik-shadow);
  color: var(--tiktik-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: var(--tiktik-font-size);
  font-weight: 500;
  letter-spacing: 0.01em;
  cursor: default;
  pointer-events: auto;
  overflow: hidden;
  will-change: transform, opacity;
  user-select: none;
  -webkit-user-select: none;

  /* Inner gradient */
  background-image: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0));

  /* Morph transition */
  transition:
    width var(--tiktik-duration) ${EASE_SPRING},
    min-width var(--tiktik-duration) ${EASE_SPRING},
    height var(--tiktik-duration) ${EASE_SPRING},
    border-radius var(--tiktik-duration) ease,
    padding var(--tiktik-duration) ease;
}

.tiktik__toast--clickable {
  cursor: pointer;
}

/* --- Expanded State --- */
.tiktik__toast--expanded {
  min-width: ${EXPANDED_MIN_WIDTH}px;
  max-width: ${EXPANDED_MAX_WIDTH}px;
  min-height: ${EXPANDED_MIN_HEIGHT}px;
  height: auto;
  padding: 12px 16px;
  border-radius: var(--tiktik-radius-card);
}

/* --- Type Accents (left border indicator) --- */
.tiktik__toast--success {
  border-inline-start: 3px solid ${TYPE_COLORS.success};
}

.tiktik__toast--error {
  border-inline-start: 3px solid ${TYPE_COLORS.error};
}

.tiktik__toast--info {
  border-inline-start: 3px solid ${TYPE_COLORS.info};
}

.tiktik__toast--warning {
  border-inline-start: 3px solid ${TYPE_COLORS.warning};
}

/* --- Icon Slot --- */
.tiktik__icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tiktik__icon svg {
  width: 100%;
  height: 100%;
}

.tiktik__icon--success { color: ${TYPE_COLORS.success}; }
.tiktik__icon--error   { color: ${TYPE_COLORS.error}; }
.tiktik__icon--info    { color: ${TYPE_COLORS.info}; }
.tiktik__icon--warning { color: ${TYPE_COLORS.warning}; }

/* --- Message Text --- */
.tiktik__message {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4;
}

.tiktik__toast--expanded .tiktik__message {
  white-space: normal;
  word-break: break-word;
}

/* --- Media Slot (optional, right side) --- */
.tiktik__media {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.tiktik__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- Close Button --- */
.tiktik__close {
  position: absolute;
  top: 4px;
  inset-inline-end: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  opacity: 0;
  transition: opacity 150ms ease, background 150ms ease;
  pointer-events: none;
  z-index: 2;
}

.tiktik__close:hover {
  background: rgba(255,255,255,0.2);
  color: #ffffff;
}

.tiktik__close:focus-visible {
  opacity: 1;
  pointer-events: auto;
  outline: 2px solid ${TYPE_COLORS.info};
  outline-offset: 2px;
}

/* Show close on toast hover */
.tiktik__toast:hover .tiktik__close,
.tiktik__toast:focus-within .tiktik__close {
  opacity: 1;
  pointer-events: auto;
}

/* --- Progress Bar --- */
.tiktik__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 0 0 var(--tiktik-radius-pill) var(--tiktik-radius-pill);
  overflow: hidden;
  pointer-events: none;
}

.tiktik__toast--expanded .tiktik__progress {
  border-radius: 0 0 var(--tiktik-radius-card) var(--tiktik-radius-card);
}

.tiktik__progress-bar {
  width: 100%;
  height: 100%;
  transform-origin: left;
  will-change: transform;
}

.tiktik__progress-bar--success { background: ${TYPE_COLORS.success}; }
.tiktik__progress-bar--error   { background: ${TYPE_COLORS.error}; }
.tiktik__progress-bar--info    { background: ${TYPE_COLORS.info}; }
.tiktik__progress-bar--warning { background: ${TYPE_COLORS.warning}; }

/* RTL progress bar */
.tiktik__container--rtl .tiktik__progress-bar {
  transform-origin: right;
}

/* --- Promise Toast Spinner --- */
.tiktik__spinner {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.tiktik__spinner svg {
  width: 100%;
  height: 100%;
  animation: tiktik-spin 1s linear infinite;
}

@keyframes tiktik-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Easing Label (demo only) --- */
.tiktik__easing-label {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  font-family: 'SF Mono', 'Fira Code', monospace;
  white-space: nowrap;
  pointer-events: none;
}

/* --- Reduced Motion --- */
@media (prefers-reduced-motion: reduce) {
  .tiktik__toast {
    transition: none !important;
  }

  .tiktik__spinner svg {
    animation: none !important;
  }
}

/* --- Focus Styles --- */
.tiktik__toast:focus-visible {
  outline: 2px solid ${TYPE_COLORS.info};
  outline-offset: 2px;
}
`;
}
