import React from 'react';
import { Bookmark, Clock } from 'lucide-react';
import { Destination } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { formatINR } from '../../utils/planner';
import { EditorialImage } from '../shared/EditorialImage';

interface DestinationCardProps {
  destination: Destination;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
}) => {
  const { navigate, isPlaceSaved, toggleSavedPlace } = useTravel();
  const saved = isPlaceSaved(destination.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] transition-colors duration-200 hover:border-[#1E3F31]">
      {/* 4:3 Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2EFE9]">
        <a
          href={`/destination/${destination.slug}`}
          onClick={(e) => {
            e.preventDefault();
            navigate(`/destination/${destination.slug}`);
          }}
          className="block h-full w-full"
        >
          <EditorialImage
            src={destination.imageUrl}
            alt={`${destination.name}, ${destination.stateName}`}
            fallbackLabel={destination.name}
            className={`h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03] ${
              destination.imageFocus ?? 'object-center'
            }`}
          />
        </a>

        {/* Quiet Corner Label when Hidden Gem or ILP */}
        {(destination.isHiddenGem || destination.permitType !== 'None') && (
          <span className="pointer-events-none absolute top-3 left-3 rounded-md bg-[#141C18]/82 px-2.5 py-1 font-mono-data text-[10px] font-medium tracking-wide text-[#FAF9F6] backdrop-blur-xs">
            {destination.isHiddenGem
              ? 'Hidden Gem'
              : destination.permitType === 'ILP'
                ? 'ILP Needed'
                : 'Zone PAP'}
          </span>
        )}

        {/* Accessible Bookmark Toggle */}
        <button
          type="button"
          onClick={() => toggleSavedPlace(destination.id)}
          aria-label={
            saved
              ? `Remove ${destination.name} from saved places`
              : `Save ${destination.name}`
          }
          aria-pressed={saved}
          className={`absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
            saved
              ? 'border-[#1E3F31] bg-[#1E3F31] text-[#FAF9F6]'
              : 'border-[#E6E3DC]/80 bg-[#FFFFFF]/90 text-[#161614] hover:border-[#1E3F31] hover:text-[#1E3F31]'
          }`}
        >
          <Bookmark
            className="h-4 w-4"
            strokeWidth={1.6}
            fill={saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Card Body: Clean Unboxed Editorial Metadata */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="font-mono-data text-[11px] text-[#5C5B56]">
            {destination.stateName} ·{' '}
            {destination.elevationMeters.toLocaleString('en-IN')}m
            {destination.permitType === 'None' ? ' · Permit-Free' : ''}
          </p>

          <h3 className="mt-1.5 font-editorial text-2xl font-medium leading-snug text-[#161614]">
            <a
              href={`/destination/${destination.slug}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/destination/${destination.slug}`);
              }}
              className="hover:text-[#1E3F31]"
            >
              {destination.name}
            </a>
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#5C5B56]">
            {destination.tagline}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[#E6E3DC] pt-3.5 text-xs">
          <span className="font-mono-data font-medium text-[#161614]">
            ~{formatINR(destination.dailyBudgetINR.backpacker)}/day
          </span>
          <span className="inline-flex items-center gap-1 font-mono-data text-[#5C5B56]">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            {destination.hubTravelHours}h from{' '}
            {destination.nearestHub.split(' ')[0]}
          </span>
        </div>
      </div>
    </article>
  );
};
