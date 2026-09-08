import React, { useState } from 'react';
import { AppMode, TenantOrganization, UserProfile, PatientTab, PortalTab } from '../types';
import { 
  Pill, 
  Scale, 
  Package, 
  Building2, 
  Layers, 
  ShoppingCart, 
  User, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  History, 
  ChevronDown, 
  KeyRound, 
  Smartphone, 
  Check,
  FileText,
  Sparkles
} from 'lucide-react';

interface NavigationHeaderProps {
  currentMode?: AppMode;
  activeMode?: AppMode;
  onModeChange?: (mode: AppMode) => void;
  onSelectMode: (mode: AppMode) => void;
  patientTab?: PatientTab;
  onSelectPatientTab?: (tab: PatientTab) => void;
  portalTab?: PortalTab;
  onSelectPortalTab?: (tab: PortalTab) => void;
  selectedTenant?: TenantOrganization;
  onTenantChange?: (tenant: TenantOrganization) => void;
  tenants?: TenantOrganization[];
  phoneFrame?: boolean;
  onTogglePhoneFrame?: () => void;
  cartCount?: number;
  cartTotal?: number;
  user?: UserProfile | null;
  onOpenLogin?: () => void;
  onOpenProfile?: () => void;
  onOpenOrders?: () => void;
  onOpenCart?: () => void;
  onLogout?: () => void;
  onToggleMenuBar?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  currentMode,
  activeMode,
  onModeChange,
  onSelectMode,
  patientTab = 'discover',
  onSelectPatientTab,
  portalTab = 'overview',
  onSelectPortalTab,
  selectedTenant,
  onTenantChange,
  tenants = [],
  phoneFrame = false,
  onTogglePhoneFrame,
  cartCount = 0,
  cartTotal = 0,
  user,
  onOpenLogin,
  onOpenProfile,
  onOpenOrders,
  onOpenCart,
  onLogout,
  onToggleMenuBar
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDocsMenu, setShowDocsMenu] = useState(false);
  const mode = activeMode || currentMode || 'patient';
  const handleMode = onSelectMode || onModeChange || (() => {});

  const currentSelectedTenant = selectedTenant || tenants[0] || {
    id: 'TNT-3109',
    name: 'Apollo Pharmacy Chain',
    outlets: 112
  };

  const isFindActive = mode === 'patient' && patientTab === 'discover';
  const isCompareActive = mode === 'patient' && patientTab === 'price-compare';
  const isOrdersActive = mode === 'patient' && (patientTab === 'my-orders' || patientTab === 'order-history');
  const isCartActive = mode === 'patient' && patientTab === 'cart';
  const isPortalActive = mode === 'portal';
  const isDocsActive = mode === 'architecture' || mode === 'prd';

  return (
    <header className="sticky top-0 z-50 bg-[#0b1c30] text-white border-b border-slate-700/80 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Section: Three Menu Points Button & Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* THREE MENU POINTS BUTTON AT TOP LEFT */}
          <button
            id="top-left-three-points-menu-btn"
            onClick={onToggleMenuBar}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-1 group shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-400 shrink-0 cursor-pointer"
            title="Click to open Main Menu Bar (Three Menu Points)"
            aria-label="Open navigation menu bar"
          >
            <div className="flex flex-col gap-1 items-center justify-center w-4 h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-sky-400 group-hover:scale-125 transition-all"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-sky-400 group-hover:scale-125 transition-all"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-sky-400 group-hover:scale-125 transition-all"></span>
            </div>
          </button>

          {/* Logo & Brand Name */}
          <div 
            onClick={() => {
              handleMode('patient');
              if (onSelectPatientTab) onSelectPatientTab('discover');
            }}
            className="flex items-center gap-2 cursor-pointer group"
            title="Go to Find Medicines"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
              <span className="material-symbols-outlined text-white text-xl">medication</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-base sm:text-lg font-headline text-white">MediGeneric</span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hidden xs:inline">
                  Rx Save
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden md:block leading-none mt-0.5">
                Generic Salt & Pharmacy Marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Center: Clean, Easy-to-Use Core Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 shadow-inner overflow-x-auto max-w-full">
          {/* Tab 1: Find Medicines */}
          <button
            id="nav-tab-find-medicines"
            onClick={() => {
              handleMode('patient');
              if (onSelectPatientTab) onSelectPatientTab('discover');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isFindActive
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Search and browse FDA AB-rated generic medicines"
          >
            <Pill className="w-3.5 h-3.5 text-sky-400" />
            <span>Find Medicines</span>
          </button>

          {/* Tab 2: Price Compare */}
          <button
            id="nav-tab-price-compare"
            onClick={() => {
              handleMode('patient');
              if (onSelectPatientTab) onSelectPatientTab('price-compare');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isCompareActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Compare branded vs generic prices & bio-equivalence"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" />
            <span>Price Compare</span>
          </button>

          {/* Tab 3: My Orders */}
          <button
            id="nav-tab-my-orders"
            onClick={() => {
              handleMode('patient');
              if (onSelectPatientTab) onSelectPatientTab('my-orders');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isOrdersActive
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Track prescriptions and view order history"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>My Orders</span>
          </button>

          {/* Tab 4: Pharmacy Ops Portal */}
          <button
            id="nav-tab-pharmacy-portal"
            onClick={() => {
              handleMode('portal');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isPortalActive
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Pharmacy SaaS operations, orders pipeline & catalog"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Pharmacy Hub</span>
            <span className="sm:hidden">Ops</span>
          </button>

          {/* Tab 5: Specs & Architecture (Dropdown) */}
          <div className="relative">
            <button
              onClick={() => setShowDocsMenu(!showDocsMenu)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isDocsActive
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title="View system architecture and specifications"
            >
              <Layers className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden md:inline">Docs</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDocsMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDocsMenu(false)}
                />
                <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50 text-xs">
                  <button
                    onClick={() => {
                      setShowDocsMenu(false);
                      handleMode('architecture');
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center gap-2 transition-colors ${
                      mode === 'architecture' ? 'bg-indigo-600/30 text-indigo-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>System Architecture</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowDocsMenu(false);
                      handleMode('prd');
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center gap-2 transition-colors ${
                      mode === 'prd' ? 'bg-amber-600/30 text-amber-300 font-bold' : 'hover:bg-slate-800 text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Full System PRD</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        {/* Right Section: Cart, Account / Login, and Phone Frame View Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Shopping Cart Button */}
          <button
            id="header-cart-btn"
            onClick={() => {
              if (onOpenCart) {
                onOpenCart();
              } else {
                handleMode('patient');
                if (onSelectPatientTab) onSelectPatientTab('cart');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer relative ${
              isCartActive
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Shopping Cart & Fast Checkout"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold hidden md:inline">Cart</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ml-0.5 shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile / Login Dropdown */}
          {user ? (
            <div className="relative">
              <button
                id="header-user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl transition-all text-xs text-left cursor-pointer"
                title="Account Settings"
              >
                <div className="hidden lg:block text-right">
                  <div className="font-bold text-white leading-none truncate max-w-[110px]">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-sky-400 font-medium capitalize">
                    {user.role === 'patient' ? 'Patient' : 'Store Admin'}
                  </div>
                </div>
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-600 shrink-0"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3.5 py-2.5 border-b border-slate-800">
                      <div className="font-bold text-white text-sm">{user.fullName}</div>
                      <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>EPCS & HIPAA Verified Patient</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-sky-400" />
                        <span>Profile & Address Info</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onOpenOrders) onOpenOrders();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200 cursor-pointer"
                      >
                        <History className="w-4 h-4 text-emerald-400" />
                        <span>Order History & Invoices</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          handleMode('login');
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200 cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4 text-purple-400" />
                        <span>Switch User / Login Page</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleMode('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Phone Frame Toggle (Optional responsive test) */}
          {onTogglePhoneFrame && (
            <button
              onClick={onTogglePhoneFrame}
              className={`p-2 rounded-xl border transition-colors hidden md:flex items-center justify-center cursor-pointer ${
                phoneFrame
                  ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700 hover:bg-slate-700'
              }`}
              title={phoneFrame ? 'Switch to Full Width Responsive View' : 'Preview Mobile Frame Size'}
              aria-label="Toggle Phone Frame"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
