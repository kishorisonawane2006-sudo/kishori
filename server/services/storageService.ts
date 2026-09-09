import {
  TenantOrganization,
  MedicineListing,
  PlatformOrder,
  CartItem,
  UserProfile
} from '../../src/types';
import {
  INITIAL_TENANTS,
  INITIAL_ORDERS,
  INITIAL_LISTINGS,
  INITIAL_CART
} from '../../src/data/initialData';
import { INITIAL_USER } from '../../src/data/userData';

export interface PrescribingAuditRecord {
  id: string;
  orderId?: string;
  rxNumber: string;
  doctorName: string;
  doctorRegistrationNumber: string;
  patientName: string;
  issueDate: string;
  extractedSalts: string[];
  pharmacistLicenseNumber?: string;
  pharmacistName?: string;
  auditDecision: 'PENDING' | 'APPROVED' | 'REJECTED_EXPIRED' | 'REJECTED_ILLEGIBLE' | 'DOSAGE_MISMATCH';
  notes?: string;
  auditTimestamp?: string;
}

export interface ColdChainTelemetryPacket {
  id: string;
  orderId: string;
  sensorId: string;
  temperatureCelsius: number;
  latitude: number;
  longitude: number;
  batteryPercent: number;
  isBreached: boolean;
  timestamp: string;
}

/**
 * In-Memory Transactional Storage Engine
 * Segregates platform-wide master catalogs and tenant schemas (tnt_apollo_01, etc.)
 */
class StorageService {
  private tenants: Map<string, TenantOrganization> = new Map();
  private tenantListings: Map<string, MedicineListing[]> = new Map(); // tenantCode -> listings
  private globalListings: MedicineListing[] = [];
  private orders: Map<string, PlatformOrder> = new Map();
  private userProfiles: Map<string, UserProfile> = new Map();
  private auditRecords: Map<string, PrescribingAuditRecord> = new Map();
  private telemetryLogs: ColdChainTelemetryPacket[] = [];
  private cart: CartItem[] = [];

  constructor() {
    this.seed();
  }

  public seed(): void {
    // Seed Tenants
    INITIAL_TENANTS.forEach(tenant => {
      const codeKey = tenant.code.toLowerCase();
      const idKey = tenant.id.toLowerCase();
      const nameKey = tenant.name.toLowerCase().split(' ')[0]; // e.g. apollo, carepoint

      this.tenants.set(codeKey, { ...tenant });
      this.tenants.set(idKey, { ...tenant });
      this.tenants.set(nameKey, { ...tenant });
      this.tenantListings.set(codeKey, []);
      this.tenantListings.set(nameKey, []);
    });

    // Seed Listings
    this.globalListings = INITIAL_LISTINGS.map(l => ({ ...l }));
    // Partition listings to primary tenant apollo initially
    this.tenantListings.set('ap', this.globalListings.map(l => ({ ...l })));
    this.tenantListings.set('apollo', this.globalListings.map(l => ({ ...l })));

    // Seed Orders
    INITIAL_ORDERS.forEach(order => {
      this.orders.set(order.id, { ...order });
    });

    // Seed Default User
    this.userProfiles.set(INITIAL_USER.id, { ...INITIAL_USER });

    // Seed Initial Cart
    this.cart = INITIAL_CART.map(item => ({ ...item }));

    // Seed Initial Telemetry
    this.telemetryLogs.push({
      id: 'tel-001',
      orderId: 'ord-01',
      sensorId: 'BLE-SNSR-892',
      temperatureCelsius: 4.2,
      latitude: 40.7128,
      longitude: -74.0060,
      batteryPercent: 94,
      isBreached: false,
      timestamp: new Date().toISOString()
    });
  }

  // --- Tenants ---
  public getTenants(): TenantOrganization[] {
    return Array.from(this.tenants.values());
  }

  public getTenant(code: string): TenantOrganization | undefined {
    return this.tenants.get(code.toLowerCase());
  }

  public updateTenant(code: string, updates: Partial<TenantOrganization>): TenantOrganization | null {
    const existing = this.tenants.get(code.toLowerCase());
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.tenants.set(code.toLowerCase(), updated);
    return updated;
  }

  // --- Listings (Multi-Tenant Schema Aware) ---
  public getListings(tenantCode?: string): MedicineListing[] {
    if (tenantCode) {
      const code = tenantCode.toLowerCase();
      return this.tenantListings.get(code) || [];
    }
    return this.globalListings;
  }

  public getListingById(id: string): MedicineListing | undefined {
    return this.globalListings.find(l => l.id === id);
  }

  public updateListing(id: string, updates: Partial<MedicineListing>, tenantCode?: string): MedicineListing | null {
    const globalIdx = this.globalListings.findIndex(l => l.id === id);
    if (globalIdx === -1) return null;

    const updated = { ...this.globalListings[globalIdx], ...updates };
    this.globalListings[globalIdx] = updated;

    if (tenantCode) {
      const code = tenantCode.toLowerCase();
      const list = this.tenantListings.get(code) || [];
      const idx = list.findIndex(l => l.id === id);
      if (idx !== -1) {
        list[idx] = updated;
        this.tenantListings.set(code, list);
      }
    }
    return updated;
  }

  // --- Orders ---
  public getOrders(tenantName?: string): PlatformOrder[] {
    const all = Array.from(this.orders.values());
    if (tenantName) {
      return all.filter(o => o.tenantStoreName.toLowerCase().includes(tenantName.toLowerCase()));
    }
    return all;
  }

  public getOrderById(id: string): PlatformOrder | undefined {
    return this.orders.get(id);
  }

  public saveOrder(order: PlatformOrder): PlatformOrder {
    this.orders.set(order.id, order);
    return order;
  }

  public updateOrderStatus(id: string, status: PlatformOrder['status']): PlatformOrder | null {
    const order = this.orders.get(id);
    if (!order) return null;
    order.status = status;
    this.orders.set(id, order);
    return order;
  }

  // --- Prescriptions & Pharmacist Audit ---
  public saveAuditRecord(record: PrescribingAuditRecord): PrescribingAuditRecord {
    this.auditRecords.set(record.id, record);
    return record;
  }

  public getAuditRecord(id: string): PrescribingAuditRecord | undefined {
    return this.auditRecords.get(id);
  }

  public getAllAuditRecords(): PrescribingAuditRecord[] {
    return Array.from(this.auditRecords.values());
  }

  // --- Telemetry ---
  public addTelemetry(packet: ColdChainTelemetryPacket): void {
    this.telemetryLogs.push(packet);
  }

  public getTelemetryForOrder(orderId: string): ColdChainTelemetryPacket[] {
    return this.telemetryLogs.filter(t => t.orderId === orderId);
  }

  public getLatestTelemetry(orderId: string): ColdChainTelemetryPacket | undefined {
    const list = this.getTelemetryForOrder(orderId);
    return list[list.length - 1];
  }

  // --- Cart ---
  public getCart(): CartItem[] {
    return [...this.cart];
  }

  public setCart(items: CartItem[]): void {
    this.cart = [...items];
  }

  // --- Users ---
  public getUserProfile(id: string): UserProfile | undefined {
    return this.userProfiles.get(id);
  }

  public saveUserProfile(user: UserProfile): UserProfile {
    this.userProfiles.set(user.id, user);
    return user;
  }
}

export const storage = new StorageService();
