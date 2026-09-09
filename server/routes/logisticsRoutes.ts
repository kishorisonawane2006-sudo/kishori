import { Router, Request, Response } from 'express';
import { logisticsService } from '../services/logisticsService';
import { geoFencingService } from '../services/geoFencingService';
import { storage } from '../services/storageService';
import { ShipmentEventStatus, CarrierType } from '../../src/types';

const router = Router();

// ─── POST /api/v2/logistics/dispatch ─────────────────────────────────────────
// Triggers auto-dispatch for an approved order. Called automatically after
// pharmacist digital sign-off (ADR-005). Target SLA: < 180 seconds.
router.post('/dispatch', (req: Request, res: Response): void => {
  const {
    orderId,
    customerName,
    customerAddress,
    pickupAddress,
    distanceMiles,
    isColdChain,
    packageDescription,
  } = req.body;

  if (!orderId || !customerAddress) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'orderId and customerAddress are required for dispatch.',
    });
    return;
  }

  try {
    const result = logisticsService.autoDispatch(
      orderId,
      customerName ?? 'Patient',
      customerAddress,
      pickupAddress ?? '1420 Broadway, New York NY 10018',
      distanceMiles ?? 3.5,
      isColdChain ?? false,
      packageDescription ?? 'Prescription Medication — Handle with Care'
    );

    res.status(201).json({
      message: `Order ${orderId} dispatched via ${result.selectedCarrier} in ${result.dispatchLatencyMs}ms.`,
      dispatchLatencyMs: result.dispatchLatencyMs,
      slaCompliant: result.dispatchLatencyMs < 180_000,
      dispatch: result.dispatch,
      waybill: result.waybill,
    });
  } catch (err) {
    res.status(500).json({ error: 'DispatchFailed', message: (err as Error).message });
  }
});

// ─── GET /api/v2/logistics/dispatches ────────────────────────────────────────
// Returns all active shipment dispatches, optionally filtered by carrier.
router.get('/dispatches', (req: Request, res: Response): void => {
  const carrierType = req.query.carrier as CarrierType | undefined;
  const dispatches = logisticsService.getDispatches(carrierType);
  res.json({ count: dispatches.length, dispatches });
});

// ─── GET /api/v2/logistics/dispatches/:id ────────────────────────────────────
router.get('/dispatches/:id', (req: Request, res: Response): void => {
  const dispatch = logisticsService.getDispatch(req.params.id);
  if (!dispatch) {
    res.status(404).json({ error: 'DispatchNotFound', message: `Shipment ${req.params.id} not found.` });
    return;
  }
  res.json({ dispatch });
});

// ─── GET /api/v2/logistics/waybill/:waybillNumber ───────────────────────────
// Returns a waybill document for printing / label generation.
router.get('/waybill/:waybillNumber', (req: Request, res: Response): void => {
  const waybill = logisticsService.getWaybill(req.params.waybillNumber);
  if (!waybill) {
    res.status(404).json({ error: 'WaybillNotFound', message: `Waybill ${req.params.waybillNumber} not found.` });
    return;
  }
  res.json({ waybill });
});

// ─── POST /api/v2/logistics/carrier-webhook ──────────────────────────────────
// Ingests real-time delivery status events from Dunzo / Shadowfax / FedEx.
// Mapped to: ASSIGNED → PICKED_UP → OUT_FOR_DELIVERY → DELIVERED / FAILED_ATTEMPT
router.post('/carrier-webhook', (req: Request, res: Response): void => {
  const { shipmentId, status, latitude, longitude, riderNote, otpVerified } = req.body;

  const validStatuses: ShipmentEventStatus[] = [
    'ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'FAILED_ATTEMPT', 'RETURNED_TO_PHARMACY',
  ];

  if (!shipmentId || !status || !validStatuses.includes(status)) {
    res.status(400).json({
      error: 'InvalidWebhookPayload',
      message: `shipmentId and a valid status (${validStatuses.join(' | ')}) are required.`,
    });
    return;
  }

  try {
    const updated = logisticsService.ingestWebhookEvent(
      shipmentId, status, latitude, longitude, riderNote, otpVerified
    );
    res.json({ message: `Shipment ${shipmentId} advanced to ${status}.`, dispatch: updated });
  } catch (err) {
    res.status(404).json({ error: 'ShipmentNotFound', message: (err as Error).message });
  }
});

// ─── POST /api/v2/logistics/carrier/:carrierId/failover ──────────────────────
// Marks a carrier offline and re-assigns its active shipments to a fallback.
router.post('/carrier/:carrierId/failover', (req: Request, res: Response): void => {
  try {
    const result = logisticsService.failoverCarrier(req.params.carrierId);
    res.json({
      message: `Carrier ${req.params.carrierId} taken offline. ${result.reassigned} shipment(s) re-assigned to ${result.fallbackCarrier}.`,
      ...result,
    });
  } catch (err) {
    res.status(404).json({ error: 'CarrierNotFound', message: (err as Error).message });
  }
});

// ─── GET /api/v2/logistics/carriers ──────────────────────────────────────────
router.get('/carriers', (_req: Request, res: Response): void => {
  res.json({ carriers: logisticsService.getCarriers() });
});

// ─── Rider Endpoints ─────────────────────────────────────────────────────────

// GET /api/v2/logistics/riders
router.get('/riders', (_req: Request, res: Response): void => {
  res.json({ riders: logisticsService.getRiders() });
});

// GET /api/v2/logistics/riders/:riderId
router.get('/riders/:riderId', (req: Request, res: Response): void => {
  const rider = logisticsService.getRider(req.params.riderId);
  if (!rider) {
    res.status(404).json({ error: 'RiderNotFound', message: `Rider ${req.params.riderId} not found.` });
    return;
  }
  res.json({ rider });
});

// GET /api/v2/logistics/riders/:riderId/stops
router.get('/riders/:riderId/stops', (req: Request, res: Response): void => {
  const stops = logisticsService.getDeliveryStopsForRider(req.params.riderId);
  res.json({ riderId: req.params.riderId, count: stops.length, stops });
});

// PATCH /api/v2/logistics/riders/:riderId/location
router.patch('/riders/:riderId/location', (req: Request, res: Response): void => {
  const { latitude, longitude, address } = req.body;
  if (latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'InvalidInput', message: 'latitude and longitude are required.' });
    return;
  }
  try {
    const updated = logisticsService.updateRiderLocation(req.params.riderId, latitude, longitude, address ?? '');
    res.json({ rider: updated });
  } catch (err) {
    res.status(404).json({ error: 'RiderNotFound', message: (err as Error).message });
  }
});

// ─── OTP & POD ───────────────────────────────────────────────────────────────

// POST /api/v2/logistics/otp/verify
router.post('/otp/verify', (req: Request, res: Response): void => {
  const { shipmentId, otpCode, riderId } = req.body;
  if (!shipmentId || !otpCode || !riderId) {
    res.status(400).json({ error: 'InvalidInput', message: 'shipmentId, otpCode, and riderId are required.' });
    return;
  }
  const valid = logisticsService.verifyOtp(shipmentId, otpCode, riderId);
  res.json({ shipmentId, otpVerified: valid, message: valid ? 'OTP verified successfully.' : 'Invalid OTP code.' });
});

// POST /api/v2/logistics/pod
router.post('/pod', (req: Request, res: Response): void => {
  const { shipmentId, photoDataUrl, riderId, latitude, longitude } = req.body;
  if (!shipmentId || !riderId) {
    res.status(400).json({ error: 'InvalidInput', message: 'shipmentId and riderId are required.' });
    return;
  }
  logisticsService.submitProofOfDelivery({
    shipmentId,
    photoDataUrl: photoDataUrl ?? 'data:image/png;base64,POD_PLACEHOLDER',
    riderId,
    capturedAt: new Date().toISOString(),
    latitude: latitude ?? 40.7128,
    longitude: longitude ?? -74.006,
  });
  res.json({ success: true, message: `Proof of delivery recorded for shipment ${shipmentId}.` });
});

// GET /api/v2/logistics/pod/:shipmentId
router.get('/pod/:shipmentId', (req: Request, res: Response): void => {
  const pod = logisticsService.getPod(req.params.shipmentId);
  if (!pod) {
    res.status(404).json({ error: 'PodNotFound', message: `No POD found for shipment ${req.params.shipmentId}.` });
    return;
  }
  res.json({ pod });
});

// ─── Geo-Fencing Endpoints ────────────────────────────────────────────────────

// GET /api/v2/logistics/geo-zones
router.get('/geo-zones', (_req: Request, res: Response): void => {
  res.json({ zones: geoFencingService.getZones() });
});

// POST /api/v2/logistics/geo-zones/proximity
// Body: { latitude, longitude, isColdChain? }
router.post('/geo-zones/proximity', (req: Request, res: Response): void => {
  const { latitude, longitude, isColdChain } = req.body;
  if (latitude === undefined || longitude === undefined) {
    res.status(400).json({ error: 'InvalidInput', message: 'latitude and longitude are required.' });
    return;
  }
  const scores = geoFencingService.scoreProximity({ latitude, longitude }, isColdChain ?? false);
  res.json({ deliveryCoord: { latitude, longitude }, scores });
});

// POST /api/v2/logistics/geo-zones/distance-matrix
router.post('/geo-zones/distance-matrix', async (req: Request, res: Response): Promise<void> => {
  const { originAddress, destinationLatitude, destinationLongitude, pharmacyLatitude, pharmacyLongitude } = req.body;
  try {
    const result = await geoFencingService.getDistanceMatrix(
      originAddress ?? '',
      { latitude: destinationLatitude ?? 40.7128, longitude: destinationLongitude ?? -74.006 },
      { latitude: pharmacyLatitude ?? 40.7128, longitude: pharmacyLongitude ?? -74.006 }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'DistanceMatrixFailed', message: (err as Error).message });
  }
});

// POST /api/v2/logistics/geo-zones (upsert a zone)
router.post('/geo-zones', (req: Request, res: Response): void => {
  const zone = req.body;
  if (!zone?.id || !zone?.pharmacyId) {
    res.status(400).json({ error: 'InvalidInput', message: 'zone.id and zone.pharmacyId are required.' });
    return;
  }
  const saved = geoFencingService.upsertZone(zone);
  res.status(201).json({ zone: saved });
});

export default router;
