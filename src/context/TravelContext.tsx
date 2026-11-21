import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  HubId,
  SavedItinerary,
  StateId,
  TransportPreference,
  TravelTier,
} from '../types/travel';
import {
  DEFAULT_EXPLORE_FILTERS,
  ExploreFilters,
} from '../utils/filters';
import { calculateTripBudget } from '../utils/planner';
import { DESTINATIONS } from '../data/destinations';

export interface PlannerState {
  startingHub: HubId;
  destinationIds: string[];
  days: number;
  groupSize: number;
  tier: TravelTier;
  transportMode: TransportPreference;
}

const DEFAULT_PLANNER_STATE: PlannerState = {
  startingHub: 'Guwahati (GAU)',
  destinationIds: ['nongriat-sohra', 'mawlynnong-dawki'],
  days: 5,
  groupSize: 2,
  tier: 'balanced',
  transportMode: 'shared',
};

const STORAGE_KEYS = {
  savedPlaces: 'travelmatene_saved_places_v1',
  savedItineraries: 'travelmatene_saved_itineraries_v1',
  plannerState: 'travelmatene_planner_state_v1',
  permitChecklist: 'travelmatene_permit_checklist_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

interface TravelContextValue {
  pathname: string;
  navigate: (to: string) => void;
  exploreFilters: ExploreFilters;
  setExploreFilters: React.Dispatch<React.SetStateAction<ExploreFilters>>;
  navigateToExploreWith: (preset: Partial<ExploreFilters>) => void;
  savedPlaceIds: string[];
  toggleSavedPlace: (id: string) => void;
  isPlaceSaved: (id: string) => boolean;
  savedItineraries: SavedItinerary[];
  saveCurrentItinerary: (customName?: string) => SavedItinerary;
  deleteSavedItinerary: (id: string) => void;
  loadSavedItinerary: (itinerary: SavedItinerary) => void;
  planner: PlannerState;
  setPlanner: React.Dispatch<React.SetStateAction<PlannerState>>;
  addDestinationToPlanner: (id: string, openPlanner?: boolean) => void;
  removeDestinationFromPlanner: (id: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  permitChecklist: Record<string, boolean>;
  toggleChecklistItem: (id: string) => void;
  preselectedPermitStates: StateId[];
  navigateToPermitsForStates: (states: StateId[]) => void;
}

const TravelContext = createContext<TravelContextValue | null>(null);

export const TravelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );

  const [exploreFilters, setExploreFilters] = useState<ExploreFilters>(
    DEFAULT_EXPLORE_FILTERS
  );

  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.savedPlaces, [])
  );

  const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>(
    () => readStorage<SavedItinerary[]>(STORAGE_KEYS.savedItineraries, [])
  );

  const [planner, setPlanner] = useState<PlannerState>(() =>
    readStorage<PlannerState>(STORAGE_KEYS.plannerState, DEFAULT_PLANNER_STATE)
  );

  const [permitChecklist, setPermitChecklist] = useState<
    Record<string, boolean>
  >(() => readStorage<Record<string, boolean>>(STORAGE_KEYS.permitChecklist, {}));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [preselectedPermitStates, setPreselectedPermitStates] = useState<
    StateId[]
  >(['arunachal', 'nagaland', 'sikkim']);

  useEffect(() => {
    const onPopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.savedPlaces,
        JSON.stringify(savedPlaceIds)
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [savedPlaceIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.savedItineraries,
        JSON.stringify(savedItineraries)
      );
    } catch {
      // Ignore
    }
  }, [savedItineraries]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.plannerState,
        JSON.stringify(planner)
      );
    } catch {
      // Ignore
    }
  }, [planner]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.permitChecklist,
        JSON.stringify(permitChecklist)
      );
    } catch {
      // Ignore
    }
  }, [permitChecklist]);

  const navigate = useCallback((to: string) => {
    if (window.location.pathname !== to) {
      window.history.pushState({}, '', to);
    }
    setPathname(to);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const navigateToExploreWith = useCallback(
    (preset: Partial<ExploreFilters>) => {
      setExploreFilters({
        ...DEFAULT_EXPLORE_FILTERS,
        ...preset,
      });
      navigate('/explore');
    },
    [navigate]
  );

  const toggleSavedPlace = useCallback((id: string) => {
    setSavedPlaceIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [id, ...prev]
    );
  }, []);

  const isPlaceSaved = useCallback(
    (id: string) => savedPlaceIds.includes(id),
    [savedPlaceIds]
  );

  const addDestinationToPlanner = useCallback(
    (id: string, openPlanner = false) => {
      setPlanner((prev) => {
        if (prev.destinationIds.includes(id)) return prev;
        const nextIds = [...prev.destinationIds, id].slice(-4);
        return { ...prev, destinationIds: nextIds };
      });
      if (openPlanner) {
        setDrawerOpen(false);
        navigate('/planner');
      }
    },
    [navigate]
  );

  const removeDestinationFromPlanner = useCallback((id: string) => {
    setPlanner((prev) => ({
      ...prev,
      destinationIds: prev.destinationIds.filter((item) => item !== id),
    }));
  }, []);

  const saveCurrentItinerary = useCallback(
    (customName?: string): SavedItinerary => {
      const budget = calculateTripBudget(planner);
      const destNames = planner.destinationIds
        .map((id) => DESTINATIONS.find((d) => d.id === id)?.name)
        .filter(Boolean)
        .slice(0, 2);

      const defaultTitle =
        destNames.length > 0
          ? `${planner.days}-Day ${destNames.join(' & ')}`
          : `${planner.days}-Day Northeast Journey`;

      const entry: SavedItinerary = {
        id: `trip_${Date.now()}`,
        name: (customName || '').trim() || defaultTitle,
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        startingHub: planner.startingHub,
        destinationIds: [...planner.destinationIds],
        days: planner.days,
        groupSize: planner.groupSize,
        tier: planner.tier,
        transportMode: planner.transportMode,
        totalINR: budget.totalINR,
        perPersonINR: budget.perPersonINR,
      };

      setSavedItineraries((prev) => [entry, ...prev]);
      return entry;
    },
    [planner]
  );

  const deleteSavedItinerary = useCallback((id: string) => {
    setSavedItineraries((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadSavedItinerary = useCallback(
    (itinerary: SavedItinerary) => {
      setPlanner({
        startingHub: itinerary.startingHub,
        destinationIds: itinerary.destinationIds,
        days: itinerary.days,
        groupSize: itinerary.groupSize,
        tier: itinerary.tier,
        transportMode: itinerary.transportMode,
      });
      setDrawerOpen(false);
      navigate('/planner');
    },
    [navigate]
  );

  const toggleChecklistItem = useCallback((id: string) => {
    setPermitChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const navigateToPermitsForStates = useCallback(
    (states: StateId[]) => {
      if (states.length > 0) {
        setPreselectedPermitStates(states);
      }
      navigate('/permits');
    },
    [navigate]
  );

  const value = useMemo<TravelContextValue>(
    () => ({
      pathname,
      navigate,
      exploreFilters,
      setExploreFilters,
      navigateToExploreWith,
      savedPlaceIds,
      toggleSavedPlace,
      isPlaceSaved,
      savedItineraries,
      saveCurrentItinerary,
      deleteSavedItinerary,
      loadSavedItinerary,
      planner,
      setPlanner,
      addDestinationToPlanner,
      removeDestinationFromPlanner,
      drawerOpen,
      setDrawerOpen,
      permitChecklist,
      toggleChecklistItem,
      preselectedPermitStates,
      navigateToPermitsForStates,
    }),
    [
      pathname,
      navigate,
      exploreFilters,
      navigateToExploreWith,
      savedPlaceIds,
      toggleSavedPlace,
      isPlaceSaved,
      savedItineraries,
      saveCurrentItinerary,
      deleteSavedItinerary,
      loadSavedItinerary,
      planner,
      addDestinationToPlanner,
      removeDestinationFromPlanner,
      drawerOpen,
      permitChecklist,
      toggleChecklistItem,
      preselectedPermitStates,
      navigateToPermitsForStates,
    ]
  );

  return (
    <TravelContext.Provider value={value}>{children}</TravelContext.Provider>
  );
};

export function useTravel(): TravelContextValue {
  const ctx = useContext(TravelContext);
  if (!ctx) {
    throw new Error('useTravel must be used inside TravelProvider');
  }
  return ctx;
}
