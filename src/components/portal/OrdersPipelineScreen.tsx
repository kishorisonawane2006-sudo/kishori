import React, { useState } from 'react';
import { PlatformOrder } from '../../types';
import { ASSET_IMAGES } from '../../data/initialData';

interface OrdersPipelineScreenProps {
  orders: PlatformOrder[];
  selectedOrder: PlatformOrder | null;
  onSelectOrder: (order: PlatformOrder | null) => void;
  onUpdateOrderStatus: (orderId: string, status: PlatformOrder['status']) => void;
}

export const OrdersPipelineScreen: React.FC<OrdersPipelineScreenProps> = ({
  orders,
  selectedOrder,
  onSelectOrder,
  onUpdateOrderStatus
}) => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showRxModal, setShowRxModal] = useState(false);

  const filteredOrders = orders.filter((o) => {
    const matchesTab = activeTab === 'All' ? true : o.status.toLowerCase().includes(activeTab.toLowerCase());
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.genericMolecule.toLowerCase().includes(search.toLowerCase()) ||
      o.tenantStoreName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const inspectOrder = selectedOrder || orders[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            Orders & Fulfillment Pipeline
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time dispensing audit, cold-chain telemetry verification, and courier handoff logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-200 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Dispatch Active</span>
          </span>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { label: 'All Orders', key: 'All', count: orders.length },
            { label: 'Out for Delivery', key: 'Out for Delivery', count: orders.filter((o) => o.status === 'Out for Delivery').length },
            { label: 'Validating Rx', key: 'Validating Rx', count: orders.filter((o) => o.status === 'Validating Rx').length },
            { label: 'In-Transit', key: 'In-Transit', count: orders.filter((o) => o.status === 'In-Transit').length },
            { label: 'Awaiting Pickup', key: 'Awaiting', count: orders.filter((o) => o.status.includes('Awaiting')).length }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-sky-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-64 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders or patients..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Main Grid: Orders Table + Slide-over Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Orders Table (7 cols on large screen) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  <th className="py-3 px-3.5">Order</th>
                  <th className="py-3 px-3.5">Patient / Hub</th>
                  <th className="py-3 px-3.5">Molecules</th>
                  <th className="py-3 px-3.5">Total & Savings</th>
                  <th className="py-3 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className={`cursor-pointer transition-colors ${
                      inspectOrder?.id === order.id ? 'bg-sky-50/80 border-l-4 border-sky-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-sky-700 font-mono">{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{order.orderTime}</div>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded mt-1 inline-block">
                        {order.deliveryType}
                      </span>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-900">{order.customerName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{order.customerAddress}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {order.tenantStoreName} {order.tenantStoreNumber}
                      </div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-medium text-slate-800 max-w-[160px] truncate">
                        {order.genericMolecule}
                      </div>
                      <div className="text-[10px] text-slate-400">Ref: {order.brandReference}</div>
                    </td>

                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900">${order.orderTotal.toFixed(2)}</div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        Saved -${order.patientSavingsAmount.toFixed(2)}
                      </div>
                      <div className="text-[9px] text-slate-400 line-through">${order.brandedValue.toFixed(2)} MRP</div>
                    </td>

                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                          order.status === 'Out for Delivery'
                            ? 'bg-sky-100 text-sky-800'
                            : order.status === 'In-Transit'
                            ? 'bg-indigo-100 text-indigo-800'
                            : order.status === 'Validating Rx'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'Awaiting Pickup'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Inspection Panel (5 cols on large screen) */}
        {inspectOrder && (
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900 font-headline font-mono">
                    {inspectOrder.orderNumber}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {inspectOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed via {inspectOrder.channel} • {inspectOrder.orderTime}
                </p>
              </div>

              {/* Status updater quick toggle */}
              <div className="text-right">
                <select
                  value={inspectOrder.status}
                  onChange={(e) => onUpdateOrderStatus(inspectOrder.id, e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="Validating Rx">Validating Rx</option>
                  <option value="Dispensing">Dispensing</option>
                  <option value="Awaiting Pickup">Awaiting Pickup</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="In-Transit">In-Transit</option>
                  <option value="Fulfilled">Fulfilled</option>
                </select>
              </div>
            </div>

            {/* Patient & Route Summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{inspectOrder.customerName}</span>
                <span className="text-[11px] text-slate-500">{inspectOrder.distanceMiles} miles from hub</span>
              </div>
              <p className="text-slate-600 text-[11px]">{inspectOrder.customerAddress}</p>
              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                <span>Hub: {inspectOrder.tenantStoreName} {inspectOrder.tenantStoreNumber}</span>
                <span className="font-semibold text-sky-700">{inspectOrder.deliveryType}</span>
              </div>
            </div>

            {/* Value Realization & Price Transparency Card */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px]">
                  Price Transparency & Savings
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  -{inspectOrder.patientSavingsPercent}% Lower
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white/80 p-2 rounded-lg border border-emerald-200/60">
                  <div className="text-[10px] text-slate-500">Branded MRP</div>
                  <div className="text-xs font-semibold text-slate-400 line-through mt-0.5">
                    ${inspectOrder.brandedValue.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-emerald-200/60">
                  <div className="text-[10px] text-slate-500">Generic Paid</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    ${inspectOrder.orderTotal.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white/80 p-2 rounded-lg border border-emerald-200/60">
                  <div className="text-[10px] text-emerald-800 font-bold">Saved Amount</div>
                  <div className="text-sm font-bold text-emerald-700 mt-0.5">
                    ${inspectOrder.patientSavingsAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Dispensing Manifest */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between">
                <span>Dispensing Manifest</span>
                <span className="text-[10px] font-mono text-slate-400">Orange Book Verified</span>
              </div>

              <div className="space-y-1.5">
                {inspectOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 text-xs">
                        {item.name} {item.dosage}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {item.packaging} • Lot: <span className="font-mono text-slate-700">{item.lotNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">${item.price.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Prescription & Audit Box */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-indigo-600">verified</span>
                  <span>Digital Prescription Verified</span>
                </span>
                <button
                  onClick={() => setShowRxModal(true)}
                  className="text-[10px] font-bold text-indigo-700 hover:underline"
                >
                  View Scan →
                </button>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>Prescription ID: <strong className="font-mono text-slate-800">{inspectOrder.rxNumber}</strong></div>
                <div>Doctor: <span className="text-slate-800">{inspectOrder.prescribingDoctor}</span></div>
                <div>Pharmacist Sign-off: <span className="text-slate-800">{inspectOrder.pharmacistAudit}</span></div>
              </div>
            </div>

            {/* Live Route & Cold-Chain Telemetry */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Live Hub Route & Sensors
                </span>
                {inspectOrder.courierTempCelsius && (
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">ac_unit</span>
                    <span>{inspectOrder.courierTempCelsius}°C Cold Chain Compliant</span>
                  </span>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
                <img
                  src={ASSET_IMAGES.brooklynRouteMap}
                  alt="Delivery Route Brooklyn"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-3">
                  <div className="flex items-center justify-between w-full text-white text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={ASSET_IMAGES.courierCarlos}
                        alt="Courier Carlos"
                        className="w-7 h-7 rounded-full border border-white"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="font-semibold text-[11px]">{inspectOrder.courierName || 'Courier Active'}</div>
                        <div className="text-[9px] text-slate-300">{inspectOrder.courierVehicle}</div>
                      </div>
                    </div>
                    {inspectOrder.courierEtaMins && (
                      <div className="bg-sky-600/90 text-white font-bold px-2 py-1 rounded text-[11px]">
                        ETA {inspectOrder.courierEtaMins} mins
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prescription Document Scan Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-3 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm font-headline">Prescription Audit Document</h3>
                <p className="text-[11px] text-slate-500">{inspectOrder?.rxNumber} • {inspectOrder?.prescribingDoctor}</p>
              </div>
              <button
                onClick={() => setShowRxModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200">
              <img
                src={ASSET_IMAGES.rxDocSample}
                alt="Rx Document Scan"
                className="w-full max-h-[400px] object-contain bg-slate-100"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-2.5 bg-emerald-50 rounded-lg text-xs text-emerald-800 space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Digital DEA & NPI Cryptographically Validated
              </div>
              <p className="text-[11px] text-emerald-700">
                Signature verified by FDA Electronic Prescriptions for Controlled Substances (EPCS) protocol.
              </p>
            </div>

            <div className="text-right pt-1">
              <button
                onClick={() => setShowRxModal(false)}
                className="px-4 py-1.5 bg-sky-600 text-white font-semibold rounded-lg text-xs hover:bg-sky-700"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
