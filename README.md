<div align="center">

# TravelMateNE

### *Discover the Eight Sisters. Plan Effortlessly. Travel Deeper.*

An editorial tourism discovery and independent trip-planning platform for **North East India**—covering **Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Sikkim**.

![React](https://img.shields.io/badge/React-19-1E3F31?style=flat-square&logo=react&logoColor=FAF9F6)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-1E3F31?style=flat-square&logo=typescript&logoColor=FAF9F6)
![Vite](https://img.shields.io/badge/Vite-8-1E3F31?style=flat-square&logo=vite&logoColor=FAF9F6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-C25E3A?style=flat-square&logo=tailwindcss&logoColor=FAF9F6)
![Motion](https://img.shields.io/badge/Motion-Framer_Animations-1E3F31?style=flat-square)
![jsPDF](https://img.shields.io/badge/jsPDF-Single--Page_Vector_PDF-C25E3A?style=flat-square)

</div>

---

## Why TravelMateNE

Independent travelers exploring North East India routinely run into three practical barriers. TravelMateNE is designed around solving each of them with grounded field knowledge and zero clutter:

1. **Fragmented Discovery** — Hidden valleys, community homestays, living root bridges, sacred groves, and year-round regional festivals are unified in one structured editorial directory across all eight states.
2. **Opaque Local Transit** — Real shared Sumo counters, ASTC/SNT state bus connections, river ferry gates, railheads, and mountain driving times are decoded from the six main entry gateways (*Guwahati, Bagdogra, Dimapur, Imphal, Agartala,* and *Aizawl / Sairang*).
3. **Budget & Permit Confusion** — Realistic all-in INR budget math splits rooms per pair and private SUVs per four travelers while keeping shared transport, meals, and state permits scaled per person—paired with verified Inner Line Permit (ILP) and Protected Area Permit (PAP) rules for both Indian citizens and foreign nationals.

---

## Curated Regional Dataset

| Coverage Domain | Depth | Details |
| :--- | :---: | :--- |
| **States Covered** | `8` | Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, Sikkim |
| **Destinations** | `26` | Detailed field dossiers with elevations, GPS coordinates, transit tables, local food, homestays, etiquette, and day-by-day plans |
| **Festival Calendar** | `18` | Year-round calendar spanning all **12 months** with typical dates, booking lead times, and permit reminders |
| **Regional Kitchens** | `16` | Two signature dishes per state with dietary filters (`Veg-Friendly` & `Non-Veg`), flavor notes, and street/homestay price ranges |
| **Living Heritage & Markets** | `8` | Iconic crafts, UNESCO monuments, sacred forests, and community-run markets (e.g., Ima Keithel, Samaguri Mask Satra, Charaideo Maidams) |
| **Starter Circuits** | `8` | One-click route blueprints ready to load directly into the Trip & Budget Planner |
| **Gateway Transit Hubs** | `6` | Guwahati (GAU), Bagdogra (IXB), Dimapur (DMU), Imphal (IMF), Agartala (IXA), and Aizawl / Sairang |

---

## Core Features

### 1. Interactive Eight Sisters Cartography (`InteractiveNEMap`)
- Custom vector SVG map of all eight North Eastern states with smooth **Framer Motion** hover scaling, fill/stroke transitions, and neighbor dimming for clear spatial focus.
- **Editorial Hover Tooltips** displaying each state's name and primary transit entry hub, dynamically clamped to prevent edge clipping.
- Interactive quick-view state brief card and modal displaying primary transit hub, permit status (`Open`, `ILP Required`, or `Zone PAP`), best travel months, and direct filter links into the Explore directory.

### 2. Live Global Navbar Search (`NavbarSearch`)
- Accessible from every page—inline in the desktop header (`lg+`) with a `/` keyboard shortcut, and via a one-tap expandable search bar on mobile and tablet viewports.
- Searches simultaneously across **destination names** (with automatic diacritic normalization so `dzukou` matches *Dzükou Valley*), **states & sub-regions**, **entry hubs**, **activity categories** (`Trekking`, `Wildlife`, `Heritage`, `Highlands`, `Offbeat`), and **experience highlights**.
- Displays ranked live dropdown results with thumbnails, match-type badges (`Name`, `Region`, `Activity`), daily INR costs, permit status, full keyboard navigation (`↑`, `↓`, `Enter`, `Esc`), and a **View all in Explore** transfer action.

### 3. Editorial Destination Directory & Field Dossiers (`/explore` & `/destination/:slug`)
- Multi-axis filtering by **State**, **Category**, **Permit Status**, **Budget Tier**, **Hidden Gems Only**, **Search Query**, and sorting (`Recommended`, `Lowest Daily Cost`, `Shortest Hub Transit`).
- Each destination dossier presents a **Transit Decoder Table** (comparing Shared Sumo/Winger, State Bus, Train + Taxi, and Private Cab), **Stay & Local Food Grid**, **Local Etiquette Guidelines**, and one-click actions to **Bookmark** or **Add to Trip Planner**.

### 4. Interactive Budget & Trip Planner (`/planner`)
- Configure starting entry hub, up to 4 destinations, duration (`2–12 days`), group size (`1–6 travelers`), stay/dining tier (`Backpacker`, `Balanced`, `Comfort`), and intercity transport mode (`Shared Sumo & Bus` vs. `Private Cab / SUV`).
- Accurate group economics:
  - Rooms scale as `ceil(groupSize / 2)`
  - Private SUVs scale as `ceil(groupSize / 4)`
  - Shared transit, food, experiences, and permits scale linearly per traveler
  - Automatic comparison savings callout between shared transit and dedicated SUVs
- Generates a structured **Day-by-Day Editorial Schedule** with morning, afternoon, evening plans and transit leg notes, plus automatic ILP/PAP permit cost triggers.

### 5. Single-Page Continuous Vector PDF Export (`pdfExport.ts`)
- Built with pure vector **jsPDF** two-pass height measurement—never splits across awkward A4 page breaks.
- Dynamically calculates the exact height required for the selected itinerary and exports a **1-page continuous custom-dimension editorial dossier** (`680 pt` wide × dynamic height) featuring the dark forest masthead, stacked cost bar chart, itemized INR breakdown, permit action alert, full day-by-day timeline, destination food/stay field notes, and colophon.
- Sanitizes typography for crisp cross-viewer PDF rendering and downloads directly as a `.pdf` file without relying on browser print dialogs.

### 6. Transit Guide, Permit Navigator & Culture Hub
- **Transit Guide (`/transit`):** Gateway-by-gateway matrix comparing shared Sumo stands, timings, fares, and realistic mountain transit hours across all destinations.
- **Permit Navigator (`/permits`):** Interactive eligibility checker toggling **Indian Citizen** vs. **Foreign National** across selected states, complete with official government portals, fees, physical checkpost gates, and a persistent pre-departure document checklist.
- **Culture & Kitchens (`/culture`):** Month-by-month festival calendar across all 12 months, filterable regional cuisine index, and living heritage spotlight.

### 7. Persistent Saved Drawer (`SavedDrawer`)
- Client-side persistence via `localStorage` for bookmarked destinations, saved itineraries (with one-click reload into the planner), active planner configurations, and permit checklist progress.

---

## Visual Design System

TravelMateNE follows **Modern Editorial Minimalism**—generous whitespace, architectural `1px` hairlines, tactile natural tones, and zero cluttered gradients.

### Color Palette

| Token | Hex | Role |
| :--- | :--- | :--- |
| `--bg-canvas` | `#FAF9F6` | Warm Alabaster — primary page background |
| `--bg-surface` | `#FFFFFF` | Crisp White — elevated cards, dropdowns & modals |
| `--bg-subtle` | `#F2EFE9` | Soft Stone — secondary containers & table headers |
| `--bg-dark` | `#141C18` | Deep Forest Ink — editorial mastheads & footer |
| `--text-primary` | `#161614` | Charcoal Ink — primary headings & body text |
| `--text-secondary` | `#5C5B56` | Muted Slate — supporting editorial copy |
| `--accent-primary` | `#1E3F31` | Deep Pine — primary actions & active navigation |
| `--accent-warm` | `#C25E3A` | Muga Terracotta — highlights, tags & map focus |
| `--accent-mist` | `#DCE6E0` | Soft Sage Wash — subtle active states |
| `--border-subtle` | `#E6E3DC` | Architectural hairline borders |

### Typography
- **Editorial Display:** `Instrument Serif` (headings & italicized editorial emphasis)
- **Interface & Body:** `Plus Jakarta Sans` (clean UI controls and readable long-form notes)
- **Data & Coordinates:** `JetBrains Mono` (INR budgets, elevations, travel durations, and permit codes)

---

## Project Architecture

```text
├── index.html                           # Fonts, SEO/OpenGraph metadata, root mount
├── metadata.json                        # App metadata
├── vite.config.ts                       # Vite 8 + React + Tailwind v4 + asset copy plugin
├── src/
│   ├── App.tsx                          # Client router & persistent shell layout
│   ├── index.css                        # Design tokens, typography classes & print rules
│   ├── context/
│   │   └── TravelContext.tsx            # Global routing, filters, planner, bookmarks & persistence
│   ├── types/
│   │   └── travel.ts                    # Domain TypeScript interfaces
│   ├── data/
│   │   ├── states.ts                    # 8 North Eastern states metadata & imagery
│   │   ├── destinations.ts              # 26 complete destination field dossiers
│   │   ├── festivals.ts                 # 18 festivals, 16 regional dishes & 8 heritage sites
│   │   ├── permits.ts                   # Official ILP/PAP rules, fees, portals & gates
│   │   └── circuits.ts                  # 8 starter route circuits & curated collections
│   ├── utils/
│   │   ├── search.ts                    # Ranked name/region/activity search + diacritic folding
│   │   ├── search.test.ts               # Unit tests for search relevance & normalization
│   │   ├── filters.ts                   # Multi-filter & sort logic for Explore directory
│   │   ├── filters.test.ts              # Unit tests for dataset integrity, filters & permits
│   │   ├── planner.ts                   # INR group budget calculator & itinerary generator
│   │   ├── planner.test.ts              # Unit tests for room/vehicle/permit scaling & schedules
│   │   ├── permits.ts                   # Citizen vs. foreign permit evaluation logic
│   │   ├── pdfExport.ts                 # Two-pass single-page custom-dimension vector PDF engine
│   │   └── pdfExport.test.ts            # Unit tests verifying single-page PDF geometry & output
│   ├── components/
│   │   ├── layout/                      # Navbar, NavbarSearch, Footer, SavedDrawer
│   │   ├── home/                        # HeroSearch, InteractiveNEMap, CuratedCollections
│   │   ├── explore/                     # FilterBar, DestinationCard
│   │   ├── destination/                 # TransitDecoderTable, StayAndFoodGrid
│   │   ├── planner/                     # TripControls, BudgetBreakdown, ItineraryTimeline
│   │   ├── permits/                     # PermitChecker
│   │   ├── culture/                     # FestivalCalendar (Festivals, Kitchens & Heritage)
│   │   └── shared/                      # EditorialImage
│   └── pages/
│       ├── HomePage.tsx                 # Editorial landing, map, collections & starter circuits
│       ├── ExplorePage.tsx              # Full filterable 26-destination directory
│       ├── DestinationDetailPage.tsx    # Deep-dive destination dossier
│       ├── PlannerPage.tsx              # Interactive budget & itinerary builder + PDF export
│       ├── TransitGuidePage.tsx         # Gateway transit matrix across all 6 hubs
│       ├── PermitsPage.tsx              # ILP & PAP navigator & checklist
│       └── CulturePage.tsx              # Festivals, regional kitchens & living heritage
```

---

## Getting Started

### Prerequisites
- **Node.js** `20+`
- **npm** `10+`

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server on http://localhost:3000
npm run dev
```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Launches the Vite dev server on port `3000` |
| `npm run build` | Builds the optimized production bundle into `dist/` |
| `npm run preview` | Serves the production build locally for inspection |
| `npm run lint` | Runs strict TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts (`dist/`) |

### Running the Unit Test Suite

Core pure-logic modules are decoupled from React components and verified using Node's native test runner (`node:test`) via `tsx`:

```bash
npx tsx --test src/utils/search.test.ts src/utils/filters.test.ts src/utils/planner.test.ts src/utils/pdfExport.test.ts
```

Test coverage includes:
- Dataset integrity across all 8 states, 12 festival months, regional cuisine balance, and starter circuit references
- Relevance-ranked search across destination names, diacritics, regions, and activity keywords
- Explore directory multi-filter and sort behavior
- INR currency formatting, room/vehicle group-size scaling, permit fee triggers, and day-by-day itinerary generation
- Single-page custom-dimension PDF verification (`pageCount === 1`, `680 pt` width, dynamic height, valid `%PDF-` bytes, WinAnsi glyph safety)

---

## Local Persistence

All traveler state is stored locally in the browser with no sign-up required:

- `travelmatene_saved_places_v1` — Bookmarked destinations
- `travelmatene_saved_itineraries_v1` — Saved custom trips & budget snapshots
- `travelmatene_planner_state_v1` — Active trip planner configuration
- `travelmatene_permit_checklist_v1` — Pre-departure permit document checklist

---

<div align="center">

*TravelMateNE — Independent North East India Field Guide*
*Always verify seasonal mountain road conditions and official state permit portals prior to frontier crossings.*

</div>
