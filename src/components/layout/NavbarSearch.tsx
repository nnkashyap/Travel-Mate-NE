import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Compass,
  MapPin,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { DESTINATIONS } from '../../data/destinations';
import { useTravel } from '../../context/TravelContext';
import { searchDestinations, SearchMatchReason } from '../../utils/search';

const QUICK_ACTIVITIES = [
  'Trekking',
  'Wildlife',
  'Heritage',
  'Highlands',
  'Offbeat',
];

const QUICK_REGIONS = [
  'Meghalaya',
  'Arunachal Pradesh',
  'Sikkim',
  'Nagaland',
  'Assam',
];

interface NavbarSearchProps {
  variant?: 'desktop' | 'mobile';
  autoFocus?: boolean;
  onAfterSelect?: () => void;
}

const REASON_STYLES: Record<SearchMatchReason, string> = {
  Name: 'bg-[#DCE6E0]/75 text-[#1E3F31]',
  Region: 'bg-[#F2EFE9] text-[#5C5B56]',
  Activity: 'bg-[#C25E3A]/12 text-[#C25E3A]',
};

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  variant = 'desktop',
  autoFocus = false,
  onAfterSelect,
}) => {
  const { navigate, navigateToExploreWith } = useTravel();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allMatches = useMemo(
    () => searchDestinations(DESTINATIONS, query, 0),
    [query]
  );

  const visibleMatches = useMemo(() => allMatches.slice(0, 6), [allMatches]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      setIsOpen(true);
    }
  }, [autoFocus]);

  // Reset highlighted index when query changes
  useEffect(() => {
    setActiveIndex(visibleMatches.length > 0 ? 0 : -1);
  }, [query, visibleMatches.length]);

  // Close on click outside
  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Global "/" shortcut on desktop to focus navbar search
  useEffect(() => {
    if (variant !== 'desktop') return;
    const handleGlobalKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable
      ) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
      setIsOpen(true);
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [variant]);

  const handleSelectDestination = (slug: string) => {
    setIsOpen(false);
    setQuery('');
    inputRef.current?.blur();
    onAfterSelect?.();
    navigate(`/destination/${slug}`);
  };

  const handleViewAllInExplore = () => {
    const trimmed = query.trim();
    setIsOpen(false);
    inputRef.current?.blur();
    onAfterSelect?.();
    navigateToExploreWith({ searchQuery: trimmed });
  };

  const handleQuickPrompt = (term: string) => {
    setQuery(term);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setIsOpen(true);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (visibleMatches.length === 0) return;
      setActiveIndex((prev) =>
        prev < visibleMatches.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (visibleMatches.length === 0) return;
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : visibleMatches.length - 1
      );
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (activeIndex >= 0 && visibleMatches[activeIndex]) {
        handleSelectDestination(visibleMatches[activeIndex].destination.slug);
      } else if (visibleMatches.length > 0) {
        handleSelectDestination(visibleMatches[0].destination.slug);
      } else if (query.trim()) {
        handleViewAllInExplore();
      }
    }
  };

  const listboxId =
    variant === 'desktop'
      ? 'navbar-search-listbox-desktop'
      : 'navbar-search-listbox-mobile';

  const hasQuery = query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative ${
        variant === 'desktop' ? 'w-56 xl:w-68 transition-all duration-200 focus-within:w-64 xl:focus-within:w-76' : 'w-full'
      }`}
    >
      <div className="relative flex items-center">
        <Search
          className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-[#8E8C84]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-label="Search destinations by name, region, or activity"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeIndex >= 0 && visibleMatches[activeIndex]
              ? `${listboxId}-option-${visibleMatches[activeIndex].destination.id}`
              : undefined
          }
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search places, regions, activities..."
          data-testid={`navbar-search-input-${variant}`}
          className="h-9 w-full rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] pl-9 pr-9 text-xs font-medium text-[#161614] placeholder:text-[#8E8C84] transition-colors duration-150 hover:border-[#CFCAC0] focus:border-[#1E3F31] focus:outline-none focus:ring-2 focus:ring-[#1E3F31]/12 [&::-webkit-search-cancel-button]:hidden"
        />

        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search query"
            className="absolute right-2 inline-flex h-5 w-5 items-center justify-center rounded-md text-[#8E8C84] transition-colors hover:bg-[#F2EFE9] hover:text-[#161614]"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        ) : (
          variant === 'desktop' && (
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-2.5 hidden rounded border border-[#E6E3DC] bg-[#FAF9F6] px-1.5 py-0.5 font-mono-data text-[10px] font-medium text-[#8E8C84] xl:inline-block"
            >
              /
            </kbd>
          )
        )}
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Destination search results"
          data-testid={`navbar-search-dropdown-${variant}`}
          className={`${
            variant === 'desktop'
              ? 'absolute right-0 top-[calc(100%+10px)] w-[420px] max-w-[calc(100vw-2rem)]'
              : 'mt-2 w-full'
          } z-50 overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] shadow-[0_18px_48px_rgba(20,28,24,0.12)]`}
        >
          {!hasQuery ? (
            <div className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono-data text-[10px] font-medium uppercase tracking-wider text-[#8E8C84]">
                  Search by Activity
                </span>
                <span className="font-mono-data text-[10px] text-[#8E8C84]">
                  {DESTINATIONS.length} places
                </span>
              </div>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {QUICK_ACTIVITIES.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleQuickPrompt(activity)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E6E3DC] bg-[#FAF9F6] px-2.5 py-1.5 text-xs font-medium text-[#161614] transition-colors hover:border-[#1E3F31] hover:bg-[#DCE6E0]/45 hover:text-[#1E3F31]"
                  >
                    <Compass className="h-3 w-3 text-[#C25E3A]" strokeWidth={1.6} />
                    {activity}
                  </button>
                ))}
              </div>

              <div className="mb-2.5 font-mono-data text-[10px] font-medium uppercase tracking-wider text-[#8E8C84]">
                Search by Region
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => handleQuickPrompt(region)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E6E3DC] bg-[#FFFFFF] px-2.5 py-1.5 text-xs font-medium text-[#5C5B56] transition-colors hover:border-[#1E3F31] hover:text-[#161614]"
                  >
                    <MapPin className="h-3 w-3 text-[#1E3F31]" strokeWidth={1.6} />
                    {region}
                  </button>
                ))}
              </div>
            </div>
          ) : visibleMatches.length > 0 ? (
            <>
              <div className="flex items-center justify-between border-b border-[#E6E3DC] bg-[#FAF9F6] px-4 py-2.5">
                <span className="font-mono-data text-[10px] font-medium uppercase tracking-wider text-[#5C5B56]">
                  {allMatches.length}{' '}
                  {allMatches.length === 1 ? 'destination' : 'destinations'} found
                </span>
                <button
                  type="button"
                  onClick={handleViewAllInExplore}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3F31] transition-colors hover:text-[#C25E3A]"
                >
                  <span>View all in Explore</span>
                  <ArrowRight className="h-3 w-3" strokeWidth={1.8} />
                </button>
              </div>

              <div className="max-h-[380px] divide-y divide-[#E6E3DC]/70 overflow-y-auto">
                {visibleMatches.map((match, index) => {
                  const { destination, reason, matchedLabel } = match;
                  const isHighlighted = index === activeIndex;
                  const permitLabel =
                    destination.permitType === 'None'
                      ? 'Open'
                      : destination.permitType;

                  return (
                    <button
                      key={destination.id}
                      id={`${listboxId}-option-${destination.id}`}
                      type="button"
                      role="option"
                      aria-selected={isHighlighted}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelectDestination(destination.slug)}
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                        isHighlighted
                          ? 'bg-[#F2EFE9]/90'
                          : 'bg-[#FFFFFF] hover:bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#E6E3DC] bg-[#F2EFE9]">
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className={`h-full w-full object-cover ${
                            destination.imageFocus || 'object-center'
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold text-[#161614]">
                            {destination.name}
                          </span>
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono-data text-[9px] font-semibold uppercase tracking-wide ${REASON_STYLES[reason]}`}
                          >
                            {reason}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-xs text-[#5C5B56]">
                          {destination.stateName} · {destination.regionLabel}
                        </p>

                        <p className="mt-0.5 truncate text-[11px] text-[#8E8C84]">
                          {reason === 'Activity' &&
                          !destination.categories.includes(
                            matchedLabel as (typeof destination.categories)[number]
                          )
                            ? matchedLabel
                            : destination.categories.join(' · ')}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-mono-data text-[11px] font-semibold text-[#161614]">
                          ₹{destination.dailyBudgetINR.backpacker.toLocaleString('en-IN')}/d
                        </div>
                        <div
                          className={`mt-1 font-mono-data text-[10px] font-medium ${
                            destination.permitType === 'None'
                              ? 'text-[#2D6A4F]'
                              : 'text-[#B45309]'
                          }`}
                        >
                          {permitLabel}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="hidden items-center justify-between border-t border-[#E6E3DC] bg-[#FAF9F6] px-4 py-2 text-[11px] text-[#8E8C84] sm:flex">
                <span className="font-mono-data text-[10px]">
                  ↑↓ Navigate · ↵ Open · Esc Close
                </span>
                <span className="font-mono-data text-[10px]">
                  Showing {visibleMatches.length} of {allMatches.length}
                </span>
              </div>
            </>
          ) : (
            <div className="px-5 py-7 text-center">
              <Sparkles
                className="mx-auto mb-2 h-5 w-5 text-[#8E8C84]"
                strokeWidth={1.5}
              />
              <p className="text-sm font-semibold text-[#161614]">
                No destinations match “{query.trim()}”
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#5C5B56]">
                Try a place name (Tawang, Dzükou), a state or valley, or an
                activity like Trekking, Wildlife, or Heritage.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Trekking')}
                  className="rounded-lg border border-[#E6E3DC] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#161614] transition-colors hover:border-[#1E3F31]"
                >
                  Try “Trekking”
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickPrompt('Meghalaya')}
                  className="rounded-lg border border-[#E6E3DC] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#161614] transition-colors hover:border-[#1E3F31]"
                >
                  Try “Meghalaya”
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setIsOpen(false);
                    onAfterSelect?.();
                    navigateToExploreWith({});
                  }}
                  className="rounded-lg bg-[#1E3F31] px-3 py-1.5 text-xs font-medium text-[#FAF9F6] transition-colors hover:bg-[#152E24]"
                >
                  Browse all {DESTINATIONS.length}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
