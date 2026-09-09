import React, { useState } from 'react';
import {
  ManufacturerProfile,
  WholesaleListing,
  CertificateOfAnalysis,
  B2bOrder,
  B2bCreditAccount,
  CoaStatus,
  B2bOrderStatus,
} from '../../types';
import {
  INITIAL_MANUFACTURERS,
  INITIAL_WHOLESALE_LISTINGS,
  INITIAL_COA_RECORDS,
  INITIAL_B2B_ORDERS,
  INITIAL_B2B_CREDIT_ACCOUNTS,
} from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

type WsTab = 'catalog' | 'manufacturers' | 'orders' | 'credit';

const COA_CONFIG: Record<CoaStatus, { bg: string; text: string; icon: string }> = {
  Verified:  { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: 'verified' },
  Submitted: { bg: 'bg-blue-50',    text: 'text-blue-700',    icon: 'upload_file' },
  Rejected:  { bg: 'bg-rose-50',    text: 'text-rose-700',    icon: 'cancel' },
  Expired:   { bg: 'bg-amber-50',   text: 'text-amber-700',   icon: 'timer_off' },
  Pending:   { bg: 'bg-slate-100',  text: 'text-slate-600',   icon: 'pending' },
};

const ORDER_STATUS_CONFIG: Record<B2bOrderStatus, { bg: string; text: string }> = {
  'Draft':              { bg: 'bg-slate-100',  text: 'text-slate-600'   },
  'Pending CoA Review': { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'Credit Check':       { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'Confirmed':          { bg: 'bg-indigo-50',  text: 'text-indigo-700'  },
  'In Production':      { bg: 'bg-sky-50',     text: 'text-sky-700'     },
  'Shipped':            { bg: 'bg-blue-50',    text: 'text-blue-700'    },
  'Delivered':          { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Payment Due':        { bg: 'bg-amber-50',   text: 'text-amber-700'   },
  'Settled':            { bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export const WholesaleMarketplaceScreen: React.FC = () => {
  const [tab, setTab]   = useState<WsTab>('catalog');
  const [manufacturers] = useState<ManufacturerProfile[]>(INITIAL_MANUFACTURERS);
  const [listings]      = useState<WholesaleListing[]>(INITIAL_WHOLESALE_LISTINGS);
  const [coas]          = useState<CertificateOfAnalysis[]>(INITIAL_COA_RECORDS);
  const [orders, setOrders] = useState<B2bOrder[]>(INITIAL_B2B_ORDERS);
  const [creditAccounts]= useState<B2bCreditAccount[]>(INITIAL_B2B_CREDIT_ACCOUNTS);

  const [selectedListing, setSelectedListing] = useState<WholesaleListing | null>(null);
  const [orderQty, setOrderQty]   = useState(1000);
  const [creditDays, setCreditDays] = useState<0 | 30 | 60>(30);
  const [orderPlaced, setOrderPlaced] = useState<B2bOrder | null>(null);
  const [filterMfr, setFilterMfr] = useState('');

  const filteredListings = filterMfr
    ? listings.filter(l => l.manufacturerId === filterMfr)
    : listings;

  const activeTier = selectedListing
    ? selectedListing.priceTiers
        .filter(t => orderQty >= t.minUnits && (t.maxUnits === null || orderQty <= t.maxUnits))
        .sort((a, b) => b.minUnits - a.minUnits)[0] ?? null
    : null;
  const pricePerUnit = activeTier?.pricePerUnit ?? selectedListing?.baseRetailPricePerUnit ?? 0;
  const totalPrice   = +(pricePerUnit * orderQty).toFixed(2);
  const discountPct  = activeTier?.discountPercent ?? 0;

  const handlePlaceOrder = () => {
    if (!selectedListing) return;
    const id = `b2b-${Date.now().toString().slice(-6)}`;
    const newOrder: B2bOrder = {
      id,
      orderNumber: `B2B-${Math.floor(100000 + Math.random() * 900000)}`,
      buyerTenantId: 'TNT-3109',
      buyerTenantName: 'Apollo Pharmacy Chain',
      manufacturerId: selectedListing.manufacturerId,
      manufacturerName: selectedListing.manufacturerName,
      listingId: selectedListing.id,
      genericSalt: selectedListing.genericSalt,
      quantity: orderQty,
      pricePerUnit: +pricePerUnit.toFixed(4),
      orderTotal: totalPrice,
      discountPercent: discountPct,
      creditTermDays: creditDays,
      coaVerified: selectedListing.coaStatus === 'Verified',
      status: 'Confirmed',
      placedAt: new Date().toISOString(),
      deliveryEta: new Date(Date.now() + 21 * 86400000).toISOString(),
      paymentDueDate: creditDays > 0 ? new Date(Date.now() + creditDays * 86400000).toISOString() : new Date().toISOString(),
    };
    setOrders(prev => [newOrder, ...prev]);
    setOrderPlaced(newOrder);
    setSelectedListing(null);
  };

  const tabs: Array<{ id: WsTab; label: string; icon: string }> = [
    { id: 'catalog',       label: 'Catalog',       icon: 'inventory_2' },
    { id: 'manufacturers', label: 'Manufacturers',  icon: 'factory'     },
    { id: 'orders',        label: `Orders (${orders.length})`, icon: 'receipt_long' },
    { id: 'credit',        label: 'Credit & Terms', icon: 'credit_score' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 filled">storefront</span>
            B2B Wholesale Generic Procurement
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Cipla · Sun Pharma · Dr. Reddy's · Torrent · Lupin — Phase 3 Workstream 3.4
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            {coas.filter(c => c.status === 'Verified').length} Active CoAs
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">inventory_2</span>
            {listings.length} Active Listings
          </span>
        </div>
      </div>

      {orderPlaced && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="material-symbols-outlined text-emerald-600 filled mt-0.5">check_circle</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-800">Order Placed — {orderPlaced.orderNumber}</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              {orderPlaced.quantity.toLocaleString()} units of {orderPlaced.genericSalt} from {orderPlaced.manufacturerName} ·
              Total: {formatCurrency(orderPlaced.orderTotal)} · {orderPlaced.discountPercent}% bulk discount ·
              {orderPlaced.creditTermDays > 0 ? ` Net-${orderPlaced.creditTermDays} payment terms` : ' Cash on delivery'}
            </p>
          </div>
          <button onClick={() => setOrderPlaced(null)} className="cursor-pointer text-emerald-500 hover:text-emerald-700" aria-label="Dismiss">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all cursor-pointer
              ${tab === t.id ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog Tab */}
      {tab === 'catalog' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Filter */}
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => setFilterMfr('')}
                className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all
                  ${!filterMfr ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                All
              </button>
              {manufacturers.map(m => (
                <button key={m.id} onClick={() => setFilterMfr(m.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer transition-all
                    ${filterMfr === m.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                  {m.code}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              {filteredListings.map(listing => {
                const coaCfg = COA_CONFIG[listing.coaStatus];
                const lowestTier = listing.priceTiers.reduce((min, t) => t.pricePerUnit < min ? t.pricePerUnit : min, listing.baseRetailPricePerUnit);
                return (
                  <div key={listing.id}
                    onClick={() => { setSelectedListing(listing); setOrderQty(listing.minimumOrderQuantity); }}
                    className={`bg-white rounded-2xl border shadow-xs p-4 cursor-pointer transition-all hover:shadow-md
                      ${selectedListing?.id === listing.id ? 'border-indigo-400 ring-2 ring-indigo-200' : 'border-slate-200'}`}>
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-bold text-slate-900">{listing.genericSalt}</p>
                          <span className="text-xs text-slate-500">· {listing.strength} {listing.dosageForm}</span>
                        </div>
                        <p className="text-xs text-slate-500">{listing.manufacturerName} · Batch: {listing.batchNumber}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Expires: {listing.expiryDate} · MOQ: {listing.minimumOrderQuantity.toLocaleString()} units</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${coaCfg.bg} ${coaCfg.text}`}>
                          <span className="material-symbols-outlined text-[11px] filled">{coaCfg.icon}</span>
                          CoA {listing.coaStatus}
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-indigo-700">from {formatCurrency(lowestTier)}/unit</p>
                          <p className="text-[10px] text-slate-400">up to {listing.priceTiers[listing.priceTiers.length - 1].discountPercent}% off</p>
                        </div>
                      </div>
                    </div>
                    {/* Tier strip */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {listing.priceTiers.map((tier, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                          {tier.minUnits.toLocaleString()}{tier.maxUnits ? `–${tier.maxUnits.toLocaleString()}` : '+'} units → {formatCurrency(tier.pricePerUnit)} (-{tier.discountPercent}%)
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 h-fit sticky top-4">
            {selectedListing ? (
              <>
                <p className="text-sm font-bold text-slate-900 mb-4">Place Bulk Order</p>
                <div className="flex flex-col gap-3 text-xs mb-5">
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200">
                    <p className="font-bold text-indigo-800">{selectedListing.genericSalt}</p>
                    <p className="text-indigo-600 mt-0.5">{selectedListing.manufacturerName}</p>
                    <p className="text-indigo-500 mt-0.5">{selectedListing.strength} {selectedListing.dosageForm} · {selectedListing.bioEquivalentRating}</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Quantity (units)</label>
                    <input type="number" min={selectedListing.minimumOrderQuantity} step={100}
                      value={orderQty} onChange={e => setOrderQty(Math.max(selectedListing.minimumOrderQuantity, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
                    <p className="text-[10px] text-slate-400 mt-0.5">Min: {selectedListing.minimumOrderQuantity.toLocaleString()} units</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Credit Terms</label>
                    <div className="flex gap-2">
                      {([0, 30, 60] as const).map(d => (
                        <button key={d} onClick={() => setCreditDays(d)}
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all
                            ${creditDays === d ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-200 text-slate-600 hover:border-indigo-300'}`}>
                          {d === 0 ? 'COD' : `Net-${d}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Price/unit</span>
                      <span className="font-bold text-slate-900">{formatCurrency(pricePerUnit)}</span>
                    </div>
                    {discountPct > 0 && (
                      <div className="flex justify-between">
                        <span className="text-emerald-600">Bulk discount</span>
                        <span className="font-bold text-emerald-700">-{discountPct}%</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-0.5">
                      <span className="font-bold text-slate-700">Order Total</span>
                      <span className="font-bold text-indigo-700 text-base">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                </div>
                <button onClick={handlePlaceOrder}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 cursor-pointer transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                  Place Wholesale Order
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                <span className="material-symbols-outlined text-4xl block mb-2">inventory_2</span>
                <p className="text-sm text-center">Select a listing from the catalog to configure a bulk order</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manufacturers Tab */}
      {tab === 'manufacturers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {manufacturers.map(mfr => (
            <div key={mfr.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-600 filled">factory</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{mfr.name}</p>
                    <p className="text-xs text-slate-500">{mfr.headquarters}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                  mfr.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {mfr.verificationStatus}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Molecules</p>
                  <p className="font-bold text-slate-800">{mfr.certifiedMolecules.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Active Batches</p>
                  <p className="font-bold text-slate-800">{mfr.activeBatches}</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 text-[10px] text-slate-500">
                <span>License: {mfr.licenseNumber}</span>
                <span>GMP: {mfr.gmpCertificate}</span>
                <span>Valid until: {mfr.licenseValidUntil}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="flex flex-col gap-3">
          {orders.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">receipt_long</span>
              <p className="text-sm">No B2B orders yet. Place an order from the Catalog tab.</p>
            </div>
          )}
          {orders.map(order => {
            const stCfg = ORDER_STATUS_CONFIG[order.status];
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{order.orderNumber}</p>
                    <p className="text-xs text-slate-500">{order.manufacturerName} · {order.genericSalt}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.coaVerified && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[11px] filled">verified</span>
                        CoA Verified
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${stCfg.bg} ${stCfg.text}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div><p className="text-slate-400">Quantity</p><p className="font-bold text-slate-800">{order.quantity.toLocaleString()} units</p></div>
                  <div><p className="text-slate-400">Total</p><p className="font-bold text-indigo-700">{formatCurrency(order.orderTotal)}</p></div>
                  <div><p className="text-slate-400">Discount</p><p className="font-bold text-emerald-700">{order.discountPercent}%</p></div>
                  <div><p className="text-slate-400">Terms</p><p className="font-bold text-slate-800">{order.creditTermDays === 0 ? 'COD' : `Net-${order.creditTermDays}`}</p></div>
                </div>
                {order.deliveryEta && (
                  <p className="text-[10px] text-slate-400 mt-2">
                    Est. delivery: {new Date(order.deliveryEta).toLocaleDateString()}
                    {order.paymentDueDate && ` · Payment due: ${new Date(order.paymentDueDate).toLocaleDateString()}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Credit Tab */}
      {tab === 'credit' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {creditAccounts.map(acct => {
            const utilPct = acct.creditLimitUsd > 0 ? (acct.utilisedCreditUsd / acct.creditLimitUsd) * 100 : 0;
            return (
              <div key={acct.tenantId} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{acct.tenantName}</p>
                    <p className="text-xs text-slate-500">Default: Net-{acct.defaultCreditTermDays} · {acct.outstandingInvoices} outstanding invoice{acct.outstandingInvoices !== 1 ? 's' : ''}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                    acct.creditRating.startsWith('A') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    acct.creditRating.startsWith('B') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {acct.creditRating}
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-xs mb-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Credit Limit</span>
                    <span className="font-bold">{formatCurrency(acct.creditLimitUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Utilised</span>
                    <span className={`font-bold ${utilPct > 80 ? 'text-rose-600' : 'text-slate-800'}`}>{formatCurrency(acct.utilisedCreditUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Available</span>
                    <span className="font-bold text-emerald-700">{formatCurrency(acct.availableCreditUsd)}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${utilPct > 80 ? 'bg-rose-500' : utilPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, utilPct)}%` }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">{utilPct.toFixed(1)}% of limit utilised</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
