import { Router, Request, Response } from 'express';
import { voiceSearchService } from '../services/voiceSearchService';
import { SupportedLanguage, AccessibilityPreferences } from '../../src/types';

const router = Router();

// POST /api/v3/voice/search
// Multilingual voice transcript → molecule resolution
router.post('/search', (req: Request, res: Response): void => {
  const { transcript, language } = req.body as {
    transcript: string;
    language?: SupportedLanguage;
  };

  if (!transcript || transcript.trim() === '') {
    res.status(400).json({ error: 'EmptyTranscript', message: 'transcript is required.' });
    return;
  }

  const result = voiceSearchService.search(transcript, language ?? 'en-US');

  res.json({
    slaCompliant: result.latencyMs < 1500,
    latencyMs: result.latencyMs,
    result,
  });
});

// POST /api/v3/voice/phonetic-match
// Pure phonetic matching for a single drug term
router.post('/phonetic-match', (req: Request, res: Response): void => {
  const { term, limit } = req.body as { term: string; limit?: number };

  if (!term || term.trim() === '') {
    res.status(400).json({ error: 'EmptyTerm', message: 'term is required.' });
    return;
  }

  const matches = voiceSearchService.phoneticMatch(term, limit ?? 5);
  res.json({
    term,
    matchCount: matches.length,
    matches,
  });
});

// GET /api/v3/voice/languages
// Returns all supported languages for voice input
router.get('/languages', (_req: Request, res: Response): void => {
  const languages = voiceSearchService.getSupportedLanguages();
  res.json({ count: languages.length, languages });
});

// GET /api/v3/voice/accessibility/:patientId
router.get('/accessibility/:patientId', (req: Request, res: Response): void => {
  const prefs = voiceSearchService.getAccessibilityPreferences(req.params.patientId);
  res.json({ prefs });
});

// PATCH /api/v3/voice/accessibility/:patientId
router.patch('/accessibility/:patientId', (req: Request, res: Response): void => {
  const updates = req.body as Partial<AccessibilityPreferences>;
  const existing = voiceSearchService.getAccessibilityPreferences(req.params.patientId);
  const merged: AccessibilityPreferences = { ...existing, ...updates, patientId: req.params.patientId };
  const saved = voiceSearchService.saveAccessibilityPreferences(merged);
  res.json({ saved });
});

export default router;
