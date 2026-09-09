import { Router, Request, Response } from 'express';
import { buyBoxService } from '../services/buyBoxService';

const router = Router();

// GET /api/v1/pricing/buy-box/:saltId
router.get('/buy-box/:saltId', (req: Request, res: Response): void => {
  const saltId = req.params.saltId;
  const distanceMiles = req.query.distance ? parseFloat(req.query.distance as string) : 3.5;
  const result = buyBoxService.evaluateBuyBox(saltId, distanceMiles);
  res.json(result);
});

// POST /api/v1/pricing/reprice-simulation
router.post('/reprice-simulation', (req: Request, res: Response): void => {
  const { listingId, newPrice, floorPrice, targetUndercutPercent } = req.body;

  if (!listingId || floorPrice === undefined) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'listingId and floorPrice are required.'
    });
    return;
  }

  try {
    const simulation = buyBoxService.simulateRepricing({
      listingId,
      newPrice: newPrice || floorPrice,
      floorPrice,
      targetUndercutPercent
    });
    res.json(simulation);
  } catch (err) {
    res.status(404).json({ error: 'ListingNotFound', message: (err as Error).message });
  }
});

export default router;
