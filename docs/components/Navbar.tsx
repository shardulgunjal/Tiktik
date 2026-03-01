import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { navigation } from '../lib/navigation';

interface NavbarProps {
  showSidebarToggle?: boolean;
}

export function Navbar({ showSidebarToggle }: NavbarProps) {
  const location = useLocation();
  const isDocs = location.pathname.startsWith('/docs');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="sticky top-0 z-50">
      <nav className="relative backdrop-blur-xl bg-surface/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between relative">
          <div className="flex items-center gap-4 relative z-20">
            <Link 
              to="/" 
              className="flex items-center gap-2 group shrink-0 transition-all"
            >
              <motion.img
                src="/logo.svg"
                alt="tiktiktoast logo"
                className="w-8 h-8 drop-shadow-md shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
              <span className="text-lg font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors">
                TikTiktoast
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0 z-20">
            {isDocs ? (
              <Link to="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                Home
              </Link>
            ) : (
              <Link to="/docs" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                Docs
              </Link>
            )}
            
            <a
              href="https://www.npmjs.com/package/tiktiktoast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              npm ↗
            </a>
            
            <ThemeToggle />
          </div>
        </div>

        {/* Swipe Handle Toggle */}
        {showSidebarToggle && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden absolute bottom-0 left-6 translate-y-full 
                     px-4 py-1.5 bg-surface/80 backdrop-blur-xl
                     border-b border-l border-r border-border
                     rounded-b-2xl rounded-t-none
                     hover:bg-surface-raised transition-colors text-text-secondary 
                     cursor-pointer focus:outline-none z-30 shadow-sm"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="w-4 h-4 ml-0.5"
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </motion.svg>
          </button>
        )}
      </nav>

      {/* Dynamic Island Style Mobile Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && showSidebarToggle && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute top-full mt-4 left-4 right-4 z-40 lg:hidden overflow-hidden rounded-2xl border border-border bg-surface/95 backdrop-blur-2xl shadow-2xl shadow-black/50"
          >
            <div className="max-h-[70vh] overflow-y-auto p-4 flex flex-col gap-6 overscroll-contain">
              {navigation.map((group) => (
                <div key={group.title}>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3 px-3">
                    {group.title}
                  </h4>
                  <ul className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`block px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-primary/10 text-primary font-medium shadow-sm'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-raised active:scale-95'
                            }`}
                          >
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
