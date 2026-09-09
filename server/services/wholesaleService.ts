import {
  ManufacturerProfile,
  WholesaleListing,
  WholesalePriceTier,
  CertificateOfAnalysis,
  B2bOrder,
  B2bOrderStatus,
  B2bCreditAccount,
  B2bCreditTermDays,
  CoaStatus,
} from '../../src/types';

// ─── Manufacturer Registry ────────────────────────────────────────────────────

const MANUFACTURERS: ManufacturerProfile[] = [
  {
    id: 'mfr-cipla-01',
    name: 'Cipla Limited',
    code: 'CIPLA',
    country: 'India',
    headquarters: 'Mumbai, Maharashtra',
    licenseNumber: 'CDSCO-MH-MFR-00291',
    licenseValidUntil: '2029-03-31',
    verificationStatus: 'Verified',
    certifiedMolecules: 1500,
    activeBatches: 284,
    gmpCertificate: 'WHO-GMP-CIPLA-2024-8821',
    contactEmail: 'b2b@cipla.com',
  },
  {
    id: 'mfr-sunpharma-01',
    name: 'Sun Pharmaceutical Industries',
    code: 'SUNPHARMA',
    country: 'India',
    headquarters: 'Mumbai, Maharashtra',
    licenseNumber: 'CDSCO-MH-MFR-00148',
    licenseValidUntil: '2028-12-31',
    verificationStatus: 'Verified',
    certifiedMolecules: 2100,
    activeBatches: 412,
    gmpCertificate: 'WHO-GMP-SUNPHARMA-2024-4410',
    contactEmail: 'wholesale@sunpharma.com',
  },
  {
    id: 'mfr-drreddys-01',
    name: "Dr. Reddy's Laboratories",
    code: 'DRREDDYS',
    country: 'India',
    headquarters: 'Hyderabad, Telangana',
    licenseNumber: 'CDSCO-TG-MFR-00076',
    licenseValidUntil: '2030-06-30',
    verificationStatus: 'Verified',
    certifiedMolecules: 900,
    activeBatches: 196,
    gmpCertificate: 'FDA-USGMP-DRL-2023-0192',
    contactEmail: 'b2bsales@drreddys.com',
  },
  {
    id: 'mfr-torrent-01',
    name: 'Torrent Pharmaceuticals',
    code: 'TORRENT',
    country: 'India',
    headquarters: 'Ahmedabad, Gujarat',
    licenseNumber: 'CDSCO-GJ-MFR-00318',
    licenseValidUntil: '2027-09-30',
    verificationStatus: 'Verified',
    certifiedMolecules: 640,
    activeBatches: 108,
    gmpCertificate: 'WHO-GMP-TORRENT-2023-9201',
    contactEmail: 'wholesale@torrentpharma.com',
  },
  {
    id: 'mfr-lupin-01',
    name: 'Lupin Limited',
    code: 'LUPIN',
    country: 'India',
    headquarters: 'Mumbai, Maharashtra',
    licenseNumber: 'CDSCO-MH-MFR-00221',
    licenseValidUntil: '2028-03-31',
    verificationStatus: 'Verified',
    certifiedMolecules: 780,
    activeBatches: 167,
    gmpCertificate: 'FDA-USGMP-LUPIN-2024-0408',
    contactEmail: 'b2b@lupin.com',
  },
];

// ─── In-Memory Storage ────────────────────────────────────────────────────────

const listings     = new Map<string, WholesaleListing>();
const coaRecords   = new Map<string, CertificateOfAnalysis>();
const b2bOrders    = new Map<string, B2bOrder>();
const creditAccounts = new Map<string, B2bCreditAccount>();

// ─── Seed Listings & CoAs ─────────────────────────────────────────────────────

function seedData(): void {
  const seed: Array<Omit<WholesaleListing, 'id'>> = [
    {
      manufacturerId: 'mfr-cipla-01',
      manufacturerName: 'Cipla Limited',
      genericSalt: 'Atorvastatin Calcium',
      brandReference: 'Lipitor Generic',
      dosageForm: 'Tablets',
      strength: '20mg',
      availableUnits: 500000,
      baseRetailPricePerUnit: 0.42,
      priceTiers: [
        { minUnits: 100,   maxUnits: 999,   pricePerUnit: 0.32, discountPercent: 24 },
        { minUnits: 1000,  maxUnits: 9999,  pricePerUnit: 0.22, discountPercent: 48 },
        { minUnits: 10000, maxUnits: null,  pricePerUnit: 0.14, discountPercent: 67 },
      ],
      coaId: 'coa-001',
      coaStatus: 'Verified',
      batchNumber: 'CIPLA-AT-2026-8812',
      expiryDate: '2028-11-30',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Cardiovascular',
      bioEquivalentRating: 'AB (Orange Book)',
    },
    {
      manufacturerId: 'mfr-sunpharma-01',
      manufacturerName: 'Sun Pharmaceutical Industries',
      genericSalt: 'Metformin HCl',
      brandReference: 'Glucophage Generic',
      dosageForm: 'Tablets',
      strength: '500mg',
      availableUnits: 1200000,
      baseRetailPricePerUnit: 0.14,
      priceTiers: [
        { minUnits: 100,   maxUnits: 999,   pricePerUnit: 0.10, discountPercent: 29 },
        { minUnits: 1000,  maxUnits: 9999,  pricePerUnit: 0.07, discountPercent: 50 },
        { minUnits: 10000, maxUnits: null,  pricePerUnit: 0.04, discountPercent: 71 },
      ],
      coaId: 'coa-002',
      coaStatus: 'Verified',
      batchNumber: 'SUN-MF-2026-9021',
      expiryDate: '2029-03-31',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Anti-Diabetic',
      bioEquivalentRating: 'AB (Orange Book)',
    },
    {
      manufacturerId: 'mfr-drreddys-01',
      manufacturerName: "Dr. Reddy's Laboratories",
      genericSalt: 'Amoxicillin Trihydrate',
      brandReference: 'Amoxil Generic',
      dosageForm: 'Capsules',
      strength: '500mg',
      availableUnits: 800000,
      baseRetailPricePerUnit: 0.28,
      priceTiers: [
        { minUnits: 100,   maxUnits: 999,   pricePerUnit: 0.22, discountPercent: 21 },
        { minUnits: 1000,  maxUnits: 9999,  pricePerUnit: 0.15, discountPercent: 46 },
        { minUnits: 10000, maxUnits: null,  pricePerUnit: 0.09, discountPercent: 68 },
      ],
      coaId: 'coa-003',
      coaStatus: 'Verified',
      batchNumber: 'DRL-AMX-2026-1192',
      expiryDate: '2027-08-31',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Antibiotics',
      bioEquivalentRating: 'AB (Orange Book)',
    },
    {
      manufacturerId: 'mfr-torrent-01',
      manufacturerName: 'Torrent Pharmaceuticals',
      genericSalt: 'Sertraline HCl',
      brandReference: 'Zoloft Generic',
      dosageForm: 'Tablets',
      strength: '50mg',
      availableUnits: 300000,
      baseRetailPricePerUnit: 0.52,
      priceTiers: [
        { minUnits: 100,   maxUnits: 999,   pricePerUnit: 0.40, discountPercent: 23 },
        { minUnits: 1000,  maxUnits: 9999,  pricePerUnit: 0.28, discountPercent: 46 },
        { minUnits: 10000, maxUnits: null,  pricePerUnit: 0.18, discountPercent: 65 },
      ],
      coaId: 'coa-004',
      coaStatus: 'Verified',
      batchNumber: 'TOR-SR-2026-4418',
      expiryDate: '2028-06-30',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Neuropsychiatric',
      bioEquivalentRating: 'AB (Orange Book)',
    },
    {
      manufacturerId: 'mfr-lupin-01',
      manufacturerName: 'Lupin Limited',
      genericSalt: 'Levothyroxine Sodium',
      brandReference: 'Synthroid Generic',
      dosageForm: 'Tablets',
      strength: '100mcg',
      availableUnits: 950000,
      baseRetailPricePerUnit: 0.24,
      priceTiers: [
        { minUnits: 100,   maxUnits: 999,   pricePerUnit: 0.19, discountPercent: 21 },
        { minUnits: 1000,  maxUnits: 9999,  pricePerUnit: 0.13, discountPercent: 46 },
        { minUnits: 10000, maxUnits: null,  pricePerUnit: 0.08, discountPercent: 67 },
      ],
      coaId: 'coa-005',
      coaStatus: 'Verified',
      batchNumber: 'LUP-LEV-2026-5590',
      expiryDate: '2028-09-30',
      minimumOrderQuantity: 100,
      isActive: true,
      therapeuticCategory: 'Endocrinology',
      bioEquivalentRating: 'AB (Orange Book)',
    },
  ];

  seed.forEach((item, idx) => {
    const id = `wsl-00${idx + 1}`;
    listings.set(id, { ...item, id });
  });

  // Seed CoAs
  const coaData: CertificateOfAnalysis[] = [
    { id: 'coa-001', listingId: 'wsl-001', batchNumber: 'CIPLA-AT-2026-8812', manufacturerId: 'mfr-cipla-01',    testedOn: '2026-01-15', expiresOn: '2028-01-15', documentUrl: '/secure/coa/coa-001.pdf', status: 'Verified', purityPercent: 99.8, stabilityTestPassed: true,  testingLaboratory: 'Cytodiagnostix Inc.',   verifiedByPlatformAt: '2026-01-20T09:00:00Z' },
    { id: 'coa-002', listingId: 'wsl-002', batchNumber: 'SUN-MF-2026-9021',   manufacturerId: 'mfr-sunpharma-01', testedOn: '2026-02-10', expiresOn: '2029-02-10', documentUrl: '/secure/coa/coa-002.pdf', status: 'Verified', purityPercent: 99.9, stabilityTestPassed: true,  testingLaboratory: 'Spectrochem Labs',       verifiedByPlatformAt: '2026-02-14T11:30:00Z' },
    { id: 'coa-003', listingId: 'wsl-003', batchNumber: 'DRL-AMX-2026-1192',  manufacturerId: 'mfr-drreddys-01',  testedOn: '2026-03-05', expiresOn: '2027-03-05', documentUrl: '/secure/coa/coa-003.pdf', status: 'Verified', purityPercent: 99.6, stabilityTestPassed: true,  testingLaboratory: 'Vimta Labs Limited',    verifiedByPlatformAt: '2026-03-08T08:45:00Z' },
    { id: 'coa-004', listingId: 'wsl-004', batchNumber: 'TOR-SR-2026-4418',   manufacturerId: 'mfr-torrent-01',   testedOn: '2026-01-28', expiresOn: '2028-01-28', documentUrl: '/secure/coa/coa-004.pdf', status: 'Verified', purityPercent: 99.7, stabilityTestPassed: true,  testingLaboratory: 'Anthem Biosciences',    verifiedByPlatformAt: '2026-02-01T14:00:00Z' },
    { id: 'coa-005', listingId: 'wsl-005', batchNumber: 'LUP-LEV-2026-5590',  manufacturerId: 'mfr-lupin-01',     testedOn: '2026-04-01', expiresOn: '2028-04-01', documentUrl: '/secure/coa/coa-005.pdf', status: 'Verified', purityPercent: 99.9, stabilityTestPassed: true,  testingLaboratory: 'Analytical Lab Group', verifiedByPlatformAt: '2026-04-05T10:15:00Z' },
  ];
  coaData.forEach(c => coaRecords.set(c.id, c));

  // Seed credit accounts for pharmacy tenants
  const credits: B2bCreditAccount[] = [
    { tenantId: 'TNT-3109', tenantName: 'Apollo Pharmacy Chain',      creditLimitUsd: 500000, utilisedCreditUsd: 182400, availableCreditUsd: 317600, defaultCreditTermDays: 30, outstandingInvoices: 3, creditRating: 'A+', lastReviewedAt: '2026-08-01T00:00:00Z' },
    { tenantId: 'TNT-8492', tenantName: 'CarePoint Healthcare Inc',   creditLimitUsd: 250000, utilisedCreditUsd: 44800,  availableCreditUsd: 205200, defaultCreditTermDays: 30, outstandingInvoices: 1, creditRating: 'A',  lastReviewedAt: '2026-08-15T00:00:00Z' },
    { tenantId: 'TNT-5021', tenantName: 'HealthKart Generic Direct',  creditLimitUsd: 150000, utilisedCreditUsd: 91200,  availableCreditUsd: 58800,  defaultCreditTermDays: 60, outstandingInvoices: 2, creditRating: 'B+', lastReviewedAt: '2026-07-20T00:00:00Z' },
    { tenantId: 'TNT-1194', tenantName: 'SunMed Drugstores',          creditLimitUsd: 100000, utilisedCreditUsd: 12000,  availableCreditUsd: 88000,  defaultCreditTermDays: 30, outstandingInvoices: 1, creditRating: 'B',  lastReviewedAt: '2026-08-10T00:00:00Z' },
  ];
  credits.forEach(c => creditAccounts.set(c.tenantId, c));
}

seedData();

// ─── Tiered Pricing Engine ────────────────────────────────────────────────────

export function calculateWholesalePrice(listing: WholesaleListing, quantity: number): {
  pricePerUnit: number;
  totalPrice: number;
  discountPercent: number;
  appliedTier: WholesalePriceTier | null;
} {
  const tier = listing.priceTiers
    .filter(t => quantity >= t.minUnits && (t.maxUnits === null || quantity <= t.maxUnits))
    .sort((a, b) => b.minUnits - a.minUnits)[0] ?? null;

  const pricePerUnit  = tier?.pricePerUnit ?? listing.baseRetailPricePerUnit;
  const discountPercent = tier?.discountPercent ?? 0;
  const totalPrice    = +(pricePerUnit * quantity).toFixed(2);

  return { pricePerUnit: +pricePerUnit.toFixed(4), totalPrice, discountPercent, appliedTier: tier };
}

// ─── Wholesale Service ────────────────────────────────────────────────────────

export class WholesaleService {
  // ── Manufacturers ────────────────────────────────────────────────────────

  public getManufacturers(): ManufacturerProfile[] {
    return MANUFACTURERS;
  }

  public getManufacturer(id: string): ManufacturerProfile | undefined {
    return MANUFACTURERS.find(m => m.id === id);
  }

  // ── Listings ─────────────────────────────────────────────────────────────

  public getListings(manufacturerId?: string): WholesaleListing[] {
    const all = Array.from(listings.values()).filter(l => l.isActive);
    return manufacturerId ? all.filter(l => l.manufacturerId === manufacturerId) : all;
  }

  public getListing(id: string): WholesaleListing | undefined {
    return listings.get(id);
  }

  public createListing(listing: Omit<WholesaleListing, 'id'>): WholesaleListing {
    const id = `wsl-${Date.now().toString().slice(-6)}`;
    const newListing: WholesaleListing = { ...listing, id };

    // CoA must be present and Verified before listing is permitted
    const coa = coaRecords.get(listing.coaId);
    if (!coa || coa.status !== 'Verified') {
      throw new Error(
        `COA_REQUIRED: Listing cannot be activated without a verified Certificate of Analysis. CoA ${listing.coaId} status: ${coa?.status ?? 'not found'}`
      );
    }

    listings.set(id, newListing);
    return newListing;
  }

  // ── Certificate of Analysis ───────────────────────────────────────────────

  public getCoa(id: string): CertificateOfAnalysis | undefined {
    return coaRecords.get(id);
  }

  public getAllCoas(): CertificateOfAnalysis[] {
    return Array.from(coaRecords.values());
  }

  /**
   * Workstream 3.4 — CoA Ingestion & Verification.
   * Platform verifies purity ≥ 99.5%, stability test passed, not expired.
   */
  public submitCoa(coa: Omit<CertificateOfAnalysis, 'id' | 'status' | 'verifiedByPlatformAt'>): CertificateOfAnalysis {
    const id = `coa-${Date.now().toString().slice(-6)}`;
    let status: CoaStatus = 'Submitted';

    // Automated platform verification rules
    const isExpired = new Date(coa.expiresOn) < new Date();
    const purityOk  = coa.purityPercent >= 99.5;
    const stabilityOk = coa.stabilityTestPassed;

    if (isExpired) {
      status = 'Expired';
    } else if (!purityOk || !stabilityOk) {
      status = 'Rejected';
    } else {
      status = 'Verified';
    }

    const record: CertificateOfAnalysis = {
      ...coa,
      id,
      status,
      verifiedByPlatformAt: status === 'Verified' ? new Date().toISOString() : undefined,
    };

    coaRecords.set(id, record);

    // If the related listing exists, update its CoA status
    const relatedListing = listings.get(record.listingId);
    if (relatedListing) {
      relatedListing.coaId = id;
      relatedListing.coaStatus = status;
      listings.set(record.listingId, relatedListing);
    }

    return record;
  }

  // ── Orders ────────────────────────────────────────────────────────────────

  /**
   * Places a B2B wholesale order.
   * Validates: CoA verified, credit available, MOQ met.
   */
  public placeOrder(input: {
    buyerTenantId: string;
    buyerTenantName: string;
    listingId: string;
    quantity: number;
    creditTermDays?: B2bCreditTermDays;
  }): B2bOrder {
    const listing = listings.get(input.listingId);
    if (!listing) throw new Error(`Listing ${input.listingId} not found`);
    if (!listing.isActive) throw new Error(`Listing ${input.listingId} is not currently active`);

    // Enforce CoA requirement (Quality Gate 3)
    const coa = coaRecords.get(listing.coaId);
    if (!coa || coa.status !== 'Verified') {
      throw new Error(
        `COA_NOT_VERIFIED: Cannot place order — CoA for batch ${listing.batchNumber} is not verified`
      );
    }

    // Enforce minimum order quantity
    if (input.quantity < listing.minimumOrderQuantity) {
      throw new Error(
        `MOQ_NOT_MET: Minimum order quantity is ${listing.minimumOrderQuantity} units`
      );
    }

    // Calculate price
    const { pricePerUnit, totalPrice, discountPercent } = calculateWholesalePrice(listing, input.quantity);

    // Check credit availability
    const creditAccount = creditAccounts.get(input.buyerTenantId);
    const creditTermDays = input.creditTermDays ?? creditAccount?.defaultCreditTermDays ?? 30;

    if (creditAccount && totalPrice > creditAccount.availableCreditUsd && creditTermDays > 0) {
      throw new Error(
        `CREDIT_LIMIT_EXCEEDED: Order total $${totalPrice.toFixed(2)} exceeds available credit $${creditAccount.availableCreditUsd.toFixed(2)}`
      );
    }

    const orderId = `b2b-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const deliveryEta = new Date(now.getTime() + 21 * 86400000).toISOString(); // 3-week lead time
    const paymentDueDate = creditTermDays > 0
      ? new Date(now.getTime() + creditTermDays * 86400000).toISOString()
      : now.toISOString();

    const order: B2bOrder = {
      id: orderId,
      orderNumber: `B2B-${Math.floor(100000 + Math.random() * 900000)}`,
      buyerTenantId: input.buyerTenantId,
      buyerTenantName: input.buyerTenantName,
      manufacturerId: listing.manufacturerId,
      manufacturerName: listing.manufacturerName,
      listingId: input.listingId,
      genericSalt: listing.genericSalt,
      quantity: input.quantity,
      pricePerUnit,
      orderTotal: totalPrice,
      discountPercent,
      creditTermDays: creditTermDays as B2bCreditTermDays,
      coaVerified: true,
      status: 'Confirmed',
      placedAt: now.toISOString(),
      deliveryEta,
      paymentDueDate,
    };

    b2bOrders.set(orderId, order);

    // Deduct from credit account
    if (creditAccount && creditTermDays > 0) {
      creditAccount.utilisedCreditUsd += totalPrice;
      creditAccount.availableCreditUsd -= totalPrice;
      creditAccount.outstandingInvoices += 1;
      creditAccounts.set(input.buyerTenantId, creditAccount);
    }

    return order;
  }

  public getOrders(tenantId?: string): B2bOrder[] {
    const all = Array.from(b2bOrders.values());
    return tenantId ? all.filter(o => o.buyerTenantId === tenantId) : all;
  }

  public getOrder(id: string): B2bOrder | undefined {
    return b2bOrders.get(id);
  }

  public advanceOrderStatus(id: string, status: B2bOrderStatus): B2bOrder {
    const order = b2bOrders.get(id);
    if (!order) throw new Error(`B2B Order ${id} not found`);
    order.status = status;
    if (status === 'Settled') {
      order.settledAt = new Date().toISOString();
      const credit = creditAccounts.get(order.buyerTenantId);
      if (credit && order.creditTermDays > 0) {
        credit.utilisedCreditUsd  = Math.max(0, credit.utilisedCreditUsd - order.orderTotal);
        credit.availableCreditUsd = credit.creditLimitUsd - credit.utilisedCreditUsd;
        credit.outstandingInvoices = Math.max(0, credit.outstandingInvoices - 1);
        creditAccounts.set(order.buyerTenantId, credit);
      }
    }
    b2bOrders.set(id, order);
    return order;
  }

  // ── Credit Accounts ───────────────────────────────────────────────────────

  public getCreditAccount(tenantId: string): B2bCreditAccount | undefined {
    return creditAccounts.get(tenantId);
  }

  public getAllCreditAccounts(): B2bCreditAccount[] {
    return Array.from(creditAccounts.values());
  }

  public calculateWholesalePrice = calculateWholesalePrice;
}

export const wholesaleService = new WholesaleService();
