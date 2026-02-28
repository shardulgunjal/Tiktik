import { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';

const navigation = [
  {
    title: 'Getting Started',
    items: [
      { name: 'Installation', path: '/docs' },
      { name: 'Quick Start', path: '/docs/getting-started' },
    ],
  },
  {
    title: 'Components',
    items: [
      { name: 'Toast', path: '/docs/components/toast' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { name: 'API Reference', path: '/docs/api' },
    ],
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-64
          bg-surface border-r border-border overflow-y-auto
          transition-transform duration-300 ease-out
          lg:translate-x-0 lg:sticky lg:z-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-6">
          {navigation.map((group) => (
            <div key={group.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-2 px-3">
                {group.title}
              </h4>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      end
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised'
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-raised transition-colors text-text-secondary cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link to="/" className="text-lg font-bold text-text-primary tracking-tight">
              TikTiktoast<span className="text-primary">.</span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Home
            </Link>
            <a
              href="https://www.npmjs.com/package/tiktiktoast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              npm ↗
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-6 py-10 lg:px-12 lg:py-12 max-w-4xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
