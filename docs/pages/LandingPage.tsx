import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Tiktik } from 'tiktiktoast';

function FloatingToast({ delay, x, y, rotation, type, message }: {
  delay: number; x: number; y: number; rotation: number;
  type: 'success' | 'error' | 'warning' | 'info'; message: string;
}) {
  const colors = {
    success: { accent: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
    error: { accent: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
    warning: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
    info: { accent: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  };
  const c = colors[type];
  const icons = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  return (
    <motion.div
      className="absolute pointer-events-none select-none"
      style={{ left: `${50 + x}%`, top: `${50 + y}%` }}
      initial={{ opacity: 0, scale: 0.8, rotateX: 20, rotateY: rotation }}
      animate={{
        opacity: [0, 1, 1, 0],
        scale: [0.8, 1, 1, 0.9],
        y: [20, 0, -5, -10],
        rotateX: [20, 0, -2, 0],
        rotateY: [rotation, rotation * 0.5, rotation * 0.3, rotation],
      }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: 'easeInOut',
      }}
    >
      <div
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl shadow-2xl"
        style={{
          background: c.bg,
          border: `1px solid ${c.border}`,
          boxShadow: `0 8px 32px ${c.border}, 0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
        <span className="text-sm" style={{ color: c.accent }}>{icons[type]}</span>
        <span className="text-sm font-medium text-white/80 whitespace-nowrap">{message}</span>
      </div>
    </motion.div>
  );
}

function InstallSnippet() {
  const [copied, setCopied] = useState(false);
  const command = 'npm install tiktiktoast';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    Tiktik.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-3 px-5 py-3 rounded-xl
                 bg-surface-raised border border-border
                 hover:border-border-hover transition-all duration-200 cursor-pointer"
    >
      <span className="text-text-muted font-mono text-sm">$</span>
      <span className="font-mono text-sm text-text-primary">{command}</span>
      <span className="text-xs text-text-muted group-hover:text-text-secondary transition-colors ml-2">
        {copied ? '✓' : '⌘C'}
      </span>
    </button>
  );
}

const features = [
  { icon: '🎯', title: 'Zero Dependencies', desc: 'Pure vanilla JS + TypeScript + WAAPI. Nothing extra.' },
  { icon: '🏝️', title: 'Dynamic Island Style', desc: 'Pill-to-card morphing transitions with spring physics.' },
  { icon: '♿', title: 'Accessible', desc: 'ARIA roles, keyboard nav, screen reader support built in.' },
  { icon: '🔄', title: 'Promise Tracking', desc: 'Loading → Success/Error transitions with one API call.' },
  { icon: '📱', title: 'SSR Safe', desc: 'Works in Next.js, Nuxt, and any SSR framework.' },
  { icon: '🎨', title: 'Customizable', desc: 'CSS variables, custom icons, renderers, and more.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-text-primary tracking-tight">
            TikTiktoast<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/docs" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Docs
            </Link>
            <Link to="/docs/components/toast" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Components
            </Link>
            <Link to="/docs/api" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              API
            </Link>
            <a
              href="https://www.npmjs.com/package/tiktiktoast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              npm
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-info/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full
                         bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              v0.1.2 — Now on npm
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Beautiful toasts,
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-light to-info bg-clip-text text-transparent">
                zero effort.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Dynamic Island–style notifications for the web.
              Zero dependencies, SSR-safe, accessible, and under 6KB gzipped.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link
                to="/docs"
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-dark
                           text-white font-medium text-sm transition-all duration-200
                           shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                Get Started →
              </Link>
              <Link
                to="/docs/components/toast"
                className="px-6 py-3 rounded-xl bg-surface-raised border border-border
                           hover:border-border-hover text-text-primary font-medium text-sm
                           transition-all duration-200"
              >
                View Components
              </Link>
            </motion.div>

            {/* Install Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center"
            >
              <InstallSnippet />
            </motion.div>
          </div>

          {/* Floating Toast Animations */}
          <div className="relative h-48 mt-12 hidden md:block" style={{ perspective: '1000px' }}>
            <FloatingToast delay={0} x={-30} y={-20} rotation={-8} type="success" message="Changes saved!" />
            <FloatingToast delay={1.5} x={20} y={10} rotation={6} type="error" message="Upload failed" />
            <FloatingToast delay={3} x={-10} y={20} rotation={-4} type="info" message="New update" />
            <FloatingToast delay={4.5} x={25} y={-15} rotation={10} type="warning" message="Session expiring" />
          </div>
        </div>
      </section>

      {/* Video Demo Placeholder */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-surface-raised overflow-hidden"
        >
          <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-surface-raised to-surface-overlay">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-text-secondary text-sm font-medium">Insert demo video here</p>
              <p className="text-text-muted text-xs mt-1">Showcase your favorite toast interactions</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* NPM Badges */}
      <section className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <img src="https://img.shields.io/npm/v/tiktiktoast?style=flat-square&color=6366f1" alt="npm version" />
          <img src="https://img.shields.io/npm/dm/tiktiktoast?style=flat-square&color=22c55e" alt="npm downloads" />
          <img src="https://img.shields.io/npm/l/tiktiktoast?style=flat-square&color=f59e0b" alt="license" />
          <img src="https://img.shields.io/bundlephobia/minzip/tiktiktoast?style=flat-square&color=3b82f6&label=gzip" alt="bundle size" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-3">Built for developers</h2>
          <p className="text-text-secondary">Everything you need, nothing you don't.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-5 rounded-xl border border-border bg-surface-raised
                         hover:border-border-hover transition-all duration-200 group"
            >
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-text-primary mb-1 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Get started in seconds</h2>
          <div className="rounded-xl border border-border bg-surface-raised overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-error/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
              </div>
              <span className="text-[11px] text-text-muted font-mono ml-2">app.ts</span>
            </div>
            <pre className="p-5 font-mono text-sm leading-loose text-text-secondary overflow-x-auto">
              <code>
                <span className="text-primary">import</span>{' { Tiktik } '}
                <span className="text-primary">from</span>{' '}
                <span className="text-success">'tiktiktoast'</span>{'\n\n'}
                <span className="text-text-muted">// One line. That's it.</span>{'\n'}
                {'Tiktik.'}
                <span className="text-info">success</span>
                {'('}
                <span className="text-success">'Changes saved!'</span>
                {')'}
              </code>
            </pre>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            tiktiktoast v0.1.2 — Zero dependencies, ~6KB gzipped
          </p>
          <div className="flex items-center gap-4">
            <a href="https://www.npmjs.com/package/tiktiktoast" target="_blank" rel="noopener noreferrer"
               className="text-xs text-text-muted hover:text-text-secondary transition-colors">npm</a>
            <span className="text-text-muted/30">·</span>
            <span className="text-xs text-text-muted">MIT License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
