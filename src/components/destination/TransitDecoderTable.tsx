import React, { useMemo, useState } from 'react';
import { Bus, Car, Train, Users } from 'lucide-react';
import { Destination, TransitOption } from '../../types/travel';
import { formatINR } from '../../utils/planner';

interface TransitDecoderTableProps {
  destination: Destination;
}

const SELECTABLE_HUBS = [
  'Guwahati (GAU)',
  'Shillong',
  'Dimapur (DMU)',
  'Bagdogra (IXB)',
  'Imphal (IMF)',
  'Agartala (IXA)',
  'Aizawl / Sairang',
];

function getHubAdjustment(
  baseHub: string,
  chosenHub: string
): { extraHours: number; extraPerPersonINR: number; connectorNote: string | null } {
  if (baseHub === chosenHub) {
    return { extraHours: 0, extraPerPersonINR: 0, connectorNote: null };
  }
  if (baseHub === 'Guwahati (GAU)' && chosenHub === 'Shillong') {
    return {
      extraHours: -2.5,
      extraPerPersonINR: -240,
      connectorNote: 'Direct regional leg starting from Shillong Bara Bazar / Police Bazar',
    };
  }
  if (chosenHub === 'Guwahati (GAU)') {
    return {
      extraHours: 4.5,
      extraPerPersonINR: 650,
      connectorNote: `Includes Guwahati → ${baseHub} overnight train, flight hop, or express highway link`,
    };
  }
  return {
    extraHours: 6,
    extraPerPersonINR: 900,
    connectorNote: `Connect overland or via regional flight from ${chosenHub} to primary gateway ${baseHub}`,
  };
}

function ModeIcon({ mode }: { mode: TransitOption['mode'] }) {
  if (mode === 'Shared Sumo / Winger') return <Users className="h-4 w-4 text-[#1E3F31]" strokeWidth={1.5} />;
  if (mode === 'State Bus') return <Bus className="h-4 w-4 text-[#1E3F31]" strokeWidth={1.5} />;
  if (mode === 'Train + Local Taxi') return <Train className="h-4 w-4 text-[#1E3F31]" strokeWidth={1.5} />;
  return <Car className="h-4 w-4 text-[#1E3F31]" strokeWidth={1.5} />;
}

export const TransitDecoderTable: React.FC<TransitDecoderTableProps> = ({
  destination,
}) => {
  const [selectedHub, setSelectedHub] = useState<string>(destination.nearestHub);

  const hubOptions = useMemo(() => {
    const base = new Set([destination.nearestHub, ...SELECTABLE_HUBS]);
    return Array.from(base);
  }, [destination.nearestHub]);

  const adjustment = getHubAdjustment(destination.nearestHub, selectedHub);

  const computedRows = useMemo(() => {
    return destination.transitOptions.map((opt) => {
      const durationHours = Math.max(
        1,
        Number((opt.durationHours + adjustment.extraHours).toFixed(1))
      );
      const costPerPersonINR = Math.max(
        90,
        opt.costPerPersonINR + adjustment.extraPerPersonINR
      );
      const privateVehicleTotalINR = opt.privateVehicleTotalINR
        ? Math.max(1800, opt.privateVehicleTotalINR + adjustment.extraPerPersonINR * 4)
        : undefined;

      return {
        ...opt,
        durationHours,
        costPerPersonINR,
        privateVehicleTotalINR,
      };
    });
  }, [destination.transitOptions, adjustment]);

  return (
    <section
      aria-labelledby="transit-decoder-heading"
      className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-8"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-[#E6E3DC] pb-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono-data text-xs text-[#C25E3A]">
            Local Transit Decoder
          </p>
          <h2
            id="transit-decoder-heading"
            className="mt-1 font-editorial text-3xl font-medium text-[#161614]"
          >
            How to reach {destination.name}
          </h2>
          <p className="mt-1.5 text-sm text-[#5C5B56]">
            Compare realistic shared Sumo stands, state buses, rail links, and
            private cab splits.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 sm:min-w-[240px]">
          <label
            htmlFor="destination-hub-select"
            className="text-xs font-medium text-[#5C5B56]"
          >
            Starting Hub
          </label>
          <select
            id="destination-hub-select"
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="h-10 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3 text-sm font-medium text-[#161614]"
          >
            {hubOptions.map((hub) => (
              <option key={hub} value={hub}>
                {hub}
                {hub === destination.nearestHub ? ' (Primary Hub)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {adjustment.connectorNote && (
        <p className="mt-4 rounded-xl bg-[#F2EFE9] px-4 py-2.5 text-xs text-[#5C5B56]">
          <strong className="font-semibold text-[#161614]">Hub Route Note:</strong>{' '}
          {adjustment.connectorNote}.
        </p>
      )}

      {/* Desktop Table */}
      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#E6E3DC] bg-[#F2EFE9]/60 font-mono-data text-[11px] text-[#5C5B56]">
              <th className="rounded-tl-lg px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Est. Cost</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Departure Stand / Route</th>
              <th className="rounded-tr-lg px-4 py-3 font-medium">Insider Tip</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6E3DC]">
            {computedRows.map((row) => (
              <tr key={row.mode} className="align-top">
                <td className="px-4 py-4 font-semibold text-[#161614] whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <ModeIcon mode={row.mode} />
                    <span>{row.mode}</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono-data whitespace-nowrap">
                  <div className="font-medium text-[#161614]">
                    {formatINR(row.costPerPersonINR)}
                    <span className="text-xs font-normal text-[#5C5B56]">
                      /person
                    </span>
                  </div>
                  {row.privateVehicleTotalINR && (
                    <div className="mt-0.5 text-[11px] text-[#5C5B56]">
                      {formatINR(row.privateVehicleTotalINR)} full cab (4 pax)
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 font-mono-data text-[#161614] whitespace-nowrap">
                  ~{row.durationHours} hrs
                </td>
                <td className="px-4 py-4 text-xs leading-relaxed text-[#161614]">
                  {row.departurePoint}
                </td>
                <td className="px-4 py-4 text-xs leading-relaxed text-[#5C5B56]">
                  {row.tip}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="mt-5 space-y-4 md:hidden">
        {computedRows.map((row) => (
          <div
            key={row.mode}
            className="rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#161614]">
                <ModeIcon mode={row.mode} />
                <span>{row.mode}</span>
              </div>
              <span className="font-mono-data text-xs text-[#5C5B56]">
                ~{row.durationHours} hrs
              </span>
            </div>

            <div className="mt-2 font-mono-data text-sm font-medium text-[#161614]">
              {formatINR(row.costPerPersonINR)} / person
              {row.privateVehicleTotalINR && (
                <span className="ml-2 text-xs font-normal text-[#5C5B56]">
                  ({formatINR(row.privateVehicleTotalINR)} cab)
                </span>
              )}
            </div>

            <p className="mt-2 text-xs font-medium text-[#161614]">
              {row.departurePoint}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-[#5C5B56]">
              {row.tip}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
