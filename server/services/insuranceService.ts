import {
  TpaProvider,
  NcpdpClaimRequest,
  InsuranceClaim,
  ClaimStatus,
  CoPayCalculation,
  TpaBatchReconciliation,
  DenialReasonCode,
} from '../../src/types';

// ─── TPA Provider Registry ────────────────────────────────────────────────────

const TPA_PROVIDERS: TpaProvider[] = [
  {
    id: 'tpa-bcbs-01',
    name: 'Blue Cross Blue Shield',
    rxBin: '004336',
    rxPcn: 'ADV',
    supportedPlanTypes: ['PPO', 'HMO', 'EPO', 'HDHP'],
    adjudicationEndpoint: 'https://claims.bcbs.com/ncpdp/v1/adjudicate',
    averageResponseMs: 840,
    isActive: true,
    coverageStates: ['NY', 'NJ', 'CT', 'PA', 'MA', 'IL', 'TX', 'CA'],
  },
  {
    id: 'tpa-unitedhc-01',
    name: 'UnitedHealthcare OptumRx',
    rxBin: '610502',
    rxPcn: 'MEDD',
    supportedPlanTypes: ['PPO', 'HMO', 'Medicare Part D', 'Medicaid'],
    adjudicationEndpoint: 'https://api.optumrx.com/ncpdp/v2/claims',
    averageResponseMs: 620,
    isActive: true,
    coverageStates: ['NY', 'CA', 'TX', 'FL', 'OH', 'IL', 'PA', 'GA'],
  },
  {
    id: 'tpa-aetna-01',
    name: 'Aetna CVS Health',
    rxBin: '003858',
    rxPcn: 'A4',
    supportedPlanTypes: ['PPO', 'HMO', 'POS', 'Medicare Part D'],
    adjudicationEndpoint: 'https://rxapi.aetna.com/ncpdp/v3/submit',
    averageResponseMs: 780,
    isActive: true,
    coverageStates: ['NY', 'CT', 'NJ', 'PA', 'FL', 'TX', 'CA', 'OH'],
  },
  {
    id: 'tpa-cigna-01',
    name: 'Cigna Express Scripts',
    rxBin: '770714',
    rxPcn: 'CIGNA',
    supportedPlanTypes: ['PPO', 'HMO', 'HDHP', 'Medicaid'],
    adjudicationEndpoint: 'https://api.express-scripts.com/claims/ncpdp',
    averageResponseMs: 910,
    isActive: true,
    coverageStates: ['NY', 'NJ', 'PA', 'MA', 'IL', 'MO', 'TX', 'AZ'],
  },
  {
    id: 'tpa-humana-01',
    name: 'Humana Pharmacy Solutions',
    rxBin: '173387',
    rxPcn: 'HPHRX',
    supportedPlanTypes: ['Medicare Advantage', 'Medicare Part D', 'PPO', 'HMO'],
    adjudicationEndpoint: 'https://pharmacy.humana.com/ncpdp/adjudicate',
    averageResponseMs: 1050,
    isActive: true,
    coverageStates: ['FL', 'TX', 'KY', 'OH', 'GA', 'TN', 'IN', 'AZ'],
  },
];

// ─── Formulary Tier Configuration ────────────────────────────────────────────

const FORMULARY_TIERS: Record<string, CoPayCalculation['formularyTier']> = {
  'Atorvastatin Calcium':  'Tier1_Generic',
  'Metformin HCl':         'Tier1_Generic',
  'Amoxicillin Trihydrate':'Tier1_Generic',
  'Sertraline HCl':        'Tier1_Generic',
  'Levothyroxine Sodium':  'Tier1_Generic',
  'Rosuvastatin Calcium':  'Tier2_Preferred',
  'Amlodipine Besylate':   'Tier1_Generic',
  'Lisinopril':            'Tier1_Generic',
  'Insulin Glargine':      'Tier4_Specialty',
  'Insulin Aspart':        'Tier4_Specialty',
};

const TIER_COPAY_RATES: Record<CoPayCalculation['formularyTier'], number> = {
  Tier1_Generic:      0.10,  // 10% of ingredient cost
  Tier2_Preferred:    0.20,
  Tier3_NonPreferred: 0.40,
  Tier4_Specialty:    0.25,
};

// ─── Denial Logic ─────────────────────────────────────────────────────────────

function evaluateDenial(req: NcpdpClaimRequest): DenialReasonCode | null {
  // Refill too soon: <25 days since last fill for a 30-day supply
  const dos = new Date(req.dateOfService);
  const now = new Date();
  const daysSinceService = (now.getTime() - dos.getTime()) / 86_400_000;

  if (req.daysSupply === 30 && daysSinceService < 25 && Math.random() < 0.05) {
    return 'REFILL_TOO_SOON';
  }
  // 2% random denial to simulate real-world adjudication variability
  if (Math.random() < 0.02) return 'NDC_NOT_COVERED';
  return null;
}

// ─── In-Memory Storage ────────────────────────────────────────────────────────

const claims = new Map<string, InsuranceClaim>();
const batchReconciliations: TpaBatchReconciliation[] = [];

// ─── Insurance Service ────────────────────────────────────────────────────────

export class InsuranceService {
  /**
   * Workstream 5.1 — NCPDP Claim Submission & Adjudication.
   * Quality Gate: co-pay calculation returns in < 3,000ms.
   */
  public submitClaim(request: NcpdpClaimRequest): InsuranceClaim {
    const startMs = performance.now();
    const claimId = `CLM-${Date.now().toString().slice(-8)}`;
    const claimNumber = `NCPDP-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const tpa = TPA_PROVIDERS.find(t => t.rxBin === request.rxBin && t.rxPcn === request.rxPcn)
      ?? TPA_PROVIDERS[0];

    const claim: InsuranceClaim = {
      id: claimId,
      claimNumber,
      patientId: request.patientId ?? 'usr-patient-8821',
      patientName: 'Sarah Jenkins',
      orderId: request.orderId ?? 'ord-1',
      tpaProviderId: tpa.id,
      tpaProviderName: tpa.name,
      request,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
    };

    claims.set(claimId, claim);

    // Synchronous adjudication (simulated — real would be async webhook)
    const coPay = this.calculateCoPay(claimId, request);
    const denialCode = evaluateDenial(request);
    const adjLatencyMs = +(performance.now() - startMs).toFixed(2);

    claim.coPayCalculation = coPay;
    claim.adjudicationLatencyMs = adjLatencyMs;
    claim.adjudicatedAt = new Date().toISOString();

    if (denialCode) {
      claim.status = 'Denied';
      claim.denialReasonCode = denialCode;
      claim.denialDescription = this.getDenialDescription(denialCode);
    } else {
      claim.status = 'Approved';
      claim.paidAt = new Date(Date.now() + 2 * 86400000).toISOString();
    }

    claims.set(claimId, claim);
    return claim;
  }

  /**
   * Real-time co-pay vs insurer split calculation.
   * Quality Gate: latency < 3,000ms — achieved in-process.
   */
  public calculateCoPay(
    claimId: string,
    request: NcpdpClaimRequest,
    genericSalt?: string
  ): CoPayCalculation {
    const startMs = performance.now();

    const salt = genericSalt ?? 'Atorvastatin Calcium';
    const tier = FORMULARY_TIERS[salt] ?? 'Tier2_Preferred';
    const copayRate = TIER_COPAY_RATES[tier];

    const ingredientCost = request.submittedIngredientCost;
    const dispensingFee = 2.50;  // standard platform dispensing fee
    const totalCost = ingredientCost + dispensingFee;

    const patientCopayAmount = +(ingredientCost * copayRate).toFixed(2);
    const insurerReimbursement = +(ingredientCost * (1 - copayRate)).toFixed(2);
    const pharmacyReimbursement = +(insurerReimbursement + patientCopayAmount + dispensingFee).toFixed(2);

    // Brand reference cost — 3x generic as reference
    const brandReferenceCost = +(ingredientCost * 3.2).toFixed(2);
    const copayPercent = Math.round((patientCopayAmount / brandReferenceCost) * 100);

    const latencyMs = +(performance.now() - startMs).toFixed(2);

    return {
      claimId,
      patientId: request.patientId ?? 'usr-patient-8821',
      genericSalt: salt,
      brandReferenceCost,
      genericIngredientCost: ingredientCost,
      patientCopayAmount,
      insurerReimbursementAmount: insurerReimbursement,
      dispensingFee,
      pharmacyReimbursement,
      copayPercent,
      formularyTier: tier,
      priorAuthRequired: tier === 'Tier4_Specialty',
      calculatedAt: new Date().toISOString(),
      latencyMs,
    };
  }

  /** Processes an appeal for a denied claim */
  public submitAppeal(claimId: string, appealNote: string): InsuranceClaim {
    const claim = claims.get(claimId);
    if (!claim) throw new Error(`Claim ${claimId} not found`);
    if (claim.status !== 'Denied') throw new Error(`Claim ${claimId} is not in Denied status`);

    claim.status = 'Appeal_Pending';
    claim.appealNote = appealNote;
    claim.appealSubmittedAt = new Date().toISOString();

    // 70% appeal approval rate (simulated)
    const approved = Math.random() < 0.70;
    setTimeout(() => {
      claim.status = approved ? 'Appeal_Approved' : 'Appeal_Denied';
      if (approved) claim.paidAt = new Date(Date.now() + 5 * 86400000).toISOString();
      claims.set(claimId, claim);
    }, 100);

    claims.set(claimId, claim);
    return claim;
  }

  /** TPA batch reconciliation — runs weekly in production */
  public runBatchReconciliation(tpaProviderId: string): TpaBatchReconciliation {
    const now = new Date();
    const periodEnd = now.toISOString();
    const periodStart = new Date(now.getTime() - 7 * 86400000).toISOString();

    const tpaClaims = Array.from(claims.values()).filter(c => c.tpaProviderId === tpaProviderId);
    const approved = tpaClaims.filter(c => c.status === 'Approved' || c.status === 'Appeal_Approved');
    const denied = tpaClaims.filter(c => c.status === 'Denied' || c.status === 'Appeal_Denied');

    const totalInsurance = approved.reduce((s, c) => s + (c.coPayCalculation?.insurerReimbursementAmount ?? 0), 0);
    const totalCopay = approved.reduce((s, c) => s + (c.coPayCalculation?.patientCopayAmount ?? 0), 0);
    const totalFees = approved.reduce((s, c) => s + (c.coPayCalculation?.dispensingFee ?? 0), 0);

    const batch: TpaBatchReconciliation = {
      batchId: `BATCH-${Date.now().toString().slice(-8)}`,
      tpaProviderId,
      periodStart,
      periodEnd,
      totalClaims: tpaClaims.length,
      approvedClaims: approved.length,
      deniedClaims: denied.length,
      totalInsurancePayout: +totalInsurance.toFixed(2),
      totalPatientCopay: +totalCopay.toFixed(2),
      totalDispensingFees: +totalFees.toFixed(2),
      netPharmacyRevenue: +(totalInsurance + totalCopay + totalFees).toFixed(2),
      processedAt: new Date().toISOString(),
    };
    batchReconciliations.push(batch);
    return batch;
  }

  private getDenialDescription(code: DenialReasonCode): string {
    const desc: Record<DenialReasonCode, string> = {
      NDC_NOT_COVERED:               'The submitted NDC is not covered under this formulary.',
      REFILL_TOO_SOON:               'Claim submitted before the allowed refill window (minimum 25 days for 30-day supply).',
      PLAN_LIMITATIONS_EXCEEDED:     'Annual plan limits for this drug class have been reached.',
      PRIOR_AUTHORIZATION_REQUIRED:  'This specialty medication requires prior authorization before dispensing.',
      PATIENT_NOT_ELIGIBLE:          'Patient eligibility could not be verified for this date of service.',
      DRUG_DRUG_INTERACTION_FLAG:    'Claim flagged due to clinical drug-drug interaction alert.',
      PRESCRIBER_NOT_ENROLLED:       'Prescribing provider is not enrolled in the patient\'s network.',
      DUPLICATE_CLAIM:               'Identical claim submitted within the same billing cycle.',
    };
    return desc[code] ?? 'Unknown denial reason.';
  }

  public getClaim(id: string): InsuranceClaim | undefined { return claims.get(id); }
  public getAllClaims(patientId?: string): InsuranceClaim[] {
    const all = Array.from(claims.values());
    return patientId ? all.filter(c => c.patientId === patientId) : all;
  }
  public getProviders(): TpaProvider[] { return TPA_PROVIDERS; }
  public getProvider(id: string): TpaProvider | undefined { return TPA_PROVIDERS.find(p => p.id === id); }
  public getBatchReconciliations(): TpaBatchReconciliation[] { return batchReconciliations; }
}

export const insuranceService = new InsuranceService();
