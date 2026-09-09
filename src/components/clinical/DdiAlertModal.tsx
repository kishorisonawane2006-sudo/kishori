import React, { useState } from 'react';
import { DdiInteraction, DdiSeverity, DdiAlertPayload, PharmacistCdsFlag } from '../../types';
import { INITIAL_DDI_INTERACTIONS } from '../../data/initialData';

interface DdiAlertModalProps {
  payload: DdiAlertPayload;
  onDismiss: () => void;
  onAddToAnyway?: () => void;
  /** Set to true when rendering inside the Pharmacist Queue for CDS panel */
  isPharmacistView?: boolean;
  onPharmacistDecision?: (decision: PharmacistCdsFlag['decision'], notes: string) => void;
}

const SEVERITY_CONFIG: Record<DdiSeverity, {
  bg: string; border: string; text: string; icon: string; badge: string; badgeText: string;
}> = {
  CRITICAL_CONTRAINDICATION: {
    bg: 'bg-rose-50', border: 'border-rose-300', text: 'text-rose-800',
    icon: 'dangerous', badge: 'bg-rose-600 text-white', badgeText: 'Critical — Do Not Dispense',
  },
  MODERATE_INTERACTION: {
    bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800',
    icon: 'warning', badge: 'bg-amber-500 text-white', badgeText: 'Moderate — Requires Review',
  },
  FOOD_RESTRICTION: {
    bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-orange-800',
    icon: 'no_meals', badge: 'bg-orange-500 text-white', badgeText: 'Food / Lifestyle Restriction',
  },
  MONITORING_REQUIRED: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    icon: 'monitor_heart', badge: 'bg-blue-600 text-white', badgeText: 'Monitor Closely',
  },
  NO_KNOWN_INTERACTION: {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    icon: 'check_circle', badge: 'bg-emerald-600 text-white', badgeText: 'No Known Interaction',
  },
};

interface InteractionCardProps {
  interaction: DdiInteraction;
  isPharmacistView: boolean;
}

const InteractionCard: React.FC<InteractionCardProps> = ({ interaction, isPharmacistView }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = SEVERITY_CONFIG[interaction.severity];

  return (
    <div className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden`}>
      <div className="flex items-start gap-3 p-3">
        <span className={`material-symbols-outlined text-xl filled flex-shrink-0 mt-0.5 ${cfg.text}`}>
          {cfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
              {cfg.badgeText}
            </span>
            {interaction.isAbsoluteContraindication && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-900 text-white">
                ABSOLUTE CONTRAINDICATION
              </span>
            )}
          </div>
          <p className="text-xs font-bold text-slate-800 mb-0.5">
            {interaction.drug1Salt} + {interaction.drug2Salt}
          </p>
          <p className="text-xs text-slate-700 leading-relaxed">
            {interaction.patientSummary}
          </p>

          {isPharmacistView && (
            <div className="mt-2 flex flex-col gap-1">
              <p className="text-[11px] font-semibold text-slate-600">Clinical Mechanism:</p>
              <p className="text-[11px] text-slate-600 leading-relaxed">{interaction.clinicalMechanism}</p>
            </div>
          )}

          <button onClick={() => setExpanded(v => !v)}
            className="mt-1.5 text-[11px] text-blue-600 font-semibold cursor-pointer hover:text-blue-800 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
            {expanded ? 'Hide details' : 'Show clinical details'}
          </button>

          {expanded && (
            <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-col gap-1.5">
              {!isPharmacistView && (
                <>
                  <p className="text-[11px] font-semibold text-slate-600">Clinical Mechanism:</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{interaction.clinicalMechanism}</p>
                </>
              )}
              <p className="text-[11px] font-semibold text-slate-600 mt-1">Recommended Action:</p>
              <p className="text-[11px] text-slate-700 leading-relaxed font-medium">{interaction.recommendation}</p>
              <p className="text-[10px] text-slate-400 mt-1">Reference: {interaction.citation}</p>
              {interaction.examplePairs && (
                <p className="text-[10px] text-slate-400">
                  Examples: {interaction.examplePairs.join(' · ')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Standalone CDS Panel (portal use) ───────────────────────────────────────

interface CdsPanelProps {
  orderId: string;
  interactions: DdiInteraction[];
  onDecision: (decision: PharmacistCdsFlag['decision'], notes: string) => void;
}

export const PharmacistCdsPanel: React.FC<CdsPanelProps> = ({ orderId, interactions, onDecision }) => {
  const [notes, setNotes] = useState('');
  const [decided, setDecided] = useState(false);

  const handleDecide = (decision: PharmacistCdsFlag['decision']) => {
    onDecision(decision, notes);
    setDecided(true);
  };

  if (decided) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
        <span className="material-symbols-outlined text-emerald-600 filled">check_circle</span>
        <p className="text-sm font-semibold text-emerald-800">CDS Review submitted for Order {orderId}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-4">
      <p className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-600 filled">clinical_notes</span>
        Pharmacist Clinical Decision Support — Order {orderId}
      </p>
      <div className="flex flex-col gap-3 mb-4">
        {interactions.map(i => (
          <InteractionCard key={i.id} interaction={i} isPharmacistView />
        ))}
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Clinical notes (counselling provided, alternative recommended…)"
        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs resize-none h-20 focus:outline-none focus:ring-2 focus:ring-amber-300"
        aria-label="Pharmacist clinical notes"
      />
      <div className="flex gap-2 mt-3">
        <button onClick={() => handleDecide('APPROVED_WITH_COUNSELLING')}
          className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer transition-all">
          Approve with Counselling
        </button>
        <button onClick={() => handleDecide('REJECTED_UNSAFE')}
          className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer transition-all">
          Reject — Unsafe to Dispense
        </button>
      </div>
    </div>
  );
};

// ─── Patient-Facing Alert Modal ───────────────────────────────────────────────

export const DdiAlertModal: React.FC<DdiAlertModalProps> = ({
  payload,
  onDismiss,
  onAddToAnyway,
  isPharmacistView = false,
  onPharmacistDecision,
}) => {
  const [pharmacistNotes, setPharmacistNotes] = useState('');

  const criticals  = payload.interactions.filter(i => i.severity === 'CRITICAL_CONTRAINDICATION');
  const moderates  = payload.interactions.filter(i => i.severity === 'MODERATE_INTERACTION');
  const food       = payload.interactions.filter(i => i.severity === 'FOOD_RESTRICTION');
  const monitoring = payload.interactions.filter(i => i.severity === 'MONITORING_REQUIRED');

  const headerBg = payload.hasCritical
    ? 'bg-rose-600'
    : payload.hasModerate
    ? 'bg-amber-500'
    : 'bg-orange-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      role="dialog" aria-modal="true"
      aria-label={payload.hasCritical ? 'Critical drug interaction alert' : 'Drug interaction warning'}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className={`${headerBg} text-white px-5 py-4 flex items-start justify-between gap-4`}>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-2xl filled mt-0.5">
              {payload.hasCritical ? 'dangerous' : 'warning'}
            </span>
            <div>
              <p className="font-bold text-base">
                {payload.hasCritical
                  ? 'Critical Drug Interaction — Do Not Proceed'
                  : payload.hasModerate
                  ? 'Drug Interaction Warning'
                  : 'Food & Lifestyle Restriction'}
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                {payload.interactions.length} interaction{payload.interactions.length !== 1 ? 's' : ''} detected
                {payload.aiAssisted && ` · Gemini AI (${((payload.confidenceScore ?? 0.97) * 100).toFixed(0)}% confidence)`}
              </p>
            </div>
          </div>
          <button onClick={onDismiss} className="cursor-pointer opacity-80 hover:opacity-100 flex-shrink-0" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {!isPharmacistView && (
            <p className="text-sm text-slate-600 leading-relaxed">
              We found {payload.hasCritical ? 'a <strong>serious</strong>' : 'a'} potential interaction between
              medicines in your cart and{' '}
              {payload.chronicMedicationSalts.length > 0
                ? `medicines you already take (${payload.chronicMedicationSalts.slice(0, 2).join(', ')})`
                : 'known drug combinations'}.
              Please review and consult your doctor or pharmacist before proceeding.
            </p>
          )}

          {criticals.length > 0 && criticals.map(i => (
            <InteractionCard key={i.id} interaction={i} isPharmacistView={isPharmacistView} />
          ))}
          {moderates.length > 0 && moderates.map(i => (
            <InteractionCard key={i.id} interaction={i} isPharmacistView={isPharmacistView} />
          ))}
          {food.length > 0 && food.map(i => (
            <InteractionCard key={i.id} interaction={i} isPharmacistView={isPharmacistView} />
          ))}
          {monitoring.length > 0 && monitoring.map(i => (
            <InteractionCard key={i.id} interaction={i} isPharmacistView={isPharmacistView} />
          ))}

          {isPharmacistView && (
            <div className="mt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Notes</label>
              <textarea
                value={pharmacistNotes}
                onChange={e => setPharmacistNotes(e.target.value)}
                placeholder="Document counselling provided or alternative recommendation…"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs resize-none h-20 focus:outline-none focus:ring-2 focus:ring-amber-300"
                aria-label="Pharmacist clinical notes"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex flex-col gap-2 border-t border-slate-100 pt-4">
          {isPharmacistView && onPharmacistDecision ? (
            <div className="flex gap-2">
              <button onClick={() => onPharmacistDecision('APPROVED_WITH_COUNSELLING', pharmacistNotes)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer">
                Approve with Counselling
              </button>
              <button onClick={() => onPharmacistDecision('REJECTED_UNSAFE', pharmacistNotes)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 cursor-pointer">
                Reject — Unsafe
              </button>
            </div>
          ) : (
            <>
              <button onClick={onDismiss}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 cursor-pointer transition-all">
                Understood — Review My Cart
              </button>
              {!payload.hasCritical && onAddToAnyway && (
                <button onClick={onAddToAnyway}
                  className="w-full py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 cursor-pointer transition-all">
                  I understand the risk — continue anyway
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── DDI Engine Demo Screen ───────────────────────────────────────────────────

export const DdiEngineScreen: React.FC = () => {
  const [cartInput, setCartInput] = useState('Sildenafil Citrate, Atorvastatin Calcium');
  const [chronicInput, setChronicInput] = useState('Isosorbide Mononitrate, Metformin HCl');
  const [alertPayload, setAlertPayload] = useState<DdiAlertPayload | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEvaluate = () => {
    setLoading(true);
    setTimeout(() => {
      const cartSalts = cartInput.split(',').map(s => s.trim()).filter(Boolean);
      const chronicSalts = chronicInput.split(',').map(s => s.trim()).filter(Boolean);

      // Client-side simulation matching ddiService logic
      const allSalts = [...cartSalts, ...chronicSalts];
      const found = INITIAL_DDI_INTERACTIONS.filter(interaction => {
        const d1 = interaction.drug1Salt.toLowerCase();
        const d2 = interaction.drug2Salt.toLowerCase();
        const has1 = allSalts.some(s => d1.includes(s.toLowerCase().split(' ')[0]) || s.toLowerCase().includes(d1.split(' ')[0]));
        const has2 = allSalts.some(s => d2.includes(s.toLowerCase().split(' ')[0]) || s.toLowerCase().includes(d2.split(' ')[0]));
        return has1 && has2;
      });

      setAlertPayload({
        patientId: 'usr-patient-8821',
        evaluatedAt: new Date().toISOString(),
        cartSalts,
        chronicMedicationSalts: chronicSalts,
        interactions: found,
        hasCritical: found.some(i => i.severity === 'CRITICAL_CONTRAINDICATION'),
        hasModerate: found.some(i => i.severity === 'MODERATE_INTERACTION'),
        hasFoodRestriction: found.some(i => i.severity === 'FOOD_RESTRICTION'),
        aiAssisted: false,
        confidenceScore: null,
        pharmacistAcknowledged: false,
      });
      setLoading(false);
      if (found.length > 0) setShowModal(true);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
          <span className="material-symbols-outlined text-rose-600 filled">clinical_notes</span>
          Gemini AI Drug-Drug Interaction Engine
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Clinical contraindication database · Gemini AI augmentation · Pharmacist CDS flags — Phase 3 Workstream 3.2
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <p className="text-sm font-bold text-slate-800 mb-4">Evaluate Drug Interactions</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cart Salts (comma-separated)
              </label>
              <textarea value={cartInput} onChange={e => setCartInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Sildenafil Citrate, Sertraline HCl…" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient's Chronic Medications
              </label>
              <textarea value={chronicInput} onChange={e => setChronicInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-rose-200"
                placeholder="Isosorbide Mononitrate, Warfarin Sodium…" />
            </div>
            <button onClick={handleEvaluate} disabled={loading}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 disabled:opacity-60 cursor-pointer transition-all">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Evaluating…</>
                : <><span className="material-symbols-outlined text-[18px]">science</span>Run DDI Evaluation</>}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
          <p className="text-sm font-bold text-slate-800 mb-4">Clinical Interaction Database</p>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
            {INITIAL_DDI_INTERACTIONS.map(i => {
              const cfg = SEVERITY_CONFIG[i.severity];
              return (
                <div key={i.id} className={`flex items-start gap-2 p-2.5 rounded-xl border ${cfg.border} ${cfg.bg}`}>
                  <span className={`material-symbols-outlined text-[16px] filled flex-shrink-0 mt-0.5 ${cfg.text}`}>{cfg.icon}</span>
                  <div>
                    <p className={`text-xs font-bold ${cfg.text}`}>{i.drug1Salt} + {i.drug2Salt}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{i.patientSummary}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {alertPayload && !showModal && (
        <div className={`flex items-center gap-3 p-4 rounded-2xl border ${
          alertPayload.hasCritical ? 'bg-rose-50 border-rose-300' :
          alertPayload.hasModerate ? 'bg-amber-50 border-amber-300' :
          'bg-emerald-50 border-emerald-200'}`}>
          <span className={`material-symbols-outlined text-xl filled ${
            alertPayload.hasCritical ? 'text-rose-600' :
            alertPayload.hasModerate ? 'text-amber-600' : 'text-emerald-600'}`}>
            {alertPayload.hasCritical ? 'dangerous' : alertPayload.hasModerate ? 'warning' : 'check_circle'}
          </span>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              {alertPayload.interactions.length === 0
                ? 'No Known Interactions Found'
                : `${alertPayload.interactions.length} Interaction${alertPayload.interactions.length !== 1 ? 's' : ''} Detected`}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              {alertPayload.hasCritical ? 'CRITICAL — Do not dispense without pharmacist review.' :
               alertPayload.hasModerate ? 'Moderate risk — Pharmacist counselling recommended.' :
               'All evaluated combinations appear safe for dispensing.'}
            </p>
          </div>
          {alertPayload.interactions.length > 0 && (
            <button onClick={() => setShowModal(true)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer">
              View Details
            </button>
          )}
        </div>
      )}

      {showModal && alertPayload && (
        <DdiAlertModal
          payload={alertPayload}
          onDismiss={() => setShowModal(false)}
          onAddToAnyway={() => setShowModal(false)}
        />
      )}
    </div>
  );
};
