# AI Development & Architecture Rules

**Project:** Generic Medicine Store & Multi-Tenant SaaS Platform  
**Target Assistant:** AI Coding Assistants & Senior Software Engineers  
**Enforcement Level:** Strict / Mandatory  
**Last Updated:** 2026-09-09  

---

## Prime Directive

> [!IMPORTANT]
> **NEVER BREAK EXISTING FUNCTIONALITY UNLESS EXPLICITLY REQUESTED.**  
> Always preserve existing features, routes, mock datasets, navigation states, and UI components. All modifications and refactors must maintain 100% backward compatibility with active views (`patient`, `portal`, `architecture`, `prd`, `login`, `profile`). Test all view transitions and state integrity before concluding changes.

---

## 1. Coding Standards

### 1.1 TypeScript Strictness
- **No `any` Types:** Strictly prohibit `any`. Use explicit interfaces, type aliases, discriminated unions, or generics.
- **Type Placement:** All centralized domain models must reside in `src/types.ts`. Avoid defining one-off interfaces inline inside components unless strictly local and non-reusable.
- **Null & Undefined Safety:** Always utilize optional chaining (`?.`), nullish coalescing (`??`), and explicit type guards. Never use unchecked non-null assertions (`!`) unless guaranteed by a preceding type guard.
- **Compiler Cleanliness:** Every file must pass type checks cleanly (`npm run lint` or `npx tsc --noEmit`) with zero errors or warnings.

### 1.2 React 19 & Component Architecture
- **Functional Components:** All components must be written as functional components (`React.FC<Props>` or `function Component(props: Props)`).
- **Rules of Hooks:**
  - Call hooks only at the top level of React functions; never inside loops, conditions, or nested functions.
  - Maintain exhaustive dependency arrays for `useEffect`, `useCallback`, and `useMemo`.
  - Prefer derived state calculations over redundant state variables that risk falling out of sync.
- **State Immutability:** Never mutate state arrays or objects directly. Always produce new object or array references:
  ```typescript
  // CORRECT - Immutable update
  setListings(prev => 
    prev.map(item => item.id === targetId ? { ...item, unitPrice: newPrice } : item)
  );

  // INCORRECT - Never mutate existing references
  prev.find(item => item.id === targetId).unitPrice = newPrice;
  ```

### 1.3 Error Handling & Defensive Programming
- Wrap asynchronous calls, OCR parsers, and external integrations in robust `try...catch` blocks with human-readable error messages and fallback states.
- Always provide accessible empty states (e.g., "No generic medicines found matching your search") rather than rendering blank screens or broken layouts.
- Validate input parameters before running mathematical calculations (e.g., ensure `brandReferencePrice > 0` before calculating savings percentages to avoid division by zero).

---

## 2. Folder Structure Rules

The codebase must strictly maintain a modular, domain-centric directory structure:

```
kishori/
├── index.html                  # HTML5 entry shell with meta viewport and typography
├── package.json                # Dependencies and npm build scripts
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite bundling, server, and plugin configuration
├── public/                     # Static media, icons, and favicons
└── src/
    ├── App.tsx                 # Root application controller & mode switcher
    ├── main.tsx                # React DOM root hydration
    ├── index.css               # Tailwind CSS v4 directives & theme styles
    ├── types.ts                # Centralized domain types and interfaces
    │
    ├── components/             # Domain-organized UI components
    │   ├── NavigationHeader.tsx# Universal top navigation bar & mode pill switcher
    │   ├── MenuBarDrawer.tsx   # Global slide-out drawer navigation
    │   │
    │   ├── patient/            # Patient Marketplace Subsystem
    │   │   ├── PatientHeader.tsx       # Search bar, location pill, cart badge
    │   │   ├── DiscoverScreen.tsx      # Category pills, featured generics, promo cards
    │   │   ├── PriceCompareScreen.tsx  # Brand vs generic comparison cards & savings pill
    │   │   ├── CartScreen.tsx          # Cart items, Rx upload trigger, checkout modal
    │   │   ├── OrderTrackingScreen.tsx # Live courier map & cold-chain temperature telemetry
    │   │   ├── OrderHistoryScreen.tsx  # Historical invoices & re-order shortcuts
    │   │   └── ProfileScreen.tsx       # Health profile, insurance BIN/PCN, allergies
    │   │
    │   ├── portal/             # Multi-Tenant Pharmacy & Ops Portal Subsystem
    │   │   ├── PortalHeader.tsx        # Tenant switcher, live sync indicators, quick stats
    │   │   ├── PortalSidebar.tsx       # Dark sidebar navigation tabs
    │   │   ├── OverviewScreen.tsx      # Executive GMV, Buy-Box win rate, SLA metrics
    │   │   ├── MultiTenantScreen.tsx   # Tenant provisioning, schema & RLS management
    │   │   ├── OrdersPipelineScreen.tsx# Rx validation queue, dispensing, dispatch audit
    │   │   └── VendorListingsScreen.tsx# Real-time SKU inventory & repricing engine
    │   │
    │   ├── auth/               # Authentication Subsystem
    │   │   └── LoginPage.tsx           # Multi-role login switcher (Patient/Admin/SuperAdmin)
    │   │
    │   ├── architecture/       # Interactive System Architecture Explorer
    │   │   └── ArchitectureExplorer.tsx# Diagram explorer, layer inspector, data flow graphs
    │   │
    │   └── prd/                # In-App Product Requirements Document Viewer
    │       └── PrdViewer.tsx           # 12-section interactive PRD with printable PDF export
    │
    └── data/                   # Seed fixtures & persistent client mock state
        ├── initialData.ts      # Tenants, orders, listings, and cart sample datasets
        └── userData.ts         # User profile, insurance, and medical record defaults
```

### 2.1 File Placement Rules
1. **Never dump files into the root `src/` directory.** Place files strictly in their designated subfolder based on user role and domain context.
2. Shared common components (e.g., confirmation modals, badge icons) belong in `src/components/common/`.
3. Specialized business logic, client-side caching, or external API callers belong in `src/services/`.
4. Pure formatting functions (currency formatting, dosage calculations, date math) belong in `src/utils/`.

---

## 3. Naming Conventions

| Entity | Pattern | Examples |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.tsx` | `PriceCompareScreen.tsx`, `NavigationHeader.tsx` |
| **Custom Hooks** | `camelCase.ts` (`use*`) | `useCart.ts`, `useMedicineSearch.ts` |
| **Domain Interfaces / Types** | `PascalCase` | `MedicineListing`, `TenantOrganization`, `PlatformOrder` |
| **Constants & Mock Datasets**| `UPPER_SNAKE_CASE` | `INITIAL_TENANTS`, `MAX_CACHE_TTL_SECONDS` |
| **Utility Functions** | `camelCase` | `formatCurrency()`, `calculatePatientSavings()` |
| **CSS Classes** | Tailwind utility classes | `text-slate-900`, `bg-emerald-50`, `hover:shadow-md` |
| **Database Schemas & Tables** | `snake_case` with prefix | `tnt_apollo_01.inventory_stock`, `public.drug_master` |
| **Environment Variables** | `UPPER_SNAKE_CASE` | `VITE_API_BASE_URL`, `DATABASE_URL` |

---

## 4. UI/UX Consistency Rules

### 4.1 Visual Hierarchy & Color Palette
- **Primary Brand Theme:** Deep Medical Slate (`#0f172a`), Clean White backgrounds (`#ffffff`), and subtle slate borders (`border-slate-200`).
- **Trust & Value Accents:**
  - Emerald Green (`emerald-600` / `#059669`): Reserved strictly for **patient savings callouts** (e.g., "Save 78%"), bio-equivalent winning badges, and confirmed delivery states.
  - Medical Indigo / Blue (`blue-600` / `#2563eb`): Used for primary interactive actions, search triggers, and active navigation links.
  - Warm Amber (`amber-600` / `#d97706`): Used for prescription verification alerts, warnings, and pending actions.
  - Rose / Red (`rose-600` / `#e11d48`): Strictly reserved for cold-chain breaches, urgent allergies, and stock depletion alerts.
- **Card Containers:** Always use subtle rounded borders (`rounded-xl` or `rounded-2xl`), crisp borders (`border border-slate-200/80`), and gentle shadows (`shadow-xs` or `shadow-sm`).

### 4.2 Healthcare Domain Specifics
- **Savings Display:** Every generic medicine card MUST display:
  1. The branded reference drug price (struck-through, e.g., `~~$45.00~~`).
  2. The generic equivalent price in prominent bold text (e.g., `**$8.50**`).
  3. A green pill highlighting the percentage and dollar savings (e.g., `Save 81% ($36.50)`).
- **Bio-Equivalence Badge:** Display regulatory ratings prominently (e.g., `AB Rated`, `FDA Equivalent`, `CDSCO Approved`) so users feel 100% confident in therapeutic safety.
- **Cold-Chain Indicator:** Display temperature status (`2°C - 8°C Optimal`) for biologicals, insulin, and vaccines.

### 4.3 Responsive & Accessible Design
- **Touch Targets:** Minimum touch target size is $44 \times 44\text{ px}$ for all clickable buttons on mobile and desktop.
- **Screen Reader Support:** All icon-only buttons (`lucide-react` icons) must include descriptive `aria-label` or `title` attributes.
- **Frame Switcher:** Maintain the mobile phone frame toggle (`phoneFrame`) in `App.tsx` so stakeholders can inspect both desktop and mobile layouts in real time.

---

## 5. Git Commit Rules

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <short imperative summary>

[optional body explaining rationale and background]

[optional footer referencing issue or ADR]
```

### 5.1 Permitted Commit Types
- `feat`: A new feature or screen (e.g., `feat(patient): add generic salt auto-complete search`).
- `fix`: A bug fix (e.g., `fix(pricing): correct savings percentage round-off calculation`).
- `refactor`: Code change that neither fixes a bug nor adds a feature (e.g., `refactor(portal): extract orders table to separate sub-component`).
- `style`: Formatting, CSS adjustments, or visual polish with no logic change.
- `perf`: Performance optimization (e.g., `perf(cache): memoize price comparison calculations`).
- `docs`: Documentation updates, including `decisions.md`, `rules.md`, `memory.md`, or `changelog.md`.
- `test`: Adding or correcting tests.
- `chore`: Maintenance, dependencies, or configuration changes.

### 5.2 Commit Message Guidelines
- Use imperative mood: "add", "fix", "update", NOT "added", "fixing", "updates".
- Limit the first line to 72 characters.
- Reference relevant ADRs or PRD sections where appropriate (e.g., `feat(compliance): implement ADR-005 dual-stage Rx verification`).

---

## 6. Security and Environment Variable Rules

### 6.1 Zero Hardcoded Secrets
- **Strict Prohibition:** Never commit passwords, private API keys, database connection strings, JWT signing secrets, or third-party tokens to source code or git history.
- **Client vs Server Secrets:**
  - Client-exposed variables must be prefixed with `VITE_` (e.g., `VITE_GEMINI_API_KEY`, `VITE_API_BASE_URL`).
  - Server-only variables (e.g., `DATABASE_URL`, `JWT_PRIVATE_KEY`, `STRIPE_SECRET_KEY`) must NEVER be prefixed with `VITE_` and must NEVER be imported into frontend code.
- **Environment Template:** Any new environment variable must be documented in `.env.example` with dummy placeholder values and descriptive comments.

### 6.2 Multi-Tenant Data Isolation Enforcement
- **Tenant Context Injection:** Every database query executed on behalf of a tenant must explicitly resolve and enforce the `tenant_id` context.
- **Zero Cross-Tenant Leakage:** Under no circumstances should an API query allow a pharmacy admin to inspect, modify, or delete another pharmacy's inventory, prices, or orders.
- **Row-Level Security (RLS):** Database sessions must execute `SET LOCAL app.current_tenant_id = :tenantId;` prior to running tenant-specific queries.

### 6.3 Patient Health Information (PHI) & Privacy (HIPAA Compliance)
- **PII Masking:** Mask patient phone numbers, email addresses, and street addresses on non-privileged displays (e.g., `+1 (•••) •••-4821`).
- **Encrypted Local Storage:** Never write unencrypted medical diagnosis or prescription records to standard browser `localStorage`. Use in-memory state or encrypted session storage.
- **Prescription URLs:** Store prescription images in secure, short-lived signed S3/GCS bucket URLs with a TTL $\le 15\text{ minutes}$.

---

## 7. Rules for AI Agents Pair-Programming on this Repository

1. **Read Before Writing:** Always inspect `src/types.ts`, `src/data/initialData.ts`, and relevant screen components before creating new files or modifying state.
2. **Preserve Demo Fixtures:** Do not wipe out mock records in `src/data/initialData.ts` or `src/data/userData.ts`. When adding features, append realistic healthcare records that align with existing mock schemas.
3. **Keep Context Files Synchronized:** When making architectural or product changes, update:
   - `decisions.md` (if an architectural or product choice was made).
   - `rules.md` (if coding or engineering constraints changed).
   - `memory.md` (to reflect updated feature status, endpoints, or schema).
   - `changelog.md` (to log the exact changes made under the current version).
   - `phase.md` (to track milestones, workstream deliverables, and transition gates across phases).
