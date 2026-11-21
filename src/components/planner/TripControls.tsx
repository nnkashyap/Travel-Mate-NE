import React from 'react';
import { Check, Minus, Plus } from 'lucide-react';
import { GATEWAY_HUBS, STARTER_CIRCUITS } from '../../data/circuits';
import { DESTINATIONS } from '../../data/destinations';
import {
  HubId,
  TransportPreference,
  TravelTier,
} from '../../types/travel';
import { PlannerState } from '../../context/TravelContext';

interface TripControlsProps {
  planner: PlannerState;
  onChange: React.Dispatch<React.SetStateAction<PlannerState>>;
}

const TIERS: { id: TravelTier; label: string; desc: string }[] = [
  { id: 'backpacker', label: 'Backpacker', desc: 'Homestays, dorms & local eateries' },
  { id: 'balanced', label: 'Balanced', desc: 'Private homestays & local cafes' },
  { id: 'comfort', label: 'Comfort', desc: 'Boutique eco-lodges & private dining' },
];

export const TripControls: React.FC<TripControlsProps> = ({
  planner,
  onChange,
}) => {
  const toggleDestination = (id: string) => {
    onChange((prev) => {
      if (prev.destinationIds.includes(id)) {
        return {
          ...prev,
          destinationIds: prev.destinationIds.filter((item) => item !== id),
        };
      }
      if (prev.destinationIds.length >= 4) {
        return prev;
      }
      return {
        ...prev,
        destinationIds: [...prev.destinationIds, id],
      };
    });
  };

  const applyCircuit = (circuitId: string) => {
    const circuit = STARTER_CIRCUITS.find((c) => c.id === circuitId);
    if (!circuit) return;
    onChange((prev) => ({
      ...prev,
      startingHub: circuit.startingHub,
      destinationIds: circuit.destinationIds,
      days: circuit.days,
      tier: circuit.recommendedTier,
    }));
  };

  return (
    <div className="no-print space-y-6 rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-5 md:p-6">
      {/* 1-Click Starter Circuits */}
      <div>
        <p className="font-mono-data text-[11px] text-[#5C5B56]">
          Quick Starter Circuits
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {STARTER_CIRCUITS.map((circuit) => {
            const isSelected =
              circuit.destinationIds.length === planner.destinationIds.length &&
              circuit.destinationIds.every((id) =>
                planner.destinationIds.includes(id)
              );
            return (
              <button
                key={circuit.id}
                type="button"
                onClick={() => applyCircuit(circuit.id)}
                className={`rounded-xl border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-[#1E3F31] bg-[#DCE6E0]/70 text-[#1E3F31]'
                    : 'border-[#E6E3DC] bg-[#FAF9F6] text-[#161614] hover:border-[#1E3F31]'
                }`}
              >
                {circuit.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Starting Hub */}
      <div className="border-t border-[#E6E3DC] pt-5">
        <label
          htmlFor="planner-hub-select"
          className="block text-xs font-semibold text-[#161614]"
        >
          Starting Entry Hub
        </label>
        <select
          id="planner-hub-select"
          value={planner.startingHub}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              startingHub: e.target.value as HubId,
            }))
          }
          className="mt-2 h-11 w-full rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3.5 text-sm font-medium text-[#161614]"
        >
          {GATEWAY_HUBS.map((hub) => (
            <option key={hub.id} value={hub.id}>
              {hub.id} — {hub.servesStates.join(', ')}
            </option>
          ))}
        </select>
      </div>

      {/* Duration & Group Size */}
      <div className="space-y-5 border-t border-[#E6E3DC] pt-5">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="planner-days-slider"
              className="text-xs font-semibold text-[#161614]"
            >
              Duration
            </label>
            <span className="font-mono-data text-sm font-medium text-[#1E3F31] whitespace-nowrap">
              {planner.days} Days
            </span>
          </div>
          <input
            id="planner-days-slider"
            type="range"
            min={2}
            max={12}
            value={planner.days}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, days: Number(e.target.value) }))
            }
            className="mt-3 w-full accent-[#1E3F31]"
          />
          <div className="mt-1 flex justify-between font-mono-data text-[10px] text-[#706E67]">
            <span>2 Days</span>
            <span>7 Days</span>
            <span>12 Days</span>
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-[#161614]">
            Group Size (1–6 Travelers)
          </span>
          <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3.5 py-2">
            <button
              type="button"
              aria-label="Decrease travelers"
              disabled={planner.groupSize <= 1}
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  groupSize: Math.max(1, prev.groupSize - 1),
                }))
              }
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>

            <span
              data-testid="group-size-value"
              className="font-mono-data text-sm font-semibold text-[#161614] whitespace-nowrap"
            >
              {planner.groupSize}{' '}
              {planner.groupSize === 1 ? 'Traveler' : 'Travelers'}
            </span>

            <button
              type="button"
              aria-label="Increase travelers"
              disabled={planner.groupSize >= 6}
              onClick={() =>
                onChange((prev) => ({
                  ...prev,
                  groupSize: Math.min(6, prev.groupSize + 1),
                }))
              }
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      {/* Transport Mode Switch */}
      <div className="border-t border-[#E6E3DC] pt-5">
        <span className="block text-xs font-semibold text-[#161614]">
          Intercity Transport Mode
        </span>
        <div
          role="group"
          aria-label="Transport mode"
          className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl bg-[#F2EFE9] p-1"
        >
          {(
            [
              { id: 'shared', label: 'Shared Sumo & Bus' },
              { id: 'private', label: 'Private Cab / SUV' },
            ] as { id: TransportPreference; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              aria-pressed={planner.transportMode === opt.id}
              onClick={() =>
                onChange((prev) => ({ ...prev, transportMode: opt.id }))
              }
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                planner.transportMode === opt.id
                  ? 'bg-[#FFFFFF] text-[#1E3F31]'
                  : 'text-[#5C5B56] hover:text-[#161614]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Travel Tier */}
      <div className="border-t border-[#E6E3DC] pt-5">
        <span className="block text-xs font-semibold text-[#161614]">
          Stay &amp; Dining Style
        </span>
        <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {TIERS.map((tier) => {
            const active = planner.tier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  onChange((prev) => ({ ...prev, tier: tier.id }))
                }
                className={`rounded-xl border p-3 text-left transition-colors ${
                  active
                    ? 'border-[#1E3F31] bg-[#DCE6E0]/55 text-[#161614]'
                    : 'border-[#E6E3DC] bg-[#FAF9F6] text-[#5C5B56] hover:border-[#1E3F31]'
                }`}
              >
                <span className="block text-xs font-semibold text-[#161614]">
                  {tier.label}
                </span>
                <span className="mt-0.5 block text-[11px] leading-snug text-[#5C5B56]">
                  {tier.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Multi-Select Destinations (up to 4) */}
      <div className="border-t border-[#E6E3DC] pt-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#161614]">
            Destinations (Select up to 4)
          </span>
          <span className="font-mono-data text-xs text-[#5C5B56]">
            {planner.destinationIds.length} / 4 chosen
          </span>
        </div>

        <div className="mt-3 max-h-[290px] space-y-1.5 overflow-y-auto pr-1">
          {DESTINATIONS.map((dest) => {
            const selected = planner.destinationIds.includes(dest.id);
            const disabled = !selected && planner.destinationIds.length >= 4;
            return (
              <button
                key={dest.id}
                type="button"
                disabled={disabled}
                aria-pressed={selected}
                onClick={() => toggleDestination(dest.id)}
                className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                  selected
                    ? 'border-[#1E3F31] bg-[#DCE6E0]/50 text-[#161614]'
                    : 'border-[#E6E3DC] bg-[#FAF9F6] text-[#161614] hover:border-[#1E3F31] disabled:cursor-not-allowed disabled:opacity-45'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <span className="block truncate text-xs font-semibold">
                    {dest.name}
                  </span>
                  <span className="font-mono-data text-[10px] text-[#5C5B56]">
                    {dest.stateName} ·{' '}
                    {dest.permitType === 'None' ? 'Open' : dest.permitType}
                  </span>
                </div>
                <span
                  className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    selected
                      ? 'border-[#1E3F31] bg-[#1E3F31] text-[#FAF9F6]'
                      : 'border-[#C8C3B8] bg-[#FFFFFF]'
                  }`}
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={2.2} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
