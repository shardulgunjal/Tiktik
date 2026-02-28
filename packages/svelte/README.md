# @tiktik/svelte

Svelte wrapper for the [Tiktik](../../) notification library. Provides a module-level store and a `use:toast` action.

## Installation

```bash
npm install tiktik @tiktik/svelte
```

## Quick Start

### 1. Import and use the store

```svelte
<script>
  import { tiktik } from '@tiktik/svelte';

  function handleSave() {
    tiktik.success('Saved!');
  }

  async function loadData() {
    await tiktik.promise(
      fetch('/api/data'),
      { loading: 'Loading...', success: 'Done!', error: 'Failed' }
    );
  }
</script>

<button on:click={handleSave}>Save</button>
```

### 2. Declarative `use:toast` action

```svelte
<script>
  import { toast } from '@tiktik/svelte';
</script>

<!-- Simple message string -->
<button use:toast={'Item deleted!'}>
  Delete
</button>

<!-- Full options object -->
<button use:toast={{ message: 'Saved!', type: 'success', duration: 3000 }}>
  Save
</button>
```

### 3. Configure on app init

```svelte
<!-- +layout.svelte or App.svelte -->
<script>
  import { tiktik } from '@tiktik/svelte';
  import { onMount } from 'svelte';

  onMount(() => {
    tiktik.configure({ theme: 'dark', stackStyle: 'deck' });
  });
</script>
```

## API Reference

### `tiktik` (store)

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
| `configure` | `(opts) => void` | Update config |

### `toast` (action)

`use:toast={string | ToastOptions}` — triggers a toast on click.

## License

MIT
