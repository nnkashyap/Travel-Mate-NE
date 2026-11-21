import React from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { STATES } from '../../data/states';
import { DestinationCategory, StateId } from '../../types/travel';
import {
  BudgetTierFilter,
  DEFAULT_EXPLORE_FILTERS,
  ExploreFilters,
  PermitFilter,
  SortOption,
} from '../../utils/filters';

interface FilterBarProps {
  filters: ExploreFilters;
  onChange: (next: ExploreFilters) => void;
  resultCount: number;
}

const CATEGORIES: { id: DestinationCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Vibes' },
  { id: 'Heritage', label: 'Living Heritage' },
  { id: 'Highlands', label: 'Misty Highlands' },
  { id: 'Wildlife', label: 'Wildlife & Rivers' },
  { id: 'Offbeat', label: 'Offbeat Gems' },
  { id: 'Trekking', label: 'Trekking & Valleys' },
];

const PERMIT_OPTIONS: { id: PermitFilter; label: string }[] = [
  { id: 'all', label: 'All Permits' },
  { id: 'none', label: 'No Permit Needed' },
  { id: 'required', label: 'ILP / PAP Required' },
];

const BUDGET_OPTIONS: { id: BudgetTierFilter; label: string }[] = [
  { id: 'all', label: 'Any Budget' },
  { id: 'budget', label: '₹ Budget (<₹1,500)' },
  { id: 'mid', label: '₹₹ Mid (₹1.5k–3.5k)' },
  { id: 'comfort', label: '₹₹₹ Comfort (₹3.5k+)' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  resultCount,
}) => {
  const hasActiveFilters =
    filters.state !== 'all' ||
    filters.category !== 'all' ||
    filters.permit !== 'all' ||
    filters.budgetTier !== 'all' ||
    filters.hiddenGemOnly ||
    filters.searchQuery.trim() !== '';

  const update = (patch: Partial<ExploreFilters>) =>
    onChange({ ...filters, ...patch });

  return (
    <div className="space-y-4 rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-4 md:p-6">
      {/* Row 1: State Filter Strip (horizontal scroll on mobile) */}
      <div
        role="group"
        aria-label="Filter by state"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
      >
        <button
          type="button"
          onClick={() => update({ state: 'all' })}
          aria-pressed={filters.state === 'all'}
          className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
            filters.state === 'all'
              ? 'bg-[#1E3F31] text-[#FAF9F6]'
              : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
          }`}
        >
          All 8 States
        </button>
        {STATES.map((state) => {
          const active = filters.state === state.id;
          return (
            <button
              key={state.id}
              type="button"
              onClick={() => update({ state: state.id as StateId })}
              aria-pressed={active}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#1E3F31] text-[#FAF9F6]'
                  : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
              }`}
            >
              {state.name}
            </button>
          );
        })}
      </div>

      {/* Row 2: Category, Permit, Budget & Search */}
      <div className="grid grid-cols-1 gap-3 border-t border-[#E6E3DC] pt-4 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
        {/* Search */}
        <div className="relative lg:col-span-3">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#706E67]"
            strokeWidth={1.5}
          />
          <input
            type="search"
            aria-label="Search destinations"
            placeholder="Search valley, tribe, or hub..."
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            className="h-10 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] pr-3 pl-9 text-xs text-[#161614] placeholder:text-[#706E67] focus:border-[#1E3F31]"
          />
        </div>

        {/* Category */}
        <div className="lg:col-span-3">
          <select
            aria-label="Filter by travel vibe"
            value={filters.category}
            onChange={(e) =>
              update({
                category: e.target.value as DestinationCategory | 'all',
              })
            }
            className="h-10 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3 text-xs font-medium text-[#161614]"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Permit Filter */}
        <div className="lg:col-span-2">
          <select
            aria-label="Filter by permit requirement"
            value={filters.permit}
            onChange={(e) =>
              update({ permit: e.target.value as PermitFilter })
            }
            className="h-10 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3 text-xs font-medium text-[#161614]"
          >
            {PERMIT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Tier */}
        <div className="lg:col-span-2">
          <select
            aria-label="Filter by daily budget tier"
            value={filters.budgetTier}
            onChange={(e) =>
              update({ budgetTier: e.target.value as BudgetTierFilter })
            }
            className="h-10 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3 text-xs font-medium text-[#161614]"
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="lg:col-span-2">
          <select
            aria-label="Sort destinations"
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as SortOption })}
            className="h-10 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3 text-xs font-medium text-[#161614]"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="lowest-cost">Sort: Lowest Daily Cost</option>
            <option value="shortest-hub-time">Sort: Shortest Hub Time</option>
          </select>
        </div>
      </div>

      {/* Row 3: Hidden Gem Toggle + Active Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E6E3DC] pt-4">
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            role="switch"
            aria-checked={filters.hiddenGemOnly}
            onClick={() => update({ hiddenGemOnly: !filters.hiddenGemOnly })}
            className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
              filters.hiddenGemOnly
                ? 'border-[#C25E3A] bg-[#C25E3A] text-[#FAF9F6]'
                : 'border-[#E6E3DC] bg-[#FAF9F6] text-[#161614] hover:border-[#1E3F31]'
            }`}
          >
            <span>Hidden Gems Only</span>
            <span className="font-mono-data text-[11px] opacity-85">
              {filters.hiddenGemOnly ? 'ON' : 'OFF'}
            </span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_EXPLORE_FILTERS)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5C5B56] hover:text-[#161614]"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span>Reset filters</span>
            </button>
          )}
        </div>

        <p className="font-mono-data text-xs text-[#5C5B56]">
          Showing {resultCount}{' '}
          {resultCount === 1 ? 'destination' : 'destinations'}
        </p>
      </div>
    </div>
  );
};
