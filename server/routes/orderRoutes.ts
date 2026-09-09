import { Router, Request, Response } from 'express';
import { orderService } from '../services/orderService';
import { storage } from '../services/storageService';

const router = Router();

// --- Cart Endpoints ---
const getCartHandler = (req: Request, res: Response): void => {
  res.json({ items: storage.getCart() });
};

const addToCartHandler = (req: Request, res: Response): void => {
  const item = req.body;
  const current = storage.getCart();
  const existingIdx = current.findIndex(i => i.id === item.id);

  if (existingIdx !== -1) {
    current[existingIdx].quantity += item.quantity || 1;
  } else {
    current.push(item);
  }
  storage.setCart(current);
  res.json({ success: true, items: current });
};

const removeCartHandler = (req: Request, res: Response): void => {
  const id = req.params.id;
  const filtered = storage.getCart().filter(i => i.id !== id);
  storage.setCart(filtered);
  res.json({ success: true, items: filtered });
};

router.get('/', getCartHandler);
router.get('/cart', getCartHandler);
router.post('/items', addToCartHandler);
router.post('/cart/items', addToCartHandler);
router.delete('/items/:id', removeCartHandler);
router.delete('/cart/items/:id', removeCartHandler);

// --- Checkout Handler ---
const checkoutHandler = (req: Request, res: Response): void => {
  const { customerId, customerName, customerAddress, tenantCode, items, deliveryType, rxNumber, doctorName } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ error: 'EmptyCart', message: 'Cannot checkout with empty items.' });
    return;
  }

  const order = orderService.checkout({
    customerId: customerId || 'usr-001',
    customerName: customerName || 'Eleanor Vance',
    customerAddress: customerAddress || '742 Evergreen Terrace, Springfield, OR',
    tenantCode: tenantCode || 'apollo',
    items,
    deliveryType: deliveryType || 'Standard Ground',
    rxNumber,
    doctorName
  });

  storage.setCart([]);

  res.status(201).json({
    message: 'Order created and held in escrow.',
    order
  });
};

router.post('/checkout', checkoutHandler);
router.post('/orders/checkout', checkoutHandler);

// --- Order Patient History ---
const historyHandler = (req: Request, res: Response): void => {
  const orders = storage.getOrders();
  res.json({ orders });
};

router.get('/patient/history', historyHandler);
router.get('/orders/patient/history', historyHandler);

// --- Order Tracking ---
const trackingHandler = (req: Request, res: Response): void => {
  const order = storage.getOrderById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'OrderNotFound', message: `Order ${req.params.id} not found.` });
    return;
  }

  const telemetry = storage.getLatestTelemetry(req.params.id);
  res.json({
    order,
    telemetry: telemetry || {
      temperatureCelsius: 4.2,
      isBreached: false,
      sensorStatus: 'Optimal (2°C - 8°C)',
      lastSync: new Date().toISOString()
    }
  });
};

router.get('/:id/tracking', trackingHandler);
router.get('/orders/:id/tracking', trackingHandler);

// --- Order Status Advancement ---
const statusHandler = (req: Request, res: Response): void => {
  const { status } = req.body;
  try {
    const updated = orderService.advanceStatus(req.params.id, status);
    res.json({ order: updated });
  } catch (err) {
    res.status(404).json({ error: 'OrderNotFound', message: (err as Error).message });
  }
};

router.patch('/:id/status', statusHandler);
router.patch('/orders/:id/status', statusHandler);

export default router;
