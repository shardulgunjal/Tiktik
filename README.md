# 🔔 Tiktik

**Dynamic Island–style notification/toast library** for the modern web.

Smooth GSAP-powered animations, accessible, endlessly customizable, and NPM-ready.

---

## Installation

```bash
npm install tiktik

# Optional: install GSAP for premium animations
npm install gsap
```

### CDN (browser)

```html
<!-- Optional GSAP -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<!-- Tiktik UMD -->
<script src="dist/tiktik.umd.js"></script>
```

---

## Quick Start

```js
import Tiktik from 'tiktik';

Tiktik.success('Changes saved!');
Tiktik.error('Something went wrong');
Tiktik.info('New update available');
Tiktik.warning('Disk space low');
```

## API Reference

### `Tiktik.showToast(options)`

```js
Tiktik.showToast({
  message: 'Hello World',
  type: 'success',       // 'success' | 'error' | 'info' | 'warning' | 'default' | 'loading'
  duration: 5000,         // ms (0 = persistent)
  position: 'top-center', // 'top-left' | 'top-center' | 'top-right' | 'bottom-*'
  icon: '🎉',             // custom icon (emoji or HTML)
  progress: true,          // show progress bar
  onClick: () => {},       // click callback
  expandedContent: '...',  // HTML shown on hover
  buttons: [
    { label: 'Undo', onClick: () => {} }
  ],
  html: '<div>...</div>',  // raw HTML content
});
```

### Shorthand Methods

```js
Tiktik.success(message, options?)
Tiktik.error(message, options?)
Tiktik.info(message, options?)
Tiktik.warning(message, options?)
Tiktik.loading(message, options?)  // persistent until dismissed
```

### Promise Toast

```js
Tiktik.promise(fetch('/api/data'), {
  loading: 'Fetching data…',
  success: 'Loaded!',
  error: 'Failed to load',
});
```

### Dismiss

```js
const id = Tiktik.success('Saved!');
Tiktik.dismiss(id);     // dismiss one
Tiktik.dismissAll();     // dismiss all
```

### Global Configuration

```js
Tiktik.configure({
  duration: 4000,
  position: 'bottom-right',
  progress: true,
  animationSpeed: 1.2,
  maxToasts: 5,
  theme: 'dark',   // 'auto' | 'light' | 'dark'
});
```

---

## Theming

Override CSS custom properties:

```css
:root {
  --tiktik-radius: 16px;
  --tiktik-font: 'Roboto', sans-serif;
  --tiktik-success-accent: #22c55e;
}
```

---

## GSAP Integration

Tiktik automatically detects GSAP. When present, it uses elastic morphing, bounce, and dynamic width transitions. Without GSAP, it gracefully falls back to CSS keyframe animations.

---

## Build

```bash
npm run build   # outputs dist/tiktik.esm.js, dist/tiktik.cjs.js, dist/tiktik.umd.js
```

---

## License

MIT
