import { Router, Request, Response } from 'express';
import { storage } from '../services/storageService';
import { tenantResolver } from '../middleware/tenantResolver';

const router = Router();

// Apply tenantResolver middleware to all tenant routes
router.use(tenantResolver);

// GET /api/v1/tenant/list
router.get('/list', (req: Request, res: Response): void => {
  const tenants = storage.getTenants();
  res.json({ count: tenants.length, tenants });
});

// GET /api/v1/tenant/dashboard/metrics
router.get('/dashboard/metrics', (req: Request, res: Response): void => {
  const tenant = req.tenantContext?.tenant || storage.getTenants()[0];
  const listings = storage.getListings(tenant.code);
  const winning = listings.filter(l => l.status === 'winning').length;
  const winRate = listings.length > 0 ? +((winning / listings.length) * 100).toFixed(1) : 78.4;

  res.json({
    tenant: {
      id: tenant.id,
      name: tenant.name,
      code: tenant.code,
      schema: tenant.schema,
      tier: tenant.tier,
      commissionRate: tenant.commissionRate
    },
    metrics: {
      monthlyGmv: tenant.monthlyGmv,
      activeSkus: listings.length || tenant.activeSkus,
      buyBoxWinRate: winRate,
      prescriptionAuditSlaMinutes: 14,
      coldChainComplianceRate: 99.8,
      outlets: tenant.outlets
    }
  });
});

// GET /api/v1/tenant/inventory
router.get('/inventory', (req: Request, res: Response): void => {
  const tenantCode = req.tenantContext?.tenantCode || 'apollo';
  const inventory = storage.getListings(tenantCode);
  res.json({
    tenantCode,
    schema: req.tenantContext?.schemaName || 'tnt_apollo_01',
    count: inventory.length,
    inventory
  });
});

// PATCH /api/v1/tenant/inventory/:skuId
router.patch('/inventory/:skuId', (req: Request, res: Response): void => {
  const skuId = req.params.skuId;
  const tenantCode = req.tenantContext?.tenantCode || 'apollo';
  const updates = req.body;

  const updated = storage.updateListing(skuId, updates, tenantCode);
  if (!updated) {
    res.status(404).json({ error: 'SkuNotFound', message: `SKU ${skuId} not found in tenant schema.` });
    return;
  }

  res.json({
    message: `SKU ${skuId} updated successfully.`,
    listing: updated
  });
});

// GET /api/v1/tenant/orders/queue
router.get('/orders/queue', (req: Request, res: Response): void => {
  const tenantName = req.tenantContext?.tenant?.name;
  const orders = storage.getOrders(tenantName);
  res.json({ count: orders.length, orders });
});

export default router;
