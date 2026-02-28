# Tiktik 🔔

Dynamic Island–style notification/toast library for web applications.
Zero external dependencies. Vanilla JS + TypeScript + WAAPI only.

## Install

```bash
npm install tiktik
```

Or via CDN:

```html
<script src="https://unpkg.com/tiktik/dist/tiktik.umd.js"></script>
<script>
  Tiktik.success('Hello from CDN!')
</script>
```

## Quick Start

```typescript
import { Tiktik } from 'tiktik'

Tiktik.success('Changes saved!')
Tiktik.error('Something went wrong.')
Tiktik.warning('Disk space running low.')
Tiktik.info('New update available.')
```

## API Reference

### `Tiktik.showToast(options)`

Show a toast with full control over options.

```typescript
Tiktik.showToast({
  message: 'Hello world',
  type: 'success',        // 'success' | 'error' | 'info' | 'warning'
  duration: 3000,          // ms, default: 3000. Use Infinity for persistent
  position: 'top',         // 'top' | 'bottom'
  icon: '<svg>...</svg>',  // custom SVG string or SVGElement
  progress: true,          // show countdown progress bar
  id: 'unique-key',        // dedup key — same id updates in place
  onClick: () => {},       // click callback
  onDismiss: () => {},     // called after exit animation completes
})
```

### Type Shortcuts

```typescript
Tiktik.success(message, options?)  // type: 'success'
Tiktik.error(message, options?)    // type: 'error'
Tiktik.info(message, options?)     // type: 'info'
Tiktik.warning(message, options?)  // type: 'warning'
```

### `Tiktik.promise(promise, options)`

Track a promise with loading → success/error transitions.

```typescript
Tiktik.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (data) => `Saved! ${data.name}`,
  error:   (err) => `Failed: ${err.message}`,
  duration: 3000,  // auto-dismiss after resolve/reject
})
```

### `Tiktik.dismiss(id?)`

Dismiss a specific toast by ID, or all toasts if no ID is given.

```typescript
const id = Tiktik.success('Dismissible')
Tiktik.dismiss(id)   // dismiss one
Tiktik.dismiss()     // dismiss all
```

### `Tiktik.configure(defaults)`

Set global defaults. SSR-safe (does not access DOM).

```typescript
Tiktik.configure({
  type: 'info',
  duration: 5000,
  position: 'bottom',
  progress: true,
})
```

## Options Reference

| Option     | Type                           | Default   | Description                              |
|------------|-------------------------------|-----------|------------------------------------------|
| `message`  | `string`                       | required  | Toast text content                       |
| `type`     | `ToastType`                    | `'info'`  | Visual type and accent color             |
| `duration` | `number`                       | `3000`    | Auto-dismiss in ms (`Infinity` = manual) |
| `position` | `'top' \| 'bottom'`           | `'top'`   | Container position                       |
| `icon`     | `string \| SVGElement`         | —         | Custom icon (SVG string or element)      |
| `progress` | `boolean`                      | `false`   | Show countdown progress bar              |
| `id`       | `string`                       | auto      | Deduplication key                        |
| `onClick`  | `() => void`                   | —         | Click handler                            |
| `onDismiss`| `() => void`                   | —         | Post-dismiss callback                    |

## Features

- **Dynamic Island morphing** — Pill-to-card transitions with spring easing
- **Deduplication** — Same `id` updates toast in place with morph animation
- **Stacking** — Max 5 visible, rest queued with animated reflow
- **Progress bar** — 2px WAAPI-animated countdown bar
- **Swipe to dismiss** — Rubber-band gesture with lazy-loaded module
- **Promise tracking** — Spinner → checkmark/× path animation
- **RTL support** — Auto-detected, flips icons, text, and swipe direction
- **Accessibility** — `role="alert"`, `aria-live`, keyboard navigation, `Alt+T` focus
- **SSR safe** — No `window` access at import time, works in Next.js/Nuxt SSR
- **Zero dependencies** — Vanilla JS + TypeScript + Web Animations API
- **Reduced motion** — Respects `prefers-reduced-motion: reduce`

## CSS Customization

Override CSS custom properties on `:root`:

```css
:root {
  --tiktik-bg: #1a1a2e;
  --tiktik-text: #ffffff;
  --tiktik-radius-pill: 9999px;
  --tiktik-radius-card: 24px;
  --tiktik-shadow: 0 4px 16px rgba(0,0,0,0.3);
  --tiktik-z-index: 999999;
  --tiktik-font-size: 14px;
  --tiktik-duration: 320ms;
}
```

## Bundle Size

| Chunk      | Size (gzip) |
|------------|-------------|
| Base       | ~6 KB       |
| Gestures   | ~0.75 KB    |
| Promise    | ~0.5 KB     |

## Browser Support

All modern browsers with Web Animations API support (Chrome 36+, Firefox 48+, Safari 13.1+, Edge 79+).

## License

MIT
