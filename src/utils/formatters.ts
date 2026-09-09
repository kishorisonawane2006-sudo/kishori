/**
 * Formatting utilities for Generic Medicine Store.
 * Pure functions — no React dependencies, no side effects.
 * All currency is USD; temperatures in Celsius; dates in human-readable strings.
 */

// ─── Currency ────────────────────────────────────────────────────────────────

/**
 * Formats a numeric amount as a USD currency string.
 * @example formatCurrency(8.4) → "$8.40"
 * @example formatCurrency(1234.5) → "$1,234.50"
 */
export function formatCurrency(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a large GMV/revenue figure with compact suffix for dashboard use.
 * @example formatCompactCurrency(1120400) → "$1.12M"
 * @example formatCompactCurrency(684200) → "$684.2K"
 */
export function formatCompactCurrency(amount: number): string {
  if (!isFinite(amount) || isNaN(amount)) return '$0';
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}

// ─── Savings Calculations ─────────────────────────────────────────────────────

/**
 * Calculates absolute patient savings amount.
 * Validates that brandMrp > 0 to prevent division errors.
 * @example calculateSavingsAmount(42, 8.40) → 33.60
 */
export function calculateSavingsAmount(brandReferenceMrp: number, genericUnitPrice: number): number {
  if (brandReferenceMrp <= 0 || genericUnitPrice < 0) return 0;
  return parseFloat(Math.max(0, brandReferenceMrp - genericUnitPrice).toFixed(2));
}

/**
 * Calculates patient savings as a percentage of brand reference MRP.
 * Returns 0 if brandMrp is zero to avoid division-by-zero.
 * @example calculateSavingsPercent(42, 8.40) → 80
 */
export function calculateSavingsPercent(brandReferenceMrp: number, genericUnitPrice: number): number {
  if (brandReferenceMrp <= 0) return 0;
  const savings = brandReferenceMrp - genericUnitPrice;
  return Math.round(Math.max(0, (savings / brandReferenceMrp) * 100));
}

/**
 * Returns true if the savings percentage qualifies for a prominent green highlight.
 * Threshold: ≥ 40% savings per ADR-012 design token rules.
 */
export function isHighSavings(savingsPercent: number): boolean {
  return savingsPercent >= 40;
}

// ─── Temperature & Cold-Chain ─────────────────────────────────────────────────

const COLD_CHAIN_MIN_CELSIUS = 2.0;
const COLD_CHAIN_MAX_CELSIUS = 8.0;
const COLD_CHAIN_BREACH_LOWER = 1.8;
const COLD_CHAIN_BREACH_UPPER = 8.2;

/**
 * Returns true if the temperature is within the optimal 2°C – 8°C cold-chain range.
 */
export function isColdChainOptimal(tempCelsius: number): boolean {
  return tempCelsius >= COLD_CHAIN_MIN_CELSIUS && tempCelsius <= COLD_CHAIN_MAX_CELSIUS;
}

/**
 * Returns true if the temperature has exceeded safe GDP thresholds (triggers breach protocol).
 */
export function isColdChainBreached(tempCelsius: number): boolean {
  return tempCelsius < COLD_CHAIN_BREACH_LOWER || tempCelsius > COLD_CHAIN_BREACH_UPPER;
}

/**
 * Formats a temperature value for display in the tracking UI.
 * @example formatTemperature(4.2) → "4.2°C"
 */
export function formatTemperature(tempCelsius: number): string {
  return `${tempCelsius.toFixed(1)}°C`;
}

/**
 * Returns a human-readable cold-chain status label for a given temperature reading.
 */
export function getColdChainStatusLabel(tempCelsius: number): string {
  if (tempCelsius < COLD_CHAIN_BREACH_LOWER) return 'Below Range — Freeze Risk';
  if (tempCelsius > COLD_CHAIN_BREACH_UPPER) return 'Excursion Detected — Breach Alert';
  if (isColdChainOptimal(tempCelsius)) return 'Optimal (2°C – 8°C)';
  return 'Near Boundary — Monitor';
}

// ─── Percentage & Scores ─────────────────────────────────────────────────────

/**
 * Formats a decimal fraction (0–1) or a percentage value (0–100) as "xx.x%".
 * Accepts values in either form — values > 1 are treated as already-percentages.
 * @example formatPercent(0.784) → "78.4%"
 * @example formatPercent(78.4) → "78.4%"
 */
export function formatPercent(value: number, decimals = 1): string {
  const pct = value > 1 ? value : value * 100;
  return `${pct.toFixed(decimals)}%`;
}

// ─── Dates & Times ────────────────────────────────────────────────────────────

/**
 * Formats an ISO timestamp or date string into a human-friendly short date.
 * @example formatDate("2026-01-18") → "Jan 18, 2026"
 */
export function formatDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString; // passthrough unknown formats
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Returns a relative time label such as "Today", "Yesterday", or a short date string.
 */
export function formatRelativeDate(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return formatDate(isoString);
}

// ─── PII Masking ──────────────────────────────────────────────────────────────

/**
 * Masks a US phone number for non-privileged display.
 * Preserves last 4 digits per ADR-010 PHI rules.
 * @example maskPhone("+1 (555) 234-5678") → "+1 (•••) •••-5678"
 */
export function maskPhone(phone: string): string {
  return phone.replace(/(\+\d\s*\()[\d\s]+(\)\s*[\d-]{4,7}-)(\d{4})/, '$1•••$2$3').replace(/\([\d]{3}\)/, '(•••)');
}

/**
 * Masks an email address, showing only the first 2 characters and domain.
 * @example maskEmail("sarah.jenkins@gmail.com") → "sa***@gmail.com"
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.slice(0, 2);
  return `${visible}***@${domain}`;
}

// ─── Dosage & Drug Formatting ─────────────────────────────────────────────────

/**
 * Returns a concise dosage display string combining dosage form and strength.
 * @example formatDosageLabel("Tablets", "20mg") → "20mg Tablets"
 */
export function formatDosageLabel(dosageForm: string, strength: string): string {
  if (!strength && !dosageForm) return '';
  if (!strength) return dosageForm;
  if (!dosageForm) return strength;
  return `${strength} ${dosageForm}`;
}

/**
 * Capitalizes the first letter of each word in a drug name for consistent display.
 * @example normalizeDrugName("atorvastatin calcium") → "Atorvastatin Calcium"
 */
export function normalizeDrugName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Extracts the primary active salt name from a compound formulation string.
 * For display in compact card headers where space is limited.
 * @example getPrimaryActiveSalt("Amoxicillin + Clavulanate Potassium") → "Amoxicillin"
 */
export function getPrimaryActiveSalt(genericSalt: string): string {
  return genericSalt.split('+')[0].trim().split('(')[0].trim();
}

// ─── Number Helpers ───────────────────────────────────────────────────────────

/**
 * Clamps a number between a minimum and maximum value.
 * Used for progress gauges, stock scores, and Buy-Box component weights.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/**
 * Rounds a number to a specified number of decimal places.
 */
export function round(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
