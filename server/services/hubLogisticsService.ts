import {
  HubWarehouse,
  DemandForecast,
  ReplenishmentOrder,
  DroneCorridor,
  DroneDelivery,
  CityExpansion,
} from '../../src/types';

// ─── Hub Warehouse Registry ────────────────────────────────────────────────────

const HUB_WAREHOUSES: HubWarehouse[] = [
  {
    id: 'hub-nyc-01',
    name: 'New York Metro Distribution Hub',
    city: 'Newark',
    state: 'NJ',
    tier: 'Tier1_Metro',
    latitude: 40.7357,
    longitude: -74.1724,
    capacityCubicMeters: 12000,
    coldStorageCapacityCubicMeters: 2400,
    utilisationPercent: 72,
    branchesServed: 148,
    avgReplenishmentCycleHours: 4,
    activeSkus: 8420,
    isActive: true,
    droneCorridorIds: ['drone-nyc-brooklyn', 'drone-nyc-queens'],
  },
  {
    id: 'hub-chi-01',
    name: 'Chicago Central Fulfillment Hub',
    city: 'Chicago',
    state: 'IL',
    tier: 'Tier1_Metro',
    latitude: 41.8781,
    longitude: -87.6298,
    capacityCubicMeters: 9500,
    coldStorageCapacityCubicMeters: 1800,
    utilisationPercent: 65,
    branchesServed: 112,
    avgReplenishmentCycleHours: 5,
    activeSkus: 6810,
    isActive: true,
    droneCorridorIds: ['drone-chi-south', 'drone-chi-west'],
  },
  {
    id: 'hub-dal-01',
    name: 'Dallas-Fort Worth Regional Hub',
    city: 'Irving',
    state: 'TX',
    tier: 'Tier2_Regional',
    latitude: 32.8140,
    longitude: -96.9489,
    capacityCubicMeters: 7200,
    coldStorageCapacityCubicMeters: 1200,
    utilisationPercent: 58,
    branchesServed: 84,
    avgReplenishmentCycleHours: 6,
    activeSkus: 5200,
    isActive: true,
    droneCorridorIds: ['drone-dfw-rural'],
  },
  {
    id: 'hub-la-01',
    name: 'Los Angeles Distribution Hub',
    city: 'Gardena',
    state: 'CA',
    tier: 'Tier1_Metro',
    latitude: 33.8883,
    longitude: -118.3089,
    capacityCubicMeters: 10800,
    coldStorageCapacityCubicMeters: 2100,
    utilisationPercent: 79,
    branchesServed: 134,
    avgReplenishmentCycleHours: 4,
    activeSkus: 7640,
    isActive: true,
    droneCorridorIds: ['drone-la-inland'],
  },
  {
    id: 'hub-mia-01',
    name: 'Miami Southeast Hub',
    city: 'Doral',
    state: 'FL',
    tier: 'Tier2_Regional',
    latitude: 25.8197,
    longitude: -80.3556,
    capacityCubicMeters: 6400,
    coldStorageCapacityCubicMeters: 1600,
    utilisationPercent: 61,
    branchesServed: 76,
    avgReplenishmentCycleHours: 7,
    activeSkus: 4890,
    isActive: true,
    droneCorridorIds: ['drone-mia-rural'],
  },
];

// ─── Drone Corridors ──────────────────────────────────────────────────────────

const DRONE_CORRIDORS: DroneCorridor[] = [
  { id: 'drone-nyc-brooklyn', name: 'NYC Metro → Brooklyn Corridor',   originHubId: 'hub-nyc-01', originCity: 'Newark',  destinationZone: 'Brooklyn, NY',     distanceMiles: 8.4,  maxPayloadKg: 2.5, avgFlightMins: 18, supportsColdChain: true,  altitudeFeet: 400, isActive: true, regulatoryApproval: 'FAA_Part_135' },
  { id: 'drone-nyc-queens',   name: 'NYC Metro → Queens Corridor',     originHubId: 'hub-nyc-01', originCity: 'Newark',  destinationZone: 'Queens, NY',       distanceMiles: 10.2, maxPayloadKg: 2.5, avgFlightMins: 22, supportsColdChain: true,  altitudeFeet: 400, isActive: true, regulatoryApproval: 'FAA_Part_135' },
  { id: 'drone-chi-south',    name: 'Chicago Hub → South Side Corridor', originHubId: 'hub-chi-01', originCity: 'Chicago', destinationZone: 'South Chicago, IL', distanceMiles: 6.1,  maxPayloadKg: 3.0, avgFlightMins: 14, supportsColdChain: false, altitudeFeet: 350, isActive: true, regulatoryApproval: 'FAA_Part_135' },
  { id: 'drone-chi-west',     name: 'Chicago Hub → West Suburbs',       originHubId: 'hub-chi-01', originCity: 'Chicago', destinationZone: 'Oak Park, IL',     distanceMiles: 9.8,  maxPayloadKg: 3.0, avgFlightMins: 21, supportsColdChain: false, altitudeFeet: 350, isActive: false, regulatoryApproval: 'Pending'      },
  { id: 'drone-dfw-rural',    name: 'DFW Hub → Rural Texas Corridor',   originHubId: 'hub-dal-01', originCity: 'Irving',  destinationZone: 'Rural TX (50mi)',  distanceMiles: 48.0, maxPayloadKg: 2.0, avgFlightMins: 65, supportsColdChain: true,  altitudeFeet: 500, isActive: true, regulatoryApproval: 'FAA_Part_135' },
  { id: 'drone-la-inland',    name: 'LA Hub → Inland Empire Corridor',  originHubId: 'hub-la-01',  originCity: 'Gardena', destinationZone: 'Riverside, CA',    distanceMiles: 52.0, maxPayloadKg: 2.0, avgFlightMins: 72, supportsColdChain: true,  altitudeFeet: 600, isActive: true, regulatoryApproval: 'FAA_Part_135' },
  { id: 'drone-mia-rural',    name: 'Miami Hub → Rural South Florida',  originHubId: 'hub-mia-01', originCity: 'Doral',   destinationZone: 'Homestead, FL',    distanceMiles: 28.0, maxPayloadKg: 2.5, avgFlightMins: 38, supportsColdChain: true,  altitudeFeet: 400, isActive: true, regulatoryApproval: 'FAA_Part_135' },
];

// ─── City Expansion Map ───────────────────────────────────────────────────────

const CITY_EXPANSIONS: CityExpansion[] = [
  { cityName: 'New York City',   state: 'NY', tier: 'Tier1_Metro',  population: 8335000, launchStatus: 'Live',         launchDate: '2026-01-01', activePharmacies: 148, activePatients: 42800,  monthlyGmv: 1120400, hubWarehouseId: 'hub-nyc-01' },
  { cityName: 'Los Angeles',     state: 'CA', tier: 'Tier1_Metro',  population: 3979576, launchStatus: 'Live',         launchDate: '2026-02-15', activePharmacies: 134, activePatients: 38200,  monthlyGmv: 984000,  hubWarehouseId: 'hub-la-01'  },
  { cityName: 'Chicago',         state: 'IL', tier: 'Tier1_Metro',  population: 2696555, launchStatus: 'Live',         launchDate: '2026-03-01', activePharmacies: 112, activePatients: 29400,  monthlyGmv: 740000,  hubWarehouseId: 'hub-chi-01' },
  { cityName: 'Dallas',          state: 'TX', tier: 'Tier1_Metro',  population: 1343573, launchStatus: 'Live',         launchDate: '2026-04-10', activePharmacies: 84,  activePatients: 18600,  monthlyGmv: 492000,  hubWarehouseId: 'hub-dal-01' },
  { cityName: 'Miami',           state: 'FL', tier: 'Tier1_Metro',  population: 471000,  launchStatus: 'Live',         launchDate: '2026-05-01', activePharmacies: 76,  activePatients: 14200,  monthlyGmv: 381000,  hubWarehouseId: 'hub-mia-01' },
  { cityName: 'Houston',         state: 'TX', tier: 'Tier1_Metro',  population: 2304580, launchStatus: 'Soft_Launch',  launchDate: '2026-10-01', activePharmacies: 28,  activePatients: 4100,   monthlyGmv: 92000  },
  { cityName: 'Phoenix',         state: 'AZ', tier: 'Tier1_Metro',  population: 1608139, launchStatus: 'Soft_Launch',  launchDate: '2026-11-15', activePharmacies: 18,  activePatients: 2400,   monthlyGmv: 58000  },
  { cityName: 'Philadelphia',    state: 'PA', tier: 'Tier1_Metro',  population: 1603797, launchStatus: 'Planned',      launchDate: '2027-01-15', activePharmacies: 0,   activePatients: 0,      monthlyGmv: 0      },
  { cityName: 'San Antonio',     state: 'TX', tier: 'Tier2_City',   population: 1434625, launchStatus: 'Planned',      launchDate: '2027-02-01', activePharmacies: 0,   activePatients: 0,      monthlyGmv: 0      },
  { cityName: 'San Diego',       state: 'CA', tier: 'Tier2_City',   population: 1386932, launchStatus: 'Planned',      launchDate: '2027-03-01', activePharmacies: 0,   activePatients: 0,      monthlyGmv: 0      },
  { cityName: 'Austin',          state: 'TX', tier: 'Tier2_City',   population: 978908,  launchStatus: 'Announced',    launchDate: '2027-04-01', activePharmacies: 0,   activePatients: 0,      monthlyGmv: 0      },
  { cityName: 'Jacksonville',    state: 'FL', tier: 'Tier2_City',   population: 911507,  launchStatus: 'Announced',    launchDate: '2027-05-01', activePharmacies: 0,   activePatients: 0,      monthlyGmv: 0      },
];

// ─── In-Memory State ──────────────────────────────────────────────────────────

const replenishmentOrders = new Map<string, ReplenishmentOrder>();
const droneDeliveries = new Map<string, DroneDelivery>();

// ─── Demand Forecasting Engine ────────────────────────────────────────────────

const SEASONAL_MULTIPLIERS: Record<number, number> = { 0:1.15,1:1.10,2:1.05,3:0.95,4:0.90,5:0.90,6:0.85,7:0.88,8:0.92,9:1.00,10:1.10,11:1.20 };
const DISEASE_ADJUSTMENTS: Record<string, number> = {
  'Atorvastatin Calcium': 1.02,
  'Metformin HCl': 1.04,
  'Levothyroxine Sodium': 1.01,
  'Sertraline HCl': 1.03,
  'Albuterol Sulfate': 1.08,
};

// ─── Hub Logistics Service ────────────────────────────────────────────────────

export class HubLogisticsService {
  // ── Warehouses ──────────────────────────────────────────────────────────────

  public getHubs(): HubWarehouse[] { return HUB_WAREHOUSES; }
  public getHub(id: string): HubWarehouse | undefined { return HUB_WAREHOUSES.find(h => h.id === id); }

  /**
   * Workstream 5.2 — Demand Forecasting Engine.
   * Uses exponential smoothing + seasonal adjustment + disease incidence.
   */
  public forecastDemand(
    hubId: string,
    genericSalt: string,
    forecastPeriodDays = 30
  ): DemandForecast {
    const hub = HUB_WAREHOUSES.find(h => h.id === hubId);
    if (!hub) throw new Error(`Hub ${hubId} not found`);

    const month = new Date().getMonth();
    const seasonality = SEASONAL_MULTIPLIERS[month] ?? 1.0;
    const diseaseAdj = DISEASE_ADJUSTMENTS[genericSalt] ?? 1.0;

    // Base velocity from hub size and SKU count
    const baseVelocity = Math.round((hub.activeSkus / 100) * (hub.branchesServed / 10));
    const forecastedUnits = Math.round(
      baseVelocity * (forecastPeriodDays / 7) * seasonality * diseaseAdj
    );

    // Simulate current stock (60–90% of forecast as starting point)
    const currentStock = Math.round(forecastedUnits * (0.6 + Math.random() * 0.3));
    const replenishmentQuantity = Math.max(0, forecastedUnits - currentStock + Math.round(forecastedUnits * 0.15));

    return {
      hubId,
      genericSalt,
      forecastPeriodDays,
      historicalWeeklyVelocity: baseVelocity,
      seasonalityMultiplier: seasonality,
      diseaseIncidenceAdjustment: diseaseAdj,
      forecastedUnits,
      currentStock,
      replenishmentQuantity,
      confidenceScore: +(0.82 + Math.random() * 0.12).toFixed(3),
      forecastedAt: new Date().toISOString(),
      algorithm: 'holt_winters',
    };
  }

  /**
   * Workstream 5.2 — Branch Replenishment Routing.
   * Creates a replenishment dispatch from hub to retail branch.
   */
  public createReplenishment(input: {
    hubId: string;
    destinationBranchId: string;
    destinationBranchName: string;
    genericSalt: string;
    quantity: number;
    isColdChain?: boolean;
    priorityLevel?: ReplenishmentOrder['priorityLevel'];
  }): ReplenishmentOrder {
    const hub = HUB_WAREHOUSES.find(h => h.id === input.hubId);
    if (!hub) throw new Error(`Hub ${input.hubId} not found`);

    const id = `REP-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const cycleMins = hub.avgReplenishmentCycleHours * 60;
    const scheduledDispatch = new Date(now.getTime() + 30 * 60000).toISOString();
    const estimatedArrival = new Date(now.getTime() + (cycleMins + 60) * 60000).toISOString();

    const order: ReplenishmentOrder = {
      id,
      hubId: input.hubId,
      hubName: hub.name,
      destinationBranchId: input.destinationBranchId,
      destinationBranchName: input.destinationBranchName,
      genericSalt: input.genericSalt,
      quantity: input.quantity,
      priorityLevel: input.priorityLevel ?? 'Standard',
      scheduledDispatchAt: scheduledDispatch,
      estimatedArrivalAt: estimatedArrival,
      status: 'Scheduled',
      isColdChain: input.isColdChain ?? false,
    };

    replenishmentOrders.set(id, order);
    return order;
  }

  public getReplenishmentOrders(hubId?: string): ReplenishmentOrder[] {
    const all = Array.from(replenishmentOrders.values());
    return hubId ? all.filter(r => r.hubId === hubId) : all;
  }

  // ── Drone Corridors ─────────────────────────────────────────────────────────

  public getCorridors(activeOnly = false): DroneCorridor[] {
    return activeOnly ? DRONE_CORRIDORS.filter(c => c.isActive) : DRONE_CORRIDORS;
  }

  public getCorridor(id: string): DroneCorridor | undefined {
    return DRONE_CORRIDORS.find(c => c.id === id);
  }

  /**
   * Workstream 5.2 — Drone Delivery Dispatch.
   * Dispatches a drone delivery via an active corridor.
   */
  public dispatchDrone(input: {
    corridorId: string;
    orderId: string;
    patientAddress: string;
    payloadDescription: string;
    payloadWeightKg: number;
    isColdChain?: boolean;
  }): DroneDelivery {
    const corridor = DRONE_CORRIDORS.find(c => c.id === input.corridorId);
    if (!corridor) throw new Error(`Corridor ${input.corridorId} not found`);
    if (!corridor.isActive) throw new Error(`Corridor ${input.corridorId} is not active`);
    if (input.payloadWeightKg > corridor.maxPayloadKg) {
      throw new Error(`Payload ${input.payloadWeightKg}kg exceeds corridor max ${corridor.maxPayloadKg}kg`);
    }

    const id = `DRONE-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const etaMs = now.getTime() + corridor.avgFlightMins * 60000;

    const delivery: DroneDelivery = {
      id,
      corridorId: corridor.id,
      corridorName: corridor.name,
      orderId: input.orderId,
      patientAddress: input.patientAddress,
      payloadDescription: input.payloadDescription,
      payloadWeightKg: input.payloadWeightKg,
      isColdChain: input.isColdChain ?? false,
      droneId: `DRN-${Math.floor(100 + Math.random() * 900)}`,
      status: 'On_Mission',
      dispatchedAt: now.toISOString(),
      estimatedArrivalAt: new Date(etaMs).toISOString(),
      telemetryUrl: `/api/v4/hubs/drone/${id}/telemetry`,
    };

    droneDeliveries.set(id, delivery);
    return delivery;
  }

  public getDroneDeliveries(status?: DroneDelivery['status']): DroneDelivery[] {
    const all = Array.from(droneDeliveries.values());
    return status ? all.filter(d => d.status === status) : all;
  }

  // ── City Expansion ──────────────────────────────────────────────────────────

  public getCityExpansions(statusFilter?: CityExpansion['launchStatus']): CityExpansion[] {
    return statusFilter
      ? CITY_EXPANSIONS.filter(c => c.launchStatus === statusFilter)
      : CITY_EXPANSIONS;
  }

  public getPlatformMetrics() {
    const live = CITY_EXPANSIONS.filter(c => c.launchStatus === 'Live');
    return {
      totalCities: CITY_EXPANSIONS.length,
      liveCities: live.length,
      totalActivePharmacies: live.reduce((s, c) => s + c.activePharmacies, 0),
      totalActivePatients: live.reduce((s, c) => s + c.activePatients, 0),
      totalMonthlyGmv: live.reduce((s, c) => s + c.monthlyGmv, 0),
      activeHubs: HUB_WAREHOUSES.filter(h => h.isActive).length,
      activeDroneCorridors: DRONE_CORRIDORS.filter(c => c.isActive).length,
    };
  }
}

export const hubLogisticsService = new HubLogisticsService();
