import CodeBlock from '../components/CodeBlock';

export default function GettingStarted() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">Getting Started</h1>
      <p className="text-text-secondary mb-8 leading-relaxed">
        Get up and running with tiktiktoast in less than a minute. Zero configuration required.
      </p>

      {/* Installation */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Installation</h2>
        <p className="text-text-secondary text-sm mb-4">
          Install via your preferred package manager:
        </p>

        <div className="space-y-3">
          <CodeBlock
            code="npm install tiktiktoast"
            language="bash"
            title="npm"
          />
          <CodeBlock
            code="yarn add tiktiktoast"
            language="bash"
            title="yarn"
          />
          <CodeBlock
            code="pnpm add tiktiktoast"
            language="bash"
            title="pnpm"
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">CDN (No Bundler)</h3>
          <CodeBlock
            code={`<script src="https://unpkg.com/tiktiktoast/dist/tiktik.umd.js"></script>
<script>
  Tiktik.success('Hello from CDN!')
</script>`}
            language="html"
            title="index.html"
          />
        </div>
      </section>

      {/* Quick Start */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Quick Start</h2>
        <p className="text-text-secondary text-sm mb-4">
          Import and call. No providers, wrappers, or configuration needed.
        </p>

        <CodeBlock
          code={`import { Tiktik } from 'tiktiktoast'

// Type shortcuts
Tiktik.success('Changes saved!')
Tiktik.error('Something went wrong.')
Tiktik.warning('Disk space running low.')
Tiktik.info('New update available.')`}
          language="typescript"
          title="app.ts"
        />
      </section>

      {/* Full Options */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Full Options</h2>
        <p className="text-text-secondary text-sm mb-4">
          Use <code className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">showToast()</code> for
          full control over every parameter:
        </p>

        <CodeBlock
          code={`Tiktik.showToast({
  message: 'Hello world',
  type: 'success',        // 'success' | 'error' | 'info' | 'warning'
  duration: 3000,          // ms, default 3000. Use Infinity for persistent
  position: 'top',         // 'top' | 'bottom'
  icon: '<svg>...</svg>',  // custom SVG string or SVGElement
  progress: true,          // show countdown progress bar
  id: 'unique-key',        // dedup key — same id updates in place
  onClick: () => {},       // click callback
  onDismiss: () => {},     // called after exit animation completes
})`}
          language="typescript"
          title="options.ts"
        />
      </section>

      {/* Promise API */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Promise API</h2>
        <p className="text-text-secondary text-sm mb-4">
          Track async operations with automatic loading → success/error transitions:
        </p>

        <CodeBlock
          code={`Tiktik.promise(fetch('/api/save'), {
  loading: 'Saving...',
  success: (data) => \`Saved! \${data.name}\`,
  error: (err) => \`Failed: \${err.message}\`,
  duration: 3000,
})`}
          language="typescript"
          title="promise.ts"
        />
      </section>

      {/* Global Configuration */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-text-primary mb-4">Global Configuration</h2>
        <p className="text-text-secondary text-sm mb-4">
          Set defaults once at the top of your app. SSR-safe — no DOM access at import time.
        </p>

        <CodeBlock
          code={`Tiktik.configure({
  type: 'info',         // default toast type
  duration: 5000,       // default duration
  position: 'bottom',   // default position
  progress: true,       // show progress bar by default
})`}
          language="typescript"
          title="config.ts"
        />
      </section>

      {/* CSS Customization */}
      <section>
        <h2 className="text-xl font-semibold text-text-primary mb-4">CSS Customization</h2>
        <p className="text-text-secondary text-sm mb-4">
          Override CSS custom properties on <code className="text-primary text-xs bg-primary/10 px-1.5 py-0.5 rounded">:root</code> to
          match your brand:
        </p>

        <CodeBlock
          code={`:root {
  --tiktik-bg: #1a1a2e;
  --tiktik-text: #ffffff;
  --tiktik-radius-pill: 9999px;
  --tiktik-radius-card: 24px;
  --tiktik-shadow: 0 4px 16px rgba(0,0,0,0.3);
  --tiktik-z-index: 999999;
  --tiktik-font-size: 14px;
  --tiktik-duration: 320ms;
}`}
          language="css"
          title="styles.css"
        />
      </section>

      {/* Tip */}
      <div className="mt-10 p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-sm text-text-secondary">
          <span className="text-primary font-semibold">💡 Tip:</span>{' '}
          Check out the{' '}
          <a href="/docs/components/toast" className="text-primary hover:underline">
            Toast Component
          </a>{' '}
          page for live interactive demos you can try right here in the browser.
        </p>
      </div>
    </div>
  );
}
