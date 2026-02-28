```xml
<context>
You are an expert TypeScript library developer running inside Google Antigravity IDE 
with access to Ghost Runtimes for live code execution. You are Claude Opus 4.6 
with 128K output tokens — generate every file completely and confidently without truncation.

This is a high-complexity multi-file library. Apply maximum reasoning depth before 
writing each file. Think through interfaces and dependencies before generating any code.

You are building a production NPM library called Tiktik: a Dynamic Island–style 
notification/toast library for web applications. Zero external dependencies. 
Vanilla JS + TypeScript + WAAPI only.

CRITICAL — Opus 4.6 overengineering guard:
- Implement ONLY what is explicitly specified. No extra abstractions.
- No extra files beyond the file tree below.
- No "for future extensibility" patterns unless specified.
- No unnecessary generics, factories, or plugin systems.
- If in doubt: simpler is correct.
</context>

<phases>
This task runs across TWO agent phases. Read which phase you are in before proceeding.

══════════════════════════════════════════
PHASE 1 — INITIALIZER AGENT (run this first, once)
══════════════════════════════════════════

In Phase 1 your only job is environment setup. Do not write library code yet.

Step 1: Run `pwd` to confirm working directory.

Step 2: Create `init.sh` with:
  - `npm init -y`
  - Install devDependencies: typescript vite
  - `npx tsc --init`
  - `git init && git add -A && git commit -m "chore: init project"`

Step 3: Create `claude-progress.txt` with this exact schema:
```
PHASE: 1-complete
LAST_COMPLETED_FILE: init.sh
NEXT_FILE: src/types.ts
FILES_DONE: []
FILES_REMAINING: [src/types.ts, src/utils.ts, src/styles.ts, src/animations.ts,
  src/dom.ts, src/gestures.ts, src/promise.ts, src/core.ts, src/index.ts,
  vite.config.ts, tsconfig.json, package.json, index.html, SKILL.md, README.md]
BLOCKERS: none
```

Step 4: Run `bash init.sh` via Ghost Runtime to verify npm installs succeed.

Step 5: Commit: `git add -A && git commit -m "chore: phase 1 complete"`

Step 6: Update `claude-progress.txt` PHASE to `2-ready`.

Phase 1 is now complete. Stop. The Coding Agent (Phase 2) takes over.

══════════════════════════════════════════
PHASE 2 — CODING AGENT (run after Phase 1)
══════════════════════════════════════════

On every session start, before writing any code:
1. Run `cat claude-progress.txt` to read current state
2. Run `git log --oneline -5` to see recent commits
3. Pick the first file in FILES_REMAINING and implement it fully
4. After each file: update `claude-progress.txt`, run Ghost Runtime verification, commit

Deliver files in this exact order (do not skip, do not reorder):
1.  src/types.ts
2.  src/utils.ts
3.  src/styles.ts
4.  src/animations.ts
5.  src/dom.ts
6.  src/gestures.ts
7.  src/promise.ts
8.  src/core.ts
9.  src/index.ts
10. vite.config.ts
11. tsconfig.json
12. package.json
13. index.html
14. SKILL.md
15. README.md
</phases>

<file_structure>
tiktik/
├── src/
│   ├── index.ts          # public API entry, all exports
│   ├── core.ts           # toast lifecycle, queue, deduplication, state
│   ├── animations.ts     # all WAAPI + CSS animation logic
│   ├── dom.ts            # DOM creation, templates, injection, RTL
│   ├── gestures.ts       # swipe-to-dismiss (lazy-loaded chunk)
│   ├── styles.ts         # injects <style id="tiktik-styles"> once on first use
│   ├── promise.ts        # promise-based toast wrapper (lazy-loaded chunk)
│   ├── types.ts          # all TypeScript interfaces — zero `any` types
│   └── utils.ts          # uid(), clamp(), isBrowser(), named constants only
├── dist/                 # generated — do not create manually
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── SKILL.md              # Antigravity skill definition
├── claude-progress.txt   # agent state file, always kept up to date
├── init.sh               # Phase 1 setup script
└── README.md
</file_structure>

<file_length_expectations>
Use these as minimum guidance — never under-generate:

src/types.ts        ~80–120 lines   (all interfaces, unions, generics)
src/utils.ts        ~60–90 lines    (constants, uid, clamp, isBrowser, cleanup map helpers)
src/styles.ts       ~200–300 lines  (all states, types, hover, expanded, RTL, progress bar, close btn)
src/animations.ts   ~120–180 lines  (entry, exit, reposition, morph, reduced-motion, progress WAAPI)
src/dom.ts          ~180–250 lines  (container setup, toast template, icon slot, close btn, RTL logic)
src/gestures.ts     ~120–160 lines  (touch + mouse swipe, rubber-band, snap back, fly off)
src/promise.ts      ~100–140 lines  (spinner SVG, path morph to checkmark/x, state transitions)
src/core.ts         ~200–260 lines  (queue, deduplication, lifecycle, hover timer, stacking, reflow)
src/index.ts        ~60–80 lines    (public API surface, configure, shortcuts, promise wrapper)
vite.config.ts      ~40–60 lines    (lib mode, 3 formats, manual chunks, budget)
index.html          ~300–400 lines  (all demo buttons, live editor, live counter, dark theme)
README.md           ~150–200 lines  (install, usage, API reference, options table, examples)
</file_length_expectations>

<constraints>
ANTI-OVERENGINEERING RULES (enforced, Opus 4.6 specific):
- No plugin architecture
- No event emitter class unless it replaces 3+ addEventListener calls
- No abstract base classes
- No factory functions unless there are 3+ concrete implementations
- Inline simple helpers instead of abstracting to utils unless used 3+ times
- CSS-in-JS via one string in styles.ts — no CSS object models
- gestures.ts and promise.ts: dynamic import() only, never statically imported

SSR SAFETY (every DOM-touching file):
- Guard: `if (!isBrowser()) return`
- `isBrowser` lives in utils.ts: `typeof window !== 'undefined' && typeof document !== 'undefined'`
- No top-level DOM access anywhere
- styles.ts: inject <style> only inside isBrowser() check

OUTPUT QUALITY:
- You have 128K output tokens. Write every file completely. Never use "..." or "// rest unchanged"
- Every exported function: JSDoc with @param and @returns
- Zero `any` types — use types.ts interfaces exclusively
- BEM class names: `tiktik__toast`, `tiktik__toast--success`, etc.
- All magic numbers: named constants in utils.ts (e.g. MAX_VISIBLE_TOASTS = 5)
- All event listeners: stored in a cleanup map, removed on dismiss — no memory leaks
- All WAAPI animations: stored in variable, .cancel() called on dismiss
</constraints>

<task>

## P0 — Core API (implement fully)

```ts
Tiktik.showToast({
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number          // default: 3000
  position?: 'top' | 'bottom'
  icon?: string | SVGElement
  progress?: boolean
  id?: string                // deduplication key
  onClick?: () => void
  onDismiss?: () => void
})

Tiktik.success(message: string, options?: Partial<ToastOptions>): string
Tiktik.error(message: string, options?: Partial<ToastOptions>): string
Tiktik.info(message: string, options?: Partial<ToastOptions>): string
Tiktik.warning(message: string, options?: Partial<ToastOptions>): string
Tiktik.promise<T>(promise: Promise<T>, options: PromiseToastOptions<T>): string
Tiktik.dismiss(id?: string)
Tiktik.configure(defaults: Partial<TiktikConfig>)
```

## P0 — Deduplication

If `showToast()` is called with an existing `id`: update message/type in-place with morph
transition instead of creating a new toast. Default id = `uid()`.

## P0 — SSR Safety

All DOM-touching files use `isBrowser()` guard from utils.ts.
- `Tiktik.configure()` must not throw in Node.js
- `Tiktik.showToast()` in Node.js: return a uid string, do not throw
- No top-level DOM access anywhere — all setup triggered on first toast call

## P0 — Visual Spec (implement exactly)

```
Pill container:
  border-radius: 9999px (collapsed) → 24px (expanded)
  background: #000000
  box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)
  inner gradient: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0))

Collapsed:   min-width:120px  height:36px   padding:0 16px
Expanded:    min-width:300px  max-width:420px  min-height:64px  padding:12px 16px

Typography:  color:#fff  font-size:14px  font-weight:500  letter-spacing:0.01em
             font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

Layout:      icon 24×24px (left, flip right in RTL)
             text: flex-grow
             media slot: 40×40px right, optional
             close button: top-right, visible on hover only
```

## P0 — Animation Keyframes (implement exactly)

```ts
// Entry
[{ transform:'scale(0.8) translateY(-8px)', opacity:0 },
 { transform:'scale(1) translateY(0)',      opacity:1 }]
easing:'cubic-bezier(0.34,1.56,0.64,1)'  duration:400  fill:'forwards'

// Exit
[{ transform:'scale(1)',   opacity:1 },
 { transform:'scale(0.8)', opacity:0 }]
easing:'cubic-bezier(0.4,0,1,1)'  duration:250  fill:'forwards'

// CSS morph transition (on element style):
transition: width 320ms cubic-bezier(0.34,1.56,0.64,1),
            min-width 320ms cubic-bezier(0.34,1.56,0.64,1),
            height 320ms cubic-bezier(0.34,1.56,0.64,1),
            border-radius 320ms ease,
            padding 320ms ease

// Stack reposition (WAAPI per existing toast):
duration:300  easing:'cubic-bezier(0.34,1.56,0.64,1)'  fill:'forwards'
```

## P0 — Stacking

- Max 5 visible (MAX_VISIBLE_TOASTS = 5), rest queued
- Per toast at index n behind front: scale(1 - 0.05*n), translateY(n*10px), opacity(1 - 0.15*n)
- Reflow on dismiss with animated WAAPI repositioning

## P0 — Bundle Budget

```ts
// vite.config.ts — implement exactly
build: {
  lib: {
    entry: 'src/index.ts',
    name: 'Tiktik',
    formats: ['es', 'cjs', 'umd'],
    fileName: (format) => `tiktik.${format}.js`
  },
  chunkSizeWarningLimit: 4,
  rollupOptions: {
    output: {
      manualChunks: {
        'tiktik-gestures': ['src/gestures.ts'],
        'tiktik-promise':  ['src/promise.ts']
      }
    }
  }
}
// Targets (gzipped): base ≤4KB, gestures ≤1KB, promise ≤1KB
```

## P0 — package.json

```json
{
  "name": "tiktik",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/tiktik.cjs.js",
  "module": "./dist/tiktik.es.js",
  "browser": "./dist/tiktik.umd.js",
  "exports": {
    ".": {
      "import":  "./dist/tiktik.es.js",
      "require": "./dist/tiktik.cjs.js"
    }
  },
  "sideEffects": false,
  "scripts": {
    "build": "vite build",
    "dev":   "vite"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}
```

---

## P1 — Interactivity

- Hover: expand toast, pause timer
- Mouse leave: collapse, resume timer
- Click: fires onClick
- Close ×: visible on hover, top-right, triggers exit animation
- Swipe: lazy-loads gestures.ts on first touch/mousedown
  - Threshold 80px, rubber-band resistance x*0.4 beyond 40px
  - Snap back below threshold (spring), fly off + dismiss above
  - RTL: inverted directions

## P1 — Progress Bar

- 2px bar at bottom edge, inside border-radius clip
- WAAPI: width 100%→0% over duration ms
- Pauses/resumes with hover timer
- Colors: success #22c55e, error #ef4444, info #3b82f6, warning #f59e0b
- Hidden when progress:false or duration:Infinity

## P1 — Accessibility

- role="alert" on each toast
- aria-live="polite" for info/success, "assertive" for error/warning
- aria-label="Dismiss notification" on close button
- aria-atomic="true"
- onClick toast: tabindex="0", fires on Enter/Space
- Alt+T: moves focus to container
- prefers-reduced-motion: all animation durations → 0

## P1 — Promise API (promise.ts, dynamic import only)

```ts
Tiktik.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (data) => `Saved! ${data.name}`,
  error:   (err)  => `Failed: ${err.message}`
})
```
- Spinner SVG during loading state
- Spinner → checkmark path animation on resolve (WAAPI SVG path morph)
- Spinner → × path animation on reject
- If resolves before entry animation completes: success fires after entry

## P1 — RTL

- Auto-detect `document.documentElement.dir === 'rtl'`
- Flip icon slot, text align, swipe direction, close button position
- Use margin-inline-start/end throughout CSS
- Add tiktik__container--rtl class automatically

---

## P2 — Only if P0+P1 complete AND more than 20K tokens remain in context

If fewer than 20K tokens remain after P1, skip all P2 items and proceed
directly to SKILL.md and README.md.

### Headless renderer
```ts
Tiktik.configure({ renderer: (toast: ToastData) => HTMLElement })
```

### CSS theme tokens on :root
```css
--tiktik-bg, --tiktik-text, --tiktik-radius-pill, --tiktik-radius-card,
--tiktik-shadow, --tiktik-z-index, --tiktik-font-size, --tiktik-duration
```

### Audio cues (opt-in)
```ts
Tiktik.configure({ audio: true })
// success: 880Hz 80ms, error: 220Hz 120ms — pure AudioContext, no files
```

</task>

<demo_requirements>
index.html: Dark page (#0a0a0a), centered layout, monospace font for code sections.

Required buttons (all must be present and functional):
- Success / Error / Warning / Info toasts
- Promise resolve (2s fake fetch) and Promise reject (1.5s fake fetch)
- Stack 5 (100ms delay between each)
- Queue overflow (8 toasts rapid fire)
- Custom SVG icon (inline star SVG passed as icon option)
- Long message (120-character string, tests width morph)
- Bottom position
- Deduplication (same id fired × 3 rapidly, shows single toast updating)
- Progress bar (progress:true, duration:5000)
- With action button (onClick: alert('Action clicked!'))
- RTL mode toggle (sets document.documentElement.dir = 'rtl' then fires a toast)

Also include:
- Live textarea pre-filled with Tiktik.showToast({...}) + Run button that eval()s it
- Live counter display: "Visible: X / Queued: Y" updated on every stack change
- Small label beneath each active toast showing its easing curve name
</demo_requirements>

<ghost_runtime_verification>
After implementing each file, use Antigravity's Ghost Runtime to verify:

For every TypeScript file immediately after writing it:
  `npx tsc --noEmit`
  → Must show zero errors before moving to the next file.
  → If errors exist: fix them in the same session before committing.

For bundle size (run after vite.config.ts is written):
  `npm run build && du -sh dist/*`
  → Verify each chunk is within gzipped targets.

For SSR safety (run after src/index.ts is written):
  `node -e "const t = require('./dist/tiktik.cjs.js'); t.Tiktik.configure({});"`
  → Must not throw any error.

For UMD CDN compatibility (run after build):
  Verify dist/tiktik.umd.js exists and exposes window.Tiktik

For demo (run after index.html is written):
  Open index.html in Ghost Runtime browser preview.
  → Verify all 11 buttons produce correct visual behavior.
  → Verify live counter updates correctly.
  → Verify live editor Run button executes without error.

Commit after each verified file:
  `git add -A && git commit -m "feat: implement [filename]"`
</ghost_runtime_verification>

<skill_md_spec>
Create SKILL.md at project root for Antigravity Skills compatibility:

```markdown
# Tiktik — Dynamic Island Toast Library

## What this skill does
Adds Tiktik toast notifications to any web project.
Call showToast, success, error, info, warning, or promise from anywhere.

## Quick usage
import { Tiktik } from 'tiktik'
Tiktik.success('Saved!')
Tiktik.promise(fetch('/api'), { loading:'...', success:'Done', error:'Failed' })

## File map
- src/core.ts       — queue and lifecycle logic
- src/animations.ts — all WAAPI keyframes and timing constants
- src/dom.ts        — DOM structure, RTL, theming
- src/types.ts      — all interfaces, extend here for new options

## Extension points
- Custom renderer: Tiktik.configure({ renderer: fn })
- CSS tokens: override --tiktik-* on :root
- New type: add to ToastType union in types.ts, add color in styles.ts
```
</skill_md_spec>

<competitive_checklist>
Every item must pass before the task is considered complete:

[ ] require('tiktik') in Node.js — no ReferenceError on window
[ ] Works in Next.js App Router (no window at import time)
[ ] Works in Nuxt 3 SSR
[ ] dist/tiktik.umd.js exists and exposes window.Tiktik for CDN use
[ ] Zero React dependency
[ ] Dynamic Island morphing with exact specified easing curves
[ ] Deduplication by id updates toast in place with morph transition
[ ] Base bundle ≤ 4KB gzipped
[ ] sideEffects: false in package.json
[ ] RTL layout auto-detected and applied
[ ] prefers-reduced-motion disables all animation durations
[ ] Promise API with SVG path morph on resolve and reject
[ ] SKILL.md present and Antigravity-compatible
[ ] claude-progress.txt updated after every single file
[ ] Ghost Runtime tsc --noEmit passes after every TypeScript file
</competitive_checklist>
```
