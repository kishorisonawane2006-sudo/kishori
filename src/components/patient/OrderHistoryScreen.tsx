import React, { useState } from 'react';
import { PlatformOrder, CartItem } from '../../types';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  RotateCcw, 
  FileText, 
  Search, 
  Filter, 
  DollarSign, 
  TrendingDown, 
  ShieldCheck, 
  ThermometerSnowflake, 
  ExternalLink, 
  Printer, 
  X, 
  MapPin, 
  ChevronRight,
  Pill,
  Sparkles
} from 'lucide-react';

interface OrderHistoryScreenProps {
  orders: PlatformOrder[];
  customerEmail?: string;
  onTrackOrder: (order: PlatformOrder) => void;
  onReorder: (items: CartItem[]) => void;
  onGoToShop: () => void;
}

export const OrderHistoryScreen: React.FC<OrderHistoryScreenProps> = ({
  orders,
  customerEmail,
  onTrackOrder,
  onReorder,
  onGoToShop
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'fulfilled'>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<PlatformOrder | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Filter by search query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query ||
      order.orderNumber.toLowerCase().includes(query) ||
      order.genericMolecule.toLowerCase().includes(query) ||
      order.brandReference.toLowerCase().includes(query) ||
      order.prescribingDoctor.toLowerCase().includes(query) ||
      order.tenantStoreName.toLowerCase().includes(query) ||
      order.items.some(i => i.name.toLowerCase().includes(query));

    // Filter by status category
    if (!matchesSearch) return false;

    if (statusFilter === 'active') {
      return ['Out for Delivery', 'In-Transit', 'Cold-Chain Packaged', 'Validating Rx', 'Dispensing', 'Re-dispatching'].includes(order.status);
    }
    if (statusFilter === 'fulfilled') {
      return order.status === 'Fulfilled';
    }
    return true;
  });

  // Calculate lifetime savings
  const totalSpent = orders.reduce((sum, o) => sum + o.orderTotal, 0);
  const totalSaved = orders.reduce((sum, o) => sum + o.patientSavingsAmount, 0);
  const totalBranded = orders.reduce((sum, o) => sum + o.brandedValue, 0);
  const overallSavingsPercent = totalBranded > 0 ? Math.round((totalSaved / totalBranded) * 100) : 65;

  const handleReorderClick = (order: PlatformOrder) => {
    const reorderCartItems: CartItem[] = order.items.map((item, idx) => ({
      id: `reorder-${order.id}-${idx}-${Date.now()}`,
      medicineName: item.name,
      dosage: item.dosage,
      brandName: order.brandReference.split('&')[0].trim(),
      storeName: order.tenantStoreName,
      storeId: order.tenantStoreNumber,
      packDescription: item.packaging,
      quantity: item.quantity,
      unitPrice: item.price,
      brandedPrice: Math.round(item.price * 2.8 * 100) / 100,
      rxNumber: order.rxNumber,
      doctorName: order.prescribingDoctor,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'
    }));

    onReorder(reorderCartItems);
    triggerToast(`Added ${order.items.length} items from ${order.orderNumber} to cart!`);
  };

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 pb-20">
      {/* Toast */}
      {showToast && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{showToast}</span>
        </div>
      )}

      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 font-headline">Order History & Prescriptions</h1>
            <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track active dispatches, view digital pharmacist audits, and re-order generic maintenance medicines.
          </p>
        </div>

        <button
          onClick={onGoToShop}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <Pill className="w-3.5 h-3.5" />
          <span>Browse Generics</span>
        </button>
      </div>

      {/* Lifetime Savings Telemetry Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-emerald-800/60">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-emerald-300/80 font-bold flex items-center justify-center sm:justify-start gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Lifetime Savings
            </span>
            <div className="text-2xl font-black text-emerald-300 font-headline">
              ${totalSaved.toFixed(2)}
            </div>
            <div className="text-[10px] text-emerald-200/70">
              vs {overallSavingsPercent}% retail brand MRP
            </div>
          </div>

          <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
              Total Generic Spend
            </span>
            <div className="text-2xl font-bold text-white font-headline">
              ${totalSpent.toFixed(2)}
            </div>
            <div className="text-[10px] text-slate-300">
              Across {orders.length} prescriptions
            </div>
          </div>

          <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold">
              Active Dispatches
            </span>
            <div className="text-2xl font-bold text-sky-300 font-headline">
              {orders.filter(o => o.status === 'Out for Delivery' || o.status === 'In-Transit').length}
            </div>
            <div className="text-[10px] text-slate-300">
              20–30 min delivery SLA
            </div>
          </div>

          <div className="space-y-1 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center sm:justify-start gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Safety Audits
            </span>
            <div className="text-2xl font-bold text-white font-headline">
              100%
            </div>
            <div className="text-[10px] text-slate-300">
              FDA AB-rated bio-equivalent
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by medication (e.g. Atorvastatin), order #, doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              statusFilter === 'active'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({orders.filter(o => ['Out for Delivery', 'In-Transit', 'Cold-Chain Packaged', 'Validating Rx', 'Dispensing', 'Re-dispatching'].includes(o.status)).length})
          </button>
          <button
            onClick={() => setStatusFilter('fulfilled')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              statusFilter === 'fulfilled'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'Fulfilled').length})
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/80 shadow-xs space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-800">No orders match your filter</div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search keywords or switch to the &quot;All Orders&quot; tab.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isActive = ['Out for Delivery', 'In-Transit', 'Cold-Chain Packaged', 'Validating Rx', 'Dispensing', 'Re-dispatching'].includes(order.status);
            const isDelivered = order.status === 'Fulfilled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs overflow-hidden"
              >
                {/* Order Top Bar */}
                <div className="p-3.5 sm:p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                      order.status === 'Out for Delivery' 
                        ? 'bg-sky-600 text-white animate-pulse' 
                        : isDelivered 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {order.status === 'Out for Delivery' || order.status === 'In-Transit' ? (
                        <Truck className="w-4 h-4" />
                      ) : isDelivered ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Clock className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-900">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-xs text-slate-600 font-medium">
                          {order.orderDate} at {order.orderTime}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[200px] sm:max-w-[320px]">
                          From: <strong className="text-slate-700">{order.tenantStoreName}</strong> ({order.tenantStoreNumber})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge & Cold chain indicator */}
                  <div className="flex items-center gap-2">
                    {order.deliveryType === 'Cold-Chain' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-bold">
                        <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                        {order.courierTempCelsius ? `${order.courierTempCelsius}°C Cold-Chain` : 'Refrigerated 2-8°C'}
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      order.status === 'Out for Delivery'
                        ? 'bg-sky-50 text-sky-700 border-sky-200 flex items-center gap-1'
                        : isDelivered
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.status === 'Out for Delivery' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></span>
                      )}
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items & Medication details */}
                <div className="p-3.5 sm:p-4 space-y-3">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{item.name} {item.dosage}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              ({item.packaging})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2">
                            <span>Qty: <strong className="text-slate-700">{item.quantity}</strong></span>
                            <span>•</span>
                            <span className="font-mono text-[10px]">Lot: {item.lotNumber}</span>
                          </div>
                        </div>
                        <div className="text-right font-mono font-semibold text-slate-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Brand Comparison & Savings Strip */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Equivalent to: <strong>{order.brandReference}</strong></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 line-through mr-1.5">
                        Brand MRP ${order.brandedValue.toFixed(2)}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">
                        Saved ${order.patientSavingsAmount.toFixed(2)} ({order.patientSavingsPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Prescription & Clinical Sign-off info */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-700">Rx: {order.rxNumber}</span>
                      <span>•</span>
                      <span>Doctor: <strong className="text-slate-700">{order.prescribingDoctor}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Audit: {order.pharmacistAudit}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Order Actions */}
                <div className="px-3.5 py-2.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-500">Order Total: </span>
                    <strong className="text-slate-900 font-mono text-sm">${order.orderTotal.toFixed(2)}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Invoice */}
                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="View & Print Official Medical Invoice"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>Invoice</span>
                    </button>

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorderClick(order)}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="1-Click Reorder Same Medication"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Reorder</span>
                    </button>

                    {/* Track Button */}
                    {isActive && (
                      <button
                        onClick={() => onTrackOrder(order)}
                        className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Live Delivery</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAILED PRINTABLE INVOICE MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 my-auto text-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl">receipt_long</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 font-headline">
                    Official Prescription Dispensing Invoice
                  </h2>
                  <p className="text-xs text-slate-500">
                    DEA & EPCS Compliant Medical Receipt • Order {selectedInvoiceOrder.orderNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={printInvoice}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Print Invoice"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Patient Name</span>
                <strong className="text-slate-800 text-sm">{selectedInvoiceOrder.customerName}</strong>
                <span className="text-[11px] text-slate-500 block truncate">{selectedInvoiceOrder.customerAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Dispensing Pharmacy</span>
                <strong className="text-slate-800">{selectedInvoiceOrder.tenantStoreName}</strong>
                <span className="text-[11px] text-slate-500 block">NABP Store #{selectedInvoiceOrder.tenantStoreNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Prescription Rx #</span>
                <strong className="text-sky-700 font-mono">{selectedInvoiceOrder.rxNumber}</strong>
                <span className="text-[11px] text-slate-500 block">MD: {selectedInvoiceOrder.prescribingDoctor}</span>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Medication & Salt</th>
                    <th className="p-3">Lot #</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Generic Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedInvoiceOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{it.name}</div>
                        <div className="text-[11px] text-slate-500">{it.dosage} • {it.packaging}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-600">{it.lotNumber}</td>
                      <td className="p-3 text-center font-bold">{it.quantity}</td>
                      <td className="p-3 text-right font-mono">${it.price.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">
                        ${(it.price * it.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown & Savings Highlight */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 max-w-sm">
                <div className="font-bold flex items-center gap-1 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Bio-Equivalent Generic Substitution Guaranteed
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Retail brand MRP value was ${selectedInvoiceOrder.brandedValue.toFixed(2)}. 
                  You saved ${selectedInvoiceOrder.patientSavingsAmount.toFixed(2)} ({selectedInvoiceOrder.patientSavingsPercent}%).
                </div>
              </div>

              <div className="w-full sm:w-56 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono text-slate-900 font-semibold">${selectedInvoiceOrder.orderTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery SLA Fee:</span>
                  <span className="font-mono text-emerald-600 font-semibold">$0.00 (Waived)</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Processing:</span>
                  <span className="font-mono text-slate-500">${selectedInvoiceOrder.platformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Amount Paid:</span>
                  <span className="font-mono text-sky-700">${selectedInvoiceOrder.orderTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pharmacist Digital Signature Stamp */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-800">Digital Clinical Pharmacist Sign-Off</div>
                <div className="text-[11px] text-slate-500">{selectedInvoiceOrder.pharmacistAudit}</div>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-400">
                <div>HASH: 994a-88f2-bc10</div>
                <div>EPCS Timestamp: {selectedInvoiceOrder.orderDate}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
              <button
                onClick={printInvoice}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
