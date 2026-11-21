import React, { useEffect, useState } from 'react';
import { ArrowRight, Bookmark, MapPin, Trash2, X } from 'lucide-react';
import { useTravel } from '../../context/TravelContext';
import { DESTINATIONS } from '../../data/destinations';
import { formatINR } from '../../utils/planner';
import { EditorialImage } from '../shared/EditorialImage';

export const SavedDrawer: React.FC = () => {
  const {
    drawerOpen,
    setDrawerOpen,
    savedPlaceIds,
    toggleSavedPlace,
    savedItineraries,
    deleteSavedItinerary,
    loadSavedItinerary,
    addDestinationToPlanner,
    navigate,
  } = useTravel();

  const [activeTab, setActiveTab] = useState<'places' | 'itineraries'>('places');

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, setDrawerOpen]);

  const savedPlaces = savedPlaceIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  if (!drawerOpen) return null;

  return (
    <div
      className="no-print fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Saved places and itineraries"
    >
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 bg-[#141C18]/45 backdrop-blur-xs transition-opacity"
      />

      <aside className="animate-drawer-slide-in relative z-10 flex h-full w-full max-w-md flex-col border-l border-[#E6E3DC] bg-[#FAF9F6]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E6E3DC] px-6 py-5">
              <div>
                <h2 className="font-editorial text-2xl font-medium text-[#161614]">
                  Field Notebook
                </h2>
                <p className="text-xs text-[#5C5B56]">
                  Saved locally on this device—no sign-in required.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close saved drawer"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] transition-colors hover:border-[#1E3F31]"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Segmented Tab Control */}
            <div className="border-b border-[#E6E3DC] px-6 py-3">
              <div
                role="tablist"
                aria-label="Saved categories"
                className="grid grid-cols-2 gap-1 rounded-xl bg-[#F2EFE9] p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'places'}
                  onClick={() => setActiveTab('places')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'places'
                      ? 'bg-[#FFFFFF] text-[#161614]'
                      : 'text-[#5C5B56] hover:text-[#161614]'
                  }`}
                >
                  Saved Places ({savedPlaces.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'itineraries'}
                  onClick={() => setActiveTab('itineraries')}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    activeTab === 'itineraries'
                      ? 'bg-[#FFFFFF] text-[#161614]'
                      : 'text-[#5C5B56] hover:text-[#161614]'
                  }`}
                >
                  Saved Itineraries ({savedItineraries.length})
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {activeTab === 'places' ? (
                savedPlaces.length === 0 ? (
                  <div className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 text-center">
                    <Bookmark
                      className="mx-auto h-6 w-6 text-[#8E8C84]"
                      strokeWidth={1.5}
                    />
                    <h3 className="mt-3 font-editorial text-xl text-[#161614]">
                      No saved places yet
                    </h3>
                    <p className="mt-2 text-sm text-[#5C5B56]">
                      Bookmark mountain valleys, villages, or river islands as you browse
                      and send them straight into your trip planner.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(false);
                        navigate('/explore');
                      }}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-4 py-2.5 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24]"
                    >
                      Explore Destinations
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-4">
                    {savedPlaces.map((place) => (
                      <li
                        key={place.id}
                        className="overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-3.5"
                      >
                        <div className="flex gap-3.5">
                          <button
                            type="button"
                            onClick={() => {
                              setDrawerOpen(false);
                              navigate(`/destination/${place.slug}`);
                            }}
                            className="h-20 w-24 shrink-0 overflow-hidden rounded-xl"
                          >
                            <EditorialImage
                              src={place.imageUrl}
                              alt={place.name}
                              fallbackLabel={place.stateName}
                              className="h-full w-full object-cover"
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            <p className="font-mono-data text-[11px] text-[#5C5B56]">
                              {place.stateName} · {place.elevationMeters.toLocaleString('en-IN')}m
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                setDrawerOpen(false);
                                navigate(`/destination/${place.slug}`);
                              }}
                              className="mt-0.5 block truncate text-left font-editorial text-lg font-medium text-[#161614] hover:text-[#1E3F31]"
                            >
                              {place.name}
                            </button>
                            <p className="mt-1 font-mono-data text-xs text-[#5C5B56]">
                              ~{formatINR(place.dailyBudgetINR.backpacker)}/day ·{' '}
                              {place.permitType === 'None'
                                ? 'No Permit'
                                : place.permitType}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#E6E3DC] pt-3">
                          <button
                            type="button"
                            onClick={() => addDestinationToPlanner(place.id, true)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F31] hover:underline"
                          >
                            <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Send to Trip Planner
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSavedPlace(place.id)}
                            aria-label={`Remove ${place.name} from saved places`}
                            className="inline-flex items-center gap-1 text-xs text-[#5C5B56] hover:text-[#C25E3A]"
                          >
                            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : savedItineraries.length === 0 ? (
                <div className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 text-center">
                  <h3 className="font-editorial text-xl text-[#161614]">
                    No saved itineraries yet
                  </h3>
                  <p className="mt-2 text-sm text-[#5C5B56]">
                    Configure your hub, group size, and destinations in the Trip Planner,
                    then save a snapshot to revisit or print later.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerOpen(false);
                      navigate('/planner');
                    }}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-4 py-2.5 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24]"
                  >
                    Open Trip Planner
                    <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {savedItineraries.map((trip) => (
                    <li
                      key={trip.id}
                      className="rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono-data text-[11px] text-[#5C5B56]">
                            {trip.createdAt} · {trip.startingHub}
                          </p>
                          <h3 className="mt-1 font-editorial text-xl font-medium text-[#161614]">
                            {trip.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteSavedItinerary(trip.id)}
                          aria-label={`Delete saved itinerary ${trip.name}`}
                          className="rounded-lg p-1.5 text-[#5C5B56] hover:bg-[#F2EFE9] hover:text-[#C25E3A]"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono-data text-xs text-[#5C5B56]">
                        <span>{trip.days} Days</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {trip.groupSize}{' '}
                          {trip.groupSize === 1 ? 'Traveler' : 'Travelers'}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{trip.tier}</span>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[#E6E3DC] pt-3">
                        <div className="font-mono-data text-sm font-medium text-[#161614]">
                          {formatINR(trip.perPersonINR)}
                          <span className="text-xs font-normal text-[#5C5B56]">
                            {' '}
                            / person
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => loadSavedItinerary(trip)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F31] hover:underline"
                        >
                          Open in Planner
                          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
      </aside>
    </div>
  );
};
