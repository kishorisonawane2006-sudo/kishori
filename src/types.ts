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
  | 'analytics-and-reports';

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
