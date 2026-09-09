# Architecture & Product Decision Records (ADR / PDR)

**Project:** Generic Medicine Store & Multi-Tenant SaaS Platform  
**Repository:** `generic-medicine-store` (`kishori`)  
**Current Architecture Phase:** Phase 1 (Modular Monolith with Multi-Tenant PostgreSQL & Redis Sentinel)  
**Last Updated:** 2026-09-09  

---

## Overview

This document records all significant technical, architectural, and product decisions made for the Generic Medicine Store platform. Each record details the context, the decision taken, rationale, evaluated alternatives, and downstream consequences across engineering, compliance, security, and product operations.

These records serve as persistent AI and engineering context to ensure architectural consistency and prevent regression or architectural drift.

---

## Decision Index

| ID | Title | Date | Status | Category |
| :--- | :--- | :--- | :--- | :--- |
| **ADR-001** | [Multi-Tenancy Isolation: Schema-per-Tenant with Row-Level Security (RLS)](#adr-001-multi-tenancy-isolation-schema-per-tenant-with-row-level-security-rls) | 2026-08-15 | Accepted | Architecture / Database |
| **ADR-002** | [Modular Monolith Architecture with In-Process Domain Events](#adr-002-modular-monolith-architecture-with-in-process-domain-events) | 2026-08-18 | Accepted | Backend / Systems |
| **ADR-003** | [Salt Normalization & Bio-Equivalence Therapeutic Equivalence Engine](#adr-003-salt-normalization--bio-equivalence-therapeutic-equivalence-engine) | 2026-08-22 | Accepted | Product / Healthcare |
| **ADR-004** | [Dynamic Buy-Box & Repricing Algorithm with In-Memory Redis Sentinel](#adr-004-dynamic-buy-box--repricing-algorithm-with-in-memory-redis-sentinel) | 2026-08-28 | Accepted | Performance / Pricing |
| **ADR-005** | [Dual-Stage Prescription (Rx) AI OCR & Registered Pharmacist Verification](#adr-005-dual-stage-prescription-rx-ai-ocr--registered-pharmacist-verification) | 2026-09-01 | Accepted | Compliance / Operations |
| **ADR-006** | [Unified Single-Codebase Frontend for Patient Marketplace & Tenant Portal](#adr-006-unified-single-codebase-frontend-for-patient-marketplace--tenant-portal) | 2026-09-03 | Accepted | Frontend / UX |
| **ADR-007** | [Escrow-Based Settlement & Automated Multi-Tier Commission Engine](#adr-007-escrow-based-settlement--automated-multi-tier-commission-engine) | 2026-09-05 | Accepted | Business / Payments |
| **ADR-008** | [Real-Time Cold-Chain IoT Telemetry for Biologics & Vaccines](#adr-008-real-time-cold-chain-iot-telemetry-for-biologics--vaccines) | 2026-09-07 | Accepted | IoT / Logistics |
| **ADR-009** | [Hybrid Search Architecture: Client Debounced Fuzzy Query + GenAI Salt Mapping](#adr-009-hybrid-search-architecture-client-debounced-fuzzy-query--genai-salt-mapping) | 2026-09-08 | Accepted | AI / Search |
| **ADR-010** | [Patient Health Information (PHI) & HIPAA-Compliant Ephemeral Storage](#adr-010-patient-health-information-phi--hipaa-compliant-ephemeral-storage) | 2026-09-08 | Accepted | Security / Compliance |
| **ADR-011** | [Responsive Multi-Device Emulation: Desktop Workstation & Phone Frame Preview](#adr-011-responsive-multi-device-emulation-desktop-workstation--phone-frame-preview) | 2026-09-09 | Accepted | Frontend / Developer Experience |
| **ADR-012** | [Tailwind CSS v4 Semantic Medical Token System & Micro-Interactions](#adr-012-tailwind-css-v4-semantic-medical-token-system--micro-interactions) | 2026-09-09 | Accepted | Design System / Styling |

---

## ADR-001: Multi-Tenancy Isolation: Schema-per-Tenant with Row-Level Security (RLS)

- **Date:** 2026-08-15
- **Status:** Accepted
- **Decision Owner:** Senior SaaS Solutions Architect

### Context & Problem
The platform hosts competing pharmacy chains (e.g., Apollo Pharmacy, MedPlus, Wellness Forever, Frank Ross) as well as independent regional pharmacies. These tenants require strict data privacy regarding wholesale inventory volumes, proprietary pricing algorithms, customer addresses, and prescription records. Regulatory standards (HIPAA, CDSCO pharmacy compliance, GDPR) mandate zero risk of cross-tenant data exposure.

We had to determine how to isolate tenant data across storage and compute without incurring massive infrastructure costs during early growth.

### Decision Taken
Adopt a **Hybrid PostgreSQL Multi-Tenancy Strategy**:
1. **Shared Platform Schema (`public`)**: Contains global, non-sensitive master datasets:
   - Universal Drug Master (chemical salts, molecules, drug interactions).
   - Bio-equivalence reference ratings (FDA Orange Book / CDSCO standards).
   - Tenant directory metadata, global subscription tiers, platform audit log structure.
2. **Schema-per-Tenant (`tnt_<org_code>`)**: Each verified pharmacy organization receives an isolated PostgreSQL schema containing:
   - `inventory_stock`
   - `pricing_rules`
   - `local_store_outlets`
   - `payout_accounts`
3. **Application-Level Row-Level Security (RLS)**: Enforced via the IAM / Tenant Context Resolver middleware. Every incoming request resolves the tenant identity from cryptographic JWT claims and sets the PostgreSQL connection session variable:
   ```sql
   SET LOCAL app.current_tenant_id = 'tnt_apollo_01';
   ```

### Reasoning
- **Data Isolation & Security:** Schema separation provides clear logical and security boundaries. A bug in an application-level SQL query cannot accidentally access another pharmacy's stock or pricing records.
- **Operational Efficiency:** Managing hundreds of schemas within a high-performance PostgreSQL RDS cluster is significantly less costly and operationally lighter than provisioning hundreds of separate RDS instances.
- **Tenant Portability & Compliance:** Individual tenant schemas can be backed up, migrated to dedicated databases for enterprise contracts, or purged cleanly upon tenant churn.

### Alternatives Considered
1. **Shared Database / Shared Single Schema with `tenant_id` column:**
   - *Pros:* Simple migrations, low initial effort.
   - *Cons:* Extremely high risk of data leakage due to human developer error (omitting `WHERE tenant_id = ...`). Unacceptable for enterprise healthcare tenants.
2. **Dedicated Database per Tenant:**
   - *Pros:* Maximum isolation.
   - *Cons:* High infrastructure overhead, high cost for small regional pharmacies, difficult schema migration across hundreds of separate databases.

### Impact on Project
- **Positive:** Enterprise pharmacy chains can sign on with confidence; meets HIPAA/GDPR isolation requirements; predictable cost scaling.
- **Trade-off:** Database migration scripts must iterate over all active tenant schemas dynamically using migration runners.

---

## ADR-002: Modular Monolith Architecture with In-Process Domain Events

- **Date:** 2026-08-18
- **Status:** Accepted
- **Decision Owner:** Lead Software Architect

### Context & Problem
The system spans multiple complex business domains: Catalog & Generic Salt Mapping, Tenant Organization Management, Order Processing, Repricing Engine, Commission & Settlement, Prescription Verification, and Cold-Chain IoT Tracking. We needed to choose between a microservices architecture and a monolith.

### Decision Taken
Implement a **Modular Monolith** pattern in TypeScript (Node.js / Express / Vite), structured into 8 strictly isolated domain modules with bounded contexts, communicating via typed in-process events (with an eventual Redis Pub/Sub adapter).

### Reasoning
- **Fast Developer Velocity:** No distributed tracing latency, network hops, or dual-write headaches during early development.
- **Data Consistency:** Order placement, inventory reservation, and commission ledger writes occur within ACID database transactions, preventing inventory drift or payment discrepancies.
- **Evolutionary Path:** Each module maintains strict isolation without direct coupling to foreign domain tables. When high-load services (such as the Repricing Engine or IoT Telemetry) require independent scaling, they can be extracted into standalone microservices without rewriting business logic.

### Alternatives Considered
1. **Full Microservices Architecture (from Day 1):**
   - *Rejected:* Introduces heavy DevOps complexity, distributed transaction failures, network serialization overhead, and slower feature delivery.
2. **Unstructured Monolith (Traditional MVC):**
   - *Rejected:* Leads to spaghetti code, tight coupling between cart/inventory/orders, and makes future decoupling impossible.

### Impact on Project
- **Positive:** Rapid feature shipping, high test coverage, straightforward single-container deployment, and sub-millisecond inter-module communication.
- **Trade-off:** Engineers must respect module boundaries and avoid cross-domain SQL joins.

---

## ADR-003: Salt Normalization & Bio-Equivalence Therapeutic Equivalence Engine

- **Date:** 2026-08-22
- **Status:** Accepted
- **Decision Owner:** Clinical Product Lead & Solution Architect

### Context & Problem
Branded medicines are marketed under thousands of proprietary names (e.g., Augmentin, Crocin, Lipitor) at high retail prices. Patients often lack clinical knowledge to identify generic equivalents containing the identical active pharmaceutical ingredient (API), chemical salt, dosage, and release profile (e.g., Immediate Release vs Sustained Release). Misidentifying drugs could lead to patient harm.

### Decision Taken
Build a dedicated **Salt Normalization & Therapeutic Equivalence Engine**:
1. **Active Salt Taxonomy:** Standardize drug compositions using international nonproprietary names (INN) and CAS registries (e.g., `Amoxicillin (500mg) + Clavulanic Acid (125mg)`).
2. **Bio-Equivalence Rating Standards:** Incorporate FDA Orange Book and CDSCO equivalence classifications:
   - `AB`: Bioequivalent and therapeutically interchangeable.
   - `BX`: Insufficient data for generic interchangeability (disallowed from automated auto-substitution).
3. **AI-Assisted Drug Mapping:** Integrate Gemini 2.5/Flash (`@google/genai`) for multi-lingual and brand-name disambiguation, phonetic search, and OCR verification on handwritten prescriptions.

### Reasoning
- Guarantees patient safety by forbidding substitutions that do not match exact strength, release profile, or bioavailability.
- Empowers patients to identify identical generic alternatives with price savings of up to 70–85%.

### Alternatives Considered
1. **Loose Keyword Search:**
   - *Rejected:* High medical risk; could suggest Paracetamol 650mg when Paracetamol 500mg was prescribed, or match ER tablets to IR tablets.
2. **Manual-Only Catalog Entry:**
   - *Rejected:* Cannot scale to hundreds of thousands of pharmaceutical formulations across different countries and regional manufacturers.

### Impact on Project
- **Positive:** Unrivaled clinical trust, patient safety, and high conversion rates on price comparison cards.
- **Trade-off:** Prescription audit log must store therapeutic equivalence rating for every substituted item.

---

## ADR-004: Dynamic Buy-Box & Repricing Algorithm with In-Memory Redis Sentinel

- **Date:** 2026-08-28
- **Status:** Accepted
- **Decision Owner:** Core Engineering Team

### Context & Problem
Multiple licensed pharmacies may list the same generic drug SKU. The platform must reward the best merchant with the primary "Add to Cart" Buy Box while showing alternate vendors transparently. Direct SQL calculations on every search query create database bottlenecks during traffic spikes.

### Decision Taken
Implement an automated **Buy Box Engine with Redis In-Memory Caching**:
1. **Weighted Buy-Box Scoring Matrix:**
   $$\text{Score} = (0.70 \times \text{Price Score}) + (0.20 \times \text{Stock Reliability}) + (0.10 \times \text{Delivery SLA/Proximity})$$
2. **Sub-millisecond Redis Cache:** Pre-compute and cache winning Buy Box listings per generic molecule and geographic delivery zone with a 60-second TTL.
3. **Asynchronous Cache Invalidation:** When a pharmacy updates inventory or adjusts unit pricing, an asynchronous event (`ListingPriceChanged`) triggers instant cache invalidation for affected SKUs.

### Reasoning
- Ensures fast page load speeds ($< 50\text{ ms}$) on patient search and comparison screens.
- Incentivizes pharmacies to keep prices low and stock counts accurate to win the Buy Box.

### Alternatives Considered
1. **Pure Lowest-Price SQL Query:**
   - *Rejected:* Ignores vendor stock reliability, store distance, and leads to customer cancellations when low-cost vendors are out of stock.
2. **Batch Hourly Cron Calculation:**
   - *Rejected:* Results in stale prices and overselling during volatile inventory changes.

### Impact on Project
- **Positive:** High performance, competitive vendor pricing dynamics, optimal patient customer experience.
- **Trade-off:** Requires Redis Sentinel redundancy to prevent cache loss during node failovers.

---

## ADR-005: Dual-Stage Prescription (Rx) AI OCR & Registered Pharmacist Verification

- **Date:** 2026-09-01
- **Status:** Accepted
- **Decision Owner:** Healthcare Compliance & Security Officer

### Context & Problem
Selling Schedule H / Rx-only prescription medicines without a verified prescription is illegal. Automated OCR alone cannot be legally liable for dispensing decisions, but manual review creates severe delivery bottlenecks.

### Decision Taken
Deploy a **Dual-Stage Human-in-the-Loop Prescription Pipeline**:
1. **Stage 1 (Automated Pre-validation via Gemini AI):**
   - Extracts Doctor details, Medical Council Registration Number, Patient Name, Date, and Prescribed Molecules.
   - Flags drug-drug interactions, expired prescriptions ($> 6\text{ months}$), or missing physician signatures.
2. **Stage 2 (Registered Pharmacist Digital Sign-Off):**
   - Pharmacy staff audits the AI-parsed fields against the uploaded image in the Tenant Portal.
   - Pharmacist enters their state license number and cryptographically signs the approval before the order can transition to `Dispensing`.

### Reasoning
- Full compliance with FDA, CDSCO, EPCS, and Telemedicine guidelines.
- Reduces pharmacist verification time from 7 minutes to under 45 seconds per prescription by pre-filling audited fields.

### Alternatives Considered
1. **Fully Automated Dispensing without Human Review:**
   - *Rejected:* Strict violation of pharmaceutical laws; severe legal risk.
2. **100% Manual Paper Review without AI:**
   - *Rejected:* Creates 4–12 hour delays in fulfillment, rendering express delivery impossible.

### Impact on Project
- **Positive:** Absolute regulatory compliance, rapid order processing, complete digital audit trail.
- **Trade-off:** Orders remain in `Validating Rx` state until licensed staff sign off.

---

## ADR-006: Unified Single-Codebase Frontend for Patient Marketplace & Tenant Portal

- **Date:** 2026-09-03
- **Status:** Accepted
- **Decision Owner:** Frontend Lead

### Context & Problem
The platform serves two primary audiences:
1. **Patients:** Searching medications, comparing prices, managing prescriptions, and tracking orders.
2. **Pharmacy Admins & Platform Ops:** Managing multi-tenant inventory, buy-box repricing, order fulfillment, and commission payouts.

Maintaining separate frontend repositories creates redundant code, divergent design systems, and higher deployment overhead.

### Decision Taken
Unify both interfaces within a single **React 19 + TypeScript + Vite + Tailwind CSS** application:
1. Distinct application modes (`patient`, `portal`, `architecture`, `prd`, `login`, `profile`) switched via top-level routing and role-based permissions.
2. Responsive desktop workstation and optional mobile frame toggle to preview mobile patient interactions.
3. Centralized type definitions (`types.ts`) and shared UI primitives (`lucide-react`, `motion`).

### Reasoning
- Rapid iteration with immediate feedback across both buyer and seller user journeys.
- Shared domain models prevent data mismatches between marketplace listings and pharmacy inventory updates.

### Alternatives Considered
1. **Two Separate Repositories (Monorepo / Turborepo):**
   - *Deferred:* Adds tooling overhead not justified in current product lifecycle; can be split in Phase 3 if team size grows.

### Impact on Project
- **Positive:** Single unified codebase, fast testing, cohesive UI design language, zero sync latency.
- **Trade-off:** Careful route-guarding and role-based view isolation required.

---

## ADR-007: Escrow-Based Settlement & Automated Multi-Tier Commission Engine

- **Date:** 2026-09-05
- **Status:** Accepted
- **Decision Owner:** Business Operations & Finance Lead

### Context & Problem
The business model is commission-based (tiered between 5% and 12% of Gross Merchandise Value). If customers pay pharmacies directly, collecting commissions is difficult. Conversely, if the platform pays pharmacies immediately upon checkout, cancellations or returns cause financial loss.

### Decision Taken
Establish an **Escrow Settlement Pipeline**:
1. All patient payments are collected centrally by the platform via Stripe / Razorpay.
2. Funds are held in escrow under `PlatformOrder.platformFee` and `tenantPayoutAmount`.
3. Following verified delivery + a 48-hour return window, the payout status advances to `Eligible for Settlement`.
4. Automated weekly batch payouts disburse net funds to the pharmacy's verified bank account after subtracting platform commission.

### Reasoning
- Eliminates bad debt and pharmacy default on commission payments.
- Protects patient refund rights for damaged, incorrect, or spoiled medicines.

### Alternatives Considered
1. **Monthly Invoice Invoicing of Pharmacies:**
   - *Rejected:* High default risk and administrative collection overhead.
2. **Immediate Payout upon Order Placement:**
   - *Rejected:* High risk of loss if pharmacy cancels or prescription is rejected.

### Impact on Project
- **Positive:** Guaranteed revenue capture, automated ledger reconciliation, high trust for consumers.
- **Trade-off:** Requires robust dispute and return management workflows.

---

## ADR-008: Real-Time Cold-Chain IoT Telemetry for Biologics & Vaccines

- **Date:** 2026-09-07
- **Status:** Accepted
- **Decision Owner:** Logistics & IoT Architect

### Context & Problem
Therapeutic products such as Insulin, Monoclonal Antibodies, and vaccines spoil if temperatures deviate outside the strict 2°C to 8°C range during transit. Delivering spoiled medicine poses severe risks to patient health and carrier liability.

### Decision Taken
Integrate an **IoT Cold-Chain Telemetry Ingestion Pipeline**:
1. Temperature and GPS sensors attached to cold-boxes stream MQTT / HTTP telemetry every 30 seconds.
2. If temperature breaches the 2°C–8°C threshold for $> 10\text{ minutes}$, the order is automatically flagged as `Cold-Chain Breached`.
3. The platform halts delivery, alerts dispatch, and triggers an automated re-dispatch from the nearest hub at no cost to the patient.

### Reasoning
- Protects patient life and guarantees clinical efficacy.
- Provides regulatory compliance under Good Distribution Practice (GDP) guidelines.

### Alternatives Considered
1. **Passive Cold Packs without Active Sensors:**
   - *Rejected:* No way to know if insulation failed or package sat in extreme heat.
2. **Post-Delivery Data Logger Reading:**
   - *Rejected:* Delays detection until after the patient has already received the degraded product.

### Impact on Project
- **Positive:** Unmatched safety standard, consumer confidence, operational transparency.
- **Trade-off:** Requires integration with logistics carriers supporting BLE/cellular temperature sensor beacons.

---

## ADR-009: Hybrid Search Architecture: Client Debounced Fuzzy Query + GenAI Salt Mapping

- **Date:** 2026-09-08
- **Status:** Accepted
- **Decision Owner:** Search & Discovery Architect

### Context & Problem
Patients frequently search for commercial branded medications (e.g., "Lipitor", "Glucophage", "Augmentin") with spelling errors, or enter generic salt formulas (e.g., "Metformin 500mg"). A pure exact-match database search fails to capture colloquial phrasing, typos, and clinical equivalence mappings, while a remote cloud AI call for every keystroke creates latency and prohibitive API costs.

### Decision Taken
Deploy a **Hybrid Two-Tier Search Engine**:
1. **Tier 1 (Client-Side Debounced Fuzzy Index):** In-memory trie and fuzzy string matching (`min 2 chars`, `300ms debounce`) filtering pre-cached active salt and brand names in $< 20\text{ ms}$.
2. **Tier 2 (Cloud GenAI Fallback):** If no direct catalog matches exist or if input suggests a complex handwritten prescription/voice transcript, query Google Gemini SDK (`@google/genai`) to extract normalized salt, dosage, and matching therapeutic alternatives.

### Reasoning
- Delivers instant sub-50ms search feedback for 95% of common branded and generic drug searches.
- Leverages LLM reasoning only when disambiguation, synonym resolution, or complex translation is necessary.

### Alternatives Considered
1. **Elasticsearch / Meilisearch Cluster from Day 1:**
   - *Deferred:* Unnecessary infrastructure and memory overhead for initial catalog scale of under 25,000 SKUs.
2. **LLM Query on Every Keystroke:**
   - *Rejected:* Severe latency (500–1200ms) and unsustainable API cost.

### Impact on Project
- **Positive:** Lightning-fast patient search experience; minimal token consumption; robust handling of misspellings.
- **Trade-off:** Client bundle includes lightweight search index; index requires periodic background cache refresh.

---

## ADR-010: Patient Health Information (PHI) & HIPAA-Compliant Ephemeral Storage

- **Date:** 2026-09-08
- **Status:** Accepted
- **Decision Owner:** Chief Information Security Officer (CISO) & Legal Counsel

### Context & Problem
The platform stores patient chronic medical conditions (e.g., Type 2 Diabetes, Hypertension), declared drug allergies (Penicillin, Sulfa drugs), health insurance policy identifiers (RxBIN, RxPCN, Group numbers), and raw prescription scans. Exposing or improperly storing this data violates HIPAA, HITECH, and regional health data protection mandates.

### Decision Taken
Implement **Strict PHI Data Protection & Ephemeral Prescription Handling**:
1. **Client Isolation:** Never persist unencrypted PHI or active prescription images to plain browser `localStorage`. Use React state memory and cryptographically signed session cookies.
2. **Prescription Storage:** Prescription assets are uploaded to an isolated private cloud bucket with AES-256 server-side encryption. URLs provided to the client or pharmacist UI are time-limited signed URLs expiring in 15 minutes.
3. **PII Masking:** Patient identification, phone numbers, and street addresses are automatically masked (`+1 (•••) •••-4821`) on all non-privileged portal screens.

### Reasoning
- Eliminates risks of data exposure through cross-site scripting (XSS) or unauthenticated browser cache inspection.
- Ensures end-to-end HIPAA compliance across all patient-facing and pharmacy-facing screens.

### Alternatives Considered
1. **Storing Prescriptions in Standard Public S3 Bucket with Obfuscated UUIDs:**
   - *Rejected:* Severe security flaw; links can be leaked, indexed, or shared without authentication.
2. **Browser LocalStorage Caching for Offline Access:**
   - *Rejected:* Insecure storage medium accessible by any third-party script injected into the DOM.

### Impact on Project
- **Positive:** Full audit compliance; certified safe for enterprise health network onboarding.
- **Trade-off:** Previews require fresh signed URL regeneration upon session renewal.

---

## ADR-011: Responsive Multi-Device Emulation: Desktop Workstation & Phone Frame Preview

- **Date:** 2026-09-09
- **Status:** Accepted
- **Decision Owner:** Lead Product Designer & Frontend Architect

### Context & Problem
Retail pharmacists and platform administrators operate primarily on wide desktop monitors (orders pipeline, multi-tenant analytics, inventory grids), whereas over 75% of patients search and buy medications on mobile smartphones. During paired programming, stakeholder reviews, and development, testing mobile ergonomics without physically switching devices is critical.

### Decision Taken
Implement an **In-App Device Frame Switcher (`phoneFrame`)** in the root application controller:
1. One-click toggle in `NavigationHeader.tsx` allowing developers and stakeholders to switch between full-width workstation view and an authentic $412\text{ px}$ mobile phone enclosure with notch, rounded bezel, and scrollable viewport.
2. Universal responsive design using fluid Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`, `xl:`) ensuring components gracefully fill both views.

### Reasoning
- Enables instant visual verification of patient mobile UX (touch targets, sticky checkout bars, thumb reachability) without external emulation tools.
- Allows the Pharmacy Portal to remain expansive and data-dense on desktop while verifying patient screens on mobile.

### Alternatives Considered
1. **Relying Solely on Browser DevTools Responsive Mode:**
   - *Rejected:* Cumbersome for non-technical stakeholders during live client demonstrations.
2. **Separate Mobile Web Domain (`m.genericstore.com`):**
   - *Rejected:* Outdated design pattern creating code duplication.

### Impact on Project
- **Positive:** High developer velocity, seamless demonstration mode, consistent responsive design discipline.
- **Trade-off:** Root container requires conditional max-width and border wrapper styling when frame mode is active.

---

## ADR-012: Tailwind CSS v4 Semantic Medical Token System & Micro-Interactions

- **Date:** 2026-09-09
- **Status:** Accepted
- **Decision Owner:** UI/UX Lead & Design System Engineer

### Context & Problem
Healthcare e-commerce applications must convey clinical trustworthiness, safety, and price transparency. Inconsistent color schemes, clashing button styles, or abrupt UI state changes erode patient trust when dealing with critical prescription drugs.

### Decision Taken
Adopt **Tailwind CSS v4 with a Semantic Medical Design Token System**:
1. **Standardized Color Tokens:**
   - Slate (`#0f172a` / `#1e293b`): Primary structural hierarchy, text, and clinical headers.
   - Emerald (`#059669` / `emerald-600`): Dedicated exclusively to patient savings highlights, bio-equivalent approval badges, and successful delivery status.
   - Blue / Indigo (`#2563eb` / `blue-600`): Primary interactive elements, search inputs, and CTA buttons.
   - Amber (`#d97706` / `amber-600`): Prescription verification alerts and pending pharmacist actions.
   - Rose / Red (`#e11d48` / `rose-600`): Cold-chain temperature breaches and drug allergy warnings.
2. **Micro-Interactions with Motion (`motion`):** Smooth page transitions, slide-out drawer menus, and savings pill pulse animations.

### Reasoning
- Enforces visual consistency across both patient and portal views.
- Eliminates ad-hoc colors, ensuring WCAG AA contrast compliance across all text and interactive badges.

### Alternatives Considered
1. **Component Library (MUI or Ant Design):**
   - *Rejected:* Heavy bundle size, difficult to customize into a modern medical SaaS aesthetic, conflicting style overrides.
2. **Vanilla Plain CSS:**
   - *Rejected:* Lacks standardized tokens, slower development speed, higher likelihood of CSS regressions.

### Impact on Project
- **Positive:** Modern, state-of-the-art medical aesthetic; 100% design consistency; rapid component composition.
- **Trade-off:** Requires team discipline to stick to designated semantic tokens rather than arbitrary Tailwind palette values.
