# MISSING — Items from PLAN.md NOT Implemented

## Phase 1: UX & Accessibility Overhaul

### ❌ Keyboard Shortcut to Focus Toast Region
- **PLAN.md says:** "Implement a keyboard shortcut (e.g., Alt + T, customizable) to move focus directly to the toast region."
- **Codebase reality:** No keyboard shortcut exists anywhere. No `keydown` listener on `document` or `window` for `Alt+T` or any configurable hotkey. Toasts only respond to `Escape` when individually focused.
- **Files that would need changes:** `dom.ts` (register global listener), `types.ts` (add `focusShortcut` config option), `config.ts` (default binding).

### ❌ Focus Traps for Toasts with Action Buttons
- **PLAN.md says:** "Focus traps for toasts with actionable buttons."
- **Codebase reality:** Toasts have `tabindex="0"` and action buttons are focusable, but there is no focus-trap implementation. When a toast with action buttons appears, focus is not programmatically moved to it. Tab navigation can escape the toast freely.
- **Files that would need changes:** `dom.ts` (implement focus trap when buttons present), `toast-manager.ts` (auto-focus on show when buttons exist).

---

## Phase 2: DX & Framework Expansion

### ❌ First-Party React/Vue/Svelte Wrappers
- **PLAN.md says:** "Create official packages (`@tiktik/react`, `@tiktik/vue`) that wrap the vanilla core, providing hooks like `useTiktik()` and components."
- **Codebase reality:** Zero framework wrapper code exists. No `packages/` directory, no monorepo setup, no React/Vue/Svelte components or hooks.
- **Scope:** This requires creating separate npm packages with framework-specific providers, hooks, and JSX/template components.

### ❌ Headless Mode / Custom Renderers
- **PLAN.md says:** "Allow developers to pass a custom DOM element or framework component into `showToast`, bypassing the default pill UI entirely."
- **Codebase reality:** `createToastElement()` in `dom.ts` always builds the full pill DOM. No `render` or `customElement` option in `ToastOptions`. No hook/callback to override the toast's DOM structure.
- **Files that would need changes:** `types.ts` (add `render?: (options) => HTMLElement`), `dom.ts` (use custom renderer if provided), `toast-manager.ts` (pass renderer through).

---

## Phase 3: Performance & Optimization

### ❌ GSAP Decoupling / Web Animations API (WAAPI) Migration
- **PLAN.md says:** "Investigate moving the exact GSAP elastic easing curves to the native Web Animations API (WAAPI) to remove the GSAP peer dependency entirely."
- **Codebase reality:** GSAP remains the animation engine. CSS fallback exists but uses basic keyframe animations, not WAAPI. No `Element.animate()` calls anywhere.
- **Files that would need changes:** `animations.ts` (add WAAPI path as intermediate between GSAP and CSS), `swipe.ts` (WAAPI spring-back).

### ❌ Lazy Loading / Code-Splitting
- **PLAN.md says:** "Implement code-splitting for complex features so the base bundle drops below 5KB."
- **Codebase reality:** Rollup produces a single monolithic bundle per format (ESM, CJS, UMD). No dynamic `import()` for features like progress bars or promise handling. No tree-shaking entry points.
- **Files that would need changes:** `rollup.config.mjs` (multiple entry points), `index.ts` (dynamic imports for optional features).

---

## Feature Comparison Matrix Updates Needed

| Feature | PLAN.md Status | Actual Status |
|---|---|---|
| Swipe to Dismiss | ❌ No | ✅ Now implemented |
| Stacking/Reflow | ✅ Basic | ✅ Now advanced (deck) |
| Accessibility (A11y) | ⚠️ Partial | ⚠️ Improved but still partial (no focus trap, no keyboard shortcut) |
| Headless/Unstyled Mode | ❌ No | ❌ Still missing |
| Bundle Size | ~18KB (+GSAP) | ~18KB (+GSAP) — unchanged |
