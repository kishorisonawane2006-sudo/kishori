import { Router, Request, Response } from 'express';
import { wholesaleService } from '../services/wholesaleService';
import { B2bCreditTermDays, B2bOrderStatus, CertificateOfAnalysis } from '../../src/types';

const router = Router();

// ── Manufacturers ─────────────────────────────────────────────────────────────

// GET /api/v3/wholesale/manufacturers
router.get('/manufacturers', (_req: Request, res: Response): void => {
  const manufacturers = wholesaleService.getManufacturers();
  res.json({ count: manufacturers.length, manufacturers });
});

// GET /api/v3/wholesale/manufacturers/:id
router.get('/manufacturers/:id', (req: Request, res: Response): void => {
  const mfr = wholesaleService.getManufacturer(req.params.id);
  if (!mfr) {
    res.status(404).json({ error: 'ManufacturerNotFound', message: `Manufacturer ${req.params.id} not found.` });
    return;
  }
  res.json({ manufacturer: mfr });
});

// ── Listings ──────────────────────────────────────────────────────────────────

// GET /api/v3/wholesale/listings
router.get('/listings', (req: Request, res: Response): void => {
  const manufacturerId = req.query.manufacturerId as string | undefined;
  const listings = wholesaleService.getListings(manufacturerId);
  res.json({ count: listings.length, listings });
});

// GET /api/v3/wholesale/listings/:id
router.get('/listings/:id', (req: Request, res: Response): void => {
  const listing = wholesaleService.getListing(req.params.id);
  if (!listing) {
    res.status(404).json({ error: 'ListingNotFound', message: `Listing ${req.params.id} not found.` });
    return;
  }
  res.json({ listing });
});

// POST /api/v3/wholesale/listings
router.post('/listings', (req: Request, res: Response): void => {
  try {
    const listing = wholesaleService.createListing(req.body);
    res.status(201).json({ message: 'Wholesale listing created.', listing });
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg.startsWith('COA_REQUIRED') ? 422 : 400;
    res.status(status).json({ error: 'ListingCreationFailed', message: msg });
  }
});

// POST /api/v3/wholesale/listings/:id/price-quote
// Returns price calculation for a given quantity
router.post('/listings/:id/price-quote', (req: Request, res: Response): void => {
  const { quantity } = req.body as { quantity: number };
  const listing = wholesaleService.getListing(req.params.id);
  if (!listing) {
    res.status(404).json({ error: 'ListingNotFound', message: `Listing ${req.params.id} not found.` });
    return;
  }
  if (!quantity || quantity < 1) {
    res.status(400).json({ error: 'InvalidQuantity', message: 'quantity must be ≥ 1.' });
    return;
  }
  const quote = wholesaleService.calculateWholesalePrice(listing, quantity);
  res.json({ listingId: listing.id, genericSalt: listing.genericSalt, quantity, ...quote });
});

// ── Certificate of Analysis ───────────────────────────────────────────────────

// GET /api/v3/wholesale/coa
router.get('/coa', (_req: Request, res: Response): void => {
  const coas = wholesaleService.getAllCoas();
  res.json({ count: coas.length, coas });
});

// GET /api/v3/wholesale/coa/:id
router.get('/coa/:id', (req: Request, res: Response): void => {
  const coa = wholesaleService.getCoa(req.params.id);
  if (!coa) {
    res.status(404).json({ error: 'CoaNotFound', message: `Certificate of Analysis ${req.params.id} not found.` });
    return;
  }
  res.json({ coa });
});

// POST /api/v3/wholesale/coa-upload
// Manufacturer submits a CoA; platform auto-verifies
router.post('/coa-upload', (req: Request, res: Response): void => {
  const data = req.body as Omit<CertificateOfAnalysis, 'id' | 'status' | 'verifiedByPlatformAt'>;

  if (!data.batchNumber || !data.manufacturerId || !data.listingId) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'batchNumber, manufacturerId, and listingId are required.',
    });
    return;
  }

  const coa = wholesaleService.submitCoa(data);

  res.status(201).json({
    message: `CoA ${coa.id} submitted. Verification status: ${coa.status}`,
    coaStatus: coa.status,
    verificationPassed: coa.status === 'Verified',
    coa,
  });
});

// ── Orders ────────────────────────────────────────────────────────────────────

// GET /api/v3/wholesale/orders
router.get('/orders', (req: Request, res: Response): void => {
  const tenantId = req.query.tenantId as string | undefined;
  const orders = wholesaleService.getOrders(tenantId);
  res.json({ count: orders.length, orders });
});

// GET /api/v3/wholesale/orders/:id
router.get('/orders/:id', (req: Request, res: Response): void => {
  const order = wholesaleService.getOrder(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'OrderNotFound', message: `B2B order ${req.params.id} not found.` });
    return;
  }
  res.json({ order });
});

// POST /api/v3/wholesale/orders
router.post('/orders', (req: Request, res: Response): void => {
  const { buyerTenantId, buyerTenantName, listingId, quantity, creditTermDays } = req.body as {
    buyerTenantId: string;
    buyerTenantName: string;
    listingId: string;
    quantity: number;
    creditTermDays?: B2bCreditTermDays;
  };

  if (!buyerTenantId || !listingId || !quantity) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'buyerTenantId, listingId, and quantity are required.',
    });
    return;
  }

  try {
    const order = wholesaleService.placeOrder({ buyerTenantId, buyerTenantName, listingId, quantity, creditTermDays });
    res.status(201).json({
      message: `B2B order ${order.orderNumber} placed. Total: $${order.orderTotal.toFixed(2)} (${order.discountPercent}% bulk discount).`,
      order,
    });
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg.startsWith('COA_NOT_VERIFIED') ? 422 : msg.startsWith('CREDIT_LIMIT') ? 402 : 400;
    res.status(status).json({ error: 'OrderFailed', message: msg });
  }
});

// PATCH /api/v3/wholesale/orders/:id/status
router.patch('/orders/:id/status', (req: Request, res: Response): void => {
  const { status } = req.body as { status: B2bOrderStatus };
  try {
    const order = wholesaleService.advanceOrderStatus(req.params.id, status);
    res.json({ message: `Order ${req.params.id} advanced to ${status}.`, order });
  } catch (err) {
    res.status(404).json({ error: 'OrderNotFound', message: (err as Error).message });
  }
});

// ── Credit Accounts ───────────────────────────────────────────────────────────

// GET /api/v3/wholesale/credit-terms
router.get('/credit-terms', (_req: Request, res: Response): void => {
  const accounts = wholesaleService.getAllCreditAccounts();
  res.json({ count: accounts.length, accounts });
});

// GET /api/v3/wholesale/credit-terms/:tenantId
router.get('/credit-terms/:tenantId', (req: Request, res: Response): void => {
  const account = wholesaleService.getCreditAccount(req.params.tenantId);
  if (!account) {
    res.status(404).json({ error: 'AccountNotFound', message: `No credit account for tenant ${req.params.tenantId}.` });
    return;
  }
  res.json({ account });
});

export default router;
