import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { STATES, STATE_IMAGES } from '../../data/states';
import { DestinationCategory, StateId } from '../../types/travel';
import { BudgetTierFilter } from '../../utils/filters';
import { useTravel } from '../../context/TravelContext';
import { EditorialImage } from '../shared/EditorialImage';

type TravelStyleChoice = 'all' | 'backpacker' | 'cultural' | 'slow-nature' | 'adventure';
type BudgetCapChoice = 'all' | 'under-8k' | '8k-18k' | '18k-plus';

export const HeroSearch: React.FC = () => {
  const { navigateToExploreWith } = useTravel();
  const [selectedState, setSelectedState] = useState<StateId | 'all'>('all');
  const [travelStyle, setTravelStyle] = useState<TravelStyleChoice>('all');
  const [budgetCap, setBudgetCap] = useState<BudgetCapChoice>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let category: DestinationCategory | 'all' = 'all';
    let hiddenGemOnly = false;
    let budgetTier: BudgetTierFilter = 'all';

    if (travelStyle === 'cultural') category = 'Heritage';
    if (travelStyle === 'adventure') category = 'Trekking';
    if (travelStyle === 'slow-nature') hiddenGemOnly = true;
    if (travelStyle === 'backpacker') budgetTier = 'budget';

    if (budgetCap === 'under-8k') budgetTier = 'budget';
    if (budgetCap === '8k-18k') budgetTier = 'mid';
    if (budgetCap === '18k-plus') budgetTier = 'comfort';

    navigateToExploreWith({
      state: selectedState,
      category,
      hiddenGemOnly,
      budgetTier,
    });
  };

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-8 pb-16 md:px-12 md:pt-12 md:pb-24">
      {/* Framed Editorial Landscape Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#141C18]">
        <div className="relative h-[460px] w-full sm:h-[520px] lg:h-[560px]">
          <EditorialImage
            src={STATE_IMAGES.hero}
            alt="Misty emerald mountain ridges and terraced hills of North East India at dawn"
            fallbackLabel="North East India"
            loading="eager"
            className="h-full w-full object-cover object-center"
          />
          {/* Measured editorial gradient scrim strictly behind lower/left text */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#141C18]/90 via-[#141C18]/45 to-[#141C18]/15"
          />

          <div className="animate-editorial-fade-up absolute inset-x-0 bottom-0 p-6 pb-14 sm:p-10 sm:pb-16 lg:p-14 lg:pb-16">
            <p className="font-mono-data text-xs tracking-wide text-[#DCE6E0]">
              Assam · Meghalaya · Arunachal · Nagaland · Manipur · Mizoram · Tripura · Sikkim
            </p>
            <h1 className="mt-3 max-w-3xl font-editorial text-4xl font-normal leading-[1.06] text-[#FAF9F6] sm:text-5xl lg:text-6xl">
              North East India,{' '}
              <em className="italic font-normal text-[#DCE6E0]">
                thoughtfully mapped.
              </em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#E6E3DC] sm:text-base">
              Discover the Eight Sisters with honest shared Sumo routes, realistic
              INR trip budgets, and verified Inner Line Permit guidance.
            </p>
          </div>
        </div>
      </div>

      {/* Minimalist Floating Command Bar directly anchored beneath hero */}
      <form
        onSubmit={handleSubmit}
        aria-label="Filter destinations by state, travel style, and budget"
        className="relative z-10 mx-auto -mt-8 max-w-5xl rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-4 shadow-sm sm:p-5"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="hero-state-select"
              className="text-xs font-medium text-[#5C5B56]"
            >
              State or Region
            </label>
            <select
              id="hero-state-select"
              value={selectedState}
              onChange={(e) =>
                setSelectedState(e.target.value as StateId | 'all')
              }
              className="h-11 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3.5 text-sm font-medium text-[#161614] transition-colors hover:border-[#1E3F31]"
            >
              <option value="all">All 8 States</option>
              {STATES.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="hero-style-select"
              className="text-xs font-medium text-[#5C5B56]"
            >
              Travel Style
            </label>
            <select
              id="hero-style-select"
              value={travelStyle}
              onChange={(e) =>
                setTravelStyle(e.target.value as TravelStyleChoice)
              }
              className="h-11 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3.5 text-sm font-medium text-[#161614] transition-colors hover:border-[#1E3F31]"
            >
              <option value="all">Any Travel Style</option>
              <option value="backpacker">Backpacker &amp; Shared Transit</option>
              <option value="cultural">Cultural &amp; Living Heritage</option>
              <option value="slow-nature">Slow Nature &amp; Hidden Gems</option>
              <option value="adventure">Adventure &amp; Trekking</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="hero-budget-select"
              className="text-xs font-medium text-[#5C5B56]"
            >
              Trip Budget Cap
            </label>
            <select
              id="hero-budget-select"
              value={budgetCap}
              onChange={(e) =>
                setBudgetCap(e.target.value as BudgetCapChoice)
              }
              className="h-11 rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-3.5 text-sm font-medium text-[#161614] transition-colors hover:border-[#1E3F31]"
            >
              <option value="all">Flexible Budget</option>
              <option value="under-8k">Under ₹8,000 (Budget)</option>
              <option value="8k-18k">₹8,000 – ₹18,000 (Balanced)</option>
              <option value="18k-plus">₹18,000+ (Comfort)</option>
            </select>
          </div>

          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1E3F31] px-6 text-sm font-semibold text-[#FAF9F6] transition-colors duration-150 hover:bg-[#152E24] whitespace-nowrap"
          >
            <span>Start Exploring</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </form>
    </section>
  );
};
