import LiveDemo from '../../components/LiveDemo';
import CodeBlock from '../../components/CodeBlock';

const propsData = [
  { name: 'message', type: 'string', default: 'required', desc: 'Toast text content' },
  { name: 'type', type: "'success' | 'error' | 'info' | 'warning'", default: "'info'", desc: 'Visual type and accent color' },
  { name: 'duration', type: 'number', default: '3000', desc: 'Auto-dismiss in ms. Use Infinity for persistent' },
  { name: 'position', type: "'top' | 'bottom'", default: "'top'", desc: 'Container position on screen' },
  { name: 'icon', type: 'string | SVGElement', default: '—', desc: 'Custom SVG icon string or element' },
  { name: 'progress', type: 'boolean', default: 'false', desc: 'Show countdown progress bar' },
  { name: 'id', type: 'string', default: 'auto', desc: 'Dedup key — same id updates in place' },
  { name: 'onClick', type: '() => void', default: '—', desc: 'Click handler callback' },
  { name: 'onDismiss', type: '() => void', default: '—', desc: 'Post-dismiss callback' },
];

export default function ToastComponentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Toast Component</h1>
      <p className="text-text-secondary mb-8 leading-relaxed">
        Dynamic Island–style toast notifications with smooth morphing animations,
        stacking, deduplication, and more.
      </p>

      {/* Live Demo */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Live Demo</h2>
        <p className="text-text-secondary text-sm mb-4">
          Click any button below to trigger a live toast notification. See the animations, stacking,
          and transitions in real time.
        </p>
        <LiveDemo />
      </section>

      {/* Installation */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Installation</h2>
        <CodeBlock
          code="npm install tiktiktoast"
          language="bash"
          title="terminal"
        />
      </section>

      {/* Basic Usage */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Basic Usage</h2>
        <CodeBlock
          code={`import { Tiktik } from 'tiktiktoast'

// Type shortcuts — the simplest way
Tiktik.success('Changes saved!')
Tiktik.error('Something went wrong.')
Tiktik.warning('Disk space running low.')
Tiktik.info('New update available.')`}
          language="typescript"
          title="basic.ts"
        />
      </section>

      {/* Advanced Usage */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Advanced Usage</h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">With Progress Bar</h3>
            <CodeBlock
              code={`Tiktik.success('Uploading...', {
  progress: true,
  duration: 5000,
})`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Deduplication</h3>
            <CodeBlock
              code={`// Same ID updates the toast in place with morph animation
Tiktik.showToast({ message: 'Step 1...', type: 'info', id: 'steps' })
Tiktik.showToast({ message: 'Step 2...', type: 'warning', id: 'steps' })
Tiktik.showToast({ message: 'Done!', type: 'success', id: 'steps' })`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Promise Tracking</h3>
            <CodeBlock
              code={`Tiktik.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (data) => \`Saved! \${data.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
})`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Custom Icon</h3>
            <CodeBlock
              code={`const starSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'

Tiktik.showToast({
  message: 'Starred!',
  type: 'warning',
  icon: starSVG,
})`}
              language="typescript"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">Dismiss</h3>
            <CodeBlock
              code={`const id = Tiktik.success('Dismissable toast')

// Dismiss one
Tiktik.dismiss(id)

// Dismiss all
Tiktik.dismiss()`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      {/* Props Table */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Props</h2>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-overlay border-b border-border">
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Prop</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Default</th>
                  <th className="text-left px-4 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody>
                {propsData.map((prop, i) => (
                  <tr key={prop.name} className={`border-b border-border ${i % 2 === 0 ? 'bg-surface-raised' : 'bg-surface'}`}>
                    <td className="px-4 py-3 font-mono text-primary text-xs">{prop.name}</td>
                    <td className="px-4 py-3 font-mono text-text-muted text-xs">{prop.type}</td>
                    <td className="px-4 py-3 font-mono text-text-muted text-xs">{prop.default}</td>
                    <td className="px-4 py-3 text-text-secondary text-xs">{prop.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">Tips & Best Practices</h2>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
            <p className="text-sm text-text-secondary">
              <span className="text-primary font-semibold">💡 Dedup for real-time updates:</span>{' '}
              Use the <code className="text-primary text-xs bg-primary/10 px-1 py-0.5 rounded">id</code> option
              with a stable key to update toasts in place instead of creating new ones. Great for progress updates.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-success/20 bg-success/5">
            <p className="text-sm text-text-secondary">
              <span className="text-success font-semibold">🚀 SSR-safe by default:</span>{' '}
              Tiktik never accesses <code className="text-success text-xs bg-success/10 px-1 py-0.5 rounded">window</code> or{' '}
              <code className="text-success text-xs bg-success/10 px-1 py-0.5 rounded">document</code> at
              import time. Safe to use with Next.js, Nuxt, and any SSR framework.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-warning/20 bg-warning/5">
            <p className="text-sm text-text-secondary">
              <span className="text-warning font-semibold">⚡ Bundle splitting:</span>{' '}
              The promise handler and gesture modules are lazy-loaded. Your initial bundle stays lean (~6KB gzip),
              with additional chunks only loaded when needed.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
