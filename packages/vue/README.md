# @tiktik/vue

Vue 3 wrapper for the [Tiktik](../../) notification library. Provides a Vue plugin and a `useTiktik()` composable.

## Installation

```bash
npm install tiktik @tiktik/vue
```

## Quick Start

### 1. Install the plugin

```ts
import { createApp } from 'vue';
import { TiktikPlugin } from '@tiktik/vue';
import App from './App.vue';

const app = createApp(App);
app.use(TiktikPlugin, { theme: 'dark', stackStyle: 'deck' });
app.mount('#app');
```

### 2. Use the composable

```vue
<script setup>
import { useTiktik } from '@tiktik/vue';

const { success, error, promise } = useTiktik();

async function handleSave() {
  await promise(
    fetch('/api/save', { method: 'POST' }),
    { loading: 'Saving...', success: 'Done!', error: 'Failed' }
  );
}
</script>

<template>
  <button @click="handleSave">Save</button>
</template>
```

### 3. Options API (via `this.$tiktik`)

```vue
<script>
export default {
  methods: {
    save() {
      this.$tiktik.success('Saved!');
    }
  }
};
</script>
```

## API Reference

### `TiktikPlugin`

Install via `app.use(TiktikPlugin, config?)`. Config is `Partial<TiktikConfig>`.

### `useTiktik()`

| Method | Signature | Description |
|---|---|---|
| `success` | `(msg, opts?) => id` | Show success toast |
| `error` | `(msg, opts?) => id` | Show error toast |
| `info` | `(msg, opts?) => id` | Show info toast |
| `warning` | `(msg, opts?) => id` | Show warning toast |
| `loading` | `(msg, opts?) => id` | Persistent loading toast |
| `showToast` | `(opts) => id` | Full options |
| `promise` | `(promise, msgs, opts?) => Promise` | Loading → success/error |
| `dismiss` | `(id) => void` | Dismiss by ID |
| `dismissAll` | `() => void` | Dismiss all |

## License

MIT
