# Persistent Project Memory & Knowledge Base

**Project:** Generic Medicine Store & Multi-Tenant SaaS Platform  
**Codebase Identifier:** `generic-medicine-store` (`kishori`)  
**Domain:** Healthcare E-Commerce, Generic Drug Price Comparison & Pharmacy SaaS  
**Document Status:** Living Document / Active Context  
**Last Synchronized:** 2026-09-09 (Phase 1 production hardening — v1.4.0)  

---

## 1. Project Overview

### 1.1 Mission & Value Proposition
The **Generic Medicine Store** platform bridges the gap between skyrocketing prescription drug costs and affordable, FDA/CDSCO bio-equivalent generic medications. By analyzing the chemical salts and active pharmaceutical ingredients (APIs) in branded drugs, the platform identifies therapeutically identical generic alternatives and aggregates live pricing across certified pharmacy networks.

Patients can compare prices in real time, view exact percentage savings (frequently between 60% and 85%), upload prescriptions for automated and pharmacist-verified audit, and order for rapid home delivery with cold-chain temperature assurance.

For retail pharmacies and enterprise pharmacy chains, the platform provides a multi-tenant SaaS portal featuring dynamic Buy-Box repricing, inventory sync, order fulfillment queues, and automated commission settlements.

### 1.2 Target User Personas
1. **The Chronic Care Patient (e.g., Eleanor Vance, 68):** Requires daily maintenance medications (hypertension, diabetes, cholesterol). Seeks recurring savings, simple dosage instructions, and reliable delivery.
2. **The Budget-Conscious Family Caregiver (e.g., Marcus Chen, 36):** Manages prescriptions for children and aging parents. Needs fast price comparison across multiple brands and guaranteed bio-equivalence safety.
3. **The Retail Pharmacy Admin / Owner (e.g., Rajesh Patel, Apollo / MedPlus Branch):** Seeks incremental order volume, real-time inventory synchronization, competitive repricing tools, and clear commission payouts.
4. **The SuperAdmin / Platform Operations Lead:** Manages tenant onboarding, schema isolation, commission rate configuration, regulatory audit logs, and cold-chain compliance.

---

## 2. Comprehensive Tech Stack

| Layer | Technology | Version / Spec | Primary Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `19.0.1` | High-performance reactive UI rendering & component hierarchy |
| **Language & Typings** | TypeScript | `~5.8.2` | Strict end-to-end type safety, domain models, and interfaces |
| **Build & Dev Server** | Vite | `6.2.3` | Instant HMR, fast production bundling, ES modules |
| **Styling Engine** | Tailwind CSS | `4.1.14` | Utility-first, semantic medical theme styling |
| **Micro-Interactions** | Motion (Framer) | `12.23.24` | Fluid transitions, drawer slide animations, layout changes |
| **Iconography** | Lucide React | `0.546.0` | Accessible, crisp medical, navigation, and e-commerce icons |
| **AI / OCR Integration** | Google GenAI SDK | `@google/genai ^2.4.0` | Prescription parsing, salt extraction, and semantic search |
| **Backend Runtime** | Node.js + Express | Node 22+ / Express 4.21 | Modular monolith API, tenant routing, and middleware |
| **Execution Tooling** | TSX & Node Types | `tsx ^4.21.0`, `@types/node` | TypeScript execution without manual pre-compilation |
| **Primary Database** | PostgreSQL | 16+ (Multi-Tenant) | Schema-per-tenant (`tnt_*`), Row-Level Security (RLS) |
| **Cache & Real-Time** | Redis Sentinel | 7.x | High-speed Buy-Box caching, ephemeral carts, rate limiting |
| **Security & Edge** | Cloudflare Enterprise | Edge / WAF | TLS 1.3 termination, DDoS protection, geo-routing |

---

## 3. Features Completed & Active

### 3.1 Patient Marketplace Subsystem
- [x] **Global Navigation & Mode Switcher:** Instant switching between Patient Marketplace, Pharmacy Portal, Architecture Explorer, PRD Viewer, Profile, and Login.
- [x] **Mobile / Desktop Frame Toggle:** Interactive device frame simulation allowing live testing of responsive mobile layouts.
- [x] **Medicine Discovery Screen:** Curated categories (Cardiovascular, Anti-Diabetic, Antibiotics, Pain Relief, Respiratory, Gastrointestinal), search bar with brand-to-salt suggestions, and promotional banners.
- [x] **Price Comparison Engine:** Side-by-side comparison cards displaying the branded drug MRP, generic price, net savings, percentage saved, and CDSCO/FDA therapeutic equivalence rating (e.g., `AB Rated`).
- [x] **Interactive Cart & Rx Requirement:** Cart management with quantity modifiers, instant savings summary, prescription requirement indicators, and file upload triggers.
- [x] **Prescription Upload Modal:** Client-side prescription file upload with thumbnail preview, doctor name, and license capture.
- [x] **Live Order Tracking & Cold-Chain IoT Telemetry:** Real-time visual tracking of dispatch status, courier name, vehicle details, estimated arrival, and live sensor temperature monitoring (e.g., `4.2°C` within the optimal `2°C - 8°C` range).
- [x] **Patient Order History & Repeat Prescriptions:** Historical order cards with one-click re-order and invoice download.
- [x] **Comprehensive Patient Health Profile:** Managing chronic conditions, known drug allergies, primary delivery address, insurance details (RxBIN, RxPCN, Group), emergency contacts, and active login sessions.

### 3.2 Multi-Tenant Pharmacy & Platform Portal
- [x] **Executive Overview Dashboard:** Platform-wide and tenant-specific Gross Merchandise Value (GMV), Buy-Box win rate (e.g., 78.4%), prescription turnaround SLA, active SKU metrics, and revenue charts.
- [x] **Multi-Tenant Organization Management:** Provisioning pharmacy organizations (Apollo Pharmacy, MedPlus, Wellness Forever, Frank Ross) with tier allocation, schema mapping (`tnt_apollo_01`), encryption keys, license validity audits, and quota gauges.
- [x] **Orders Pipeline & Pharmacist Audit Queue:** Kanban/tabular view of orders categorized by lifecycle stage: `Validating Rx`, `Dispensing`, `Cold-Chain Packaged`, `Awaiting Pickup`, and `In-Transit`.
- [x] **Pharmacist Digital Sign-Off:** Form for registered pharmacists to inspect Rx images, verify doctor details, and digitally sign approval before dispensing.
- [x] **Vendor Listings & Repricing Engine:** Real-time inventory grid showing unit price, competitor lowest price, Buy-Box status (`winning`, `beaten`, `paused`), bio-equivalent rating, and automated repricing triggers.
- [x] **Global Slide-Out Menu Drawer:** Quick access drawer linking across all platform management modules.

### 3.3 System Documentation & Architectural Tools
- [x] **Interactive Architecture Explorer:** Live inspection of the 6 major architectural layers: Unified Client, Edge/WAF, IAM & Tenant Context Resolver, Modular Monolith Core, Multi-Tenant Database, and External Integrations.
- [x] **Integrated 12-Section PRD Viewer:** Complete interactive Product Requirements Document with printable PDF formatting and tabbed navigation.

### 3.4 Authentication & Session Subsystem
- [x] **Multi-Role Authentication Switcher:** Instant role preview for Patient, Pharmacy Admin, and SuperAdmin personas.
- [x] **Security & Audit Indicators:** Displaying 2FA status, last login IP address, active session revocation, and HIPAA acknowledgment records.

---

## 4. Pending Features & Backlog

- [ ] **Automated E-Prescription Direct Integration:** Direct ingestion of digital prescriptions from electronic health record (EHR) systems via FHIR / HL7 standards.
- [ ] **Drug-Drug Interaction AI Alerting:** Automatic cross-checking of all items in cart against the patient's declared chronic medications and active allergies using Gemini AI.
- [ ] **Voice Search in Local Languages:** Multilingual voice input for rural and elderly patients to search medications in vernacular languages (Hindi, Bengali, Tamil, Telugu, Spanish).
- [ ] **Automated Third-Party Logistics (3PL) Webhook Dispatch:** Automatic pickup assignment and courier dispatch to Dunzo, Shadowfax, or FedEx Healthcare Express upon pharmacist sign-off.
- [ ] **Wholesale B2B Bulk Generic Procurement:** A specialized procurement portal enabling independent medical stores to purchase bulk generic stocks directly from verified pharmaceutical manufacturers.
- [ ] **Automated Insurance Adjudication:** Direct online claims submission using RxBIN / RxPCN numbers to determine patient co-pay vs insurer coverage.

---

## 5. API Endpoints Specification

### 5.1 Authentication & Tenant Context
```http
POST   /api/v1/auth/login                  # Authenticate user & return RS256 JWT with tenant claims
POST   /api/v1/auth/refresh                # Refresh expired access token
POST   /api/v1/auth/logout                 # Invalidate active session in Redis
GET    /api/v1/auth/me                     # Return authenticated profile, roles, and tenant context
```

### 5.2 Patient Marketplace & Catalog
```http
GET    /api/v1/catalog/search?q={query}    # Fuzzy search across brand names, generic salts, and categories
GET    /api/v1/catalog/salts/{saltId}      # Retrieve bio-equivalence details and therapeutic equivalence
GET    /api/v1/catalog/compare/{brandId}   # Get price comparison matrix: Brand MRP vs all generic listings
GET    /api/v1/catalog/categories          # List therapeutic categories with active SKU counts
```

### 5.3 Buy-Box & Dynamic Pricing
```http
GET    /api/v1/pricing/buy-box/{saltId}    # Retrieve current Buy-Box winning listing and vendor details
POST   /api/v1/pricing/reprice-simulation  # Tenant simulated repricing impact against competitors
```

### 5.4 Cart, Checkout & Orders
```http
GET    /api/v1/cart                        # Fetch current patient ephemeral cart
POST   /api/v1/cart/items                  # Add medicine listing to cart
DELETE /api/v1/cart/items/{itemId}         # Remove item from cart
POST   /api/v1/prescriptions/upload        # Upload prescription image; triggers Gemini AI OCR
POST   /api/v1/orders/checkout             # Create platform order and hold funds in escrow
GET    /api/v1/orders/patient/history      # Retrieve historical orders for authenticated patient
GET    /api/v1/orders/{orderId}/tracking   # Live courier telemetry, GPS coordinates, and temperature
```

### 5.5 Pharmacy Tenant & Operations Portal
```http
GET    /api/v1/tenant/dashboard/metrics    # GMV, SLA adherence, Buy-Box win rate
GET    /api/v1/tenant/inventory            # List pharmacy SKUs, stock levels, and batch numbers
POST   /api/v1/tenant/inventory/sync       # Bulk sync inventory via CSV or POS webhook
PATCH  /api/v1/tenant/inventory/{skuId}    # Update unit price, batch, or toggle listing status
GET    /api/v1/tenant/orders/queue         # Orders awaiting Rx verification or fulfillment
POST   /api/v1/tenant/orders/{id}/verify-rx# Pharmacist digital sign-off and license entry
POST   /api/v1/tenant/orders/{id}/dispatch # Mark packaged, assign courier, attach cold-chain sensor
GET    /api/v1/tenant/payouts/settlements  # Escrow ledger, commission deductions, bank transfers
```

### 5.6 Cold-Chain IoT Telemetry & Alerting
```http
POST   /api/v1/telemetry/iot/ingest        # Ingest temperature and GPS packet from hardware sensor
GET    /api/v1/telemetry/orders/{id}/temp  # Retrieve historical temperature curve for an order
POST   /api/v1/telemetry/alerts/breach     # Trigger automated breach alert and initiate re-dispatch
```

---

## 6. Database Schema Summary

### 6.1 Shared Platform Schema (`public`)

```sql
-- Universal Drug Master (Standardized by Chemical Salt)
CREATE TABLE public.drug_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generic_salt VARCHAR(255) NOT NULL,
    brand_reference_name VARCHAR(255) NOT NULL,
    brand_reference_mrp NUMERIC(10, 2) NOT NULL,
    therapeutic_category VARCHAR(100) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    strength VARCHAR(50) NOT NULL,
    bio_equivalent_rating VARCHAR(10) DEFAULT 'AB',
    is_rx_required BOOLEAN DEFAULT FALSE,
    contraindications TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pharmacy Tenant Directory
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tier VARCHAR(50) DEFAULT 'Standard Tier',
    commission_rate NUMERIC(5, 2) NOT NULL,
    db_schema_name VARCHAR(63) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    license_valid_until DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Provisioning',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Global Orders & Escrow Ledger
CREATE TABLE public.platform_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    tenant_id UUID REFERENCES public.tenants(id),
    customer_id UUID NOT NULL,
    order_total NUMERIC(10, 2) NOT NULL,
    platform_commission NUMERIC(10, 2) NOT NULL,
    tenant_payout NUMERIC(10, 2) NOT NULL,
    escrow_status VARCHAR(50) DEFAULT 'Held_In_Escrow',
    fulfillment_status VARCHAR(50) DEFAULT 'Validating Rx',
    rx_document_url TEXT,
    pharmacist_audit_id VARCHAR(100),
    is_cold_chain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- IoT Cold-Chain Telemetry Log
CREATE TABLE public.telemetry_logs (
    id BIGSERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.platform_orders(id),
    sensor_id VARCHAR(100) NOT NULL,
    temperature_celsius NUMERIC(4, 2) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    is_breached BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.2 Isolated Tenant Schemas (`tnt_<org_code>`)

```sql
-- Example Schema for Apollo Pharmacy: tnt_apollo_01
CREATE SCHEMA IF NOT EXISTS tnt_apollo_01;

CREATE TABLE tnt_apollo_01.inventory_stock (
    sku_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drug_master_id UUID NOT NULL,
    ndc_code VARCHAR(50),
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    stock_units_available INT NOT NULL DEFAULT 0,
    store_outlet_id UUID NOT NULL,
    is_buy_box_eligible BOOLEAN DEFAULT TRUE,
    last_synced_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tnt_apollo_01.repricing_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku_id UUID REFERENCES tnt_apollo_01.inventory_stock(sku_id),
    floor_price NUMERIC(10, 2) NOT NULL,
    target_undercut_percentage NUMERIC(5, 2) DEFAULT 2.0,
    auto_reprice_enabled BOOLEAN DEFAULT TRUE
);

CREATE TABLE tnt_apollo_01.pharmacy_staff (
    staff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'Staff Pharmacist',
    can_sign_off_rx BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## 7. Important Business Logic

### 7.1 Patient Savings Calculation
$$\text{Patient Savings (\$) } = \text{Brand Reference MRP} - \text{Generic Unit Price}$$
$$\text{Savings Percentage (\%)} = \left( \frac{\text{Brand Reference MRP} - \text{Generic Unit Price}}{\text{Brand Reference MRP}} \right) \times 100$$
- Displayed with green badge highlight if savings exceed 40%.

### 7.2 Buy-Box Winning Allocation Algorithm
Every 60 seconds (or upon price sync), Redis Sentinel scores all active vendor listings for a specific generic molecule:
$$\text{Total Score} = (0.70 \times S_{\text{price}}) + (0.20 \times S_{\text{stock}}) + (0.10 \times S_{\text{proximity}})$$
Where:
- $S_{\text{price}} = (\text{Lowest Available Price} / \text{Vendor Price}) \times 100$
- $S_{\text{stock}} = \min(100, (\text{Stock Units Available} / 50) \times 100)$
- $S_{\text{proximity}} = \max(0, 100 - (\text{Distance in Miles} \times 5))$

The listing with the highest composite score wins the primary `winning` badge and Buy-Box placement.

### 7.3 Commission & Escrow Settlement
- **Escrow Hold Period:** 48 hours post verified delivery confirmation.
- **Platform Commission Deduction:** Deducted automatically from GMV based on tenant agreement ($5\% - 12\%$).
- **Disbursement:** Automated ACH/NEFT settlement batch processed every Tuesday at 02:00 UTC.

### 7.4 Cold-Chain Safety Protocol
- Allowed temperature range: $2.0^\circ\text{C}$ to $8.0^\circ\text{C}$.
- If sensor telemetry reports $< 1.8^\circ\text{C}$ or $> 8.2^\circ\text{C}$ for more than 10 consecutive minutes:
  1. Trigger high-priority alert to logistics dashboard.
  2. Order state moves to `Cold-Chain Breached / Quarantine`.
  3. System automatically creates an expedited re-dispatch order from the closest alternate fulfillment center at zero charge to the patient.

---

## 8. Known Issues & Technical Debt

1. **Mock Data to Live PostgreSQL Connection:** The frontend currently renders from robust mock fixtures in `src/data/initialData.ts`. Transitioning to production requires activating environment variables (`VITE_API_BASE_URL`, `ENABLE_LIVE_DATABASE=true`) and hooking React query hooks to Express routes.
2. **Offline Mobile State Sync:** If a patient loses network connectivity mid-checkout, the cart is stored in memory and may reset upon full page refresh. Needs IndexedDB/local storage persistence with encryption.
3. **Prescription OCR Cold Start:** Initial Gemini AI OCR parsing call can take 2.5–4.0 seconds depending on image resolution. Requires asynchronous background processing with a polling/WebSocket status indicator. A `LoadingSpinner` component has been added to `src/components/common/` in anticipation of this UI state.

### 8.1 New Modules Added (v1.4.0)

| Module | Path | Purpose |
| :--- | :--- | :--- |
| **Utility Library** | `src/utils/formatters.ts` | 19 pure functions: currency, savings, cold-chain, PHI masking, drug labels |
| **Buy-Box Helpers** | `src/utils/buyBoxHelpers.ts` | Frontend Buy-Box scoring mirror of ADR-004 algorithm |
| **Utils Barrel** | `src/utils/index.ts` | Clean single-import access for all utilities |
| **SavingsBadge** | `src/components/common/SavingsBadge.tsx` | Pill/card savings display (rules.md §4.2 mandatory) |
| **BioEquivalenceBadge** | `src/components/common/BioEquivalenceBadge.tsx` | FDA/CDSCO rating classifier with semantic tiers |
| **ColdChainBadge** | `src/components/common/ColdChainBadge.tsx` | Live temp indicator; rose breach / emerald optimal (ADR-012) |
| **EmptyState** | `src/components/common/EmptyState.tsx` | Accessible empty state with aria-live (rules.md §1.3) |
| **OrderStatusBadge** | `src/components/common/OrderStatusBadge.tsx` | All 8 `PlatformOrder.status` values color-coded |
| **RxRequiredBadge** | `src/components/common/RxRequiredBadge.tsx` | Schedule H / OTC indicator (ADR-005, ADR-012) |
| **LoadingSpinner** | `src/components/common/LoadingSpinner.tsx` | Accessible spinner for OCR cold-start and API calls |
| **Common Barrel** | `src/components/common/index.ts` | Single import for all common components |

---

## 9. Future Roadmap

### Phase 1: MVP Marketplace & Multi-Tenant Foundation (Complete: Q1–Q3 2026 → v1.4.0)
- Complete patient discovery, price comparison, cart, order tracking, multi-tenant portal, repricing engine, and interactive PRD/architecture viewer.
- ✅ **v1.4.0 production hardening:** Shared utility library (`src/utils/`), common component atoms (`src/components/common/`), full environment variable documentation (`.env.example`), package metadata corrected. All 11 Phase 1 quality gates passing.

### Phase 2: Logistics Integration & Mobile Native Apps (Q4 2026)
- Integration with Dunzo, Shadowfax, and FedEx Healthcare APIs.
- Release of React Native / iOS & Android patient mobile apps.
- Bluetooth Low Energy (BLE) temperature logger automated sync upon delivery receipt.

### Phase 3: Clinic EHR Integration & B2B Wholesale (Q1–Q2 2027)
- Direct prescription push from clinic management software (FHIR/HL7 standard).
- B2B bulk generic procurement exchange connecting verified manufacturers directly to retail pharmacies.

### Phase 4: Pan-National Expansion & Direct Insurance Settlement (Q3 2027+)
- Full real-time health insurance co-pay adjudication.
- Expansion across 150+ tier-1 and tier-2 cities.
