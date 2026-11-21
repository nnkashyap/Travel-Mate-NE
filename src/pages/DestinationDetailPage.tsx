import React from 'react';
import {
  ArrowLeft,
  Bookmark,
  CalendarPlus,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { DESTINATIONS, getDestinationBySlug } from '../data/destinations';
import { useTravel } from '../context/TravelContext';
import { formatINR } from '../utils/planner';
import { EditorialImage } from '../components/shared/EditorialImage';
import { TransitDecoderTable } from '../components/destination/TransitDecoderTable';
import { StayAndFoodGrid } from '../components/destination/StayAndFoodGrid';

interface DestinationDetailPageProps {
  slug: string;
}

export const DestinationDetailPage: React.FC<DestinationDetailPageProps> = ({
  slug,
}) => {
  const {
    navigate,
    isPlaceSaved,
    toggleSavedPlace,
    addDestinationToPlanner,
    navigateToPermitsForStates,
    navigateToExploreWith,
  } = useTravel();

  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return (
      <div className="mx-auto max-w-[1280px] px-6 py-20 text-center md:px-12">
        <h1 className="font-editorial text-4xl font-medium text-[#161614]">
          Destination not found
        </h1>
        <p className="mt-3 text-sm text-[#5C5B56]">
          The route you requested could not be located in our regional archive.
        </p>
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="mt-6 rounded-xl bg-[#1E3F31] px-5 py-2.5 text-sm font-semibold text-[#FAF9F6]"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const saved = isPlaceSaved(destination.id);
  const related = DESTINATIONS.filter(
    (d) =>
      d.id !== destination.id &&
      (d.stateId === destination.stateId ||
        d.nearestHub === destination.nearestHub)
  ).slice(0, 3);

  return (
    <article className="mx-auto max-w-[1280px] px-6 py-10 md:px-12 md:py-14">
      {/* Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/explore')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C5B56] transition-colors hover:text-[#161614]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.6} />
          <span>Back to Explorer</span>
        </button>

        <div className="flex items-center gap-2 font-mono-data text-xs text-[#5C5B56]">
          <button
            type="button"
            onClick={() =>
              navigateToExploreWith({ state: destination.stateId })
            }
            className="hover:text-[#1E3F31] hover:underline"
          >
            {destination.stateName}
          </button>
          <span aria-hidden="true">/</span>
          <span>{destination.regionLabel}</span>
        </div>
      </div>

      {/* Editorial Header Split */}
      <div className="mt-6 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-between lg:col-span-6">
          <div>
            <p className="font-mono-data text-xs text-[#5C5B56]">
              {destination.coordinates} ·{' '}
              {destination.elevationMeters.toLocaleString('en-IN')}m Elevation
            </p>
            <h1 className="mt-3 font-editorial text-4xl font-medium leading-[1.08] text-[#161614] sm:text-5xl">
              {destination.name}
            </h1>
            <p className="mt-3 text-base font-medium text-[#1E3F31]">
              {destination.tagline}
            </p>
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-[#5C5B56] sm:text-base">
              {destination.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono-data text-xs text-[#5C5B56]">
              <span>Ideal Duration: {destination.idealDays}–{destination.idealDays + 1} Days</span>
              <span aria-hidden="true">·</span>
              <span>Best Months: {destination.bestMonths.join(', ')}</span>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => addDestinationToPlanner(destination.id, true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-5 py-3 text-sm font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24] whitespace-nowrap"
            >
              <CalendarPlus className="h-4 w-4" strokeWidth={1.5} />
              <span>Add to Trip Planner</span>
            </button>

            <button
              type="button"
              onClick={() => toggleSavedPlace(destination.id)}
              aria-pressed={saved}
              className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                saved
                  ? 'border-[#1E3F31] bg-[#DCE6E0]/60 text-[#1E3F31]'
                  : 'border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] hover:border-[#1E3F31]'
              }`}
            >
              <Bookmark
                className="h-4 w-4"
                strokeWidth={1.5}
                fill={saved ? 'currentColor' : 'none'}
              />
              <span>{saved ? 'Saved Place' : 'Save Place'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#F2EFE9] lg:col-span-6">
          <div className="aspect-[4/3] h-full w-full">
            <EditorialImage
              src={destination.imageUrl}
              alt={`${destination.name} in ${destination.stateName}`}
              fallbackLabel={destination.name}
              loading="eager"
              className={`h-full w-full object-cover ${
                destination.imageFocus ?? 'object-center'
              }`}
            />
          </div>
        </div>
      </div>

      {/* At-a-Glance 4-Column Monospace Metrics Bar */}
      <dl className="mt-10 grid grid-cols-2 divide-y divide-[#E6E3DC] rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
        <div className="p-5">
          <dt className="text-xs text-[#5C5B56]">Daily Budget Range</dt>
          <dd className="mt-1.5 font-mono-data text-base font-medium text-[#161614]">
            {formatINR(destination.dailyBudgetINR.backpacker)} –{' '}
            {formatINR(destination.dailyBudgetINR.comfort)}
          </dd>
        </div>

        <div className="p-5">
          <dt className="text-xs text-[#5C5B56]">Permit Status</dt>
          <dd className="mt-1.5">
            {destination.permitType === 'None' ? (
              <span className="inline-flex items-center gap-1.5 font-mono-data text-sm font-medium text-[#2D6A4F]">
                <CheckCircle2 className="h-4 w-4" strokeWidth={1.6} />
                Permit-Free
              </span>
            ) : (
              <button
                type="button"
                onClick={() =>
                  navigateToPermitsForStates([destination.stateId])
                }
                className="inline-flex items-center gap-1.5 font-mono-data text-sm font-medium text-[#B45309] hover:underline"
              >
                <FileCheck2 className="h-4 w-4" strokeWidth={1.6} />
                {destination.permitType === 'ILP'
                  ? 'ILP-REQ · Guide'
                  : 'PAP-ZONE · Guide'}
              </button>
            )}
          </dd>
        </div>

        <div className="p-5">
          <dt className="text-xs text-[#5C5B56]">Nearest Entry Hub</dt>
          <dd className="mt-1.5 font-mono-data text-sm font-medium text-[#161614]">
            {destination.nearestHub} (~{destination.hubTravelHours}h)
          </dd>
        </div>

        <div className="p-5">
          <dt className="text-xs text-[#5C5B56]">Network Connectivity</dt>
          <dd className="mt-1.5 font-mono-data text-sm font-medium text-[#161614]">
            {destination.connectivity}
          </dd>
        </div>
      </dl>

      {/* Essential Highlights */}
      <section className="mt-10 rounded-2xl border border-[#E6E3DC] bg-[#F2EFE9]/50 p-6 md:p-8">
        <p className="font-mono-data text-xs text-[#5C5B56]">Field Highlights</p>
        <h2 className="mt-1 font-editorial text-3xl font-medium text-[#161614]">
          Unmissable experiences here
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {destination.highlights.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] p-5"
            >
              <span className="font-mono-data text-xs text-[#C25E3A]">
                0{idx + 1}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[#161614]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Local Transit Decoder */}
      <div className="mt-10">
        <TransitDecoderTable destination={destination} />
      </div>

      {/* Stay & Food Grid */}
      <div className="mt-10">
        <StayAndFoodGrid destination={destination} />
      </div>

      {/* Nearby / Same-Corridor Recommendations */}
      {related.length > 0 && (
        <section className="mt-14 border-t border-[#E6E3DC] pt-12">
          <p className="font-mono-data text-xs text-[#5C5B56]">
            Continue Along This Corridor
          </p>
          <h2 className="mt-1 font-editorial text-3xl font-medium text-[#161614]">
            Easy pairings nearby
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {related.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/destination/${item.slug}`)}
                className="group rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-5 text-left transition-colors hover:border-[#1E3F31]"
              >
                <p className="font-mono-data text-[11px] text-[#5C5B56]">
                  {item.stateName} · ~{formatINR(item.dailyBudgetINR.backpacker)}/day
                </p>
                <h3 className="mt-1 font-editorial text-2xl font-medium text-[#161614] group-hover:text-[#1E3F31]">
                  {item.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#5C5B56]">
                  {item.tagline}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
