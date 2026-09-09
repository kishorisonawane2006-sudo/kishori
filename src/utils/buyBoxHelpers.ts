/**
 * Buy-Box scoring helpers for frontend-side calculations.
 * Mirrors the weighted algorithm from ADR-004 and server/services/buyBoxService.ts.
 * Used by VendorListingsScreen and PriceCompareScreen to compute composite scores locally.
 */

import { MedicineListing } from '../types';
import { clamp, round } from './formatters';

export interface BuyBoxScoreBreakdown {
  priceScore: number;
  stockScore: number;
  proximityScore: number;
  compositeScore: number;
}

/**
 * Calculates the weighted Buy-Box composite score for a single listing.
 * Formula (ADR-004):
 *   score = (0.70 × priceScore) + (0.20 × stockScore) + (0.10 × proximityScore)
 *
 * @param listing         The vendor listing to score
 * @param lowestAvailablePrice  Minimum price across all competing listings for this salt
 * @param userDistanceMiles     Patient-to-pharmacy distance (defaults to 3.5 miles)
 */
export function computeBuyBoxScore(
  listing: MedicineListing,
  lowestAvailablePrice: number,
  userDistanceMiles = 3.5
): BuyBoxScoreBreakdown {
  // Price score: ratio of lowest price to this vendor's price × 100
  const priceScore =
    listing.unitPrice > 0
      ? round((lowestAvailablePrice / listing.unitPrice) * 100, 2)
      : 0;

  // Stock score: capped at 100; 50 units is baseline for a perfect score
  const stockScore = clamp(Math.round((listing.stockUnits / 50) * 100), 0, 100);

  // Proximity score: decays linearly — 5 points per mile, floored at 0
  const proximityScore = clamp(Math.round(100 - userDistanceMiles * 5), 0, 100);

  // Composite weighted score
  const compositeScore = round(
    0.70 * priceScore + 0.20 * stockScore + 0.10 * proximityScore,
    2
  );

  return { priceScore, stockScore, proximityScore, compositeScore };
}

/**
 * Determines the winning listing from a set of candidates by composite score.
 * Returns the index of the winner, or -1 if the list is empty.
 *
 * @param listings          Array of active (non-paused) MedicineListing objects
 * @param userDistanceMiles Patient delivery distance
 */
export function findBuyBoxWinner(
  listings: MedicineListing[],
  userDistanceMiles = 3.5
): number {
  const active = listings.filter((l) => l.status !== 'paused');
  if (active.length === 0) return -1;

  const lowestPrice = Math.min(...active.map((l) => l.unitPrice));

  let bestIdx = 0;
  let bestScore = -Infinity;

  active.forEach((listing, idx) => {
    const { compositeScore } = computeBuyBoxScore(listing, lowestPrice, userDistanceMiles);
    if (compositeScore > bestScore) {
      bestScore = compositeScore;
      bestIdx = idx;
    }
  });

  return bestIdx;
}

/**
 * Calculates the projected repriced unit price respecting the pharmacy floor price.
 * Mirrors the server-side repricing engine for instant client-side feedback.
 *
 * @param competitorPrice         Lowest competitor price for this SKU
 * @param floorPrice              Pharmacy-configured minimum sell price
 * @param targetUndercutPercent   How much to undercut (default 2%)
 */
export function calculateRepricedUnit(
  competitorPrice: number,
  floorPrice: number,
  targetUndercutPercent = 2.0
): { proposedPrice: number; wouldWin: boolean; marginPreserved: number } {
  const undercutPrice = round(competitorPrice * (1 - targetUndercutPercent / 100), 2);
  const proposedPrice = Math.max(floorPrice, undercutPrice);
  const wouldWin = proposedPrice <= competitorPrice;
  const marginPreserved = round(proposedPrice - floorPrice, 2);
  return { proposedPrice, wouldWin, marginPreserved };
}
