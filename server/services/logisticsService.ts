import { storage } from './storageService';
import {
  CarrierType,
  CarrierProfile,
  CarrierStatus,
  ShipmentDispatch,
  ShipmentEventStatus,
  CourierWebhookEvent,
  WaybillDocument,
  AutoDispatchResult,
  RiderProfile,
  DeliveryStop,
  OtpVerification,
  ProofOfDelivery,
} from '../../src/types';

// ─── Carrier Registry ─────────────────────────────────────────────────────────

const CARRIER_REGISTRY: CarrierProfile[] = [
  {
    id: 'carrier-dunzo-01',
    type: 'Dunzo',
    displayName: 'Dunzo On-Demand Healthcare',
    avgDeliveryMins: 75,
    supportsColdChain: true,
    coverageZone: 'Urban Metro (5-mile radius)',
    status: 'available',
    baseCostUsd: 3.50,
    activeShipments: 0,
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
    activeShipments: 0,
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

// ─── In-Memory Dispatch & Rider Storage ──────────────────────────────────────

const dispatches = new Map<string, ShipmentDispatch>();
const riders = new Map<string, RiderProfile>();
const otpRecords = new Map<string, OtpVerification>();
const podRecords = new Map<string, ProofOfDelivery>();

/** Seed initial riders */
function seedRiders(): void {
  const initialRiders: RiderProfile[] = [
    {
      id: 'rider-001',
      fullName: 'Carlos Mendez',
      phone: '+1 (718) 555-0192',
      vehicleType: 'Van (Cold-Chain)',
      vehicleNumber: 'NY-CMED-084',
      carrierType: 'Dunzo',
      status: 'on_route',
      currentLatitude: 40.6892,
      currentLongitude: -74.0445,
      currentAddress: 'Brooklyn Bridge Park, Brooklyn NY',
      activeShipmentIds: [],
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
      status: 'delivering',
      currentLatitude: 40.7282,
      currentLongitude: -73.7949,
      currentAddress: 'Jamaica, Queens NY',
      activeShipmentIds: [],
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
      status: 'available',
      currentLatitude: 40.7580,
      currentLongitude: -73.9855,
      currentAddress: 'Times Square, Manhattan NY',
      activeShipmentIds: [],
      batteryPercent: 95,
      totalDeliveriesToday: 4,
      rating: 4.8,
    },
  ];
  initialRiders.forEach(r => riders.set(r.id, r));
}

seedRiders();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateWaybillNumber(): string {
  const prefix = 'GMS';
  const ts = Date.now().toString().slice(-8);
  const rand = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${ts}-${rand}`;
}

function generateBarcode(waybillNumber: string): string {
  return `128:${waybillNumber.replace(/-/g, '')}`;
}

function selectCarrier(isColdChain: boolean, distanceMiles: number): CarrierProfile {
  const available = CARRIER_REGISTRY.filter(c => c.status !== 'offline');

  // Cold-chain shipments must use a cold-chain-capable carrier
  const eligible = isColdChain
    ? available.filter(c => c.supportsColdChain)
    : available;

  // For short distances (<= 10 miles) prefer Dunzo for speed
  if (distanceMiles <= 10) {
    const dunzo = eligible.find(c => c.type === 'Dunzo');
    if (dunzo) return dunzo;
  }

  // For medium distances (<= 50 miles) use Shadowfax if not cold-chain
  if (distanceMiles <= 50 && !isColdChain) {
    const shadowfax = eligible.find(c => c.type === 'Shadowfax');
    if (shadowfax) return shadowfax;
  }

  // Fallback: FedEx for long-haul or when others are unavailable
  const fedex = eligible.find(c => c.type === 'FedEx Healthcare Express');
  if (fedex) return fedex;

  // Last resort: first available
  return eligible[0] ?? CARRIER_REGISTRY[0];
}

function assignRider(carrierType: CarrierType): RiderProfile | undefined {
  return Array.from(riders.values()).find(
    r => r.carrierType === carrierType && (r.status === 'available' || r.status === 'on_route')
  );
}

// ─── Logistics Service ────────────────────────────────────────────────────────

export class LogisticsService {
  /**
   * Workstream 2.1 — Auto-Dispatch:
   * Triggered automatically upon pharmacist digital sign-off (ADR-005).
   * Selects best carrier, generates waybill, creates dispatch record.
   * Target SLA: complete within 180 seconds of sign-off (Phase 2 Quality Gate 1).
   */
  public autoDispatch(
    orderId: string,
    customerName: string,
    customerAddress: string,
    pickupAddress: string,
    distanceMiles: number,
    isColdChain: boolean,
    packageDescription: string
  ): AutoDispatchResult {
    const startMs = performance.now();

    const carrier = selectCarrier(isColdChain, distanceMiles);
    const rider = assignRider(carrier.type);

    const waybillNumber = generateWaybillNumber();
    const barcodeData = generateBarcode(waybillNumber);
    const now = new Date();
    const etaMs = now.getTime() + carrier.avgDeliveryMins * 60 * 1000;

    const waybill: WaybillDocument = {
      waybillNumber,
      barcodeData,
      orderId,
      orderNumber: orderId.toUpperCase(),
      carrierName: carrier.displayName,
      senderName: 'Generic Medicine Store Fulfillment Center',
      senderAddress: pickupAddress,
      recipientName: customerName,
      recipientAddress: customerAddress,
      recipientPhone: '+1 (•••) •••-0000',
      packageDescription,
      weightKg: 0.4,
      isColdChain,
      temperatureRange: isColdChain ? '2°C – 8°C (GDP Compliant)' : 'Ambient',
      generatedAt: now.toISOString(),
      regulatoryDeclaration:
        'This shipment contains Schedule H prescription medicines dispensed under a verified pharmacist license. ' +
        'Handle with care. Temperature excursions must be reported immediately. ' +
        'Compliance: FDA 21 CFR Part 211 / CDSCO Good Distribution Practice.',
    };

    const dispatchId = `disp-${Date.now().toString().slice(-6)}`;
    const dispatch: ShipmentDispatch = {
      id: dispatchId,
      orderId,
      orderNumber: orderId.toUpperCase(),
      carrierId: carrier.id,
      carrierType: carrier.type,
      waybillNumber,
      barcodeData,
      assignedRiderId: rider?.id,
      assignedRiderName: rider?.fullName,
      pickupAddress,
      deliveryAddress: customerAddress,
      distanceMiles,
      isColdChain,
      dispatchedAt: now.toISOString(),
      estimatedDeliveryAt: new Date(etaMs).toISOString(),
      currentStatus: 'ASSIGNED',
      events: [
        {
          id: `evt-${Date.now()}`,
          shipmentId: dispatchId,
          status: 'ASSIGNED',
          timestamp: now.toISOString(),
          riderNote: `Assigned to ${rider?.fullName ?? carrier.displayName}`,
        },
      ],
      manifestUrl: `/api/v2/logistics/waybill/${waybillNumber}`,
    };

    dispatches.set(dispatchId, dispatch);
    carrier.activeShipments += 1;

    // Attach dispatch to rider
    if (rider) {
      rider.activeShipmentIds.push(dispatchId);
      rider.status = 'at_pickup';
      riders.set(rider.id, rider);
    }

    // Update order status to Cold-Chain Packaged if applicable
    storage.updateOrderStatus(orderId, isColdChain ? 'Cold-Chain Packaged' : 'Dispensing');

    const dispatchLatencyMs = +(performance.now() - startMs).toFixed(2);

    return { success: true, orderId, selectedCarrier: carrier.type, dispatch, waybill, dispatchLatencyMs };
  }

  /**
   * Carrier webhook event ingestion — advances shipment lifecycle.
   */
  public ingestWebhookEvent(
    shipmentId: string,
    status: ShipmentEventStatus,
    latitude?: number,
    longitude?: number,
    riderNote?: string,
    otpVerified?: boolean
  ): ShipmentDispatch {
    const dispatch = dispatches.get(shipmentId);
    if (!dispatch) throw new Error(`Shipment ${shipmentId} not found`);

    const event: CourierWebhookEvent = {
      id: `evt-${Date.now()}`,
      shipmentId,
      status,
      timestamp: new Date().toISOString(),
      latitude,
      longitude,
      riderNote,
      otpVerified,
    };

    dispatch.currentStatus = status;
    dispatch.events.push(event);

    // Map carrier status to order status
    const orderStatusMap: Partial<Record<ShipmentEventStatus, string>> = {
      PICKED_UP: 'In-Transit',
      OUT_FOR_DELIVERY: 'Out for Delivery',
      DELIVERED: 'Fulfilled',
      RETURNED_TO_PHARMACY: 'Awaiting Pickup',
    };
    const orderStatus = orderStatusMap[status];
    if (orderStatus) {
      storage.updateOrderStatus(dispatch.orderId, orderStatus as Parameters<typeof storage.updateOrderStatus>[1]);
    }

    if (status === 'DELIVERED') {
      dispatch.deliveredAt = new Date().toISOString();
    }

    dispatches.set(shipmentId, dispatch);
    return dispatch;
  }

  /**
   * Generates a standalone waybill for an existing dispatch.
   */
  public getWaybill(waybillNumber: string): WaybillDocument | null {
    const dispatch = Array.from(dispatches.values()).find(d => d.waybillNumber === waybillNumber);
    if (!dispatch) return null;

    return {
      waybillNumber: dispatch.waybillNumber,
      barcodeData: dispatch.barcodeData,
      orderId: dispatch.orderId,
      orderNumber: dispatch.orderNumber,
      carrierName: dispatch.carrierType,
      senderName: 'Generic Medicine Store Fulfillment Center',
      senderAddress: dispatch.pickupAddress,
      recipientName: 'Patient',
      recipientAddress: dispatch.deliveryAddress,
      recipientPhone: '+1 (•••) •••-0000',
      packageDescription: 'Prescription Medication',
      weightKg: 0.4,
      isColdChain: dispatch.isColdChain,
      temperatureRange: dispatch.isColdChain ? '2°C – 8°C (GDP)' : 'Ambient',
      generatedAt: dispatch.dispatchedAt,
      regulatoryDeclaration:
        'FDA 21 CFR Part 211 / CDSCO GDP. Prescription medicines — handle with care.',
    };
  }

  /** Returns all dispatches, optionally filtered by carrier type */
  public getDispatches(carrierType?: CarrierType): ShipmentDispatch[] {
    const all = Array.from(dispatches.values());
    return carrierType ? all.filter(d => d.carrierType === carrierType) : all;
  }

  public getDispatch(id: string): ShipmentDispatch | undefined {
    return dispatches.get(id);
  }

  public getCarriers(): CarrierProfile[] {
    return CARRIER_REGISTRY;
  }

  public getCarrier(id: string): CarrierProfile | undefined {
    return CARRIER_REGISTRY.find(c => c.id === id);
  }

  /** Carrier failover: marks a carrier offline and re-assigns its active shipments */
  public failoverCarrier(carrierId: string): { reassigned: number; fallbackCarrier: CarrierType } {
    const carrier = CARRIER_REGISTRY.find(c => c.id === carrierId);
    if (!carrier) throw new Error(`Carrier ${carrierId} not found`);

    carrier.status = 'offline';
    const affected = Array.from(dispatches.values()).filter(
      d => d.carrierId === carrierId && d.currentStatus !== 'DELIVERED'
    );

    const fallbackCarrier = CARRIER_REGISTRY.find(
      c => c.id !== carrierId && c.status !== 'offline' && (carrier.supportsColdChain ? c.supportsColdChain : true)
    );

    if (fallbackCarrier) {
      affected.forEach(d => {
        d.carrierId = fallbackCarrier.id;
        d.carrierType = fallbackCarrier.type;
        d.events.push({
          id: `evt-failover-${Date.now()}`,
          shipmentId: d.id,
          status: d.currentStatus,
          timestamp: new Date().toISOString(),
          riderNote: `Carrier failover: reassigned from ${carrier.type} to ${fallbackCarrier.type}`,
        });
        dispatches.set(d.id, d);
      });
    }

    return { reassigned: affected.length, fallbackCarrier: fallbackCarrier?.type ?? 'FedEx Healthcare Express' };
  }

  // ─── Riders ────────────────────────────────────────────────────────────────

  public getRiders(): RiderProfile[] {
    return Array.from(riders.values());
  }

  public getRider(id: string): RiderProfile | undefined {
    return riders.get(id);
  }

  public updateRiderLocation(id: string, lat: number, lng: number, address: string): RiderProfile {
    const rider = riders.get(id);
    if (!rider) throw new Error(`Rider ${id} not found`);
    rider.currentLatitude = lat;
    rider.currentLongitude = lng;
    rider.currentAddress = address;
    riders.set(id, rider);
    return rider;
  }

  public getDeliveryStopsForRider(riderId: string): DeliveryStop[] {
    const rider = riders.get(riderId);
    if (!rider) return [];

    return rider.activeShipmentIds.map(shipId => {
      const dispatch = dispatches.get(shipId);
      const order = dispatch ? storage.getOrderById(dispatch.orderId) : undefined;
      return {
        shipmentId: shipId,
        orderId: dispatch?.orderId ?? '',
        orderNumber: dispatch?.orderNumber ?? '',
        address: dispatch?.deliveryAddress ?? 'Unknown address',
        recipientName: order?.customerName ?? 'Patient',
        recipientPhone: '+1 (•••) •••-0000',
        distanceMiles: dispatch?.distanceMiles ?? 0,
        estimatedMins: dispatch ? Math.round(dispatch.distanceMiles * 6) : 30,
        requiresOtp: true,
        requiresPod: true,
        isColdChain: dispatch?.isColdChain ?? false,
        status: dispatch?.currentStatus ?? 'ASSIGNED',
      };
    });
  }

  // ─── OTP & POD ─────────────────────────────────────────────────────────────

  public verifyOtp(shipmentId: string, otpCode: string, riderId: string): boolean {
    // In production: validate against a time-based OTP sent to the patient
    const valid = otpCode.length === 4 && /^\d{4}$/.test(otpCode);
    if (valid) {
      otpRecords.set(shipmentId, { shipmentId, otpCode, verifiedAt: new Date().toISOString(), verifiedByRiderId: riderId });
    }
    return valid;
  }

  public submitProofOfDelivery(pod: ProofOfDelivery): void {
    podRecords.set(pod.shipmentId, pod);
    this.ingestWebhookEvent(pod.shipmentId, 'DELIVERED', pod.latitude, pod.longitude, 'POD captured', true);
  }

  public getPod(shipmentId: string): ProofOfDelivery | undefined {
    return podRecords.get(shipmentId);
  }
}

export const logisticsService = new LogisticsService();
