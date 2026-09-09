import { storage } from './storageService';
import {
  IoTSensorPacket,
  BreachAlert,
  BLESyncRecord,
  ExcursionTracker,
  SensorProtocol,
  MobileNotification,
  NotificationType,
} from '../../src/types';

// ─── GDP Cold-Chain Thresholds (ADR-008) ──────────────────────────────────────

const OPTIMAL_MIN_C = 2.0;
const OPTIMAL_MAX_C = 8.0;
const BREACH_LOWER_C = 1.8;
const BREACH_UPPER_C = 8.2;
/** Cumulative excursion duration (minutes) before quarantine is triggered */
const QUARANTINE_THRESHOLD_MINS = 10;
/** Interval between sensor packets in minutes (simulated) */
const SENSOR_INTERVAL_MINS = 0.5; // 30-second packets for simulation fidelity

// ─── In-Memory State ──────────────────────────────────────────────────────────

const sensorPackets: IoTSensorPacket[] = [];
const excursionTrackers = new Map<string, ExcursionTracker>();
const breachAlerts = new Map<string, BreachAlert>();
const bleSyncRecords: BLESyncRecord[] = [];
const notifications: MobileNotification[] = [];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isBreached(temp: number): boolean {
  return temp < BREACH_LOWER_C || temp > BREACH_UPPER_C;
}

function isOptimal(temp: number): boolean {
  return temp >= OPTIMAL_MIN_C && temp <= OPTIMAL_MAX_C;
}

function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  orderId?: string
): MobileNotification {
  const notif: MobileNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    type,
    title,
    body,
    orderId,
    deepLinkTab: orderId ? 'my-orders' : undefined,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  notifications.push(notif);
  return notif;
}

// ─── IoT Gateway Service ─────────────────────────────────────────────────────

export class IoTGatewayService {
  /**
   * Workstream 2.2 — MQTT / HTTP IoT Packet Ingestion.
   *
   * Processes a temperature + GPS packet from a smart cool-box sensor.
   * Implements cumulative excursion tracking:
   *   - Each packet is 30s apart (SENSOR_INTERVAL_MINS = 0.5)
   *   - Once cumulativeExcursionMins >= QUARANTINE_THRESHOLD_MINS (10 min),
   *     the order is quarantined and a replacement re-dispatch is triggered.
   */
  public ingest(input: {
    orderId: string;
    shipmentId?: string;
    sensorId: string;
    protocol?: SensorProtocol;
    temperatureCelsius: number;
    humidityPercent?: number;
    batteryPercent: number;
    latitude: number;
    longitude: number;
  }): IoTSensorPacket {
    const breached = isBreached(input.temperatureCelsius);

    // Retrieve or initialise excursion tracker for this order+sensor
    const trackerKey = `${input.orderId}::${input.sensorId}`;
    let tracker = excursionTrackers.get(trackerKey) ?? {
      orderId: input.orderId,
      sensorId: input.sensorId,
      excursionStartedAt: null,
      cumulativeExcursionMins: 0,
      quarantineTriggered: false,
    };

    if (breached) {
      if (!tracker.excursionStartedAt) {
        tracker.excursionStartedAt = new Date().toISOString();
      }
      tracker.cumulativeExcursionMins += SENSOR_INTERVAL_MINS;
    } else {
      // Temperature returned to safe range — reset the rolling window
      tracker.excursionStartedAt = null;
      tracker.cumulativeExcursionMins = 0;
    }

    const quarantineTriggered =
      tracker.quarantineTriggered ||
      tracker.cumulativeExcursionMins >= QUARANTINE_THRESHOLD_MINS;

    tracker.quarantineTriggered = quarantineTriggered;
    excursionTrackers.set(trackerKey, tracker);

    const packet: IoTSensorPacket = {
      id: `iot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: input.orderId,
      shipmentId: input.shipmentId,
      sensorId: input.sensorId,
      protocol: input.protocol ?? 'HTTP',
      temperatureCelsius: +input.temperatureCelsius.toFixed(2),
      humidityPercent: input.humidityPercent,
      batteryPercent: input.batteryPercent,
      latitude: input.latitude,
      longitude: input.longitude,
      isBreached: breached,
      cumulativeExcursionMins: +tracker.cumulativeExcursionMins.toFixed(2),
      quarantineTriggered,
      timestamp: new Date().toISOString(),
    };

    sensorPackets.push(packet);

    // ── Autonomous Re-Dispatch Workflow ────────────────────────────────────
    if (quarantineTriggered && !this.hasActiveBreachAlert(input.orderId)) {
      this.triggerBreachProtocol(input.orderId, input.sensorId, input.temperatureCelsius, tracker);
    }

    return packet;
  }

  /**
   * Triggers the full breach quarantine & re-dispatch workflow (ADR-008):
   * 1. Mark order as Re-dispatching
   * 2. Create a BreachAlert record
   * 3. Emit mobile notifications to patient and rider
   */
  private triggerBreachProtocol(
    orderId: string,
    sensorId: string,
    peakTemp: number,
    tracker: ExcursionTracker
  ): BreachAlert {
    const now = new Date().toISOString();
    const alertId = `breach-${Date.now()}`;

    // Quarantine the in-flight order
    storage.updateOrderStatus(orderId, 'Re-dispatching');

    // Create a replacement re-dispatch order (zero-cost to patient)
    const originalOrder = storage.getOrderById(orderId);
    if (originalOrder) {
      const reDispatchOrder = {
        ...originalOrder,
        id: `ord-redispatch-${Date.now().toString().slice(-4)}`,
        orderNumber: `#REDISP-${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'Dispensing' as const,
        orderDate: new Date().toISOString().split('T')[0],
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        platformFee: 0,
      };
      storage.saveOrder(reDispatchOrder);

      // Patient notification
      createNotification(
        'usr-patient-8821',
        'temperature_breach',
        '🌡 Cold-Chain Alert — Replacement Dispatched',
        `Your order ${originalOrder.orderNumber} experienced a temperature excursion (${peakTemp.toFixed(1)}°C). ` +
          `A replacement has been dispatched from the nearest pharmacy at zero cost.`,
        orderId
      );
    }

    const alert: BreachAlert = {
      id: alertId,
      orderId,
      sensorId,
      peakTemperatureCelsius: +peakTemp.toFixed(2),
      excursionStartedAt: tracker.excursionStartedAt ?? now,
      excursionDurationMins: +tracker.cumulativeExcursionMins.toFixed(2),
      alertTriggeredAt: now,
      autoRedispatchOrderId: originalOrder
        ? `ord-redispatch-${Date.now().toString().slice(-4)}`
        : undefined,
      status: 'quarantined',
      notifiedPatient: !!originalOrder,
      notifiedRider: false,
    };

    breachAlerts.set(alertId, alert);
    return alert;
  }

  private hasActiveBreachAlert(orderId: string): boolean {
    return Array.from(breachAlerts.values()).some(
      a => a.orderId === orderId && a.status !== 'resolved'
    );
  }

  /**
   * Workstream 2.2 — BLE Gateway Sync:
   * Synchronises onboard flash memory from the rider's BLE device upon delivery.
   */
  public bleSyncOnDelivery(input: {
    sensorId: string;
    orderId: string;
    riderId: string;
    flashLog: Array<{
      temperatureCelsius: number;
      batteryPercent: number;
      latitude: number;
      longitude: number;
      timestamp: string;
    }>;
  }): BLESyncRecord {
    const packets: IoTSensorPacket[] = input.flashLog.map((entry, idx) => ({
      id: `ble-${input.sensorId}-${idx}`,
      orderId: input.orderId,
      sensorId: input.sensorId,
      protocol: 'BLE' as SensorProtocol,
      temperatureCelsius: +entry.temperatureCelsius.toFixed(2),
      batteryPercent: entry.batteryPercent,
      latitude: entry.latitude,
      longitude: entry.longitude,
      isBreached: isBreached(entry.temperatureCelsius),
      cumulativeExcursionMins: 0,
      quarantineTriggered: false,
      timestamp: entry.timestamp,
    }));

    // Store all synced packets
    sensorPackets.push(...packets);

    const allOptimal = packets.every(p => isOptimal(p.temperatureCelsius));

    const record: BLESyncRecord = {
      sensorId: input.sensorId,
      orderId: input.orderId,
      riderId: input.riderId,
      flashLog: packets,
      syncedAt: new Date().toISOString(),
      deliveryConfirmed: allOptimal,
    };
    bleSyncRecords.push(record);

    return record;
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  public getPacketsForOrder(orderId: string): IoTSensorPacket[] {
    return sensorPackets.filter(p => p.orderId === orderId);
  }

  public getLatestPacket(orderId: string): IoTSensorPacket | undefined {
    const packets = this.getPacketsForOrder(orderId);
    return packets[packets.length - 1];
  }

  public getBreachAlerts(status?: BreachAlert['status']): BreachAlert[] {
    const all = Array.from(breachAlerts.values());
    return status ? all.filter(a => a.status === status) : all;
  }

  public getBreachAlert(id: string): BreachAlert | undefined {
    return breachAlerts.get(id);
  }

  public resolveBreachAlert(id: string): BreachAlert {
    const alert = breachAlerts.get(id);
    if (!alert) throw new Error(`Breach alert ${id} not found`);
    alert.status = 'resolved';
    breachAlerts.set(id, alert);
    return alert;
  }

  public getExcursionTracker(orderId: string, sensorId: string): ExcursionTracker | undefined {
    return excursionTrackers.get(`${orderId}::${sensorId}`);
  }

  public getNotifications(userId: string): MobileNotification[] {
    return notifications.filter(n => n.userId === userId);
  }

  public markNotificationRead(id: string): void {
    const n = notifications.find(n => n.id === id);
    if (n) n.isRead = true;
  }
}

export const iotGatewayService = new IoTGatewayService();
