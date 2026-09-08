import React, { useState } from 'react';
import { TenantOrganization, PortalTab } from '../../types';

interface PortalHeaderProps {
  onAddMedicine?: () => void;
  onOnboardTenant?: () => void;
  selectedTenant?: TenantOrganization;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  activeTab?: PortalTab;
  onSelectTab?: (tab: PortalTab) => void;
  onQuickAddSku?: () => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  pendingOrdersCount?: number;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  onAddMedicine,
  onOnboardTenant,
  selectedTenant,
  searchQuery = '',
  onSearchChange = (_query: string) => {},
  activeTab = 'overview',
  onSelectTab,
  onQuickAddSku,
  onToggleSidebar,
  isSidebarOpen = false,
  pendingOrdersCount = 3
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (val: string) => {
    setLocalSearch(val);
    onSearchChange(val);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
      {/* Left Area: Three Points Toggle for Left Blue Menubar + Three Direct Portal Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* THREE MENU POINTS BUTTON TO SHOW/HIDE LEFT BLUE MENUBAR */}
        <button
          id="portal-toggle-blue-menubar-btn"
          onClick={onToggleSidebar}
          className={`p-2 rounded-xl transition-all flex items-center justify-center gap-1 group shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500 shrink-0 cursor-pointer ${
            isSidebarOpen 
              ? 'bg-sky-600 text-white shadow-sky-500/30 ring-2 ring-sky-400/40' 
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700'
          }`}
          title={isSidebarOpen ? "Hide left side blue menubar" : "Show left side blue menubar (Three Points)"}
          aria-label="Toggle left side blue menubar"
        >
          <div className="flex flex-col gap-0.5 items-center justify-center w-4 h-4">
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${isSidebarOpen ? 'bg-white' : 'bg-sky-400 group-hover:bg-white group-hover:scale-110'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${isSidebarOpen ? 'bg-white' : 'bg-sky-400 group-hover:bg-white group-hover:scale-110'}`}></span>
            <span className={`w-1.5 h-1.5 rounded-full transition-all ${isSidebarOpen ? 'bg-white' : 'bg-sky-400 group-hover:bg-white group-hover:scale-110'}`}></span>
          </div>
        </button>

        {/* THREE BUTTONS FOR QUICK PORTAL ACCESS (Overview, Orders, Catalog) */}
        <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200">
          <button
            id="portal-btn-overview"
            onClick={() => onSelectTab?.('overview')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="Button 1: Overview Dashboard"
          >
            <span className="material-symbols-outlined text-[15px]">dashboard</span>
            <span className="hidden md:inline">Overview</span>
          </button>

          <button
            id="portal-btn-orders"
            onClick={() => onSelectTab?.('orders')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="Button 2: Prescription Orders & SLAs"
          >
            <span className="material-symbols-outlined text-[15px]">local_shipping</span>
            <span className="hidden md:inline">Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[9px] flex items-center justify-center font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            id="portal-btn-catalog"
            onClick={() => onSelectTab?.('catalog')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'catalog'
                ? 'bg-white text-sky-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
            title="Button 3: Medicine Catalog & Buy-Box"
          >
            <span className="material-symbols-outlined text-[15px]">pill</span>
            <span className="hidden md:inline">Catalog</span>
          </button>
        </div>

        {/* Status Pill indicating if blue menubar is hidden */}
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-sky-700 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-200 transition-colors cursor-pointer"
            title="Click to show the left side blue menubar"
          >
            <span className="material-symbols-outlined text-[15px] text-sky-600">view_sidebar</span>
            <span>Show Blue Menubar</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search molecules, NDC, tenant schemas, or order numbers (#ORD-2026)..."
          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
        />
      </div>

      {/* Action Buttons & Notifications */}
      <div className="flex items-center gap-2">
        <button
          onClick={onQuickAddSku || onAddMedicine}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px] text-sky-600">add</span>
          <span className="hidden xs:inline">+ Add Medicine</span>
        </button>

        <button
          onClick={() => onSelectTab?.('tenants')}
          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">domain_add</span>
          <span className="hidden xs:inline">+ Onboard Tenant</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 relative transition-colors cursor-pointer"
            title="Alerts & Telemetry"
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Priority Clinical Alerts</span>
                <span className="text-[10px] text-sky-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2 mt-2">
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                  <div className="font-semibold text-amber-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-amber-600">warning</span>
                    License Renewal Due
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    HealthKart Direct state DEA renewal due in 45 days.
                  </p>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs">
                  <div className="font-semibold text-red-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-red-600">price_change</span>
                    Buy-Box Parity Alert
                  </div>
                  <p className="text-[11px] text-red-700 mt-0.5">
                    Glucophage 500mg beaten by CarePoint (-$0.30) on Apollo Store #104.
                  </p>
                </div>
                <div className="p-2 bg-sky-50 border border-sky-200 rounded-lg text-xs">
                  <div className="font-semibold text-sky-900 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-sky-600">local_shipping</span>
                    Cold-Chain Handover
                  </div>
                  <p className="text-[11px] text-sky-700 mt-0.5">
                    Order #ORD-2026-8941 temperature logged at 3.8°C (Compliant).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
