# @tiktik/react

React wrapper for the [Tiktik](../../) notification library. Provides idiomatic React hooks, a context provider, and an optional declarative component.

## Installation

```bash
npm install tiktik @tiktik/react
```

## Quick Start

### 1. Wrap your app with `TiktikProvider`

```tsx
import { TiktikProvider } from '@tiktik/react';

function App() {
  return (
    <TiktikProvider config={{ theme: 'dark', stackStyle: 'deck' }}>
      <MyApp />
    </TiktikProvider>
  );
}
```

### 2. Use the `useTiktik()` hook

```tsx
import { useTiktik } from '@tiktik/react';

function SaveButton() {
  const { success, error, promise } = useTiktik();

  const handleSave = async () => {
    try {
      await promise(
        fetch('/api/save', { method: 'POST' }),
        {
          loading: 'Saving...',
          success: 'Saved successfully!',
          error: 'Failed to save',
        }
      );
    } catch (err) {
      // error toast already shown by promise()
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### 3. Declarative `TiktikToast` component (optional)

```tsx
import { useState } from 'react';
import { TiktikToast } from '@tiktik/react';

function FormPage() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <button onClick={() => setSaved(true)}>Save</button>
      <TiktikToast
        visible={saved}
        type="success"
        message="Changes saved!"
        duration={3000}
        onDismiss={() => setSaved(false)}
      />
    </>
  );
}
```

## API Reference

### `<TiktikProvider>`

| Prop | Type | Description |
|---|---|---|
| `config` | `Partial<TiktikConfig>` | Global configuration (theme, position, stackStyle, etc.) |
| `children` | `ReactNode` | Your app |

### `useTiktik()`

Returns all Tiktik methods:

| Method | Signature | Description |
|---|---|---|
| `success` | `(msg, opts?) => id` | Show success toast |
| `error` | `(msg, opts?) => id` | Show error toast |
| `info` | `(msg, opts?) => id` | Show info toast |
| `warning` | `(msg, opts?) => id` | Show warning toast |
| `loading` | `(msg, opts?) => id` | Show persistent loading toast |
| `showToast` | `(opts) => id` | Show toast with full options |
| `promise` | `(promise, msgs, opts?) => Promise` | Loading → success/error |
| `dismiss` | `(id) => void` | Dismiss by ID |
| `dismissAll` | `() => void` | Dismiss all |
| `configure` | `(opts) => void` | Update config |
| `resetConfig` | `() => void` | Reset to defaults |

### `<TiktikToast>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `visible` | `boolean` | — | Show/hide the toast |
| `message` | `string` | — | Toast message |
| `type` | `ToastType` | `'default'` | Toast type |
| `duration` | `number` | config default | Auto-dismiss ms |
| `position` | `ToastPosition` | config default | Screen position |
| `progress` | `boolean` | `false` | Show progress bar |
| `options` | `Partial<ToastOptions>` | `{}` | Extra options |
| `onDismiss` | `() => void` | — | Called on dismiss |

### Headless Mode (Custom Rendering)

Use the `render` callback to provide your own JSX-powered DOM:

```tsx
const { showToast } = useTiktik();

showToast({
  message: 'Custom toast',
  type: 'info',
  duration: 5000,
  render: (opts, dismiss) => {
    const el = document.createElement('div');
    el.className = 'my-custom-toast';
    el.innerHTML = `<span>${opts.message}</span>`;
    el.querySelector('span')?.addEventListener('click', dismiss);
    return el;
  },
});
```

Tiktik handles lifecycle, timers, swipe-to-dismiss, deck stacking, and animations — you control the DOM.

## License

MIT
