import { storage } from './storageService';
import { MedicineListing } from '../../src/types';

export interface ComparisonMatrix {
  genericSalt: string;
  brandReferenceName: string;
  brandReferenceMrp: number;
  lowestGenericPrice: number;
  maxSavingsPercent: number;
  maxSavingsAmount: number;
  bioEquivalentRating: string;
  isRx: boolean;
  dosageForm: string;
  strength: string;
  listings: MedicineListing[];
}

export class CatalogService {
  /**
   * Universal Molecule & Brand Search:
   * Sub-second search querying branded drugs and mapping directly to chemical salts.
   */
  public search(query: string): MedicineListing[] {
    const all = storage.getListings();
    if (!query || query.trim() === '') {
      return all;
    }

    const q = query.toLowerCase().trim();
    return all.filter(item => 
      item.brandName.toLowerCase().includes(q) ||
      item.genericSalt.toLowerCase().includes(q) ||
      item.dosageForm.toLowerCase().includes(q) ||
      item.strength.toLowerCase().includes(q)
    );
  }

  /**
   * Generates a side-by-side comparison matrix for a specific medicine salt/brand
   */
  public getComparisonMatrix(searchIdentifier: string): ComparisonMatrix | null {
    const q = searchIdentifier.toLowerCase().trim();
    const all = storage.getListings();
    
    const matching = all.filter(item =>
      item.id.toLowerCase() === q ||
      item.brandName.toLowerCase().includes(q) ||
      item.genericSalt.toLowerCase().includes(q)
    );

    if (matching.length === 0) return null;

    const primary = matching[0];
    const lowestPrice = Math.min(...matching.map(m => m.unitPrice));
    const savingsAmount = +(primary.brandReferenceMrp - lowestPrice).toFixed(2);
    const savingsPercent = Math.round(((primary.brandReferenceMrp - lowestPrice) / primary.brandReferenceMrp) * 100);

    return {
      genericSalt: primary.genericSalt,
      brandReferenceName: primary.brandName,
      brandReferenceMrp: primary.brandReferenceMrp,
      lowestGenericPrice: lowestPrice,
      maxSavingsPercent: savingsPercent,
      maxSavingsAmount: savingsAmount,
      bioEquivalentRating: primary.bioEquivalentRating,
      isRx: primary.isRx,
      dosageForm: primary.dosageForm,
      strength: primary.strength,
      listings: matching
    };
  }

  /**
   * Returns distinct therapeutic categories with SKU counts
   */
  public getCategories() {
    const all = storage.getListings();
    const map = new Map<string, number>();

    all.forEach(item => {
      // Map salt to standard category
      let cat = 'General Care';
      const salt = item.genericSalt.toLowerCase();
      if (salt.includes('atorvastatin') || salt.includes('amlodipine') || salt.includes('losartan')) {
        cat = 'Cardiovascular';
      } else if (salt.includes('metformin') || salt.includes('glimepiride')) {
        cat = 'Anti-Diabetic';
      } else if (salt.includes('amoxicillin') || salt.includes('azithromycin') || salt.includes('ciprofloxacin')) {
        cat = 'Antibiotics';
      } else if (salt.includes('paracetamol') || salt.includes('ibuprofen') || salt.includes('tramadol')) {
        cat = 'Pain Relief';
      } else if (salt.includes('omeprazole') || salt.includes('pantoprazole')) {
        cat = 'Gastrointestinal';
      } else if (salt.includes('montelukast') || salt.includes('salbutamol')) {
        cat = 'Respiratory';
      }

      map.set(cat, (map.get(cat) || 0) + 1);
    });

    return Array.from(map.entries()).map(([name, count]) => ({
      name,
      activeSkus: count
    }));
  }
}

export const catalogService = new CatalogService();
