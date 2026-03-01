<p align="center">
  <h1 align="center">TikTiktoast 🔔</h1>
  <p align="center">
    <strong>Dynamic Island–style toast notifications for the web.</strong><br/>
    Zero dependencies · SSR-safe · Accessible · ~5KB gzipped
  </p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tiktiktoast"><img src="https://img.shields.io/npm/v/tiktiktoast?style=flat-square&color=6366f1" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/tiktiktoast"><img src="https://img.shields.io/npm/dm/tiktiktoast?style=flat-square&color=22c55e" alt="npm downloads"></a>
  <a href="https://bundlephobia.com/package/tiktiktoast"><img src="https://img.shields.io/bundlephobia/minzip/tiktiktoast?style=flat-square&color=3b82f6&label=gzip" alt="bundle size"></a>
  <a href="https://github.com/your-username/tiktiktoast/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/tiktiktoast?style=flat-square&color=f59e0b" alt="license"></a>
</p>

<p align="center">
  <a href="https://tiktiktoast.vercel.app">Live Demo</a> ·
  <a href="https://tiktiktoast.vercel.app/docs">Documentation</a> ·
  <a href="https://tiktiktoast.vercel.app/docs/api">API Reference</a>
</p>

---

## ✨ Features

- **🏝️ Dynamic Island morphing** — Pill-to-card transitions with spring easing
- **📚 Stacking & queue** — Max 5 visible, rest queued with animated reflow
- **🔄 Promise tracking** — `loading → success/error` transitions in one API call
- **🔁 Deduplication** — Same `id` updates toast in place with morph animation
- **📊 Progress bar** — 2px WAAPI-animated countdown bar
- **👆 Swipe to dismiss** — Rubber-band gesture (lazy-loaded module)
- **🌐 RTL support** — Auto-detected, flips icons, text, and swipe direction
- **♿ Accessible** — `role="alert"`, `aria-live`, keyboard nav, `Alt+T` focus
- **🖥️ SSR safe** — No `window`/`document` access at import time (Next.js, Nuxt, etc.)
- **🎯 Zero dependencies** — Pure vanilla JS + TypeScript + Web Animations API
- **🎬 Reduced motion** — Respects `prefers-reduced-motion: reduce`
- **🎨 Customizable** — CSS variables, custom icons, custom renderers

---

## 📦 Installation

```bash
npm install tiktiktoast
```

```bash
yarn add tiktiktoast
```

```bash
pnpm add tiktiktoast
```

### CDN (No bundler)

```html
<script src="https://unpkg.com/tiktiktoast/dist/tiktik.umd.js"></script>
<script>
  Tiktik.success('Hello from CDN!')
</script>
```

---

## 🚀 Quick Start

```typescript
import { Tiktik } from 'tiktiktoast'

// One line. That's it.
Tiktik.success('Changes saved!')
Tiktik.error('Something went wrong.')
Tiktik.warning('Disk space running low.')
Tiktik.info('New update available.')
```

---

## 📖 API

### Type Shortcuts

```typescript
Tiktik.success(message, options?)  // ✓ green accent
Tiktik.error(message, options?)    // ✕ red accent
Tiktik.info(message, options?)     // ℹ blue accent
Tiktik.warning(message, options?)  // ⚠ orange accent
```

### `Tiktik.showToast(options)`

Full control over every option:

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

### `Tiktik.promise(promise, options)`

Track async operations with automatic state transitions:

```typescript
Tiktik.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (data) => `Saved! ${data.name}`,
  error:   (err) => `Failed: ${err.message}`,
  duration: 3000,
})
```

### `Tiktik.dismiss(id?)`

```typescript
const id = Tiktik.success('Dismissible')
Tiktik.dismiss(id)   // dismiss one
Tiktik.dismiss()     // dismiss all
```

### `Tiktik.configure(defaults)`

Set global defaults. SSR-safe (no DOM access).

```typescript
Tiktik.configure({
  type: 'info',
  duration: 5000,
  position: 'bottom',
  progress: true,
})
```

### `Tiktik.onStackChange(listener)`

```typescript
Tiktik.onStackChange((visible, queued) => {
  console.log(`Visible: ${visible}, Queued: ${queued}`)
})
```

---

## ⚙️ Options Reference

| Option | Type | Default | Description |
|---|---|---|---|
| `message` | `string` | *required* | Toast text content |
| `type` | `'success' \| 'error' \| 'info' \| 'warning'` | `'info'` | Visual type and accent color |
| `duration` | `number` | `3000` | Auto-dismiss in ms (`Infinity` = manual) |
| `position` | `'top' \| 'bottom'` | `'top'` | Container position |
| `icon` | `string \| SVGElement` | — | Custom icon (SVG string or element) |
| `progress` | `boolean` | `false` | Show countdown progress bar |
| `id` | `string` | auto | Deduplication key |
| `onClick` | `() => void` | — | Click handler |
| `onDismiss` | `() => void` | — | Post-dismiss callback |

## 🔧 Global Configuration

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | `ToastType` | `'info'` | Default toast type |
| `duration` | `number` | `3000` | Default duration (ms) |
| `position` | `ToastPosition` | `'top'` | Default position |
| `progress` | `boolean` | `false` | Show progress bar by default |
| `renderer` | `CustomRenderer` | — | Custom renderer function |
| `audio` | `boolean` | `false` | Enable audio cues |

---

## 🎨 CSS Customization

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

---

## 📏 Bundle Size

| Chunk | Size (gzip) |
|---|---|
| **Base** | ~5 KB |
| Gestures (lazy) | ~0.75 KB |
| Promise (lazy) | ~0.5 KB |

> The gesture and promise modules are **lazy-loaded** on first use. Your initial bundle stays lean.

---

## 🌐 Browser Support

All modern browsers with [Web Animations API](https://caniuse.com/web-animation) support:

| Chrome | Firefox | Safari | Edge |
|---|---|---|---|
| 36+ | 48+ | 13.1+ | 79+ |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

[MIT](LICENSE) — Free for personal and commercial use.
