import React, { useMemo } from 'react';
import { useTravel } from '../context/TravelContext';
import {
  calculateTripBudget,
  generateItinerary,
  getItineraryPermitAlerts,
} from '../utils/planner';
import { TripControls } from '../components/planner/TripControls';
import { BudgetBreakdown } from '../components/planner/BudgetBreakdown';
import { ItineraryTimeline } from '../components/planner/ItineraryTimeline';

export const PlannerPage: React.FC = () => {
  const { planner, setPlanner, removeDestinationFromPlanner } = useTravel();

  const budget = useMemo(() => calculateTripBudget(planner), [planner]);
  const schedule = useMemo(() => generateItinerary(planner), [planner]);
  const permitAlerts = useMemo(
    () => getItineraryPermitAlerts(planner.destinationIds),
    [planner.destinationIds]
  );

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16">
      {/* Print-Only Masthead */}
      <div className="print-only mb-8 hidden border-b border-[#161614] pb-4">
        <p className="font-mono-data text-xs">
          TRAVELMATENE · PERSONALIZED FIELD BRIEF
        </p>
        <h1 className="mt-1 font-editorial text-3xl font-medium">
          North East India Itinerary ({planner.days} Days · {planner.startingHub})
        </h1>
      </div>

      {/* Screen Header */}
      <div className="no-print max-w-2xl">
        <p className="font-mono-data text-xs text-[#5C5B56]">
          Interactive Budget &amp; Route Engine
        </p>
        <h1 className="mt-2 font-editorial text-4xl font-medium text-[#161614] sm:text-5xl">
          Plan your{' '}
          <em className="italic font-normal text-[#1E3F31]">realistic</em>{' '}
          Northeast budget
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#5C5B56] sm:text-base">
          Compare shared Sumo economics against private cabs, split rooms by
          group size, check automatic ILP fees, and export a clean printable
          travel brief.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Sidebar: Trip Configuration */}
        <div className="lg:col-span-5 xl:col-span-4">
          <TripControls planner={planner} onChange={setPlanner} />
        </div>

        {/* Right Workspace: Live Budget + Day-by-Day Timeline */}
        <div className="space-y-8 lg:col-span-7 xl:col-span-8">
          <BudgetBreakdown
            planner={planner}
            budget={budget}
            schedule={schedule}
            permitAlerts={permitAlerts}
          />
          <ItineraryTimeline
            schedule={schedule}
            selectedDestinationIds={planner.destinationIds}
            onRemoveDestination={removeDestinationFromPlanner}
          />
        </div>
      </div>
    </div>
  );
};
