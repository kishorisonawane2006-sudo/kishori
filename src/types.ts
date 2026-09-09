export type AppMode = 'portal' | 'patient' | 'architecture' | 'prd' | 'login' | 'profile';

export type PortalTab = 
  | 'overview'
  | 'tenants'
  | 'orders'
  | 'catalog'
  | 'multi-tenant-management'
  | 'orders-and-fulfillment'
  | 'catalog-and-generic-salts'
  | 'vendor-listings-and-pricing'
  | 'stock-and-freshness-sync'
  | 'commission-and-payouts'
  | 'audit-logs-and-security'
  | 'tenant-configs'
  | 'analytics-and-reports'
  // Phase 2 — Logistics & IoT tabs
  | 'logistics-dashboard'
  | 'rider-companion'
  | 'geo-fence-zones'
  | 'mobile-patient-app'
  // Phase 3 — Clinical AI & B2B Wholesale tabs
  | 'fhir-ehr'
  | 'ddi-engine'
  | 'voice-search'
  | 'wholesale-marketplace'
  // Phase 4 — Insurance, Hub Logistics, Microservices tabs
  | 'insurance-adjudication'
  | 'hub-logistics'
  | 'microservice-architecture';

export type PatientTab = 'discover' | 'price-compare' | 'cart' | 'my-orders' | 'order-history' | 'profile';

export interface TenantOrganization {
  id: string;
  name: string;
  code: string;
  tier: 'Enterprise Pro' | 'Standard Tier' | 'Growth Tier' | 'Regional' | 'Standard';
  outlets: number;
  monthlyGmv: number;
  commissionRate: number;
  activeSkus: number;
  schema: string;
  encryption: string;
  licenseNumber: string;
  licenseValidity: string;
  status: 'Active / Verified' | 'Under Audit' | 'Provisioning' | 'Suspended';
  headquarters: string;
  dbPartitionSize: string;
  dbPartitionMax: string;
  redisCacheSize: string;
  redisCacheMax: string;
  rateLimitUsage: number;
  rateLimitMax: number;
  throughputReqSec: number;
  piiMasking: boolean;
  ipWhitelistSubnets: number;
}

export interface MedicineListing {
  id: string;
  brandName: string;
  genericSalt: string;
  brandReferenceMrp: number;
  unitPrice: number;
  competitorLowestPrice: number;
  competitorName?: string;
  dosageForm: string;
  strength: string;
  packSize: string;
  ndc: string;
  stockUnits: number;
  batchNumber: string;
  expiryDate: string;
  syncTime: string;
  syncSource: string;
  status: 'winning' | 'beaten' | 'paused';
  deltaPercent?: number;
  buyBoxLostDelta?: number;
  bioEquivalentRating: string;
  isRx: boolean;
}

export interface PlatformOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  orderTime: string;
  customerName: string;
  customerAddress: string;
  distanceMiles: number;
  channel: string;
  tenantStoreName: string;
  tenantStoreNumber: string;
  genericMolecule: string;
  brandReference: string;
  items: {
    name: string;
    dosage: string;
    packaging: string;
    lotNumber: string;
    price: number;
    quantity: number;
  }[];
  orderTotal: number;
  brandedValue: number;
  patientSavingsPercent: number;
  patientSavingsAmount: number;
  platformFee: number;
  status: 'Fulfilled' | 'In-Transit' | 'Out for Delivery' | 'Cold-Chain Packaged' | 'Validating Rx' | 'Dispensing' | 'Awaiting Pickup' | 'Re-dispatching';
  rxNumber: string;
  prescribingDoctor: string;
  pharmacistAudit: string;
  deliveryType: 'Express 2h' | 'Standard Ground' | 'Cold-Chain';
  courierName?: string;
  courierVehicle?: string;
  courierEtaMins?: number;
  courierTempCelsius?: number;
}

export interface CartItem {
  id: string;
  medicineName: string;
  dosage: string;
  brandName: string;
  storeName: string;
  storeId: string;
  packDescription: string;
  quantity: number;
  unitPrice: number;
  brandedPrice: number;
  rxNumber: string;
  doctorName: string;
  image: string;
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: 'patient' | 'pharmacy_admin' | 'superadmin';
  roleTitle: string;
  phone: string;
  avatarUrl?: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  chronicConditions: string[];
  primaryAddress: {
    street: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    validThrough: string;
    rxBin: string;
    rxPcn: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  loginInfo: {
    username: string;
    lastLogin: string;
    lastPasswordChange: string;
    twoFactorEnabled: boolean;
    authProvider: 'Email/Password' | 'Google SSO' | 'EPCS Verified Token';
    activeSessions: UserSession[];
    securityAlertsCount: number;
    hipaaConsentSignedAt: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
}


// =============================================================================
// PHASE 2: Logistics Automation, Cold-Chain IoT & Native Mobile
// Target: v2.0.0  |  Workstreams: 3PL Hub, IoT Gateway, Mobile, Geo-Fencing
// =============================================================================

// ─── Workstream 2.1: 3PL Carrier Integration ─────────────────────────────────

export type CarrierType = 'Dunzo' | 'Shadowfax' | 'FedEx Healthcare Express';

export type CarrierStatus = 'available' | 'at_capacity' | 'offline';

export type ShipmentEventStatus =
  | 'ASSIGNED'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED_ATTEMPT'
  | 'RETURNED_TO_PHARMACY';

export interface CarrierProfile {
  /** Unique carrier identifier */
  id: string;
  type: CarrierType;
  displayName: string;
  /** Average delivery window in minutes */
  avgDeliveryMins: number;
  /** Whether this carrier supports cold-chain temperature-controlled shipments */
  supportsColdChain: boolean;
  /** Coverage area label */
  coverageZone: string;
  status: CarrierStatus;
  /** Base cost per shipment in USD */
  baseCostUsd: number;
  /** Active shipment count */
  activeShipments: number;
  /** API endpoint stub */
  apiEndpoint: string;
}

export interface ShipmentDispatch {
  id: string;
  orderId: string;
  orderNumber: string;
  carrierId: string;
  carrierType: CarrierType;
  /** Auto-generated waybill / airway bill number */
  waybillNumber: string;
  /** Barcode string for waybill scanning */
  barcodeData: string;
  assignedRiderId?: string;
  assignedRiderName?: string;
  pickupAddress: string;
  deliveryAddress: string;
  distanceMiles: number;
  isColdChain: boolean;
  dispatchedAt: string;
  estimatedDeliveryAt: string;
  /** Current lifecycle event status */
  currentStatus: ShipmentEventStatus;
  /** Full event history */
  events: CourierWebhookEvent[];
  /** Regulatory transit document URL */
  manifestUrl?: string;
  podPhotoUrl?: string;
  deliveredAt?: string;
  failureReason?: string;
}

export interface CourierWebhookEvent {
  id: string;
  shipmentId: string;
  status: ShipmentEventStatus;
  timestamp: string;
  latitude?: number;
  longitude?: number;
  riderNote?: string;
  otpVerified?: boolean;
}

export interface WaybillDocument {
  waybillNumber: string;
  barcodeData: string;
  orderId: string;
  orderNumber: string;
  carrierName: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  packageDescription: string;
  weightKg: number;
  isColdChain: boolean;
  temperatureRange: string;
  generatedAt: string;
  /** Human-readable regulatory declaration */
  regulatoryDeclaration: string;
}

export interface AutoDispatchResult {
  success: boolean;
  orderId: string;
  selectedCarrier: CarrierType;
  dispatch: ShipmentDispatch;
  waybill: WaybillDocument;
  dispatchLatencyMs: number;
}

// ─── Workstream 2.2: IoT Cold-Chain Gateway ───────────────────────────────────

export type SensorProtocol = 'BLE' | 'Cellular' | 'MQTT' | 'HTTP';

export interface IoTSensorPacket {
  id: string;
  orderId: string;
  shipmentId?: string;
  sensorId: string;
  protocol: SensorProtocol;
  temperatureCelsius: number;
  humidityPercent?: number;
  batteryPercent: number;
  latitude: number;
  longitude: number;
  isBreached: boolean;
  /** Running cumulative minutes the sensor has been outside the safe range */
  cumulativeExcursionMins: number;
  /** True once cumulative excursion exceeds the 10-minute GDP threshold */
  quarantineTriggered: boolean;
  timestamp: string;
}

export interface BreachAlert {
  id: string;
  orderId: string;
  shipmentId?: string;
  sensorId: string;
  peakTemperatureCelsius: number;
  excursionStartedAt: string;
  excursionDurationMins: number;
  alertTriggeredAt: string;
  autoRedispatchOrderId?: string;
  status: 'active' | 'resolved' | 'quarantined';
  notifiedPatient: boolean;
  notifiedRider: boolean;
}

export interface BLESyncRecord {
  sensorId: string;
  orderId: string;
  riderId: string;
  /** Raw temperature log from onboard flash memory */
  flashLog: IoTSensorPacket[];
  syncedAt: string;
  deliveryConfirmed: boolean;
}

export interface ExcursionTracker {
  orderId: string;
  sensorId: string;
  /** ISO timestamp when the excursion first started */
  excursionStartedAt: string | null;
  cumulativeExcursionMins: number;
  quarantineTriggered: boolean;
}

// ─── Workstream 2.3: Rider / Courier Companion ────────────────────────────────

export type RiderStatus = 'available' | 'on_route' | 'at_pickup' | 'delivering' | 'off_duty';

export interface RiderProfile {
  id: string;
  fullName: string;
  phone: string;
  vehicleType: 'Motorcycle' | 'Car' | 'Van (Cold-Chain)' | 'Bicycle';
  vehicleNumber: string;
  carrierType: CarrierType;
  status: RiderStatus;
  currentLatitude: number;
  currentLongitude: number;
  currentAddress: string;
  activeShipmentIds: string[];
  batteryPercent: number;
  totalDeliveriesToday: number;
  rating: number;
}

export interface DeliveryStop {
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  address: string;
  recipientName: string;
  recipientPhone: string;
  distanceMiles: number;
  estimatedMins: number;
  requiresOtp: boolean;
  requiresPod: boolean;
  isColdChain: boolean;
  status: ShipmentEventStatus;
}

export interface OtpVerification {
  shipmentId: string;
  otpCode: string;
  verifiedAt: string;
  verifiedByRiderId: string;
}

export interface ProofOfDelivery {
  shipmentId: string;
  photoDataUrl: string;
  recipientSignature?: string;
  riderId: string;
  capturedAt: string;
  latitude: number;
  longitude: number;
}

// ─── Workstream 2.4: Geo-Fencing & Proximity Routing ─────────────────────────

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface GeoFencePolygon {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  /** Ordered list of lat/lng vertices forming the delivery zone polygon */
  vertices: GeoCoordinate[];
  /** Service radius in miles (used as fallback for circular zones) */
  radiusMiles: number;
  /** Maximum delivery time commitment within this zone (minutes) */
  maxDeliveryMins: number;
  isActive: boolean;
  coverageLabel: string;
}

export interface ProximityScore {
  pharmacyId: string;
  pharmacyName: string;
  distanceMiles: number;
  /** 0–100 proximity score component for Buy-Box weighting (ADR-004) */
  proximityScore: number;
  estimatedDeliveryMins: number;
  withinServiceZone: boolean;
  carrier: CarrierType;
}

export interface DistanceMatrixResult {
  originAddress: string;
  destinationAddress: string;
  distanceMiles: number;
  durationMins: number;
  /** Provider used: 'google' | 'stub' */
  source: 'google' | 'stub';
}

// ─── Mobile Notifications ─────────────────────────────────────────────────────

export type NotificationType =
  | 'order_dispatched'
  | 'temperature_stable'
  | 'temperature_breach'
  | 'out_for_delivery'
  | 'delivered'
  | 'refill_reminder'
  | 'rx_approved'
  | 'rx_rejected';

export interface MobileNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  orderId?: string;
  deepLinkTab?: string;
  isRead: boolean;
  createdAt: string;
  /** iOS/Android push token for native delivery */
  pushToken?: string;
}

// =============================================================================
// PHASE 3: Clinical EHR Sync, Gemini AI Safety & B2B Wholesale
// Target: v3.0.0  |  Workstreams: FHIR/HL7, DDI Engine, Voice Search, B2B
// =============================================================================

// ─── Workstream 3.1: FHIR/HL7 EHR Integration ───────────────────────────────

export type EhrProviderSystem = 'Epic' | 'Cerner' | 'Practo' | 'Kareo' | 'AthenaHealth' | 'DrChrono';

export type FhirSignatureStatus =
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'INVALID_CERTIFICATE'
  | 'EXPIRED_CERTIFICATE'
  | 'REGISTRY_UNREACHABLE';

export type CartHydrationStatus = 'READY' | 'PENDING_RX_CHECK' | 'MISSING_ITEMS' | 'FAILED';

export interface EhrProvider {
  id: string;
  name: EhrProviderSystem;
  displayName: string;
  fhirBaseUrl: string;
  version: 'R4' | 'STU3';
  supportsDigitalSignature: boolean;
  connectedHospitals: number;
  isActive: boolean;
  logoUrl?: string;
}

/** FHIR R4 MedicationRequest resource (simplified to domain-relevant fields) */
export interface FhirMedicationRequest {
  /** FHIR resourceType — always "MedicationRequest" */
  resourceType: 'MedicationRequest';
  id: string;
  /** FHIR status: active | completed | cancelled */
  status: 'active' | 'completed' | 'cancelled' | 'entered-in-error';
  /** FHIR intent: order | proposal | plan */
  intent: 'order' | 'proposal' | 'plan';
  medicationCodeableConcept: {
    coding: Array<{ system: string; code: string; display: string }>;
    text: string;
  };
  subject: { reference: string; display: string };
  requester: {
    reference: string;
    display: string;
    /** NMC / state medical council registration number */
    registrationNumber: string;
    /** PKI certificate thumbprint for digital signature */
    certificateThumbprint?: string;
  };
  authoredOn: string;
  dosageInstruction: Array<{
    text: string;
    timing?: { code?: { text: string } };
    doseAndRate?: Array<{ doseQuantity?: { value: number; unit: string } }>;
  }>;
  dispenseRequest?: {
    quantity?: { value: number; unit: string };
    numberOfRepeatsAllowed?: number;
    validityPeriod?: { start: string; end: string };
  };
  /** Digital signature from the EHR system */
  signature?: {
    type: Array<{ system: string; code: string; display: string }>;
    when: string;
    who: { reference: string };
    sigFormat: string;
    data: string;
  };
  /** Source EHR provider */
  ehrProviderId?: string;
  /** Magic link token for automated cart hydration */
  cartHydrationToken?: string;
}

export interface FhirIngestResult {
  fhirRequestId: string;
  patientName: string;
  patientReference: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  ehrProvider: EhrProviderSystem;
  medications: Array<{
    genericSalt: string;
    brandReference: string;
    dosage: string;
    quantity: number;
    isRxRequired: boolean;
  }>;
  signatureStatus: FhirSignatureStatus;
  cartHydrationToken: string;
  cartHydrationStatus: CartHydrationStatus;
  ingestedAt: string;
}

export interface CartHydrationPayload {
  token: string;
  patientId: string;
  cartItems: Array<{
    genericSalt: string;
    quantity: number;
    prescribedDose: string;
    fhirRequestId: string;
  }>;
  magicLinkUrl: string;
  expiresAt: string;
  status: CartHydrationStatus;
}

// ─── Workstream 3.2: Gemini AI Drug-Drug Interaction Engine ──────────────────

export type DdiSeverity =
  | 'CRITICAL_CONTRAINDICATION'
  | 'MODERATE_INTERACTION'
  | 'FOOD_RESTRICTION'
  | 'MONITORING_REQUIRED'
  | 'NO_KNOWN_INTERACTION';

export interface DdiInteraction {
  id: string;
  drug1Salt: string;
  drug2Salt: string;
  severity: DdiSeverity;
  /** Plain-language description shown to patient */
  patientSummary: string;
  /** Clinical-grade description shown to pharmacist */
  clinicalMechanism: string;
  /** Published clinical reference or journal citation */
  citation: string;
  /** Recommended clinical action */
  recommendation: string;
  /** True if this combination is absolutely contraindicated */
  isAbsoluteContraindication: boolean;
  /** Known examples of this interaction */
  examplePairs?: string[];
}

export interface DdiAlertPayload {
  patientId: string;
  orderId?: string;
  evaluatedAt: string;
  cartSalts: string[];
  chronicMedicationSalts: string[];
  interactions: DdiInteraction[];
  hasCritical: boolean;
  hasModerate: boolean;
  hasFoodRestriction: boolean;
  /** True if Gemini AI was used; false if rule-based fallback */
  aiAssisted: boolean;
  /** Confidence score 0–1 from Gemini (null if rule-based) */
  confidenceScore: number | null;
  /** Pharmacist has reviewed and acknowledged */
  pharmacistAcknowledged: boolean;
  pharmacistNotes?: string;
}

export interface PharmacistCdsFlag {
  orderId: string;
  patientId: string;
  flaggedAt: string;
  interactions: DdiInteraction[];
  requiresPharmacistReview: boolean;
  reviewedAt?: string;
  reviewedByPharmacistId?: string;
  decision: 'PENDING' | 'APPROVED_WITH_COUNSELLING' | 'REJECTED_UNSAFE';
}

// ─── Workstream 3.3: Voice Search & Accessibility ────────────────────────────

export type SupportedLanguage =
  | 'en-US'
  | 'hi-IN'
  | 'bn-IN'
  | 'mr-IN'
  | 'ta-IN'
  | 'te-IN'
  | 'kn-IN'
  | 'es-US';

export interface VoiceSearchResult {
  rawTranscript: string;
  normalizedQuery: string;
  detectedLanguage: SupportedLanguage;
  phoneticCorrections: PhoneticMatch[];
  resolvedMolecules: string[];
  latencyMs: number;
  confidence: number;
}

export interface PhoneticMatch {
  inputTerm: string;
  matchedMolecule: string;
  soundexCode: string;
  metaphoneCode: string;
  editDistance: number;
  confidence: number;
}

export type ContrastTheme = 'default' | 'high-contrast' | 'large-text' | 'simplified';

export interface AccessibilityPreferences {
  patientId: string;
  theme: ContrastTheme;
  fontSize: 'normal' | 'large' | 'extra-large';
  screenReaderEnabled: boolean;
  reduceMotion: boolean;
  preferredLanguage: SupportedLanguage;
  voiceSearchEnabled: boolean;
}

// ─── Workstream 3.4: B2B Wholesale Marketplace ───────────────────────────────

export type ManufacturerVerificationStatus =
  | 'Verified'
  | 'Pending Audit'
  | 'Suspended'
  | 'License Expired';

export type CoaStatus = 'Submitted' | 'Verified' | 'Rejected' | 'Expired' | 'Pending';

export type B2bCreditTermDays = 0 | 30 | 60 | 90;

export interface ManufacturerProfile {
  id: string;
  name: string;
  /** Short code (e.g. CIPLA, SUNPHARMA) */
  code: string;
  country: string;
  headquarters: string;
  licenseNumber: string;
  licenseValidUntil: string;
  verificationStatus: ManufacturerVerificationStatus;
  certifiedMolecules: number;
  activeBatches: number;
  /** CDSCO/FDA GMP certificate number */
  gmpCertificate: string;
  contactEmail: string;
  logoUrl?: string;
}

export interface WholesalePriceTier {
  /** Minimum quantity for this tier */
  minUnits: number;
  /** Maximum quantity for this tier (null = unlimited) */
  maxUnits: number | null;
  /** Price per unit in USD at this tier */
  pricePerUnit: number;
  /** Percentage discount vs. base retail price */
  discountPercent: number;
}

export interface CertificateOfAnalysis {
  id: string;
  listingId: string;
  batchNumber: string;
  manufacturerId: string;
  /** ISO date of laboratory testing */
  testedOn: string;
  /** ISO date the CoA expires */
  expiresOn: string;
  /** URL to PDF document in secure storage */
  documentUrl: string;
  status: CoaStatus;
  /** Purity percentage confirmed by lab */
  purityPercent: number;
  /** Stability test passed */
  stabilityTestPassed: boolean;
  /** Lab name that conducted the analysis */
  testingLaboratory: string;
  verifiedByPlatformAt?: string;
}

export interface WholesaleListing {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  genericSalt: string;
  brandReference: string;
  dosageForm: string;
  strength: string;
  /** Available stock in bulk units (e.g. bottles of 1000) */
  availableUnits: number;
  /** Base retail price per unit before wholesale discount */
  baseRetailPricePerUnit: number;
  priceTiers: WholesalePriceTier[];
  coaId: string;
  coaStatus: CoaStatus;
  batchNumber: string;
  expiryDate: string;
  minimumOrderQuantity: number;
  isActive: boolean;
  therapeuticCategory: string;
  bioEquivalentRating: string;
}

export type B2bOrderStatus =
  | 'Draft'
  | 'Pending CoA Review'
  | 'Credit Check'
  | 'Confirmed'
  | 'In Production'
  | 'Shipped'
  | 'Delivered'
  | 'Payment Due'
  | 'Settled';

export interface B2bOrder {
  id: string;
  orderNumber: string;
  buyerTenantId: string;
  buyerTenantName: string;
  manufacturerId: string;
  manufacturerName: string;
  listingId: string;
  genericSalt: string;
  quantity: number;
  pricePerUnit: number;
  orderTotal: number;
  discountPercent: number;
  creditTermDays: B2bCreditTermDays;
  coaVerified: boolean;
  status: B2bOrderStatus;
  placedAt: string;
  deliveryEta?: string;
  paymentDueDate?: string;
  settledAt?: string;
}

export interface B2bCreditAccount {
  tenantId: string;
  tenantName: string;
  /** Approved credit limit in USD */
  creditLimitUsd: number;
  /** Currently utilised credit */
  utilisedCreditUsd: number;
  availableCreditUsd: number;
  defaultCreditTermDays: B2bCreditTermDays;
  /** Outstanding invoices count */
  outstandingInvoices: number;
  creditRating: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Unrated';
  lastReviewedAt: string;
}

// =============================================================================
// PHASE 4: Pan-National Scale, Insurance Adjudication & Microservice Decomposition
// Target: v4.0.0  |  Workstreams: NCPDP Insurance, Hub Logistics, Event-Driven Microservices
// =============================================================================

// ─── Workstream 5.1: Real-Time Insurance Adjudication ────────────────────────

export type ClaimStatus =
  | 'Draft'
  | 'Submitted'
  | 'Adjudicating'
  | 'Approved'
  | 'Partially_Approved'
  | 'Denied'
  | 'Appeal_Pending'
  | 'Appeal_Approved'
  | 'Appeal_Denied'
  | 'Paid';

export type DenialReasonCode =
  | 'NDC_NOT_COVERED'
  | 'REFILL_TOO_SOON'
  | 'PLAN_LIMITATIONS_EXCEEDED'
  | 'PRIOR_AUTHORIZATION_REQUIRED'
  | 'PATIENT_NOT_ELIGIBLE'
  | 'DRUG_DRUG_INTERACTION_FLAG'
  | 'PRESCRIBER_NOT_ENROLLED'
  | 'DUPLICATE_CLAIM';

export interface TpaProvider {
  id: string;
  name: string;
  /** NCPDP BIN — 6-digit Bank Identification Number */
  rxBin: string;
  /** Processor Control Number */
  rxPcn: string;
  supportedPlanTypes: string[];
  adjudicationEndpoint: string;
  averageResponseMs: number;
  isActive: boolean;
  coverageStates: string[];
}

export interface NcpdpClaimRequest {
  /** NCPDP Transaction Code: B1 = Billing, B3 = Reversal, E1 = Eligibility */
  transactionCode: 'B1' | 'B3' | 'E1';
  /** Pharmacy NPI number */
  pharmacyNpi: string;
  /** Dispensing pharmacy DEA number */
  pharmacyDea: string;
  /** Patient's insurance RxBIN */
  rxBin: string;
  /** Patient's insurance RxPCN */
  rxPcn: string;
  /** Patient's group number */
  rxGroup: string;
  /** Patient's member ID */
  memberId: string;
  /** NDC-11 drug code */
  ndc11: string;
  /** Quantity dispensed */
  quantityDispensed: number;
  /** Days supply */
  daysSupply: number;
  /** Drug cost submitted (ingredient cost + dispensing fee) */
  submittedIngredientCost: number;
  /** Usual and Customary (U&C) price */
  usualAndCustomaryPrice: number;
  prescriberId: string;
  dateOfService: string;
  orderId?: string;
  patientId?: string;
}

export interface CoPayCalculation {
  claimId: string;
  patientId: string;
  genericSalt: string;
  brandReferenceCost: number;
  genericIngredientCost: number;
  /** Plan-determined copay amount */
  patientCopayAmount: number;
  /** Insurer reimbursement portion */
  insurerReimbursementAmount: number;
  /** Platform dispensing fee */
  dispensingFee: number;
  /** Net amount pharmacy receives */
  pharmacyReimbursement: number;
  /** Copay as percentage of brand reference */
  copayPercent: number;
  formularyTier: 'Tier1_Generic' | 'Tier2_Preferred' | 'Tier3_NonPreferred' | 'Tier4_Specialty';
  priorAuthRequired: boolean;
  calculatedAt: string;
  /** Calculation latency in ms — Quality Gate: < 3,000ms */
  latencyMs: number;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  patientId: string;
  patientName: string;
  orderId: string;
  tpaProviderId: string;
  tpaProviderName: string;
  request: NcpdpClaimRequest;
  coPayCalculation?: CoPayCalculation;
  status: ClaimStatus;
  submittedAt: string;
  adjudicatedAt?: string;
  paidAt?: string;
  denialReasonCode?: DenialReasonCode;
  denialDescription?: string;
  appealNote?: string;
  appealSubmittedAt?: string;
  /** Actual adjudication latency in ms */
  adjudicationLatencyMs?: number;
}

export interface TpaBatchReconciliation {
  batchId: string;
  tpaProviderId: string;
  periodStart: string;
  periodEnd: string;
  totalClaims: number;
  approvedClaims: number;
  deniedClaims: number;
  totalInsurancePayout: number;
  totalPatientCopay: number;
  totalDispensingFees: number;
  netPharmacyRevenue: number;
  processedAt: string;
}

// ─── Workstream 5.2: Pan-National Hub-and-Spoke Logistics ────────────────────

export type HubTier = 'Tier1_Metro' | 'Tier2_Regional' | 'Tier3_Distribution';

export interface HubWarehouse {
  id: string;
  name: string;
  city: string;
  state: string;
  tier: HubTier;
  latitude: number;
  longitude: number;
  /** Total storage capacity in cubic meters */
  capacityCubicMeters: number;
  /** Cold storage capacity (cubic meters) */
  coldStorageCapacityCubicMeters: number;
  /** Current utilisation percentage 0–100 */
  utilisationPercent: number;
  /** Connected retail branch count */
  branchesServed: number;
  /** Average replenishment cycle time in hours */
  avgReplenishmentCycleHours: number;
  activeSkus: number;
  isActive: boolean;
  /** Drone corridor IDs served by this hub */
  droneCorridorIds: string[];
}

export interface DemandForecast {
  hubId: string;
  genericSalt: string;
  forecastPeriodDays: number;
  /** Historical weekly velocity (units/week) */
  historicalWeeklyVelocity: number;
  /** Seasonality multiplier (1.0 = baseline) */
  seasonalityMultiplier: number;
  /** Disease incidence trend adjustment */
  diseaseIncidenceAdjustment: number;
  /** Forecasted units needed for the period */
  forecastedUnits: number;
  /** Current stock at hub */
  currentStock: number;
  /** Recommended replenishment quantity */
  replenishmentQuantity: number;
  /** Confidence score 0–1 */
  confidenceScore: number;
  forecastedAt: string;
  algorithm: 'exponential_smoothing' | 'holt_winters' | 'moving_average' | 'ml_ensemble';
}

export interface ReplenishmentOrder {
  id: string;
  hubId: string;
  hubName: string;
  destinationBranchId: string;
  destinationBranchName: string;
  genericSalt: string;
  quantity: number;
  priorityLevel: 'Critical' | 'High' | 'Standard';
  scheduledDispatchAt: string;
  estimatedArrivalAt: string;
  status: 'Scheduled' | 'Dispatched' | 'In_Transit' | 'Delivered';
  isColdChain: boolean;
}

export type DroneStatus = 'Available' | 'On_Mission' | 'Charging' | 'Maintenance';

export interface DroneCorridor {
  id: string;
  name: string;
  originHubId: string;
  originCity: string;
  destinationZone: string;
  distanceMiles: number;
  /** Maximum payload in kg */
  maxPayloadKg: number;
  /** Average flight time in minutes */
  avgFlightMins: number;
  supportsColdChain: boolean;
  /** Operating altitude in feet */
  altitudeFeet: number;
  isActive: boolean;
  regulatoryApproval: 'FAA_Part_135' | 'DGCA_RPAS' | 'Pending';
}

export interface DroneDelivery {
  id: string;
  corridorId: string;
  corridorName: string;
  orderId: string;
  patientAddress: string;
  payloadDescription: string;
  payloadWeightKg: number;
  isColdChain: boolean;
  droneId: string;
  status: DroneStatus | 'Delivered' | 'Failed';
  dispatchedAt: string;
  estimatedArrivalAt: string;
  deliveredAt?: string;
  telemetryUrl?: string;
}

export interface CityExpansion {
  cityName: string;
  state: string;
  tier: 'Tier1_Metro' | 'Tier2_City' | 'Tier3_Town';
  population: number;
  launchStatus: 'Live' | 'Soft_Launch' | 'Planned' | 'Announced';
  launchDate: string;
  activePharmacies: number;
  activePatients: number;
  monthlyGmv: number;
  hubWarehouseId?: string;
}

// ─── Workstream 5.3: Event-Driven Microservice Decomposition ─────────────────

export type DomainEventType =
  | 'OrderPlaced'
  | 'RxVerified'
  | 'TemperatureBreached'
  | 'PayoutSettled'
  | 'BuyBoxUpdated'
  | 'InventoryLow'
  | 'ClaimApproved'
  | 'ClaimDenied'
  | 'DroneDispatched'
  | 'ReplenishmentTriggered';

export interface EventMessage {
  id: string;
  topic: string;
  eventType: DomainEventType;
  partitionKey: string;
  payload: Record<string, unknown>;
  producedAt: string;
  /** Consumer group acknowledgements */
  acknowledgedBy: string[];
  retryCount: number;
  isDeadLetter: boolean;
}

export interface KafkaTopic {
  name: string;
  partitions: number;
  replicationFactor: number;
  retentionMs: number;
  subscribedServices: string[];
  messageCount: number;
  bytesPerSec: number;
}

export type ServiceStatus = 'Healthy' | 'Degraded' | 'Unhealthy' | 'Deploying' | 'Unknown';
export type ServiceTier = 'Edge' | 'Core' | 'Data' | 'Infrastructure';
export type DeploymentTarget = 'Kubernetes' | 'Lambda' | 'ECS' | 'CloudRun';

export interface MicroserviceHealth {
  serviceId: string;
  serviceName: string;
  version: string;
  tier: ServiceTier;
  status: ServiceStatus;
  /** Requests per second (current) */
  requestsPerSec: number;
  /** p99 latency in milliseconds */
  p99LatencyMs: number;
  /** p50 latency in milliseconds */
  p50LatencyMs: number;
  errorRate: number;
  cpuPercent: number;
  memoryPercent: number;
  replicaCount: number;
  deploymentTarget: DeploymentTarget;
  region: string;
  lastDeployedAt: string;
  uptime: string;
  /** Phase 4 Quality Gate: platform must sustain 100,000 req/s */
  sustainedThroughputCapacity: number;
  technology: string;
}

export interface ConcurrencySimResult {
  targetRps: number;
  achievedRps: number;
  p50LatencyMs: number;
  p99LatencyMs: number;
  errorRatePercent: number;
  /** Phase 4 gate: p99 < 100ms */
  slaCompliant: boolean;
  simulatedAt: string;
  durationMs: number;
}
