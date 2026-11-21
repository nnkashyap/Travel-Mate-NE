import test from 'node:test';
import assert from 'node:assert/strict';
import { DESTINATIONS } from '../data/destinations';
import { normalizeSearchText, searchDestinations } from './search';

test('normalizeSearchText folds diacritics and trims whitespace', () => {
  assert.equal(normalizeSearchText('  Dzükou Valley  '), 'dzukou valley');
  assert.equal(normalizeSearchText('MEGHALAYA'), 'meghalaya');
});

test('searchDestinations finds destinations by name including diacritic-insensitive input', () => {
  const dzukouResults = searchDestinations(DESTINATIONS, 'dzukou');
  assert.ok(dzukouResults.length >= 1);
  assert.equal(dzukouResults[0].destination.id, 'dzukou-valley');
  assert.equal(dzukouResults[0].reason, 'Name');

  const tawangResults = searchDestinations(DESTINATIONS, 'Tawang');
  assert.ok(tawangResults.length >= 1);
  assert.equal(tawangResults[0].destination.id, 'tawang');
  assert.equal(tawangResults[0].reason, 'Name');
});

test('searchDestinations finds destinations by state and region label', () => {
  const meghalayaResults = searchDestinations(DESTINATIONS, 'Meghalaya', 10);
  assert.ok(meghalayaResults.length >= 3);
  assert.ok(
    meghalayaResults.every((r) => r.destination.stateId === 'meghalaya')
  );
  assert.equal(meghalayaResults[0].reason, 'Region');

  const brahmaputraResults = searchDestinations(
    DESTINATIONS,
    'Upper Brahmaputra'
  );
  assert.ok(brahmaputraResults.some((r) => r.destination.id === 'majuli'));
  assert.equal(brahmaputraResults[0].reason, 'Region');
});

test('searchDestinations finds destinations by activity category and experience keywords', () => {
  const trekkingResults = searchDestinations(DESTINATIONS, 'Trekking', 10);
  assert.ok(trekkingResults.length >= 3);
  assert.ok(
    trekkingResults.some((r) => r.destination.categories.includes('Trekking'))
  );
  assert.equal(trekkingResults[0].reason, 'Activity');

  const wildlifeResults = searchDestinations(DESTINATIONS, 'wildlife', 10);
  assert.ok(wildlifeResults.some((r) => r.destination.id === 'kaziranga'));
  assert.ok(wildlifeResults.some((r) => r.destination.id === 'manas-national-park'));

  const cyclingResults = searchDestinations(DESTINATIONS, 'cycling', 10);
  assert.ok(cyclingResults.length >= 1);
  assert.equal(cyclingResults[0].reason, 'Activity');
});

test('searchDestinations handles empty, unknown queries, and limit bounds cleanly', () => {
  assert.deepEqual(searchDestinations(DESTINATIONS, ''), []);
  assert.deepEqual(searchDestinations(DESTINATIONS, '   '), []);
  assert.deepEqual(searchDestinations(DESTINATIONS, 'atlantis-nonexistent'), []);

  const limited = searchDestinations(DESTINATIONS, 'Assam', 2);
  assert.equal(limited.length, 2);
});
