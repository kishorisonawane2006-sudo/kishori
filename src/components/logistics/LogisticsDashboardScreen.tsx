import React, { useState } from 'react';
import {
  ShipmentDispatch,
  CarrierProfile,
  RiderProfile,
  AutoDispatchResult,
} from '../../types';
import {
  INITIAL_DISPATCHES,
  INITIAL_CARRIERS,
  INITIAL_RIDERS,
} from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

interface LogisticsDashboardScreenProps {
  onViewRider?: (riderId: string) => void;
}

type DashTab = 'active' | 'carriers' | 'riders' | 'auto-dispatch';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  ASSIGNED:           { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  PICKED_UP:          { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  OUT_FOR_DELIVERY:   { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
  DELIVERED:          { bg: 'bg-emerald-50',text: 'text-emerald-700',dot: 'bg-emerald-500'},
  FAILED_ATTEMPT:     { bg: 'bg-rose-50',   text: 'text-rose-700',   dot: 'bg-rose-500'   },
  RETURNED_TO_PHARMACY:{ bg:'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400'  },
};

const CARRIER_ICONS: Record<string, string> = {
  'Dunzo': 'bolt',
  'Shadowfax': 'local_shipping',
  'FedEx Healthcare Express': 'flight',
};

export const LogisticsDashboardScreen: React.FC<LogisticsDashboardScreenProps> = ({
  onViewRider,
}) => {
  const [tab, setTab] = useState<DashTab>('active');
  const [dispatches, setDispatches] = useState<ShipmentDispatch[]>(INITIAL_DISPATCHES);
  const [carriers] = useState<CarrierProfile[]>(INITIAL_CARRIERS);
  const [riders] = useState<RiderProfile[]>(INITIAL_RIDERS);
  const [lastDispatch, setLastDispatch] = useState<AutoDispatchResult | null>(null);
  const [dispatchingOrderId, setDispatchingOrderId] = useState('');
  const [dispatchLoading, setDispatchLoading] = useState(false);

  const active = dispatches.filter(d => d.currentStatus !== 'DELIVERED' && d.currentStatus !== 'RETURNED_TO_PHARMACY');
  const coldChain = dispatches.filter(d => d.isColdChain);
  const delivered = dispatches.filter(d => d.currentStatus === 'DELIVERED').length;

  // Simulate auto-dispatch for demo
  const handleAutoDispatch = () => {
    if (!dispatchingOrderId.trim()) return;
    setDispatchLoading(true);
    setTimeout(() => {
      const waybillNum = `GMS-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;
      const dispatchId = `disp-${Date.now().toString().slice(-6)}`;
      const newDispatch: ShipmentDispatch = {
        id: dispatchId,
        orderId: dispatchingOrderId,
        orderNumber: dispatchingOrderId.toUpperCase(),
        carrierId: 'carrier-dunzo-01',
        carrierType: 'Dunzo',
        waybillNumber: waybillNum,
        barcodeData: `128:${waybillNum.replace(/-/g, '')}`,
        assignedRiderName: 'Carlos Mendez',
        assignedRiderId: 'rider-001',
        pickupAddress: '1420 Broadway, New York NY 10018',
        deliveryAddress: '482 Atlantic Ave, Brooklyn NY 11217',
        distanceMiles: 3.2,
        isColdChain: false,
        dispatchedAt: new Date().toISOString(),
        estimatedDeliveryAt: new Date(Date.now() + 75 * 60000).toISOString(),
        currentStatus: 'ASSIGNED',
        events: [{
          id: `evt-${Date.now()}`,
          shipmentId: dispatchId,
          status: 'ASSIGNED',
          timestamp: new Date().toISOString(),
          riderNote: 'Auto-dispatched via Dunzo On-Demand',
        }],
        manifestUrl: `/api/v2/logistics/waybill/${waybillNum}`,
      };
      setDispatches(prev => [newDispatch, ...prev]);
      setLastDispatch({
        success: true,
        orderId: dispatchingOrderId,
        selectedCarrier: 'Dunzo',
        dispatch: newDispatch,
        waybill: {
          waybillNumber: waybillNum,
          barcodeData: newDispatch.barcodeData,
          orderId: dispatchingOrderId,
          orderNumber: dispatchingOrderId.toUpperCase(),
          carrierName: 'Dunzo On-Demand Healthcare',
          senderName: 'Generic Medicine Store Fulfillment',
          senderAddress: '1420 Broadway, New York NY 10018',
          recipientName: 'Patient',
          recipientAddress: '482 Atlantic Ave, Brooklyn NY 11217',
          recipientPhone: '+1 (•••) •••-0000',
          packageDescription: 'Prescription Medication',
          weightKg: 0.4,
          isColdChain: false,
          temperatureRange: 'Ambient',
          generatedAt: new Date().toISOString(),
          regulatoryDeclaration: 'FDA 21 CFR Part 211 compliant.',
        },
        dispatchLatencyMs: 42,
      });
      setDispatchLoading(false);
      setDispatchingOrderId('');
      setTab('active');
    }, 800);
  };

  const tabs: { id: DashTab; label: string; icon: string }[] = [
    { id: 'active',        label: 'Active Shipments', icon: 'local_shipping' },
    { id: 'carriers',      label: 'Carriers',         icon: 'hub' },
    { id: 'riders',        label: 'Riders',           icon: 'person_pin_circle' },
    { id: 'auto-dispatch', label: 'Auto-Dispatch',    icon: 'rocket_launch' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 filled">hub</span>
            3PL Logistics Command Centre
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Dunzo · Shadowfax · FedEx Healthcare Express — Phase 2 Workstream 2.1
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Dispatch Active
          </span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Active Shipments', value: active.length, icon: 'local_shipping', color: 'blue' },
          { label: 'Cold-Chain Orders', value: coldChain.length, icon: 'ac_unit', color: 'cyan' },
          { label: 'Delivered Today', value: delivered, icon: 'check_circle', color: 'emerald' },
          { label: 'Avg Dispatch SLA', value: '38ms', icon: 'timer', color: 'indigo' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-3 shadow-xs">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${kpi.color}-50`}>
              <span className={`material-symbols-outlined text-${kpi.color}-600 filled`}>{kpi.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Last Dispatch Alert */}
      {lastDispatch && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="material-symbols-outlined text-emerald-600 filled mt-0.5">rocket_launch</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">Auto-Dispatch Successful — {lastDispatch.dispatchLatencyMs}ms</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Order <span className="font-mono font-semibold">{lastDispatch.orderId}</span> dispatched via{' '}
              <span className="font-semibold">{lastDispatch.selectedCarrier}</span> ·
              Waybill: <span className="font-mono">{lastDispatch.waybill.waybillNumber}</span>
            </p>
          </div>
          <button onClick={() => setLastDispatch(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer" aria-label="Dismiss">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all cursor-pointer
              ${tab === t.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Shipments */}
      {tab === 'active' && (
        <div className="flex flex-col gap-3">
          {dispatches.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">local_shipping</span>
              No active shipments. Use Auto-Dispatch to send an order.
            </div>
          )}
          {dispatches.map(dispatch => {
            const sc = STATUS_COLORS[dispatch.currentStatus] ?? STATUS_COLORS['ASSIGNED'];
            return (
              <div key={dispatch.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="flex items-center justify-between gap-4 px-4 py-3 border-b border-slate-100 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600 filled text-xl">
                      {CARRIER_ICONS[dispatch.carrierType] ?? 'local_shipping'}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{dispatch.carrierType}</p>
                      <p className="text-xs text-slate-500 font-mono">{dispatch.waybillNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {dispatch.isColdChain && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                        <span className="material-symbols-outlined text-[11px] filled">ac_unit</span>
                        Cold-Chain
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {dispatch.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Order</p>
                    <p className="font-mono font-semibold text-slate-700">{dispatch.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Rider</p>
                    <p className="font-semibold text-slate-700">{dispatch.assignedRiderName ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Distance</p>
                    <p className="font-semibold text-slate-700">{dispatch.distanceMiles} mi</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-slate-400 font-medium mb-0.5">Delivery Address</p>
                    <p className="text-slate-700">{dispatch.deliveryAddress}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium mb-0.5">Est. Delivery</p>
                    <p className="text-slate-700">
                      {new Date(dispatch.estimatedDeliveryAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {/* Event timeline strip */}
                <div className="px-4 pb-3 flex items-center gap-1 overflow-x-auto no-scrollbar">
                  {dispatch.events.map((evt, idx) => (
                    <div key={evt.id} className="flex items-center gap-1 flex-shrink-0">
                      {idx > 0 && <span className="w-4 h-px bg-slate-200" />}
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium whitespace-nowrap">
                        {evt.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Carriers */}
      {tab === 'carriers' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {carriers.map(carrier => (
            <div key={carrier.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 filled text-lg">
                      {CARRIER_ICONS[carrier.type] ?? 'local_shipping'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{carrier.type}</p>
                    <p className="text-xs text-slate-500">{carrier.coverageZone}</p>
                  </div>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${carrier.status === 'available' ? 'bg-emerald-500' : carrier.status === 'at_capacity' ? 'bg-amber-500' : 'bg-rose-500'}`} title={carrier.status} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Avg Delivery</p>
                  <p className="font-bold text-slate-800">{carrier.avgDeliveryMins} min</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Base Cost</p>
                  <p className="font-bold text-slate-800">{formatCurrency(carrier.baseCostUsd)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Cold-Chain</p>
                  <p className={`font-bold ${carrier.supportsColdChain ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {carrier.supportsColdChain ? '✓ Supported' : '✗ N/A'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2">
                  <p className="text-slate-400">Active Jobs</p>
                  <p className="font-bold text-slate-800">{carrier.activeShipments}</p>
                </div>
              </div>
              <span className={`text-center text-xs font-semibold py-1 rounded-lg ${
                carrier.status === 'available' ? 'bg-emerald-50 text-emerald-700' :
                carrier.status === 'at_capacity' ? 'bg-amber-50 text-amber-700' :
                'bg-rose-50 text-rose-700'
              }`}>
                {carrier.status.replace(/_/g, ' ').toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Riders */}
      {tab === 'riders' && (
        <div className="flex flex-col gap-3">
          {riders.map(rider => (
            <div key={rider.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center gap-4 flex-wrap">
              <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-indigo-600 filled">person</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-slate-900">{rider.fullName}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border
                    ${rider.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : rider.status === 'delivering' ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {rider.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{rider.vehicleType} · {rider.vehicleNumber} · {rider.carrierType}</p>
                <p className="text-xs text-slate-400 mt-0.5">{rider.currentAddress}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600 flex-shrink-0">
                <div className="text-center">
                  <p className="font-bold text-slate-800">{rider.totalDeliveriesToday}</p>
                  <p className="text-slate-400">Today</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800">{rider.rating}★</p>
                  <p className="text-slate-400">Rating</p>
                </div>
                <div className="text-center">
                  <p className={`font-bold ${rider.batteryPercent < 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {rider.batteryPercent}%
                  </p>
                  <p className="text-slate-400">Battery</p>
                </div>
                {onViewRider && (
                  <button
                    onClick={() => onViewRider(rider.id)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                  >
                    View Route
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auto-Dispatch */}
      {tab === 'auto-dispatch' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 max-w-lg">
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 filled">rocket_launch</span>
            Trigger Auto-Dispatch
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Simulate pharmacist sign-off triggering automated carrier selection, waybill generation,
            and rider assignment. SLA target: &lt; 180 seconds.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="dispatch-order-id">
                Order ID
              </label>
              <input
                id="dispatch-order-id"
                type="text"
                value={dispatchingOrderId}
                onChange={e => setDispatchingOrderId(e.target.value)}
                placeholder="e.g. ord-1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <button
              onClick={handleAutoDispatch}
              disabled={dispatchLoading || !dispatchingOrderId.trim()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {dispatchLoading
                ? <><span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />Dispatching…</>
                : <><span className="material-symbols-outlined text-[18px]">rocket_launch</span>Auto-Dispatch Order</>
              }
            </button>
          </div>

          {/* Carrier Selection Logic Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold text-slate-700 mb-2">Carrier Selection Logic</p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-blue-600 mt-0.5 filled">bolt</span>
                <span><strong>Dunzo</strong> — Distance ≤ 10mi, cold-chain capable, avg 75min</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-indigo-600 mt-0.5 filled">local_shipping</span>
                <span><strong>Shadowfax</strong> — Distance ≤ 50mi, ambient only, avg 3h</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[14px] text-slate-600 mt-0.5 filled">flight</span>
                <span><strong>FedEx</strong> — Long-haul, cold-chain, nationwide, avg 8h</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
