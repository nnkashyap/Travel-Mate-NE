import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  FileCheck2,
  ShieldAlert,
} from 'lucide-react';
import { STATES } from '../../data/states';
import { PRE_TRAVEL_CHECKLIST } from '../../data/permits';
import { StateId, TravelerNationality } from '../../types/travel';
import { evaluatePermits } from '../../utils/permits';
import { formatINR } from '../../utils/planner';
import { useTravel } from '../../context/TravelContext';

export const PermitChecker: React.FC = () => {
  const {
    permitChecklist,
    toggleChecklistItem,
    preselectedPermitStates,
  } = useTravel();

  const [nationality, setNationality] = useState<TravelerNationality>('indian');
  const [selectedStates, setSelectedStates] = useState<StateId[]>(
    preselectedPermitStates.length > 0
      ? preselectedPermitStates
      : ['arunachal', 'nagaland', 'sikkim']
  );

  useEffect(() => {
    if (preselectedPermitStates.length > 0) {
      setSelectedStates(preselectedPermitStates);
    }
  }, [preselectedPermitStates]);

  const toggleState = (id: StateId) => {
    setSelectedStates((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectAllStates = () => setSelectedStates(STATES.map((s) => s.id));
  const clearAllStates = () => setSelectedStates([]);

  const report = useMemo(
    () => evaluatePermits(nationality, selectedStates),
    [nationality, selectedStates]
  );

  const completedChecklistCount = PRE_TRAVEL_CHECKLIST.filter(
    (item) => Boolean(permitChecklist[item.id])
  ).length;

  return (
    <div className="space-y-10">
      {/* Interactive Selector Panel */}
      <section className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Step 1: Nationality */}
          <div className="lg:col-span-4">
            <p className="font-mono-data text-xs text-[#5C5B56]">
              01. Traveler Nationality
            </p>
            <div
              role="group"
              aria-label="Traveler nationality"
              className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl bg-[#F2EFE9] p-1"
            >
              <button
                type="button"
                aria-pressed={nationality === 'indian'}
                onClick={() => setNationality('indian')}
                className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  nationality === 'indian'
                    ? 'bg-[#FFFFFF] text-[#1E3F31]'
                    : 'text-[#5C5B56] hover:text-[#161614]'
                }`}
              >
                Indian Citizen
              </button>
              <button
                type="button"
                aria-pressed={nationality === 'foreign'}
                onClick={() => setNationality('foreign')}
                className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                  nationality === 'foreign'
                    ? 'bg-[#FFFFFF] text-[#1E3F31]'
                    : 'text-[#5C5B56] hover:text-[#161614]'
                }`}
              >
                Foreign National
              </button>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#5C5B56]">
              Rules reflect Inner Line Permit (ILP), Sikkim Restricted/Protected
              Area Permits (RAP/PAP), and border checkpost guidelines.
            </p>
          </div>

          {/* Step 2: States Visiting */}
          <div className="border-t border-[#E6E3DC] pt-6 lg:col-span-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono-data text-xs text-[#5C5B56]">
                02. States You Are Visiting ({selectedStates.length} selected)
              </p>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={selectAllStates}
                  className="text-[#1E3F31] hover:underline"
                >
                  Select all 8
                </button>
                <button
                  type="button"
                  onClick={clearAllStates}
                  className="text-[#5C5B56] hover:text-[#161614]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {STATES.map((state) => {
                const checked = selectedStates.includes(state.id);
                return (
                  <label
                    key={state.id}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-colors ${
                      checked
                        ? 'border-[#1E3F31] bg-[#DCE6E0]/55 text-[#161614]'
                        : 'border-[#E6E3DC] bg-[#FAF9F6] text-[#5C5B56] hover:border-[#1E3F31]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleState(state.id)}
                      className="h-4 w-4 rounded accent-[#1E3F31]"
                    />
                    <span className="truncate">{state.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Permit Summary Strip */}
      {selectedStates.length > 0 && (
        <dl className="grid grid-cols-1 divide-y divide-[#E6E3DC] rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="p-5">
            <dt className="text-xs text-[#5C5B56]">States Needing Permits</dt>
            <dd className="mt-1 font-mono-data text-2xl font-medium text-[#B45309]">
              {report.requiredCount} of {selectedStates.length}
            </dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-[#5C5B56]">Open / Permit-Free States</dt>
            <dd className="mt-1 font-mono-data text-2xl font-medium text-[#2D6A4F]">
              {report.openCount}
            </dd>
          </div>
          <div className="p-5">
            <dt className="text-xs text-[#5C5B56]">
              Est. Permit Fees (Per Person)
            </dt>
            <dd className="mt-1 font-mono-data text-2xl font-medium text-[#161614]">
              {report.estimatedTotalFeeINR > 0
                ? formatINR(report.estimatedTotalFeeINR)
                : '₹0 (Free)'}
            </dd>
          </div>
        </dl>
      )}

      {/* Detailed State Permit Report Cards */}
      {selectedStates.length === 0 ? (
        <div className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-10 text-center">
          <h2 className="font-editorial text-2xl font-medium text-[#161614]">
            Select at least one state above
          </h2>
          <p className="mt-2 text-sm text-[#5C5B56]">
            Choose the states on your itinerary to generate an itemized entry,
            fee, and checkpost report.
          </p>
        </div>
      ) : (
        <div data-testid="permit-report-list" className="space-y-5">
          {report.entries.map((entry) => {
            const isOpen = entry.code === 'OPEN';
            return (
              <article
                key={entry.stateId}
                className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6"
              >
                <div className="flex flex-col justify-between gap-3 border-b border-[#E6E3DC] pb-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="font-mono-data text-xs text-[#5C5B56]">
                      {entry.code} · {entry.validity}
                    </p>
                    <h2 className="mt-1 font-editorial text-3xl font-medium text-[#161614]">
                      {entry.stateName}
                    </h2>
                  </div>

                  <div
                    className={`inline-flex items-center gap-2 font-mono-data text-xs font-semibold ${
                      isOpen ? 'text-[#2D6A4F]' : 'text-[#B45309]'
                    }`}
                  >
                    {isOpen ? (
                      <CheckCircle2 className="h-4 w-4" strokeWidth={1.6} />
                    ) : entry.code === 'PAP-ZONE' ? (
                      <FileCheck2 className="h-4 w-4" strokeWidth={1.6} />
                    ) : (
                      <ShieldAlert className="h-4 w-4" strokeWidth={1.6} />
                    )}
                    <span>{entry.label}</span>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
                  <div>
                    <dt className="text-[#5C5B56]">Official Fee</dt>
                    <dd className="mt-1 font-mono-data font-medium text-[#161614]">
                      {entry.feeDisplay}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5C5B56]">Official Portal / Channel</dt>
                    <dd className="mt-1 font-mono-data font-medium text-[#1E3F31]">
                      {entry.portal}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[#5C5B56]">Key Checkposts</dt>
                    <dd className="mt-1 font-medium text-[#161614]">
                      {entry.checkposts}
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border-t border-[#E6E3DC] pt-4">
                  <ol className="space-y-2 text-sm leading-relaxed text-[#161614]">
                    {entry.steps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-mono-data text-xs text-[#C25E3A]">
                          0{i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-3 rounded-xl bg-[#F2EFE9]/75 px-4 py-2.5 text-xs text-[#5C5B56]">
                    <strong className="font-semibold text-[#161614]">
                      Field Note:
                    </strong>{' '}
                    {entry.note}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Interactive Pre-Travel Checklist */}
      <section
        aria-labelledby="checklist-heading"
        className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 md:p-8"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#E6E3DC] pb-4">
          <div>
            <p className="font-mono-data text-xs text-[#5C5B56]">
              Saved Automatically on This Device
            </p>
            <h2
              id="checklist-heading"
              className="mt-1 font-editorial text-3xl font-medium text-[#161614]"
            >
              Pre-travel border &amp; document checklist
            </h2>
          </div>
          <span
            data-testid="checklist-progress"
            className="font-mono-data text-xs font-semibold text-[#1E3F31]"
          >
            {completedChecklistCount} / {PRE_TRAVEL_CHECKLIST.length} Ready
          </span>
        </div>

        <ul className="mt-5 divide-y divide-[#E6E3DC]">
          {PRE_TRAVEL_CHECKLIST.map((item) => {
            const done = Boolean(permitChecklist[item.id]);
            return (
              <li key={item.id} className="py-3.5">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={done}
                  onClick={() => toggleChecklistItem(item.id)}
                  className="flex w-full items-start gap-3.5 text-left"
                >
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      done
                        ? 'border-[#1E3F31] bg-[#1E3F31] text-[#FAF9F6]'
                        : 'border-[#C8C3B8] bg-[#FAF9F6]'
                    }`}
                  >
                    {done && <Check className="h-3.5 w-3.5" strokeWidth={2.2} />}
                  </span>
                  <div>
                    <span
                      className={`block text-sm font-semibold ${
                        done
                          ? 'text-[#706E67] line-through'
                          : 'text-[#161614]'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-[#5C5B56]">
                      {item.detail}
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
};
