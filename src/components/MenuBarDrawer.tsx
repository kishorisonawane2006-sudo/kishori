import React, { useEffect } from 'react';
import { 
  AppMode, 
  PatientTab, 
  PortalTab, 
  TenantOrganization, 
  UserProfile 
} from '../types';
import { 
  X, 
  Pill, 
  LayoutDashboard, 
  Smartphone, 
  Network, 
  FileText, 
  KeyRound, 
  User, 
  ShoppingBag, 
  History, 
  Truck, 
  Search, 
  ArrowLeftRight, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  Lock, 
  ChevronRight,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';

interface MenuBarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  patientTab?: PatientTab;
  onSelectPatientTab?: (tab: PatientTab) => void;
  portalTab?: PortalTab;
  onSelectPortalTab?: (tab: PortalTab) => void;
  user?: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  cartCount?: number;
  tenants?: TenantOrganization[];
  selectedTenant?: TenantOrganization;
  onTenantChange?: (tenant: TenantOrganization) => void;
  phoneFrame?: boolean;
  onTogglePhoneFrame?: () => void;
}

export const MenuBarDrawer: React.FC<MenuBarDrawerProps> = ({
  isOpen,
  onClose,
  currentMode,
  onSelectMode,
  patientTab,
  onSelectPatientTab,
  portalTab,
  onSelectPortalTab,
  user,
  onOpenLogin,
  onLogout,
  cartCount = 0,
  tenants = [],
  selectedTenant,
  onTenantChange,
  phoneFrame,
  onTogglePhoneFrame
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navigateToPatientTab = (tab: PatientTab) => {
    onSelectMode('patient');
    if (onSelectPatientTab) onSelectPatientTab(tab);
    onClose();
  };

  const navigateToPortalTab = (tab: PortalTab) => {
    onSelectMode('portal');
    if (onSelectPortalTab) onSelectPortalTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Semi-transparent Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Menu Bar */}
      <div className="relative w-84 sm:w-96 max-w-[85vw] bg-[#0b1c30] text-slate-100 h-full shadow-2xl flex flex-col z-10 border-r border-slate-700/80 animate-in slide-in-from-left duration-300">
        {/* Menu Bar Header */}
        <div className="p-4 sm:p-5 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-white text-xl">pill</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base font-headline">MediGeneric</span>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold px-1.5 py-0.2 rounded uppercase">
                  Menu
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Navigation & Operations Bar</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close Menu Bar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Banner in Menu Bar */}
        <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-slate-800/80 border border-slate-700">
          {user ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-600"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                    <span>{user.fullName}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">
                    {user.role === 'patient' ? 'Verified Patient' : user.role === 'pharmacy_admin' ? 'Pharmacy Partner' : 'SaaS Admin'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-700/60 text-[11px]">
                <button
                  onClick={() => {
                    navigateToPatientTab('profile');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <User className="w-3 h-3 text-sky-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    navigateToPatientTab('order-history');
                  }}
                  className="px-2 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <History className="w-3 h-3 text-emerald-400" />
                  <span>Past Orders</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white">Guest User</div>
                <div className="text-[11px] text-slate-400">Sign in to sync prescriptions</div>
              </div>
              <button
                onClick={() => {
                  onSelectMode('login');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Menu Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs">
          {/* SECTION 1: Patient Storefront & Medicine Services */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3 h-3 text-emerald-400" />
                Patient App
              </span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded font-mono">
                Storefront
              </span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigateToPatientTab('discover')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'discover'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-emerald-400" />
                  <span>Discover Generics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => navigateToPatientTab('price-compare')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'price-compare'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ArrowLeftRight className="w-4 h-4 text-sky-400" />
                  <span>Price Comparison Matrix</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  80% Off
                </span>
              </button>

              <button
                onClick={() => navigateToPatientTab('cart')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'cart'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Prescription Cart</span>
                </div>
                {cartCount > 0 ? (
                  <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-1.5 py-0.2 rounded-full">
                    {cartCount} items
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              <button
                onClick={() => navigateToPatientTab('my-orders')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'my-orders'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>Live Dispatch Tracking</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
              </button>

              <button
                onClick={() => navigateToPatientTab('order-history')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'order-history'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <History className="w-4 h-4 text-emerald-400" />
                  <span>Order History & Invoices</span>
                </div>
                <span className="text-[10px] text-emerald-300 font-bold">New</span>
              </button>

              <button
                onClick={() => navigateToPatientTab('profile')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'patient' && patientTab === 'profile'
                    ? 'bg-emerald-600/30 text-emerald-300 font-bold border border-emerald-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>Profile & Clinical Details</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* SECTION 2: Pharmacy Operations & SaaS Portal */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LayoutDashboard className="w-3 h-3 text-sky-400" />
                Pharmacy Ops Portal
              </span>
              <span className="text-[9px] text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded font-mono">
                B2B Multi-Tenant
              </span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigateToPortalTab('overview')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'portal' && portalTab === 'overview'
                    ? 'bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Executive Overview & Metrics</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => navigateToPortalTab('tenants')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'portal' && portalTab === 'tenants'
                    ? 'bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Tenant Store Network ({tenants.length})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => navigateToPortalTab('orders')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'portal' && portalTab === 'orders'
                    ? 'bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Prescription Pipeline & SLAs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => navigateToPortalTab('catalog')}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'portal' && portalTab === 'catalog'
                    ? 'bg-sky-600/30 text-sky-300 font-bold border border-sky-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Generic Catalog & Buy-Box Pricing</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* SECTION 3: Dedicated Authentication & Platform Tools */}
          <div>
            <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-3 h-3 text-purple-400" />
                Auth & System
              </span>
              <span className="text-[9px] text-purple-300 bg-purple-500/10 px-1.5 py-0.2 rounded font-mono">
                EPCS / DEA
              </span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onSelectMode('login');
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'login'
                    ? 'bg-purple-600/30 text-purple-300 font-bold border border-purple-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <span>Separate Login & Auth Page</span>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-medium">
                  2FA Active
                </span>
              </button>

              <button
                onClick={() => {
                  onSelectMode('architecture');
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'architecture'
                    ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Network className="w-4 h-4 text-indigo-400" />
                  <span>Architecture Blueprint Explorer</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={() => {
                  onSelectMode('prd');
                  onClose();
                }}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-colors ${
                  currentMode === 'prd'
                    ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>System Specification PRD</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Bar Footer Controls */}
        <div className="p-3 border-t border-slate-700/80 bg-slate-900/80 space-y-2 text-xs">
          {/* Tenant Selector inside menu */}
          {tenants.length > 0 && selectedTenant && onTenantChange && (
            <div className="flex items-center justify-between gap-2 px-2 py-1 bg-slate-800/80 rounded-xl border border-slate-700 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <Building2 className="w-3 h-3 text-sky-400" />
                Active Store:
              </span>
              <select
                value={selectedTenant.id}
                onChange={(e) => {
                  const t = tenants.find((item) => item.id === e.target.value);
                  if (t) onTenantChange(t);
                }}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1 text-right max-w-[170px] truncate"
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quick Sign Out / Login & System Telemetry */}
          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>US-East-1 • 99.98% SLA</span>
            </div>

            {user ? (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  onSelectMode('login');
                  onClose();
                }}
                className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
