import React, { useState, useRef, useEffect } from 'react';
import { ASSET_IMAGES } from '../../data/initialData';
import { CartItem } from '../../types';
import { 
  Search, 
  X, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Check, 
  ShieldCheck, 
  Scale, 
  SlidersHorizontal,
  Pill,
  Scan,
  AlertCircle
} from 'lucide-react';

interface DiscoverScreenProps {
  onSelectCompare: (saltName: string) => void;
  onAddToCart: (item: CartItem) => void;
}

export interface DiscoverMedicineItem {
  id: string;
  genericSalt: string;
  brandName: string;
  category: string;
  dosage: string;
  dosageForm: string;
  packDescription: string;
  unitPrice: number;
  brandedPrice: number;
  savingsPercent: number;
  bioEquivalentRating: string;
  storeName: string;
  storeId: string;
  rxNumber: string;
  doctorName: string;
  image: string;
  stockText: string;
  tags: string[];
}

const CATALOG_MEDICINES: DiscoverMedicineItem[] = [
  {
    id: 'med-atorvastatin',
    genericSalt: 'Atorvastatin Calcium',
    brandName: 'Lipitor®',
    category: 'Cholesterol & Heart',
    dosage: '20mg',
    dosageForm: 'Film-Coated Tablets',
    packDescription: 'Pack: 30 Tablets (1 month)',
    unitPrice: 8.40,
    brandedPrice: 42.00,
    savingsPercent: 80,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-99410',
    doctorName: 'Dr. Harrison Wright',
    image: ASSET_IMAGES.atorvastatinBlister,
    stockText: 'In Stock (1,420 units)',
    tags: ['cholesterol', 'statin', 'heart', 'lipitor', 'atorvastatin', 'blood pressure']
  },
  {
    id: 'med-metformin',
    genericSalt: 'Metformin HCl ER',
    brandName: 'Glucophage®',
    category: 'Diabetes & Glucose Control',
    dosage: '500mg Extended Release',
    dosageForm: 'Oral Tablets',
    packDescription: 'Pack: 60 Tablets',
    unitPrice: 3.90,
    brandedPrice: 28.50,
    savingsPercent: 85,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-99410',
    doctorName: 'Dr. Harrison Wright',
    image: ASSET_IMAGES.metforminBottle,
    stockText: 'In Stock (3,890 units)',
    tags: ['diabetes', 'blood sugar', 'glucose', 'metformin', 'glucophage', 'insulin']
  },
  {
    id: 'med-amoxicillin',
    genericSalt: 'Amoxicillin + Clavulanate',
    brandName: 'Augmentin®',
    category: 'Antibiotics & Infection',
    dosage: '625mg',
    dosageForm: 'Tablets',
    packDescription: 'Pack: 10 Tablets',
    unitPrice: 9.80,
    brandedPrice: 32.00,
    savingsPercent: 69,
    bioEquivalentRating: 'AB Rated (Sole Buy-Box)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-99344',
    doctorName: 'Dr. Raj Patel',
    image: ASSET_IMAGES.amoxicillinPack,
    stockText: 'In Stock (940 units)',
    tags: ['antibiotic', 'infection', 'bacterial', 'amoxicillin', 'augmentin', 'penicillin']
  },
  {
    id: 'med-sertraline',
    genericSalt: 'Sertraline HCl',
    brandName: 'Zoloft®',
    category: 'Mental Health & SSRI',
    dosage: '50mg',
    dosageForm: 'Tablets',
    packDescription: 'Pack: 28 Tablets',
    unitPrice: 14.20,
    brandedPrice: 54.00,
    savingsPercent: 74,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-88412',
    doctorName: 'Dr. Emily Vance',
    image: ASSET_IMAGES.atorvastatinBlister,
    stockText: 'In Stock (620 units)',
    tags: ['depression', 'anxiety', 'mood', 'ssri', 'zoloft', 'sertraline']
  },
  {
    id: 'med-omeprazole',
    genericSalt: 'Omeprazole Delayed Release',
    brandName: 'Prilosec®',
    category: 'Gastroenterology & Acid Relief',
    dosage: '20mg',
    dosageForm: 'Delayed-Release Capsules',
    packDescription: 'Pack: 30 Capsules',
    unitPrice: 6.60,
    brandedPrice: 30.00,
    savingsPercent: 78,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-77312',
    doctorName: 'Dr. David Chen',
    image: ASSET_IMAGES.metforminBottle,
    stockText: 'In Stock (1,150 units)',
    tags: ['acid reflux', 'gerd', 'heartburn', 'stomach', 'omeprazole', 'prilosec']
  },
  {
    id: 'med-albuterol',
    genericSalt: 'Albuterol Sulfate HFA',
    brandName: 'Ventolin®',
    category: 'Respiratory & Bronchodilator',
    dosage: '90mcg / Actuation',
    dosageForm: 'Inhaler Device (8.5g)',
    packDescription: '1 Inhaler (200 Puffs)',
    unitPrice: 22.50,
    brandedPrice: 74.00,
    savingsPercent: 70,
    bioEquivalentRating: 'AB Rated (FDA Bioequivalent)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-66109',
    doctorName: 'Dr. Sarah Connor',
    image: ASSET_IMAGES.amoxicillinPack,
    stockText: 'In Stock (340 units)',
    tags: ['asthma', 'breathing', 'inhaler', 'lungs', 'albuterol', 'ventolin']
  },
  {
    id: 'med-amlodipine',
    genericSalt: 'Amlodipine Besylate',
    brandName: 'Norvasc®',
    category: 'Cardiovascular & BP',
    dosage: '5mg',
    dosageForm: 'Oral Tablets',
    packDescription: 'Pack: 30 Tablets',
    unitPrice: 4.50,
    brandedPrice: 34.00,
    savingsPercent: 87,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-55421',
    doctorName: 'Dr. Harrison Wright',
    image: ASSET_IMAGES.atorvastatinBlister,
    stockText: 'In Stock (2,100 units)',
    tags: ['blood pressure', 'hypertension', 'calcium channel', 'norvasc', 'amlodipine']
  },
  {
    id: 'med-escitalopram',
    genericSalt: 'Escitalopram Oxalate',
    brandName: 'Lexapro®',
    category: 'Mental Health & SSRI',
    dosage: '10mg',
    dosageForm: 'Film-Coated Tablets',
    packDescription: 'Pack: 30 Tablets',
    unitPrice: 7.20,
    brandedPrice: 48.00,
    savingsPercent: 85,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-44120',
    doctorName: 'Dr. Emily Vance',
    image: ASSET_IMAGES.metforminBottle,
    stockText: 'In Stock (880 units)',
    tags: ['anxiety', 'depression', 'lexapro', 'escitalopram', 'ssri']
  },
  {
    id: 'med-montelukast',
    genericSalt: 'Montelukast Sodium',
    brandName: 'Singulair®',
    category: 'Allergy & Respiratory',
    dosage: '10mg',
    dosageForm: 'Tablets',
    packDescription: 'Pack: 30 Tablets',
    unitPrice: 8.90,
    brandedPrice: 52.00,
    savingsPercent: 83,
    bioEquivalentRating: 'AB Rated (Orange Book)',
    storeName: 'Apollo Pharmacy Hub #104',
    storeId: 'WHS-104-EAST',
    rxNumber: 'RX-33190',
    doctorName: 'Dr. Sarah Connor',
    image: ASSET_IMAGES.amoxicillinPack,
    stockText: 'In Stock (750 units)',
    tags: ['allergy', 'rhinitis', 'asthma', 'singulair', 'montelukast']
  }
];

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  onSelectCompare,
  onAddToCart
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraScanning, setCameraScanning] = useState(false);
  const [cameraResult, setCameraResult] = useState<string | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startScanSimulation = () => {
    setCameraScanning(true);
    setCameraResult(null);
    setTimeout(() => {
      setCameraScanning(false);
      setCameraResult(
        'Prescription OCR Identified: Atorvastatin 20mg (1x Daily) + Metformin ER 500mg. Prescribed by Dr. Harrison Wright.'
      );
    }, 1800);
  };

  const handleAddToCartWithToast = (med: DiscoverMedicineItem) => {
    onAddToCart({
      id: `cart-${med.id}-${Date.now()}`,
      medicineName: med.genericSalt,
      dosage: med.dosage,
      brandName: med.brandName,
      storeName: med.storeName,
      storeId: med.storeId,
      packDescription: med.packDescription,
      quantity: 1,
      unitPrice: med.unitPrice,
      brandedPrice: med.brandedPrice,
      rxNumber: med.rxNumber,
      doctorName: med.doctorName,
      image: med.image
    });

    setAddedToast(`Added ${med.genericSalt} to cart`);
    setTimeout(() => {
      setAddedToast(null);
    }, 2400);
  };

  // Real-time filtering of medicine listings as user types
  const query = searchQuery.trim().toLowerCase();
  const filteredMedicines = CATALOG_MEDICINES.filter((med) => {
    if (!query) return true;
    return (
      med.genericSalt.toLowerCase().includes(query) ||
      med.brandName.toLowerCase().includes(query) ||
      med.category.toLowerCase().includes(query) ||
      med.dosage.toLowerCase().includes(query) ||
      med.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  const popularSearches = [
    { name: 'Atorvastatin', brand: 'Lipitor®' },
    { name: 'Metformin', brand: 'Glucophage®' },
    { name: 'Amoxicillin', brand: 'Augmentin®' },
    { name: 'Zoloft', brand: 'Sertraline' },
    { name: 'Omeprazole', brand: 'Prilosec®' },
    { name: 'Ventolin', brand: 'Albuterol' }
  ];

  const salts = [
    { name: 'Atorvastatin', ref: 'Lipitor®', discount: '80% off' },
    { name: 'Metformin', ref: 'Glucophage®', discount: '85% off' },
    { name: 'Amoxicillin', ref: 'Augmentin®', discount: '69% off' },
    { name: 'Sertraline', ref: 'Zoloft®', discount: '74% off' },
    { name: 'Omeprazole', ref: 'Prilosec®', discount: '78% off' },
    { name: 'Albuterol', ref: 'Ventolin®', discount: '70% off' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-20 relative">
      {/* Real-time Added to Cart Toast Notification */}
      {addedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* SEARCH HEADER WITH REAL-TIME SUGGESTION DROPDOWN */}
      <div ref={searchContainerRef} className="relative z-40">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsSearchFocused(false);
                }
              }}
              placeholder="Search brand (Lipitor, Glucophage) or generic salt..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchFocused(true);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setShowCameraModal(true);
              startScanSimulation();
            }}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs flex items-center justify-center transition-colors shrink-0"
            title="Upload or Scan Prescription"
          >
            <span className="material-symbols-outlined text-xl">document_scanner</span>
          </button>
        </div>

        {/* REAL-TIME SEARCH SUGGESTION DROPDOWN */}
        {isSearchFocused && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Case 1: When user has typed a query */}
            {query.length > 0 ? (
              <div>
                <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-sky-600" />
                    <span>Real-time suggestions</span>
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded-full">
                    {filteredMedicines.length} match{filteredMedicines.length === 1 ? '' : 'es'}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((med) => (
                      <div
                        key={med.id}
                        onClick={() => {
                          setSearchQuery(med.genericSalt);
                          setIsSearchFocused(false);
                        }}
                        className="p-3 hover:bg-sky-50/60 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img
                            src={med.image}
                            alt={med.genericSalt}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/80"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-sky-700 truncate">
                                {med.genericSalt}
                              </span>
                              <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1 rounded shrink-0">
                                AB
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {med.dosage} • Generic for <strong className="text-slate-700 font-semibold">{med.brandName}</strong>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-bold text-slate-900 font-price-headline">
                                ${med.unitPrice.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                ${med.brandedPrice.toFixed(2)}
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                                Save {med.savingsPercent}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setIsSearchFocused(false);
                              onSelectCompare(med.genericSalt);
                            }}
                            className="px-2 py-1 bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800 text-[11px] font-semibold rounded-lg transition-colors"
                            title="Compare Brand vs Generic Prices"
                          >
                            Compare
                          </button>
                          <button
                            onClick={() => handleAddToCartWithToast(med)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold rounded-lg shadow-xs transition-colors flex items-center gap-0.5"
                            title="Add to Prescription Cart"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-5 text-center space-y-2">
                      <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        No bio-equivalent match for "{searchQuery}"
                      </div>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Try searching by active generic salt (e.g., Atorvastatin, Metformin) or common brand name (Lipitor, Augmentin).
                      </p>
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setIsSearchFocused(false);
                            setShowCameraModal(true);
                            startScanSimulation();
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-sky-700 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Scan className="w-3.5 h-3.5" />
                          <span>Scan Doctor's Rx Instead</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => setIsSearchFocused(false)}
                    className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
                  >
                    <span>View all {filteredMedicines.length} listings</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                </div>
              </div>
            ) : (
              /* Case 2: When input is focused but empty -> show popular/trending searches */
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-semibold">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-600" />
                  <span>Popular Generic Searches</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setIsSearchFocused(false);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-[10px] text-slate-400">({item.brand})</span>
                    </button>
                  ))}
                </div>
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>FDA Orange Book AB-Rated molecules only</span>
                  <span className="text-emerald-700 font-medium">80%+ Savings</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Filter Active Indicator Pill */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 px-3 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5 text-sky-900">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span>
              Filtered by: <strong className="font-bold text-sky-950">"{searchQuery}"</strong> ({filteredMedicines.length} medicine{filteredMedicines.length === 1 ? '' : 's'})
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-sky-700 hover:text-sky-900 text-[11px] font-bold underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Hero Banner with Lab Background (hidden when filtered to keep search results prominent) */}
      {!searchQuery && (
        <div className="relative rounded-2xl overflow-hidden shadow-md text-white">
          <img
            src={ASSET_IMAGES.laboratoryHero}
            alt="Clinical Laboratory"
            className="w-full h-40 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-950/90 via-sky-900/80 to-transparent p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              FDA Orange Book AB-Rated
            </span>
            <h2 className="text-lg font-bold font-headline mt-1 leading-snug">
              Bio-Equivalent Generics, Delivered in Minutes
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-[240px]">
              Save up to 85% with identical active ingredients verified by licensed pharmacists.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => onSelectCompare('Atorvastatin')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                Compare Prices Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salt Quick-Match Horizontal Chips */}
      {!searchQuery && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 font-headline">Popular Generic Salts</span>
            <span 
              onClick={() => setSearchQuery(' ')} 
              className="text-[11px] text-sky-600 font-medium cursor-pointer hover:underline"
            >
              View all 9 catalog items
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {salts.map((salt) => (
              <button
                key={salt.name}
                onClick={() => {
                  setSearchQuery(salt.name);
                }}
                className="px-3 py-2 bg-white border border-slate-200 hover:border-sky-400 rounded-xl text-left shrink-0 shadow-xs transition-all cursor-pointer"
              >
                <div className="text-xs font-bold text-slate-900">{salt.name}</div>
                <div className="text-[10px] text-slate-400">{salt.ref}</div>
                <div className="text-[10px] font-bold text-emerald-700 mt-0.5">{salt.discount}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FILTERED MEDICINE LISTINGS (UPDATES IN REAL-TIME AS USER TYPES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 font-headline">
              {searchQuery ? `Matching Generic Medicines (${filteredMedicines.length})` : "Today's Best Generic Deals"}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
            Save up to 87%
          </span>
        </div>

        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:border-sky-300 transition-all flex items-center justify-between gap-3"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                <img
                  src={med.image}
                  alt={med.genericSalt}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => onSelectCompare(med.genericSalt)}
                title="Click to view full bio-equivalence comparison"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {med.genericSalt}
                  </span>
                  <span className="text-[9px] bg-emerald-50 text-emerald-800 font-bold px-1 rounded">
                    AB Rated
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {med.dosage} • Generic for <span className="font-semibold text-slate-700">{med.brandName}</span>
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-bold text-sm text-slate-900 font-price-headline">
                    ${med.unitPrice.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    ${med.brandedPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                    Save {med.savingsPercent}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                <button
                  onClick={() => handleAddToCartWithToast(med)}
                  className="px-3 py-1.5 bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-700 font-bold rounded-xl text-xs transition-colors"
                >
                  + Add
                </button>
                <button
                  onClick={() => onSelectCompare(med.genericSalt)}
                  className="text-[10px] text-slate-400 hover:text-sky-600 font-medium text-center"
                >
                  Compare
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-dashed border-slate-300 text-center space-y-2">
            <Pill className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-xs font-bold text-slate-700">
              No medicines match "{searchQuery}"
            </div>
            <p className="text-[11px] text-slate-400">
              Try searching for Atorvastatin, Metformin, Amoxicillin, Sertraline, or Omeprazole.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 px-3 py-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-sky-500"
            >
              Reset Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Community Savings Barometer */}
      {!searchQuery && (
        <div className="bg-gradient-to-tr from-slate-900 to-sky-950 text-white rounded-2xl p-4 shadow-sm border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[11px]">Patient Community Savings</span>
            <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">
              30-Day Milestone
            </span>
          </div>
          <div className="text-2xl font-bold font-headline text-white">$1,420,890</div>
          <p className="text-[11px] text-slate-300">
            Saved directly by patients switching from branded retail to FDA bio-equivalent generics on our network.
          </p>
        </div>
      )}

      {/* Camera Prescription Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="font-bold text-slate-900 text-sm font-headline flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sky-600 text-lg">document_scanner</span>
                <span>Scan or Upload Prescription</span>
              </div>
              <button
                onClick={() => setShowCameraModal(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-300 h-56 bg-slate-100 flex items-center justify-center">
              <img
                src={ASSET_IMAGES.rxDocSample}
                alt="Prescription Sample"
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              {cameraScanning && (
                <div className="absolute inset-0 bg-sky-900/40 flex flex-col items-center justify-center text-white">
                  <div className="w-10 h-10 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs font-semibold mt-2">OCR Extracting Rx Details...</span>
                </div>
              )}
            </div>

            {cameraResult && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-800">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  Prescription Verified
                </div>
                <p>{cameraResult}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={startScanSimulation}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Re-scan
              </button>
              <button
                onClick={() => {
                  setShowCameraModal(false);
                  onSelectCompare('Atorvastatin');
                }}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs"
              >
                Compare Generics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
