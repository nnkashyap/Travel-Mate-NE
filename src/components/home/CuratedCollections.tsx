import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CURATED_COLLECTIONS } from '../../data/states';
import { DESTINATIONS } from '../../data/destinations';
import { useTravel } from '../../context/TravelContext';
import { EditorialImage } from '../shared/EditorialImage';

export const CuratedCollections: React.FC = () => {
  const { navigateToExploreWith } = useTravel();

  return (
    <section
      aria-labelledby="curated-collections-heading"
      className="mx-auto max-w-[1280px] px-6 py-20 md:px-12 md:py-28"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="font-mono-data text-xs text-[#5C5B56]">
            02. Curated Journeys
          </p>
          <h2
            id="curated-collections-heading"
            className="mt-2 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
          >
            Routes shaped for{' '}
            <em className="italic font-normal text-[#1E3F31]">unhurried</em>{' '}
            travelers
          </h2>
        </div>
        <button
          type="button"
          onClick={() => navigateToExploreWith({})}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3F31] hover:underline whitespace-nowrap self-start md:self-auto"
        >
          <span>View all {DESTINATIONS.length} destinations</span>
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CURATED_COLLECTIONS.map((col) => (
          <button
            key={col.id}
            type="button"
            onClick={() => navigateToExploreWith(col.filterPreset)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] text-left transition-colors duration-200 hover:border-[#1E3F31]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden">
              <EditorialImage
                src={col.imageUrl}
                alt={col.title}
                fallbackLabel={col.kicker}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <p className="font-mono-data text-[11px] text-[#5C5B56]">
                  {col.kicker} · {col.budgetHint}
                </p>
                <h3 className="mt-2 font-editorial text-2xl font-medium leading-snug text-[#161614] group-hover:text-[#1E3F31]">
                  {col.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5C5B56]">
                  {col.description}
                </p>
              </div>

              <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F31]">
                <span>Open collection</span>
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  strokeWidth={1.6}
                />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
