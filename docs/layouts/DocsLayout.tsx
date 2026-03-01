import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { navigation } from '../lib/navigation';

function Sidebar() {
  return (
    <aside className="hidden lg:block sticky top-14 z-0 h-[calc(100vh-3.5rem)] w-64 bg-surface border-r border-border overflow-y-auto">
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
  );
}

export default function DocsLayout() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar showSidebarToggle />

      <div className="max-w-[1400px] mx-auto flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 min-w-0 px-6 py-10 lg:px-12 lg:py-12 max-w-4xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
