import { storage, ColdChainTelemetryPacket } from './storageService';

export interface TelemetryIngestInput {
  orderId: string;
  sensorId: string;
  temperatureCelsius: number;
  latitude: number;
  longitude: number;
  batteryPercent: number;
}

export class TelemetryService {
  /**
   * Ingests live telemetry from cool-box IoT hardware beacons.
   * Evaluates Good Distribution Practice (GDP) threshold: 2°C to 8°C.
   */
  public ingest(input: TelemetryIngestInput): ColdChainTelemetryPacket {
    const isBreached = input.temperatureCelsius < 1.8 || input.temperatureCelsius > 8.2;

    const packet: ColdChainTelemetryPacket = {
      id: 'tel-' + Date.now(),
      orderId: input.orderId,
      sensorId: input.sensorId,
      temperatureCelsius: +input.temperatureCelsius.toFixed(2),
      latitude: input.latitude,
      longitude: input.longitude,
      batteryPercent: input.batteryPercent,
      isBreached,
      timestamp: new Date().toISOString()
    };

    storage.addTelemetry(packet);

    // If breached, trigger safety protocol
    if (isBreached) {
      const order = storage.getOrderById(input.orderId);
      if (order) {
        order.status = 'Re-dispatching';
        storage.saveOrder(order);
      }
    }

    return packet;
  }

  public getTelemetry(orderId: string): ColdChainTelemetryPacket[] {
    return storage.getTelemetryForOrder(orderId);
  }

  public getLatest(orderId: string): ColdChainTelemetryPacket | undefined {
    return storage.getLatestTelemetry(orderId);
  }
}

export const telemetryService = new TelemetryService();
