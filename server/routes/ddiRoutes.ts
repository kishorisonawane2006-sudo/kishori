import { Router, Request, Response } from 'express';
import { ddiService } from '../services/ddiService';

const router = Router();

// POST /api/v3/ddi/evaluate
// Evaluates drug-drug interactions for a patient's cart + chronic medications
router.post('/evaluate', async (req: Request, res: Response): Promise<void> => {
  const { patientId, cartSalts, chronicMedicationSalts, orderId } = req.body as {
    patientId: string;
    cartSalts: string[];
    chronicMedicationSalts?: string[];
    orderId?: string;
  };

  if (!patientId || !Array.isArray(cartSalts) || cartSalts.length === 0) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'patientId and cartSalts[] are required.',
    });
    return;
  }

  try {
    const payload = await ddiService.evaluate(
      patientId,
      cartSalts,
      chronicMedicationSalts ?? [],
      orderId
    );

    res.json({
      safeToDispense: !payload.hasCritical,
      interactionCount: payload.interactions.length,
      hasCriticalContraindication: payload.hasCritical,
      requiresPharmacistReview: payload.hasCritical,
      aiAssisted: payload.aiAssisted,
      confidenceScore: payload.confidenceScore,
      payload,
    });
  } catch (err) {
    res.status(500).json({ error: 'DdiEvaluationFailed', message: (err as Error).message });
  }
});

// GET /api/v3/ddi/alerts/:patientId
// Returns historical DDI alerts for a patient
router.get('/alerts/:patientId', (req: Request, res: Response): void => {
  const alerts = ddiService.getAlertsForPatient(req.params.patientId);
  res.json({ patientId: req.params.patientId, count: alerts.length, alerts });
});

// POST /api/v3/ddi/pharmacist-review
// Pharmacist acknowledges and resolves a CDS flag
router.post('/pharmacist-review', (req: Request, res: Response): void => {
  const { orderId, pharmacistId, decision, notes } = req.body as {
    orderId: string;
    pharmacistId: string;
    decision: 'APPROVED_WITH_COUNSELLING' | 'REJECTED_UNSAFE';
    notes?: string;
  };

  if (!orderId || !pharmacistId || !decision) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'orderId, pharmacistId, and decision are required.',
    });
    return;
  }

  try {
    const flag = ddiService.reviewCdsFlag(orderId, pharmacistId, decision, notes);
    res.json({
      message: `CDS flag for order ${orderId} reviewed: ${decision}`,
      flag,
    });
  } catch (err) {
    res.status(404).json({ error: 'FlagNotFound', message: (err as Error).message });
  }
});

// GET /api/v3/ddi/cds-flags/pending
// Returns all orders pending pharmacist CDS review
router.get('/cds-flags/pending', (_req: Request, res: Response): void => {
  const flags = ddiService.getPendingCdsFlags();
  res.json({ count: flags.length, flags });
});

// GET /api/v3/ddi/database
// Returns the clinical interaction database (for pharmacist reference)
router.get('/database', (_req: Request, res: Response): void => {
  const interactions = ddiService.getInteractionDatabase();
  res.json({ count: interactions.length, interactions });
});

export default router;
