import React, { useState } from 'react';
import {
  AlertTriangle,
  BookmarkCheck,
  BookmarkPlus,
  Check,
  Download,
  TrendingDown,
} from 'lucide-react';
import {
  formatINR,
  ItineraryDay,
  PermitAlertItem,
  TripBudgetResult,
} from '../../utils/planner';
import { downloadSinglePageItineraryPdf } from '../../utils/pdfExport';
import { PlannerState, useTravel } from '../../context/TravelContext';

interface BudgetBreakdownProps {
  planner: PlannerState;
  budget: TripBudgetResult;
  schedule: ItineraryDay[];
  permitAlerts: PermitAlertItem[];
}

export const BudgetBreakdown: React.FC<BudgetBreakdownProps> = ({
  planner,
  budget,
  schedule,
  permitAlerts,
}) => {
  const { saveCurrentItinerary, navigateToPermitsForStates } = useTravel();
  const [savedNotice, setSavedNotice] = useState(false);
  const [pdfNotice, setPdfNotice] = useState<'idle' | 'downloaded' | 'error'>(
    'idle'
  );

  const segments = [
    {
      label: 'Transit & Intercity',
      value: budget.breakdown.transitINR,
      color: '#1E3F31',
    },
    {
      label: 'Accommodation',
      value: budget.breakdown.accommodationINR,
      color: '#3D6B59',
    },
    {
      label: 'Food & Local Dining',
      value: budget.breakdown.foodINR,
      color: '#C25E3A',
    },
    {
      label: 'Experiences & Guides',
      value: budget.breakdown.experiencesINR,
      color: '#8E8C84',
    },
    {
      label: 'Permits & Entry Fees',
      value: budget.breakdown.permitsINR,
      color: '#B45309',
    },
  ];

  const safeTotal = Math.max(1, budget.totalINR);

  const handleSave = () => {
    saveCurrentItinerary();
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleDownloadPdf = () => {
    if (planner.destinationIds.length === 0) return;
    try {
      downloadSinglePageItineraryPdf({
        planner,
        budget,
        schedule,
        permitAlerts,
      });
      setPdfNotice('downloaded');
      window.setTimeout(() => setPdfNotice('idle'), 3200);
    } catch {
      setPdfNotice('error');
      window.setTimeout(() => setPdfNotice('idle'), 3200);
    }
  };

  return (
    <section
      aria-labelledby="budget-summary-heading"
      className="print-clean-card rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-7"
    >
      {/* Headline Totals */}
      <div className="flex flex-col justify-between gap-5 border-b border-[#E6E3DC] pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono-data text-xs text-[#5C5B56]">
            Live Estimate · {planner.days} Days · {planner.groupSize}{' '}
            {planner.groupSize === 1 ? 'Traveler' : 'Travelers'} ·{' '}
            {budget.roomsNeeded} {budget.roomsNeeded === 1 ? 'Room' : 'Rooms'}
            {planner.transportMode === 'private'
              ? ` · ${budget.vehiclesNeeded} ${
                  budget.vehiclesNeeded === 1 ? 'SUV' : 'SUVs'
                }`
              : ' · Shared Transit'}
          </p>
          <h2
            id="budget-summary-heading"
            className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl"
          >
            <span data-testid="total-budget-inr" className="font-mono-data">
              {formatINR(budget.totalINR)}
            </span>
          </h2>
          <p className="mt-1 text-xs text-[#5C5B56]">
            Total estimated trip budget across all travelers
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-xs font-medium text-[#5C5B56]">Per Person Share</p>
          <p
            data-testid="per-person-budget-inr"
            className="mt-1 font-mono-data text-2xl font-semibold text-[#1E3F31]"
          >
            {formatINR(budget.perPersonINR)}
          </p>
        </div>
      </div>

      {/* Horizontal Stacked Bar Chart */}
      <div className="mt-6">
        <div
          role="img"
          aria-label="Cost breakdown stacked bar across transit, accommodation, food, experiences, and permits"
          className="flex h-3.5 w-full overflow-hidden rounded-full bg-[#F2EFE9]"
        >
          {segments.map((seg) => {
            if (seg.value <= 0) return null;
            const widthPercent = (seg.value / safeTotal) * 100;
            return (
              <div
                key={seg.label}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: seg.color,
                }}
                title={`${seg.label}: ${formatINR(seg.value)}`}
                className="h-full transition-all duration-300"
              />
            );
          })}
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {segments.map((seg) => {
            const pct =
              budget.totalINR > 0
                ? Math.round((seg.value / budget.totalINR) * 100)
                : 0;
            return (
              <div
                key={seg.label}
                className="flex items-center justify-between gap-3 border-b border-[#E6E3DC]/70 pb-2 text-xs"
              >
                <dt className="flex items-center gap-2 text-[#5C5B56]">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 shrink-0 rounded-xs"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span>{seg.label}</span>
                </dt>
                <dd className="font-mono-data font-medium text-[#161614] whitespace-nowrap">
                  {formatINR(seg.value)}{' '}
                  <span className="text-[10px] text-[#706E67]">({pct}%)</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>

      {/* Dynamic Smart Savings Tip */}
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#DCE6E0] bg-[#FAF9F6] p-4">
        <TrendingDown
          className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3F31]"
          strokeWidth={1.5}
        />
        <p className="text-xs leading-relaxed text-[#161614]">
          <strong className="font-semibold text-[#1E3F31]">
            Route Economics:{' '}
          </strong>
          {budget.savingsTip}
        </p>
      </div>

      {/* Auto-Triggered Permit Alert */}
      {permitAlerts.length > 0 && (
        <div
          data-testid="planner-permit-alert"
          className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-[#B45309]/35 bg-[#FEF3C7]/45 p-4 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]"
              strokeWidth={1.6}
            />
            <div className="text-xs leading-relaxed text-[#161614]">
              <p className="font-semibold text-[#92400E]">
                Permit Action Required ({permitAlerts.map((a) => a.stateName).join(', ')})
              </p>
              <p className="mt-0.5 text-[#5C5B56]">
                {permitAlerts
                  .map((a) => `${a.stateName}: ${a.code} (${a.feeDisplay})`)
                  .join(' · ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigateToPermitsForStates(permitAlerts.map((a) => a.stateId))
            }
            className="no-print shrink-0 rounded-lg border border-[#B45309]/40 bg-[#FFFFFF] px-3.5 py-2 text-xs font-semibold text-[#92400E] transition-colors hover:bg-[#FEF3C7] whitespace-nowrap"
          >
            View Permit Steps
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="no-print mt-6 flex flex-wrap items-center gap-3 border-t border-[#E6E3DC] pt-5">
        <button
          type="button"
          onClick={handleSave}
          disabled={planner.destinationIds.length === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-5 py-2.5 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24] disabled:opacity-45 whitespace-nowrap"
        >
          {savedNotice ? (
            <>
              <BookmarkCheck className="h-4 w-4" strokeWidth={1.6} />
              <span>Saved to Notebook</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-4 w-4" strokeWidth={1.6} />
              <span>Save Itinerary</span>
            </>
          )}
        </button>

        <button
          type="button"
          data-testid="download-pdf-btn"
          onClick={handleDownloadPdf}
          disabled={planner.destinationIds.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] px-5 py-2.5 text-xs font-semibold text-[#161614] transition-colors hover:border-[#1E3F31] hover:text-[#1E3F31] disabled:opacity-45 whitespace-nowrap"
        >
          {pdfNotice === 'downloaded' ? (
            <>
              <Check className="h-4 w-4 text-[#2D6A4F]" strokeWidth={1.8} />
              <span>Single-Page PDF Downloaded</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" strokeWidth={1.5} />
              <span>Download / Print PDF</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
