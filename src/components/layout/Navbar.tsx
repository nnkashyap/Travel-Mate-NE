import React, { useState } from 'react';
import { Bookmark, Menu, X } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';

const NAV_ITEMS = [
  { label: 'Explore', path: '/explore' },
  { label: 'Trip Planner', path: '/planner' },
  { label: 'Transit Guide', path: '/transit' },
  { label: 'Permits', path: '/permits' },
  { label: 'Culture', path: '/culture' },
];

export const Navbar: React.FC = () => {
  const { pathname, navigate, savedPlaceIds, savedItineraries, setDrawerOpen } =
    useTravel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalSaved = savedPlaceIds.length + savedItineraries.length;

  const isActive = (path: string) =>
    pathname === path || (path === '/explore' && pathname.startsWith('/destination/'));

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="no-print sticky top-0 z-40 border-b border-[#E6E3DC] bg-[#FAF9F6]/88 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-8 px-6 md:px-12">
        {/* Zone 1: Single-element brand wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-editorial text-2xl font-medium tracking-tight text-[#161614] whitespace-nowrap shrink-0"
        >
          TravelMateNE
        </a>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5B56]"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleLinkClick(e, item.path)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 ${
                  active
                    ? 'text-[#161614] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[1.5px] after:bg-[#1E3F31]'
                    : 'hover:text-[#161614]'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label={`Open saved places and itineraries (${totalSaved})`}
            className="inline-flex items-center gap-2 rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] px-4 py-2 text-xs font-semibold text-[#161614] transition-colors duration-150 hover:border-[#1E3F31] hover:text-[#1E3F31] whitespace-nowrap shrink-0"
          >
            <Bookmark className="h-3.5 w-3.5" strokeWidth={1.6} />
            <span>
              Saved{' '}
              <span className="font-mono-data text-[#1E3F31]">({totalSaved})</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] md:hidden"
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-[#E6E3DC] bg-[#FAF9F6] px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleLinkClick(e, item.path)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#DCE6E0]/60 text-[#1E3F31]'
                      : 'text-[#5C5B56] hover:bg-[#F2EFE9] hover:text-[#161614]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};
