import React, { useMemo, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import {
  CULTURAL_SITES_AND_CRAFTS,
  FESTIVALS,
  MONTHS,
  REGIONAL_DISHES,
  RESPONSIBLE_TRAVEL_CHARTER,
} from '../../data/festivals';
import { STATES, STATE_IMAGES } from '../../data/states';
import { CulturalSiteItem, StateId } from '../../types/travel';
import { useTravel } from '../../context/TravelContext';
import { EditorialImage } from '../shared/EditorialImage';

type DietaryFilter = 'all' | 'Veg-Friendly' | 'Non-Veg';
type HeritageCategory = 'all' | CulturalSiteItem['category'];

const HERITAGE_CATEGORIES: HeritageCategory[] = [
  'all',
  'UNESCO & Monument',
  'Living Craft',
  'Iconic Market',
  'Sacred Ecology',
];

export const FestivalCalendar: React.FC = () => {
  const { navigateToExploreWith } = useTravel();
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedCuisineState, setSelectedCuisineState] = useState<
    StateId | 'all'
  >('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [heritageCategory, setHeritageCategory] =
    useState<HeritageCategory>('all');

  const filteredFestivals = useMemo(() => {
    if (selectedMonth === 'all') return FESTIVALS;
    return FESTIVALS.filter((f) => {
      if (f.monthIndices && f.monthIndices.length > 0) {
        return f.monthIndices.includes(selectedMonth);
      }
      return f.monthIndex === selectedMonth;
    });
  }, [selectedMonth]);

  const filteredDishes = useMemo(() => {
    return REGIONAL_DISHES.filter((dish) => {
      if (
        selectedCuisineState !== 'all' &&
        dish.stateId !== selectedCuisineState
      ) {
        return false;
      }
      if (dietaryFilter !== 'all' && dish.dietary !== dietaryFilter) {
        return false;
      }
      return true;
    });
  }, [selectedCuisineState, dietaryFilter]);

  const filteredCulturalSites = useMemo(() => {
    if (heritageCategory === 'all') return CULTURAL_SITES_AND_CRAFTS;
    return CULTURAL_SITES_AND_CRAFTS.filter(
      (item) => item.category === heritageCategory
    );
  }, [heritageCategory]);

  return (
    <div className="space-y-20">
      {/* Section 1: Seasonal Festival Timeline */}
      <section aria-labelledby="festivals-heading">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono-data text-xs text-[#5C5B56]">
              01. Seasonal Calendar
            </p>
            <h2
              id="festivals-heading"
              className="mt-1 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
            >
              Gatherings, harvest dances &amp; valley music
            </h2>
          </div>
          <p className="font-mono-data text-xs text-[#5C5B56]">
            {filteredFestivals.length}{' '}
            {filteredFestivals.length === 1 ? 'festival' : 'festivals'} listed
          </p>
        </div>

        {/* Month Filter Bar */}
        <div
          role="group"
          aria-label="Filter festivals by month"
          className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
        >
          <button
            type="button"
            aria-pressed={selectedMonth === 'all'}
            onClick={() => setSelectedMonth('all')}
            className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              selectedMonth === 'all'
                ? 'bg-[#1E3F31] text-[#FAF9F6]'
                : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
            }`}
          >
            All Year ({FESTIVALS.length})
          </button>
          {MONTHS.map((label, index) => {
            const active = selectedMonth === index;
            return (
              <button
                key={label}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedMonth(index)}
                className={`rounded-lg px-3.5 py-2 font-mono-data text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#1E3F31] text-[#FAF9F6]'
                    : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Festival Cards */}
        <div
          data-testid="festival-list"
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {filteredFestivals.map((fest) => (
            <article
              key={fest.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] sm:flex-row"
            >
              <div className="aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-44">
                <EditorialImage
                  src={fest.imageUrl}
                  alt={`${fest.name} in ${fest.stateName}`}
                  fallbackLabel={fest.stateName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="font-mono-data text-[11px] text-[#C25E3A]">
                    {fest.monthLabel} · {fest.stateName}
                  </p>
                  <h3 className="mt-1 font-editorial text-2xl font-medium text-[#161614]">
                    {fest.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[#5C5B56]">
                    {fest.location} · {fest.typicalDates}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#5C5B56]">
                    {fest.significance}
                  </p>
                </div>

                <div className="mt-4 space-y-1.5 border-t border-[#E6E3DC] pt-3 text-xs">
                  <p className="text-[#161614]">
                    <strong className="font-semibold">Booking Lead:</strong>{' '}
                    {fest.bookingLeadTime}
                  </p>
                  <p className="text-[#5C5B56]">{fest.permitNote}</p>
                  <button
                    type="button"
                    onClick={() =>
                      navigateToExploreWith({ state: fest.stateId })
                    }
                    className="mt-1 inline-flex items-center gap-1 font-semibold text-[#1E3F31] hover:underline"
                  >
                    <span>Explore {fest.stateName}</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Regional Culinary Guide */}
      <section
        aria-labelledby="cuisine-heading"
        className="border-t border-[#E6E3DC] pt-16"
      >
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-mono-data text-xs text-[#5C5B56]">
              02. Regional Culinary Guide
            </p>
            <h2
              id="cuisine-heading"
              className="mt-1 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
            >
              Eight kitchens defined by smoke, herbs &amp; bamboo
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5C5B56]">
              Unlike heavy oil-rich gravies elsewhere, North East Indian tables
              rely on wood-smoke curing, wild foraged greens, fermented
              soybeans, citrus peels, and zero-oil steamed broths served with
              aromatic Joha, red, or purple Chak-Hao rice.
            </p>
            <p className="mt-4 font-mono-data text-xs text-[#1E3F31]">
              {filteredDishes.length} of {REGIONAL_DISHES.length} signature
              dishes shown · Vegetarian &amp; heirloom hearth options across all
              8 states
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[#E6E3DC] lg:col-span-6">
            <div className="aspect-[16/9] w-full overflow-hidden">
              <EditorialImage
                src={STATE_IMAGES.cuisine}
                alt="Traditional North East Indian banana-leaf culinary spread with red rice, river fish curry, bamboo shoots, fiddlehead ferns, and tea"
                fallbackLabel="North East Cuisine"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Cuisine Filters: State + Dietary */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-y border-[#E6E3DC] py-4 md:flex-row md:items-center">
          <div
            role="group"
            aria-label="Filter dishes by state"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar"
          >
            <button
              type="button"
              aria-pressed={selectedCuisineState === 'all'}
              onClick={() => setSelectedCuisineState('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCuisineState === 'all'
                  ? 'bg-[#1E3F31] text-[#FAF9F6]'
                  : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
              }`}
            >
              All 8 States
            </button>
            {STATES.map((st) => (
              <button
                key={st.id}
                type="button"
                aria-pressed={selectedCuisineState === st.id}
                onClick={() => setSelectedCuisineState(st.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCuisineState === st.id
                    ? 'bg-[#1E3F31] text-[#FAF9F6]'
                    : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
                }`}
              >
                {st.name}
              </button>
            ))}
          </div>

          <div
            role="group"
            aria-label="Filter dishes by dietary preference"
            className="flex items-center gap-1.5 shrink-0"
          >
            {(['all', 'Veg-Friendly', 'Non-Veg'] as DietaryFilter[]).map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={dietaryFilter === option}
                  onClick={() => setDietaryFilter(option)}
                  className={`rounded-lg border px-3 py-1.5 font-mono-data text-[11px] font-medium transition-colors whitespace-nowrap ${
                    dietaryFilter === option
                      ? 'border-[#1E3F31] bg-[#DCE6E0] text-[#141C18]'
                      : 'border-[#E6E3DC] bg-[#FFFFFF] text-[#5C5B56] hover:border-[#1E3F31]'
                  }`}
                >
                  {option === 'all' ? 'All Dishes' : option}
                </button>
              )
            )}
          </div>
        </div>

        <div
          data-testid="cuisine-grid"
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filteredDishes.map((dish) => (
            <article
              key={dish.id}
              className="flex flex-col justify-between rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-2 font-mono-data text-[11px]">
                  <span className="text-[#5C5B56]">{dish.stateName}</span>
                  <span
                    className={
                      dish.dietary === 'Veg-Friendly'
                        ? 'text-[#2D6A4F]'
                        : 'text-[#C25E3A]'
                    }
                  >
                    {dish.dietary}
                  </span>
                </div>
                <h3 className="mt-1.5 font-editorial text-2xl font-medium leading-snug text-[#161614]">
                  {dish.name}
                </h3>
                <p className="mt-1 text-xs font-medium text-[#1E3F31]">
                  {dish.flavorProfile}
                </p>
                <p className="mt-2.5 text-sm leading-relaxed text-[#5C5B56]">
                  {dish.description}
                </p>
              </div>

              <div className="mt-4 space-y-1 border-t border-[#E6E3DC] pt-3 text-xs">
                <p className="flex items-start gap-1.5 text-[#5C5B56]">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1E3F31]"
                    strokeWidth={1.6}
                  />
                  <span>{dish.whereToFind}</span>
                </p>
                <p className="font-mono-data text-[11px] font-medium text-[#161614]">
                  Typical plate: {dish.avgPriceRange}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 3: Living Crafts, Heritage Sites & Iconic Markets */}
      <section
        aria-labelledby="heritage-crafts-heading"
        className="border-t border-[#E6E3DC] pt-16"
      >
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono-data text-xs text-[#5C5B56]">
              03. Living Heritage, Crafts &amp; Iconic Markets
            </p>
            <h2
              id="heritage-crafts-heading"
              className="mt-1 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
            >
              Handlooms, UNESCO monuments &amp; community sanctuaries
            </h2>
          </div>
          <p className="font-mono-data text-xs text-[#5C5B56]">
            {filteredCulturalSites.length} curated cultural landmarks
          </p>
        </div>

        <div
          role="group"
          aria-label="Filter cultural landmarks by discipline"
          className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
        >
          {HERITAGE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={heritageCategory === category}
              onClick={() => setHeritageCategory(category)}
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                heritageCategory === category
                  ? 'bg-[#1E3F31] text-[#FAF9F6]'
                  : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
              }`}
            >
              {category === 'all' ? 'All Landmarks' : category}
            </button>
          ))}
        </div>

        <div
          data-testid="cultural-sites-grid"
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {filteredCulturalSites.map((site) => (
            <article
              key={site.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] sm:flex-row"
            >
              <div className="aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-44">
                <EditorialImage
                  src={site.imageUrl}
                  alt={`${site.name} in ${site.stateName}`}
                  fallbackLabel={site.stateName}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="font-mono-data text-[11px] text-[#1E3F31]">
                    {site.category} · {site.stateName}
                  </p>
                  <h3 className="mt-1 font-editorial text-2xl font-medium text-[#161614]">
                    {site.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-[#5C5B56]">
                    {site.location}
                  </p>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#5C5B56]">
                    {site.summary}
                  </p>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#E6E3DC] pt-3 text-xs">
                  <p className="text-[#161614]">
                    <strong className="font-semibold">Field Note:</strong>{' '}
                    {site.visitorNote}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      navigateToExploreWith({ state: site.stateId })
                    }
                    className="inline-flex items-center gap-1 font-semibold text-[#1E3F31] hover:underline"
                  >
                    <span>Explore {site.stateName} guides</span>
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 4: Responsible Travel Charter */}
      <section
        aria-labelledby="charter-heading"
        className="rounded-2xl border border-[#E6E3DC] bg-[#141C18] p-7 text-[#FAF9F6] md:p-10"
      >
        <p className="font-mono-data text-xs text-[#DCE6E0]">
          04. Responsible Travel Charter
        </p>
        <h2
          id="charter-heading"
          className="mt-2 max-w-2xl font-editorial text-3xl font-medium text-[#FAF9F6] sm:text-4xl"
        >
          Leave mountain ecosystems &amp; indigenous communities stronger than
          you found them
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-6 border-t border-[#283830] pt-8 md:grid-cols-2">
          {RESPONSIBLE_TRAVEL_CHARTER.map((rule) => (
            <div key={rule.index}>
              <span className="font-mono-data text-xs text-[#C25E3A]">
                {rule.index}
              </span>
              <h3 className="mt-1 font-editorial text-2xl font-medium text-[#FAF9F6]">
                {rule.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C6C9C4]">
                {rule.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
