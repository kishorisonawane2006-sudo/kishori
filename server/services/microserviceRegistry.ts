import { MicroserviceHealth, ServiceStatus, ConcurrencySimResult } from '../../src/types';
import { eventBusService } from './eventBusService';

// ─── Service Registry ─────────────────────────────────────────────────────────

const SERVICES: MicroserviceHealth[] = [
  {
    serviceId: 'svc-catalog-01',
    serviceName: 'Catalog & Search Service',
    version: 'v4.1.2',
    tier: 'Edge',
    status: 'Healthy',
    requestsPerSec: 18420,
    p99LatencyMs: 12,
    p50LatencyMs: 4,
    errorRate: 0.001,
    cpuPercent: 38,
    memoryPercent: 44,
    replicaCount: 12,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    uptime: '99.98%',
    sustainedThroughputCapacity: 250000,
    technology: 'TypeScript / Node.js + Redis Edge Cache',
  },
  {
    serviceId: 'svc-order-01',
    serviceName: 'Order & Buy-Box Engine',
    version: 'v4.0.8',
    tier: 'Core',
    status: 'Healthy',
    requestsPerSec: 8840,
    p99LatencyMs: 28,
    p50LatencyMs: 8,
    errorRate: 0.002,
    cpuPercent: 52,
    memoryPercent: 61,
    replicaCount: 8,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    uptime: '99.97%',
    sustainedThroughputCapacity: 150000,
    technology: 'Go 1.22 + PostgreSQL / Redis Sentinel',
  },
  {
    serviceId: 'svc-insurance-01',
    serviceName: 'Insurance & Billing Ledger',
    version: 'v4.0.3',
    tier: 'Core',
    status: 'Healthy',
    requestsPerSec: 2140,
    p99LatencyMs: 85,
    p50LatencyMs: 42,
    errorRate: 0.001,
    cpuPercent: 29,
    memoryPercent: 38,
    replicaCount: 4,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    uptime: '99.99%',
    sustainedThroughputCapacity: 50000,
    technology: 'TypeScript / Node.js (PCI-DSS L1 + HIPAA)',
  },
  {
    serviceId: 'svc-iot-01',
    serviceName: 'IoT Cold-Chain Gateway',
    version: 'v2.8.1',
    tier: 'Infrastructure',
    status: 'Healthy',
    requestsPerSec: 42000,
    p99LatencyMs: 6,
    p50LatencyMs: 2,
    errorRate: 0.0001,
    cpuPercent: 21,
    memoryPercent: 28,
    replicaCount: 6,
    deploymentTarget: 'Lambda',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    uptime: '99.995%',
    sustainedThroughputCapacity: 500000,
    technology: 'Rust 1.79 + MQTT / TimescaleDB',
  },
  {
    serviceId: 'svc-fhir-01',
    serviceName: 'FHIR EHR Integration Gateway',
    version: 'v3.2.0',
    tier: 'Core',
    status: 'Healthy',
    requestsPerSec: 480,
    p99LatencyMs: 142,
    p50LatencyMs: 68,
    errorRate: 0.003,
    cpuPercent: 18,
    memoryPercent: 24,
    replicaCount: 3,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    uptime: '99.94%',
    sustainedThroughputCapacity: 20000,
    technology: 'TypeScript / HL7 FHIR R4 SDK',
  },
  {
    serviceId: 'svc-ddi-01',
    serviceName: 'Gemini AI DDI Safety Engine',
    version: 'v3.1.0',
    tier: 'Core',
    status: 'Healthy',
    requestsPerSec: 920,
    p99LatencyMs: 380,
    p50LatencyMs: 140,
    errorRate: 0.002,
    cpuPercent: 44,
    memoryPercent: 58,
    replicaCount: 4,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    uptime: '99.91%',
    sustainedThroughputCapacity: 30000,
    technology: 'TypeScript + Google Gemini 2.5 Flash API',
  },
  {
    serviceId: 'svc-3pl-01',
    serviceName: '3PL Logistics Hub',
    version: 'v2.5.4',
    tier: 'Infrastructure',
    status: 'Degraded',
    requestsPerSec: 1240,
    p99LatencyMs: 210,
    p50LatencyMs: 88,
    errorRate: 0.012,
    cpuPercent: 71,
    memoryPercent: 82,
    replicaCount: 3,
    deploymentTarget: 'Kubernetes',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 18 * 86400000).toISOString(),
    uptime: '99.85%',
    sustainedThroughputCapacity: 40000,
    technology: 'TypeScript + Dunzo / Shadowfax / FedEx API adapters',
  },
  {
    serviceId: 'svc-eventbus-01',
    serviceName: 'Event Bus (Kafka MSK)',
    version: 'v3.6.1',
    tier: 'Infrastructure',
    status: 'Healthy',
    requestsPerSec: 84000,
    p99LatencyMs: 8,
    p50LatencyMs: 3,
    errorRate: 0.00005,
    cpuPercent: 31,
    memoryPercent: 46,
    replicaCount: 9,
    deploymentTarget: 'ECS',
    region: 'us-east-1',
    lastDeployedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
    uptime: '99.999%',
    sustainedThroughputCapacity: 1000000,
    technology: 'Apache Kafka 3.7 on AWS MSK',
  },
  {
    serviceId: 'svc-cdn-01',
    serviceName: 'Patient Web App CDN',
    version: 'v4.0.0',
    tier: 'Edge',
    status: 'Healthy',
    requestsPerSec: 22000,
    p99LatencyMs: 18,
    p50LatencyMs: 6,
    errorRate: 0.0003,
    cpuPercent: 15,
    memoryPercent: 18,
    replicaCount: 48,
    deploymentTarget: 'CloudRun',
    region: 'multi-region',
    lastDeployedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    uptime: '99.99%',
    sustainedThroughputCapacity: 500000,
    technology: 'React 19 / Vite + Cloudflare Workers',
  },
];

// ─── Microservice Registry ────────────────────────────────────────────────────

export class MicroserviceRegistry {
  private services: MicroserviceHealth[];

  constructor() {
    this.services = SERVICES;
    // Self-register to event bus for monitoring
    eventBusService.subscribe('orders', 'order-service', (msg) => {
      const svc = this.getService('svc-order-01');
      if (svc) svc.requestsPerSec = Math.min(svc.sustainedThroughputCapacity, svc.requestsPerSec + 1);
    });
  }

  public getServices(tier?: MicroserviceHealth['tier']): MicroserviceHealth[] {
    return tier ? this.services.filter(s => s.tier === tier) : this.services;
  }

  public getService(id: string): MicroserviceHealth | undefined {
    return this.services.find(s => s.serviceId === id);
  }

  public getHealthSummary() {
    const healthy  = this.services.filter(s => s.status === 'Healthy').length;
    const degraded = this.services.filter(s => s.status === 'Degraded').length;
    const unhealthy = this.services.filter(s => s.status === 'Unhealthy').length;
    const totalRps  = this.services.reduce((s, svc) => s + svc.requestsPerSec, 0);
    const maxCapacity = this.services.reduce((s, svc) => s + svc.sustainedThroughputCapacity, 0);

    return {
      totalServices: this.services.length,
      healthy,
      degraded,
      unhealthy,
      overallStatus: unhealthy > 0 ? 'Unhealthy' : degraded > 0 ? 'Degraded' : 'Healthy' as ServiceStatus,
      totalRequestsPerSec: totalRps,
      maxSustainedCapacityRps: maxCapacity,
      p99SlaCompliant: this.services.every(s => s.p99LatencyMs < 100),
      availabilityPercent: +(healthy / this.services.length * 100).toFixed(2),
    };
  }

  /** Simulates a concurrency spike to validate 100k req/s quality gate */
  public runConcurrencyTest(targetRps = 100_000): ConcurrencySimResult {
    return eventBusService.simulateConcurrency(targetRps, 300);
  }

  public updateServiceStatus(serviceId: string, status: ServiceStatus): MicroserviceHealth {
    const svc = this.services.find(s => s.serviceId === serviceId);
    if (!svc) throw new Error(`Service ${serviceId} not found`);
    svc.status = status;
    return svc;
  }
}

export const microserviceRegistry = new MicroserviceRegistry();
