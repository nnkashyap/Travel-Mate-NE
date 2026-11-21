import { Destination } from '../types/travel';

export type SearchMatchReason = 'Name' | 'Region' | 'Activity';

export interface DestinationSearchMatch {
  destination: Destination;
  reason: SearchMatchReason;
  matchedLabel: string;
  score: number;
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function searchDestinations(
  destinations: Destination[],
  rawQuery: string,
  limit = 7
): DestinationSearchMatch[] {
  const query = normalizeSearchText(rawQuery);
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean);
  const results: DestinationSearchMatch[] = [];

  for (const dest of destinations) {
    const nameNorm = normalizeSearchText(dest.name);
    const slugNorm = normalizeSearchText(dest.slug.replace(/-/g, ' '));
    const stateNorm = normalizeSearchText(dest.stateName);
    const regionNorm = normalizeSearchText(dest.regionLabel);
    const hubNorm = normalizeSearchText(dest.nearestHub);
    const categoryNorms = dest.categories.map((cat) => ({
      raw: cat,
      norm: normalizeSearchText(cat),
    }));
    const highlightsNorm = dest.highlights.map((h) => ({
      raw: h,
      norm: normalizeSearchText(h),
    }));
    const activitiesText = normalizeSearchText(
      dest.dayActivities
        .map((d) => `${d.morning} ${d.afternoon} ${d.evening}`)
        .join(' ')
    );
    const taglineNorm = normalizeSearchText(dest.tagline);
    const descriptionNorm = normalizeSearchText(dest.description);

    const combined = [
      nameNorm,
      slugNorm,
      stateNorm,
      regionNorm,
      hubNorm,
      categoryNorms.map((c) => c.norm).join(' '),
      highlightsNorm.map((h) => h.norm).join(' '),
      activitiesText,
      taglineNorm,
      descriptionNorm,
    ].join(' ');

    // Every token must match somewhere in the destination profile
    if (!tokens.every((token) => combined.includes(token))) {
      continue;
    }

    let score = 0;
    let reason: SearchMatchReason = 'Activity';
    let matchedLabel: string = dest.categories[0] ?? 'Activity';

    // 1. Name matches (highest priority)
    if (nameNorm === query) {
      score = 120;
      reason = 'Name';
      matchedLabel = dest.name;
    } else if (nameNorm.startsWith(query)) {
      score = 105;
      reason = 'Name';
      matchedLabel = dest.name;
    } else if (nameNorm.includes(query) || slugNorm.includes(query)) {
      score = 92;
      reason = 'Name';
      matchedLabel = dest.name;
    } else if (
      tokens.length > 1 &&
      tokens.some((t) => nameNorm.includes(t))
    ) {
      score = 84;
      reason = 'Name';
      matchedLabel = dest.name;
    }

    // 2. Region / State matches
    if (score === 0) {
      if (stateNorm === query || stateNorm.startsWith(query)) {
        score = 78;
        reason = 'Region';
        matchedLabel = dest.stateName;
      } else if (stateNorm.includes(query)) {
        score = 72;
        reason = 'Region';
        matchedLabel = dest.stateName;
      } else if (regionNorm.includes(query)) {
        score = 68;
        reason = 'Region';
        matchedLabel = dest.regionLabel;
      } else if (hubNorm.includes(query)) {
        score = 62;
        reason = 'Region';
        matchedLabel = `Via ${dest.nearestHub}`;
      }
    }

    // 3. Activity type / Category / Experience matches
    if (score === 0) {
      const exactCat = categoryNorms.find(
        (c) => c.norm === query || c.norm.startsWith(query) || c.norm.includes(query)
      );
      if (exactCat) {
        score = 66;
        reason = 'Activity';
        matchedLabel = exactCat.raw;
      } else {
        const matchedTokenCat = categoryNorms.find((c) =>
          tokens.some((t) => c.norm.includes(t))
        );
        if (matchedTokenCat) {
          score = 58;
          reason = 'Activity';
          matchedLabel = matchedTokenCat.raw;
        } else {
          const matchedHighlight = highlightsNorm.find((h) =>
            tokens.some((t) => h.norm.includes(t))
          );
          if (matchedHighlight) {
            score = 50;
            reason = 'Activity';
            matchedLabel = matchedHighlight.raw;
          } else if (
            taglineNorm.includes(query) ||
            tokens.some((t) => taglineNorm.includes(t))
          ) {
            score = 45;
            reason = 'Activity';
            matchedLabel = dest.tagline;
          } else {
            score = 40;
            reason = 'Activity';
            matchedLabel = dest.categories.join(' · ');
          }
        }
      }
    }

    // Tie-breaker bonus for popular non-hidden-gem or shorter hub distance
    if (dest.isHiddenGem) {
      score += 0.5;
    }

    results.push({
      destination: dest,
      reason,
      matchedLabel,
      score,
    });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.destination.name.localeCompare(b.destination.name);
  });

  return limit > 0 ? results.slice(0, limit) : results;
}
