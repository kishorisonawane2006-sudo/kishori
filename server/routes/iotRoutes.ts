import { Router, Request, Response } from 'express';
import { iotGatewayService } from '../services/iotGatewayService';
import { SensorProtocol } from '../../src/types';

const router = Router();

// ─── POST /api/v2/iot/ingest ──────────────────────────────────────────────────
// Enhanced telemetry ingestion with cumulative excursion tracking.
// Replaces the Phase 1 /api/v1/telemetry/iot/ingest endpoint with full
// breach detection, 10-minute quarantine timer, and auto-redispatch.
router.post('/ingest', (req: Request, res: Response): void => {
  const {
    orderId,
    shipmentId,
    sensorId,
    protocol,
    temperatureCelsius,
    humidityPercent,
    batteryPercent,
    latitude,
    longitude,
  } = req.body;

  if (!orderId || temperatureCelsius === undefined) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'orderId and temperatureCelsius are required.',
    });
    return;
  }

  const validProtocols: SensorProtocol[] = ['BLE', 'Cellular', 'MQTT', 'HTTP'];
  if (protocol && !validProtocols.includes(protocol)) {
    res.status(400).json({
      error: 'InvalidProtocol',
      message: `protocol must be one of: ${validProtocols.join(', ')}`,
    });
    return;
  }

  const packet = iotGatewayService.ingest({
    orderId,
    shipmentId,
    sensorId: sensorId ?? 'BLE-SNSR-892',
    protocol: protocol ?? 'HTTP',
    temperatureCelsius: parseFloat(temperatureCelsius),
    humidityPercent: humidityPercent !== undefined ? parseFloat(humidityPercent) : undefined,
    batteryPercent: batteryPercent !== undefined ? parseFloat(batteryPercent) : 90,
    latitude: latitude !== undefined ? parseFloat(latitude) : 40.7128,
    longitude: longitude !== undefined ? parseFloat(longitude) : -74.006,
  });

  const statusLabel = packet.quarantineTriggered
    ? 'QUARANTINE_TRIGGERED_AUTO_REDISPATCH'
    : packet.isBreached
    ? 'BREACH_DETECTED_MONITORING'
    : 'OPTIMAL_TEMPERATURE';

  res.status(201).json({
    status: statusLabel,
    gdpCompliant: !packet.isBreached,
    optimalRange: '2.0°C – 8.0°C',
    packet,
  });
});

// ─── GET /api/v2/iot/orders/:orderId/telemetry ────────────────────────────────
// Retrieves all telemetry packets for an order plus the excursion tracker state.
router.get('/orders/:orderId/telemetry', (req: Request, res: Response): void => {
  const { orderId } = req.params;
  const sensorId = (req.query.sensorId as string) ?? 'BLE-SNSR-892';

  const packets = iotGatewayService.getPacketsForOrder(orderId);
  const latest = iotGatewayService.getLatestPacket(orderId);
  const tracker = iotGatewayService.getExcursionTracker(orderId, sensorId);

  res.json({
    orderId,
    packetCount: packets.length,
    latest: latest ?? {
      temperatureCelsius: 4.2,
      isBreached: false,
      sensorId,
      timestamp: new Date().toISOString(),
      cumulativeExcursionMins: 0,
      quarantineTriggered: false,
    },
    excursionTracker: tracker ?? {
      orderId,
      sensorId,
      excursionStartedAt: null,
      cumulativeExcursionMins: 0,
      quarantineTriggered: false,
    },
    history: packets,
  });
});

// ─── GET /api/v2/iot/breach-alerts ───────────────────────────────────────────
// Lists active, resolved, or all breach alerts.
router.get('/breach-alerts', (req: Request, res: Response): void => {
  const status = req.query.status as 'active' | 'resolved' | 'quarantined' | undefined;
  const alerts = iotGatewayService.getBreachAlerts(status);
  res.json({ count: alerts.length, alerts });
});

// ─── POST /api/v2/iot/breach-alerts/:id/resolve ──────────────────────────────
// Resolves a breach alert once the quarantine/re-dispatch is confirmed complete.
router.post('/breach-alerts/:id/resolve', (req: Request, res: Response): void => {
  try {
    const resolved = iotGatewayService.resolveBreachAlert(req.params.id);
    res.json({ message: `Breach alert ${req.params.id} resolved.`, alert: resolved });
  } catch (err) {
    res.status(404).json({ error: 'AlertNotFound', message: (err as Error).message });
  }
});

// ─── POST /api/v2/iot/ble-sync ───────────────────────────────────────────────
// BLE flash memory sync triggered when rider's device comes within range of
// the pharmacy gateway on delivery completion.
router.post('/ble-sync', (req: Request, res: Response): void => {
  const { sensorId, orderId, riderId, flashLog } = req.body;

  if (!sensorId || !orderId || !riderId || !Array.isArray(flashLog)) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'sensorId, orderId, riderId, and flashLog[] are required.',
    });
    return;
  }

  const record = iotGatewayService.bleSyncOnDelivery({ sensorId, orderId, riderId, flashLog });

  res.status(201).json({
    message: `BLE flash sync completed for order ${orderId}. ${flashLog.length} packet(s) uploaded.`,
    deliveryConfirmed: record.deliveryConfirmed,
    coldChainIntact: record.deliveryConfirmed,
    syncRecord: record,
  });
});

// ─── GET /api/v2/iot/notifications/:userId ────────────────────────────────────
// Returns mobile push notifications for a patient or rider.
router.get('/notifications/:userId', (req: Request, res: Response): void => {
  const notifications = iotGatewayService.getNotifications(req.params.userId);
  res.json({ userId: req.params.userId, count: notifications.length, notifications });
});

// PATCH /api/v2/iot/notifications/:notificationId/read
router.patch('/notifications/:notificationId/read', (req: Request, res: Response): void => {
  iotGatewayService.markNotificationRead(req.params.notificationId);
  res.json({ success: true });
});

export default router;
