import { Router, Request, Response } from 'express';
import { eventBusService } from '../services/eventBusService';
import { microserviceRegistry } from '../services/microserviceRegistry';
import { DomainEventType } from '../../src/types';

const router = Router();

// POST /api/v4/events/publish
router.post('/publish', (req: Request, res: Response): void => {
  const { topic, eventType, partitionKey, payload } = req.body as {
    topic: string;
    eventType: DomainEventType;
    partitionKey: string;
    payload: Record<string, unknown>;
  };

  if (!topic || !eventType || !partitionKey) {
    res.status(400).json({ error: 'InvalidInput', message: 'topic, eventType, and partitionKey are required.' });
    return;
  }

  try {
    const msg = eventBusService.publish(topic, eventType, partitionKey, payload ?? {});
    res.status(201).json({
      message: `Event ${msg.id} published to topic "${topic}".`,
      event: msg,
    });
  } catch (err) {
    res.status(400).json({ error: 'PublishFailed', message: (err as Error).message });
  }
});

// GET /api/v4/events/stream/:topic — returns recent messages for a topic
router.get('/stream/:topic', (req: Request, res: Response): void => {
  const limit = parseInt(req.query.limit as string ?? '50', 10);
  try {
    const messages = eventBusService.getMessages(req.params.topic, limit);
    res.json({ topic: req.params.topic, count: messages.length, messages });
  } catch (err) {
    res.status(400).json({ error: 'StreamFailed', message: (err as Error).message });
  }
});

// GET /api/v4/events/topics
router.get('/topics', (_req: Request, res: Response): void => {
  const topics = eventBusService.getTopics();
  const stats  = eventBusService.getStats();
  res.json({ topics, stats });
});

// GET /api/v4/events/health
router.get('/health', (_req: Request, res: Response): void => {
  const stats   = eventBusService.getStats();
  const summary = microserviceRegistry.getHealthSummary();
  const eventBusSvc = microserviceRegistry.getService('svc-eventbus-01');

  res.json({
    eventBus: {
      status: eventBusSvc?.status ?? 'Unknown',
      ...stats,
    },
    microservices: summary,
  });
});

// POST /api/v4/events/concurrency-test
router.post('/concurrency-test', (req: Request, res: Response): void => {
  const targetRps = req.body.targetRps ? parseInt(req.body.targetRps, 10) : 100_000;
  const result = microserviceRegistry.runConcurrencyTest(targetRps);
  res.json({
    qualityGateTarget: '100,000 req/s with p99 < 100ms',
    slaCompliant: result.slaCompliant,
    achievedRps: result.achievedRps,
    result,
  });
});

// GET /api/v4/events/microservices/registry
router.get('/microservices/registry', (req: Request, res: Response): void => {
  const tier = req.query.tier as Parameters<typeof microserviceRegistry.getServices>[0];
  const services = microserviceRegistry.getServices(tier);
  const summary  = microserviceRegistry.getHealthSummary();
  res.json({ summary, count: services.length, services });
});

// GET /api/v4/events/microservices/:serviceId
router.get('/microservices/:serviceId', (req: Request, res: Response): void => {
  const svc = microserviceRegistry.getService(req.params.serviceId);
  if (!svc) {
    res.status(404).json({ error: 'ServiceNotFound', message: `Service ${req.params.serviceId} not found.` });
    return;
  }
  res.json({ service: svc });
});

// PATCH /api/v4/events/microservices/:serviceId/status
router.patch('/microservices/:serviceId/status', (req: Request, res: Response): void => {
  const { status } = req.body;
  try {
    const svc = microserviceRegistry.updateServiceStatus(req.params.serviceId, status);
    res.json({ message: `Service ${req.params.serviceId} status updated to ${status}.`, service: svc });
  } catch (err) {
    res.status(404).json({ error: 'ServiceNotFound', message: (err as Error).message });
  }
});

export default router;
