# COMPLETED — Items from PLAN.md Fully Implemented in Code

## Phase 1: UX & Accessibility Overhaul

### ✅ Swipe-to-Dismiss
- **Fully implemented** in [swipe.ts](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/swipe.ts)
- Pointer event tracking (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`)
- Direction lock (horizontal vs vertical) — vertical scrolling is preserved
- Velocity-based flick dismiss (`VELOCITY_THRESHOLD = 0.5 px/ms`)
- Distance-based dismiss (`SWIPE_THRESHOLD = 120px`)
- GSAP elastic spring-back on aborted swipe (`animateSpringBack()`)
- CSS fallback spring-back via `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Per-toast disable via `swipeToDismiss: false` in `ToastOptions` ([types.ts:56](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/types.ts#L56))
- Global config `swipeToDismiss: true` default in [config.ts:20](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/config.ts#L20)
- Integrated in [toast-manager.ts:111-114](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/toast-manager.ts#L111-L114)
- CSS `touch-action: pan-y` and `.tiktik-swiping` class in [tiktik.css:440-448](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/tiktik.css#L440-L448)

### ✅ Modern "Deck" Stacking (Sonner-style)
- **Fully implemented** in `applyDeckLayout()` in [animations.ts:199-254](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/animations.ts#L199-L254)
- Scale decreases per depth: `1 → 0.95 → 0.90 → 0.85`
- Y-offset peek: `distFromFront * -8px`
- Opacity fade: `1 → 0.85 → 0.70 → 0.55 → 0.40`
- Z-index layering for proper overlap
- Hover-to-expand via `setupDeckHover()` in [toast-manager.ts:143-161](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/toast-manager.ts#L143-L161)
- `stackStyle: 'vertical' | 'deck'` config toggle in [types.ts:75](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/types.ts#L75), default `'deck'` in [config.ts:19](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/config.ts#L19)
- CSS deck classes in [tiktik.css:450-472](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/tiktik.css#L450-L472)

### ✅ prefers-reduced-motion Detection
- **Fully implemented** in `prefersReducedMotion()` in [animations.ts:37-46](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/animations.ts#L37-L46)
- Gates all GSAP tweens in `animateIn()`, `animateOut()`, `animateProgress()`, `applyDeckLayout()`, `animateReflow()`, `animateContentChange()`
- Reduced-motion path uses simple 150ms opacity fade instead of scale/bounce
- CSS `@media (prefers-reduced-motion: reduce)` block in [tiktik.css:478-500](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/tiktik.css#L478-L500)
- Spinner animation preserved at slower speed for loading toasts

### ✅ Context-Aware ARIA Roles
- **Fully implemented** in `createToastElement()` in [dom.ts:47-50](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L47-L50)
- `role="alert"` for error and warning types (urgent)
- `role="status"` for success, info, default, loading types (informational)
- `aria-hidden="true"` on decorative icon wrappers ([dom.ts:64](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L64))
- `aria-hidden="true"` on expanded content ([dom.ts:93](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L93))
- `role="group"` with `aria-label` on action button containers ([dom.ts:101-102](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L101-L102))
- `role="progressbar"` with `aria-valuemin`/`aria-valuemax` on progress tracks ([dom.ts:129-131](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L129-L131))
- Container `aria-live="polite"` ([dom.ts:24](file:///c:/Users/IAN/OneDrive/Desktop/trip/tiktik/src/dom.ts#L24))

### ✅ Stacking Refactor (Actionable Step #1)
- `toast-manager.ts` and `animations.ts` both updated with deck overlapping stack logic.

### ✅ Swipe Gesture Module (Actionable Step #2)
- Dedicated `swipe.ts` module with pointer-events listeners.

### ✅ Reduced-Motion Media Queries (Actionable Step #3 — partial)
- CSS `@media (prefers-reduced-motion: reduce)` added to `tiktik.css`.
- JS `prefersReducedMotion()` gates all GSAP tweens in `animations.ts`.
