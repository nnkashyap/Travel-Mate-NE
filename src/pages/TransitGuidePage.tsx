import React, { useMemo, useState } from 'react';
import { ArrowRight, Bus, Car, Train, Users } from 'lucide-react';
import { GATEWAY_HUBS } from '../data/circuits';
import { DESTINATIONS } from '../data/destinations';
import { HubId } from '../types/travel';
import { formatINR } from '../utils/planner';
import { useTravel } from '../context/TravelContext';

export const TransitGuidePage: React.FC = () => {
  const { navigate } = useTravel();
  const [activeHub, setActiveHub] = useState<HubId>('Guwahati (GAU)');

  const hubMeta =
    GATEWAY_HUBS.find((h) => h.id === activeHub) ?? GATEWAY_HUBS[0];

  const matchingDestinations = useMemo(
    () => DESTINATIONS.filter((d) => d.nearestHub === activeHub),
    [activeHub]
  );

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
      <div className="max-w-2xl">
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Regional Transit Directory · 6 Entry Gateways
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl">
          Shared Sumos, hill rails &amp;{' '}
          <em className="italic font-normal text-[#1E3F31]">mountain roads</em>
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5B56] sm:text-base">
          Select an arrival hub to see verified shared-vehicle counters, state
          bus links, realistic travel hours in hill terrain, and fair per-seat
          INR fares.
        </p>
      </div>

      {/* Hub Selector Buttons */}
      <div
        role="tablist"
        aria-label="Select arrival hub"
        className="mt-8 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar"
      >
        {GATEWAY_HUBS.map((hub) => {
          const active = hub.id === activeHub;
          return (
            <button
              key={hub.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveHub(hub.id)}
              className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'border-[#1E3F31] bg-[#1E3F31] text-[#FAF9F6]'
                  : 'border-[#E6E3DC] bg-[#FFFFFF] text-[#5C5B56] hover:border-[#1E3F31] hover:text-[#161614]'
              }`}
            >
              {hub.id}
            </button>
          );
        })}
      </div>

      {/* Selected Hub Overview Strip */}
      <div className="mt-6 grid grid-cols-1 gap-5 rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:grid-cols-3">
        <div>
          <p className="font-mono-data text-[11px] text-[#5C5B56]">
            Gateway City &amp; Reach
          </p>
          <p className="mt-1 font-editorial text-2xl font-medium text-[#161614]">
            {hubMeta.city}
          </p>
          <p className="mt-1 text-xs text-[#5C5B56]">
            Serves: {hubMeta.servesStates.join(', ')}
          </p>
        </div>

        <div>
          <p className="font-mono-data text-[11px] text-[#5C5B56]">
            Primary Shared Sumo Counter
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[#161614]">
            {hubMeta.sumoStandNote}
          </p>
        </div>

        <div>
          <p className="font-mono-data text-[11px] text-[#5C5B56]">
            Nearest Railhead
          </p>
          <p className="mt-1.5 font-mono-data text-sm font-medium text-[#161614]">
            {hubMeta.railhead}
          </p>
          <p className="mt-1 text-xs text-[#5C5B56]">
            Arrive before 7:00 AM for morning mountain Sumo departures.
          </p>
        </div>
      </div>

      {/* Route Cards for Destinations Served by Hub */}
      <div className="mt-8 space-y-6">
        {matchingDestinations.map((dest) => (
          <section
            key={dest.id}
            className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6"
          >
            <div className="flex flex-col justify-between gap-3 border-b border-[#E6E3DC] pb-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-mono-data text-xs text-[#5C5B56]">
                  {dest.stateName} · {dest.elevationMeters.toLocaleString('en-IN')}m ·{' '}
                  {dest.permitType === 'None' ? 'Permit-Free' : dest.permitType}
                </p>
                <h2 className="mt-1 font-editorial text-3xl font-medium text-[#161614]">
                  {activeHub} → {dest.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/destination/${dest.slug}`)}
                className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#1E3F31] hover:underline whitespace-nowrap sm:self-auto"
              >
                <span>Open full guide</span>
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dest.transitOptions.map((opt) => (
                <div
                  key={opt.mode}
                  className="flex flex-col justify-between rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] p-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#161614]">
                        {opt.mode === 'Shared Sumo / Winger' && (
                          <Users className="h-3.5 w-3.5 text-[#1E3F31]" strokeWidth={1.5} />
                        )}
                        {opt.mode === 'State Bus' && (
                          <Bus className="h-3.5 w-3.5 text-[#1E3F31]" strokeWidth={1.5} />
                        )}
                        {opt.mode === 'Train + Local Taxi' && (
                          <Train className="h-3.5 w-3.5 text-[#1E3F31]" strokeWidth={1.5} />
                        )}
                        {opt.mode === 'Private Cab' && (
                          <Car className="h-3.5 w-3.5 text-[#1E3F31]" strokeWidth={1.5} />
                        )}
                        {opt.mode}
                      </span>
                      <span className="font-mono-data text-xs text-[#5C5B56]">
                        ~{opt.durationHours}h
                      </span>
                    </div>

                    <p className="mt-2 font-mono-data text-base font-semibold text-[#1E3F31]">
                      {formatINR(opt.costPerPersonINR)}
                      <span className="text-xs font-normal text-[#5C5B56]">
                        {' '}
                        / person
                      </span>
                    </p>
                    {opt.privateVehicleTotalINR && (
                      <p className="font-mono-data text-[11px] text-[#5C5B56]">
                        {formatINR(opt.privateVehicleTotalINR)} full SUV (splits 4 ways)
                      </p>
                    )}

                    <p className="mt-3 text-xs font-medium text-[#161614]">
                      {opt.departurePoint}
                    </p>
                  </div>

                  <p className="mt-3 border-t border-[#E6E3DC] pt-2.5 text-xs leading-relaxed text-[#5C5B56]">
                    {opt.tip}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};
