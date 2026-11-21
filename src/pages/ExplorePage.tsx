import React, { useMemo } from 'react';
import { DESTINATIONS } from '../data/destinations';
import { useTravel } from '../context/TravelContext';
import {
  DEFAULT_EXPLORE_FILTERS,
  filterAndSortDestinations,
} from '../utils/filters';
import { FilterBar } from '../components/explore/FilterBar';
import { DestinationCard } from '../components/explore/DestinationCard';

export const ExplorePage: React.FC = () => {
  const { exploreFilters, setExploreFilters } = useTravel();

  const filtered = useMemo(
    () => filterAndSortDestinations(DESTINATIONS, exploreFilters),
    [exploreFilters]
  );

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
      <div className="max-w-2xl">
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Regional Directory · Eight Sisters
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl">
          Explore the{' '}
          <em className="italic font-normal text-[#1E3F31]">unhurried</em>{' '}
          Northeast
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5B56] sm:text-base">
          Filter seventeen field-researched river islands, canyon villages, and
          high Himalayan passes across all eight states by budget, shared-transit
          distance, and permit access.
        </p>
      </div>

      <div className="mt-8">
        <FilterBar
          filters={exploreFilters}
          onChange={setExploreFilters}
          resultCount={filtered.length}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] px-6 py-14 text-center">
          <h2 className="font-editorial text-2xl font-medium text-[#161614]">
            No destinations match that exact combination
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5C5B56]">
            Try loosening your budget tier, switching permit filter to All
            Permits, or clearing the Hidden Gems switch.
          </p>
          <button
            type="button"
            onClick={() => setExploreFilters(DEFAULT_EXPLORE_FILTERS)}
            className="mt-6 rounded-xl bg-[#1E3F31] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24]"
          >
            Show All Destinations
          </button>
        </div>
      ) : (
        <div
          data-testid="destination-grid"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      )}
    </div>
  );
};
