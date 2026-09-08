import React, { useState } from 'react';
import { MedicineListing } from '../../types';

interface VendorListingsScreenProps {
  listings: MedicineListing[];
  onUpdateListingPrice: (id: string, newPrice: number) => void;
  onAddListing: (listing: MedicineListing) => void;
}

export const VendorListingsScreen: React.FC<VendorListingsScreenProps> = ({
  listings,
  onUpdateListingPrice,
  onAddListing
}) => {
  const [filter, setFilter] = useState<'All' | 'winning' | 'beaten' | 'paused'>('All');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [autoRepriceEnabled, setAutoRepriceEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Listing Form State
  const [newBrand, setNewBrand] = useState('');
  const [newSalt, setNewSalt] = useState('');
  const [newMrp, setNewMrp] = useState(45.00);
  const [newPrice, setNewPrice] = useState(9.00);
  const [newStrength, setNewStrength] = useState('20mg');
  const [newStock, setNewStock] = useState(500);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAutoMatch = (listing: MedicineListing) => {
    const undercutPrice = Number((listing.competitorLowestPrice - 0.05).toFixed(2));
    onUpdateListingPrice(listing.id, undercutPrice);
    showToast(`Buy-Box Reclaimed! Auto-repriced ${listing.genericSalt} to $${undercutPrice.toFixed(2)} (undercutting competitor by $0.05).`);
  };

  const filteredListings = listings.filter((l) => {
    const matchesFilter = filter === 'All' ? true : l.status === filter;
    const matchesSearch =
      l.brandName.toLowerCase().includes(search.toLowerCase()) ||
      l.genericSalt.toLowerCase().includes(search.toLowerCase()) ||
      l.ndc.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand || !newSalt) return;

    const newListing: MedicineListing = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      brandName: newBrand,
      genericSalt: newSalt,
      brandReferenceMrp: Number(newMrp),
      unitPrice: Number(newPrice),
      competitorLowestPrice: Number(newPrice),
      dosageForm: 'Tablets',
      strength: newStrength,
      packSize: '30 Tablets',
      ndc: `00${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 8999)}-20`,
      stockUnits: Number(newStock),
      batchNumber: `BT-${Math.floor(100 + Math.random() * 899)}`,
      expiryDate: 'Dec 2027',
      syncTime: 'Just now',
      syncSource: 'Direct Partner Entry',
      status: 'winning',
      bioEquivalentRating: 'AB (Orange Book)',
      isRx: true
    };

    onAddListing(newListing);
    setShowAddModal(false);
    showToast(`Listing for ${newSalt} added and synced with marketplace.`);
    setNewBrand('');
    setNewSalt('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3">
          <span className="material-symbols-outlined text-emerald-400">check_circle</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white text-sm">
            ✕
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
              Vendor Listing & Dynamic Repricing Engine
            </h1>
            <span className="text-[11px] font-mono font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
              Node: WHS-104-EAST
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Store #104 (Apollo Pharmacy) • Automated parity matching, buy-box algorithms, and stock sync.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Add Generic SKU Listing</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Listings</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-headline">1,482 SKUs</div>
          <p className="text-[11px] text-slate-400 mt-1">100% bio-equivalent AB rating</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Winning Lowest Price</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-headline">56.8%</div>
          <p className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trophy</span>
            Buy-Box Leader across 841 SKUs
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Price Freshness SLA</span>
          <div className="text-2xl font-bold text-sky-700 mt-1 font-headline">4.2 mins</div>
          <p className="text-[11px] text-slate-400 mt-1">Real-time webhook sync</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Patient Savings Today</span>
          <div className="text-2xl font-bold text-slate-900 mt-1 font-headline">$18,420</div>
          <p className="text-[11px] text-slate-500 mt-1">Avg 71.4% below branded MRP</p>
        </div>
      </div>

      {/* Repricing Engine Guardrails Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-4.5 border border-slate-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">tune</span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Automated Buy-Box Repricing Guardrails
              </span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              When enabled, algorithm automatically undercuts verified competitors by $0.05 to maintain the lowest price guarantee without violating your minimum 12% margin floor.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-slate-400 text-[11px]">Auto-Reprice Engine</div>
              <div className="font-semibold text-emerald-400">
                {autoRepriceEnabled ? 'Active (Continuous)' : 'Paused'}
              </div>
            </div>

            <button
              onClick={() => setAutoRepriceEnabled(!autoRepriceEnabled)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                autoRepriceEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {autoRepriceEnabled ? 'Engine ON' : 'Engine OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="w-full md:w-80 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, salt, or NDC..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: 'All Listings', key: 'All' },
            { label: 'Winning Buy-Box', key: 'winning' },
            { label: 'Beaten Price', key: 'beaten' },
            { label: 'Safety Paused', key: 'paused' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === item.key
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Medicine Listings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Molecule & Brand Reference</th>
                <th className="py-3 px-4">Dosage / NDC</th>
                <th className="py-3 px-4">Brand MRP</th>
                <th className="py-3 px-4">Our Price</th>
                <th className="py-3 px-4">Market Lowest</th>
                <th className="py-3 px-4">Stock & Batch</th>
                <th className="py-3 px-4">Buy-Box Status</th>
                <th className="py-3 px-4 text-right">Reprice Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-xs">{listing.genericSalt}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <span>Brand: <strong>{listing.brandName}</strong></span>
                      <span>•</span>
                      <span className="text-sky-700">{listing.bioEquivalentRating}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{listing.strength} {listing.dosageForm}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">NDC: {listing.ndc}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="line-through text-slate-400 font-medium">
                      ${listing.brandReferenceMrp.toFixed(2)}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 text-sm font-price-headline">
                      ${listing.unitPrice.toFixed(2)}
                    </span>
                    <div className="text-[10px] text-emerald-700 font-semibold">
                      Save {Math.round(((listing.brandReferenceMrp - listing.unitPrice) / listing.brandReferenceMrp) * 100)}%
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">
                      ${listing.competitorLowestPrice.toFixed(2)}
                    </div>
                    {listing.competitorName && (
                      <div className="text-[10px] text-slate-500">{listing.competitorName}</div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-900">{listing.stockUnits.toLocaleString()} Units</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Lot: {listing.batchNumber} • Exp: {listing.expiryDate}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {listing.status === 'winning' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <span className="material-symbols-outlined text-[13px]">check_circle</span>
                        <span>WINNING (Lowest)</span>
                      </span>
                    )}

                    {listing.status === 'beaten' && (
                      <div className="space-y-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">
                          <span className="material-symbols-outlined text-[13px]">trending_down</span>
                          <span>BEATEN (+${(listing.unitPrice - listing.competitorLowestPrice).toFixed(2)})</span>
                        </span>
                        {listing.buyBoxLostDelta && (
                          <div className="text-[10px] text-red-700 font-medium">
                            {listing.buyBoxLostDelta}% orders lost
                          </div>
                        )}
                      </div>
                    )}

                    {listing.status === 'paused' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        <span>SAFETY LOCKED</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {listing.status === 'beaten' ? (
                      <button
                        onClick={() => handleAutoMatch(listing)}
                        className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow-xs flex items-center gap-1 ml-auto transition-colors"
                      >
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                        <span>Auto-Match ${ (listing.competitorLowestPrice - 0.05).toFixed(2) }</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const p = prompt(`Enter custom price for ${listing.genericSalt}:`, listing.unitPrice.toString());
                          if (p && !isNaN(Number(p))) {
                            onUpdateListingPrice(listing.id, Number(p));
                            showToast(`Updated ${listing.genericSalt} to $${Number(p).toFixed(2)}`);
                          }
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs transition-colors"
                      >
                        Adjust Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm font-headline">Add Generic Medicine Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generic Salt / Molecule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Omeprazole Delayed-Release"
                  value={newSalt}
                  onChange={(e) => setNewSalt(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand Reference</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prilosec®"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dosage Strength</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20mg"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand MRP ($)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMrp}
                    onChange={(e) => setNewMrp(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Our Price ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  Publish & Verify Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
