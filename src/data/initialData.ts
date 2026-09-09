import { TenantOrganization, MedicineListing, PlatformOrder, CartItem } from '../types';

export const INITIAL_TENANTS: TenantOrganization[] = [
  {
    id: 'TNT-8492',
    name: 'CarePoint Healthcare Inc',
    code: 'CP',
    tier: 'Enterprise Pro',
    outlets: 64,
    monthlyGmv: 684200,
    commissionRate: 8.5,
    activeSkus: 14200,
    schema: 'tnt_carepoint_prod',
    encryption: 'AES-256 Dedicated RLS',
    licenseNumber: 'DEA-FM9021482',
    licenseValidity: 'Valid until Dec 2028',
    status: 'Active / Verified',
    headquarters: 'Boston, MA',
    dbPartitionSize: '34.8 GB',
    dbPartitionMax: '100 GB',
    redisCacheSize: '2.1 GB',
    redisCacheMax: '8.0 GB',
    rateLimitUsage: 6420,
    rateLimitMax: 10000,
    throughputReqSec: 142.6,
    piiMasking: true,
    ipWhitelistSubnets: 14
  },
  {
    id: 'TNT-3109',
    name: 'Apollo Pharmacy Chain',
    code: 'AP',
    tier: 'Enterprise Pro',
    outlets: 112,
    monthlyGmv: 1120400,
    commissionRate: 10.0,
    activeSkus: 18420,
    schema: 'tnt_apollo_enterprise',
    encryption: 'AES-256 Dedicated RLS',
    licenseNumber: 'NABP-992-TX-2029',
    licenseValidity: 'Valid until Oct 2029',
    status: 'Active / Verified',
    headquarters: 'Dallas, TX',
    dbPartitionSize: '58.2 GB',
    dbPartitionMax: '150 GB',
    redisCacheSize: '4.8 GB',
    redisCacheMax: '12.0 GB',
    rateLimitUsage: 8910,
    rateLimitMax: 15000,
    throughputReqSec: 218.4,
    piiMasking: true,
    ipWhitelistSubnets: 28
  },
  {
    id: 'TNT-5021',
    name: 'HealthKart Generic Direct',
    code: 'HK',
    tier: 'Regional',
    outlets: 18,
    monthlyGmv: 340900,
    commissionRate: 12.0,
    activeSkus: 12190,
    schema: 'tnt_healthkart_main',
    encryption: 'AES-256 Partitioned',
    licenseNumber: 'IL-DRUG-88192-B',
    licenseValidity: 'Renewal due 45d',
    status: 'Under Audit',
    headquarters: 'Chicago, IL',
    dbPartitionSize: '16.4 GB',
    dbPartitionMax: '50 GB',
    redisCacheSize: '1.2 GB',
    redisCacheMax: '4.0 GB',
    rateLimitUsage: 2840,
    rateLimitMax: 5000,
    throughputReqSec: 64.2,
    piiMasking: true,
    ipWhitelistSubnets: 6
  },
  {
    id: 'TNT-1194',
    name: 'SunMed Drugstores',
    code: 'SM',
    tier: 'Regional',
    outlets: 42,
    monthlyGmv: 492100,
    commissionRate: 9.0,
    activeSkus: 9400,
    schema: 'tnt_sunmed_retail',
    encryption: 'AES-256 Initializing',
    licenseNumber: 'AZ-BOP-77401-X',
    licenseValidity: 'Valid until Jul 2027',
    status: 'Provisioning',
    headquarters: 'Phoenix, AZ',
    dbPartitionSize: '4.2 GB',
    dbPartitionMax: '50 GB',
    redisCacheSize: '0.4 GB',
    redisCacheMax: '4.0 GB',
    rateLimitUsage: 410,
    rateLimitMax: 5000,
    throughputReqSec: 18.0,
    piiMasking: true,
    ipWhitelistSubnets: 4
  },
  {
    id: 'TNT-9932',
    name: 'NovaCare Apothecary Co',
    code: 'NC',
    tier: 'Standard',
    outlets: 12,
    monthlyGmv: 88140,
    commissionRate: 11.5,
    activeSkus: 4100,
    schema: 'tnt_novacare_rx',
    encryption: 'RLS Locked (IO Suspended)',
    licenseNumber: 'WA-RX-10029-EX',
    licenseValidity: 'Action Required',
    status: 'Suspended',
    headquarters: 'Seattle, WA',
    dbPartitionSize: '8.1 GB',
    dbPartitionMax: '25 GB',
    redisCacheSize: '0.8 GB',
    redisCacheMax: '2.0 GB',
    rateLimitUsage: 0,
    rateLimitMax: 3000,
    throughputReqSec: 0,
    piiMasking: true,
    ipWhitelistSubnets: 2
  }
];

export const INITIAL_MEDICINE_LISTINGS: MedicineListing[] = [
  {
    id: 'MED-01',
    brandName: 'Lipitor',
    genericSalt: 'Atorvastatin Calcium',
    brandReferenceMrp: 42.00,
    unitPrice: 8.40,
    competitorLowestPrice: 8.40,
    competitorName: 'MedPlus Direct',
    dosageForm: 'Tablets',
    strength: '20mg',
    packSize: '30 Tablets',
    ndc: '0071-0155-23',
    stockUnits: 1420,
    batchNumber: 'AT-881',
    expiryDate: 'Nov 2027',
    syncTime: '12m ago',
    syncSource: 'Warehouse API',
    status: 'winning',
    bioEquivalentRating: 'AB (Orange Book)',
    isRx: true
  },
  {
    id: 'MED-02',
    brandName: 'Glucophage',
    genericSalt: 'Metformin HCl',
    brandReferenceMrp: 28.50,
    unitPrice: 4.20,
    competitorLowestPrice: 3.90,
    competitorName: 'CarePoint (-$0.30)',
    dosageForm: 'Tablets',
    strength: '500mg',
    packSize: '60 Tablets',
    ndc: '50458-540-60',
    stockUnits: 3890,
    batchNumber: 'MF-902',
    expiryDate: 'Mar 2028',
    syncTime: '8m ago',
    syncSource: 'Realtime Live',
    status: 'beaten',
    deltaPercent: 7.1,
    buyBoxLostDelta: -32,
    bioEquivalentRating: 'AB (Orange Book)',
    isRx: true
  },
  {
    id: 'MED-03',
    brandName: 'Augmentin',
    genericSalt: 'Amoxicillin + Clavulanate Potassium',
    brandReferenceMrp: 32.00,
    unitPrice: 9.80,
    competitorLowestPrice: 11.20,
    competitorName: 'Nearest: $11.20',
    dosageForm: 'Tablets',
    strength: '625mg',
    packSize: '10 Tablets',
    ndc: '43598-224-10',
    stockUnits: 940,
    batchNumber: 'AC-419',
    expiryDate: 'Jan 2027',
    syncTime: '15m ago',
    syncSource: 'Synced',
    status: 'winning',
    bioEquivalentRating: 'AB (Sole Buy-Box)',
    isRx: true
  },
  {
    id: 'MED-04',
    brandName: 'Zoloft',
    genericSalt: 'Sertraline HCl',
    brandReferenceMrp: 54.00,
    unitPrice: 14.20,
    competitorLowestPrice: 13.75,
    competitorName: 'PharmChoice (-$0.45)',
    dosageForm: 'Tablets',
    strength: '50mg',
    packSize: '28 Tablets',
    ndc: '0049-4960-30',
    stockUnits: 620,
    batchNumber: 'SR-118',
    expiryDate: 'Sep 2026',
    syncTime: '3m ago',
    syncSource: 'Realtime Live',
    status: 'beaten',
    deltaPercent: 3.2,
    buyBoxLostDelta: -18,
    bioEquivalentRating: 'AB (Orange Book)',
    isRx: true
  },
  {
    id: 'MED-05',
    brandName: 'Ventolin HFA',
    genericSalt: 'Albuterol Sulfate',
    brandReferenceMrp: 74.00,
    unitPrice: 22.50,
    competitorLowestPrice: 21.90,
    competitorName: 'ExpressGeneric',
    dosageForm: 'Inhaler',
    strength: '90mcg',
    packSize: 'Inhaler (8.5g)',
    ndc: '0173-0682-20',
    stockUnits: 14,
    batchNumber: 'AL-023',
    expiryDate: 'Aug 2026',
    syncTime: '1h ago',
    syncSource: 'Automated safety lock',
    status: 'paused',
    bioEquivalentRating: 'AB (Orange Book)',
    isRx: true
  }
];

export const INITIAL_LISTINGS = INITIAL_MEDICINE_LISTINGS;

export const INITIAL_ORDERS: PlatformOrder[] = [
  {
    id: 'ord-1',
    orderNumber: '#ORD-2026-8941',
    orderDate: 'Today',
    orderTime: '10:24 AM',
    customerName: 'Sarah Jenkins',
    customerAddress: '482 Atlantic Ave, Brooklyn NY 11217',
    distanceMiles: 1.8,
    channel: 'Patient iOS v2.4',
    tenantStoreName: 'Apollo Pharmacy Hub',
    tenantStoreNumber: '#104',
    genericMolecule: 'Atorvastatin Calcium 20mg + Metformin ER 500mg',
    brandReference: 'Lipitor (30 Tabs) & Glucophage (60 Tabs)',
    items: [
      {
        name: 'Atorvastatin Calcium',
        dosage: '20mg',
        packaging: '1 x 30 Tablet Blister',
        lotNumber: 'ATR-8812',
        price: 16.00,
        quantity: 1
      },
      {
        name: 'Metformin Hydrochloride ER',
        dosage: '500mg',
        packaging: '2 x 60 Tablet Bottles',
        lotNumber: 'MET-2027',
        price: 18.20,
        quantity: 2
      }
    ],
    orderTotal: 34.20,
    brandedValue: 99.00,
    patientSavingsPercent: 65.4,
    patientSavingsAmount: 64.80,
    platformFee: 3.42,
    status: 'Out for Delivery',
    rxNumber: 'RX-99410',
    prescribingDoctor: 'Dr. Harrison Wright, MD',
    pharmacistAudit: 'Pharm. David Cole, RPh (#PH-492)',
    deliveryType: 'Cold-Chain',
    courierName: 'Carlos M.',
    courierVehicle: 'SwiftMed Courier Fleet #84',
    courierEtaMins: 18,
    courierTempCelsius: 3.8
  },
  {
    id: 'ord-2',
    orderNumber: '#ORD-2026-8942',
    orderDate: 'Today',
    orderTime: '10:38 AM',
    customerName: 'Marcus Sterling',
    customerAddress: '120 Wall St, New York NY 10005',
    distanceMiles: 0.9,
    channel: 'Direct Mobile Web',
    tenantStoreName: 'MedPlus Central',
    tenantStoreNumber: '#055',
    genericMolecule: 'Rosuvastatin Calcium 10mg',
    brandReference: 'Crestor (30 Tabs)',
    items: [
      {
        name: 'Rosuvastatin Calcium',
        dosage: '10mg',
        packaging: '1 x 30 Tablet Bottle',
        lotNumber: 'ROS-9910',
        price: 18.90,
        quantity: 1
      }
    ],
    orderTotal: 18.90,
    brandedValue: 61.00,
    patientSavingsPercent: 69.0,
    patientSavingsAmount: 42.10,
    platformFee: 1.89,
    status: 'Validating Rx',
    rxNumber: 'RX-99412',
    prescribingDoctor: 'Dr. Aris Thorne, MD',
    pharmacistAudit: 'Pending digital sign-off',
    deliveryType: 'Standard Ground'
  },
  {
    id: 'ord-3',
    orderNumber: '#ORD-2026-8939',
    orderDate: 'Today',
    orderTime: '09:12 AM',
    customerName: 'David K. Zhao',
    customerAddress: '77 12th St, Long Island City NY 11101',
    distanceMiles: 3.4,
    channel: 'Android Web App',
    tenantStoreName: 'HealthSafe Express',
    tenantStoreNumber: '#012',
    genericMolecule: 'Insulin Glargine Pen (2x 3ml)',
    brandReference: 'Lantus SoloStar',
    items: [
      {
        name: 'Insulin Glargine Pen',
        dosage: '100 units/ml (2x 3ml)',
        packaging: 'Pre-filled SoloStar Box',
        lotNumber: 'INS-4011',
        price: 78.50,
        quantity: 1
      }
    ],
    orderTotal: 78.50,
    brandedValue: 266.50,
    patientSavingsPercent: 70.5,
    patientSavingsAmount: 188.00,
    platformFee: 7.85,
    status: 'In-Transit',
    rxNumber: 'RX-99381',
    prescribingDoctor: 'Dr. Sarah Miller, MD',
    pharmacistAudit: 'Pharm. Elena Vance, RPh (#PH-381)',
    deliveryType: 'Cold-Chain',
    courierName: 'Kevin T.',
    courierVehicle: 'ColdMed Van #NY-14',
    courierEtaMins: 32,
    courierTempCelsius: 4.1
  },
  {
    id: 'ord-4',
    orderNumber: '#ORD-2026-8938',
    orderDate: 'Today',
    orderTime: '08:50 AM',
    customerName: 'Anita Desai',
    customerAddress: '350 5th Ave, New York NY 10118',
    distanceMiles: 2.1,
    channel: 'Patient iOS v2.4',
    tenantStoreName: 'Apollo Pharmacy Hub',
    tenantStoreNumber: '#104',
    genericMolecule: 'Amoxicillin 500mg Capsules',
    brandReference: 'Amoxil (21 Caps)',
    items: [
      {
        name: 'Amoxicillin Capsules',
        dosage: '500mg',
        packaging: '21 Capsules Pack',
        lotNumber: 'AMX-1120',
        price: 14.00,
        quantity: 1
      }
    ],
    orderTotal: 14.00,
    brandedValue: 33.40,
    patientSavingsPercent: 58.1,
    patientSavingsAmount: 19.40,
    platformFee: 1.40,
    status: 'Awaiting Pickup',
    rxNumber: 'RX-99344',
    prescribingDoctor: 'Dr. Raj Patel, MD',
    pharmacistAudit: 'Pharm. David Cole, RPh (#PH-492)',
    deliveryType: 'Standard Ground'
  },
  {
    id: 'ord-5',
    orderNumber: '#ORD-2026-8935',
    orderDate: 'Today',
    orderTime: '08:15 AM',
    customerName: 'Robert Chen',
    customerAddress: '910 Grand Concourse, Bronx NY 10451',
    distanceMiles: 8.2,
    channel: 'Tenant Partner Portal API',
    tenantStoreName: 'National Generic Depot',
    tenantStoreNumber: '#089',
    genericMolecule: 'Levothyroxine Sodium 100mcg',
    brandReference: 'Synthroid (90 Tabs)',
    items: [
      {
        name: 'Levothyroxine Sodium',
        dosage: '100mcg',
        packaging: '90 Tablets Bottle',
        lotNumber: 'LEV-5590',
        price: 22.40,
        quantity: 1
      }
    ],
    orderTotal: 22.40,
    brandedValue: 68.00,
    patientSavingsPercent: 67.0,
    patientSavingsAmount: 45.60,
    platformFee: 2.24,
    status: 'Re-dispatching',
    rxNumber: 'RX-99204',
    prescribingDoctor: 'Dr. Evelyn Reed, MD',
    pharmacistAudit: 'Pharm. Marcus King, RPh (#PH-204)',
    deliveryType: 'Standard Ground'
  },
  {
    id: 'ord-6',
    orderNumber: '#ORD-2026-7812',
    orderDate: 'Feb 21, 2026',
    orderTime: '02:15 PM',
    customerName: 'Sarah Jenkins',
    customerAddress: '482 Atlantic Ave, Apt 4B, Brooklyn NY 11217',
    distanceMiles: 1.8,
    channel: 'Patient iOS v2.4',
    tenantStoreName: 'Apollo Pharmacy Hub',
    tenantStoreNumber: '#104',
    genericMolecule: 'Atorvastatin Calcium 20mg',
    brandReference: 'Lipitor® (30 Tablets)',
    items: [
      {
        name: 'Atorvastatin Calcium',
        dosage: '20mg',
        packaging: '1 x 30 Tablet Blister',
        lotNumber: 'ATR-8812',
        price: 16.00,
        quantity: 1
      }
    ],
    orderTotal: 16.00,
    brandedValue: 42.00,
    patientSavingsPercent: 61.9,
    patientSavingsAmount: 26.00,
    platformFee: 1.60,
    status: 'Fulfilled',
    rxNumber: 'RX-99410',
    prescribingDoctor: 'Dr. Harrison Wright, MD',
    pharmacistAudit: 'Pharm. David Cole, RPh (#PH-492)',
    deliveryType: 'Express 2h',
    courierName: 'Carlos M.',
    courierVehicle: 'SwiftMed Courier Fleet #84'
  },
  {
    id: 'ord-7',
    orderNumber: '#ORD-2026-6401',
    orderDate: 'Jan 18, 2026',
    orderTime: '11:40 AM',
    customerName: 'Sarah Jenkins',
    customerAddress: '482 Atlantic Ave, Apt 4B, Brooklyn NY 11217',
    distanceMiles: 1.8,
    channel: 'Patient iOS v2.4',
    tenantStoreName: 'Apollo Pharmacy Hub',
    tenantStoreNumber: '#104',
    genericMolecule: 'Metformin Hydrochloride ER 500mg',
    brandReference: 'Glucophage® (60 Tablets)',
    items: [
      {
        name: 'Metformin Hydrochloride ER',
        dosage: '500mg',
        packaging: '1 x 60 Tablet Bottle',
        lotNumber: 'MET-1980',
        price: 7.80,
        quantity: 1
      }
    ],
    orderTotal: 7.80,
    brandedValue: 28.50,
    patientSavingsPercent: 72.6,
    patientSavingsAmount: 20.70,
    platformFee: 0.78,
    status: 'Fulfilled',
    rxNumber: 'RX-99410',
    prescribingDoctor: 'Dr. Harrison Wright, MD',
    pharmacistAudit: 'Pharm. David Cole, RPh (#PH-492)',
    deliveryType: 'Standard Ground',
    courierName: 'Kevin T.',
    courierVehicle: 'ColdMed Van #NY-14'
  },
  {
    id: 'ord-8',
    orderNumber: '#ORD-2025-5120',
    orderDate: 'Dec 12, 2025',
    orderTime: '04:22 PM',
    customerName: 'Sarah Jenkins',
    customerAddress: '482 Atlantic Ave, Apt 4B, Brooklyn NY 11217',
    distanceMiles: 2.4,
    channel: 'Direct Mobile Web',
    tenantStoreName: 'CarePoint Healthcare Inc',
    tenantStoreNumber: '#042',
    genericMolecule: 'Amoxicillin Trihydrate 500mg',
    brandReference: 'Amoxil® (21 Capsules)',
    items: [
      {
        name: 'Amoxicillin Trihydrate',
        dosage: '500mg',
        packaging: '21 Capsules Blister Pack',
        lotNumber: 'AMX-0941',
        price: 14.00,
        quantity: 1
      }
    ],
    orderTotal: 14.00,
    brandedValue: 33.40,
    patientSavingsPercent: 58.1,
    patientSavingsAmount: 19.40,
    platformFee: 1.40,
    status: 'Fulfilled',
    rxNumber: 'RX-88201',
    prescribingDoctor: 'Dr. Emily Watson, MD',
    pharmacistAudit: 'Pharm. Elena Vance, RPh (#PH-381)',
    deliveryType: 'Standard Ground'
  }
];

export const INITIAL_CART: CartItem[] = [
  {
    id: 'cart-1',
    medicineName: 'Atorvastatin Calcium',
    dosage: '20mg',
    brandName: 'Lipitor®',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    packDescription: 'Pack: 30 Tablets (1 month supply)',
    quantity: 1,
    unitPrice: 8.40,
    brandedPrice: 42.00,
    rxNumber: 'RX-99410',
    doctorName: 'Dr. Harrison Wright',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa_UWhuwrlRxQ71o8-VsZ9VlqI8S_0CyUvR4TA4rn6XKCwlfcYiFw2CJi9zcuksgWeMlQyeI9ElZhfPJXPwO_-AeM9rlDmQKq7a7UGWAqbF5QCcnqOQK03Y1K7t6lTjsaskFz82gkC413BFaxLV1L1Fy7tH7My96jCfdJihdB8goBxA_HFyCAPCP7_97N8HLrLhSNOp5itC90c4GW_vsB9wh_6PRlCZsXOzQ7mIsVzFPIU2u5_58Be'
  },
  {
    id: 'cart-2',
    medicineName: 'Metformin HCl ER',
    dosage: '500mg Extended Release',
    brandName: 'Glucophage®',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    packDescription: 'Pack: 60 Tablets',
    quantity: 1,
    unitPrice: 3.90,
    brandedPrice: 28.50,
    rxNumber: 'RX-99410',
    doctorName: 'Dr. Harrison Wright',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW2zbWnTrC1h1WouUPehvoqyuhzKy9Dzn-v9tkmQfd_MQB0KWXu4nuAbXvNgqFqT6ognTEg6mtvBElHYrFcgmJH0EQIb63XdQK8jSVlsgcChiRuyFydyfblxpN9azE2OQeg6NF7BldhM5rbj6OYlobHmJ7bqyaLerkHkpalxlMEx4otVaq6_E7GLcE9dtoEFtHd7opeMsyPba5rqymcvn_1LpvgUcLQXLH1mRn99rG-SA8TrY6qo-C'
  }
];

export const ASSET_IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1ULBERcmJJin5O0jXJ0Yn1PhvNAPKwpMvl5h_youNhfS0hj3eOePbvY9gTkvqNpJJWWlPxAwARpB4_GKFC8NwBjN-yDjbsZ9DCcnbyndKnl_JqtKTTKeFY0FXSmhxe2bH8SwHZBweaZQP9850IJS0yfTXWfmBIg6PklDqwW95x4-wHkvk5VRLClVIwEZb2GpIXeLOUOST7vRc7My0eKttczd4TQ6snE5KQJ4mgZb6U_9ZBVEyswXScIWaM',
  adminAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQUvqaqw251EM7CMDHz8dkZ8Gpo_DKZZd_n68sIX44P-1NT2FYVlpuYz4MNf1SxjzAXpIlp27wezAf_U2LjExJqH7kscz945IR7EI6xOyUjoA4DF1g7GG7eW1g2eCYvx_UYIcgp_tnIPYKPFrAUje-PZPI_BmR2WhQNdQof2Z3AKuYFk7h8obrrtf15l-XHdxO9fLjBfyrsH22pcOq_7URlUYlZ18ie48lB7RNgC1oZbGfcDAwlFpL',
  courierCarlos: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAqUlke5p7RdCUM943xkNEYN9D_4tg3hp1vwPbGEWYZ8zuAEm-PgUCkWj9DQkTikKrSVIsain39jTv8p_T-RP8XcAYeuT1Vw-LwvdHnENk1XEdnqaGv2QQD892_RYu5wzymA1DjMrgGH--U1pnQ5zcNrw6zkTQ9fjmxfiJ46daZaFKWvpH5G6pgRiY0o_srKHDfPDi-dMPwEwd5C6JQJtHhgsDTSNOY4Uac-Leqjz0pyr8B_KJLn0Y',
  brooklynRouteMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLAGkG1AmUBr4WI3TBlB-5AL384ybiVj4XcBbCv4CFSkz7T9u6U2rlvyUAsVsWnSpDTnBYhXCDMR4Vzt__CpYof8k7FUmgToaAMTPPgXHCk_A9WAmg2c8Hjy0n5NMt5gMTKHtVaRO9eZVn9kwNMxw_Pq03JMws0_vAz9_Xq_HTUl6O9Yz3_axBq0gLvv6mhQq-j8eRqTWRLd760ZOcDC2Q5MvlKJ4lxDFd9D3QIbuJD3pdFMW_qpiX',
  liveTelemetryMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8vCBhmy2v8UzBMs9AR-KcsV3ya83LADoEj_gsNQopc0eJZvDnXjh1XrIYl8lsupwurJSM3DpR7_AxgvyG77Hf56KvK5ASekUKx9WaTjqSseTEyAGuOV9IEaliq03YW3RwJL6zJ8pLPydkrA01fa5cgzjM13k1p1ng7ATcTQv_lVJ86ud3cgfWJLMuApRcj2HguW1tUmp9SIMlN0OtXtGhVvv00spjS_iJgmlt5-NJ8qr1ZwdWwLez',
  atorvastatinTablet: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa4VrKTYQs_bMxoNRXtazudeP_eknv0WM42CKoTm60pXQ7Y8zUZfRxPU2TlPlQbCmkG1Oh54mRxzoE5a6t6_A32zecqUj7bRVJ5uJX9ztUE5CKb3q3I5KJO9DGAfTE-L_ZZ38hfX7OJGZ_bN2TRvnBqNGZlIz-eUJHlXdscbgB5qRAT9cYpXHPG-0aMeDLUZOW7oZGqHWOAUPjXizQquDcA3fh4jbLDisUKICRbHgfO4JJR6K3iPtP',
  atorvastatinBlister: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa_UWhuwrlRxQ71o8-VsZ9VlqI8S_0CyUvR4TA4rn6XKCwlfcYiFw2CJi9zcuksgWeMlQyeI9ElZhfPJXPwO_-AeM9rlDmQKq7a7UGWAqbF5QCcnqOQK03Y1K7t6lTjsaskFz82gkC413BFaxLV1L1Fy7tH7My96jCfdJihdB8goBxA_HFyCAPCP7_97N8HLrLhSNOp5itC90c4GW_vsB9wh_6PRlCZsXOzQ7mIsVzFPIU2u5_58Be',
  metforminBottle: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW2zbWnTrC1h1WouUPehvoqyuhzKy9Dzn-v9tkmQfd_MQB0KWXu4nuAbXvNgqFqT6ognTEg6mtvBElHYrFcgmJH0EQIb63XdQK8jSVlsgcChiRuyFydyfblxpN9azE2OQeg6NF7BldhM5rbj6OYlobHmJ7bqyaLerkHkpalxlMEx4otVaq6_E7GLcE9dtoEFtHd7opeMsyPba5rqymcvn_1LpvgUcLQXLH1mRn99rG-SA8TrY6qo-C',
  metforminBox: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwY1S1FLyGmOmzQyjMxUn7xCmSp224hlLuae9sVkBrHhdaaoIfvlUpk9c0_28vqMZtwQvYW2UJBy8mrDjgDAwJ1tCGNelDEcXwU4G57ZnHb_DM0I0utavuX_Rxbwqq49109WuLAu7Qp5G753CNFFeVD5UtQIcH3DYntzo001FqFvHeL6-2LT6kmOf6e9RiCEkgPqs1NWSgxNsURMO6hmBC3rj1wyoHd3vi4MbtyYnTamUxER8sNJue',
  amoxicillinPack: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDb-DOV_ByyQRR6rlwjx91degg9-l-xnOErnFYtp5m9eLyABZyIH6lJ4CxlamSw31bbyVZCEB8SPK-vaohEwbeTSvT3AVj5SgYt_zJb5JNJJkUQiNMm_srr70LkBxU3E2_zIB-z1q4bwhc6R98EPfPCUFoUf-4B5kCwmuAfBN9Rkb-XUNS_rsya3bOiMKlNbL-OhjDJaiZW1fOiaPtnAHlwCQJ6qQORIYSQC34U56ganw_ue6d-VR7b',
  laboratoryHero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvK_-Jw-5FTFtKQJKjLjN6HvgVV3DIQgGgJo6PX_MVPYYNqErZXvgmVs91ljkqyQ-hPpCWnwmIzK5ARfmarw0hjy2I7YfpberK-4GZbWpeg9NHSPAq7ilnS7so_44UGIgCFLniFzu_bUzSY_OYYFZCfyGDrygXBsRso-Q742JiENDkJVCRRTGKPplm1E3Q6Jvzr0TXjfz6EH5Rn2WjiUXvQllwlf0jkN30Y5Bp-IC8EwdN6cv3ZL6n',
  rxDocSample: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3Pa79KzDL1gPaPtXbU3xccpiWyuy4UNfPlnqXthmMCIQNWi9V2IrwHx7Eo6Rs9T3rE_6hV9H5EA2p1lgwla-n3dS6y71spUHM1svOg1MbxKhDeVGme1_zDMUBmryjGoJ5ZMEIg-5lQcBWflj8G3H9p-e22V7C0Q0zcWyFLyHLEkuKoqRD0whMSmuCN3jUbhq1RUCa8OMwNgn-uyGa57HphO2zhxmthlAzYMr8ie9eXQNhIm_Ur1RX'
};

// =============================================================================
// PHASE 2 MOCK DATA — Logistics, IoT, Geo-Fencing, Mobile
// =============================================================================
import {
  CarrierProfile,
  ShipmentDispatch,
  RiderProfile,
  GeoFencePolygon,
  ProximityScore,
  IoTSensorPacket,
  MobileNotification,
} from '../types';

// ─── Carriers ─────────────────────────────────────────────────────────────────

export const INITIAL_CARRIERS: CarrierProfile[] = [
  {
    id: 'carrier-dunzo-01',
    type: 'Dunzo',
    displayName: 'Dunzo On-Demand Healthcare',
    avgDeliveryMins: 75,
    supportsColdChain: true,
    coverageZone: 'Urban Metro (5-mile radius)',
    status: 'available',
    baseCostUsd: 3.50,
    activeShipments: 3,
    apiEndpoint: 'https://api.dunzo.com/v2/tasks',
  },
  {
    id: 'carrier-shadowfax-01',
    type: 'Shadowfax',
    displayName: 'Shadowfax Hyperlocal Delivery',
    avgDeliveryMins: 180,
    supportsColdChain: false,
    coverageZone: 'Same-Day Urban & Suburban',
    status: 'available',
    baseCostUsd: 2.25,
    activeShipments: 1,
    apiEndpoint: 'https://api.shadowfax.in/v1/orders',
  },
  {
    id: 'carrier-fedex-01',
    type: 'FedEx Healthcare Express',
    displayName: 'FedEx Healthcare Express',
    avgDeliveryMins: 480,
    supportsColdChain: true,
    coverageZone: 'Pan-Regional (Nationwide)',
    status: 'available',
    baseCostUsd: 12.00,
    activeShipments: 0,
    apiEndpoint: 'https://apis.fedex.com/ship/v1/shipments',
  },
];

// ─── Active Shipment Dispatches ───────────────────────────────────────────────

export const INITIAL_DISPATCHES: ShipmentDispatch[] = [
  {
    id: 'disp-881042',
    orderId: 'ord-1',
    orderNumber: '#ORD-2026-8941',
    carrierId: 'carrier-dunzo-01',
    carrierType: 'Dunzo',
    waybillNumber: 'GMS-88104201-442',
    barcodeData: '128:GMS8810420144',
    assignedRiderId: 'rider-001',
    assignedRiderName: 'Carlos Mendez',
    pickupAddress: 'Apollo Pharmacy Hub #104, 1420 Broadway, NY 10018',
    deliveryAddress: '482 Atlantic Ave, Brooklyn NY 11217',
    distanceMiles: 1.8,
    isColdChain: true,
    dispatchedAt: new Date(Date.now() - 28 * 60000).toISOString(),
    estimatedDeliveryAt: new Date(Date.now() + 18 * 60000).toISOString(),
    currentStatus: 'OUT_FOR_DELIVERY',
    events: [
      { id: 'evt-001', shipmentId: 'disp-881042', status: 'ASSIGNED',         timestamp: new Date(Date.now() - 28 * 60000).toISOString(), riderNote: 'Assigned to Carlos Mendez' },
      { id: 'evt-002', shipmentId: 'disp-881042', status: 'PICKED_UP',        timestamp: new Date(Date.now() - 20 * 60000).toISOString(), riderNote: 'Package collected from pharmacy' },
      { id: 'evt-003', shipmentId: 'disp-881042', status: 'OUT_FOR_DELIVERY', timestamp: new Date(Date.now() - 5  * 60000).toISOString(), riderNote: 'En route to patient' },
    ],
    manifestUrl: '/api/v2/logistics/waybill/GMS-88104201-442',
  },
  {
    id: 'disp-881043',
    orderId: 'ord-3',
    orderNumber: '#ORD-2026-8939',
    carrierId: 'carrier-dunzo-01',
    carrierType: 'Dunzo',
    waybillNumber: 'GMS-88104301-891',
    barcodeData: '128:GMS8810430189',
    assignedRiderId: 'rider-002',
    assignedRiderName: 'Kevin Thompson',
    pickupAddress: 'HealthSafe Express #012, 77 12th St, LIC NY 11101',
    deliveryAddress: '77 12th St, Long Island City NY 11101',
    distanceMiles: 3.4,
    isColdChain: true,
    dispatchedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    estimatedDeliveryAt: new Date(Date.now() + 32 * 60000).toISOString(),
    currentStatus: 'PICKED_UP',
    events: [
      { id: 'evt-004', shipmentId: 'disp-881043', status: 'ASSIGNED',  timestamp: new Date(Date.now() - 45 * 60000).toISOString(), riderNote: 'Assigned to Kevin Thompson' },
      { id: 'evt-005', shipmentId: 'disp-881043', status: 'PICKED_UP', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), riderNote: 'Insulin pens loaded into cold-box' },
    ],
    manifestUrl: '/api/v2/logistics/waybill/GMS-88104301-891',
  },
  {
    id: 'disp-881044',
    orderId: 'ord-2',
    orderNumber: '#ORD-2026-8942',
    carrierId: 'carrier-shadowfax-01',
    carrierType: 'Shadowfax',
    waybillNumber: 'GMS-88104401-210',
    barcodeData: '128:GMS8810440121',
    assignedRiderId: 'rider-003',
    assignedRiderName: 'Priya Nair',
    pickupAddress: 'MedPlus Central #055, 120 Wall St, NY 10005',
    deliveryAddress: '120 Wall St, New York NY 10005',
    distanceMiles: 0.9,
    isColdChain: false,
    dispatchedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    estimatedDeliveryAt: new Date(Date.now() + 60 * 60000).toISOString(),
    currentStatus: 'ASSIGNED',
    events: [
      { id: 'evt-006', shipmentId: 'disp-881044', status: 'ASSIGNED', timestamp: new Date(Date.now() - 12 * 60000).toISOString(), riderNote: 'Pending Rx validation clearance' },
    ],
    manifestUrl: '/api/v2/logistics/waybill/GMS-88104401-210',
  },
];

// ─── Riders ───────────────────────────────────────────────────────────────────

export const INITIAL_RIDERS: RiderProfile[] = [
  {
    id: 'rider-001',
    fullName: 'Carlos Mendez',
    phone: '+1 (718) 555-0192',
    vehicleType: 'Van (Cold-Chain)',
    vehicleNumber: 'NY-CMED-084',
    carrierType: 'Dunzo',
    status: 'delivering',
    currentLatitude: 40.6892,
    currentLongitude: -74.0445,
    currentAddress: 'Brooklyn Bridge Park, Brooklyn NY',
    activeShipmentIds: ['disp-881042'],
    batteryPercent: 88,
    totalDeliveriesToday: 7,
    rating: 4.9,
  },
  {
    id: 'rider-002',
    fullName: 'Kevin Thompson',
    phone: '+1 (929) 555-0347',
    vehicleType: 'Van (Cold-Chain)',
    vehicleNumber: 'NY-CM14',
    carrierType: 'Dunzo',
    status: 'on_route',
    currentLatitude: 40.7282,
    currentLongitude: -73.7949,
    currentAddress: 'Jamaica, Queens NY',
    activeShipmentIds: ['disp-881043'],
    batteryPercent: 62,
    totalDeliveriesToday: 11,
    rating: 4.7,
  },
  {
    id: 'rider-003',
    fullName: 'Priya Nair',
    phone: '+1 (212) 555-0881',
    vehicleType: 'Motorcycle',
    vehicleNumber: 'NY-SFX-221',
    carrierType: 'Shadowfax',
    status: 'at_pickup',
    currentLatitude: 40.7580,
    currentLongitude: -73.9855,
    currentAddress: 'Times Square, Manhattan NY',
    activeShipmentIds: ['disp-881044'],
    batteryPercent: 95,
    totalDeliveriesToday: 4,
    rating: 4.8,
  },
];

// ─── Geo-Fence Zones ──────────────────────────────────────────────────────────

export const INITIAL_GEO_FENCES: GeoFencePolygon[] = [
  {
    id: 'gf-apollo-manhattan',
    pharmacyId: 'TNT-3109',
    pharmacyName: 'Apollo Pharmacy — Manhattan Hub',
    radiusMiles: 4.0,
    maxDeliveryMins: 75,
    isActive: true,
    coverageLabel: 'Manhattan & Lower East Side',
    vertices: [
      { latitude: 40.8176, longitude: -74.0099 },
      { latitude: 40.8176, longitude: -73.9071 },
      { latitude: 40.7005, longitude: -73.9071 },
      { latitude: 40.7005, longitude: -74.0099 },
    ],
  },
  {
    id: 'gf-carepoint-brooklyn',
    pharmacyId: 'TNT-8492',
    pharmacyName: 'CarePoint Healthcare — Brooklyn Zone',
    radiusMiles: 3.5,
    maxDeliveryMins: 90,
    isActive: true,
    coverageLabel: 'Brooklyn & Park Slope',
    vertices: [
      { latitude: 40.7282, longitude: -74.0207 },
      { latitude: 40.7282, longitude: -73.9340 },
      { latitude: 40.6501, longitude: -73.9340 },
      { latitude: 40.6501, longitude: -74.0207 },
    ],
  },
  {
    id: 'gf-healthkart-queens',
    pharmacyId: 'TNT-5021',
    pharmacyName: 'HealthKart Generic Direct — Queens',
    radiusMiles: 5.0,
    maxDeliveryMins: 120,
    isActive: true,
    coverageLabel: 'Queens & Long Island City',
    vertices: [
      { latitude: 40.7900, longitude: -73.9500 },
      { latitude: 40.7900, longitude: -73.7800 },
      { latitude: 40.6900, longitude: -73.7800 },
      { latitude: 40.6900, longitude: -73.9500 },
    ],
  },
  {
    id: 'gf-sunmed-bronx',
    pharmacyId: 'TNT-1194',
    pharmacyName: 'SunMed Drugstores — Bronx',
    radiusMiles: 4.5,
    maxDeliveryMins: 100,
    isActive: true,
    coverageLabel: 'Bronx & Upper Manhattan',
    vertices: [
      { latitude: 40.9200, longitude: -73.9500 },
      { latitude: 40.9200, longitude: -73.8200 },
      { latitude: 40.8100, longitude: -73.8200 },
      { latitude: 40.8100, longitude: -73.9500 },
    ],
  },
];

// ─── Proximity Scores (pre-computed for Brooklyn patient at 40.6763, -73.9588) ─

export const INITIAL_PROXIMITY_SCORES: ProximityScore[] = [
  {
    pharmacyId: 'TNT-8492',
    pharmacyName: 'CarePoint Healthcare — Brooklyn Zone',
    distanceMiles: 1.4,
    proximityScore: 93,
    estimatedDeliveryMins: 90,
    withinServiceZone: true,
    carrier: 'Dunzo',
  },
  {
    pharmacyId: 'TNT-3109',
    pharmacyName: 'Apollo Pharmacy — Manhattan Hub',
    distanceMiles: 4.2,
    proximityScore: 79,
    estimatedDeliveryMins: 75,
    withinServiceZone: true,
    carrier: 'Dunzo',
  },
  {
    pharmacyId: 'TNT-5021',
    pharmacyName: 'HealthKart Generic Direct — Queens',
    distanceMiles: 6.8,
    proximityScore: 66,
    estimatedDeliveryMins: 120,
    withinServiceZone: false,
    carrier: 'Shadowfax',
  },
  {
    pharmacyId: 'TNT-1194',
    pharmacyName: 'SunMed Drugstores — Bronx',
    distanceMiles: 9.1,
    proximityScore: 55,
    estimatedDeliveryMins: 100,
    withinServiceZone: false,
    carrier: 'Shadowfax',
  },
];

// ─── IoT Sensor Packets (cold-chain history for ord-1) ────────────────────────

const now = Date.now();
export const INITIAL_IOT_PACKETS: IoTSensorPacket[] = [
  { id: 'iot-001', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 3.8, batteryPercent: 96, latitude: 40.7128, longitude: -74.0060, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 25 * 60000).toISOString(), humidityPercent: 42 },
  { id: 'iot-002', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 4.1, batteryPercent: 95, latitude: 40.7091, longitude: -74.0050, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 22 * 60000).toISOString(), humidityPercent: 43 },
  { id: 'iot-003', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 4.3, batteryPercent: 95, latitude: 40.7055, longitude: -74.0030, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 19 * 60000).toISOString(), humidityPercent: 44 },
  { id: 'iot-004', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 4.0, batteryPercent: 94, latitude: 40.7012, longitude: -74.0010, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 16 * 60000).toISOString(), humidityPercent: 44 },
  { id: 'iot-005', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 4.2, batteryPercent: 94, latitude: 40.6963, longitude: -73.9980, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 13 * 60000).toISOString(), humidityPercent: 45 },
  { id: 'iot-006', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 3.9, batteryPercent: 93, latitude: 40.6921, longitude: -73.9950, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now - 10 * 60000).toISOString(), humidityPercent: 45 },
  { id: 'iot-007', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'BLE', temperatureCelsius: 4.2, batteryPercent: 93, latitude: 40.6892, longitude: -73.9920, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now -  7 * 60000).toISOString(), humidityPercent: 46 },
  { id: 'iot-008', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'HTTP', temperatureCelsius: 4.4, batteryPercent: 92, latitude: 40.6871, longitude: -73.9890, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now -  4 * 60000).toISOString(), humidityPercent: 46 },
  { id: 'iot-009', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'HTTP', temperatureCelsius: 4.1, batteryPercent: 92, latitude: 40.6855, longitude: -73.9871, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now -  2 * 60000).toISOString(), humidityPercent: 47 },
  { id: 'iot-010', orderId: 'ord-1', sensorId: 'BLE-SNSR-892', protocol: 'HTTP', temperatureCelsius: 3.8, batteryPercent: 92, latitude: 40.6840, longitude: -73.9855, isBreached: false, cumulativeExcursionMins: 0, quarantineTriggered: false, timestamp: new Date(now).toISOString(), humidityPercent: 47 },
];

// ─── Mobile Notifications ─────────────────────────────────────────────────────

export const INITIAL_MOBILE_NOTIFICATIONS: MobileNotification[] = [
  {
    id: 'notif-001',
    userId: 'usr-patient-8821',
    type: 'order_dispatched',
    title: '🚚 Order Dispatched via Dunzo',
    body: 'Your order #ORD-2026-8941 has been dispatched. Carlos Mendez is on the way with your cold-chain package.',
    orderId: 'ord-1',
    deepLinkTab: 'my-orders',
    isRead: false,
    createdAt: new Date(now - 28 * 60000).toISOString(),
  },
  {
    id: 'notif-002',
    userId: 'usr-patient-8821',
    type: 'temperature_stable',
    title: '❄ Cold-Chain Optimal — 4.2°C',
    body: 'Your Insulin Glargine package is maintaining 4.2°C. Temperature within safe 2°C–8°C GDP range.',
    orderId: 'ord-1',
    deepLinkTab: 'my-orders',
    isRead: false,
    createdAt: new Date(now - 10 * 60000).toISOString(),
  },
  {
    id: 'notif-003',
    userId: 'usr-patient-8821',
    type: 'out_for_delivery',
    title: '📦 Out for Delivery — 18 min away',
    body: 'Carlos Mendez is 1.2 miles from your location. OTP will be required at handover.',
    orderId: 'ord-1',
    deepLinkTab: 'my-orders',
    isRead: false,
    createdAt: new Date(now - 5 * 60000).toISOString(),
  },
  {
    id: 'notif-004',
    userId: 'usr-patient-8821',
    type: 'rx_approved',
    title: '✅ Prescription Approved',
    body: 'Pharm. David Cole (RPh #PH-492) has verified your Rx for Atorvastatin 20mg. Order is being dispensed.',
    orderId: 'ord-2',
    deepLinkTab: 'my-orders',
    isRead: true,
    createdAt: new Date(now - 45 * 60000).toISOString(),
  },
  {
    id: 'notif-005',
    userId: 'usr-patient-8821',
    type: 'refill_reminder',
    title: '💊 Refill Reminder — 5 days left',
    body: 'Your Metformin 500mg supply runs out in 5 days. Tap to reorder and save 73%.',
    deepLinkTab: 'discover',
    isRead: true,
    createdAt: new Date(now - 2 * 60 * 60000).toISOString(),
  },
];

// =============================================================================
// PHASE 3 MOCK DATA — FHIR/EHR, DDI, Voice, B2B Wholesale
// =============================================================================
import {
  EhrProvider,
  FhirMedicationRequest,
  DdiInteraction,
  ManufacturerProfile,
  WholesaleListing,
  CertificateOfAnalysis,
  B2bOrder,
  B2bCreditAccount,
} from '../types';

// ─── EHR Providers ───────────────────────────────────────────────────────────

export const INITIAL_FHIR_PROVIDERS: EhrProvider[] = [
  { id: 'ehr-epic-01',   name: 'Epic',          displayName: 'Epic MyChart / EpicCare',             fhirBaseUrl: 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4',              version: 'R4', supportsDigitalSignature: true,  connectedHospitals: 2850, isActive: true  },
  { id: 'ehr-cerner-01', name: 'Cerner',         displayName: 'Oracle Health (Cerner Millennium)',    fhirBaseUrl: 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d', version: 'R4', supportsDigitalSignature: true,  connectedHospitals: 1800, isActive: true  },
  { id: 'ehr-practo-01', name: 'Practo',         displayName: 'Practo Ray Clinic Management',        fhirBaseUrl: 'https://api.practo.com/fhir/r4',                                       version: 'R4', supportsDigitalSignature: true,  connectedHospitals: 340,  isActive: true  },
  { id: 'ehr-kareo-01',  name: 'Kareo',          displayName: 'Kareo Clinical EHR',                  fhirBaseUrl: 'https://api.kareo.com/fhir/r4',                                        version: 'R4', supportsDigitalSignature: false, connectedHospitals: 180,  isActive: true  },
  { id: 'ehr-athena-01', name: 'AthenaHealth',   displayName: 'Athenahealth Network',                fhirBaseUrl: 'https://api.platform.athenahealth.com/fhir/r4',                        version: 'R4', supportsDigitalSignature: true,  connectedHospitals: 920,  isActive: true  },
  { id: 'ehr-drchrono-01', name: 'DrChrono',     displayName: 'DrChrono EHR',                        fhirBaseUrl: 'https://drchrono.com/api/fhir/r4',                                     version: 'R4', supportsDigitalSignature: false, connectedHospitals: 95,   isActive: false },
];

// ─── FHIR MedicationRequests ─────────────────────────────────────────────────

export const INITIAL_FHIR_REQUESTS: FhirMedicationRequest[] = [
  {
    resourceType: 'MedicationRequest',
    id: 'fhir-rx-8821-001',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '617316', display: 'Atorvastatin Calcium 20mg' }],
      text: 'Atorvastatin Calcium 20mg (Generic for Lipitor)',
    },
    subject: { reference: 'Patient/usr-patient-8821', display: 'Sarah Jenkins' },
    requester: {
      reference: 'Practitioner/dr-harrison-wright',
      display: 'Dr. Harrison Wright, MD',
      registrationNumber: 'MCR-NY-89421',
      certificateThumbprint: 'CERT-EPIC-SHA256-A1B2C3',
    },
    authoredOn: new Date(Date.now() - 2 * 86400000).toISOString(),
    dosageInstruction: [{ text: 'Take 1 tablet orally once daily at bedtime', doseAndRate: [{ doseQuantity: { value: 1, unit: 'tablet' } }] }],
    dispenseRequest: { quantity: { value: 30, unit: 'tablets' }, numberOfRepeatsAllowed: 11, validityPeriod: { start: new Date(Date.now() - 2 * 86400000).toISOString(), end: new Date(Date.now() + 180 * 86400000).toISOString() } },
    signature: { type: [{ system: 'urn:iso-astm:E1762-95:2013', code: '1.2.840.10065.1.12.1.1', display: 'Author\'s Signature' }], when: new Date(Date.now() - 2 * 86400000).toISOString(), who: { reference: 'Practitioner/dr-harrison-wright' }, sigFormat: 'application/signature+xml', data: 'BASE64_SIG_DATA' },
    ehrProviderId: 'ehr-epic-01',
  },
  {
    resourceType: 'MedicationRequest',
    id: 'fhir-rx-8821-002',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '860975', display: 'Metformin Hydrochloride 500mg' }],
      text: 'Metformin HCl 500mg Extended Release (Generic for Glucophage XR)',
    },
    subject: { reference: 'Patient/usr-patient-8821', display: 'Sarah Jenkins' },
    requester: {
      reference: 'Practitioner/dr-harrison-wright',
      display: 'Dr. Harrison Wright, MD',
      registrationNumber: 'MCR-NY-89421',
    },
    authoredOn: new Date(Date.now() - 5 * 86400000).toISOString(),
    dosageInstruction: [{ text: 'Take 1 tablet twice daily with meals', doseAndRate: [{ doseQuantity: { value: 500, unit: 'mg' } }] }],
    dispenseRequest: { quantity: { value: 60, unit: 'tablets' }, numberOfRepeatsAllowed: 5 },
    ehrProviderId: 'ehr-epic-01',
  },
  {
    resourceType: 'MedicationRequest',
    id: 'fhir-rx-9912-003',
    status: 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [{ system: 'http://www.nlm.nih.gov/research/umls/rxnorm', code: '309309', display: 'Amoxicillin 500mg' }],
      text: 'Amoxicillin Trihydrate 500mg Capsules',
    },
    subject: { reference: 'Patient/usr-patient-9912', display: 'Marcus Sterling' },
    requester: {
      reference: 'Practitioner/dr-aris-thorne',
      display: 'Dr. Aris Thorne, MD',
      registrationNumber: 'MCR-NY-44201',
    },
    authoredOn: new Date(Date.now() - 1 * 86400000).toISOString(),
    dosageInstruction: [{ text: 'Take 1 capsule three times daily for 7 days', doseAndRate: [{ doseQuantity: { value: 500, unit: 'mg' } }] }],
    dispenseRequest: { quantity: { value: 21, unit: 'capsules' } },
    ehrProviderId: 'ehr-practo-01',
  },
];

// ─── DDI Interaction Database (client-side mirror for demos) ─────────────────

export const INITIAL_DDI_INTERACTIONS: DdiInteraction[] = [
  { id: 'ddi-001', drug1Salt: 'Sildenafil', drug2Salt: 'Isosorbide Mononitrate', severity: 'CRITICAL_CONTRAINDICATION', patientSummary: 'These two medicines together can cause a dangerous drop in blood pressure that can be life-threatening.', clinicalMechanism: 'Sildenafil potentiates nitrate hypotensive effect via additive NO–cGMP pathway.', citation: 'FDA Drug Safety Communication 2014', recommendation: 'Absolute contraindication. Do not dispense if patient is on any nitrate therapy.', isAbsoluteContraindication: true, examplePairs: ['Viagra + Isordil', 'Sildenafil + GTN'] },
  { id: 'ddi-002', drug1Salt: 'Metformin HCl', drug2Salt: 'Iodinated Contrast Media', severity: 'MODERATE_INTERACTION', patientSummary: 'Your doctor may ask you to stop Metformin temporarily before an X-ray with contrast dye.', clinicalMechanism: 'Contrast-induced AKI reduces metformin clearance, increasing lactic acidosis risk.', citation: 'ACR Manual on Contrast Media 2023', recommendation: 'Hold metformin 48h before and after iodinated contrast.', isAbsoluteContraindication: false },
  { id: 'ddi-003', drug1Salt: 'Lisinopril', drug2Salt: 'Spironolactone', severity: 'MODERATE_INTERACTION', patientSummary: 'Both medicines can raise potassium in your blood. Your doctor will monitor this.', clinicalMechanism: 'ACE inhibitors + K+-sparing diuretics → hyperkalemia risk.', citation: 'Juurlink DN et al. N Engl J Med 2004', recommendation: 'Monitor serum potassium within 1 week.', isAbsoluteContraindication: false },
  { id: 'ddi-004', drug1Salt: 'Warfarin Sodium', drug2Salt: 'Ibuprofen', severity: 'MODERATE_INTERACTION', patientSummary: 'Ibuprofen raises your risk of bleeding when taken with your blood thinner. Use paracetamol instead.', clinicalMechanism: 'NSAIDs inhibit platelet COX-1 and displace warfarin from protein binding.', citation: 'Shorr RI et al. Arch Intern Med 1993', recommendation: 'Avoid concurrent use. Monitor INR closely.', isAbsoluteContraindication: false },
  { id: 'ddi-005', drug1Salt: 'Atorvastatin Calcium', drug2Salt: 'Clarithromycin', severity: 'MODERATE_INTERACTION', patientSummary: 'This antibiotic can increase your statin level in the blood, raising side effect risk.', clinicalMechanism: 'Clarithromycin (CYP3A4 inhibitor) increases atorvastatin AUC up to 4.5-fold.', citation: 'Jacobson TA. Am J Cardiol 2004', recommendation: 'Suspend atorvastatin during antibiotic course or switch statin.', isAbsoluteContraindication: false },
  { id: 'ddi-006', drug1Salt: 'Sertraline HCl', drug2Salt: 'Tramadol Hydrochloride', severity: 'CRITICAL_CONTRAINDICATION', patientSummary: 'Together these can cause serotonin syndrome — agitation, rapid heart rate, muscle stiffness. Seek emergency help.', clinicalMechanism: 'Combined serotonergic excess via SSRI + tramadol serotonin reuptake inhibition.', citation: 'Beakley BD et al. Curr Pharm Des 2015', recommendation: 'Avoid combination. Use alternative analgesic.', isAbsoluteContraindication: true, examplePairs: ['Zoloft + Ultram'] },
  { id: 'ddi-007', drug1Salt: 'Metformin HCl', drug2Salt: 'Alcohol (Ethanol)', severity: 'FOOD_RESTRICTION', patientSummary: 'Alcohol raises your risk of a rare but serious reaction with Metformin and can cause low blood sugar.', clinicalMechanism: 'Alcohol inhibits gluconeogenesis and potentiates metformin lactic acidosis risk.', citation: 'ADA Standards of Medical Care 2024', recommendation: 'Limit alcohol to ≤1 unit/day.', isAbsoluteContraindication: false },
  { id: 'ddi-008', drug1Salt: 'Atorvastatin Calcium', drug2Salt: 'Grapefruit Juice', severity: 'FOOD_RESTRICTION', patientSummary: 'Grapefruit juice increases statin levels in your blood. Avoid grapefruit while on this medicine.', clinicalMechanism: 'Furanocoumarins irreversibly inhibit intestinal CYP3A4, increasing statin AUC by up to 83%.', citation: 'Kane GC & Lipsky JJ. Mayo Clin Proc 2000', recommendation: 'Avoid grapefruit throughout therapy.', isAbsoluteContraindication: false },
  { id: 'ddi-009', drug1Salt: 'Amoxicillin Trihydrate', drug2Salt: 'Penicillin G', severity: 'MODERATE_INTERACTION', patientSummary: 'Both medicines work the same way — combining them adds no benefit and may increase allergy risk.', clinicalMechanism: 'Pharmacodynamic redundancy — both are beta-lactams; no additive bactericidal benefit.', citation: 'IDSA Antibiotic Stewardship Guidelines 2016', recommendation: 'Select one beta-lactam based on spectrum needed.', isAbsoluteContraindication: false },
  { id: 'ddi-010', drug1Salt: 'Levothyroxine Sodium', drug2Salt: 'Calcium Carbonate', severity: 'MONITORING_REQUIRED', patientSummary: 'Calcium supplements reduce absorption of your thyroid medicine. Take them at least 4 hours apart.', clinicalMechanism: 'Ca2+ forms insoluble complexes with levothyroxine at neutral pH, reducing absorption by ~40%.', citation: 'Schneyer CR. Ann Intern Med 1998', recommendation: 'Administer ≥4 hours apart. Monitor TSH.', isAbsoluteContraindication: false },
];

// ─── Manufacturers ────────────────────────────────────────────────────────────

export const INITIAL_MANUFACTURERS: ManufacturerProfile[] = [
  { id: 'mfr-cipla-01',    name: 'Cipla Limited',                        code: 'CIPLA',    country: 'India', headquarters: 'Mumbai, Maharashtra',  licenseNumber: 'CDSCO-MH-MFR-00291', licenseValidUntil: '2029-03-31', verificationStatus: 'Verified', certifiedMolecules: 1500, activeBatches: 284, gmpCertificate: 'WHO-GMP-CIPLA-2024-8821',    contactEmail: 'b2b@cipla.com'          },
  { id: 'mfr-sunpharma-01', name: 'Sun Pharmaceutical Industries',       code: 'SUNPHARMA', country: 'India', headquarters: 'Mumbai, Maharashtra',  licenseNumber: 'CDSCO-MH-MFR-00148', licenseValidUntil: '2028-12-31', verificationStatus: 'Verified', certifiedMolecules: 2100, activeBatches: 412, gmpCertificate: 'WHO-GMP-SUNPHARMA-2024-4410', contactEmail: 'wholesale@sunpharma.com' },
  { id: 'mfr-drreddys-01',  name: "Dr. Reddy's Laboratories",            code: 'DRREDDYS',  country: 'India', headquarters: 'Hyderabad, Telangana', licenseNumber: 'CDSCO-TG-MFR-00076', licenseValidUntil: '2030-06-30', verificationStatus: 'Verified', certifiedMolecules: 900,  activeBatches: 196, gmpCertificate: 'FDA-USGMP-DRL-2023-0192',   contactEmail: 'b2bsales@drreddys.com'  },
  { id: 'mfr-torrent-01',   name: 'Torrent Pharmaceuticals',             code: 'TORRENT',   country: 'India', headquarters: 'Ahmedabad, Gujarat',   licenseNumber: 'CDSCO-GJ-MFR-00318', licenseValidUntil: '2027-09-30', verificationStatus: 'Verified', certifiedMolecules: 640,  activeBatches: 108, gmpCertificate: 'WHO-GMP-TORRENT-2023-9201', contactEmail: 'wholesale@torrentpharma.com' },
  { id: 'mfr-lupin-01',     name: 'Lupin Limited',                       code: 'LUPIN',     country: 'India', headquarters: 'Mumbai, Maharashtra',  licenseNumber: 'CDSCO-MH-MFR-00221', licenseValidUntil: '2028-03-31', verificationStatus: 'Verified', certifiedMolecules: 780,  activeBatches: 167, gmpCertificate: 'FDA-USGMP-LUPIN-2024-0408',  contactEmail: 'b2b@lupin.com'          },
];

// ─── Wholesale Listings ───────────────────────────────────────────────────────

export const INITIAL_WHOLESALE_LISTINGS: WholesaleListing[] = [
  { id: 'wsl-001', manufacturerId: 'mfr-cipla-01',    manufacturerName: 'Cipla Limited',                 genericSalt: 'Atorvastatin Calcium', brandReference: 'Lipitor Generic',    dosageForm: 'Tablets', strength: '20mg',    availableUnits: 500000,  baseRetailPricePerUnit: 0.42, priceTiers: [{ minUnits: 100, maxUnits: 999,   pricePerUnit: 0.32, discountPercent: 24 }, { minUnits: 1000, maxUnits: 9999,  pricePerUnit: 0.22, discountPercent: 48 }, { minUnits: 10000, maxUnits: null, pricePerUnit: 0.14, discountPercent: 67 }], coaId: 'coa-001', coaStatus: 'Verified', batchNumber: 'CIPLA-AT-2026-8812', expiryDate: '2028-11-30', minimumOrderQuantity: 100, isActive: true, therapeuticCategory: 'Cardiovascular',    bioEquivalentRating: 'AB (Orange Book)' },
  { id: 'wsl-002', manufacturerId: 'mfr-sunpharma-01', manufacturerName: 'Sun Pharmaceutical Industries', genericSalt: 'Metformin HCl',        brandReference: 'Glucophage Generic', dosageForm: 'Tablets', strength: '500mg',   availableUnits: 1200000, baseRetailPricePerUnit: 0.14, priceTiers: [{ minUnits: 100, maxUnits: 999,   pricePerUnit: 0.10, discountPercent: 29 }, { minUnits: 1000, maxUnits: 9999,  pricePerUnit: 0.07, discountPercent: 50 }, { minUnits: 10000, maxUnits: null, pricePerUnit: 0.04, discountPercent: 71 }], coaId: 'coa-002', coaStatus: 'Verified', batchNumber: 'SUN-MF-2026-9021',   expiryDate: '2029-03-31', minimumOrderQuantity: 100, isActive: true, therapeuticCategory: 'Anti-Diabetic',     bioEquivalentRating: 'AB (Orange Book)' },
  { id: 'wsl-003', manufacturerId: 'mfr-drreddys-01',  manufacturerName: "Dr. Reddy's Laboratories",     genericSalt: 'Amoxicillin Trihydrate', brandReference: 'Amoxil Generic',    dosageForm: 'Capsules', strength: '500mg',  availableUnits: 800000,  baseRetailPricePerUnit: 0.28, priceTiers: [{ minUnits: 100, maxUnits: 999,   pricePerUnit: 0.22, discountPercent: 21 }, { minUnits: 1000, maxUnits: 9999,  pricePerUnit: 0.15, discountPercent: 46 }, { minUnits: 10000, maxUnits: null, pricePerUnit: 0.09, discountPercent: 68 }], coaId: 'coa-003', coaStatus: 'Verified', batchNumber: 'DRL-AMX-2026-1192', expiryDate: '2027-08-31', minimumOrderQuantity: 100, isActive: true, therapeuticCategory: 'Antibiotics',       bioEquivalentRating: 'AB (Orange Book)' },
  { id: 'wsl-004', manufacturerId: 'mfr-torrent-01',   manufacturerName: 'Torrent Pharmaceuticals',      genericSalt: 'Sertraline HCl',       brandReference: 'Zoloft Generic',     dosageForm: 'Tablets', strength: '50mg',    availableUnits: 300000,  baseRetailPricePerUnit: 0.52, priceTiers: [{ minUnits: 100, maxUnits: 999,   pricePerUnit: 0.40, discountPercent: 23 }, { minUnits: 1000, maxUnits: 9999,  pricePerUnit: 0.28, discountPercent: 46 }, { minUnits: 10000, maxUnits: null, pricePerUnit: 0.18, discountPercent: 65 }], coaId: 'coa-004', coaStatus: 'Verified', batchNumber: 'TOR-SR-2026-4418',  expiryDate: '2028-06-30', minimumOrderQuantity: 100, isActive: true, therapeuticCategory: 'Neuropsychiatric',  bioEquivalentRating: 'AB (Orange Book)' },
  { id: 'wsl-005', manufacturerId: 'mfr-lupin-01',     manufacturerName: 'Lupin Limited',                genericSalt: 'Levothyroxine Sodium', brandReference: 'Synthroid Generic',  dosageForm: 'Tablets', strength: '100mcg',  availableUnits: 950000,  baseRetailPricePerUnit: 0.24, priceTiers: [{ minUnits: 100, maxUnits: 999,   pricePerUnit: 0.19, discountPercent: 21 }, { minUnits: 1000, maxUnits: 9999,  pricePerUnit: 0.13, discountPercent: 46 }, { minUnits: 10000, maxUnits: null, pricePerUnit: 0.08, discountPercent: 67 }], coaId: 'coa-005', coaStatus: 'Verified', batchNumber: 'LUP-LEV-2026-5590', expiryDate: '2028-09-30', minimumOrderQuantity: 100, isActive: true, therapeuticCategory: 'Endocrinology',     bioEquivalentRating: 'AB (Orange Book)' },
];

// ─── Certificates of Analysis ─────────────────────────────────────────────────

export const INITIAL_COA_RECORDS: CertificateOfAnalysis[] = [
  { id: 'coa-001', listingId: 'wsl-001', batchNumber: 'CIPLA-AT-2026-8812', manufacturerId: 'mfr-cipla-01',    testedOn: '2026-01-15', expiresOn: '2028-01-15', documentUrl: '/secure/coa/coa-001.pdf', status: 'Verified', purityPercent: 99.8, stabilityTestPassed: true,  testingLaboratory: 'Cytodiagnostix Inc.',    verifiedByPlatformAt: '2026-01-20T09:00:00Z' },
  { id: 'coa-002', listingId: 'wsl-002', batchNumber: 'SUN-MF-2026-9021',   manufacturerId: 'mfr-sunpharma-01', testedOn: '2026-02-10', expiresOn: '2029-02-10', documentUrl: '/secure/coa/coa-002.pdf', status: 'Verified', purityPercent: 99.9, stabilityTestPassed: true,  testingLaboratory: 'Spectrochem Labs',       verifiedByPlatformAt: '2026-02-14T11:30:00Z' },
  { id: 'coa-003', listingId: 'wsl-003', batchNumber: 'DRL-AMX-2026-1192',  manufacturerId: 'mfr-drreddys-01',  testedOn: '2026-03-05', expiresOn: '2027-03-05', documentUrl: '/secure/coa/coa-003.pdf', status: 'Verified', purityPercent: 99.6, stabilityTestPassed: true,  testingLaboratory: 'Vimta Labs Limited',     verifiedByPlatformAt: '2026-03-08T08:45:00Z' },
  { id: 'coa-004', listingId: 'wsl-004', batchNumber: 'TOR-SR-2026-4418',   manufacturerId: 'mfr-torrent-01',   testedOn: '2026-01-28', expiresOn: '2028-01-28', documentUrl: '/secure/coa/coa-004.pdf', status: 'Verified', purityPercent: 99.7, stabilityTestPassed: true,  testingLaboratory: 'Anthem Biosciences',     verifiedByPlatformAt: '2026-02-01T14:00:00Z' },
  { id: 'coa-005', listingId: 'wsl-005', batchNumber: 'LUP-LEV-2026-5590',  manufacturerId: 'mfr-lupin-01',     testedOn: '2026-04-01', expiresOn: '2028-04-01', documentUrl: '/secure/coa/coa-005.pdf', status: 'Verified', purityPercent: 99.9, stabilityTestPassed: true,  testingLaboratory: 'Analytical Lab Group',   verifiedByPlatformAt: '2026-04-05T10:15:00Z' },
];

// ─── B2B Orders (sample) ─────────────────────────────────────────────────────

export const INITIAL_B2B_ORDERS: B2bOrder[] = [
  { id: 'b2b-001', orderNumber: 'B2B-881042', buyerTenantId: 'TNT-3109', buyerTenantName: 'Apollo Pharmacy Chain',    manufacturerId: 'mfr-cipla-01',    manufacturerName: 'Cipla Limited',             listingId: 'wsl-001', genericSalt: 'Atorvastatin Calcium', quantity: 50000,  pricePerUnit: 0.14, orderTotal: 7000,   discountPercent: 67, creditTermDays: 30, coaVerified: true, status: 'Delivered',    placedAt: new Date(Date.now() - 45 * 86400000).toISOString(), deliveryEta: new Date(Date.now() - 24 * 86400000).toISOString(), paymentDueDate: new Date(Date.now() + 15 * 86400000).toISOString() },
  { id: 'b2b-002', orderNumber: 'B2B-881043', buyerTenantId: 'TNT-8492', buyerTenantName: 'CarePoint Healthcare Inc', manufacturerId: 'mfr-sunpharma-01', manufacturerName: 'Sun Pharmaceutical Industries', listingId: 'wsl-002', genericSalt: 'Metformin HCl',        quantity: 20000,  pricePerUnit: 0.07, orderTotal: 1400,   discountPercent: 50, creditTermDays: 30, coaVerified: true, status: 'Confirmed',    placedAt: new Date(Date.now() -  5 * 86400000).toISOString(), deliveryEta: new Date(Date.now() + 16 * 86400000).toISOString(), paymentDueDate: new Date(Date.now() + 35 * 86400000).toISOString() },
  { id: 'b2b-003', orderNumber: 'B2B-881044', buyerTenantId: 'TNT-5021', buyerTenantName: 'HealthKart Generic Direct', manufacturerId: 'mfr-drreddys-01',  manufacturerName: "Dr. Reddy's Laboratories",   listingId: 'wsl-003', genericSalt: 'Amoxicillin Trihydrate', quantity: 5000, pricePerUnit: 0.15, orderTotal: 750,    discountPercent: 46, creditTermDays: 60, coaVerified: true, status: 'In Production', placedAt: new Date(Date.now() - 10 * 86400000).toISOString(), deliveryEta: new Date(Date.now() + 11 * 86400000).toISOString(), paymentDueDate: new Date(Date.now() + 70 * 86400000).toISOString() },
];

// ─── B2B Credit Accounts ─────────────────────────────────────────────────────

export const INITIAL_B2B_CREDIT_ACCOUNTS: B2bCreditAccount[] = [
  { tenantId: 'TNT-3109', tenantName: 'Apollo Pharmacy Chain',      creditLimitUsd: 500000, utilisedCreditUsd: 182400, availableCreditUsd: 317600, defaultCreditTermDays: 30, outstandingInvoices: 3, creditRating: 'A+', lastReviewedAt: '2026-08-01T00:00:00Z' },
  { tenantId: 'TNT-8492', tenantName: 'CarePoint Healthcare Inc',   creditLimitUsd: 250000, utilisedCreditUsd: 44800,  availableCreditUsd: 205200, defaultCreditTermDays: 30, outstandingInvoices: 1, creditRating: 'A',  lastReviewedAt: '2026-08-15T00:00:00Z' },
  { tenantId: 'TNT-5021', tenantName: 'HealthKart Generic Direct',  creditLimitUsd: 150000, utilisedCreditUsd: 91200,  availableCreditUsd: 58800,  defaultCreditTermDays: 60, outstandingInvoices: 2, creditRating: 'B+', lastReviewedAt: '2026-07-20T00:00:00Z' },
  { tenantId: 'TNT-1194', tenantName: 'SunMed Drugstores',          creditLimitUsd: 100000, utilisedCreditUsd: 12000,  availableCreditUsd: 88000,  defaultCreditTermDays: 30, outstandingInvoices: 1, creditRating: 'B',  lastReviewedAt: '2026-08-10T00:00:00Z' },
];
