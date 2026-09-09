import { Router, Request, Response } from 'express';
import { insuranceService } from '../services/insuranceService';
import { NcpdpClaimRequest } from '../../src/types';

const router = Router();

// POST /api/v4/insurance/claims/submit
router.post('/claims/submit', (req: Request, res: Response): void => {
  const request = req.body as NcpdpClaimRequest;

  if (!request.rxBin || !request.rxPcn || !request.ndc11) {
    res.status(400).json({ error: 'InvalidInput', message: 'rxBin, rxPcn, and ndc11 are required NCPDP fields.' });
    return;
  }

  try {
    const claim = insuranceService.submitClaim(request);
    res.status(201).json({
      message: `Claim ${claim.claimNumber} submitted and adjudicated in ${claim.adjudicationLatencyMs}ms.`,
      slaCompliant: (claim.adjudicationLatencyMs ?? 0) < 3000,
      status: claim.status,
      claim,
    });
  } catch (err) {
    res.status(500).json({ error: 'ClaimSubmissionFailed', message: (err as Error).message });
  }
});

// POST /api/v4/insurance/claims/copay-calculate
router.post('/claims/copay-calculate', (req: Request, res: Response): void => {
  const { request, genericSalt } = req.body as { request: NcpdpClaimRequest; genericSalt?: string };

  if (!request?.submittedIngredientCost) {
    res.status(400).json({ error: 'InvalidInput', message: 'request.submittedIngredientCost is required.' });
    return;
  }

  const result = insuranceService.calculateCoPay(`calc-${Date.now()}`, request, genericSalt);
  res.json({
    slaCompliant: result.latencyMs < 3000,
    latencyMs: result.latencyMs,
    result,
  });
});

// GET /api/v4/insurance/claims/:id
router.get('/claims/:id', (req: Request, res: Response): void => {
  const claim = insuranceService.getClaim(req.params.id);
  if (!claim) {
    res.status(404).json({ error: 'ClaimNotFound', message: `Claim ${req.params.id} not found.` });
    return;
  }
  res.json({ claim });
});

// GET /api/v4/insurance/claims
router.get('/claims', (req: Request, res: Response): void => {
  const patientId = req.query.patientId as string | undefined;
  const claims = insuranceService.getAllClaims(patientId);
  res.json({ count: claims.length, claims });
});

// POST /api/v4/insurance/claims/:id/appeal
router.post('/claims/:id/appeal', (req: Request, res: Response): void => {
  const { appealNote } = req.body as { appealNote: string };
  if (!appealNote) {
    res.status(400).json({ error: 'InvalidInput', message: 'appealNote is required.' });
    return;
  }
  try {
    const claim = insuranceService.submitAppeal(req.params.id, appealNote);
    res.json({ message: `Appeal submitted for claim ${req.params.id}.`, status: claim.status, claim });
  } catch (err) {
    res.status(400).json({ error: 'AppealFailed', message: (err as Error).message });
  }
});

// GET /api/v4/insurance/tpa/providers
router.get('/tpa/providers', (_req: Request, res: Response): void => {
  res.json({ providers: insuranceService.getProviders() });
});

// POST /api/v4/insurance/tpa/:id/reconcile
router.post('/tpa/:id/reconcile', (req: Request, res: Response): void => {
  const batch = insuranceService.runBatchReconciliation(req.params.id);
  res.json({ message: `Batch reconciliation complete for TPA ${req.params.id}.`, batch });
});

// GET /api/v4/insurance/reconciliations
router.get('/reconciliations', (_req: Request, res: Response): void => {
  res.json({ reconciliations: insuranceService.getBatchReconciliations() });
});

export default router;
