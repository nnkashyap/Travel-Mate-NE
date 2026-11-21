import React from 'react';
import { Navigation, Trash2 } from 'lucide-react';
import { formatINR, ItineraryDay } from '../../utils/planner';
import { DESTINATIONS } from '../../data/destinations';

interface ItineraryTimelineProps {
  schedule: ItineraryDay[];
  selectedDestinationIds: string[];
  onRemoveDestination: (id: string) => void;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  schedule,
  selectedDestinationIds,
  onRemoveDestination,
}) => {
  if (schedule.length === 0) {
    return (
      <section className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-8 text-center">
        <h2 className="font-editorial text-2xl font-medium text-[#161614]">
          Choose destinations to build your timeline
        </h2>
        <p className="mt-2 text-sm text-[#5C5B56]">
          Select up to four spots or pick a Starter Circuit on the left to
          generate a realistic day-by-day route and transit schedule.
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="timeline-heading" className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-data text-xs text-[#5C5B56]">
            Day-by-Day Editorial Schedule
          </p>
          <h2
            id="timeline-heading"
            className="mt-1 font-editorial text-3xl font-medium text-[#161614]"
          >
            Your tailored route timeline
          </h2>
        </div>

        {/* Active Stops Quick Remove Bar */}
        <div className="no-print flex flex-wrap items-center gap-2">
          {selectedDestinationIds.map((id) => {
            const dest = DESTINATIONS.find((d) => d.id === id);
            if (!dest) return null;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onRemoveDestination(id)}
                aria-label={`Remove ${dest.name} from itinerary`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6E3DC] bg-[#FFFFFF] px-2.5 py-1 text-xs font-medium text-[#161614] hover:border-[#C25E3A] hover:text-[#C25E3A]"
              >
                <span>{dest.name}</span>
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>

      <ol className="space-y-5">
        {schedule.map((day) => (
          <li
            key={day.dayNumber}
            className="print-break-avoid print-clean-card rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-5 md:p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E6E3DC] pb-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono-data text-xs font-semibold text-[#C25E3A]">
                  DAY {String(day.dayNumber).padStart(2, '0')}
                </span>
                <h3 className="font-editorial text-2xl font-medium text-[#161614]">
                  {day.title}
                </h3>
              </div>

              <span className="font-mono-data text-xs text-[#5C5B56]">
                {day.stateName} · Est. {formatINR(day.estimatedPerPersonINR)}/pax
              </span>
            </div>

            {day.transitLeg && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-[#F2EFE9]/80 px-4 py-2.5 text-xs text-[#161614]">
                <Navigation
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E3F31]"
                  strokeWidth={1.6}
                />
                <span>{day.transitLeg}</span>
              </div>
            )}

            <dl className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <dt className="font-mono-data text-[11px] text-[#5C5B56]">
                  Morning
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#161614]">
                  {day.morning}
                </dd>
              </div>
              <div>
                <dt className="font-mono-data text-[11px] text-[#5C5B56]">
                  Afternoon
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#161614]">
                  {day.afternoon}
                </dd>
              </div>
              <div>
                <dt className="font-mono-data text-[11px] text-[#5C5B56]">
                  Evening
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#161614]">
                  {day.evening}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
};
