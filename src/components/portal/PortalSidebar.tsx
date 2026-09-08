import React from 'react';
import { PortalTab, TenantOrganization } from '../../types';
import { ASSET_IMAGES } from '../../data/initialData';

interface PortalSidebarProps {
  currentTab?: PortalTab;
  activeTab?: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  selectedTenant?: TenantOrganization;
  tenants?: TenantOrganization[];
  selectedTenantId?: string;
  onSelectTenant?: (id: string) => void;
  orderCount?: number;
  pendingOrdersCount?: number;
  onClose?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  selectedTenant,
  tenants = [],
  selectedTenantId,
  onSelectTenant,
  orderCount,
  pendingOrdersCount,
  onClose
}) => {
  const current = activeTab || currentTab || 'overview';
  const effectiveOrderCount = pendingOrdersCount ?? orderCount ?? 3;
  const currentTenant = selectedTenant || tenants.find(t => t.id === selectedTenantId) || tenants[0] || {
    name: 'Apollo Pharmacy Hub',
    tier: 'Enterprise Pro',
    code: 'AP'
  };
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none min-h-screen shadow-2xl">
      {/* Brand Header with Close / Hide Action */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 p-0.5 flex items-center justify-center shadow-lg shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="material-symbols-outlined text-sky-400 text-xl">medication</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm tracking-tight font-headline truncate">MediGeneric</span>
              <span className="text-[9px] bg-sky-500/20 text-sky-400 border border-sky-500/30 font-semibold px-1 py-0.2 rounded">v2.4</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">SaaS Ops Portal</p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors flex items-center justify-center shrink-0 border border-slate-700"
            title="Hide Left Side Blue Menubar"
            aria-label="Hide Blue Menubar"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        )}
      </div>

      {/* Nav Sections */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Core Operations */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Operations
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                current === 'overview'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Overview</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">LIVE</span>
            </button>

            <button
              onClick={() => onSelectTab('tenants')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                current === 'multi-tenant-management' || current === 'tenants'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">domain</span>
                <span>Multi-Tenant Stores</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">{tenants.length || 42} Orgs</span>
            </button>

            <button
              onClick={() => onSelectTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                current === 'orders-and-fulfillment' || current === 'orders'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                <span>Orders & Fulfillment</span>
              </div>
              <span className="text-[11px] bg-sky-500/20 text-sky-300 font-bold px-1.5 py-0.5 rounded-full">
                {effectiveOrderCount}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('catalog')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                current === 'catalog-and-generic-salts' || current === 'catalog'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">pill</span>
                <span>Generic Salt Catalog</span>
              </div>
              <span className="text-[10px] text-slate-500">AB Rated</span>
            </button>
          </div>
        </div>

        {/* Vendor & Partner Portal */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Vendor & Partner Node
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('catalog')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                current === 'vendor-listings-and-pricing' || current === 'catalog'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">price_change</span>
                <span>Listings & Repricing</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-medium">Buy-Box</span>
            </button>

            <button
              onClick={() => onSelectTab('stock-and-freshness-sync')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'stock-and-freshness-sync'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">autorenew</span>
                <span>Inventory & Cold Chain</span>
              </div>
              <span className="text-[10px] text-emerald-400">98.4%</span>
            </button>

            <button
              onClick={() => onSelectTab('commission-and-payouts')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'commission-and-payouts'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">payments</span>
                <span>Payouts & Settlements</span>
              </div>
            </button>
          </div>
        </div>

        {/* Governance & System */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Governance & Auditing
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectTab('audit-logs-and-security')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'audit-logs-and-security'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                <span>Security & RLS Logs</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1 py-0.5 rounded">256-bit</span>
            </button>

            <button
              onClick={() => onSelectTab('tenant-configs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'tenant-configs'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                <span>Tenant Isolation & DB</span>
              </div>
            </button>

            <button
              onClick={() => onSelectTab('analytics-and-reports')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentTab === 'analytics-and-reports'
                  ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>Savings Impact Analytics</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Active Tenant Card & Auth Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-3">
        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Tenant</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 rounded">RLS Active</span>
          </div>
          <div className="font-semibold text-white truncate">{currentTenant.name}</div>
          <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
            <span className="font-mono text-slate-500">{currentTenant.schema || 'tnt_apollo_enterprise'}</span>
            <span className="text-slate-300 font-medium">{currentTenant.outlets || 112} stores</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-1">
          <img
            src={ASSET_IMAGES.adminAvatar}
            alt="Dr. Elena Vance"
            className="w-8 h-8 rounded-full border border-sky-400/40 object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Dr. Elena Vance</div>
            <div className="text-[10px] text-slate-400 truncate">Lead Clinical Ops & Admin</div>
          </div>
          <span className="material-symbols-outlined text-slate-400 hover:text-white cursor-pointer text-lg">
            logout
          </span>
        </div>
      </div>
    </aside>
  );
};
