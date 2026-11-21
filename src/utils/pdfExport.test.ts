import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTripBudget,
  generateItinerary,
  getItineraryPermitAlerts,
  TripPlanInput,
} from './planner';
import {
  buildSinglePageItineraryPdf,
  formatPdfINR,
  sanitizePdfText,
} from './pdfExport';

test('buildSinglePageItineraryPdf produces exactly one custom-dimension continuous page (never A4, zero page breaks)', () => {
  const planner: TripPlanInput = {
    startingHub: 'Guwahati (GAU)',
    destinationIds: ['tawang', 'ziro-valley', 'majuli'],
    days: 8,
    groupSize: 3,
    tier: 'balanced',
    transportMode: 'private',
  };

  const budget = calculateTripBudget(planner);
  const schedule = generateItinerary(planner);
  const permitAlerts = getItineraryPermitAlerts(planner.destinationIds);

  const built = buildSinglePageItineraryPdf({
    planner,
    budget,
    schedule,
    permitAlerts,
  });

  // Strictly single page — zero page breaks
  assert.equal(built.pageCount, 1);
  assert.equal(built.doc.getNumberOfPages(), 1);

  // Custom editorial canvas larger than standard A4 (595.28 x 841.89 pt)
  assert.equal(built.widthPt, 680);
  assert.ok(
    built.heightPt > 1400,
    `Expected tall continuous single page height > 1400pt for 8-day trip, got ${built.heightPt}pt`
  );

  // Output starts with valid PDF magic header
  const bytes = new Uint8Array(built.doc.output('arraybuffer'));
  const header = String.fromCharCode(...bytes.slice(0, 5));
  assert.equal(header, '%PDF-');
  assert.ok(bytes.byteLength > 2000);
});

test('sanitizePdfText and formatPdfINR strip unsupported glyphs cleanly', () => {
  assert.equal(formatPdfINR(24500), 'INR 24,500');
  assert.equal(
    sanitizePdfText('Guwahati → Dzükou Valley · ₹1,400–₹2,200'),
    'Guwahati -> Dzukou Valley | INR 1,400-INR 2,200'
  );
});
