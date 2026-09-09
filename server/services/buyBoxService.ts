import { storage } from './storageService';
import { MedicineListing } from '../../src/types';

export interface BuyBoxCandidate {
  listing: MedicineListing;
  priceScore: number;
  stockScore: number;
  proximityScore: number;
  compositeScore: number;
  isWinner: boolean;
}

export interface BuyBoxEvaluationResult {
  genericSalt: string;
  calculatedAt: string;
  latencyMs: number;
  winner: BuyBoxCandidate | null;
  candidates: BuyBoxCandidate[];
}

export interface RepriceSimulationInput {
  listingId: string;
  newPrice: number;
  floorPrice: number;
  targetUndercutPercent?: number;
}

export class BuyBoxService {
  /**
   * Implements ADR-004: Weighted Multi-Factor Buy-Box Scoring Algorithm:
   * Total Score = (0.70 * PriceScore) + (0.20 * StockScore) + (0.10 * ProximityScore)
   */
  public evaluateBuyBox(genericSalt: string, userDistanceMiles: number = 3.5): BuyBoxEvaluationResult {
    const startTime = performance.now();
    const all = storage.getListings();

    // Filter active listings matching the salt
    const matched = all.filter(l => 
      l.genericSalt.toLowerCase().includes(genericSalt.toLowerCase()) && 
      l.status !== 'paused'
    );

    if (matched.length === 0) {
      return {
        genericSalt,
        calculatedAt: new Date().toISOString(),
        latencyMs: +(performance.now() - startTime).toFixed(2),
        winner: null,
        candidates: []
      };
    }

    const lowestAvailablePrice = Math.min(...matched.map(m => m.unitPrice));

    // Calculate component scores
    const candidates: BuyBoxCandidate[] = matched.map(listing => {
      // Price score: lowest / vendorPrice * 100
      const priceScore = listing.unitPrice > 0 
        ? +( (lowestAvailablePrice / listing.unitPrice) * 100 ).toFixed(2)
        : 0;

      // Stock score: capped at 100 (50 units baseline)
      const stockScore = Math.min(100, Math.round((listing.stockUnits / 50) * 100));

      // Proximity score: decays with distance
      const proximityScore = Math.max(0, Math.round(100 - (userDistanceMiles * 5)));

      // Composite weighted score
      const compositeScore = +(
        (0.70 * priceScore) + 
        (0.20 * stockScore) + 
        (0.10 * proximityScore)
      ).toFixed(2);

      return {
        listing,
        priceScore,
        stockScore,
        proximityScore,
        compositeScore,
        isWinner: false
      };
    });

    // Rank candidates by compositeScore desc
    candidates.sort((a, b) => b.compositeScore - a.compositeScore);

    if (candidates.length > 0) {
      candidates[0].isWinner = true;
      // Update winner status in storage
      storage.updateListing(candidates[0].listing.id, { status: 'winning' });
      for (let i = 1; i < candidates.length; i++) {
        storage.updateListing(candidates[i].listing.id, { status: 'beaten' });
      }
    }

    const latencyMs = +(performance.now() - startTime).toFixed(2);

    return {
      genericSalt,
      calculatedAt: new Date().toISOString(),
      latencyMs,
      winner: candidates[0] || null,
      candidates
    };
  }

  /**
   * Automated Vendor Repricing Engine:
   * Simulates or commits repricing to beat competitor prices down to the floor price.
   */
  public simulateRepricing(input: RepriceSimulationInput) {
    const listing = storage.getListingById(input.listingId);
    if (!listing) {
      throw new Error(`Listing ${input.listingId} not found`);
    }

    const competitorPrice = listing.competitorLowestPrice || listing.unitPrice;
    const targetUndercut = input.targetUndercutPercent ?? 2.0; // 2% default undercut
    const undercutPrice = +(competitorPrice * (1 - targetUndercut / 100)).toFixed(2);

    // Enforce floor price
    const proposedPrice = Math.max(input.floorPrice, undercutPrice);
    const wouldWin = proposedPrice <= competitorPrice;

    return {
      listingId: listing.id,
      currentPrice: listing.unitPrice,
      competitorPrice,
      floorPrice: input.floorPrice,
      proposedPrice,
      undercutPercent: targetUndercut,
      projectedStatus: wouldWin ? 'winning' : 'beaten',
      marginPreserved: +(proposedPrice - input.floorPrice).toFixed(2)
    };
  }
}

export const buyBoxService = new BuyBoxService();
