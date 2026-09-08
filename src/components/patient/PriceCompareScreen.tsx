import React, { useState } from 'react';
import { ASSET_IMAGES } from '../../data/initialData';
import { CartItem } from '../../types';

interface PriceCompareScreenProps {
  onAddToCart: (item: CartItem) => void;
  onGoToCart: () => void;
}

export const PriceCompareScreen: React.FC<PriceCompareScreenProps> = ({
  onAddToCart,
  onGoToCart
}) => {
  const [selectedStrength, setSelectedStrength] = useState('20mg');
  const [selectedPackSize, setSelectedPackSize] = useState('30 Tablets');
  const [selectedPharmacy, setSelectedPharmacy] = useState('apollo');
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const pharmacyOptions = [
    {
      id: 'apollo',
      name: 'Apollo Pharmacy Hub #104',
      storeCode: 'WHS-104-EAST',
      price: 8.40,
      brandedMrp: 42.00,
      savingsPercent: 80,
      distance: '1.8 mi',
      deliveryEta: '20-30 mins',
      stockStatus: 'In Stock (1,420 units)',
      batchNumber: 'AT-8812',
      expiryDate: 'Nov 2027',
      isLowest: true
    },
    {
      id: 'carepoint',
      name: 'CarePoint Express Rx',
      storeCode: 'CP-082',
      price: 8.90,
      brandedMrp: 42.00,
      savingsPercent: 78,
      distance: '2.4 mi',
      deliveryEta: '30-45 mins',
      stockStatus: 'In Stock (410 units)',
      batchNumber: 'CP-9014',
      expiryDate: 'Oct 2027',
      isLowest: false
    },
    {
      id: 'medplus',
      name: 'MedPlus Direct NYC',
      storeCode: 'MP-055',
      price: 9.20,
      brandedMrp: 42.00,
      savingsPercent: 78,
      distance: '0.9 mi',
      deliveryEta: '15-25 mins',
      stockStatus: 'In Stock (820 units)',
      batchNumber: 'MP-4122',
      expiryDate: 'Jan 2028',
      isLowest: false
    },
    {
      id: 'sunmed',
      name: 'SunMed Drugstores',
      storeCode: 'SM-114',
      price: 9.50,
      brandedMrp: 42.00,
      savingsPercent: 77,
      distance: '4.1 mi',
      deliveryEta: '45-60 mins',
      stockStatus: 'In Stock (190 units)',
      batchNumber: 'SM-2001',
      expiryDate: 'Aug 2027',
      isLowest: false
    }
  ];

  const currentPharm = pharmacyOptions.find((p) => p.id === selectedPharmacy) || pharmacyOptions[0];

  const handleAddCurrent = () => {
    onAddToCart({
      id: `cart-atorva-${Date.now()}`,
      medicineName: 'Atorvastatin Calcium',
      dosage: `${selectedStrength}`,
      brandName: 'Lipitor®',
      storeName: currentPharm.name,
      storeId: currentPharm.storeCode,
      packDescription: `Pack: ${selectedPackSize}`,
      quantity: 1,
      unitPrice: currentPharm.price,
      brandedPrice: currentPharm.brandedMrp,
      rxNumber: 'RX-99410',
      doctorName: 'Dr. Harrison Wright',
      image: ASSET_IMAGES.atorvastatinBlister
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-28">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500/40 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>Added to Cart! You saved ${(currentPharm.brandedMrp - currentPharm.price).toFixed(2)}</span>
          <button onClick={onGoToCart} className="text-sky-400 underline font-bold ml-1">
            View Cart
          </button>
        </div>
      )}

      {/* Main Medicine Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              FDA Orange Book AB Rated
            </span>
            <h1 className="text-lg font-bold text-slate-900 font-headline mt-1">
              Atorvastatin Calcium Tablets
            </h1>
            <p className="text-xs text-slate-500">
              Generic Bio-Equivalent for <strong className="text-slate-700">Lipitor®</strong>
            </p>
          </div>

          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
            <img
              src={ASSET_IMAGES.atorvastatinTablet}
              alt="Atorvastatin Pill"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Strength Selector */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100 text-xs">
          <label className="font-semibold text-slate-700">Dosage Strength</label>
          <div className="grid grid-cols-4 gap-2">
            {['10mg', '20mg', '40mg', '80mg'].map((strength) => (
              <button
                key={strength}
                onClick={() => setSelectedStrength(strength)}
                className={`py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                  selectedStrength === strength
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {strength}
              </button>
            ))}
          </div>
        </div>

        {/* Pack Size Selector */}
        <div className="space-y-1.5 text-xs">
          <label className="font-semibold text-slate-700">Pack Quantity</label>
          <div className="grid grid-cols-3 gap-2">
            {['30 Tablets', '60 Tablets', '90 Tablets'].map((pack) => (
              <button
                key={pack}
                onClick={() => setSelectedPackSize(pack)}
                className={`py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                  selectedPackSize === pack
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {pack}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Head-to-Head Comparison Card */}
      <div className="bg-gradient-to-tr from-sky-50 to-emerald-50 rounded-2xl p-4 border border-emerald-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Radical Affordability Comparison
          </span>
          <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
            Save 80% Instantly
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Branded Lipitor */}
          <div className="bg-white/80 rounded-xl p-3 border border-slate-200 text-center space-y-1">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Branded Lipitor®</span>
            <div className="text-lg font-bold text-slate-400 line-through">$42.00</div>
            <p className="text-[10px] text-slate-500">Retail Brand Markup</p>
          </div>

          {/* MediGeneric Lowest */}
          <div className="bg-white rounded-xl p-3 border border-emerald-300 text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-emerald-800 font-bold uppercase">Lowest Generic</span>
            <div className="text-xl font-bold text-emerald-700 font-price-headline font-headline">
              ${currentPharm.price.toFixed(2)}
            </div>
            <p className="text-[10px] text-emerald-800 font-semibold">You Save $33.60</p>
          </div>
        </div>
      </div>

      {/* 4 Verified Local Pharmacies */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 font-headline">Verified Pharmacy Stock Near You</span>
          <span className="text-[10px] text-slate-500">Sorted by lowest price</span>
        </div>

        <div className="space-y-2">
          {pharmacyOptions.map((pharm) => (
            <div
              key={pharm.id}
              onClick={() => setSelectedPharmacy(pharm.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                selectedPharmacy === pharm.id
                  ? 'bg-white border-sky-600 shadow-md ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">{pharm.name}</span>
                    {pharm.isLowest && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                        Lowest Price
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <span>{pharm.distance}</span>
                    <span>•</span>
                    <span>ETA {pharm.deliveryEta}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-medium">{pharm.stockStatus}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 text-base font-price-headline">
                    ${pharm.price.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">
                    -{pharm.savingsPercent}% off
                  </div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span>Lot: {pharm.batchNumber} • Exp: {pharm.expiryDate}</span>
                <span className="text-sky-700 font-medium font-mono">{pharm.storeCode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion: Why Pay $42? Bio-Equivalence Guarantee */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sky-600 text-lg">verified_user</span>
            <span>Why pay $42 for the same active molecule?</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-lg">
            {accordionOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {accordionOpen && (
          <div className="p-3.5 pt-0 text-slate-600 space-y-2 border-t border-slate-100 text-[11px]">
            <p>
              By FDA law, generic Atorvastatin Calcium has the exact same active pharmaceutical ingredient (API), dosage strength, bioavailability, and clinical efficacy as branded Lipitor®.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="font-bold text-slate-800">Chemical Purity</div>
                <div className="text-emerald-700 font-semibold">99.8% Identical</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="font-bold text-slate-800">Absorption Rate</div>
                <div className="text-emerald-700 font-semibold">Bio-Equivalent (AB)</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Quick Cart Bar */}
      <div className="fixed bottom-12 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl max-w-lg mx-auto z-30">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">Total Generic Cost</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-price-headline">
                ${currentPharm.price.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">$42.00</span>
            </div>
          </div>

          <button
            onClick={handleAddCurrent}
            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <span className="material-symbols-outlined text-base">shopping_cart</span>
            <span>Add Generic {selectedStrength} to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
