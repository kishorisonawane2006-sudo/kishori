# Changelog

All notable changes to the **Generic Medicine Store & Multi-Tenant SaaS Platform** (`kishori`) are documented in this chronological file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Release Summary Matrix

| Version | Release Date | Primary Focus | Key Deliverables | Status |
| :--- | :--- | :--- | :--- | :--- |
| **[Unreleased]** | Future | Phase 4: Scale & Insurance | Real-time adjudication, microservices, 150+ cities | Planned |
| **[3.0.0]** | 2026-09-09 | Phase 3: Clinical AI & B2B | FHIR/HL7 EHR, Gemini DDI engine, voice search, B2B wholesale | Active / Current |
| **[2.0.0]** | 2026-09-09 | Phase 2: Logistics & IoT | 3PL carrier hub, IoT gateway, geo-fencing, mobile app | Verified |
| **[1.4.0]** | 2026-09-09 | Phase 1 Production Hardening | Shared utils, common components, env config, quality gates | Verified |
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

## [3.0.0] - 2026-09-09

### Added

**Phase 3 — Workstream 3.1: FHIR/HL7 EHR Integration Gateway**
- `server/services/fhirService.ts` — Full FHIR R4 ingestion pipeline:
  - `EHR_PROVIDERS` registry: Epic (2,850 hospitals), Cerner (1,800), Practo (340), Kareo (180), AthenaHealth (920), DrChrono (95)
  - `ingestMedicationRequest()` — Validates FHIR R4 conformance (resourceType, id, status, intent, subject), extracts medication salts, verifies doctor PKI certificate against NMC/state registry, generates CHT-prefix cart hydration token
  - `verifySignature()` — Standalone NMC registration number lookup
  - `resolveCartHydration()` — Magic link token → CartHydrationPayload with 24h TTL
  - Cart hydration status: `READY` (verified sig) | `PENDING_RX_CHECK` (unverified)
- `server/routes/fhirRoutes.ts` — 6 endpoints under `/api/v3/fhir/`:
  - `POST /medication-request`, `POST /verify-signature`, `GET /cart-hydration/:token`
  - `GET /providers`, `GET /requests`, `GET /requests/:id`
- `src/components/clinical/FhirEhrScreen.tsx` — 3-tab portal screen:
  - **Providers**: EHR provider grid (connectedHospitals, FHIR version, digital signature support)
  - **Ingest**: FHIR request list → preview panel → ingest + verify signature button
  - **History**: Ingested results with signature status badge, medication pills, cart hydration magic link copy button
- Phase 3 mock data: `INITIAL_FHIR_PROVIDERS` (6), `INITIAL_FHIR_REQUESTS` (3 R4 resources with NMC registrationNumbers)

**Phase 3 — Workstream 3.2: Gemini AI Drug-Drug Interaction Engine**
- `server/services/ddiService.ts` — Clinical contraindication database + Gemini AI augmentation:
  - `DDI_DATABASE` — 10 clinically verified interactions: 2 CRITICAL (Sildenafil+Nitrates, Sertraline+Tramadol), 5 MODERATE (Lisinopril+Spironolactone, Warfarin+Ibuprofen, Atorvastatin+Clarithromycin, Amoxicillin+Penicillin, Metformin+Contrast), 2 FOOD (Metformin+Alcohol, Atorvastatin+Grapefruit), 1 MONITORING (Levothyroxine+Calcium)
  - `evaluate()` — Async, runs rule-based engine then augments with Gemini AI (gemini-2.5-flash) if `GEMINI_API_KEY` present; deduplicates results
  - `createCdsFlag()` — Auto-generates Pharmacist Clinical Decision Support flag for CRITICAL interactions
  - `reviewCdsFlag()` — Records pharmacist decision (`APPROVED_WITH_COUNSELLING` | `REJECTED_UNSAFE`) with timestamp and license number
- `server/routes/ddiRoutes.ts` — 5 endpoints under `/api/v3/ddi/`:
  - `POST /evaluate`, `GET /alerts/:patientId`, `POST /pharmacist-review`
  - `GET /cds-flags/pending`, `GET /database`
- `src/components/clinical/DdiAlertModal.tsx` — Three exported components:
  - `InteractionCard` — Expandable card showing patient summary, clinical mechanism, recommendation, citation
  - `DdiAlertModal` — Full severity-coded modal (rose/amber/orange/blue headers) with dismiss + "continue anyway" (non-critical only)
  - `DdiEngineScreen` — Demo screen with textarea inputs, client-side DDI evaluation, result summary strip
  - `PharmacistCdsPanel` — Inline CDS review panel for OrdersPipelineScreen with clinical notes textarea
- Phase 3 mock data: `INITIAL_DDI_INTERACTIONS` (10 clinical interactions for client-side demo)

**Phase 3 — Workstream 3.3: Multilingual Voice Search & WCAG Accessibility**
- `server/services/voiceSearchService.ts` — Pure in-process phonetic engine:
  - `soundex()` — 4-character Soundex code (American Metaphone standard)
  - `metaphone()` — Double Metaphone primary code (handles silent letters, digraphs)
  - `editDistance()` — Levenshtein distance (O(mn) DP)
  - `search()` — 3-tier pipeline: (1) vernacular transliteration, (2) direct catalog match, (3) phonetic matching; latency ~1–2ms (Quality Gate: < 1,500ms)
  - `VERNACULAR_DRUG_MAP` — Hindi, Bengali, Spanish colloquial → molecule name lookup
  - `MOLECULE_DICTIONARY` — 40 canonical drug names for phonetic matching
  - `SUPPORTED_LANGUAGES` — 8 languages: en-US, hi-IN, bn-IN, mr-IN, ta-IN, te-IN, kn-IN, es-US
  - `AccessibilityPreferences` storage with `saveAccessibilityPreferences()`
- `server/routes/voiceRoutes.ts` — 5 endpoints under `/api/v3/voice/`:
  - `POST /search`, `POST /phonetic-match`, `GET /languages`, `GET/PATCH /accessibility/:patientId`
- `src/components/clinical/VoiceSearchWidget.tsx` — Two exported components:
  - `VoiceSearchWidget` — Full-featured widget: Web Speech API mic (with language param), 8-language pill selector, input field, phonetic results with Soundex/Metaphone codes + confidence bars, "Use" buttons
  - WCAG 2.1 Accessibility panel: 4 contrast themes (default/high-contrast/large-text/simplified), font size selector, reduce motion, screen reader toggles
  - `VoiceSearchScreen` — Full portal screen with widget + example queries panel + quality gate callout

**Phase 3 — Workstream 3.4: B2B Wholesale Generic Procurement Marketplace**
- `server/services/wholesaleService.ts` — Full B2B procurement engine:
  - `MANUFACTURERS` — 5 verified manufacturers: Cipla (1,500 molecules), Sun Pharma (2,100), Dr. Reddy's (900), Torrent (640), Lupin (780); all WHO-GMP/FDA-GMP certified
  - `calculateWholesalePrice()` — Tiered pricing: Tier 1 (100–999 units), Tier 2 (1,000–9,999), Tier 3 (10,000+); discounts 21–71%
  - `submitCoa()` — Auto-verification: purity < 99.5% → Rejected, expired → Expired, valid → Verified + timestamp
  - `createListing()` — Blocks activation until CoA is Verified (Quality Gate 3)
  - `placeOrder()` — Validates: CoA verified, quantity ≥ MOQ, credit available; deducts from credit account
  - `advanceOrderStatus()` — Full lifecycle: Draft → Confirmed → Shipped → Settled; credit released on Settled
  - Seeded: 5 listings, 5 CoAs, 4 credit accounts (Apollo: A+/$500K, CarePoint: A/$250K, HealthKart: B+/$150K, SunMed: B/$100K)
- `server/routes/wholesaleRoutes.ts` — 15 endpoints under `/api/v3/wholesale/`:
  - `GET /manufacturers`, `GET /manufacturers/:id`
  - `GET /listings`, `GET /listings/:id`, `POST /listings`, `POST /listings/:id/price-quote`
  - `GET /coa`, `GET /coa/:id`, `POST /coa-upload`
  - `GET /orders`, `GET /orders/:id`, `POST /orders`, `PATCH /orders/:id/status`
  - `GET /credit-terms`, `GET /credit-terms/:tenantId`
- `src/components/wholesale/WholesaleMarketplaceScreen.tsx` — 4-tab portal screen:
  - **Catalog**: Listing cards with tier pricing strip, CoA badge, filter by manufacturer; sticky order panel with live price calculator, quantity input, Net-0/30/60 credit terms selector
  - **Manufacturers**: Verification grid showing GMP certificate, molecule count, active batches, license validity
  - **Orders**: Pipeline with CoA verified badge, status pill, discount %, payment due date
  - **Credit & Terms**: Utilisation gauges with colour-coded risk (emerald/amber/rose), credit rating badge

**Phase 3 — Integration, Mock Data & Testing**
- `src/types.ts` — 26 new interfaces/enums: `EhrProviderSystem`, `FhirSignatureStatus`, `CartHydrationStatus`, `EhrProvider`, `FhirMedicationRequest` (full R4 shape), `FhirIngestResult`, `CartHydrationPayload`, `DdiSeverity`, `DdiInteraction`, `DdiAlertPayload`, `PharmacistCdsFlag`, `SupportedLanguage`, `VoiceSearchResult`, `PhoneticMatch`, `ContrastTheme`, `AccessibilityPreferences`, `ManufacturerVerificationStatus`, `CoaStatus`, `B2bCreditTermDays`, `ManufacturerProfile`, `WholesalePriceTier`, `CertificateOfAnalysis`, `WholesaleListing`, `B2bOrderStatus`, `B2bOrder`, `B2bCreditAccount`; `PortalTab` extended with 4 Phase 3 values
- `src/data/initialData.ts` — Phase 3 mock fixtures appended
- `src/App.tsx` — Phase 3 screen imports + portal routing + 4 quick-dock buttons
- `server/index.ts` — Phase 3 routes mounted; server version → `3.0.0`
- `package.json` — `test:phase3` script added

### Verified

- **Phase 3 Quality Gates: 42/42 PASS** (`npm run test:phase3`)
  - Gates 1–9: FHIR R4 conformance, NMC digital signature VERIFIED/INVALID, CHT token, cart hydration READY, medication mapping, conformance rejection, 5-provider registry
  - Gates 10–19: DDI 100% precision (10/10 database), CRITICAL Sildenafil+Nitrates + absolute contraindication, CRITICAL Sertraline+Tramadol, MODERATE Warfarin+Ibuprofen, FOOD Atorvastatin+Grapefruit, MONITORING Levothyroxine+Calcium, safe Paracetamol+VitD3, CDS flag PENDING, CDS review APPROVED_WITH_COUNSELLING
  - Gates 20–29: Soundex Atorvastatin=Atorvastaten, Metformin=Metaformin, Metaphone non-empty, editDistance ≤2, identical=0, latency 1.6ms (< 1,500ms target), Metaformin 97% phonetic confidence, Hindi/Spanish vernacular transliteration, 8-language registry
  - Gates 30–42: 5 manufacturers Verified, COA_REQUIRED listing enforcement, purity 98%→Rejected, expired→Expired, valid 99.9%→Verified, three pricing tiers ($0.32/24%, $0.22/48%, $0.14/67%), 50k×$0.14=$7,000 exact, order coaVerified=true, MOQ_NOT_MET, lifecycle Shipped, credit settlement
- **Phase 1 11/11, Phase 2 32/32 — zero regressions**
- **TypeScript lint: zero errors** (`tsc --noEmit`)

---

## [2.0.0] - 2026-09-09

### Added

**Phase 2 — Workstream 2.1: 3PL Carrier Integration Hub**
- `server/services/logisticsService.ts` — Unified 3PL carrier abstraction layer:
  - `CARRIER_REGISTRY`: Dunzo On-Demand (75min, cold-chain), Shadowfax (3h, ambient), FedEx Healthcare Express (8h, cold-chain)
  - `autoDispatch()` — Smart carrier selection by distance (≤10mi→Dunzo, ≤50mi→Shadowfax, long-haul→FedEx) and cold-chain requirement; generates waybill + barcode; assigns nearest available rider; SLA measured in milliseconds (actual: ~0.15ms vs 180,000ms target)
  - `ingestWebhookEvent()` — Carrier status ingestion (`ASSIGNED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED`); syncs platform order status automatically
  - `getWaybill()` — Returns FDA-compliant waybill document with regulatory declaration
  - `failoverCarrier()` — Takes a carrier offline and re-assigns its active shipments to a fallback
  - Rider management: `updateRiderLocation()`, `getDeliveryStopsForRider()`, `verifyOtp()`, `submitProofOfDelivery()`
- `server/routes/logisticsRoutes.ts` — 14 endpoints under `/api/v2/logistics/`:
  - `POST /dispatch`, `GET /dispatches`, `GET /dispatches/:id`
  - `GET /waybill/:waybillNumber`
  - `POST /carrier-webhook`, `POST /carrier/:id/failover`, `GET /carriers`
  - `GET /riders`, `GET /riders/:id`, `GET /riders/:id/stops`, `PATCH /riders/:id/location`
  - `POST /otp/verify`, `POST /pod`, `GET /pod/:shipmentId`
  - `GET /geo-zones`, `POST /geo-zones`, `POST /geo-zones/proximity`, `POST /geo-zones/distance-matrix`

**Phase 2 — Workstream 2.2: IoT Cold-Chain Gateway**
- `server/services/iotGatewayService.ts` — MQTT/HTTP telemetry pipeline:
  - `ingest()` — Per-packet cumulative excursion tracking: each breach packet accrues 0.5min; once ≥ 10min, `quarantineTriggered=true` and breach protocol fires automatically
  - `triggerBreachProtocol()` — Creates replacement re-dispatch order at zero cost to patient; emits `MobileNotification`; sets order to `Re-dispatching`
  - Excursion counter resets to 0 when temperature returns to the 2°C–8°C GDP safe range
  - `bleSyncOnDelivery()` — Ingests Bluetooth Low Energy flash memory log from rider's device upon delivery; confirms cold-chain integrity
  - `getBreachAlerts()`, `resolveBreachAlert()`, `getNotifications()`, `markNotificationRead()`
- `server/routes/iotRoutes.ts` — 8 endpoints under `/api/v2/iot/`:
  - `POST /ingest` (enhanced — returns quarantine status, GDP compliance flag)
  - `GET /orders/:orderId/telemetry` (with ExcursionTracker state)
  - `GET /breach-alerts`, `POST /breach-alerts/:id/resolve`
  - `POST /ble-sync`
  - `GET /notifications/:userId`, `PATCH /notifications/:id/read`

**Phase 2 — Workstream 2.3: Rider Companion App**
- `src/components/logistics/RiderCompanionScreen.tsx` — Dark-theme mobile-native UI with 4 tabs:
  - **Route**: Delivery stop queue with cold-chain badge, distance/ETA, address
  - **Scanner**: Barcode scanner simulation; validates shipment by waybill number
  - **OTP**: 4-digit numeric doorstep verification with shipment selector
  - **POD**: Photo proof-of-delivery capture per stop; advances to `DELIVERED` on submit
  - Live cold-chain sensor temperature slider (simulates BLE sensor reading)

**Phase 2 — Workstream 2.4: Geo-Fencing & Proximity Routing**
- `server/services/geoFencingService.ts`:
  - 4 seeded NYC delivery polygons (Manhattan, Brooklyn, Queens, Bronx)
  - `haversineDistanceMiles()` — Great-circle distance calculation
  - `pointInPolygon()` — Ray-casting boundary test with radius fallback
  - `scoreProximity()` — Returns all zones scored by ADR-004 formula `max(0, 100 − distanceMi × 5)`, sorted descending
  - `getDistanceMatrix()` — Google Distance Matrix API with Haversine stub fallback
  - `findNearestAlternatePharmacy()` — Breach re-dispatch routing excluding quarantined tenant
- `src/components/logistics/GeoFenceMapScreen.tsx` — Interactive SVG polygon map:
  - 600×400 viewport-mapped NYC zones, click-to-select, patient pin
  - Zone editor: toggle active/inactive, edit service radius inline
  - Proximity score table with ADR-004 weighting bars, carrier icons, in-zone badges

**Phase 2 — Mobile Patient App**
- `src/components/mobile/MobilePatientApp.tsx` — React Native simulation with 5 screens:
  - **Home**: Quick-action grid, cold-chain live widget, activity feed, React Native feature callout
  - **Biometric Auth**: FaceID/TouchID animation (scanning → success states)
  - **Rx Camera**: Corner-bracket viewfinder, auto-capture simulation, Gemini AI field extraction preview, file upload fallback
  - **Notifications**: Typed push notification feed with read/unread state and type-specific icons
  - **Tracking**: Live order status, ColdChainBadge panel, temperature sparkline bar chart, telemetry sensors
  - Offline cart banner simulation toggle

**Phase 2 — Logistics Dashboard (Portal)**
- `src/components/logistics/LogisticsDashboardScreen.tsx` — 4-tab portal screen:
  - **Active Shipments**: Full dispatch list with carrier icon, cold-chain badge, event timeline strip
  - **Carriers**: Grid of all 3 carriers with status, avg delivery, base cost, cold-chain support
  - **Riders**: Table with vehicle, location, battery, rating, route drill-down button
  - **Auto-Dispatch**: Order ID input → simulates full dispatch in 800ms; carrier selection logic explainer card

**Phase 2 — Types, Data & Integration**
- `src/types.ts` — 24 new interfaces/enums: `CarrierType`, `CarrierStatus`, `ShipmentEventStatus`, `CarrierProfile`, `ShipmentDispatch`, `CourierWebhookEvent`, `WaybillDocument`, `AutoDispatchResult`, `IoTSensorPacket`, `BreachAlert`, `BLESyncRecord`, `ExcursionTracker`, `SensorProtocol`, `RiderProfile`, `RiderStatus`, `DeliveryStop`, `OtpVerification`, `ProofOfDelivery`, `GeoCoordinate`, `GeoFencePolygon`, `ProximityScore`, `DistanceMatrixResult`, `NotificationType`, `MobileNotification`; `PortalTab` extended with `logistics-dashboard`, `rider-companion`, `geo-fence-zones`, `mobile-patient-app`
- `src/data/initialData.ts` — Phase 2 mock fixtures: `INITIAL_CARRIERS` (3), `INITIAL_DISPATCHES` (3 with event histories), `INITIAL_RIDERS` (3), `INITIAL_GEO_FENCES` (4 NYC polygons), `INITIAL_PROXIMITY_SCORES` (4), `INITIAL_IOT_PACKETS` (10 BLE readings for ord-1), `INITIAL_MOBILE_NOTIFICATIONS` (5)
- `src/App.tsx` — Phase 2 imports wired; `activeRiderId` state; 4 portal tab routes; 4 quick-dock sidebar buttons
- `server/index.ts` — Phase 2 routes mounted (`/api/v2/logistics`, `/api/v2/iot`); version bumped to `2.0.0`
- `package.json` — Added `test:phase2` npm script

### Verified

- **Phase 2 Quality Gates: 32/32 PASS** (`npm run test:phase2`)
  - Gates 1–7: Auto-dispatch SLA compliance, carrier selection accuracy (Dunzo/FedEx cold-chain), waybill generation, regulatory declaration
  - Gates 8–10: Carrier failover — offline status, shipment re-assignment, fallback carrier assigned
  - Gates 11–12: Webhook lifecycle — `PICKED_UP` → `OUT_FOR_DELIVERY` synced to platform order status
  - Gate 13: Optimal telemetry (4.5°C) — zero excursion accrual, no quarantine
  - Gates 14–17: Cumulative excursion (21 packets × 0.5min = 10.5min) → `quarantineTriggered=true` → `BreachAlert` persisted
  - Gates 18–19: Excursion counter resets to 0 on temperature recovery
  - Gates 20–21: BLE flash sync — 3 packets ingested, cold-chain integrity confirmed
  - Gates 22–25: Geo-fence proximity scoring — 4 zones, ADR-004 formula verified, nearest correctly ranked
  - Gates 26–28: Point-in-polygon — Brooklyn inside CarePoint zone, remote coord rejected, alternate re-dispatch pharmacy found
  - Gates 29–32: OTP valid/invalid, POD submission advances to `DELIVERED`
- **Phase 1 Quality Gates: 11/11 still passing** — no regressions
- **TypeScript lint: zero errors** (`tsc --noEmit`)

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
