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

