import { Destination, DestinationCategory, StateId } from '../types/travel';

export type PermitFilter = 'all' | 'none' | 'required';
export type BudgetTierFilter = 'all' | 'budget' | 'mid' | 'comfort';
export type SortOption = 'recommended' | 'lowest-cost' | 'shortest-hub-time';

export interface ExploreFilters {
  state: StateId | 'all';
  category: DestinationCategory | 'all';
  permit: PermitFilter;
  budgetTier: BudgetTierFilter;
  hiddenGemOnly: boolean;
  searchQuery: string;
  sortBy: SortOption;
}

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  state: 'all',
  category: 'all',
  permit: 'all',
  budgetTier: 'all',
  hiddenGemOnly: false,
  searchQuery: '',
  sortBy: 'recommended',
};

export function filterAndSortDestinations(
  destinations: Destination[],
  filters: ExploreFilters
): Destination[] {
  const query = filters.searchQuery.trim().toLowerCase();

  const filtered = destinations.filter((dest) => {
    if (filters.state !== 'all' && dest.stateId !== filters.state) {
      return false;
    }

    if (
      filters.category !== 'all' &&
      !dest.categories.includes(filters.category)
    ) {
      return false;
    }

    if (filters.permit === 'none' && dest.permitType !== 'None') {
      return false;
    }

    if (filters.permit === 'required' && dest.permitType === 'None') {
      return false;
    }

    if (filters.hiddenGemOnly && !dest.isHiddenGem) {
      return false;
    }

    if (filters.budgetTier !== 'all') {
      const refDaily = dest.dailyBudgetINR.backpacker;
      const midDaily = dest.dailyBudgetINR.balanced;
      if (filters.budgetTier === 'budget' && refDaily >= 1500) {
        return false;
      }
      if (
        filters.budgetTier === 'mid' &&
        (midDaily < 1500 || midDaily > 3500)
      ) {
        return false;
      }
      if (filters.budgetTier === 'comfort' && dest.dailyBudgetINR.comfort < 3500) {
        return false;
      }
    }

    if (query) {
      const haystack = `${dest.name} ${dest.stateName} ${dest.regionLabel} ${dest.tagline} ${dest.categories.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    return true;
  });

  if (filters.sortBy === 'lowest-cost') {
    return [...filtered].sort(
      (a, b) => a.dailyBudgetINR.backpacker - b.dailyBudgetINR.backpacker
    );
  }

  if (filters.sortBy === 'shortest-hub-time') {
    return [...filtered].sort((a, b) => a.hubTravelHours - b.hubTravelHours);
  }

  return filtered;
}
