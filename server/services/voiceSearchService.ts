import { storage } from './storageService';
import {
  VoiceSearchResult,
  PhoneticMatch,
  SupportedLanguage,
  AccessibilityPreferences,
  ContrastTheme,
  MedicineListing,
} from '../../src/types';

// ─── Supported Language Registry ─────────────────────────────────────────────

export const SUPPORTED_LANGUAGES: Array<{ code: SupportedLanguage; label: string; nativeName: string }> = [
  { code: 'en-US', label: 'English (US)',    nativeName: 'English'  },
  { code: 'hi-IN', label: 'Hindi (India)',   nativeName: 'हिंदी'    },
  { code: 'bn-IN', label: 'Bengali (India)', nativeName: 'বাংলা'    },
  { code: 'mr-IN', label: 'Marathi (India)', nativeName: 'मराठी'    },
  { code: 'ta-IN', label: 'Tamil (India)',   nativeName: 'தமிழ்'    },
  { code: 'te-IN', label: 'Telugu (India)',  nativeName: 'తెలుగు'   },
  { code: 'kn-IN', label: 'Kannada (India)', nativeName: 'ಕನ್ನಡ'    },
  { code: 'es-US', label: 'Spanish (US)',    nativeName: 'Español'  },
];

// ─── Transliteration / Normalisation Stubs for Vernacular Inputs ─────────────
// In production: replaced by Google Cloud Speech-to-Text API or Web Speech API

const VERNACULAR_DRUG_MAP: Record<string, string> = {
  // Hindi common names
  'paracetamol ki goli':  'Paracetamol',
  'bukhar ki dawa':       'Paracetamol',
  'sugar ki dawa':        'Metformin HCl',
  'bp ki tablet':         'Amlodipine Besylate',
  'cholesterol ki dawa':  'Atorvastatin Calcium',
  // Bengali
  'jworer bori':          'Paracetamol',
  'diabetiser oshudh':    'Metformin HCl',
  // Tamil
  'sugar maattiram':      'Metformin HCl',
  'irudayam maattiram':   'Atorvastatin Calcium',
  // Spanish
  'pastilla para el azucar': 'Metformin HCl',
  'pastilla para la presion': 'Amlodipine Besylate',
  'medicina para el colesterol': 'Atorvastatin Calcium',
};

// ─── Soundex Algorithm ────────────────────────────────────────────────────────

export function soundex(word: string): string {
  if (!word) return '';
  const w = word.toUpperCase().replace(/[^A-Z]/g, '');
  if (!w) return '';

  const MAP: Record<string, string> = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6',
  };

  let code = w[0];
  let prev = MAP[w[0]] ?? '0';

  for (let i = 1; i < w.length && code.length < 4; i++) {
    const c = MAP[w[i]];
    if (c && c !== prev) {
      code += c;
      prev = c;
    } else if (!c) {
      prev = '0';
    }
  }

  return (code + '000').slice(0, 4);
}

// ─── Double Metaphone Algorithm (simplified single-code) ─────────────────────

export function metaphone(word: string): string {
  if (!word) return '';
  let w = word.toUpperCase().replace(/[^A-Z]/g, '');
  if (!w) return '';

  // Handle initial silent letters
  w = w
    .replace(/^AE/, 'E')
    .replace(/^GN/, 'N')
    .replace(/^KN/, 'N')
    .replace(/^PN/, 'N')
    .replace(/^WR/, 'R');

  let result = '';
  let i = 0;
  while (i < w.length && result.length < 8) {
    const ch = w[i];
    const next = w[i + 1] ?? '';
    const prev = w[i - 1] ?? '';

    if ('AEIOU'.includes(ch) && i === 0) { result += ch; i++; continue; }
    if ('AEIOU'.includes(ch)) { i++; continue; }

    switch (ch) {
      case 'B': if (prev !== 'M') result += 'B'; break;
      case 'C':
        if (next === 'I' || next === 'E' || next === 'Y') result += 'S';
        else if (next === 'H') { result += 'X'; i++; }
        else result += 'K';
        break;
      case 'D':
        if (next === 'G' && 'IEY'.includes(w[i + 2] ?? '')) { result += 'J'; i++; }
        else result += 'T';
        break;
      case 'F': result += 'F'; break;
      case 'G':
        if (next === 'H') { if (i === 0 || !'AEIOU'.includes(prev)) result += 'K'; i++; }
        else if (next === 'N') break;
        else if ('IEY'.includes(next)) result += 'J';
        else result += 'K';
        break;
      case 'H': if ('AEIOU'.includes(next) && !'AEIOU'.includes(prev)) result += 'H'; break;
      case 'J': result += 'J'; break;
      case 'K': if (prev !== 'C') result += 'K'; break;
      case 'L': result += 'L'; break;
      case 'M': result += 'M'; break;
      case 'N': result += 'N'; break;
      case 'P': result += next === 'H' ? 'F' : 'P'; if (next === 'H') i++; break;
      case 'Q': result += 'K'; break;
      case 'R': result += 'R'; break;
      case 'S':
        if (next === 'H' || (next === 'I' && (w[i + 2] === 'O' || w[i + 2] === 'A'))) result += 'X';
        else result += 'S';
        break;
      case 'T':
        if (next === 'H') result += '0';
        else if (!(next === 'I' && (w[i + 2] === 'A' || w[i + 2] === 'O'))) result += 'T';
        break;
      case 'V': result += 'F'; break;
      case 'W': case 'Y': if ('AEIOU'.includes(next)) result += ch; break;
      case 'X': result += 'KS'; break;
      case 'Z': result += 'S'; break;
      default: break;
    }
    i++;
  }
  return result;
}

// ─── Levenshtein Edit Distance ────────────────────────────────────────────────

export function editDistance(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── Known Molecule Dictionary ────────────────────────────────────────────────

const MOLECULE_DICTIONARY: string[] = [
  'Atorvastatin Calcium', 'Metformin HCl', 'Metformin Hydrochloride',
  'Amoxicillin Trihydrate', 'Amoxicillin', 'Clavulanate Potassium',
  'Sertraline HCl', 'Sertraline Hydrochloride',
  'Albuterol Sulfate', 'Salbutamol Sulfate',
  'Levothyroxine Sodium', 'Amlodipine Besylate', 'Lisinopril',
  'Rosuvastatin Calcium', 'Omeprazole', 'Pantoprazole Sodium',
  'Azithromycin', 'Ciprofloxacin HCl', 'Doxycycline Hyclate',
  'Ibuprofen', 'Paracetamol', 'Acetaminophen', 'Tramadol Hydrochloride',
  'Warfarin Sodium', 'Spironolactone', 'Furosemide',
  'Insulin Glargine', 'Insulin Aspart', 'Insulin Lispro',
  'Montelukast Sodium', 'Cetirizine HCl', 'Loratadine',
  'Sildenafil Citrate', 'Tadalafil',
  'Clarithromycin', 'Penicillin G Potassium',
  'Calcium Carbonate', 'Vitamin D3', 'Folic Acid',
];

// ─── Phonetic Matching ────────────────────────────────────────────────────────

function findPhoneticMatches(query: string, limit = 5): PhoneticMatch[] {
  const qSoundex   = soundex(query);
  const qMetaphone = metaphone(query);
  const qLower     = query.toLowerCase();

  const scored = MOLECULE_DICTIONARY.map(molecule => {
    const primaryWord = molecule.split(' ')[0];
    const mSoundex    = soundex(primaryWord);
    const mMetaphone  = metaphone(primaryWord);
    const dist        = editDistance(qLower, primaryWord.toLowerCase());
    const maxLen      = Math.max(query.length, primaryWord.length);
    const editSim     = 1 - dist / maxLen;

    // Confidence: weighted combo of soundex match, metaphone match, edit similarity
    const soundexMatch  = qSoundex === mSoundex ? 1 : 0;
    const metaMatch     = qMetaphone === mMetaphone ? 1 : (qMetaphone.slice(0, 3) === mMetaphone.slice(0, 3) ? 0.5 : 0);
    const confidence    = +(0.35 * soundexMatch + 0.35 * metaMatch + 0.30 * editSim).toFixed(3);

    return {
      inputTerm: query,
      matchedMolecule: molecule,
      soundexCode: mSoundex,
      metaphoneCode: mMetaphone,
      editDistance: dist,
      confidence,
    } as PhoneticMatch;
  });

  return scored
    .filter(m => m.confidence > 0.3)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, limit);
}

// ─── Accessibility Preferences Storage ───────────────────────────────────────

const accessibilityStore = new Map<string, AccessibilityPreferences>();

// ─── Voice Search Service ─────────────────────────────────────────────────────

export class VoiceSearchService {
  /**
   * Workstream 3.3 — Multilingual Voice Search.
   * Normalises input, applies phonetic matching, resolves to catalog molecules.
   * Quality Gate: latency < 1,500ms — achieved through pure in-process algorithms.
   */
  public search(rawTranscript: string, detectedLanguage: SupportedLanguage = 'en-US'): VoiceSearchResult {
    const startMs = performance.now();

    // Step 1 — Normalise & transliterate vernacular inputs
    const lowerRaw = rawTranscript.toLowerCase().trim();
    const vernacularMapped = VERNACULAR_DRUG_MAP[lowerRaw];
    const normalizedQuery = vernacularMapped ?? rawTranscript.trim();

    // Step 2 — Direct catalog search (brand + salt)
    const catalog = storage.getListings();
    const directMatches = catalog.filter(l =>
      l.brandName.toLowerCase().includes(normalizedQuery.toLowerCase()) ||
      l.genericSalt.toLowerCase().includes(normalizedQuery.toLowerCase())
    );

    // Step 3 — Phonetic matching for misspellings/mispronunciations
    const firstWord = normalizedQuery.split(' ')[0];
    const phoneticMatches = findPhoneticMatches(firstWord);

    // Step 4 — Resolve final molecule list
    const resolvedFromDirect = directMatches.map(l => l.genericSalt);
    const resolvedFromPhonetic = phoneticMatches
      .filter(m => m.confidence >= 0.55)
      .map(m => m.matchedMolecule);

    const resolvedMolecules = [
      ...new Set([...resolvedFromDirect, ...resolvedFromPhonetic]),
    ].slice(0, 8);

    const latencyMs = +(performance.now() - startMs).toFixed(2);
    const confidence = phoneticMatches[0]?.confidence ?? (directMatches.length > 0 ? 0.95 : 0.0);

    return {
      rawTranscript,
      normalizedQuery,
      detectedLanguage,
      phoneticCorrections: phoneticMatches,
      resolvedMolecules,
      latencyMs,
      confidence,
    };
  }

  /**
   * Pure phonetic match — used independently for suggestion tooltips.
   */
  public phoneticMatch(term: string, limit = 5): PhoneticMatch[] {
    return findPhoneticMatches(term, limit);
  }

  /** Returns all supported languages */
  public getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // ─── Accessibility Preferences ─────────────────────────────────────────────

  public getAccessibilityPreferences(patientId: string): AccessibilityPreferences {
    return accessibilityStore.get(patientId) ?? {
      patientId,
      theme: 'default',
      fontSize: 'normal',
      screenReaderEnabled: false,
      reduceMotion: false,
      preferredLanguage: 'en-US',
      voiceSearchEnabled: true,
    };
  }

  public saveAccessibilityPreferences(prefs: AccessibilityPreferences): AccessibilityPreferences {
    accessibilityStore.set(prefs.patientId, prefs);
    return prefs;
  }

  // ─── Exported algorithms for test suite ────────────────────────────────────
  public soundex  = soundex;
  public metaphone = metaphone;
  public editDistance = editDistance;
}

export const voiceSearchService = new VoiceSearchService();
