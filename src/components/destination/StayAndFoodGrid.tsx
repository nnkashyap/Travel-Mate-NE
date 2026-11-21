import React from 'react';
import { Destination } from '../../types/travel';
import { formatINR } from '../../utils/planner';

interface StayAndFoodGridProps {
  destination: Destination;
}

export const StayAndFoodGrid: React.FC<StayAndFoodGridProps> = ({
  destination,
}) => {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Community-First Stays */}
      <section
        aria-labelledby="stays-heading"
        className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-7 lg:col-span-6"
      >
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Community-First Lodging
        </p>
        <h2
          id="stays-heading"
          className="mt-1 font-editorial text-3xl font-medium text-[#161614]"
        >
          Where to stay
        </h2>

        <div className="mt-6 divide-y divide-[#E6E3DC] border-y border-[#E6E3DC]">
          {destination.stayRecommendations.map((stay) => (
            <div
              key={stay.tier}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div>
                <p className="font-mono-data text-[11px] text-[#1E3F31]">
                  {stay.tier}
                </p>
                <p className="mt-1 text-sm font-medium text-[#161614]">
                  {stay.exampleType}
                </p>
              </div>
              <div className="text-right font-mono-data whitespace-nowrap">
                <span className="text-sm font-medium text-[#161614]">
                  {formatINR(stay.pricePerNightINR)}
                </span>
                <span className="block text-[11px] text-[#5C5B56]">
                  / night
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-[#5C5B56]">
          Homestays in {destination.stateName} generally include hearty home-cooked
          breakfast and optional evening hearth meals for ₹200–₹300 extra.
        </p>
      </section>

      {/* Regional Flavors & Respectful Travel Notes */}
      <section
        aria-labelledby="flavors-heading"
        className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-7 lg:col-span-6"
      >
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Local Kitchen &amp; Etiquette
        </p>
        <h2
          id="flavors-heading"
          className="mt-1 font-editorial text-3xl font-medium text-[#161614]"
        >
          Regional flavors to seek out
        </h2>

        <div className="mt-6 divide-y divide-[#E6E3DC] border-y border-[#E6E3DC]">
          {destination.mustTryFood.map((dish) => (
            <div
              key={dish.name}
              className="flex items-start justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-semibold text-[#161614]">
                  {dish.name}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#5C5B56]">
                  {dish.note}
                </p>
              </div>
              <span className="font-mono-data text-xs font-medium text-[#161614] whitespace-nowrap">
                ~{formatINR(dish.avgCostINR)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="font-editorial text-xl font-medium text-[#161614]">
            Respectful travel notes
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#5C5B56]">
            {destination.etiquetteTips.map((tip, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="font-mono-data text-xs text-[#C25E3A]">
                  0{idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};
