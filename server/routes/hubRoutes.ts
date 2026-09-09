import { Router, Request, Response } from 'express';
import { hubLogisticsService } from '../services/hubLogisticsService';

const router = Router();

// GET /api/v4/hubs
router.get('/', (_req: Request, res: Response): void => {
  const hubs = hubLogisticsService.getHubs();
  const metrics = hubLogisticsService.getPlatformMetrics();
  res.json({ count: hubs.length, hubs, platformMetrics: metrics });
});

// GET /api/v4/hubs/:id
router.get('/:id', (req: Request, res: Response): void => {
  const hub = hubLogisticsService.getHub(req.params.id);
  if (!hub) {
    res.status(404).json({ error: 'HubNotFound', message: `Hub ${req.params.id} not found.` });
    return;
  }
  res.json({ hub });
});

// POST /api/v4/hubs/forecast
router.post('/forecast', (req: Request, res: Response): void => {
  const { hubId, genericSalt, forecastPeriodDays } = req.body as {
    hubId: string;
    genericSalt: string;
    forecastPeriodDays?: number;
  };

  if (!hubId || !genericSalt) {
    res.status(400).json({ error: 'InvalidInput', message: 'hubId and genericSalt are required.' });
    return;
  }

  try {
    const forecast = hubLogisticsService.forecastDemand(hubId, genericSalt, forecastPeriodDays);
    res.json({ forecast });
  } catch (err) {
    res.status(400).json({ error: 'ForecastFailed', message: (err as Error).message });
  }
});

// POST /api/v4/hubs/replenish
router.post('/replenish', (req: Request, res: Response): void => {
  const { hubId, destinationBranchId, destinationBranchName, genericSalt, quantity, isColdChain, priorityLevel } = req.body;

  if (!hubId || !destinationBranchId || !genericSalt || !quantity) {
    res.status(400).json({ error: 'InvalidInput', message: 'hubId, destinationBranchId, genericSalt, and quantity are required.' });
    return;
  }

  try {
    const order = hubLogisticsService.createReplenishment({ hubId, destinationBranchId, destinationBranchName, genericSalt, quantity, isColdChain, priorityLevel });
    res.status(201).json({ message: `Replenishment order ${order.id} scheduled.`, order });
  } catch (err) {
    res.status(400).json({ error: 'ReplenishmentFailed', message: (err as Error).message });
  }
});

// GET /api/v4/hubs/replenishments
router.get('/replenishments', (req: Request, res: Response): void => {
  const hubId = req.query.hubId as string | undefined;
  const orders = hubLogisticsService.getReplenishmentOrders(hubId);
  res.json({ count: orders.length, orders });
});

// GET /api/v4/hubs/drone/corridors
router.get('/drone/corridors', (req: Request, res: Response): void => {
  const activeOnly = req.query.active === 'true';
  const corridors = hubLogisticsService.getCorridors(activeOnly);
  res.json({ count: corridors.length, corridors });
});

// POST /api/v4/hubs/drone/dispatch
router.post('/drone/dispatch', (req: Request, res: Response): void => {
  const { corridorId, orderId, patientAddress, payloadDescription, payloadWeightKg, isColdChain } = req.body;

  if (!corridorId || !orderId || !patientAddress || !payloadWeightKg) {
    res.status(400).json({ error: 'InvalidInput', message: 'corridorId, orderId, patientAddress, and payloadWeightKg are required.' });
    return;
  }

  try {
    const delivery = hubLogisticsService.dispatchDrone({ corridorId, orderId, patientAddress, payloadDescription, payloadWeightKg, isColdChain });
    res.status(201).json({
      message: `Drone ${delivery.droneId} dispatched via ${delivery.corridorName}. ETA: ${new Date(delivery.estimatedArrivalAt).toLocaleTimeString()}`,
      delivery,
    });
  } catch (err) {
    res.status(400).json({ error: 'DroneDispatchFailed', message: (err as Error).message });
  }
});

// GET /api/v4/hubs/drone/deliveries
router.get('/drone/deliveries', (_req: Request, res: Response): void => {
  const deliveries = hubLogisticsService.getDroneDeliveries();
  res.json({ count: deliveries.length, deliveries });
});

// GET /api/v4/hubs/cities/expansion
router.get('/cities/expansion', (req: Request, res: Response): void => {
  const status = req.query.status as string | undefined;
  const cities = hubLogisticsService.getCityExpansions(status as Parameters<typeof hubLogisticsService.getCityExpansions>[0]);
  res.json({ count: cities.length, cities });
});

export default router;
