import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import catalogRoutes from './routes/catalogRoutes';
import pricingRoutes from './routes/pricingRoutes';
import orderRoutes from './routes/orderRoutes';
import prescriptionRoutes from './routes/prescriptionRoutes';
import tenantRoutes from './routes/tenantRoutes';
import telemetryRoutes from './routes/telemetryRoutes';
import logisticsRoutes from './routes/logisticsRoutes';
import iotRoutes from './routes/iotRoutes';
import { errorHandler } from './middleware/errorHandler';
import { storage } from './services/storageService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS & Security Headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-tenant-id');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Request Performance & Access Logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = performance.now();
  res.on('finish', () => {
    const duration = (performance.now() - start).toFixed(2);
    console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Platform Health & Metadata Check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'Generic Medicine Store & Multi-Tenant Modular Monolith',
    version: '4.0.0',
    phase: 'Phase 4: Pan-National Scale, Insurance Adjudication & Microservice Decomposition',
    timestamp: new Date().toISOString(),
    metrics: {
      activeTenants: storage.getTenants().length,
      activeOrders: storage.getOrders().length,
      activeCatalogListings: storage.getListings().length
    }
  });
});

// Mount Subsystem API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/pricing', pricingRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/cart', orderRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/tenant', tenantRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);

// Phase 2: Logistics & IoT Routes
app.use('/api/v2/logistics', logisticsRoutes);
app.use('/api/v2/iot', iotRoutes);

// Phase 3: Clinical EHR, DDI Engine, Voice Search, B2B Wholesale
import fhirRoutes from './routes/fhirRoutes';
import ddiRoutes from './routes/ddiRoutes';
import voiceRoutes from './routes/voiceRoutes';
import wholesaleRoutes from './routes/wholesaleRoutes';

app.use('/api/v3/fhir', fhirRoutes);
app.use('/api/v3/ddi', ddiRoutes);
app.use('/api/v3/voice', voiceRoutes);
app.use('/api/v3/wholesale', wholesaleRoutes);

// Phase 4: Insurance Adjudication, Hub Logistics, Event Bus & Microservices
import insuranceRoutes from './routes/insuranceRoutes';
import hubRoutes from './routes/hubRoutes';
import eventBusRoutes from './routes/eventBusRoutes';

app.use('/api/v4/insurance', insuranceRoutes);
app.use('/api/v4/hubs', hubRoutes);
app.use('/api/v4/events', eventBusRoutes);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Start Server if directly executed
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`Generic Medicine Store Modular Monolith Server Active`);
    console.log(`Listening on http://localhost:${PORT}`);
    console.log(`Health Check: http://localhost:${PORT}/health`);
    console.log(`Phase 1 Architecture: Multi-Tenant Schema Isolation Enabled`);
    console.log(`=======================================================`);
  });
}

export default app;
