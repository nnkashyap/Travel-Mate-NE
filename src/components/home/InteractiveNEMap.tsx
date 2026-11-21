import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  FileCheck2,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import { STATES } from '../../data/states';
import { DESTINATIONS } from '../../data/destinations';
import { PERMIT_RULES } from '../../data/permits';
import { HubId, StateId } from '../../types/travel';
import { formatINR } from '../../utils/planner';
import { useTravel } from '../../context/TravelContext';
import { EditorialImage } from '../shared/EditorialImage';

interface StateShape {
  id: StateId;
  path: string;
  labelX: number;
  labelY: number;
  shortLabel: string;
  pinX: number;
  pinY: number;
}

export const STATE_SHAPES: StateShape[] = [
  {
    id: 'sikkim',
    path: 'M 94 140 L 124 134 L 136 154 L 134 182 L 122 198 L 98 196 L 88 174 L 90 154 Z',
    labelX: 112,
    labelY: 175,
    shortLabel: 'Sikkim',
    pinX: 112,
    pinY: 158,
  },
  {
    id: 'arunachal',
    path: 'M 252 152 L 296 128 L 352 108 L 418 82 L 484 72 L 542 88 L 580 120 L 570 166 L 532 192 L 496 174 L 462 152 L 408 158 L 348 172 L 288 176 Z',
    labelX: 438,
    labelY: 128,
    shortLabel: 'Arunachal Pradesh',
    pinX: 438,
    pinY: 111,
  },
  {
    id: 'assam',
    path: 'M 206 206 L 266 184 L 346 176 L 410 160 L 464 156 L 502 184 L 466 218 L 418 242 L 386 286 L 352 300 L 336 254 L 286 236 L 222 238 Z',
    labelX: 356,
    labelY: 218,
    shortLabel: 'Assam',
    pinX: 356,
    pinY: 201,
  },
  {
    id: 'meghalaya',
    path: 'M 218 244 L 296 242 L 334 260 L 326 288 L 260 288 L 216 276 Z',
    labelX: 274,
    labelY: 272,
    shortLabel: 'Meghalaya',
    pinX: 274,
    pinY: 256,
  },
  {
    id: 'nagaland',
    path: 'M 470 218 L 516 192 L 538 228 L 514 274 L 462 276 L 450 248 Z',
    labelX: 492,
    labelY: 247,
    shortLabel: 'Nagaland',
    pinX: 492,
    pinY: 230,
  },
  {
    id: 'manipur',
    path: 'M 452 280 L 508 280 L 500 342 L 456 356 L 422 332 L 428 292 Z',
    labelX: 464,
    labelY: 324,
    shortLabel: 'Manipur',
    pinX: 464,
    pinY: 307,
  },
  {
    id: 'mizoram',
    path: 'M 366 306 L 416 336 L 420 410 L 392 448 L 356 418 L 352 344 Z',
    labelX: 386,
    labelY: 388,
    shortLabel: 'Mizoram',
    pinX: 386,
    pinY: 371,
  },
  {
    id: 'tripura',
    path: 'M 294 334 L 344 330 L 346 392 L 310 412 L 286 376 Z',
    labelX: 317,
    labelY: 376,
    shortLabel: 'Tripura',
    pinX: 317,
    pinY: 359,
  },
];

const STATE_DEFAULT_HUB: Record<StateId, HubId> = {
  assam: 'Guwahati (GAU)',
  meghalaya: 'Guwahati (GAU)',
  arunachal: 'Guwahati (GAU)',
  nagaland: 'Dimapur (DMU)',
  manipur: 'Imphal (IMF)',
  mizoram: 'Aizawl / Sairang',
  tripura: 'Agartala (IXA)',
  sikkim: 'Bagdogra (IXB)',
};

const EDITORIAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const MAP_VIEWBOX = { x: 40, y: 50, width: 565, height: 420 } as const;

function getTooltipAnchor(shape: StateShape) {
  const leftPct = ((shape.pinX - MAP_VIEWBOX.x) / MAP_VIEWBOX.width) * 100;
  const placeBelow = shape.pinY < 130;
  const anchorY = placeBelow ? shape.labelY + 14 : shape.pinY - 12;
  const topPct = ((anchorY - MAP_VIEWBOX.y) / MAP_VIEWBOX.height) * 100;

  let align: 'left' | 'center' | 'right' = 'center';
  if (leftPct < 24) align = 'left';
  else if (leftPct > 72) align = 'right';

  return { leftPct, topPct, placeBelow, align };
}

export const InteractiveNEMap: React.FC = () => {
  const {
    navigate,
    navigateToExploreWith,
    navigateToPermitsForStates,
    setPlanner,
  } = useTravel();

  const prefersReducedMotion = useReducedMotion();
  const [hoveredStateId, setHoveredStateId] = useState<StateId | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<StateId>('meghalaya');
  const [quickViewStateId, setQuickViewStateId] = useState<StateId | null>(null);

  // Close quick-view sidebar on Escape key
  useEffect(() => {
    if (!quickViewStateId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewStateId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [quickViewStateId]);

  // Keep state polygon DOM order stable so pointer clicks and hover transitions never drop mid-interaction

  const previewStateId = hoveredStateId ?? selectedStateId;
  const previewState =
    STATES.find((s) => s.id === previewStateId) ?? STATES[0];

  const hoveredShape =
    hoveredStateId && !quickViewStateId
      ? STATE_SHAPES.find((s) => s.id === hoveredStateId) ?? null
      : null;
  const hoveredStateObj = hoveredShape
    ? STATES.find((s) => s.id === hoveredShape.id) ?? null
    : null;
  const tooltipAnchor = hoveredShape ? getTooltipAnchor(hoveredShape) : null;

  const previewDestinationsCount = DESTINATIONS.filter(
    (d) => d.stateId === previewState.id
  ).length;

  const quickViewState = quickViewStateId
    ? STATES.find((s) => s.id === quickViewStateId) ?? null
    : null;

  const quickViewDestinations = quickViewState
    ? DESTINATIONS.filter((d) => d.stateId === quickViewState.id)
    : [];

  const quickViewPermitRule = quickViewState
    ? PERMIT_RULES[quickViewState.id]
    : null;

  const handleOpenStateQuickView = (stateId: StateId) => {
    setSelectedStateId(stateId);
    setQuickViewStateId(stateId);
  };

  const handlePlanTripInState = (stateId: StateId) => {
    const destIds = DESTINATIONS.filter((d) => d.stateId === stateId)
      .slice(0, 3)
      .map((d) => d.id);
    setPlanner((prev) => ({
      ...prev,
      startingHub: STATE_DEFAULT_HUB[stateId],
      destinationIds: destIds.length > 0 ? destIds : prev.destinationIds,
      days: Math.max(4, Math.min(7, destIds.length * 2 + 1)),
    }));
    setQuickViewStateId(null);
    navigate('/planner');
  };

  return (
    <section
      aria-labelledby="eight-sisters-heading"
      className="border-y border-[#E6E3DC] bg-[#F2EFE9]/55 py-20 md:py-24"
    >
      <div className="mx-auto max-w-[1280px] px-6 md:px-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="font-mono-data text-xs text-[#5C5B56]">
              01. Regional Cartography
            </p>
            <h2
              id="eight-sisters-heading"
              className="mt-2 font-editorial text-3xl font-medium text-[#161614] sm:text-4xl"
            >
              Explore the{' '}
              <em className="italic font-normal text-[#1E3F31]">Eight Sisters</em>{' '}
              by terrain &amp; gateway
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#5C5B56]">
            Hover any state to highlight its corridor, or click a region to open
            its quick-view transit, permit, and seasonal dossier.
          </p>
        </div>

        {/* 2-Column Balanced Split: SVG Map + Live State Preview Card */}
        <div className="mt-10 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Interactive SVG Map Canvas */}
          <div className="flex flex-col justify-between rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] p-6 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E3DC] pb-4">
              <span className="font-mono-data text-xs text-[#5C5B56]">
                NORTH EAST INDIA · 8 STATES
              </span>

              {/* Subtle Legend */}
              <div className="flex items-center gap-4 font-mono-data text-[11px] text-[#5C5B56]">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-xs border border-[#1E3F31] bg-[#DCE6E0]"
                  />
                  Hover
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-xs bg-[#1E3F31]"
                  />
                  Active
                </span>
              </div>
            </div>

            <div className="relative my-4 flex flex-1 flex-col items-center justify-center">
              {/* Live Hover Status Strip */}
              <div
                aria-live="polite"
                data-testid="map-hover-status"
                className="mb-2 flex min-h-[28px] w-full items-center justify-between rounded-lg bg-[#FAF9F6] px-3 py-1.5 font-mono-data text-[11px] text-[#5C5B56]"
              >
                {hoveredStateId ? (
                  <>
                    <span className="font-medium text-[#1E3F31]">
                      {previewState.name} · {previewState.primaryHub}
                    </span>
                    <span className="text-[#C25E3A]">
                      Click to open quick-view
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      Selected:{' '}
                      <strong className="text-[#161614]">
                        {previewState.name}
                      </strong>
                    </span>
                    <span>Hover to inspect · Click for full brief</span>
                  </>
                )}
              </div>

              <div className="relative w-full max-w-[580px]">
                <svg
                  viewBox={`${MAP_VIEWBOX.x} ${MAP_VIEWBOX.y} ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
                  role="group"
                  aria-label="Interactive map of the eight North Eastern states of India"
                  className="block h-auto w-full select-none overflow-visible"
                  onMouseLeave={() => setHoveredStateId(null)}
                >
                {/* Siliguri Corridor connecting Sikkim to Assam */}
                <path
                  d="M 132 192 Q 170 212, 206 214"
                  fill="none"
                  stroke="#8E8C84"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x="166"
                  y="226"
                  textAnchor="middle"
                  className="fill-[#706E67] text-[9px]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Siliguri Link
                </text>

                {/* Subtle Brahmaputra River Path */}
                <path
                  d="M 498 164 Q 422 194, 336 212 T 208 228"
                  fill="none"
                  stroke="#DCE6E0"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.65"
                  pointerEvents="none"
                />

                {STATE_SHAPES.map((shape) => {
                  const stateObj = STATES.find((s) => s.id === shape.id)!;
                  const isHovered = hoveredStateId === shape.id;
                  const isSelected = selectedStateId === shape.id;
                  const isQuickOpen = quickViewStateId === shape.id;
                  const isFocused = isHovered || isQuickOpen || isSelected;
                  const isDimmed = Boolean(hoveredStateId) && !isHovered && !isSelected;

                  const fillColor = isQuickOpen || isSelected
                    ? isHovered
                      ? '#152E24'
                      : '#1E3F31'
                    : isHovered
                      ? '#D4E2DA'
                      : '#F2EFE9';

                  const strokeColor =
                    isQuickOpen || isSelected
                      ? isHovered
                        ? '#C25E3A'
                        : '#141C18'
                      : isHovered
                        ? '#1E3F31'
                        : '#C8C3B8';

                  const strokeWidth =
                    isHovered ? 2.2 : isQuickOpen || isSelected ? 1.85 : 1.25;

                  const textColorClass =
                    isQuickOpen || isSelected
                      ? 'fill-[#FAF9F6]'
                      : isHovered
                        ? 'fill-[#141C18]'
                        : 'fill-[#161614]';

                  const pinColor =
                    isHovered || isQuickOpen || isSelected
                      ? '#C25E3A'
                      : stateObj.permitStatus === 'open'
                        ? '#2D6A4F'
                        : '#B45309';

                  const pathShadow = isHovered
                    ? 'drop-shadow(0px 6px 10px rgba(20, 28, 24, 0.14))'
                    : isQuickOpen || isSelected
                      ? 'drop-shadow(0px 3px 6px rgba(20, 28, 24, 0.1))'
                      : 'drop-shadow(0px 0px 0px rgba(20, 28, 24, 0))';

                  return (
                    <motion.g
                      key={shape.id}
                      role="button"
                      tabIndex={0}
                      data-state-id={shape.id}
                      data-hovered={isHovered ? 'true' : 'false'}
                      aria-label={`Inspect ${stateObj.name}`}
                      aria-expanded={isQuickOpen}
                      aria-describedby={
                        isHovered && !quickViewStateId
                          ? 'map-state-tooltip'
                          : undefined
                      }
                      style={{
                        transformBox: 'fill-box',
                        transformOrigin: 'center',
                      }}
                      initial={false}
                      animate={{
                        scale: prefersReducedMotion
                          ? 1
                          : isHovered
                            ? 1.045
                            : isQuickOpen
                              ? 1.02
                              : 1,
                        opacity: isDimmed ? 0.62 : 1,
                      }}
                      whileHover={
                        prefersReducedMotion ? undefined : { scale: 1.045 }
                      }
                      whileTap={
                        prefersReducedMotion ? undefined : { scale: 0.985 }
                      }
                      transition={{
                        duration: 0.22,
                        ease: EDITORIAL_EASE,
                      }}
                      onMouseEnter={() => setHoveredStateId(shape.id)}
                      onMouseLeave={() =>
                        setHoveredStateId((prev) =>
                          prev === shape.id ? null : prev
                        )
                      }
                      onFocus={() => setHoveredStateId(shape.id)}
                      onBlur={() =>
                        setHoveredStateId((prev) =>
                          prev === shape.id ? null : prev
                        )
                      }
                      onClick={() => handleOpenStateQuickView(shape.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleOpenStateQuickView(shape.id);
                        }
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <motion.path
                        d={shape.path}
                        strokeLinejoin="round"
                        initial={false}
                        animate={{
                          fill: fillColor,
                          stroke: strokeColor,
                          strokeWidth,
                          filter: pathShadow,
                        }}
                        transition={{
                          duration: 0.22,
                          ease: EDITORIAL_EASE,
                        }}
                      />
                      <motion.circle
                        cx={shape.pinX}
                        cy={shape.pinY}
                        r={3.2}
                        style={{
                          transformBox: 'fill-box',
                          transformOrigin: 'center',
                        }}
                        initial={false}
                        animate={{
                          fill: pinColor,
                          scale: prefersReducedMotion
                            ? 1
                            : isFocused
                              ? 1.4
                              : 1,
                        }}
                        transition={{
                          duration: 0.2,
                          ease: EDITORIAL_EASE,
                        }}
                      />
                      <text
                        x={shape.labelX}
                        y={shape.labelY}
                        textAnchor="middle"
                        className={`pointer-events-none text-[10.5px] font-semibold transition-colors duration-150 ${textColorClass}`}
                        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                      >
                        {shape.shortLabel}
                      </text>
                    </motion.g>
                  );
                })}
                </svg>

                {/* Custom Editorial Cartographic Tooltip on Hover / Focus */}
                <AnimatePresence>
                  {hoveredStateObj && tooltipAnchor && (
                    <motion.div
                      key={hoveredStateObj.id}
                      id="map-state-tooltip"
                      role="tooltip"
                      data-testid="map-state-tooltip"
                      data-tooltip-state={hoveredStateObj.id}
                      style={{
                        left: `${tooltipAnchor.leftPct}%`,
                        top: `${tooltipAnchor.topPct}%`,
                      }}
                      initial={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: tooltipAnchor.placeBelow ? -5 : 5,
                              scale: 0.96,
                            }
                      }
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={
                        prefersReducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              y: tooltipAnchor.placeBelow ? -3 : 3,
                              scale: 0.97,
                            }
                      }
                      transition={{ duration: 0.16, ease: EDITORIAL_EASE }}
                      className="pointer-events-none absolute z-30 h-0 w-0"
                    >
                      {/* Editorial Tooltip Surface */}
                      <div
                        className={`absolute w-max max-w-[235px] rounded-xl border border-[#2C3C34] bg-[#141C18] px-3.5 py-2.5 text-left shadow-[0_12px_28px_-10px_rgba(20,28,24,0.42)] ${
                          tooltipAnchor.placeBelow ? 'top-2' : 'bottom-2'
                        } ${
                          tooltipAnchor.align === 'left'
                            ? '-left-5'
                            : tooltipAnchor.align === 'right'
                              ? '-right-5'
                              : 'left-0 -translate-x-1/2'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            aria-hidden="true"
                            className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C25E3A]"
                          />
                          <p
                            data-testid="map-tooltip-name"
                            className="font-editorial text-[17px] leading-tight tracking-[-0.01em] text-[#FAF9F6]"
                          >
                            {hoveredStateObj.name}
                          </p>
                        </div>

                        <div className="my-1.5 h-px w-full bg-[#FAF9F6]/12" />

                        <p className="font-mono-data text-[9px] uppercase tracking-[0.12em] text-[#A8B5AD]">
                          Primary Entry Hub
                        </p>
                        <p
                          data-testid="map-tooltip-hub"
                          className="mt-0.5 font-mono-data text-[11.5px] font-medium leading-snug text-[#FAF9F6]"
                        >
                          {hoveredStateObj.primaryHub}
                        </p>
                      </div>

                      {/* Pin-aligned architectural pointer diamond */}
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 z-10 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-[#2C3C34] bg-[#141C18] ${
                          tooltipAnchor.placeBelow
                            ? 'top-[3px] border-t border-l'
                            : 'bottom-[3px] border-r border-b'
                        }`}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Interactive State Strip for effortless mobile/keyboard quick-view */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#E6E3DC] pt-4 no-scrollbar">
              {STATES.map((state) => {
                const isSelected = state.id === selectedStateId;
                const isHovered = state.id === hoveredStateId;
                return (
                  <button
                    key={state.id}
                    type="button"
                    onMouseEnter={() => setHoveredStateId(state.id)}
                    onMouseLeave={() => setHoveredStateId(null)}
                    onClick={() => handleOpenStateQuickView(state.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-[#1E3F31] text-[#FAF9F6]'
                        : isHovered
                          ? 'bg-[#DCE6E0] text-[#161614]'
                          : 'bg-[#F2EFE9] text-[#5C5B56] hover:bg-[#DCE6E0] hover:text-[#161614]'
                    }`}
                  >
                    {state.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live State Preview Card (Updates on Hover or Selection) */}
          <article className="flex flex-col overflow-hidden rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF] lg:col-span-5">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <EditorialImage
                src={previewState.signatureImage}
                alt={`${previewState.name} landscape`}
                fallbackLabel={previewState.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
              <div>
                <div className="flex items-center justify-between gap-2 font-mono-data text-xs text-[#5C5B56]">
                  <span>Capital: {previewState.capital}</span>
                  <span>
                    {previewDestinationsCount}{' '}
                    {previewDestinationsCount === 1 ? 'Guide' : 'Guides'}
                  </span>
                </div>

                <h3 className="mt-2 font-editorial text-3xl font-medium text-[#161614]">
                  {previewState.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-[#1E3F31]">
                  {previewState.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#5C5B56]">
                  {previewState.summary}
                </p>

                {/* Architectural Metadata Hairline List */}
                <dl className="mt-5 divide-y divide-[#E6E3DC] border-y border-[#E6E3DC] text-xs">
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#5C5B56]">Primary Transit Hub</dt>
                    <dd className="font-mono-data font-medium text-[#161614]">
                      {previewState.primaryHub}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#5C5B56]">Permit Status</dt>
                    <dd
                      className={`inline-flex items-center gap-1.5 font-mono-data font-medium ${
                        previewState.permitStatus === 'open'
                          ? 'text-[#2D6A4F]'
                          : 'text-[#B45309]'
                      }`}
                    >
                      {previewState.permitStatus === 'open' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                      ) : (
                        <FileCheck2 className="h-3.5 w-3.5" strokeWidth={1.6} />
                      )}
                      <span>{previewState.permitSummary}</span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <dt className="text-[#5C5B56]">Best Travel Months</dt>
                    <dd className="font-mono-data font-medium text-[#161614]">
                      {previewState.bestMonths}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenStateQuickView(previewState.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-5 py-2.5 text-sm font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24] whitespace-nowrap"
                >
                  <Compass className="h-4 w-4" strokeWidth={1.5} />
                  <span>Open {previewState.name} Brief</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigateToExploreWith({ state: previewState.id })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E3F31] hover:underline whitespace-nowrap"
                >
                  <span>Explore {previewState.name}</span>
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Quick-View Slide-Over Sidebar Modal triggered on State Click */}
      <AnimatePresence>
        {quickViewState && quickViewPermitRule && (
          <motion.div
            key="state-quickview-modal"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.28 }}
            className="no-print fixed inset-0 z-50 flex justify-end"
            role="dialog"
            aria-modal="true"
            aria-labelledby="state-quickview-title"
            data-testid="state-quickview-sidebar"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setQuickViewStateId(null)}
              className="fixed inset-0 bg-[#141C18]/45 backdrop-blur-xs"
            />

            {/* Slide-Over Panel */}
            <motion.aside
              initial={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: '100%' }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              className="relative z-10 flex h-full w-full max-w-lg flex-col border-l border-[#E6E3DC] bg-[#FAF9F6]"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between border-b border-[#E6E3DC] px-6 py-4">
                <div>
                  <p className="font-mono-data text-[11px] text-[#5C5B56]">
                    State Quick-View · Capital: {quickViewState.capital}
                  </p>
                  <h2
                    id="state-quickview-title"
                    className="font-editorial text-2xl font-medium text-[#161614]"
                  >
                    {quickViewState.name}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setQuickViewStateId(null)}
                  aria-label={`Close ${quickViewState.name} quick-view`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] text-[#161614] transition-colors hover:border-[#1E3F31]"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* Hero Photo */}
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-[#E6E3DC]">
                  <EditorialImage
                    src={quickViewState.signatureImage}
                    alt={`${quickViewState.name} editorial photograph`}
                    fallbackLabel={quickViewState.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <p className="mt-4 text-sm font-medium text-[#1E3F31]">
                  {quickViewState.tagline}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#5C5B56]">
                  {quickViewState.summary}
                </p>

                {/* Core 3 Field Essentials: Transit Hub, Permit Status, Best Months */}
                <dl className="mt-5 divide-y divide-[#E6E3DC] rounded-2xl border border-[#E6E3DC] bg-[#FFFFFF]">
                  <div className="flex items-start gap-3.5 p-4">
                    <Navigation
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3F31]"
                      strokeWidth={1.6}
                    />
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs text-[#5C5B56]">
                        Primary Transit Hub
                      </dt>
                      <dd
                        data-testid="quickview-transit-hub"
                        className="mt-0.5 font-mono-data text-sm font-medium text-[#161614]"
                      >
                        {quickViewState.primaryHub}
                      </dd>
                      <p className="mt-1 text-xs text-[#5C5B56]">
                        Checkpoints &amp; gateways:{' '}
                        {quickViewPermitRule.indian.checkposts}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4">
                    {quickViewState.permitStatus === 'open' ? (
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
                        strokeWidth={1.6}
                      />
                    ) : (
                      <FileCheck2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#B45309]"
                        strokeWidth={1.6}
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs text-[#5C5B56]">
                        Permit Requirement Status
                      </dt>
                      <dd
                        data-testid="quickview-permit-status"
                        className={`mt-0.5 font-mono-data text-sm font-medium ${
                          quickViewState.permitStatus === 'open'
                            ? 'text-[#2D6A4F]'
                            : 'text-[#B45309]'
                        }`}
                      >
                        {quickViewPermitRule.indian.code} ·{' '}
                        {quickViewState.permitSummary}
                      </dd>
                      <p className="mt-1 text-xs text-[#5C5B56]">
                        Indian fee: {quickViewPermitRule.indian.feeDisplay} ·
                        Portal:{' '}
                        <span className="font-mono-data text-[#161614]">
                          {quickViewPermitRule.indian.portal}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4">
                    <Calendar
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#1E3F31]"
                      strokeWidth={1.6}
                    />
                    <div className="min-w-0 flex-1">
                      <dt className="text-xs text-[#5C5B56]">
                        Best Travel Months
                      </dt>
                      <dd
                        data-testid="quickview-best-months"
                        className="mt-0.5 font-mono-data text-sm font-medium text-[#161614]"
                      >
                        {quickViewState.bestMonths}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* Featured Destinations inside this State */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl font-medium text-[#161614]">
                      Featured places in {quickViewState.name}
                    </h3>
                    <span className="font-mono-data text-xs text-[#5C5B56]">
                      {quickViewDestinations.length}{' '}
                      {quickViewDestinations.length === 1 ? 'Place' : 'Places'}
                    </span>
                  </div>

                  <ul className="mt-3 space-y-2.5">
                    {quickViewDestinations.map((dest) => (
                      <li key={dest.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setQuickViewStateId(null);
                            navigate(`/destination/${dest.slug}`);
                          }}
                          className="group flex w-full items-center justify-between gap-3 rounded-xl border border-[#E6E3DC] bg-[#FFFFFF] px-4 py-3 text-left transition-colors hover:border-[#1E3F31]"
                        >
                          <div className="min-w-0">
                            <span className="block truncate font-editorial text-lg font-medium text-[#161614] group-hover:text-[#1E3F31]">
                              {dest.name}
                            </span>
                            <span className="font-mono-data text-[11px] text-[#5C5B56]">
                              {dest.elevationMeters.toLocaleString('en-IN')}m · ~
                              {formatINR(dest.dailyBudgetINR.backpacker)}/day ·{' '}
                              {dest.hubTravelHours}h from hub
                            </span>
                          </div>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-[#5C5B56] transition-transform group-hover:translate-x-0.5 group-hover:text-[#1E3F31]"
                            strokeWidth={1.5}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 border-t border-[#E6E3DC] bg-[#FFFFFF] px-6 py-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const id = quickViewState.id;
                      setQuickViewStateId(null);
                      navigateToExploreWith({ state: id });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1E3F31] px-4 py-2.5 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-[#152E24] whitespace-nowrap"
                  >
                    <MapPin className="h-3.5 w-3.5" strokeWidth={1.6} />
                    <span>Explore {quickViewState.name}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePlanTripInState(quickViewState.id)}
                    className="rounded-xl border border-[#E6E3DC] bg-[#FAF9F6] px-4 py-2.5 text-xs font-semibold text-[#161614] transition-colors hover:border-[#1E3F31] hover:text-[#1E3F31] whitespace-nowrap"
                  >
                    Plan Trip Here
                  </button>
                </div>

                {quickViewState.permitStatus !== 'open' && (
                  <button
                    type="button"
                    onClick={() => {
                      const id = quickViewState.id;
                      setQuickViewStateId(null);
                      navigateToPermitsForStates([id]);
                    }}
                    className="text-xs font-semibold text-[#C25E3A] hover:underline whitespace-nowrap"
                  >
                    Full Permit Steps
                  </button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
