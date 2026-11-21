import {
  Destination,
  HubId,
  StateId,
  TransportPreference,
  TravelTier,
} from '../types/travel';
import { DESTINATIONS } from '../data/destinations';
import { PERMIT_RULES } from '../data/permits';

export interface TripPlanInput {
  startingHub: HubId;
  destinationIds: string[];
  days: number;
  groupSize: number;
  tier: TravelTier;
  transportMode: TransportPreference;
}

export interface BudgetBreakdownItems {
  transitINR: number;
  accommodationINR: number;
  foodINR: number;
  permitsINR: number;
  experiencesINR: number;
}

export interface TripBudgetResult {
  totalINR: number;
  perPersonINR: number;
  breakdown: BudgetBreakdownItems;
  roomsNeeded: number;
  vehiclesNeeded: number;
  savingsTip: string;
  alternativeModeDeltaINR: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  locationName: string;
  stateName: string;
  transitLeg: string | null;
  morning: string;
  afternoon: string;
  evening: string;
  estimatedPerPersonINR: number;
}

export interface PermitAlertItem {
  stateId: StateId;
  stateName: string;
  code: string;
  label: string;
  feeDisplay: string;
  portal: string;
}

export function formatINR(amount: number): string {
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

const TIER_NIGHTLY_ROOM_MULTIPLIER: Record<TravelTier, number> = {
  backpacker: 0.72,
  balanced: 1.0,
  comfort: 2.1,
};

const TIER_DAILY_FOOD_PER_PERSON: Record<TravelTier, number> = {
  backpacker: 450,
  balanced: 850,
  comfort: 1550,
};

const TIER_DAILY_EXPERIENCE_PER_PERSON: Record<TravelTier, number> = {
  backpacker: 280,
  balanced: 550,
  comfort: 1200,
};

const PRIVATE_CAB_DAILY_BASE_INR: Record<TravelTier, number> = {
  backpacker: 3800,
  balanced: 4400,
  comfort: 5600,
};

function getPerPersonPermitFee(dests: Destination[], days: number): number {
  const seenStates = new Set<StateId>();
  let fee = 0;

  for (const dest of dests) {
    if (dest.permitType === 'None') continue;
    if (seenStates.has(dest.stateId)) continue;
    seenStates.add(dest.stateId);

    if (dest.stateId === 'arunachal') {
      fee += days <= 3 ? 300 : 500;
    } else if (dest.stateId === 'nagaland') {
      fee += 200;
    } else if (dest.stateId === 'manipur') {
      fee += 100;
    } else if (dest.stateId === 'mizoram') {
      fee += 120;
    } else if (dest.stateId === 'sikkim' && dest.permitType === 'PAP-Zone') {
      fee += 350;
    }
  }

  return fee;
}

function resolveDestinations(destinationIds: string[]): Destination[] {
  return destinationIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is Destination => Boolean(d));
}

export function calculateTripBudget(input: TripPlanInput): TripBudgetResult {
  const selectedDests = resolveDestinations(input.destinationIds);
  const groupSize = Math.max(1, Math.min(6, Math.round(input.groupSize)));
  const days = Math.max(2, Math.min(12, Math.round(input.days)));
  const nights = Math.max(1, days - 1);

  if (selectedDests.length === 0) {
    return {
      totalINR: 0,
      perPersonINR: 0,
      breakdown: {
        transitINR: 0,
        accommodationINR: 0,
        foodINR: 0,
        permitsINR: 0,
        experiencesINR: 0,
      },
      roomsNeeded: Math.ceil(groupSize / 2),
      vehiclesNeeded: Math.ceil(groupSize / 4),
      savingsTip: 'Select at least one destination or starter circuit to estimate realistic INR costs.',
      alternativeModeDeltaINR: 0,
    };
  }

  // Room splitting: 2 travelers per room (unless backpacker solo dorm, still ceil(n/2) for standard rooms)
  const roomsNeeded = Math.ceil(groupSize / 2);
  // Private cab splitting: up to 4 travelers per SUV/sedan
  const vehiclesNeeded = Math.ceil(groupSize / 4);

  // Average nightly base from chosen destinations' homestay tier
  const avgBaseNightly =
    selectedDests.reduce((acc, d) => {
      const homestay = d.stayRecommendations.find((s) => s.tier === 'Homestay');
      return acc + (homestay ? homestay.pricePerNightINR : 1400);
    }, 0) / selectedDests.length;

  const nightlyRoomRate = Math.round(
    avgBaseNightly * TIER_NIGHTLY_ROOM_MULTIPLIER[input.tier]
  );

  // Backpacker solo travelers often take a hostel bed (~65% of a full double room)
  const accommodationINR =
    input.tier === 'backpacker' && groupSize === 1
      ? Math.round(nightlyRoomRate * 0.7 * nights)
      : nightlyRoomRate * roomsNeeded * nights;

  // Food scales linearly per person
  const foodINR = TIER_DAILY_FOOD_PER_PERSON[input.tier] * groupSize * days;

  // Experiences & local guides scale linearly per person (plus park safari surcharge for Kaziranga)
  const hasSafari = selectedDests.some((d) => d.id === 'kaziranga');
  const safariSurchargePerPerson = hasSafari ? 1400 : 0;
  const experiencesINR =
    (TIER_DAILY_EXPERIENCE_PER_PERSON[input.tier] * days + safariSurchargePerPerson) *
    groupSize;

  // Permits scale linearly per person based on selected states
  const permitPerPerson = getPerPersonPermitFee(selectedDests, days);
  const permitsINR = permitPerPerson * groupSize;

  // Transit math: compare Shared Sumo / Bus (linear per person) vs Private Cab (scales per vehicle of up to 4)
  const avgSharedLegPerPerson =
    selectedDests.reduce((acc, d) => {
      const sharedOpt =
        d.transitOptions.find((t) => t.mode === 'Shared Sumo / Winger') ||
        d.transitOptions[0];
      return acc + (sharedOpt ? sharedOpt.costPerPersonINR : 500);
    }, 0) / selectedDests.length;

  // Round-trip hub + inter-destination hops + local sightseeing shuttles
  const hubCrossStatePenalty =
    selectedDests[0].nearestHub !== input.startingHub ? 750 : 0;
  const interStopHops = Math.max(0, selectedDests.length - 1);
  const sharedTransitTotal = Math.round(
    (avgSharedLegPerPerson * 2 +
      interStopHops * 550 +
      days * 180 +
      hubCrossStatePenalty) *
      groupSize
  );

  const privateCabDailyRate = PRIVATE_CAB_DAILY_BASE_INR[input.tier];
  const privateTransitTotal = Math.round(
    (privateCabDailyRate * days + (hubCrossStatePenalty > 0 ? 3200 : 0)) *
      vehiclesNeeded
  );

  const transitINR =
    input.transportMode === 'shared' ? sharedTransitTotal : privateTransitTotal;

  const totalINR =
    transitINR + accommodationINR + foodINR + permitsINR + experiencesINR;
  const perPersonINR = Math.round(totalINR / groupSize);

  const alternativeModeDeltaINR = privateTransitTotal - sharedTransitTotal;

  // Generate concrete dynamic smart savings tip
  let savingsTip: string;
  if (input.transportMode === 'private' && alternativeModeDeltaINR > 600) {
    if (groupSize <= 2) {
      const potentialWithFour = Math.round(privateTransitTotal / 4);
      const currentPerPersonCab = Math.round(privateTransitTotal / groupSize);
      const dropPercent = Math.round(
        ((currentPerPersonCab - potentialWithFour) / currentPerPersonCab) * 100
      );
      savingsTip = `Switching to Shared Sumos saves ${formatINR(
        alternativeModeDeltaINR
      )} on this route, or traveling as a group of 4 cuts your private cab share by ${dropPercent}% per person.`;
    } else {
      savingsTip = `Switching to Shared Sumos & state buses saves ${formatINR(
        alternativeModeDeltaINR
      )} total (${formatINR(
        Math.round(alternativeModeDeltaINR / groupSize)
      )} per traveler) across this route.`;
    }
  } else if (input.transportMode === 'shared' && groupSize >= 4) {
    const extraPerPerson = Math.max(
      0,
      Math.round((privateTransitTotal - sharedTransitTotal) / groupSize)
    );
    savingsTip =
      extraPerPerson <= 900
        ? `With ${groupSize} travelers splitting 1 SUV, upgrading to a Private Cab adds just ${formatINR(
            extraPerPerson
          )} per person for full schedule flexibility.`
        : `Shared Sumos keep transit lean at ${formatINR(
            Math.round(sharedTransitTotal / groupSize)
          )} per traveler—saving ${formatINR(
            alternativeModeDeltaINR
          )} compared to hiring a dedicated vehicle.`;
  } else {
    savingsTip = `Shared transit saves ${formatINR(
      Math.max(0, alternativeModeDeltaINR)
    )} versus a dedicated SUV. Book early-morning Sumo departures before 7:00 AM for the smoothest connections.`;
  }

  return {
    totalINR,
    perPersonINR,
    breakdown: {
      transitINR,
      accommodationINR,
      foodINR,
      permitsINR,
      experiencesINR,
    },
    roomsNeeded,
    vehiclesNeeded,
    savingsTip,
    alternativeModeDeltaINR,
  };
}

export function generateItinerary(input: TripPlanInput): ItineraryDay[] {
  const selectedDests = resolveDestinations(input.destinationIds);
  const days = Math.max(2, Math.min(12, Math.round(input.days)));
  if (selectedDests.length === 0) return [];

  const budget = calculateTripBudget(input);
  const avgDaySpend = Math.round(budget.perPersonINR / days);

  // Distribute days across chosen destinations proportionally
  const counts: number[] = selectedDests.map(() => 1);
  let remaining = days - selectedDests.length;

  // If fewer days than selected destinations, cap to first `days` destinations
  const activeDests =
    remaining < 0 ? selectedDests.slice(0, days) : selectedDests;
  const activeCounts = remaining < 0 ? activeDests.map(() => 1) : counts;

  let cursor = 0;
  while (remaining > 0) {
    activeCounts[cursor % activeDests.length] += 1;
    cursor += 1;
    remaining -= 1;
  }

  const schedule: ItineraryDay[] = [];
  let currentDay = 1;

  activeDests.forEach((dest, destIndex) => {
    const allocatedDays = activeCounts[destIndex];
    const sharedOption =
      dest.transitOptions.find((t) => t.mode === 'Shared Sumo / Winger') ||
      dest.transitOptions[0];
    const privateOption =
      dest.transitOptions.find((t) => t.mode === 'Private Cab') ||
      dest.transitOptions[0];
    const activeTransit =
      input.transportMode === 'shared' ? sharedOption : privateOption;

    for (let i = 0; i < allocatedDays; i++) {
      const isFirstOverall = currentDay === 1;
      const isLastOverall = currentDay === days;
      const isDestinationEntry = i === 0;

      let transitLeg: string | null = null;
      if (isFirstOverall) {
        transitLeg =
          input.transportMode === 'shared'
            ? `Depart ${input.startingHub} → ${dest.name} via ${activeTransit.mode} (~${activeTransit.durationHours}h · ${formatINR(activeTransit.costPerPersonINR)}/person)`
            : `Depart ${input.startingHub} → ${dest.name} by Private SUV (~${activeTransit.durationHours}h · ${activeTransit.departurePoint})`;
      } else if (isDestinationEntry) {
        const prevDest = activeDests[destIndex - 1];
        transitLeg =
          input.transportMode === 'shared'
            ? `Transfer ${prevDest.name} → ${dest.name} via morning regional Shared Sumo / local link`
            : `Scenic highway drive from ${prevDest.name} → ${dest.name} in your private cab`;
      } else if (isLastOverall) {
        transitLeg = `Return leg ${dest.name} → ${input.startingHub} (plan buffer for mountain road timings)`;
      }

      const template = dest.dayActivities[i % dest.dayActivities.length];
      const dayTitle = isFirstOverall
        ? `Arrival in ${dest.name}`
        : isLastOverall
          ? `${dest.name} Farewell & Return to ${input.startingHub.split(' ')[0]}`
          : isDestinationEntry
            ? `Overland to ${dest.name}`
            : `Deep Dive: ${dest.name}`;

      schedule.push({
        dayNumber: currentDay,
        title: dayTitle,
        locationName: dest.name,
        stateName: dest.stateName,
        transitLeg,
        morning: template.morning,
        afternoon: isLastOverall
          ? `Final local meal (${dest.mustTryFood[0]?.name ?? 'regional thali'}) and afternoon departure toward ${input.startingHub}.`
          : template.afternoon,
        evening: isLastOverall
          ? `Arrive back at ${input.startingHub} for evening flights, trains, or onward connections.`
          : template.evening,
        estimatedPerPersonINR: avgDaySpend,
      });

      currentDay += 1;
    }
  });

  return schedule;
}

export function getItineraryPermitAlerts(
  destinationIds: string[]
): PermitAlertItem[] {
  const dests = resolveDestinations(destinationIds);
  const alerts: PermitAlertItem[] = [];
  const seen = new Set<StateId>();

  for (const dest of dests) {
    if (dest.permitType === 'None') continue;
    if (seen.has(dest.stateId)) continue;
    seen.add(dest.stateId);

    const rule = PERMIT_RULES[dest.stateId];
    alerts.push({
      stateId: dest.stateId,
      stateName: rule.stateName,
      code: rule.indian.code,
      label: rule.indian.label,
      feeDisplay: rule.indian.feeDisplay,
      portal: rule.indian.portal,
    });
  }

  return alerts;
}
