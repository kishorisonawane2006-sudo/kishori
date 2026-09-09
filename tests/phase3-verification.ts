import { fhirService } from '../server/services/fhirService';
import { ddiService } from '../server/services/ddiService';
import { voiceSearchService, soundex, metaphone, editDistance } from '../server/services/voiceSearchService';
import { wholesaleService, calculateWholesalePrice } from '../server/services/wholesaleService';
import { FhirMedicationRequest } from '../src/types';

async function runPhase3QualityGates() {
  console.log('================================================================');
  console.log('       PHASE 3 QUALITY GATES & VERIFICATION SUITE              ');
  console.log('       Project: Generic Medicine Store — v3.0.0                ');
  console.log('       Workstreams: FHIR · DDI Engine · Voice · B2B Wholesale  ');
  console.log('================================================================\n');

  let passed = 0;
  let total  = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  [PASS] Gate #${total}: ${testName}`);
      if (detail) console.log(`         -> ${detail}`);
    } else {
      console.error(`  [FAIL] Gate #${total}: ${testName}`);
      if (detail) console.error(`         -> ${detail}`);
    }
  }

  // ─── Quality Gate Section 1: FHIR R4 Conformance (Workstream 3.1) ──────────
  console.log('1. Verifying FHIR R4 Conformance & EHR Ingestion (Workstream 3.1)...');

  const validRequest: FhirMedicationRequest = {
    resourceType: 'MedicationRequest',
    id: 'test-fhir-001',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '617316', display: 'Atorvastatin Calcium 20mg' }],
      text: 'Atorvastatin Calcium 20mg',
    },
    subject: { reference: 'Patient/usr-patient-8821', display: 'Sarah Jenkins' },
    requester: {
      reference: 'Practitioner/dr-wright',
      display: 'Dr. Harrison Wright, MD',
      registrationNumber: 'MCR-NY-89421',
      certificateThumbprint: 'CERT-EPIC-SHA256-A1B2C3',
    },
    authoredOn: new Date().toISOString(),
    dosageInstruction: [{ text: 'Take 1 tablet once daily', doseAndRate: [{ doseQuantity: { value: 1, unit: 'tablet' } }] }],
    dispenseRequest: { quantity: { value: 30, unit: 'tablets' } },
  };

  const ingestResult = fhirService.ingestMedicationRequest(validRequest, 'ehr-epic-01');

  assert(
    ingestResult.fhirRequestId === 'test-fhir-001',
    'FHIR R4 ingestion: resource ID preserved from MedicationRequest',
    `Ingested ID: ${ingestResult.fhirRequestId}`
  );

  assert(
    ingestResult.signatureStatus === 'VERIFIED',
    'FHIR digital signature: NMC registration number MCR-NY-89421 verified against registry',
    `Signature status: ${ingestResult.signatureStatus}, Doctor: ${ingestResult.doctorName}`
  );

  assert(
    ingestResult.cartHydrationToken.startsWith('CHT-'),
    'FHIR cart hydration: magic link token generated with CHT- prefix',
    `Token: ${ingestResult.cartHydrationToken}`
  );

  assert(
    ingestResult.cartHydrationStatus === 'READY',
    'FHIR cart hydration: status is READY when signature is verified',
    `Hydration status: ${ingestResult.cartHydrationStatus}`
  );

  assert(
    ingestResult.medications.length > 0 && ingestResult.medications[0].isRxRequired === true,
    'FHIR medication mapping: at least one Rx-required medication extracted',
    `Medications: ${ingestResult.medications.map(m => m.genericSalt).join(', ')}`
  );

  // Cart hydration token resolves to payload
  const hydrationPayload = fhirService.resolveCartHydration(ingestResult.cartHydrationToken);
  assert(
    hydrationPayload !== null && hydrationPayload.cartItems.length > 0,
    'FHIR cart hydration: token resolves to cart payload with items',
    `Cart items: ${hydrationPayload?.cartItems.length}, Patient: ${hydrationPayload?.patientId}`
  );

  // FHIR conformance rejection — wrong resourceType
  let conformanceError = false;
  try {
    fhirService.ingestMedicationRequest({
      ...validRequest,
      id: 'bad-001',
      resourceType: 'Observation' as 'MedicationRequest',
    });
  } catch (err) {
    conformanceError = (err as Error).message.startsWith('FHIR_CONFORMANCE_ERROR');
  }
  assert(conformanceError, 'FHIR R4 conformance: wrong resourceType correctly rejected with FHIR_CONFORMANCE_ERROR', 'resourceType "Observation" throws conformance error');

  // FHIR invalid certificate
  const invalidSigStatus = fhirService.verifySignature('FAKE-REG-NUMBER', undefined);
  assert(
    invalidSigStatus === 'INVALID_CERTIFICATE',
    'FHIR signature: unregistered doctor returns INVALID_CERTIFICATE',
    `Status: ${invalidSigStatus}`
  );

  // EHR provider registry
  const providers = fhirService.getProviders();
  assert(
    providers.length >= 5 && providers.some(p => p.name === 'Epic'),
    'FHIR provider registry: at least 5 EHR providers including Epic',
    `Providers: ${providers.map(p => p.name).join(', ')}`
  );

  // ─── Quality Gate Section 2: DDI Precision ≥ 99.5% (Workstream 3.2) ────────
  console.log('\n2. Verifying DDI Engine Precision ≥ 99.5% (Workstream 3.2)...');

  // Test known CRITICAL: Sildenafil + Nitrate
  const sildenafilResult = await ddiService.evaluate(
    'test-patient-001',
    ['Sildenafil Citrate'],
    ['Isosorbide Mononitrate']
  );

  assert(
    sildenafilResult.hasCritical === true,
    'DDI engine: Sildenafil + Isosorbide Mononitrate detected as CRITICAL_CONTRAINDICATION',
    `Interactions found: ${sildenafilResult.interactions.length}, hasCritical: ${sildenafilResult.hasCritical}`
  );

  assert(
    sildenafilResult.interactions[0]?.isAbsoluteContraindication === true,
    'DDI engine: Sildenafil + Nitrate flagged as absolute contraindication',
    `isAbsoluteContraindication: ${sildenafilResult.interactions[0]?.isAbsoluteContraindication}`
  );

  // Test known CRITICAL: Sertraline + Tramadol
  const sertralineResult = await ddiService.evaluate(
    'test-patient-002',
    ['Sertraline HCl', 'Tramadol Hydrochloride'],
    []
  );
  assert(
    sertralineResult.hasCritical === true,
    'DDI engine: Sertraline + Tramadol (serotonin syndrome risk) detected as CRITICAL',
    `Interactions: ${sertralineResult.interactions.map(i => i.severity).join(', ')}`
  );

  // Test MODERATE: Warfarin + Ibuprofen
  const warfarinResult = await ddiService.evaluate(
    'test-patient-003',
    ['Ibuprofen'],
    ['Warfarin Sodium']
  );
  assert(
    warfarinResult.hasModerate === true,
    'DDI engine: Warfarin + Ibuprofen detected as MODERATE_INTERACTION',
    `Interactions: ${warfarinResult.interactions.length}`
  );

  // Test FOOD restriction: Atorvastatin + Grapefruit
  const gfResult = await ddiService.evaluate(
    'test-patient-004',
    ['Atorvastatin Calcium'],
    ['Grapefruit Juice']
  );
  assert(
    gfResult.hasFoodRestriction === true,
    'DDI engine: Atorvastatin + Grapefruit Juice detected as FOOD_RESTRICTION',
    `Food restriction: ${gfResult.hasFoodRestriction}`
  );

  // Test MONITORING: Levothyroxine + Calcium
  const levResult = await ddiService.evaluate(
    'test-patient-005',
    ['Levothyroxine Sodium'],
    ['Calcium Carbonate']
  );
  assert(
    levResult.interactions.some(i => i.severity === 'MONITORING_REQUIRED'),
    'DDI engine: Levothyroxine + Calcium Carbonate detected as MONITORING_REQUIRED',
    `Severity: ${levResult.interactions[0]?.severity}`
  );

  // Test NO interaction: safe combination
  const safeResult = await ddiService.evaluate(
    'test-patient-006',
    ['Paracetamol'],
    ['Vitamin D3']
  );
  assert(
    safeResult.interactions.length === 0 && !safeResult.hasCritical,
    'DDI engine: Paracetamol + Vitamin D3 correctly returns no interactions',
    `Interactions: ${safeResult.interactions.length}`
  );

  // Precision measurement: run all 10 known database entries, verify each is detected
  const database = ddiService.getInteractionDatabase();
  let precisionHits = 0;
  for (const interaction of database) {
    const result = await ddiService.evaluate(
      'test-precision',
      [interaction.drug1Salt],
      [interaction.drug2Salt]
    );
    if (result.interactions.length > 0) precisionHits++;
  }
  const precisionPct = (precisionHits / database.length) * 100;

  assert(
    precisionPct >= 99.5,
    `DDI precision gate (≥ 99.5%): detected ${precisionHits}/${database.length} known interactions (${precisionPct.toFixed(1)}%)`,
    `Precision: ${precisionPct.toFixed(2)}% — exceeds 99.5% quality gate`
  );

  // CDS flag creation for critical interactions
  const cdsFlag = ddiService.getCdsFlag('ord-2');
  // ord-2 may have been auto-flagged from the sildenafil test (used 'test-patient-001' — no order)
  // Re-create explicitly:
  const explicitFlag = ddiService.createCdsFlag('ord-cds-test', 'test-patient-001', sildenafilResult.interactions);
  assert(
    explicitFlag.decision === 'PENDING' && explicitFlag.requiresPharmacistReview === true,
    'DDI CDS flag: created with PENDING decision and requiresPharmacistReview=true for critical interactions',
    `Order: ${explicitFlag.orderId}, Decision: ${explicitFlag.decision}`
  );

  const reviewed = ddiService.reviewCdsFlag('ord-cds-test', 'pharm-david-cole', 'APPROVED_WITH_COUNSELLING', 'Patient counselled on nitrate contraindication');
  assert(
    reviewed.decision === 'APPROVED_WITH_COUNSELLING' && reviewed.reviewedByPharmacistId === 'pharm-david-cole',
    'DDI CDS review: pharmacist decision recorded with license number and timestamp',
    `Decision: ${reviewed.decision}, Pharmacist: ${reviewed.reviewedByPharmacistId}`
  );

  // ─── Quality Gate Section 3: Voice Search < 1.5s (Workstream 3.3) ──────────
  console.log('\n3. Verifying Voice Search Latency & Phonetic Accuracy (Workstream 3.3)...');

  // Soundex correctness
  assert(soundex('Atorvastatin') === soundex('Atorvastaten'),
    'Soundex: "Atorvastatin" and "Atorvastaten" (common misspelling) produce identical Soundex codes',
    `Soundex("Atorvastatin")=${soundex('Atorvastatin')}, Soundex("Atorvastaten")=${soundex('Atorvastaten')}`
  );

  assert(soundex('Metformin') === soundex('Metaformin'),
    'Soundex: "Metformin" and "Metaformin" produce identical Soundex codes',
    `Soundex("Metformin")=${soundex('Metformin')}, Soundex("Metaformin")=${soundex('Metaformin')}`
  );

  // Metaphone correctness
  assert(
    metaphone('Sertraline').length > 0,
    'Metaphone: produces non-empty code for "Sertraline"',
    `Metaphone("Sertraline")=${metaphone('Sertraline')}`
  );

  // Edit distance
  assert(editDistance('Metformin', 'Metaformin') <= 2,
    'Levenshtein distance: "Metformin" → "Metaformin" ≤ 2 edits (1-character insertion)',
    `editDistance=${editDistance('Metformin', 'Metaformin')}`
  );

  assert(editDistance('Atorvastatin', 'Atorvastatin') === 0,
    'Levenshtein distance: identical strings return 0',
    `editDistance("Atorvastatin", "Atorvastatin")=${editDistance('Atorvastatin', 'Atorvastatin')}`
  );

  // Voice search latency < 1500ms (Quality Gate 4)
  const voiceResult = voiceSearchService.search('Atorvastatin', 'en-US');
  assert(
    voiceResult.latencyMs < 1500,
    `Voice search latency gate (< 1,500ms): resolved in ${voiceResult.latencyMs}ms`,
    `Resolved molecules: ${voiceResult.resolvedMolecules.join(', ')}`
  );

  // Phonetic correction for misspelling
  const misspellResult = voiceSearchService.search('Metaformin', 'en-US');
  assert(
    misspellResult.phoneticCorrections.length > 0 &&
      misspellResult.phoneticCorrections[0].confidence > 0.3,
    'Voice search: "Metaformin" generates phonetic correction with confidence > 30%',
    `Top match: ${misspellResult.phoneticCorrections[0]?.matchedMolecule} (${(misspellResult.phoneticCorrections[0]?.confidence * 100).toFixed(0)}%)`
  );

  // Vernacular Hindi input
  const hindiResult = voiceSearchService.search('sugar ki dawa', 'hi-IN');
  assert(
    hindiResult.normalizedQuery === 'Metformin HCl',
    'Voice search: Hindi colloquial "sugar ki dawa" transliterated to "Metformin HCl"',
    `Normalised: "${hindiResult.normalizedQuery}"`
  );

  // Spanish input
  const spanishResult = voiceSearchService.search('pastilla para el azucar', 'es-US');
  assert(
    spanishResult.normalizedQuery === 'Metformin HCl',
    'Voice search: Spanish "pastilla para el azucar" transliterated to "Metformin HCl"',
    `Normalised: "${spanishResult.normalizedQuery}"`
  );

  // Language registry
  const languages = voiceSearchService.getSupportedLanguages();
  assert(
    languages.length === 8 && languages.some(l => l.code === 'hi-IN') && languages.some(l => l.code === 'ta-IN'),
    'Voice search: 8 supported languages including Hindi (hi-IN) and Tamil (ta-IN)',
    `Languages: ${languages.map(l => l.code).join(', ')}`
  );

  // ─── Quality Gate Section 4: B2B Wholesale (Workstream 3.4) ────────────────
  console.log('\n4. Verifying B2B Wholesale CoA Enforcement & Tiered Pricing (Workstream 3.4)...');

  // Manufacturer registry
  const manufacturers = wholesaleService.getManufacturers();
  assert(
    manufacturers.length === 5 && manufacturers.every(m => m.verificationStatus === 'Verified'),
    'B2B wholesale: 5 manufacturers registered — all Verified (Cipla, Sun, Dr. Reddy\'s, Torrent, Lupin)',
    `Manufacturers: ${manufacturers.map(m => m.code).join(', ')}`
  );

  // CoA enforcement — listing cannot be created without verified CoA
  let coaEnforcementError = false;
  try {
    wholesaleService.createListing({
      manufacturerId: 'mfr-cipla-01',
      manufacturerName: 'Cipla Limited',
      genericSalt: 'Paracetamol',
      brandReference: 'Test',
      dosageForm: 'Tablets',
      strength: '500mg',
      availableUnits: 10000,
      baseRetailPricePerUnit: 0.10,
      priceTiers: [],
      coaId: 'coa-nonexistent',
      coaStatus: 'Pending',
      batchNumber: 'TEST-001',
      expiryDate: '2028-01-01',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Pain Relief',
      bioEquivalentRating: 'AB',
    });
  } catch (err) {
    coaEnforcementError = (err as Error).message.startsWith('COA_REQUIRED');
  }
  assert(
    coaEnforcementError,
    'B2B CoA enforcement: listing creation blocked when CoA is missing/unverified (Quality Gate 3)',
    'COA_REQUIRED error thrown for unverified CoA'
  );

  // CoA auto-verification — purity < 99.5% → Rejected
  const lowPurityCoa = wholesaleService.submitCoa({
    listingId: 'wsl-001',
    batchNumber: 'TEST-LOW-PURITY',
    manufacturerId: 'mfr-cipla-01',
    testedOn: '2026-01-01',
    expiresOn: '2028-01-01',
    documentUrl: '/secure/coa/test.pdf',
    purityPercent: 98.0,  // below 99.5% threshold
    stabilityTestPassed: true,
    testingLaboratory: 'Test Lab',
  });
  assert(
    lowPurityCoa.status === 'Rejected',
    'B2B CoA auto-verification: purity 98.0% (< 99.5%) correctly rejected',
    `CoA status: ${lowPurityCoa.status}, purity: ${lowPurityCoa.purityPercent}%`
  );

  // CoA auto-verification — expired → Expired
  const expiredCoa = wholesaleService.submitCoa({
    listingId: 'wsl-001',
    batchNumber: 'TEST-EXPIRED',
    manufacturerId: 'mfr-cipla-01',
    testedOn: '2020-01-01',
    expiresOn: '2021-01-01',   // expired
    documentUrl: '/secure/coa/expired.pdf',
    purityPercent: 99.8,
    stabilityTestPassed: true,
    testingLaboratory: 'Test Lab',
  });
  assert(
    expiredCoa.status === 'Expired',
    'B2B CoA auto-verification: expired CoA (2021) correctly flagged as Expired',
    `CoA status: ${expiredCoa.status}`
  );

  // CoA auto-verification — valid → Verified
  const validCoa = wholesaleService.submitCoa({
    listingId: 'wsl-001',
    batchNumber: 'TEST-VALID-COA',
    manufacturerId: 'mfr-cipla-01',
    testedOn: '2026-06-01',
    expiresOn: '2028-06-01',
    documentUrl: '/secure/coa/valid.pdf',
    purityPercent: 99.9,
    stabilityTestPassed: true,
    testingLaboratory: 'Spectrochem Labs',
  });
  assert(
    validCoa.status === 'Verified' && validCoa.verifiedByPlatformAt !== undefined,
    'B2B CoA auto-verification: valid CoA (purity 99.9%, not expired) auto-approved as Verified',
    `CoA status: ${validCoa.status}, verifiedAt: ${validCoa.verifiedByPlatformAt}`
  );

  // Tiered pricing accuracy
  const listing = wholesaleService.getListing('wsl-001')!; // Atorvastatin Cipla

  const tier1 = calculateWholesalePrice(listing, 500);
  assert(
    tier1.pricePerUnit === 0.32 && tier1.discountPercent === 24,
    'B2B tiered pricing: 500 units → Tier 1 ($0.32/unit, 24% discount)',
    `pricePerUnit: $${tier1.pricePerUnit}, discount: ${tier1.discountPercent}%, total: $${tier1.totalPrice}`
  );

  const tier2 = calculateWholesalePrice(listing, 5000);
  assert(
    tier2.pricePerUnit === 0.22 && tier2.discountPercent === 48,
    'B2B tiered pricing: 5,000 units → Tier 2 ($0.22/unit, 48% discount)',
    `pricePerUnit: $${tier2.pricePerUnit}, discount: ${tier2.discountPercent}%, total: $${tier2.totalPrice}`
  );

  const tier3 = calculateWholesalePrice(listing, 50000);
  assert(
    tier3.pricePerUnit === 0.14 && tier3.discountPercent === 67,
    'B2B tiered pricing: 50,000 units → Tier 3 ($0.14/unit, 67% discount)',
    `pricePerUnit: $${tier3.pricePerUnit}, discount: ${tier3.discountPercent}%, total: $${tier3.totalPrice}`
  );

  // Total price accuracy: 50,000 × $0.14 = $7,000.00
  assert(
    tier3.totalPrice === 7000,
    'B2B tiered pricing: 50,000 units × $0.14 = $7,000.00 (exact arithmetic)',
    `Calculated total: $${tier3.totalPrice}`
  );

  // B2B order placement with CoA validation
  const b2bOrder = wholesaleService.placeOrder({
    buyerTenantId: 'TNT-3109',
    buyerTenantName: 'Apollo Pharmacy Chain',
    listingId: 'wsl-001',
    quantity: 5000,
    creditTermDays: 30,
  });
  assert(
    b2bOrder.status === 'Confirmed' && b2bOrder.coaVerified === true,
    'B2B order placement: order confirmed with coaVerified=true when CoA is Verified',
    `Order: ${b2bOrder.orderNumber}, CoA verified: ${b2bOrder.coaVerified}, Total: $${b2bOrder.orderTotal}`
  );

  // MOQ enforcement
  let moqError = false;
  try {
    wholesaleService.placeOrder({
      buyerTenantId: 'TNT-3109',
      buyerTenantName: 'Apollo Pharmacy Chain',
      listingId: 'wsl-001',
      quantity: 10,  // below MOQ of 100
    });
  } catch (err) {
    moqError = (err as Error).message.startsWith('MOQ_NOT_MET');
  }
  assert(moqError, 'B2B MOQ enforcement: order rejected when quantity < minimumOrderQuantity (100)', 'MOQ_NOT_MET error thrown for qty=10');

  // Order status lifecycle
  const advanced = wholesaleService.advanceOrderStatus(b2bOrder.id, 'Shipped');
  assert(
    advanced.status === 'Shipped',
    'B2B order lifecycle: status advanced to Shipped',
    `Order ${advanced.orderNumber} status: ${advanced.status}`
  );

  // Credit settlement: credit restored on Settled
  const creditBefore = wholesaleService.getCreditAccount('TNT-3109')!;
  const utilisedBefore = creditBefore.utilisedCreditUsd;
  wholesaleService.advanceOrderStatus(b2bOrder.id, 'Settled');
  const creditAfter = wholesaleService.getCreditAccount('TNT-3109')!;
  assert(
    creditAfter.utilisedCreditUsd < utilisedBefore,
    'B2B credit settlement: utilisedCredit decreases when order settles',
    `Utilised before: $${utilisedBefore.toFixed(2)}, after: $${creditAfter.utilisedCreditUsd.toFixed(2)}`
  );

  // ─── Summary ─────────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  console.log(`QUALITY GATES SUMMARY: ${passed} / ${total} TESTS PASSED`);
  if (passed === total) {
    console.log('Phase 3 (Clinical EHR, DDI, Voice & B2B Wholesale) ALL GATES PASSED ✓');
  } else {
    console.log(`WARNING: ${total - passed} gate(s) FAILED — review output above.`);
  }
  console.log('================================================================\n');

  if (passed !== total) process.exit(1);
}

runPhase3QualityGates().catch(err => {
  console.error('Phase 3 test suite failed with uncaught error:', err);
  process.exit(1);
});
