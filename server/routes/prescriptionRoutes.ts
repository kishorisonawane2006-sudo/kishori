import { Router, Request, Response } from 'express';
import { prescriptionService } from '../services/prescriptionService';
import { storage } from '../services/storageService';

const router = Router();

// POST /api/v1/prescriptions/ocr
router.post('/ocr', async (req: Request, res: Response): Promise<void> => {
  const { imageBase64OrText } = req.body;

  try {
    const ocrResult = await prescriptionService.parsePrescription(imageBase64OrText || 'Standard medical prescription script');
    res.json(ocrResult);
  } catch (err) {
    res.status(500).json({
      error: 'OcrParsingFailed',
      message: (err as Error).message
    });
  }
});

// POST /api/v1/prescriptions/verify-audit
router.post('/verify-audit', (req: Request, res: Response): void => {
  const { rxNumber, pharmacistLicenseNumber, pharmacistName, decision, notes, orderId } = req.body;

  if (!rxNumber || !pharmacistLicenseNumber) {
    res.status(400).json({
      error: 'InvalidInput',
      message: 'rxNumber and pharmacistLicenseNumber are legally required.'
    });
    return;
  }

  try {
    const record = prescriptionService.verifyPrescription(
      rxNumber,
      pharmacistLicenseNumber,
      pharmacistName || 'Sarah Jenkins, RPh',
      decision || 'APPROVED',
      notes,
      orderId
    );

    res.json({
      message: `Prescription ${rxNumber} successfully verified by pharmacist.`,
      auditRecord: record
    });
  } catch (err) {
    res.status(400).json({ error: 'AuditFailed', message: (err as Error).message });
  }
});

// GET /api/v1/prescriptions/audits
router.get('/audits', (req: Request, res: Response): void => {
  const audits = storage.getAllAuditRecords();
  res.json({ count: audits.length, audits });
});

export default router;
