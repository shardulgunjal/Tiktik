---
name: Tiktik
description: Adds Dynamic Island–style toast notifications to any web project. Zero dependencies. WAAPI-powered.
---

# Tiktik — Dynamic Island Toast Library

## What this skill does

Adds Tiktik toast notifications to any web project.
Call `showToast`, `success`, `error`, `info`, `warning`, or `promise` from anywhere.

## Quick usage

```typescript
import { Tiktik } from 'tiktik'

// Simple shortcuts
Tiktik.success('Saved!')
Tiktik.error('Something went wrong.')
Tiktik.warning('Disk almost full.')
Tiktik.info('New version available.')

// Full options
Tiktik.showToast({
  message: 'Custom toast',
  type: 'success',
  duration: 5000,
  position: 'bottom',
  progress: true,
  onClick: () => console.log('Clicked!'),
})

// Promise tracking
Tiktik.promise(fetch('/api'), {
  loading: 'Saving...',
  success: 'Done!',
  error: (err) => `Failed: ${err.message}`,
})

// Global config
Tiktik.configure({ position: 'bottom', duration: 5000 })
```

## File map

- `src/core.ts` — queue and lifecycle logic
- `src/animations.ts` — all WAAPI keyframes and timing constants
- `src/dom.ts` — DOM structure, RTL, theming
- `src/types.ts` — all interfaces, extend here for new options
- `src/styles.ts` — CSS injection, visual spec, theme tokens
- `src/gestures.ts` — swipe-to-dismiss (lazy-loaded)
- `src/promise.ts` — promise wrapper (lazy-loaded)
- `src/utils.ts` — constants, uid, isBrowser, cleanup helpers

## Extension points

- **Custom renderer**: `Tiktik.configure({ renderer: (toast) => HTMLElement })`
- **CSS tokens**: override `--tiktik-*` on `:root`
- **New type**: add to `ToastType` union in `types.ts`, add color in `styles.ts`
