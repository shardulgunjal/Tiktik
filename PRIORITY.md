# PRIORITY — Missing Items Ranked by Strategic Impact

## Ranking Criteria
Each item scored 1-5 on four axes. Higher total = higher priority.

| # | Item | Market Differentiation | Engineering Complexity | Bundle Impact | DX Improvement | **Total** |
|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Headless Mode / Custom Renderers | 5 | 2 | 1 (none) | 5 | **13** |
| 2 | Keyboard Focus Shortcut | 4 | 1 | 1 (none) | 4 | **10** |
| 3 | Focus Traps for Action Buttons | 4 | 2 | 1 (none) | 3 | **10** |
| 4 | React/Vue/Svelte Wrappers | 5 | 4 | 1 (separate pkgs) | 5 | **15** |
| 5 | WAAPI Migration (GSAP Decoupling) | 3 | 5 | 5 (removes dep) | 3 | **16** |
| 6 | Lazy Loading / Code-Splitting | 2 | 3 | 5 (sub-5KB) | 2 | **12** |

---

## Recommended Order of Implementation

### 🔴 Priority 1 — Headless Mode (Score: 13, Low Effort)
**Why first:** Single highest DX win for minimal code. Adding a `render` callback to `ToastOptions` lets framework users render custom JSX/Vue templates while Tiktik handles lifecycle, timers, swipe, and stacking. This is the bridge to framework adoption *before* building full wrappers.

**Effort:** ~2-3 hours. Add `render?: (options: ToastOptions) => HTMLElement` to types, check in `dom.ts`, pass through in `toast-manager.ts`.

### 🔴 Priority 2 — Focus Management (Score: 10, Trivial Effort)
**Why next:** Both items (keyboard shortcut + focus traps) are accessibility requirements that competitors like Sonner already handle. Combined, they close the remaining WCAG gap.

**Effort:** ~1-2 hours total.
- Keyboard shortcut: One `document.addEventListener('keydown')` in `dom.ts` that focuses the first `.tiktik-container`.
- Focus trap: When toast has buttons, call `element.focus()` on show and trap Tab within the toast.

### 🟡 Priority 3 — Framework Wrappers (Score: 15, High Effort)
**Why deferred:** Highest total score but highest complexity. Requires monorepo tooling, separate package builds, framework-specific APIs, and ongoing maintenance across React/Vue/Svelte. Should be done *after* Headless Mode exists, since wrappers will use the headless API internally.

**Effort:** ~2-4 weeks per framework.

### 🟡 Priority 4 — Lazy Loading (Score: 12, Medium Effort)
**Why deferred:** Meaningful bundle win but requires breaking the single-entry build. Only impactful after WAAPI migration reduces the GSAP dependency.

**Effort:** ~1 week. Requires Rollup multi-entry config and dynamic `import()` for promise/progress modules.

### 🔵 Priority 5 — WAAPI Migration (Score: 16, Very High Effort)
**Why last despite highest score:** Technically the most impactful (removes GSAP dependency entirely) but extremely risky — requires reverse-engineering GSAP's elastic easing curves into WAAPI `KeyframeEffect` with custom `CubicBezier` approximations. The CSS fallback already covers the no-GSAP case adequately.

**Effort:** ~2-3 weeks of R&D + testing. High risk of motion quality regression.

---

## Summary

```
NOW     → Headless Mode + Focus Management  (~1 day)
NEXT    → Framework Wrappers               (~1-2 months)
LATER   → Lazy Loading + WAAPI Migration   (~1 month R&D)
```
