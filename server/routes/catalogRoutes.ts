import { Router, Request, Response } from 'express';
import { catalogService } from '../services/catalogService';

const router = Router();

// GET /api/v1/catalog/search?q={query}
router.get('/search', (req: Request, res: Response): void => {
  const query = (req.query.q as string) || '';
  const results = catalogService.search(query);
  res.json({
    query,
    count: results.length,
    results
  });
});

// GET /api/v1/catalog/compare/:identifier
router.get('/compare/:identifier', (req: Request, res: Response): void => {
  const identifier = req.params.identifier;
  const matrix = catalogService.getComparisonMatrix(identifier);

  if (!matrix) {
    res.status(404).json({
      error: 'MedicineNotFound',
      message: `No active generic salt or brand match found for: ${identifier}`
    });
    return;
  }

  res.json(matrix);
});

// GET /api/v1/catalog/categories
router.get('/categories', (req: Request, res: Response): void => {
  const categories = catalogService.getCategories();
  res.json({ categories });
});

export default router;
