import CodeBlock from '../components/CodeBlock';

const methods = [
  {
    name: 'Tiktik.showToast(options)',
    desc: 'Show a toast with full control over options. Returns the toast ID.',
    code: `Tiktik.showToast({
  message: 'Hello world',
  type: 'success',
  duration: 3000,
  position: 'top',
  progress: true,
  id: 'my-toast',
  onClick: () => console.log('clicked'),
  onDismiss: () => console.log('dismissed'),
})`,
  },
  {
    name: 'Tiktik.success(message, options?)',
    desc: 'Show a success toast. Shortcut for showToast with type: "success".',
    code: `Tiktik.success('Changes saved!')
Tiktik.success('Saved!', { duration: 5000, progress: true })`,
  },
  {
    name: 'Tiktik.error(message, options?)',
    desc: 'Show an error toast. Shortcut for showToast with type: "error".',
    code: `Tiktik.error('Something went wrong.')`,
  },
  {
    name: 'Tiktik.info(message, options?)',
    desc: 'Show an info toast. Shortcut for showToast with type: "info".',
    code: `Tiktik.info('New update available.')`,
  },
  {
    name: 'Tiktik.warning(message, options?)',
    desc: 'Show a warning toast. Shortcut for showToast with type: "warning".',
    code: `Tiktik.warning('Disk space is running low.')`,
  },
  {
    name: 'Tiktik.promise(promise, options)',
    desc: 'Track a promise with loading → success/error transitions. The promise handler is lazy-loaded.',
    code: `Tiktik.promise(fetch('/api/data'), {
  loading: 'Fetching data...',
  success: (data) => \`Loaded \${data.length} items\`,
  error: (err) => \`Error: \${err.message}\`,
  duration: 3000,
  position: 'top',
})`,
  },
  {
    name: 'Tiktik.dismiss(id?)',
    desc: 'Dismiss a specific toast by ID, or all toasts if no ID is given.',
    code: `const id = Tiktik.success('Hello')
Tiktik.dismiss(id)   // dismiss one
Tiktik.dismiss()     // dismiss all`,
  },
  {
    name: 'Tiktik.configure(defaults)',
    desc: 'Set global default options. SSR-safe — no DOM access.',
    code: `Tiktik.configure({
  type: 'info',
  duration: 5000,
  position: 'bottom',
  progress: true,
})`,
  },
  {
    name: 'Tiktik.onStackChange(listener)',
    desc: 'Register a callback fired whenever the visible/queued count changes.',
    code: `Tiktik.onStackChange((visible, queued) => {
  console.log(\`Visible: \${visible}, Queued: \${queued}\`)
})`,
  },
];

const toastOptionsFields = [
  { name: 'message', type: 'string', desc: 'Toast text content' },
  { name: 'type', type: 'ToastType', desc: "Visual type: 'success' | 'error' | 'info' | 'warning'" },
  { name: 'duration', type: 'number', desc: 'Auto-dismiss in ms. Infinity for persistent' },
  { name: 'position', type: 'ToastPosition', desc: "'top' | 'bottom'" },
  { name: 'icon', type: 'string | SVGElement', desc: 'Custom SVG icon' },
  { name: 'progress', type: 'boolean', desc: 'Show countdown progress bar' },
  { name: 'id', type: 'string', desc: 'Dedup key — same id updates in place' },
  { name: 'onClick', type: '() => void', desc: 'Click callback' },
  { name: 'onDismiss', type: '() => void', desc: 'Post-dismiss callback' },
];

const configFields = [
  { name: 'type', type: 'ToastType', desc: "Default toast type. Default: 'info'" },
  { name: 'duration', type: 'number', desc: 'Default duration in ms. Default: 3000' },
  { name: 'position', type: 'ToastPosition', desc: "Default position. Default: 'top'" },
  { name: 'progress', type: 'boolean', desc: 'Show progress bar by default. Default: false' },
  { name: 'renderer', type: 'CustomRenderer', desc: 'Custom renderer — replaces default DOM template' },
  { name: 'audio', type: 'boolean', desc: 'Enable audio cues (opt-in). Default: false' },
];

const cssVars = [
  { name: '--tiktik-bg', default: '#1a1a2e', desc: 'Toast background color' },
  { name: '--tiktik-text', default: '#ffffff', desc: 'Toast text color' },
  { name: '--tiktik-radius-pill', default: '9999px', desc: 'Border radius in compact (pill) state' },
  { name: '--tiktik-radius-card', default: '24px', desc: 'Border radius in expanded (card) state' },
  { name: '--tiktik-shadow', default: '0 4px 16px rgba(0,0,0,0.3)', desc: 'Box shadow' },
  { name: '--tiktik-z-index', default: '999999', desc: 'Z-index of the toast container' },
  { name: '--tiktik-font-size', default: '14px', desc: 'Base font size' },
  { name: '--tiktik-duration', default: '320ms', desc: 'Animation duration' },
];

function InterfaceTable({ fields }: { fields: { name: string; type: string; desc: string }[] }) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-overlay border-b border-border">
              <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Property</th>
              <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Type</th>
              <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f, i) => (
              <tr key={f.name} className={`border-b border-border ${i % 2 === 0 ? 'bg-surface-raised' : 'bg-surface'}`}>
                <td className="px-4 py-3 font-mono text-primary text-xs">{f.name}</td>
                <td className="px-4 py-3 font-mono text-text-muted text-xs whitespace-nowrap">{f.type}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">{f.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ApiReference() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">API Reference</h1>
      <p className="text-text-secondary mb-8 leading-relaxed">
        Complete reference for all Tiktik methods, interfaces, and CSS custom properties.
      </p>

      {/* Methods */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Methods</h2>
        <div className="space-y-8">
          {methods.map((m) => (
            <div key={m.name}>
              <h3 className="font-mono text-sm font-semibold text-primary mb-1">{m.name}</h3>
              <p className="text-text-secondary text-sm mb-3">{m.desc}</p>
              <CodeBlock code={m.code} language="typescript" />
            </div>
          ))}
        </div>
      </section>

      {/* ToastOptions Interface */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          <code className="text-primary">ToastOptions</code> Interface
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          Options accepted by <code className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">Tiktik.showToast()</code>.
        </p>
        <InterfaceTable fields={toastOptionsFields} />
      </section>

      {/* TiktikConfig Interface */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          <code className="text-primary">TiktikConfig</code> Interface
        </h2>
        <p className="text-text-secondary text-sm mb-4">
          Global configuration set via <code className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">Tiktik.configure()</code>.
        </p>
        <InterfaceTable fields={configFields} />
      </section>

      {/* CSS Custom Properties */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">CSS Custom Properties</h2>
        <p className="text-text-secondary text-sm mb-4">
          Override these on <code className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">:root</code> to
          customize the toast appearance.
        </p>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-overlay border-b border-border">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Variable</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Default</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {cssVars.map((v, i) => (
                  <tr key={v.name} className={`border-b border-border ${i % 2 === 0 ? 'bg-surface-raised' : 'bg-surface'}`}>
                    <td className="px-4 py-3 font-mono text-primary text-xs">{v.name}</td>
                    <td className="px-4 py-3 font-mono text-text-muted text-xs">{v.default}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{v.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bundle Size */}
      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Bundle Size</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-overlay border-b border-border">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Chunk</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Size (gzip)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-surface-raised border-b border-border">
                  <td className="px-4 py-3 text-text-primary text-xs font-medium">Base</td>
                  <td className="px-4 py-3 text-success font-mono text-xs">~5 KB</td>
                </tr>
                <tr className="bg-surface border-b border-border">
                  <td className="px-4 py-3 text-text-primary text-xs font-medium">Gestures (lazy)</td>
                  <td className="px-4 py-3 text-success font-mono text-xs">~0.75 KB</td>
                </tr>
                <tr className="bg-surface-raised">
                  <td className="px-4 py-3 text-text-primary text-xs font-medium">Promise (lazy)</td>
                  <td className="px-4 py-3 text-success font-mono text-xs">~0.5 KB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
