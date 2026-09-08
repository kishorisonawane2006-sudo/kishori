import React from 'react';
import { TenantOrganization, PlatformOrder } from '../../types';

interface OverviewScreenProps {
  tenants: TenantOrganization[];
  orders: PlatformOrder[];
  onSelectOrder: (order: PlatformOrder) => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  tenants,
  orders,
  onSelectOrder,
  onNavigateTab
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner / Hero Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            Multi-Tenant Operations Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time cluster telemetry, schema isolation status, and marketplace settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('orders-and-fulfillment')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-sky-600">local_shipping</span>
            <span>View Orders Pipeline ({orders.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('vendor-listings-and-pricing')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">price_change</span>
            <span>Repricing Engine</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: GMV */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Merchandise Value</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">trending_up</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-headline">$2,842,500</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              +18.4%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Aggregated across 42 Orgs</span>
            <span className="text-slate-600 font-medium">30d Rolling</span>
          </div>
        </div>

        {/* Metric 2: Platform Revenue */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Platform Take</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">payments</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-headline">$284,250</span>
            <span className="text-xs font-bold text-emerald-600">10.0% Take-rate</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Direct Stripe Settlements</span>
            <span className="text-emerald-700 font-medium">Auto-Disbursed</span>
          </div>
        </div>

        {/* Metric 3: Active Outlets */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Pharmacies</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">domain</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-headline">348 Stores</span>
            <span className="text-xs text-slate-500">42 Orgs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>5 Onboarding Review</span>
            <span className="text-sky-700 font-medium">RLS Enforced</span>
          </div>
        </div>

        {/* Metric 4: Sync SLA */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inventory Sync SLA</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">sync_saved_loc</span>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 font-headline">98.4%</span>
            <span className="text-xs text-slate-500 font-mono">42ms p99</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>Real-time webhook sync</span>
            <span className="text-emerald-600 font-semibold">Healthy</span>
          </div>
        </div>
      </div>

      {/* Modular Monolith Architecture Telemetry Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-xl p-5 border border-slate-700 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Modular Monolith Architecture Status
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                v2.4-RELEASE
              </span>
            </div>
            <h3 className="text-base font-semibold text-white">
              Tenant-Aware PostgreSQL Core & Multi-Schema Isolation
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              All 8 core business modules (Tenant Mgt, Catalog, Order Pipeline, Repricing Engine, Auth/RBAC, Payments, Audit Logs, Notification) are operational with zero inter-tenant schema bleed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700/80 text-xs">
              <div className="text-slate-400 text-[11px]">PostgreSQL RLS</div>
              <div className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Active Isolation</span>
              </div>
            </div>

            <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700/80 text-xs">
              <div className="text-slate-400 text-[11px]">Redis Cluster Cache</div>
              <div className="font-semibold text-sky-300 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm">memory</span>
                <span>4.8 GB / 12.0 GB</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('tenant-configs')}
              className="px-3 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-semibold text-white transition-colors"
            >
              Inspect Architecture
            </button>
          </div>
        </div>
      </div>

      {/* Two Columns: Action Center & Tenant Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Action Center (1 Col) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">warning</span>
              <h2 className="font-bold text-sm text-slate-900 font-headline">Clinical & Ops Action Center</h2>
            </div>
            <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              6 Priority Tickets
            </span>
          </div>

          <div className="space-y-3 mt-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-1 hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">License Renewal Due</span>
                <span className="text-[10px] text-amber-700 font-mono">45d left</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                HealthKart Generic Direct (TNT-5021) Illinois State DEA Board renewal required.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500 font-mono">License: IL-DRUG-88192-B</span>
                <button className="text-[11px] font-bold text-sky-700 hover:underline">Review & Verify</button>
              </div>
            </div>

            <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-xl text-xs space-y-1 hover:border-red-400 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-900">Buy-Box Reprice Alert</span>
                <span className="text-[10px] text-red-700 font-bold bg-red-100 px-1.5 py-0.2 rounded">LOST</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Glucophage 500mg (Metformin HCl) beaten by CarePoint Express (-$0.30) on Store #104.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">Current: $4.20 vs $3.90</span>
                <button
                  onClick={() => onNavigateTab('vendor-listings-and-pricing')}
                  className="text-[11px] font-bold text-red-700 hover:underline"
                >
                  Auto-Match $3.85
                </button>
              </div>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs space-y-1 hover:border-sky-400 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sky-900">Cold-Chain Temperature Certified</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">3.8°C</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Order #ORD-2026-8941 sensor IoT payload confirmed within 2°C-8°C target.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">Fleet: SwiftMed Van #84</span>
                <span className="text-[10px] text-sky-700 font-medium">Logged in Audit Trail</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Batch Expiry Notice</span>
                <span className="text-[10px] text-slate-500 font-mono">11m remaining</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                Augmentin 625mg Batch AC-419 (940 units) reaches 12-month expiry horizon Jan 2027.
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-500">FIFO rotation active</span>
                <button className="text-[11px] font-bold text-sky-700 hover:underline">Inspect Batch</button>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Performance Overview (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-sm text-slate-900 font-headline">Tenant Organizations & Quotas</h2>
              <p className="text-xs text-slate-500">Dedicated schemas, monthly GMV, and KMS isolation tier.</p>
            </div>
            <button
              onClick={() => onNavigateTab('multi-tenant-management')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              Manage All 42 Tenants →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
            {tenants.slice(0, 4).map((tenant) => (
              <div
                key={tenant.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-xs transition-all bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                      <span>{tenant.name}</span>
                      <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-mono font-normal">
                        {tenant.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-mono text-slate-600 font-medium">{tenant.schema}</span>
                      <span>•</span>
                      <span>{tenant.outlets} stores</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      tenant.status === 'Active / Verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tenant.status === 'Under Audit'
                        ? 'bg-amber-100 text-amber-800'
                        : tenant.status === 'Provisioning'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tenant.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200/70 text-[11px]">
                  <div>
                    <div className="text-slate-400">Monthly GMV</div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      ${(tenant.monthlyGmv / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">DB Partition</div>
                    <div className="font-medium text-slate-700 mt-0.5">{tenant.dbPartitionSize}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Commission</div>
                    <div className="font-bold text-emerald-700 mt-0.5">{tenant.commissionRate}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders & Commission Settlements Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-sm text-slate-900 font-headline">Recent Orders & Value Realization</h2>
            <p className="text-xs text-slate-500">Live order flow with verified generic vs branded price comparisons.</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders-and-fulfillment')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>View All Orders In Pipeline</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order ID & Time</th>
                <th className="py-3 px-4">Patient & Destination</th>
                <th className="py-3 px-4">Fulfilling Pharmacy</th>
                <th className="py-3 px-4">Molecules / Items</th>
                <th className="py-3 px-4">Branded vs Generic</th>
                <th className="py-3 px-4">Patient Savings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-sky-700 font-mono">{order.orderNumber}</div>
                    <div className="text-[11px] text-slate-400">{order.orderTime} • {order.orderDate}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{order.customerAddress}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{order.tenantStoreName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Store {order.tenantStoreNumber}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900 max-w-[200px] truncate">{order.genericMolecule}</div>
                    <div className="text-[10px] text-slate-400">Ref: {order.brandReference}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="line-through text-slate-400">${order.brandedValue.toFixed(2)}</span>
                      <span className="font-bold text-slate-900 font-price-headline text-sm">
                        ${order.orderTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">Platform: ${order.platformFee.toFixed(2)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200">
                      <span className="material-symbols-outlined text-[14px]">savings</span>
                      <span>-${order.patientSavingsAmount.toFixed(2)} ({order.patientSavingsPercent}%)</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
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
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-sky-600 hover:text-white text-slate-700 font-semibold text-xs transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
