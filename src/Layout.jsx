import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Leaf, Home, Search, Heart, Calculator, GitCompare, Recycle, Settings, ChevronLeft } from 'lucide-react';

const TOP_NAV = [
  { name: 'Home', page: 'Home', icon: Home },
  { name: 'Browse', page: 'Browse', icon: Search },
  { name: 'Compare', page: 'Compare', icon: GitCompare },
  { name: 'Calculator', page: 'Calculator', icon: Calculator },
  { name: 'Swap', page: 'Swap', icon: Recycle },
  { name: 'Favorites', page: 'Favorites', icon: Heart },
];

const BOTTOM_NAV = [
  { name: 'Home', page: 'Home', icon: Home },
  { name: 'Browse', page: 'Browse', icon: Search },
  { name: 'Swap', page: 'Swap', icon: Recycle },
  { name: 'Calculator', page: 'Calculator', icon: Calculator },
];

const SUB_PAGES = ['Browse', 'Compare', 'Calculator', 'Swap', 'Favorites', 'Settings'];

// Page order for slide direction detection
const PAGE_ORDER = ['Home', 'Browse', 'Compare', 'Calculator', 'Swap', 'Favorites', 'Settings'];

const variants = {
  enterFromRight: { x: '100%', opacity: 0 },
  enterFromLeft:  { x: '-30%', opacity: 0 },
  center:         { x: 0,      opacity: 1 },
  exitToLeft:     { x: '-30%', opacity: 0 },
  exitToRight:    { x: '100%', opacity: 0 },
};

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isSubPage = SUB_PAGES.includes(currentPageName);

  // Track previous page to determine slide direction
  const prevPageRef = useRef(currentPageName);
  const directionRef = useRef(1); // 1 = forward (right-to-left), -1 = backward

  useEffect(() => {
    const prev = prevPageRef.current;
    if (prev !== currentPageName) {
      const prevIdx = PAGE_ORDER.indexOf(prev);
      const curIdx = PAGE_ORDER.indexOf(currentPageName);
      directionRef.current = curIdx >= prevIdx ? 1 : -1;
      prevPageRef.current = currentPageName;
    }
  }, [currentPageName]);

  // Per-tab last visited path memory
  const tabPathsRef = useRef({});
  useEffect(() => {
    BOTTOM_NAV.forEach(({ page }) => {
      if (currentPageName === page || location.pathname.startsWith(createPageUrl(page).split('?')[0])) {
        tabPathsRef.current[page] = location.pathname + location.search;
      }
    });
  }, [location, currentPageName]);

  // Sync with system dark mode preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (e) => document.documentElement.classList.toggle('dark', e.matches);
    apply(mq);
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const handleTabPress = (page) => {
    const rootUrl = createPageUrl(page);
    if (currentPageName === page) {
      // Already on this tab — reset to root
      navigate(rootUrl, { replace: true });
    } else {
      // Navigate to last path for this tab, or root
      const remembered = tabPathsRef.current[page];
      navigate(remembered || rootUrl);
    }
  };

  const direction = directionRef.current;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        body { background: #FAFAF8; overscroll-behavior: none; }
        button, a, [role="button"] { user-select: none; -webkit-user-select: none; }
      `}</style>

      {/* Header */}
      <header
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Left: back button (mobile sub-pages) + logo */}
          <div className="flex items-center gap-1">
            {isSubPage && (
              <button
                onClick={() => navigate(-1)}
                className="sm:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <Link to={createPageUrl('Home')} className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#1B4332] rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-[#B7C4A1]" />
              </div>
              <span className="text-lg font-bold text-gray-900 tracking-tight">EcoSwap</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {TOP_NAV.map(({ name, page, icon: Icon }) => {
              const isActive = currentPageName === page;
              return (
                <Link
                  key={page}
                  to={createPageUrl(page)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'bg-[#1B4332] text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {name}
                </Link>
              );
            })}
          </nav>

          {/* Settings icon */}
          <Link
            to={createPageUrl('Settings')}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              currentPageName === 'Settings' ? 'bg-[#1B4332] text-white' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main with page slide transitions */}
      <main className="overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPageName}
            initial={direction >= 0 ? variants.enterFromRight : variants.enterFromLeft}
            animate={variants.center}
            exit={direction >= 0 ? variants.exitToLeft : variants.exitToRight}
            transition={{ type: 'tween', ease: [0.32, 0.72, 0, 1], duration: 0.28 }}
          >
            {children}
            {/* Mobile spacer for bottom nav */}
            <div className="sm:hidden" style={{ height: 'calc(4rem + env(safe-area-inset-bottom))' }} aria-hidden="true" />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Desktop footer */}
      <footer className="hidden sm:block border-t border-gray-100 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Leaf className="w-4 h-4" />
            <span className="text-sm">EcoSwap — Find sustainable alternatives</span>
          </div>
          <p className="text-xs text-gray-400">Making the planet greener, one swap at a time.</p>
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch">
          {BOTTOM_NAV.map(({ name, page, icon: Icon }) => {
            const isActive = currentPageName === page;
            return (
              <button
                key={page}
                onClick={() => handleTabPress(page)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                  isActive ? 'text-[#1B4332]' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-semibold">{name}</span>
                {isActive && <div className="w-1 h-1 rounded-full bg-[#1B4332]" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}