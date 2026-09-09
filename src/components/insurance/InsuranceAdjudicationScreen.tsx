import React, { useState } from 'react';
import {
  InsuranceClaim,
  TpaProvider,
  NcpdpClaimRequest,
  CoPayCalculation,
  ClaimStatus,
} from '../../types';
import {
  INITIAL_INSURANCE_CLAIMS,
  INITIAL_TPA_PROVIDERS,
} from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

const STATUS_CONFIG: Record<ClaimStatus, { bg: string; text: string; icon: string }> = {
  Draft:              { bg: 'bg-slate-100',    text: 'text-slate-600',    icon: 'draft'         },
  Submitted:          { bg: 'bg-blue-50',      text: 'text-blue-700',     icon: 'upload_file'   },
  Adjudicating:       { bg: 'bg-amber-50',     text: 'text-amber-700',    icon: 'pending'       },
  Approved:           { bg: 'bg-emerald-50',   text: 'text-emerald-700',  icon: 'check_circle'  },
  Partially_Approved: { bg: 'bg-emerald-50',   text: 'text-emerald-600',  icon: 'check'         },
  Denied:             { bg: 'bg-rose-50',      text: 'text-rose-700',     icon: 'cancel'        },
  Appeal_Pending:     { bg: 'bg-amber-50',     text: 'text-amber-700',    icon: 'gavel'         },
  Appeal_Approved:    { bg: 'bg-emerald-50',   text: 'text-emerald-700',  icon: 'verified'      },
  Appeal_Denied:      { bg: 'bg-rose-50',      text: 'text-rose-700',     icon: 'do_not_disturb'},
  Paid:               { bg: 'bg-indigo-50',    text: 'text-indigo-700',   icon: 'payments'      },
};

const TIER_COLORS: Record<string, string> = {
  Tier1_Generic:      'text-emerald-700',
  Tier2_Preferred:    'text-blue-700',
  Tier3_NonPreferred: 'text-amber-700',
  Tier4_Specialty:    'text-rose-700',
};

type Tab = 'calculator' | 'claims' | 'providers';

export const InsuranceAdjudicationScreen: React.FC = () => {
  const [tab, setTab] = useState<Tab>('calculator');
  const [claims, setClaims] = useState<InsuranceClaim[]>(INITIAL_INSURANCE_CLAIMS);
  const [providers] = useState<TpaProvider[]>(INITIAL_TPA_PROVIDERS);

  // Calculator form state
  const [rxBin,  setRxBin]  = useState('004336');
  const [rxPcn,  setRxPcn]  = useState('ADV');
  const [rxGroup, setRxGroup] = useState('GRP-MED-7712');
  const [memberId, setMemberId] = useState('BCBS-NY-9941028');
  const [ndc11,  setNdc11]  = useState('00071015523');
  const [genericSalt, setGenericSalt] = useState('Atorvastatin Calcium');
  const [ingredientCost, setIngredientCost] = useState('8.40');
  const [calculating, setCalculating] = useState(false);
  const [coPay, setCoPay] = useState<CoPayCalculation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Appeal panel
  const [appealClaimId, setAppealClaimId] = useState('');
  const [appealNote, setAppealNote] = useState('');

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      const cost = parseFloat(ingredientCost) || 8.40;
      const tier = genericSalt.includes('Insulin') ? 'Tier4_Specialty' : 'Tier1_Generic';
      const tierRates: Record<string, number> = { Tier1_Generic: 0.10, Tier2_Preferred: 0.20, Tier3_NonPreferred: 0.40, Tier4_Specialty: 0.25 };
      const copayRate = tierRates[tier] ?? 0.10;
      const copayAmt   = +(cost * copayRate).toFixed(2);
      const insAmt     = +(cost * (1 - copayRate)).toFixed(2);
      const dispFee    = 2.50;
      setCoPay({
        claimId: `calc-${Date.now()}`,
        patientId: 'usr-patient-8821',
        genericSalt,
        brandReferenceCost: +(cost * 3.2).toFixed(2),
        genericIngredientCost: cost,
        patientCopayAmount: copayAmt,
        insurerReimbursementAmount: insAmt,
        dispensingFee: dispFee,
        pharmacyReimbursement: +(insAmt + copayAmt + dispFee).toFixed(2),
        copayPercent: Math.round((copayAmt / (cost * 3.2)) * 100),
        formularyTier: tier as CoPayCalculation['formularyTier'],
        priorAuthRequired: tier === 'Tier4_Specialty',
        calculatedAt: new Date().toISOString(),
        latencyMs: +(Math.random() * 80 + 10).toFixed(2),
      });
      setCalculating(false);
    }, 600);
  };

  const handleSubmitClaim = () => {
    if (!coPay) return;
    setSubmitting(true);
    setTimeout(() => {
      const req: NcpdpClaimRequest = {
        transactionCode: 'B1',
        pharmacyNpi: '1234567890',
        pharmacyDea: 'FA1234563',
        rxBin, rxPcn, rxGroup, memberId, ndc11,
        quantityDispensed: 30,
        daysSupply: 30,
        submittedIngredientCost: parseFloat(ingredientCost) || 8.40,
        usualAndCustomaryPrice: parseFloat(ingredientCost) * 1.1,
        prescriberId: 'dr-harrison-wright',
        dateOfService: new Date().toISOString().split('T')[0],
        orderId: 'ord-1',
        patientId: 'usr-patient-8821',
      };
      const newClaim: InsuranceClaim = {
        id: `CLM-${Date.now().toString().slice(-8)}`,
        claimNumber: `NCPDP-${Math.floor(1000000 + Math.random() * 9000000)}`,
        patientId: 'usr-patient-8821',
        patientName: 'Sarah Jenkins',
        orderId: 'ord-1',
        tpaProviderId: 'tpa-bcbs-01',
        tpaProviderName: 'Blue Cross Blue Shield',
        request: req,
        coPayCalculation: coPay,
        status: Math.random() < 0.02 ? 'Denied' : 'Approved',
        submittedAt: new Date().toISOString(),
        adjudicatedAt: new Date().toISOString(),
        adjudicationLatencyMs: coPay.latencyMs,
      };
      setClaims(prev => [newClaim, ...prev]);
      setSubmitting(false);
      setTab('claims');
    }, 800);
  };

  const handleAppeal = () => {
    if (!appealClaimId || !appealNote) return;
    setClaims(prev => prev.map(c =>
      c.id === appealClaimId
        ? { ...c, status: 'Appeal_Pending' as ClaimStatus, appealNote, appealSubmittedAt: new Date().toISOString() }
        : c
    ));
    setAppealClaimId('');
    setAppealNote('');
  };

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'calculator', label: 'Co-Pay Calculator', icon: 'calculate' },
    { id: 'claims',     label: `Claims (${claims.length})`, icon: 'receipt_long' },
    { id: 'providers',  label: 'TPA Providers',    icon: 'corporate_fare' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 filled">health_and_safety</span>
            Real-Time Insurance Adjudication
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            NCPDP Telecom Standard · RxBIN / RxPCN / Co-Pay Split · TPA Gateway — Phase 4 Workstream 5.1
          </p>
        </div>
        <div className="flex gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">corporate_fare</span>
            {providers.filter(p => p.isActive).length} Active TPAs
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">receipt_long</span>
            {claims.filter(c => c.status === 'Approved').length} Approved Claims
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer
              ${tab === t.id ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Co-Pay Calculator */}
      {tab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <p className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600 filled text-[18px]">calculate</span>
              NCPDP Claim Entry
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: 'RxBIN', value: rxBin, set: setRxBin },
                { label: 'RxPCN', value: rxPcn, set: setRxPcn },
                { label: 'RxGroup', value: rxGroup, set: setRxGroup },
                { label: 'Member ID', value: memberId, set: setMemberId },
                { label: 'NDC-11', value: ndc11, set: setNdc11 },
              ].map(f => (
                <div key={f.label} className={f.label === 'NDC-11' ? 'col-span-2' : ''}>
                  <label className="block font-semibold text-slate-700 mb-1">{f.label}</label>
                  <input type="text" value={f.value} onChange={e => f.set(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              ))}
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Generic Salt</label>
                <select value={genericSalt} onChange={e => setGenericSalt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
                  {['Atorvastatin Calcium', 'Metformin HCl', 'Amoxicillin Trihydrate', 'Sertraline HCl', 'Levothyroxine Sodium', 'Insulin Glargine', 'Rosuvastatin Calcium'].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Ingredient Cost ($)</label>
                <input type="number" value={ingredientCost} onChange={e => setIngredientCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
            </div>
            <button onClick={handleCalculate} disabled={calculating}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-60 cursor-pointer transition-all">
              {calculating
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Calculating…</>
                : <><span className="material-symbols-outlined text-[18px]">calculate</span>Calculate Co-Pay Split</>}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            {coPay ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-slate-900">Co-Pay Result</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold ${TIER_COLORS[coPay.formularyTier]}`}>
                      {coPay.formularyTier.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${coPay.latencyMs < 3000 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {coPay.latencyMs.toFixed(1)}ms
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { label: 'Brand Reference Cost', value: formatCurrency(coPay.brandReferenceCost), muted: true },
                    { label: 'Generic Ingredient Cost', value: formatCurrency(coPay.genericIngredientCost), muted: false },
                    { label: 'Patient Co-Pay', value: formatCurrency(coPay.patientCopayAmount), accent: 'text-rose-700 font-bold' },
                    { label: 'Insurer Pays', value: formatCurrency(coPay.insurerReimbursementAmount), accent: 'text-emerald-700 font-bold' },
                    { label: 'Dispensing Fee', value: formatCurrency(coPay.dispensingFee), muted: true },
                    { label: 'Pharmacy Receives', value: formatCurrency(coPay.pharmacyReimbursement), accent: 'text-indigo-700 font-bold' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between text-sm border-b border-slate-100 pb-1.5 last:border-0">
                      <span className={row.muted ? 'text-slate-400' : 'text-slate-600'}>{row.label}</span>
                      <span className={row.accent ?? 'text-slate-800'}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4 p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                  <p className="text-xs text-indigo-700 font-semibold mb-1">Patient vs Insurer Split</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full rounded-l-full bg-rose-500" style={{ width: `${coPay.copayPercent}%` }} />
                    </div>
                    <span className="text-xs font-bold text-rose-600">{coPay.copayPercent}% patient</span>
                  </div>
                </div>

                {coPay.priorAuthRequired && (
                  <div className="mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700 font-semibold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Prior Authorization Required for Specialty Tier
                  </div>
                )}

                <button onClick={handleSubmitClaim} disabled={submitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 disabled:opacity-60 cursor-pointer transition-all flex items-center justify-center gap-2">
                  {submitting
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                    : <><span className="material-symbols-outlined text-[18px]">send</span>Submit NCPDP Claim</>}
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-slate-400">
                <span className="material-symbols-outlined text-4xl block mb-2">receipt</span>
                <p className="text-sm">Fill the form and calculate to see the co-pay breakdown</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Claims History */}
      {tab === 'claims' && (
        <div className="flex flex-col gap-4">
          {/* Denial appeal panel */}
          <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-4">
            <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 filled text-[18px]">gavel</span>
              Submit Denial Appeal
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Claim ID</label>
                <select value={appealClaimId} onChange={e => setAppealClaimId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="">Select denied claim…</option>
                  {claims.filter(c => c.status === 'Denied').map(c => (
                    <option key={c.id} value={c.id}>{c.claimNumber} — {c.denialReasonCode?.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2] min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Appeal Note</label>
                <input type="text" value={appealNote} onChange={e => setAppealNote(e.target.value)}
                  placeholder="Clinical justification for appeal…"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>
              <div className="flex items-end">
                <button onClick={handleAppeal} disabled={!appealClaimId || !appealNote}
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50 cursor-pointer transition-all">
                  Submit Appeal
                </button>
              </div>
            </div>
          </div>

          {claims.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">receipt_long</span>
              No claims yet. Use the Co-Pay Calculator to submit your first NCPDP claim.
            </div>
          )}

          {claims.map(claim => {
            const sc = STATUS_CONFIG[claim.status];
            return (
              <div key={claim.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{claim.claimNumber}</p>
                    <p className="text-xs text-slate-500">{claim.tpaProviderName} · RxBIN: {claim.request.rxBin} · {claim.patientName}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {claim.adjudicationLatencyMs !== undefined && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${claim.adjudicationLatencyMs < 3000 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {claim.adjudicationLatencyMs.toFixed(1)}ms
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text}`}>
                      <span className="material-symbols-outlined text-[13px] filled">{sc.icon}</span>
                      {claim.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                {claim.coPayCalculation && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Patient Pays</p><p className="font-bold text-rose-700">{formatCurrency(claim.coPayCalculation.patientCopayAmount)}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Insurer Pays</p><p className="font-bold text-emerald-700">{formatCurrency(claim.coPayCalculation.insurerReimbursementAmount)}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Formulary Tier</p><p className={`font-bold ${TIER_COLORS[claim.coPayCalculation.formularyTier]}`}>{claim.coPayCalculation.formularyTier.replace(/_/g, ' ')}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">NDC-11</p><p className="font-bold font-mono text-slate-700">{claim.request.ndc11}</p></div>
                  </div>
                )}
                {claim.denialReasonCode && (
                  <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    {claim.denialDescription}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TPA Providers */}
      {tab === 'providers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">RxBIN: <span className="font-mono">{p.rxBin}</span> · RxPCN: <span className="font-mono">{p.rxPcn}</span></p>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full mt-1 ${p.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Avg Response</p><p className={`font-bold ${p.averageResponseMs < 3000 ? 'text-emerald-700' : 'text-amber-700'}`}>{p.averageResponseMs}ms</p></div>
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Plan Types</p><p className="font-bold text-slate-700">{p.supportedPlanTypes.length} plans</p></div>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.coverageStates.slice(0, 6).map(s => (
                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">{s}</span>
                ))}
                {p.coverageStates.length > 6 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">+{p.coverageStates.length - 6}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
