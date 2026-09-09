import { Router, Request, Response } from 'express';
import { fhirService } from '../services/fhirService';
import { FhirMedicationRequest } from '../../src/types';

const router = Router();

// POST /api/v3/fhir/medication-request
// Ingests a FHIR R4 MedicationRequest from an EHR system
router.post('/medication-request', (req: Request, res: Response): void => {
  const { resource, providerId } = req.body as {
    resource: FhirMedicationRequest;
    providerId?: string;
  };

  if (!resource) {
    res.status(400).json({ error: 'MissingResource', message: 'FHIR MedicationRequest resource is required.' });
    return;
  }

  try {
    const result = fhirService.ingestMedicationRequest(resource, providerId);
    res.status(201).json({
      message: `FHIR MedicationRequest ${result.fhirRequestId} ingested successfully.`,
      fhirConformance: 'HL7 FHIR R4',
      signatureStatus: result.signatureStatus,
      cartHydrationReady: result.cartHydrationStatus === 'READY',
      result,
    });
  } catch (err) {
    const msg = (err as Error).message;
    const status = msg.startsWith('FHIR_CONFORMANCE_ERROR') ? 422 : 500;
    res.status(status).json({ error: 'FhirIngestError', message: msg });
  }
});

// POST /api/v3/fhir/verify-signature
// Standalone doctor digital signature / NMC certificate verification
router.post('/verify-signature', (req: Request, res: Response): void => {
  const { registrationNumber, certificateThumbprint } = req.body as {
    registrationNumber: string;
    certificateThumbprint?: string;
  };

  if (!registrationNumber) {
    res.status(400).json({ error: 'MissingInput', message: 'registrationNumber is required.' });
    return;
  }

  const status = fhirService.verifySignature(registrationNumber, certificateThumbprint);
  res.json({
    registrationNumber,
    signatureStatus: status,
    verified: status === 'VERIFIED',
    registry: 'NMC / State Medical Council',
  });
});

// GET /api/v3/fhir/cart-hydration/:token
// Resolves a magic-link cart hydration token
router.get('/cart-hydration/:token', (req: Request, res: Response): void => {
  const payload = fhirService.resolveCartHydration(req.params.token);
  if (!payload) {
    res.status(404).json({ error: 'TokenNotFound', message: `Cart hydration token ${req.params.token} not found or expired.` });
    return;
  }
  res.json({ payload });
});

// GET /api/v3/fhir/providers
// Returns registered EHR provider integrations
router.get('/providers', (_req: Request, res: Response): void => {
  const providers = fhirService.getProviders();
  res.json({ count: providers.length, providers });
});

// GET /api/v3/fhir/requests
// Returns all ingested FHIR medication requests
router.get('/requests', (_req: Request, res: Response): void => {
  const requests = fhirService.getAllMedicationRequests();
  res.json({ count: requests.length, requests });
});

// GET /api/v3/fhir/requests/:id
router.get('/requests/:id', (req: Request, res: Response): void => {
  const resource = fhirService.getMedicationRequest(req.params.id);
  if (!resource) {
    res.status(404).json({ error: 'NotFound', message: `FHIR request ${req.params.id} not found.` });
    return;
  }
  res.json({ resource });
});

export default router;
