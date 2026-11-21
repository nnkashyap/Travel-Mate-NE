import React from 'react';
import { STATES } from '../../data/states';
import { useTravel } from '../../context/TravelContext';

export const Footer: React.FC = () => {
  const { navigate, navigateToExploreWith } = useTravel();

  return (
    <footer className="no-print border-t border-[#24322B] bg-[#141C18] text-[#FAF9F6]">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Editorial Colophon */}
          <div className="md:col-span-5">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="font-editorial text-3xl font-medium tracking-tight text-[#FAF9F6]"
            >
              TravelMateNE
            </a>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#C6C9C4]">
              Discover the Eight Sisters. Plan effortlessly. Travel deeper. Built for
              independent travelers navigating shared Sumo corridors, homestay networks,
              realistic INR budgets, and state permit gates across North East India.
            </p>
            <p className="mt-6 font-mono-data text-xs text-[#8E9690]">
              26.1445° N, 91.7362° E · Guwahati to Tawang, Aizawl &amp; Yumthang
            </p>
          </div>

          {/* Eight Sisters Links */}
          <div className="md:col-span-4">
            <h2 className="font-editorial text-xl font-medium text-[#FAF9F6]">
              The Eight Sisters
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[#C6C9C4]">
              {STATES.map((state) => (
                <li key={state.id}>
                  <button
                    type="button"
                    onClick={() => navigateToExploreWith({ state: state.id })}
                    className="text-left transition-colors hover:text-[#FAF9F6]"
                  >
                    {state.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Field Tools */}
          <div className="md:col-span-3">
            <h2 className="font-editorial text-xl font-medium text-[#FAF9F6]">
              Field Guides
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#C6C9C4]">
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Destination Directory
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/planner')}
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Budget &amp; Trip Planner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/transit')}
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Shared Sumo &amp; Hub Transit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/permits')}
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  ILP &amp; PAP Permit Navigator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigate('/culture')}
                  className="transition-colors hover:text-[#FAF9F6]"
                >
                  Festivals &amp; Regional Kitchens
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[#24322B] pt-8 text-xs text-[#8E9690] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} TravelMateNE. Independent North East India Field Guide.</p>
          <p>Always verify seasonal road &amp; permit notices prior to frontier crossings.</p>
        </div>
      </div>
    </footer>
  );
};
