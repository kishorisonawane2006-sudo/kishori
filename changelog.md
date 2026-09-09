# Changelog

All notable changes to the **Generic Medicine Store & Multi-Tenant SaaS Platform** (`kishori`) are documented in this chronological file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Release Summary Matrix

| Version | Release Date | Primary Focus | Key Deliverables | Status |
| :--- | :--- | :--- | :--- | :--- |
| **[Unreleased]** | Future | EHR & 3PL Integration | FHIR/HL7 direct ingest, automated courier webhooks | Planned |
| **[1.4.0]** | 2026-09-09 | Phase 1 Production Hardening | Shared utils, common components, env config, quality gates | Active / Current |
| **[2.4.0]** | 2026-09-09 | Architecture & AI Context | In-app PRD, Architecture visualizer, AI context docs | Verified |
| **[2.3.0]** | 2026-09-06 | Authentication & Profile | Health profile, insurance BIN/PCN, multi-role auth | Verified |
| **[2.2.0]** | 2026-09-03 | Multi-Tenant Portal | Pharmacy operations, order Kanban, vendor repricing | Verified |
| **[2.1.0]** | 2026-08-30 | Price Comparison & Cart | Salt vs brand comparison, savings badges, Rx upload | Verified |
| **[2.0.0]** | 2026-08-25 | Domain & Multi-Tenancy | Strict TypeScript types, schema-per-tenant isolation | Verified |
| **[1.1.0]** | 2026-08-18 | Backend Foundation | Express skeleton, tsx runner, Google GenAI SDK | Verified |
| **[1.0.0]** | 2026-08-10 | Project Inception | Base Vite + React 19 scaffold, PRD initial draft | Baseline |

---

## [Unreleased]

### Added
- Automated direct electronic health record (EHR) prescription ingestion using FHIR / HL7 standard.
- Gemini AI automated drug-drug interaction warning modal before cart checkout.
- Automated third-party logistics (3PL) courier webhooks for instant delivery dispatch to Dunzo, Shadowfax, and FedEx.

### Changed
- Transitioning Redis Sentinel caching layer to cluster mode for high-throughput Buy-Box lookups across 50,000+ SKUs.

### Fixed
- Pending resolution for cold-start latency on initial handwritten prescription image parsing.

### Removed
- Deprecated legacy manual order dispatch status polling once webhook consumers are active.

---

## [1.4.0] - 2026-09-09

### Added

**`src/utils/` — Pure Utility Library (new directory)**
- `formatters.ts`: 19 pure utility functions with zero React dependencies:
  - Currency: `formatCurrency()`, `formatCompactCurrency()` (compact dashboard GMV display)
  - Savings: `calculateSavingsAmount()`, `calculateSavingsPercent()`, `isHighSavings()` (≥40% threshold)
  - Cold-chain: `isColdChainOptimal()`, `isColdChainBreached()`, `formatTemperature()`, `getColdChainStatusLabel()`
  - Formatting: `formatPercent()`, `formatDate()`, `formatRelativeDate()`
  - PHI masking (ADR-010): `maskPhone()` (last 4 digits preserved), `maskEmail()` (domain visible only)
  - Drug labels: `formatDosageLabel()`, `normalizeDrugName()`, `getPrimaryActiveSalt()`
  - Math helpers: `clamp()`, `round()`
- `buyBoxHelpers.ts`: Frontend-mirrored Buy-Box scoring (ADR-004):
  - `computeBuyBoxScore()` — weighted composite score (0.70 price + 0.20 stock + 0.10 proximity)
  - `findBuyBoxWinner()` — selects winning listing index from active candidates
  - `calculateRepricedUnit()` — floor-price-aware repricing projection
- `index.ts`: Barrel export for clean single-import access across the codebase

**`src/components/common/` — Shared Presentational Atoms (new directory)**
- `SavingsBadge.tsx`: Dual-variant (pill / card) savings display; per rules.md §4.2 every medicine card must show brand MRP, generic price, and percentage saved
- `BioEquivalenceBadge.tsx`: Classifies and renders FDA Orange Book AB / CDSCO Approved / Pending ratings with semantic color tier mapping
- `ColdChainBadge.tsx`: Dual-variant (pill / panel) cold-chain temperature indicator with live-pulse animation; uses rose-600 for breach, emerald-600 for optimal per ADR-012
- `EmptyState.tsx`: Accessible empty state with `role="status"` and `aria-live="polite"` for search, cart, orders, and inventory views per rules.md §1.3
- `OrderStatusBadge.tsx`: Color-coded lifecycle status pill mapping all 8 `PlatformOrder.status` values to semantic design tokens
- `RxRequiredBadge.tsx`: Dual-variant (pill / banner) Rx requirement indicator; amber for Schedule H, emerald for OTC per ADR-012
- `LoadingSpinner.tsx`: Accessible spinner (sm/md/lg) for async operations including Gemini OCR cold-start (2.5–4s)
- `index.ts`: Barrel export for all common components

**Project Configuration**
- `package.json`: Corrected project `name` from `react-example` to `generic-medicine-store`; bumped `version` to `1.4.0` aligning with Phase 1 milestone target
- `.env.example`: Expanded from 2 variables to 26 documented environment variables covering all subsystems:
  - AI/OCR: `GEMINI_API_KEY`, `VITE_GEMINI_API_KEY`
  - Server: `PORT`, `NODE_ENV`, `APP_URL`, `VITE_API_BASE_URL`
  - Auth (ADR-010): `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `JWT_EXPIRES_IN_SECONDS`
  - Database (ADR-001): `DATABASE_URL`, `DATABASE_POOL_MAX`
  - Redis (ADR-004): `REDIS_URL`, `REDIS_SENTINEL_MASTER`, `BUY_BOX_CACHE_TTL_SECONDS`
  - Storage (ADR-010): `PRESCRIPTION_BUCKET_NAME`, `CLOUD_STORAGE_REGION`, `PRESCRIPTION_URL_TTL_SECONDS`
  - Payments (ADR-007): `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
  - IoT (ADR-008): `MQTT_BROKER_URL`, `MQTT_USERNAME`, `MQTT_PASSWORD`
  - Feature flags: `ENABLE_GEMINI_OCR`, `ENABLE_LIVE_DATABASE`, `ENABLE_REDIS_BUY_BOX`, `DISABLE_HMR`

### Verified

- **Phase 1 Quality Gates: 11/11 PASS** (`npm run test:phase1`)
  - Gate 1–3: Multi-tenant schema isolation — zero cross-tenant data leakage (ADR-001)
  - Gate 4–6: Buy-Box scoring accuracy + sub-50ms SLA (0.13ms actual) + floor-price enforcement (ADR-004)
  - Gate 7–8: Dual-stage Rx pipeline — OCR extraction + pharmacist sign-off advancing order to `Dispensing` (ADR-005)
  - Gate 9–10: Cold-chain telemetry — optimal recording + automatic breach quarantine & re-dispatch (ADR-008)
  - Gate 11: Savings matrix accuracy — 80% savings confirmed ($42 brand MRP → $8.40 generic) (ADR-003)
- **TypeScript lint: zero errors** (`npm run lint` / `tsc --noEmit`)

---

## [2.4.0] - 2026-09-09

### Added
- **Persistent AI Development Context:** Created comprehensive centralized documentation files (`decisions.md`, `rules.md`, `memory.md`, `changelog.md`, and `phase.md`) enabling long-term memory, strategic phased roadmap tracking, and autonomous paired coding.
- **In-App PRD Specification Dossier (`PrdViewer.tsx`):** Added complete 12-section interactive Product Requirements Document with printable PDF stylesheet, sticky table of contents, and executive summary.
- **System Architecture Explorer (`ArchitectureExplorer.tsx`):** Added interactive visual inspection interface for the 6 architectural tiers (Client, Edge/WAF, IAM Context Resolver, Modular Monolith, Multi-Tenant Database, and External Integrations).
- **Responsive Frame Switcher:** Added top-level mobile device frame toggle (`phoneFrame`) in `App.tsx` allowing one-click preview between desktop workstation view and native mobile viewport ($412\text{ px}$).
- **Cold-Chain IoT Telemetry Indicators:** Integrated real-time temperature telemetry status (`2°C - 8°C Optimal`) on sensitive orders (Insulin, biologics) in patient and portal tracking views.

### Changed
- Refactored `App.tsx` to handle fluid transitions between 6 core navigation modes: `patient`, `portal`, `architecture`, `prd`, `login`, and `profile`.
- Upgraded Tailwind CSS v4 styling rules to ensure WCAG AA contrast compliance on all price savings badges and medical alert pills.
- Standardized currency formatting across all pricing cards to reflect exact dollar savings and percentage discounts.

### Fixed
- Fixed layout clipping on smaller desktop viewports within `OrdersPipelineScreen.tsx`.
- Resolved an issue in `CartScreen.tsx` where prescription upload thumbnails failed to render when image size exceeded 2MB.

### Removed
- Removed hardcoded temporary debug navigation buttons from `NavigationHeader.tsx` in favor of the clean mode pill switcher and `MenuBarDrawer.tsx`.

---

## [2.3.0] - 2026-09-06

### Added
- **Comprehensive Patient Health Profile (`ProfileScreen.tsx`):**
  - Section for tracking chronic medical conditions and verified drug allergies with warning highlights.
  - Health insurance card capture with RxBIN, RxPCN, and Group Number support.
  - Emergency contact records and verified primary shipping address.
  - Active login session manager displaying browser, IP address, device type, and remote session revocation.
- **Dedicated Multi-Role Authentication Page (`LoginPage.tsx`):**
  - Instant role switcher for demoing: Patient, Pharmacy Admin, and SuperAdmin roles.
  - Two-factor authentication (2FA) status and HIPAA consent timestamp recording.

### Changed
- Consolidated user state into `UserProfile` interface with nested emergency contact and insurance records.
- Enhanced navigation header to show current active user profile avatar, name, and role title.

### Fixed
- Fixed session persistence issue where logging out did not properly reset tenant-specific view states.

### Removed
- Removed legacy mock user objects with flat schema formats in `userData.ts` in favor of typed `UserProfile` models.

---

## [2.2.0] - 2026-09-03

### Added
- **Multi-Tenant Pharmacy Operations Portal (`/portal`):**
  - **Overview Dashboard (`OverviewScreen.tsx`):** Executive GMV tracking, Buy-Box win rate percentage, order turnaround SLA, and revenue trend graphs.
  - **Multi-Tenant Organization Management (`MultiTenantScreen.tsx`):** Provisioning interface for pharmacy chains (Apollo, MedPlus, Wellness Forever) with schema allocation, database partition monitoring, Redis cache sizes, and rate limit quotas.
  - **Orders Pipeline Kanban (`OrdersPipelineScreen.tsx`):** Real-time order queue categorized by status: `Validating Rx`, `Dispensing`, `Cold-Chain Packaged`, `Awaiting Pickup`, and `In-Transit`.
  - **Pharmacist Digital Sign-Off Modal:** Allows licensed pharmacists to inspect prescription images, verify prescribing doctor registration numbers, and digitally sign approval before dispensing.
  - **Vendor Listings & Repricing Engine (`VendorListingsScreen.tsx`):** Real-time SKU inventory grid displaying unit price, competitor lowest price, Buy-Box status (`winning`, `beaten`, `paused`), and automated repricing triggers.

### Changed
- Modularized portal layout into `PortalHeader.tsx`, `PortalSidebar.tsx`, and dedicated sub-screen components.
- Separated tenant-specific inventory data from global drug master definitions in `initialData.ts`.

### Fixed
- Resolved Buy-Box status calculation race condition where vendor undercut prices were not reflected in the winning badge.

### Removed
- Removed unsegmented single-tenant order arrays in `src/data/initialData.ts`.

---

## [2.1.0] - 2026-08-30

### Added
- **Patient Price Comparison Engine (`PriceCompareScreen.tsx`):**
  - Side-by-side comparison cards comparing high-cost branded drugs against low-cost generic equivalents.
  - Calculated savings pill displaying net dollars saved and percentage discount (e.g., `Save 82% ($38.00)`).
  - CDSCO / FDA Orange Book bio-equivalence rating badges (`AB Rated`, `Therapeutic Equivalent`).
- **Interactive Cart & Rx Requirement Flow (`CartScreen.tsx`):**
  - Real-time quantity modifier with immediate recalculation of total savings.
  - Prescription requirement validation blocking checkout until valid Rx is uploaded.
  - Client-side drag-and-drop prescription uploader with thumbnail preview.
- **Live Order Tracking (`OrderTrackingScreen.tsx`):**
  - Visual status progress bar: Order Placed $\rightarrow$ Rx Verified $\rightarrow$ Dispensed $\rightarrow$ In-Transit $\rightarrow$ Delivered.
  - Courier vehicle assignment, driver name, live ETA, and GPS coordinates.

### Changed
- Improved search algorithm in `PatientHeader.tsx` to support searching by either commercial brand name or chemical generic salt.

### Fixed
- Fixed cart subtotal calculation bug where quantity increases did not reflect patient savings properly.

### Removed
- Removed static placeholder text and non-functional buttons from initial discovery screen.

---

## [2.0.0] - 2026-08-25

### Added
- **Multi-Tenant Architecture Specification:**
  - Standardized on hybrid Schema-per-Tenant model (`tnt_<org_code>`) with PostgreSQL Row-Level Security (RLS).
  - Adopted Redis Sentinel in-memory caching for sub-50ms Buy-Box pricing calculations.
- **Generic Salt Taxonomy:**
  - Standardized chemical salt definitions, active ingredients, dosage forms (tablets, capsules, syrups), and strengths (mg/ml).
- **Core Domain Interfaces (`types.ts`):**
  - Declared strict TypeScript interfaces for `TenantOrganization`, `MedicineListing`, `PlatformOrder`, `CartItem`, and `UserProfile`.

### Changed
- Migrated state management from unstructured local variables to strongly typed initial mock state files in `src/data/`.
- Replaced basic CSS styling with Tailwind CSS v4 design tokens.

### Fixed
- Fixed type mismatch in order status enums across client and portal views.

### Removed
- Removed legacy vanilla CSS sheets and ad-hoc utility classes in favor of centralized Tailwind CSS v4 directives.

---

## [1.1.0] - 2026-08-18

### Added
- Express backend skeleton with TypeScript runner (`tsx`).
- Integration hooks for Google GenAI SDK (`@google/genai`) for prescription OCR and natural language drug matching.
- Initial seed data for top 20 chronic and acute generic medications.

### Changed
- Updated Vite development server configuration to bind on host `0.0.0.0` with port `3000`.

### Fixed
- Fixed tsconfig path aliases for server scripts.

### Removed
- Removed redundant boilerplate HTML files.

---

## [1.0.0] - 2026-08-10

### Added
- Initial project repository initialization.
- Base React 19 + TypeScript + Vite project scaffolding.
- Product Requirements Document (PRD) initial draft defining the Generic Medicine Store concept, target personas, and commission business model.

### Changed
- Initialized npm scripts (`dev`, `build`, `preview`, `lint`).

### Fixed
- Initial Vite configuration resolution for React 19 compatibility.

### Removed
- Removed default template assets and starter logos.
