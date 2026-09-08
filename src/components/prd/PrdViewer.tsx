import React, { useState } from 'react';

export const PrdViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState('doc-control');

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'doc-control', title: '1. Document Control & Revisions' },
    { id: 'exec-summary', title: '2. Executive Summary' },
    { id: 'problem-statement', title: '3. Problem Statement & Market Opportunity' },
    { id: 'goals-non-goals', title: '4. Product Goals & Non-Goals' },
    { id: 'success-metrics', title: '5. Success Metrics (North Star & AARRR)' },
    { id: 'personas', title: '6. User Personas & JTBD' },
    { id: 'scope', title: '7. Scope & Release Phases' },
    { id: 'functional-reqs', title: '8. Detailed Functional Requirements' },
    { id: 'edge-cases', title: '9. Edge Cases & Safety Fallbacks' },
    { id: 'data-model', title: '10. Multi-Tenant Data Architecture' },
    { id: 'nfrs', title: '11. Non-Functional Requirements (NFRs)' },
    { id: 'security-compliance', title: '12. Security, HIPAA & EPCS Compliance' }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Header & Export PDF Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
              Product Requirements Document (PRD)
            </h1>
            <span className="text-[11px] font-mono bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
              v2.4 Final
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Generic Medicine Store & Multi-Tenant SaaS Platform Specification Dossier
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors print:hidden"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sticky Table of Contents + Document Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar (3 cols) */}
        <div className="lg:col-span-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2 sticky top-20 print:hidden text-xs">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">
            Table of Contents
          </div>
          <div className="space-y-1">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                className={`block px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                  activeSection === sec.id
                    ? 'bg-amber-50 text-amber-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sec.title}
              </a>
            ))}
          </div>
        </div>

        {/* PRD Body Content (9 cols) */}
        <div className="lg:col-span-9 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-8 text-xs leading-relaxed text-slate-700 font-body">
          {/* Section 1 */}
          <section id="doc-control" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">1. Document Control & Revision History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px]">
                  <tr>
                    <th className="p-2 border-b">Version</th>
                    <th className="p-2 border-b">Date</th>
                    <th className="p-2 border-b">Author</th>
                    <th className="p-2 border-b">Approved By</th>
                    <th className="p-2 border-b">Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-2 font-mono font-bold">2.4</td>
                    <td className="p-2">Sept 2026</td>
                    <td className="p-2">Principal Architect</td>
                    <td className="p-2">Dr. Elena Vance (Lead Clinical Ops)</td>
                    <td className="p-2">Finalized Multi-Tenant schema-per-tenant isolation & buy-box algorithm.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2 */}
          <section id="exec-summary" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">2. Executive Summary</h2>
            <p>
              <strong>MediGeneric</strong> is a multi-tenant pharmaceutical SaaS platform and consumer marketplace delivering radical price transparency and access to bio-equivalent generic medicines. By providing a direct comparison engine between branded pharmaceutical markups and FDA Orange Book AB-rated generic equivalents, patients save 60% to 85% on critical prescriptions while local licensed pharmacies compete dynamically to fulfill orders within 20–30 minutes through cold-chain audited dispatch.
            </p>
          </section>

          {/* Section 3 */}
          <section id="problem-statement" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">3. Problem Statement & Market Opportunity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-900">400% Branded Markup</h4>
                <p className="text-[11px] text-red-700 mt-1">
                  Patients routinely pay 3x to 10x higher prices for off-patent medications simply due to lack of transparent molecule awareness.
                </p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-bold text-amber-900">Fragmented Inventory</h4>
                <p className="text-[11px] text-amber-700 mt-1">
                  Independent pharmacies hold surplus generic inventory but lack direct-to-consumer digital demand channels.
                </p>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200">
                <h4 className="font-bold text-sky-900">Prescription Friction</h4>
                <p className="text-[11px] text-sky-700 mt-1">
                  Legacy systems require manual faxing and phone verification rather than cryptographic EPCS validation.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="goals-non-goals" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">4. Product Goals & Non-Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-800 uppercase text-[11px]">Primary Goals</h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>Provide 100% transparent generic-to-brand price comparisons.</li>
                  <li>Enforce FDA Orange Book AB bio-equivalence on all generic listings.</li>
                  <li>Provide isolated PostgreSQL multi-tenant database schemas for every pharmacy network.</li>
                  <li>Ensure cold-chain compliance (2°C–8°C) with automated IoT sensor audit trails.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-500 uppercase text-[11px]">Non-Goals</h4>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  <li>We do not manufacture pharmaceutical chemical compounds.</li>
                  <li>We do not fulfill Schedule II narcotics or illicit substances.</li>
                  <li>We do not share patient PII across multi-tenant database boundaries.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section id="success-metrics" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">5. Success Metrics (North Star & AARRR)</h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">North Star Metric</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">Aggregate Patient Dollars Saved ($)</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Target: $5.0M patient savings delivered within 180 days of platform launch.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Acquisition</span>
                  <strong className="text-slate-800">&lt;$8.50 Blended CAC</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Activation</span>
                  <strong className="text-slate-800">74% Rx Upload-to-Order</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Retention</span>
                  <strong className="text-slate-800">68% 90-Day Refill Rate</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Referral</span>
                  <strong className="text-slate-800">NPS &gt; 78</strong>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section id="personas" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">6. User Personas & JTBD</h2>
            <div className="space-y-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Persona 1: Chronically-Medicated Patient (Sarah, 58)</div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Takes daily Atorvastatin and Metformin. Frustrated by $70/mo co-pays. JTBD: "Find identical verified generics for under $15/mo delivered reliably to my door."
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Persona 2: Independent Pharmacy Owner (David, RPh)</div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Operates Apollo Pharmacy Hub #104. JTBD: "Compete against mega-chains by winning online buy-boxes and automatically dispatching generics to nearby patients."
                </p>
              </div>
            </div>
          </section>

          {/* Section 8 */}
          <section id="functional-reqs" className="space-y-3 pb-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-headline">8. Detailed Functional Requirements</h2>
            <div className="space-y-2">
              <div className="p-3 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 font-mono">FR-PRICE-01: Real-Time Buy-Box Repricing Engine</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">P0</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  System shall monitor competitor prices every 60 seconds and auto-undercut by $0.05 while respecting tenant minimum margin floor of 12%.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 font-mono">FR-TENANT-01: Schema-per-Tenant PostgreSQL RLS</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded">P0</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  All tenant queries shall execute within dedicated schema names (<code className="font-mono text-sky-700">tnt_*</code>) governed by PostgreSQL Row-Level Security policies.
                </p>
              </div>

              <div className="p-3 border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-800 font-mono">FR-COLD-01: IoT Cold-Chain Compliance Audit</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">P0</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Couriers transporting temperature-sensitive medicines must submit telemetry logs staying between 2°C and 8°C throughout transit.
                </p>
              </div>
            </div>
          </section>

          {/* Section 12 */}
          <section id="security-compliance" className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-headline">12. Security, HIPAA & EPCS Compliance</h2>
            <p>
              The platform adheres to HIPAA Security Rule 45 CFR Part 160 and 164. All Protected Health Information (PHI) is encrypted in-transit via TLS 1.3 and at-rest using tenant-specific AES-256 KMS keys. Electronic Prescriptions for Controlled Substances (EPCS) are digitally authenticated using SHA-256 cryptographic signatures.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
