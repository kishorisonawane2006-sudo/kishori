import React, { useState } from 'react';
import { PlatformOrder } from '../../types';
import { ASSET_IMAGES } from '../../data/initialData';

interface OrderTrackingScreenProps {
  order: PlatformOrder;
  onBackToDiscover: () => void;
}

export const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({
  order,
  onBackToDiscover
}) => {
  const [supportModal, setSupportModal] = useState<'driver' | 'pharmacist' | null>(null);
  const [rxAccordionOpen, setRxAccordionOpen] = useState(false);

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-24 text-xs">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 text-sm font-headline font-mono">
              {order.orderNumber}
            </span>
            <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
              {order.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Placed {order.orderTime} • Fulfilling from {order.tenantStoreName}
          </p>
        </div>

        <button
          onClick={onBackToDiscover}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg"
        >
          Browse More
        </button>
      </div>

      {/* Live Map & Courier Telemetry Box */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 p-3.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="material-symbols-outlined text-emerald-600 text-base">near_me</span>
            <span>Live Delivery Route</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            ❄️ 3.8°C Cold-Chain Compliant
          </span>
        </div>

        {/* Map View */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 h-44 shadow-inner">
          <img
            src={ASSET_IMAGES.brooklynRouteMap}
            alt="Delivery Route Brooklyn"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <div className="flex items-center justify-between w-full text-white text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={ASSET_IMAGES.courierCarlos}
                  alt="Carlos M."
                  className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="font-bold text-sm leading-tight">Carlos M.</div>
                  <div className="text-[10px] text-slate-300">{order.courierVehicle}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="bg-sky-600 text-white font-bold px-2.5 py-1 rounded-lg text-xs shadow-xs">
                  ETA ~{order.courierEtaMins || 18} mins
                </div>
                <span className="text-[10px] text-slate-300 block mt-0.5">0.9 mi away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Driver Contact Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => setSupportModal('driver')}
            className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-sky-600">call</span>
            <span>Call Courier</span>
          </button>
          <button
            onClick={() => setSupportModal('pharmacist')}
            className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-sm text-sky-600">chat</span>
            <span>Chat Pharmacist</span>
          </button>
        </div>
      </div>

      {/* 5-Step Automated Audit Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="font-bold text-slate-800 font-headline text-xs">
          Automated Chain-of-Custody Stepper
        </div>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {/* Step 1 */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
              ✓
            </span>
            <div className="font-bold text-slate-900 text-xs">Order Placed & Verified</div>
            <p className="text-[10px] text-slate-500">10:24 AM • Payment confirmed & routed to nearest hub</p>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
              ✓
            </span>
            <div className="font-bold text-slate-900 text-xs">Prescription Clinically Audited</div>
            <p className="text-[10px] text-slate-500">10:27 AM • Sign-off by {order.pharmacistAudit}</p>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
              ✓
            </span>
            <div className="font-bold text-slate-900 text-xs">Dispensed & Cold-Chain Sealed</div>
            <p className="text-[10px] text-slate-500">10:32 AM • Batch ATR-8812 sealed in thermal box</p>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px] animate-ping"></span>
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
              ●
            </span>
            <div className="font-bold text-sky-800 text-xs">Out for Delivery with Carlos M.</div>
            <p className="text-[10px] text-slate-600">10:36 AM • Moving along Atlantic Ave towards destination</p>
          </div>

          {/* Step 5 */}
          <div className="relative opacity-60">
            <span className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-[10px]">
              ○
            </span>
            <div className="font-bold text-slate-700 text-xs">Handover & Patient Confirmation</div>
            <p className="text-[10px] text-slate-400">Estimated ~10:54 AM • Contactless signature</p>
          </div>
        </div>
      </div>

      {/* Dispensing Manifest & Items */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 font-headline">Dispensing Manifest</span>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            Saved ${(order.patientSavingsAmount || 64.80).toFixed(2)}
          </span>
        </div>

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <div className="font-bold text-slate-900 text-xs">{item.name} {item.dosage}</div>
                <div className="text-[10px] text-slate-500">{item.packaging} • Lot: {item.lotNumber}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">${item.price.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400">Qty: {item.quantity}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Digital Rx Certificate */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs text-xs">
        <button
          onClick={() => setRxAccordionOpen(!rxAccordionOpen)}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50"
        >
          <div className="flex items-center gap-2 text-indigo-900">
            <span className="material-symbols-outlined text-indigo-600 text-base">verified</span>
            <span>Digital Prescription Certificate ({order.rxNumber})</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-base">
            {rxAccordionOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {rxAccordionOpen && (
          <div className="p-3.5 pt-0 border-t border-slate-100 text-slate-600 space-y-2 text-[11px]">
            <div>Prescribing Physician: <strong className="text-slate-800">{order.prescribingDoctor}</strong></div>
            <div>Auditing Pharmacist: <strong className="text-slate-800">{order.pharmacistAudit}</strong></div>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-800 text-[10px] font-mono">
              EPCS Cryptographic Hash: SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </div>
          </div>
        )}
      </div>

      {/* Driver/Pharmacist Contact Modals */}
      {supportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl text-center space-y-3 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">
                {supportModal === 'driver' ? 'call' : 'support_agent'}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm font-headline">
                {supportModal === 'driver' ? 'Connecting to Carlos M.' : 'Pharmacist Consultation Line'}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1">
                {supportModal === 'driver'
                  ? 'Masked VoIP call connecting through SwiftMed Fleet Dispatch.'
                  : 'Licensed clinical pharmacist Pharm. David Cole, RPh is available 24/7.'}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => setSupportModal(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert(supportModal === 'driver' ? 'Calling Carlos M. at (555) 019-2831...' : 'Connecting to Live Pharmacist Chat...');
                  setSupportModal(null);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs shadow-xs"
              >
                {supportModal === 'driver' ? 'Start Call' : 'Open Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
