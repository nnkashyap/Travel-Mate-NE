import { jsPDF } from 'jspdf';
import { DESTINATIONS } from '../data/destinations';
import { PERMIT_RULES } from '../data/permits';
import {
  ItineraryDay,
  PermitAlertItem,
  TripBudgetResult,
  TripPlanInput,
} from './planner';

export interface SinglePagePdfInput {
  planner: TripPlanInput;
  budget: TripBudgetResult;
  schedule: ItineraryDay[];
  permitAlerts: PermitAlertItem[];
}

export interface BuiltSinglePagePdf {
  doc: jsPDF;
  filename: string;
  widthPt: number;
  heightPt: number;
  pageCount: number;
}

const PAGE_WIDTH_PT = 680;
const MARGIN_PT = 40;
const CONTENT_WIDTH_PT = PAGE_WIDTH_PT - MARGIN_PT * 2;

const COLORS = {
  canvas: [250, 249, 246] as const, // #FAF9F6
  surface: [255, 255, 255] as const, // #FFFFFF
  subtle: [242, 239, 233] as const, // #F2EFE9
  dark: [20, 28, 24] as const, // #141C18
  ink: [22, 22, 20] as const, // #161614
  secondary: [92, 91, 86] as const, // #5C5B56
  muted: [142, 140, 132] as const, // #8E8C84
  inverse: [250, 249, 246] as const, // #FAF9F6
  sageText: [220, 230, 224] as const, // #DCE6E0
  pine: [30, 63, 49] as const, // #1E3F31
  pineMid: [61, 107, 89] as const, // #3D6B59
  terracotta: [194, 94, 58] as const, // #C25E3A
  amber: [180, 83, 9] as const, // #B45309
  amberBg: [254, 243, 199] as const, // #FEF3C7
  amberText: [146, 64, 14] as const, // #92400E
  border: [230, 227, 220] as const, // #E6E3DC
  openGreen: [45, 106, 79] as const, // #2D6A4F
};

export function sanitizePdfText(raw: string): string {
  return raw
    .replace(/₹\s*/g, 'INR ')
    .replace(/\s*→\s*/g, ' -> ')
    .replace(/[–—]/g, '-')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s*·\s*/g, ' | ')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/é/g, 'e')
    .replace(/[^\x20-\x7E\n]/g, '')
    .replace(/ {2,}/g, ' ')
    .trim();
}

export function formatPdfINR(amount: number): string {
  const safe = Math.max(0, Math.round(amount));
  return `INR ${safe.toLocaleString('en-IN')}`;
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function drawDocumentLayout(
  doc: jsPDF,
  input: SinglePagePdfInput,
  paint: boolean
): number {
  const { planner, budget, schedule, permitAlerts } = input;
  const selectedDestinations = planner.destinationIds
    .map((id) => DESTINATIONS.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  const routeNames =
    selectedDestinations.length > 0
      ? selectedDestinations.map((d) => sanitizePdfText(d.name)).join(' -> ')
      : 'Custom North East India Route';

  const setFill = (rgb: readonly [number, number, number]) =>
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  const setDraw = (rgb: readonly [number, number, number]) =>
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  const setText = (rgb: readonly [number, number, number]) =>
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);

  if (paint) {
    const pageH = doc.internal.pageSize.getHeight();
    setFill(COLORS.canvas);
    doc.rect(0, 0, PAGE_WIDTH_PT, pageH, 'F');
  }

  let y = MARGIN_PT;

  // =========================================================================
  // 1. EDITORIAL MASTHEAD BANNER
  // =========================================================================
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const routeLines = doc.splitTextToSize(routeNames, CONTENT_WIDTH_PT - 48);
  const metaSummary = sanitizePdfText(
    `${planner.days} Days  |  ${planner.groupSize} ${
      planner.groupSize === 1 ? 'Traveler' : 'Travelers'
    }  |  Hub: ${planner.startingHub}  |  ${capitalize(planner.tier)} Tier  |  ${
      planner.transportMode === 'private'
        ? `Private SUV (${budget.vehiclesNeeded})`
        : 'Shared Sumo / Bus Transit'
    }`
  );
  const metaLines = doc.splitTextToSize(metaSummary, CONTENT_WIDTH_PT - 48);
  const mastheadHeight = 86 + routeLines.length * 14 + metaLines.length * 13;

  if (paint) {
    setFill(COLORS.dark);
    doc.roundedRect(MARGIN_PT, y, CONTENT_WIDTH_PT, mastheadHeight, 12, 12, 'F');

    // Subtle terracotta editorial rule at top-left
    setFill(COLORS.terracotta);
    doc.rect(MARGIN_PT + 24, y + 22, 28, 2.5, 'F');

    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    setText(COLORS.sageText);
    doc.text(
      'TRAVELMATENE  |  SINGLE-PAGE FIELD BRIEF',
      MARGIN_PT + 60,
      y + 25.5
    );

    doc.setFont('times', 'normal');
    doc.setFontSize(26);
    setText(COLORS.inverse);
    doc.text('North East India Trip Dossier', MARGIN_PT + 24, y + 54);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setText(COLORS.sageText);
    doc.text(routeLines, MARGIN_PT + 24, y + 74);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(196, 206, 200);
    doc.text(metaLines, MARGIN_PT + 24, y + 78 + routeLines.length * 14);
  }

  y += mastheadHeight + 22;

  // =========================================================================
  // 2. LIVE BUDGET ESTIMATE & STACKED COST BAR
  // =========================================================================
  const segments = [
    {
      label: 'Transit & Intercity',
      value: budget.breakdown.transitINR,
      color: COLORS.pine,
    },
    {
      label: 'Accommodation',
      value: budget.breakdown.accommodationINR,
      color: COLORS.pineMid,
    },
    {
      label: 'Food & Local Dining',
      value: budget.breakdown.foodINR,
      color: COLORS.terracotta,
    },
    {
      label: 'Experiences & Guides',
      value: budget.breakdown.experiencesINR,
      color: COLORS.muted,
    },
    {
      label: 'Permits & Entry Fees',
      value: budget.breakdown.permitsINR,
      color: COLORS.amber,
    },
  ];

  const savingsTipText = sanitizePdfText(`Route Economics: ${budget.savingsTip}`);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const savingsLines = doc.splitTextToSize(
    savingsTipText,
    CONTENT_WIDTH_PT - 64
  );
  const savingsBoxH = 22 + savingsLines.length * 12.5;
  const budgetCardHeight = 205 + savingsBoxH;

  if (paint) {
    setFill(COLORS.surface);
    setDraw(COLORS.border);
    doc.setLineWidth(1);
    doc.roundedRect(
      MARGIN_PT,
      y,
      CONTENT_WIDTH_PT,
      budgetCardHeight,
      10,
      10,
      'FD'
    );

    // Header row: Total INR (left) + Per Person Share (right)
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    setText(COLORS.secondary);
    doc.text(
      `BUDGET SUMMARY  |  ${budget.roomsNeeded} ${
        budget.roomsNeeded === 1 ? 'ROOM' : 'ROOMS'
      }  |  ${planner.days} DAYS`,
      MARGIN_PT + 22,
      y + 24
    );

    doc.setFont('courier', 'bold');
    doc.setFontSize(23);
    setText(COLORS.ink);
    doc.text(formatPdfINR(budget.totalINR), MARGIN_PT + 22, y + 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(COLORS.secondary);
    doc.text(
      'Total estimated all-in trip budget across all travelers',
      MARGIN_PT + 22,
      y + 66
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(COLORS.secondary);
    doc.text('Per Person Share', MARGIN_PT + CONTENT_WIDTH_PT - 22, y + 32, {
      align: 'right',
    });

    doc.setFont('courier', 'bold');
    doc.setFontSize(17);
    setText(COLORS.pine);
    doc.text(
      formatPdfINR(budget.perPersonINR),
      MARGIN_PT + CONTENT_WIDTH_PT - 22,
      y + 52,
      { align: 'right' }
    );

    // Hairline divider
    setDraw(COLORS.border);
    doc.line(MARGIN_PT + 22, y + 78, MARGIN_PT + CONTENT_WIDTH_PT - 22, y + 78);

    // Stacked Horizontal Bar Chart
    const barX = MARGIN_PT + 22;
    const barY = y + 92;
    const barW = CONTENT_WIDTH_PT - 44;
    const barH = 10;
    const safeTotal = Math.max(1, budget.totalINR);

    setFill(COLORS.subtle);
    doc.roundedRect(barX, barY, barW, barH, 4, 4, 'F');

    let segX = barX;
    for (const seg of segments) {
      if (seg.value <= 0) continue;
      const segW = Math.max(2, (seg.value / safeTotal) * barW);
      setFill(seg.color);
      doc.rect(segX, barY, Math.min(segW, barX + barW - segX), barH, 'F');
      segX += segW;
    }

    // 2-column itemized breakdown grid
    const colW = (CONTENT_WIDTH_PT - 64) / 2;
    segments.forEach((seg, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const sx = MARGIN_PT + 22 + col * (colW + 20);
      const sy = y + 120 + row * 22;
      const pct =
        budget.totalINR > 0
          ? Math.round((seg.value / budget.totalINR) * 100)
          : 0;

      setFill(seg.color);
      doc.rect(sx, sy - 6.5, 7, 7, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setText(COLORS.secondary);
      doc.text(seg.label, sx + 12, sy);

      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      setText(COLORS.ink);
      doc.text(`${formatPdfINR(seg.value)} (${pct}%)`, sx + colW, sy, {
        align: 'right',
      });

      setDraw(COLORS.border);
      doc.setLineWidth(0.5);
      doc.line(sx, sy + 6, sx + colW, sy + 6);
    });

    // Route Economics tip callout
    const tipY = y + 188;
    setFill(COLORS.canvas);
    setDraw(COLORS.sageText);
    doc.setLineWidth(0.8);
    doc.roundedRect(
      MARGIN_PT + 22,
      tipY,
      CONTENT_WIDTH_PT - 44,
      savingsBoxH,
      7,
      7,
      'FD'
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(COLORS.ink);
    doc.text(savingsLines, MARGIN_PT + 32, tipY + 15);
  }

  y += budgetCardHeight + 20;

  // =========================================================================
  // 3. PERMIT REQUIREMENTS STATUS
  // =========================================================================
  const permitLineEntries = permitAlerts.map((alert) => {
    const rule = PERMIT_RULES[alert.stateId];
    return sanitizePdfText(
      `${alert.stateName} (${alert.code}) - Fee: ${alert.feeDisplay} | Portal: ${alert.portal} | Gate: ${rule.indian.checkposts}`
    );
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  const wrappedPermitEntries = permitLineEntries.map((line) =>
    doc.splitTextToSize(line, CONTENT_WIDTH_PT - 52)
  );
  const permitTotalLines = wrappedPermitEntries.reduce(
    (sum, lines) => sum + lines.length,
    0
  );
  const permitCardHeight =
    permitAlerts.length > 0
      ? 48 + permitTotalLines * 12.5 + Math.max(0, permitAlerts.length - 1) * 6
      : 54;

  if (paint) {
    if (permitAlerts.length > 0) {
      setFill(COLORS.amberBg);
      setDraw(COLORS.amber);
      doc.setLineWidth(0.8);
      doc.roundedRect(
        MARGIN_PT,
        y,
        CONTENT_WIDTH_PT,
        permitCardHeight,
        10,
        10,
        'FD'
      );

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      setText(COLORS.amberText);
      doc.text(
        `PERMIT ACTION REQUIRED (${permitAlerts
          .map((a) => a.stateName.toUpperCase())
          .join(', ')})`,
        MARGIN_PT + 22,
        y + 22
      );

      let py = y + 39;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.8);
      setText(COLORS.ink);
      for (const lines of wrappedPermitEntries) {
        doc.text(lines, MARGIN_PT + 22, py);
        py += lines.length * 12.5 + 6;
      }
    } else {
      setFill(COLORS.surface);
      setDraw(COLORS.openGreen);
      doc.setLineWidth(0.8);
      doc.roundedRect(
        MARGIN_PT,
        y,
        CONTENT_WIDTH_PT,
        permitCardHeight,
        10,
        10,
        'FD'
      );

      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      setText(COLORS.openGreen);
      doc.text(
        'PERMIT STATUS: ZERO-PERMIT ROUTE (STANDARD PHOTO ID ONLY)',
        MARGIN_PT + 22,
        y + 23
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      setText(COLORS.secondary);
      doc.text(
        'No Inner Line Permit (ILP) or Protected Area Permit (PAP) is required for Indian citizens across your chosen stops.',
        MARGIN_PT + 22,
        y + 39
      );
    }
  }

  y += permitCardHeight + 26;

  // =========================================================================
  // 4. DAY-BY-DAY EDITORIAL SCHEDULE (ALL DAYS ON ONE CONTINUOUS PAGE)
  // =========================================================================
  if (paint) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    setText(COLORS.secondary);
    doc.text('DAY-BY-DAY EDITORIAL SCHEDULE', MARGIN_PT, y);

    doc.setFont('times', 'normal');
    doc.setFontSize(20);
    setText(COLORS.ink);
    doc.text('Tailored Route Timeline', MARGIN_PT, y + 21);
  }
  y += 34;

  const threeColGap = 16;
  const threeColW = (CONTENT_WIDTH_PT - 44 - threeColGap * 2) / 3;

  for (const day of schedule) {
    const transitLines = day.transitLeg
      ? doc.splitTextToSize(
          sanitizePdfText(`Transit: ${day.transitLeg}`),
          CONTENT_WIDTH_PT - 60
        )
      : [];
    const transitBoxH =
      transitLines.length > 0 ? 16 + transitLines.length * 11.5 : 0;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    const morningLines = doc.splitTextToSize(
      sanitizePdfText(day.morning),
      threeColW
    );
    const afternoonLines = doc.splitTextToSize(
      sanitizePdfText(day.afternoon),
      threeColW
    );
    const eveningLines = doc.splitTextToSize(
      sanitizePdfText(day.evening),
      threeColW
    );
    const maxSlotLines = Math.max(
      morningLines.length,
      afternoonLines.length,
      eveningLines.length
    );
    const slotsH = 18 + maxSlotLines * 12;

    const dayCardH =
      52 + (transitBoxH > 0 ? transitBoxH + 12 : 0) + slotsH + 16;

    if (paint) {
      setFill(COLORS.surface);
      setDraw(COLORS.border);
      doc.setLineWidth(0.9);
      doc.roundedRect(MARGIN_PT, y, CONTENT_WIDTH_PT, dayCardH, 10, 10, 'FD');

      // Day number + title
      doc.setFont('courier', 'bold');
      doc.setFontSize(9);
      setText(COLORS.terracotta);
      doc.text(
        `DAY ${String(day.dayNumber).padStart(2, '0')}`,
        MARGIN_PT + 22,
        y + 24
      );

      doc.setFont('times', 'normal');
      doc.setFontSize(15.5);
      setText(COLORS.ink);
      doc.text(sanitizePdfText(day.title), MARGIN_PT + 68, y + 24.5);

      doc.setFont('courier', 'normal');
      doc.setFontSize(8.5);
      setText(COLORS.secondary);
      doc.text(
        sanitizePdfText(
          `${day.stateName}  |  Est. ${formatPdfINR(day.estimatedPerPersonINR)}/pax`
        ),
        MARGIN_PT + CONTENT_WIDTH_PT - 22,
        y + 24,
        { align: 'right' }
      );

      setDraw(COLORS.border);
      doc.setLineWidth(0.6);
      doc.line(MARGIN_PT + 22, y + 36, MARGIN_PT + CONTENT_WIDTH_PT - 22, y + 36);

      let innerY = y + 48;

      if (transitLines.length > 0) {
        setFill(COLORS.subtle);
        doc.roundedRect(
          MARGIN_PT + 22,
          innerY - 4,
          CONTENT_WIDTH_PT - 44,
          transitBoxH,
          6,
          6,
          'F'
        );
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        setText(COLORS.pine);
        doc.text(transitLines, MARGIN_PT + 30, innerY + 8);
        innerY += transitBoxH + 10;
      }

      const slotData = [
        { label: 'MORNING', lines: morningLines },
        { label: 'AFTERNOON', lines: afternoonLines },
        { label: 'EVENING', lines: eveningLines },
      ];

      slotData.forEach((slot, idx) => {
        const colX = MARGIN_PT + 22 + idx * (threeColW + threeColGap);
        doc.setFont('courier', 'bold');
        doc.setFontSize(8);
        setText(COLORS.secondary);
        doc.text(slot.label, colX, innerY + 4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        setText(COLORS.ink);
        doc.text(slot.lines, colX, innerY + 18);
      });
    }

    y += dayCardH + 14;
  }

  // =========================================================================
  // 5. DESTINATION CULINARY & STAY FIELD NOTES
  // =========================================================================
  if (selectedDestinations.length > 0) {
    y += 12;
    if (paint) {
      doc.setFont('courier', 'bold');
      doc.setFontSize(8.5);
      setText(COLORS.secondary);
      doc.text('DESTINATION FIELD NOTES', MARGIN_PT, y);

      doc.setFont('times', 'normal');
      doc.setFontSize(18);
      setText(COLORS.ink);
      doc.text('Local Dishes, Stays & Connectivity', MARGIN_PT, y + 20);
    }
    y += 32;

    for (const dest of selectedDestinations) {
      const dishesLine = sanitizePdfText(
        `Must-Try Food: ${dest.mustTryFood
          .slice(0, 3)
          .map((f) => `${f.name} (${formatPdfINR(f.avgCostINR)})`)
          .join(' | ')}`
      );
      const stayLine = sanitizePdfText(
        `Recommended Stay: ${
          dest.stayRecommendations[0]?.exampleType ?? 'Community Homestay'
        } (~${formatPdfINR(
          dest.stayRecommendations[0]?.pricePerNightINR ?? 1200
        )}/night)  |  Network: ${dest.connectivity}`
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.6);
      const dishWrapped = doc.splitTextToSize(dishesLine, CONTENT_WIDTH_PT - 44);
      const stayWrapped = doc.splitTextToSize(stayLine, CONTENT_WIDTH_PT - 44);
      const noteCardH =
        38 + dishWrapped.length * 12 + stayWrapped.length * 12 + 12;

      if (paint) {
        setFill(COLORS.surface);
        setDraw(COLORS.border);
        doc.setLineWidth(0.8);
        doc.roundedRect(
          MARGIN_PT,
          y,
          CONTENT_WIDTH_PT,
          noteCardH,
          9,
          9,
          'FD'
        );

        doc.setFont('times', 'bold');
        doc.setFontSize(13);
        setText(COLORS.ink);
        doc.text(
          sanitizePdfText(`${dest.name} (${dest.stateName})`),
          MARGIN_PT + 20,
          y + 21
        );

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        setText(COLORS.pine);
        doc.text(
          sanitizePdfText(
            `${dest.elevationMeters.toLocaleString('en-IN')}m  |  Best: ${dest.bestMonths.join(', ')}`
          ),
          MARGIN_PT + CONTENT_WIDTH_PT - 20,
          y + 21,
          { align: 'right' }
        );

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.6);
        setText(COLORS.secondary);
        doc.text(dishWrapped, MARGIN_PT + 20, y + 38);
        doc.text(
          stayWrapped,
          MARGIN_PT + 20,
          y + 42 + dishWrapped.length * 12
        );
      }

      y += noteCardH + 10;
    }
  }

  // =========================================================================
  // 6. EDITORIAL FOOTER COLOPHON
  // =========================================================================
  y += 14;
  if (paint) {
    setDraw(COLORS.border);
    doc.setLineWidth(0.8);
    doc.line(MARGIN_PT, y, MARGIN_PT + CONTENT_WIDTH_PT, y);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    setText(COLORS.muted);
    doc.text(
      'TravelMateNE  |  Independent North East India Field Guide  |  Verify seasonal road & permit notices before frontier crossings.',
      MARGIN_PT,
      y + 16
    );
  }

  return Math.ceil(y + MARGIN_PT);
}

export function buildSinglePageItineraryPdf(
  input: SinglePagePdfInput
): BuiltSinglePagePdf {
  // Pass 1: Measure exact continuous height needed so EVERYTHING fits on 1 page with zero page breaks
  const measureDoc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [PAGE_WIDTH_PT, 2000],
  });
  const measuredHeight = Math.max(
    640,
    drawDocumentLayout(measureDoc, input, false)
  );

  // Pass 2: Instantiate single custom-dimension page (never A4, never paginated)
  const doc = new jsPDF({
    orientation: measuredHeight >= PAGE_WIDTH_PT ? 'portrait' : 'landscape',
    unit: 'pt',
    format: [PAGE_WIDTH_PT, measuredHeight],
    compress: true,
  });

  drawDocumentLayout(doc, input, true);

  const hubSlug = input.planner.startingHub
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = `TravelMateNE-${input.planner.days}Day-${hubSlug || 'northeast'}-Itinerary.pdf`;

  return {
    doc,
    filename,
    widthPt: PAGE_WIDTH_PT,
    heightPt: measuredHeight,
    pageCount: doc.getNumberOfPages(),
  };
}

export function downloadSinglePageItineraryPdf(
  input: SinglePagePdfInput
): BuiltSinglePagePdf {
  const built = buildSinglePageItineraryPdf(input);
  const blob = built.doc.output('blob');
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = built.filename;
  link.rel = 'noopener';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 4000);

  return built;
}
