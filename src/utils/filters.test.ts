import test from 'node:test';
import assert from 'node:assert/strict';
import { DESTINATIONS } from '../data/destinations';
import { STATES } from '../data/states';
import {
  CULTURAL_SITES_AND_CRAFTS,
  FESTIVALS,
  REGIONAL_DISHES,
} from '../data/festivals';
import { STARTER_CIRCUITS } from '../data/circuits';
import {
  DEFAULT_EXPLORE_FILTERS,
  filterAndSortDestinations,
} from './filters';
import { evaluatePermits } from './permits';

test('seed dataset covers all 8 North Eastern states with at least 25 unique destinations', () => {
  assert.ok(DESTINATIONS.length >= 25);
  const coveredStates = new Set(DESTINATIONS.map((d) => d.stateId));
  assert.equal(coveredStates.size, 8);
  for (const state of STATES) {
    assert.ok(
      coveredStates.has(state.id),
      `Missing destination for ${state.name}`
    );
  }
  const uniqueIds = new Set(DESTINATIONS.map((d) => d.id));
  const uniqueSlugs = new Set(DESTINATIONS.map((d) => d.slug));
  assert.equal(uniqueIds.size, DESTINATIONS.length);
  assert.equal(uniqueSlugs.size, DESTINATIONS.length);
});

test('festivals cover all 12 months, cuisine covers all 8 states with veg & non-veg dishes, and circuits reference valid destinations', () => {
  const coveredMonths = new Set<number>();
  for (const fest of FESTIVALS) {
    if (fest.monthIndices && fest.monthIndices.length > 0) {
      fest.monthIndices.forEach((m) => coveredMonths.add(m));
    } else {
      coveredMonths.add(fest.monthIndex);
    }
  }
  assert.equal(coveredMonths.size, 12);

  assert.ok(REGIONAL_DISHES.length >= 16);
  for (const state of STATES) {
    const stateDishes = REGIONAL_DISHES.filter((d) => d.stateId === state.id);
    assert.ok(
      stateDishes.length >= 2,
      `Expected at least 2 regional dishes for ${state.name}`
    );
  }
  assert.ok(REGIONAL_DISHES.some((d) => d.dietary === 'Veg-Friendly'));
  assert.ok(REGIONAL_DISHES.some((d) => d.dietary === 'Non-Veg'));

  assert.ok(CULTURAL_SITES_AND_CRAFTS.length >= 8);

  const destinationIds = new Set(DESTINATIONS.map((d) => d.id));
  for (const circuit of STARTER_CIRCUITS) {
    for (const id of circuit.destinationIds) {
      assert.ok(
        destinationIds.has(id),
        `Circuit ${circuit.id} references unknown destination ${id}`
      );
    }
  }
});

test('filterAndSortDestinations filters by state, permit, hidden gem, and sorts correctly', () => {
  const meghalayaHidden = filterAndSortDestinations(DESTINATIONS, {
    ...DEFAULT_EXPLORE_FILTERS,
    state: 'meghalaya',
    hiddenGemOnly: true,
  });
  assert.equal(meghalayaHidden.length, 1);
  assert.equal(meghalayaHidden[0].slug, 'kongthong-whistling-village');

  const permitFree = filterAndSortDestinations(DESTINATIONS, {
    ...DEFAULT_EXPLORE_FILTERS,
    permit: 'none',
    sortBy: 'lowest-cost',
  });
  assert.ok(permitFree.every((d) => d.permitType === 'None'));
  for (let i = 1; i < permitFree.length; i++) {
    assert.ok(
      permitFree[i].dailyBudgetINR.backpacker >=
        permitFree[i - 1].dailyBudgetINR.backpacker
    );
  }
});

test('evaluatePermits distinguishes Indian Citizen vs Foreign National rules accurately', () => {
  const indianReport = evaluatePermits('indian', ['assam', 'arunachal', 'sikkim']);
  assert.equal(indianReport.openCount, 1); // Assam
  assert.equal(indianReport.requiredCount, 2); // Arunachal ILP + Sikkim PAP-Zone
  assert.equal(indianReport.entries[1].code, 'ILP-REQ');
  assert.equal(indianReport.entries[2].code, 'PAP-ZONE');

  const foreignReport = evaluatePermits('foreign', ['assam', 'arunachal', 'sikkim']);
  assert.equal(foreignReport.openCount, 1);
  assert.equal(foreignReport.entries[1].code, 'PAP-REQ');
  assert.equal(foreignReport.entries[2].code, 'RAP+PAP');
});
