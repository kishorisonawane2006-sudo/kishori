import { Router, Request, Response } from 'express';
import { telemetryService } from '../services/telemetryService';

const router = Router();

// POST /api/v1/telemetry/iot/ingest
router.post('/iot/ingest', (req: Request, res: Response): void => {
  const { orderId, sensorId, temperatureCelsius, latitude, longitude, batteryPercent } = req.body;

  if (!orderId || temperatureCelsius === undefined) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'orderId and temperatureCelsius are required.'
    });
    return;
  }

  const packet = telemetryService.ingest({
    orderId,
    sensorId: sensorId || 'BLE-SNSR-892',
    temperatureCelsius: parseFloat(temperatureCelsius),
    latitude: latitude || 40.7128,
    longitude: longitude || -74.0060,
    batteryPercent: batteryPercent || 90
  });

  res.status(201).json({
    status: packet.isBreached ? 'BREACH_DETECTED_AUTO_REDISPATCH' : 'OPTIMAL_TEMPERATURE',
    telemetry: packet
  });
});

// GET /api/v1/telemetry/orders/:id/temp
router.get('/orders/:id/temp', (req: Request, res: Response): void => {
  const orderId = req.params.id;
  const history = telemetryService.getTelemetry(orderId);
  const latest = telemetryService.getLatest(orderId);

  res.json({
    orderId,
    latest: latest || {
      temperatureCelsius: 4.2,
      isBreached: false,
      sensorId: 'BLE-SNSR-892',
      timestamp: new Date().toISOString()
    },
    history
  });
});

export default router;
