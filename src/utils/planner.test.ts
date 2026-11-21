import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTripBudget,
  generateItinerary,
  getItineraryPermitAlerts,
  formatINR,
} from './planner';

test('formatINR formats Indian currency grouping cleanly', () => {
  assert.equal(formatINR(12400), '₹12,400');
  assert.equal(formatINR(125000), '₹1,25,000');
});

test('accommodation splits per 2 travelers per room and vehicles split per 4 travelers', () => {
  const group1 = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra'],
    days: 4,
    groupSize: 1,
    tier: 'balanced',
    transportMode: 'private',
  });

  const group2 = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra'],
    days: 4,
    groupSize: 2,
    tier: 'balanced',
    transportMode: 'private',
  });

  const group4 = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra'],
    days: 4,
    groupSize: 4,
    tier: 'balanced',
    transportMode: 'private',
  });

  const group5 = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra'],
    days: 4,
    groupSize: 5,
    tier: 'balanced',
    transportMode: 'private',
  });

  // 1 and 2 travelers share 1 room & 1 vehicle
  assert.equal(group1.roomsNeeded, 1);
  assert.equal(group2.roomsNeeded, 1);
  assert.equal(group1.breakdown.accommodationINR, group2.breakdown.accommodationINR);
  assert.equal(group1.vehiclesNeeded, 1);
  assert.equal(group4.vehiclesNeeded, 1);
  assert.equal(group1.breakdown.transitINR, group4.breakdown.transitINR);

  // 4 travelers need 2 rooms, 5 travelers need 3 rooms and 2 vehicles
  assert.equal(group4.roomsNeeded, 2);
  assert.equal(group5.roomsNeeded, 3);
  assert.equal(group5.vehiclesNeeded, 2);
  assert.equal(group5.breakdown.transitINR, group4.breakdown.transitINR * 2);

  // Food scales linearly per traveler
  assert.equal(group4.breakdown.foodINR, group1.breakdown.foodINR * 4);
  assert.ok(group4.perPersonINR < group1.perPersonINR);
});

test('permits scale linearly per traveler and auto-trigger for restricted states', () => {
  const meghalayaOnly = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra'],
    days: 4,
    groupSize: 2,
    tier: 'balanced',
    transportMode: 'shared',
  });
  assert.equal(meghalayaOnly.breakdown.permitsINR, 0);
  assert.equal(getItineraryPermitAlerts(['nongriat-sohra']).length, 0);

  const arunachalNagaland = calculateTripBudget({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['tawang', 'dzukou-valley'],
    days: 6,
    groupSize: 3,
    tier: 'balanced',
    transportMode: 'shared',
  });
  // Arunachal (4-14 days = ₹500) + Nagaland (₹200) = ₹700 * 3 = ₹2,100
  assert.equal(arunachalNagaland.breakdown.permitsINR, 2100);
  const alerts = getItineraryPermitAlerts(['tawang', 'dzukou-valley']);
  assert.equal(alerts.length, 2);
  assert.equal(alerts[0].code, 'ILP-REQ');
});

test('generateItinerary builds exact requested day count with hub transit legs', () => {
  const days = generateItinerary({
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['nongriat-sohra', 'mawlynnong-dawki'],
    days: 5,
    groupSize: 2,
    tier: 'balanced',
    transportMode: 'shared',
  });

  assert.equal(days.length, 5);
  assert.equal(days[0].dayNumber, 1);
  assert.match(days[0].transitLeg ?? '', /Guwahati/);
  assert.equal(days[4].dayNumber, 5);
  assert.match(days[4].transitLeg ?? '', /Return leg/);
});
