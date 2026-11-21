import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HeroSearch } from '../components/home/HeroSearch';
import { InteractiveNEMap } from '../components/home/InteractiveNEMap';
import { CuratedCollections } from '../components/home/CuratedCollections';
import { useTravel } from '../context/TravelContext';
import { STARTER_CIRCUITS } from '../data/circuits';

const PILLARS = [
  {
    index: '01',
    title: 'Transparent Local Transit',
    body: 'Real shared Sumo counters, ASTC and SNT state bus timings, railheads, and mountain driving durations decoded from Guwahati, Bagdogra, Dimapur, Imphal, Agartala, and Sairang.',
    cta: 'Open Transit Guide',
    path: '/transit',
  },
  {
    index: '02',
    title: 'Real-Time INR Budget Planning',
    body: 'Accurate group-size math that splits rooms per pair and private SUVs across four travelers, while keeping shared Sumos, meals, and state permits scaled per person.',
    cta: 'Launch Trip Planner',
    path: '/planner',
  },
  {
    index: '03',
    title: 'Verified ILP & Permit Guidance',
    body: 'Instant clarity on Inner Line Permits, Sikkim border-zone PAP rules, official government portals, fees, and physical checkpost requirements for Indian and foreign travelers.',
    cta: 'Check Permit Rules',
    path: '/permits',
  },
];

export const HomePage: React.FC = () => {
  const { navigate, setPlanner } = useTravel();

  return (
    <div>
      <HeroSearch />
      <InteractiveNEMap />
      <CuratedCollections />

      {/* Value Pillar Strip */}
      <section
        aria-labelledby="pillars-heading"
        className="border-t border-[#E6E3DC] bg-[#FFFFFF] py-20 md:py-24"
      >
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <p className="font-mono-data text-xs text-[#5C5B56]">
            03. Why TravelMateNE
          </p>
          <h2
            id="pillars-heading"
            className="mt-2 max-w-2xl font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
          >
            Built to remove the three frictions of independent Northeast travel
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 border-t border-[#E6E3DC] pt-10 md:grid-cols-3 md:gap-10">
            {PILLARS.map((pillar) => (
              <div key={pillar.index} className="flex flex-col justify-between">
                <div>
                  <span className="font-mono-data text-xs text-[#C25E3A]">
                    {pillar.index}
                  </span>
                  <h3 className="mt-2 font-editorial text-2xl font-medium text-[#161614]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5B56]">
                    {pillar.body}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(pillar.path)}
                  className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-[#1E3F31] hover:underline"
                >
                  <span>{pillar.cta}</span>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Starter Circuits Preview Band */}
      <section className="border-t border-[#E6E3DC] bg-[#FAF9F6] py-20 md:py-24">
        <div className="mx-auto max-w-[1280px] px-6 md:px-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono-data text-xs text-[#5C5B56]">
                04. Ready-to-Adapt Blueprints
              </p>
              <h2 className="mt-2 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl">
                Load a proven circuit into the budget planner
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('/planner')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3F31] hover:underline whitespace-nowrap self-start md:self-auto"
            >
              <span>Build from scratch</span>
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {STARTER_CIRCUITS.slice(0, 4).map((circuit) => (
              <button
                key={circuit.id}
                type="button"
                onClick={() => {
                  setPlanner({
                    startingHub: circuit.startingHub,
                    destinationIds: circuit.destinationIds,
                    days: circuit.days,
                    groupSize: 2,
                    tier: circuit.recommendedTier,
                    transportMode: 'shared',
                  });
                  navigate('/planner');
                }}
                className="group flex flex-col justify-between rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 text-left transition-colors hover:border-[#1E3F31]"
              >
                <div>
                  <p className="font-mono-data text-[11px] text-[#5C5B56]">
                    {circuit.startingHub} · {circuit.days} Days
                  </p>
                  <h3 className="mt-2 font-editorial text-2xl font-medium text-[#161614] group-hover:text-[#1E3F31]">
                    {circuit.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium text-[#1E3F31]">
                    {circuit.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[#5C5B56]">
                    {circuit.highlightNote}
                  </p>
                </div>

                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#161614] group-hover:text-[#1E3F31]">
                  <span>Estimate budget</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
