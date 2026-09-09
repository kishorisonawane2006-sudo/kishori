import React, { useState } from 'react';
import {
  AppMode,
  PortalTab,
  PatientTab,
  TenantOrganization,
  PlatformOrder,
  MedicineListing,
  CartItem,
  UserProfile
} from './types';
import {
  INITIAL_TENANTS,
  INITIAL_ORDERS,
  INITIAL_LISTINGS,
  INITIAL_CART,
  ASSET_IMAGES
} from './data/initialData';
import { INITIAL_USER } from './data/userData';
import { api } from './services/api';

// Global Navigation
import { NavigationHeader } from './components/NavigationHeader';

// Portal Components & Screens
import { PortalSidebar } from './components/portal/PortalSidebar';
import { PortalHeader } from './components/portal/PortalHeader';
import { OverviewScreen } from './components/portal/OverviewScreen';
import { MultiTenantScreen } from './components/portal/MultiTenantScreen';
import { OrdersPipelineScreen } from './components/portal/OrdersPipelineScreen';
import { VendorListingsScreen } from './components/portal/VendorListingsScreen';

// Patient Components & Screens
import { PatientHeader, PatientBottomNav } from './components/patient/PatientHeader';
import { DiscoverScreen } from './components/patient/DiscoverScreen';
import { PriceCompareScreen } from './components/patient/PriceCompareScreen';
import { CartScreen } from './components/patient/CartScreen';
import { OrderTrackingScreen } from './components/patient/OrderTrackingScreen';
import { OrderHistoryScreen } from './components/patient/OrderHistoryScreen';
import { ProfileScreen } from './components/patient/ProfileScreen';

// Dedicated Login Page
import { LoginPage } from './components/auth/LoginPage';

// Global Slide-Out Menu Bar
import { MenuBarDrawer } from './components/MenuBarDrawer';

// Architecture & PRD Screens
import { ArchitectureExplorer } from './components/architecture/ArchitectureExplorer';
import { PrdViewer } from './components/prd/PrdViewer';

// ── Phase 2: Logistics, IoT & Mobile screens ──────────────────────────────────
import { LogisticsDashboardScreen } from './components/logistics/LogisticsDashboardScreen';
import { RiderCompanionScreen } from './components/logistics/RiderCompanionScreen';
import { GeoFenceMapScreen } from './components/logistics/GeoFenceMapScreen';
import { MobilePatientApp } from './components/mobile/MobilePatientApp';

// ── Phase 3: Clinical EHR, DDI Engine, Voice Search, B2B Wholesale ───────────
import { FhirEhrScreen } from './components/clinical/FhirEhrScreen';
import { DdiEngineScreen } from './components/clinical/DdiAlertModal';
import { VoiceSearchScreen } from './components/clinical/VoiceSearchWidget';
import { WholesaleMarketplaceScreen } from './components/wholesale/WholesaleMarketplaceScreen';

// ── Phase 4: Insurance Adjudication, Hub Logistics, Microservice Architecture ─
import { InsuranceAdjudicationScreen } from './components/insurance/InsuranceAdjudicationScreen';
import { HubLogisticsMeshScreen } from './components/infrastructure/HubLogisticsMeshScreen';
import { MicroserviceArchitectureScreen } from './components/infrastructure/MicroserviceArchitectureScreen';

export default function App() {
  // Global View Mode (Defaults to patient medicine marketplace for easy discovery)
  const [appMode, setAppMode] = useState<AppMode>('patient');

  // Menu Bar Drawer State (Opened via three menu points at top left)
  const [isMenuBarOpen, setIsMenuBarOpen] = useState<boolean>(false);

  // Portal Left Blue Menubar State (Hidden by default, shown via three buttons/points)
  const [isPortalSidebarOpen, setIsPortalSidebarOpen] = useState<boolean>(false);

  // Portal Sub-Tab
  const [portalTab, setPortalTab] = useState<PortalTab>('overview');

  // Patient Sub-Tab
  const [patientTab, setPatientTab] = useState<PatientTab>('discover');

  // Mobile Frame Toggle (Default false for spacious, easy-to-use desktop view)
  const [phoneFrame, setPhoneFrame] = useState<boolean>(false);

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USER);

  // Phase 2: Active rider for companion view
  const [activeRiderId, setActiveRiderId] = useState<string>('rider-001');

  // Shared Marketplace State
  const [tenants, setTenants] = useState<TenantOrganization[]>(INITIAL_TENANTS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('apollo');
  const [orders, setOrders] = useState<PlatformOrder[]>(INITIAL_ORDERS);
  const [listings, setListings] = useState<MedicineListing[]>(INITIAL_LISTINGS);
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<PlatformOrder>(INITIAL_ORDERS[0]);

  // Handler for user login
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role === 'pharmacy_admin') {
      setAppMode('portal');
    } else {
      setAppMode('patient');
      setPatientTab('discover');
    }
  };

  // Handler for user logout
  const handleLogout = () => {
    setCurrentUser(null);
    setAppMode('login');
  };

  // Handler to update user profile
  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
  };

  // Handler to update order status (e.g. from Ops Portal)
  const handleUpdateOrderStatus = (orderId: string, newStatus: PlatformOrder['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    if (activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => ({ ...prev, status: newStatus }));
    }
    fetch(`/api/v1/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(() => { /* silent fallback */ });
  };

  // Handler to update listing price (Buy-Box Repricing)
  const handleUpdateListingPrice = (listingId: string, newPrice: number) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === listingId) {
          const isWinning = newPrice <= l.competitorLowestPrice;
          return {
            ...l,
            unitPrice: newPrice,
            status: isWinning ? 'winning' : 'beaten',
            syncTime: 'Just now'
          };
        }
        return l;
      })
    );
    api.updateTenantListing(listingId, { unitPrice: newPrice }, 'apollo').catch(() => { /* silent fallback */ });
  };

  // Handler to add new generic listing
  const handleAddListing = (newListing: MedicineListing) => {
    setListings((prev) => [newListing, ...prev]);
  };

  // Handler to add tenant
  const handleAddTenant = (newTenant: TenantOrganization) => {
    setTenants((prev) => [newTenant, ...prev]);
    setSelectedTenantId(newTenant.id);
  };

  // Patient Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.medicineName === item.medicineName && i.dosage === item.dosage);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler when patient reorders previous items from order history
  const handleReorder = (items: CartItem[]) => {
    setCart((prev) => {
      const newItems = [...prev];
      items.forEach((item) => {
        const existing = newItems.find((i) => i.medicineName === item.medicineName && i.dosage === item.dosage);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          newItems.push(item);
        }
      });
      return newItems;
    });
    setAppMode('patient');
    setPatientTab('cart');
  };

  // Handler when patient clicks "Track Live Delivery"
  const handleTrackOrder = (order: PlatformOrder) => {
    setActiveTrackingOrder(order);
    setAppMode('patient');
    setPatientTab('my-orders');
  };

  // Handler when patient places a new order
  const handlePlaceOrder = (newOrder: PlatformOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
    setCart([]);
    setPatientTab('my-orders');
  };

  const cartTotalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalAmount = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-body selection:bg-sky-500 selection:text-white">
      {/* Top Global Navigation Bar with User Profile & Separate Login triggers */}
      {/* Global Application Navigation Bar */}
      <NavigationHeader
        activeMode={appMode}
        onSelectMode={(mode) => setAppMode(mode)}
        currentMode={appMode}
        onModeChange={(mode) => setAppMode(mode)}
        patientTab={patientTab}
        onSelectPatientTab={(tab) => {
          setPatientTab(tab);
          setAppMode('patient');
        }}
        portalTab={portalTab}
        onSelectPortalTab={(tab) => {
          setPortalTab(tab);
          setAppMode('portal');
        }}
        user={currentUser}
        onOpenLogin={() => setAppMode('login')}
        onOpenProfile={() => {
          setAppMode('patient');
          setPatientTab('profile');
        }}
        onOpenOrders={() => {
          setAppMode('patient');
          setPatientTab('order-history');
        }}
        onOpenCart={() => {
          setAppMode('patient');
          setPatientTab('cart');
        }}
        onLogout={handleLogout}
        phoneFrame={phoneFrame}
        onTogglePhoneFrame={() => setPhoneFrame(!phoneFrame)}
        cartCount={cartTotalQuantity}
        cartTotal={cartTotalAmount}
        tenants={tenants}
        selectedTenant={tenants.find((t) => t.id === selectedTenantId) || tenants[0]}
        onTenantChange={(t) => setSelectedTenantId(t.id)}
        onToggleMenuBar={() => setIsMenuBarOpen(true)}
      />

      {/* Slide-out Menu Bar Drawer triggered by Top Left Three Menu Points */}
      <MenuBarDrawer
        isOpen={isMenuBarOpen}
        onClose={() => setIsMenuBarOpen(false)}
        currentMode={appMode}
        onSelectMode={(mode) => {
          setAppMode(mode);
          setIsMenuBarOpen(false);
        }}
        patientTab={patientTab}
        onSelectPatientTab={(tab) => {
          setPatientTab(tab);
          setAppMode('patient');
          setIsMenuBarOpen(false);
        }}
        portalTab={portalTab}
        onSelectPortalTab={(tab) => {
          setPortalTab(tab);
          setAppMode('portal');
          setIsMenuBarOpen(false);
        }}
        user={currentUser}
        onOpenLogin={() => {
          setAppMode('login');
          setIsMenuBarOpen(false);
        }}
        onLogout={handleLogout}
        cartCount={cartTotalQuantity}
        tenants={tenants}
        selectedTenant={tenants.find((t) => t.id === selectedTenantId) || tenants[0]}
        onTenantChange={(t) => setSelectedTenantId(t.id)}
        phoneFrame={phoneFrame}
        onTogglePhoneFrame={() => setPhoneFrame(!phoneFrame)}
      />

      {/* Render Active App Mode */}
      <main className="flex-1 flex flex-col">
        {/* MODE 1: PHARMACY SAAS OPERATIONS PORTAL */}
        {appMode === 'portal' && (
          <div className="flex-1 flex overflow-hidden relative">
            {/* Left Blue Menubar (Hidden by default, slides out when toggled via three buttons/points) */}
            {isPortalSidebarOpen && (
              <div className="fixed inset-0 z-50 flex">
                {/* Backdrop to click outside and hide */}
                <div
                  className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
                  onClick={() => setIsPortalSidebarOpen(false)}
                />
                <div className="relative z-10 animate-in slide-in-from-left duration-200 shadow-2xl h-full flex">
                  <PortalSidebar
                    activeTab={portalTab}
                    onSelectTab={(tab) => {
                      setPortalTab(tab);
                      setIsPortalSidebarOpen(false);
                    }}
                    tenants={tenants}
                    selectedTenantId={selectedTenantId}
                    onSelectTenant={setSelectedTenantId}
                    pendingOrdersCount={orders.filter((o) => o.status === 'Out for Delivery').length}
                    onClose={() => setIsPortalSidebarOpen(false)}
                  />
                </div>
              </div>
            )}

            {/* Main Content Area (Expands to full width when sidebar is hidden) */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              <PortalHeader
                activeTab={portalTab}
                onSelectTab={setPortalTab}
                selectedTenant={tenants.find((t) => t.id === selectedTenantId) || tenants[0]}
                onQuickAddSku={() => setPortalTab('catalog')}
                isSidebarOpen={isPortalSidebarOpen}
                onToggleSidebar={() => setIsPortalSidebarOpen(!isPortalSidebarOpen)}
                pendingOrdersCount={orders.filter((o) => o.status === 'Out for Delivery').length}
              />

              {/* Three-Button Quick Dock on the Left Edge when Blue Menubar is Hidden */}
              {!isPortalSidebarOpen && (
                <div className="hidden lg:flex fixed left-4 bottom-6 z-30 bg-slate-900/90 text-white backdrop-blur-md p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl flex-col items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
                  <button
                    onClick={() => setIsPortalSidebarOpen(true)}
                    className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white transition-all shadow-sm group cursor-pointer"
                    title="Click to show left side blue menubar (Three Points)"
                  >
                    <div className="flex flex-col gap-0.5 items-center justify-center w-3.5 h-3.5">
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                      <span className="w-1 h-1 rounded-full bg-white"></span>
                    </div>
                  </button>
                  <div className="w-5 h-px bg-slate-700/80 my-0.5"></div>
                  {/* 3 Quick Buttons */}
                  <button
                    onClick={() => setPortalTab('overview')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'overview' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Button 1: Overview Dashboard"
                  >
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('orders')}
                    className={`p-2 rounded-xl transition-all relative cursor-pointer ${
                      portalTab === 'orders' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Button 2: Orders Pipeline"
                  >
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                    {orders.filter((o) => o.status === 'Out for Delivery').length > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
                    )}
                  </button>
                  <button
                    onClick={() => setPortalTab('catalog')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'catalog' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Button 3: Medicine Catalog"
                  >
                    <span className="material-symbols-outlined text-[18px]">pill</span>
                  </button>
                  {/* Phase 2 quick access */}
                  <div className="w-5 h-px bg-slate-700/80 my-0.5"></div>
                  <button
                    onClick={() => setPortalTab('logistics-dashboard')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'logistics-dashboard' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 2: Logistics Dashboard"
                  >
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('geo-fence-zones')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'geo-fence-zones' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 2: Geo-Fence Zones"
                  >
                    <span className="material-symbols-outlined text-[18px]">map</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('mobile-patient-app')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'mobile-patient-app' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 2: Mobile Patient App"
                  >
                    <span className="material-symbols-outlined text-[18px]">smartphone</span>
                  </button>
                  {/* Phase 3 quick access */}
                  <div className="w-5 h-px bg-slate-700/80 my-0.5"></div>
                  <button
                    onClick={() => setPortalTab('fhir-ehr')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'fhir-ehr' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 3: FHIR / EHR Gateway"
                  >
                    <span className="material-symbols-outlined text-[18px]">local_hospital</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('ddi-engine')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'ddi-engine' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 3: DDI Engine"
                  >
                    <span className="material-symbols-outlined text-[18px]">clinical_notes</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('voice-search')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'voice-search' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 3: Voice Search"
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('wholesale-marketplace')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'wholesale-marketplace' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 3: B2B Wholesale"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                  </button>
                  {/* Phase 4 quick access */}
                  <div className="w-5 h-px bg-slate-700/80 my-0.5"></div>
                  <button
                    onClick={() => setPortalTab('insurance-adjudication')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'insurance-adjudication' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 4: Insurance Adjudication"
                  >
                    <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('hub-logistics')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'hub-logistics' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 4: Hub Logistics Mesh"
                  >
                    <span className="material-symbols-outlined text-[18px]">hub</span>
                  </button>
                  <button
                    onClick={() => setPortalTab('microservice-architecture')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      portalTab === 'microservice-architecture' ? 'bg-sky-500/20 text-sky-300 ring-1 ring-sky-400/40' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Phase 4: Microservice Architecture"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_tree</span>
                  </button>
                </div>
              )}

              <div className="flex-1 pb-16">
                {portalTab === 'overview' && (
                  <OverviewScreen
                    orders={orders}
                    tenants={tenants}
                    listings={listings}
                    onNavigateTab={setPortalTab}
                    onViewTracking={(ord) => {
                      setActiveTrackingOrder(ord);
                      setAppMode('patient');
                      setPatientTab('my-orders');
                    }}
                  />
                )}

                {portalTab === 'tenants' && (
                  <MultiTenantScreen
                    tenants={tenants}
                    onAddTenant={handleAddTenant}
                    selectedTenantId={selectedTenantId}
                    onSelectTenant={setSelectedTenantId}
                  />
                )}

                {portalTab === 'orders' && (
                  <OrdersPipelineScreen
                    orders={orders}
                    onUpdateOrderStatus={handleUpdateOrderStatus}
                  />
                )}

                {portalTab === 'catalog' && (
                  <VendorListingsScreen
                    listings={listings}
                    onUpdateListingPrice={handleUpdateListingPrice}
                    onAddListing={handleAddListing}
                  />
                )}

                {/* ── Phase 2: Logistics & IoT Screens ─────────────────── */}
                {portalTab === 'logistics-dashboard' && (
                  <LogisticsDashboardScreen
                    onViewRider={(riderId) => {
                      setActiveRiderId(riderId);
                      setPortalTab('rider-companion');
                    }}
                  />
                )}

                {portalTab === 'rider-companion' && (
                  <RiderCompanionScreen riderId={activeRiderId} />
                )}

                {portalTab === 'geo-fence-zones' && (
                  <GeoFenceMapScreen />
                )}

                {portalTab === 'mobile-patient-app' && (
                  <div className="flex items-center justify-center p-6 min-h-[600px] bg-slate-100/60">
                    <div className="w-full max-w-sm shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-300 flex flex-col" style={{ minHeight: 780 }}>
                      <MobilePatientApp />
                    </div>
                  </div>
                )}

                {/* ── Phase 3: Clinical AI & B2B Wholesale Screens ─────── */}
                {portalTab === 'fhir-ehr' && <FhirEhrScreen />}

                {portalTab === 'ddi-engine' && <DdiEngineScreen />}

                {portalTab === 'voice-search' && <VoiceSearchScreen />}

                {portalTab === 'wholesale-marketplace' && <WholesaleMarketplaceScreen />}

                {/* ── Phase 4: Insurance, Hub Logistics & Microservices ────── */}
                {portalTab === 'insurance-adjudication' && <InsuranceAdjudicationScreen />}

                {portalTab === 'hub-logistics' && <HubLogisticsMeshScreen />}

                {portalTab === 'microservice-architecture' && <MicroserviceArchitectureScreen />}
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: PATIENT MEDICINES MARKETPLACE & STOREFRONT */}
        {appMode === 'patient' && (
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50/60">
            {/* Quick Context Sub-Banner with Live Location, Guarantee, and Fast Tab Shortcuts */}
            <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sky-800 font-semibold bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  <span className="material-symbols-outlined text-sm text-sky-600">location_on</span>
                  <span>{currentUser?.primaryAddress ? `${currentUser.primaryAddress.zipCode} ${currentUser.primaryAddress.city}` : '10001 New York'} • 20-30m Dispatch</span>
                </span>
                <span className="hidden md:inline text-slate-300">|</span>
                <span className="hidden md:flex items-center gap-1 text-emerald-700 font-medium">
                  <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
                  FDA Orange Book AB-Rated Generics (Save up to 85%)
                </span>
              </div>

              {/* Fast Secondary Tab Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  id="subnav-btn-discover"
                  onClick={() => setPatientTab('discover')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    patientTab === 'discover' ? 'bg-white text-sky-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Medicines
                </button>
                <button
                  id="subnav-btn-compare"
                  onClick={() => setPatientTab('price-compare')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    patientTab === 'price-compare' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Price Compare
                </button>
                <button
                  id="subnav-btn-orders"
                  onClick={() => setPatientTab('my-orders')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                    patientTab === 'my-orders' || patientTab === 'order-history' ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Orders
                </button>
                <button
                  id="subnav-btn-cart"
                  onClick={() => setPatientTab('cart')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    patientTab === 'cart' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Cart</span>
                  {cartTotalQuantity > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {cartTotalQuantity}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Layout Display: Phone Frame or Clean Full-Width Responsive View */}
            {phoneFrame ? (
              <div className="flex-1 flex items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-md shadow-2xl rounded-3xl bg-white overflow-hidden border border-slate-300 flex flex-col min-h-[780px] relative">
                  <PatientHeader
                    activeTab={patientTab}
                    onSelectTab={setPatientTab}
                    cartCount={cartTotalQuantity}
                    user={currentUser}
                    onOpenLogin={() => setAppMode('login')}
                    onToggleMenuBar={() => setIsMenuBarOpen(true)}
                  />
                  <div className="flex-1 overflow-y-auto bg-slate-50/50">
                    {patientTab === 'discover' && (
                      <DiscoverScreen
                        onSelectCompare={() => setPatientTab('price-compare')}
                        onAddToCart={handleAddToCart}
                      />
                    )}
                    {patientTab === 'price-compare' && (
                      <PriceCompareScreen
                        onAddToCart={handleAddToCart}
                        onGoToCart={() => setPatientTab('cart')}
                      />
                    )}
                    {patientTab === 'cart' && (
                      <CartScreen
                        cart={cart}
                        onUpdateQuantity={handleUpdateCartQuantity}
                        onRemoveItem={handleRemoveCartItem}
                        onPlaceOrder={handlePlaceOrder}
                        onGoToShop={() => setPatientTab('discover')}
                      />
                    )}
                    {patientTab === 'my-orders' && (
                      <OrderTrackingScreen
                        order={activeTrackingOrder}
                        onBackToDiscover={() => setPatientTab('discover')}
                      />
                    )}
                    {patientTab === 'order-history' && (
                      <OrderHistoryScreen
                        orders={orders}
                        customerEmail={currentUser?.email}
                        onTrackOrder={handleTrackOrder}
                        onReorder={handleReorder}
                        onGoToShop={() => setPatientTab('discover')}
                      />
                    )}
                    {patientTab === 'profile' && (
                      <ProfileScreen
                        user={currentUser || INITIAL_USER}
                        onUpdateUser={handleUpdateUser}
                        onLogout={handleLogout}
                        onNavigateToLogin={() => setAppMode('login')}
                        onViewOrders={() => setPatientTab('order-history')}
                      />
                    )}
                  </div>
                  <PatientBottomNav
                    activeTab={patientTab}
                    onSelectTab={setPatientTab}
                    cartCount={cartTotalQuantity}
                  />
                </div>
              </div>
            ) : (
              <div className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 py-4">
                {patientTab === 'discover' && (
                  <DiscoverScreen
                    onSelectCompare={() => setPatientTab('price-compare')}
                    onAddToCart={handleAddToCart}
                  />
                )}
                {patientTab === 'price-compare' && (
                  <PriceCompareScreen
                    onAddToCart={handleAddToCart}
                    onGoToCart={() => setPatientTab('cart')}
                  />
                )}
                {patientTab === 'cart' && (
                  <CartScreen
                    cart={cart}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onRemoveItem={handleRemoveCartItem}
                    onPlaceOrder={handlePlaceOrder}
                    onGoToShop={() => setPatientTab('discover')}
                  />
                )}
                {patientTab === 'my-orders' && (
                  <OrderTrackingScreen
                    order={activeTrackingOrder}
                    onBackToDiscover={() => setPatientTab('discover')}
                  />
                )}
                {patientTab === 'order-history' && (
                  <OrderHistoryScreen
                    orders={orders}
                    customerEmail={currentUser?.email}
                    onTrackOrder={handleTrackOrder}
                    onReorder={handleReorder}
                    onGoToShop={() => setPatientTab('discover')}
                  />
                )}
                {patientTab === 'profile' && (
                  <ProfileScreen
                    user={currentUser || INITIAL_USER}
                    onUpdateUser={handleUpdateUser}
                    onLogout={handleLogout}
                    onNavigateToLogin={() => setAppMode('login')}
                    onViewOrders={() => setPatientTab('order-history')}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 3: DEDICATED SEPARATE LOGIN PAGE */}
        {appMode === 'login' && (
          <LoginPage
            currentUser={currentUser}
            onLogin={handleLogin}
            onCancel={() => setAppMode('patient')}
          />
        )}

        {/* MODE 4: FULL-PAGE PROFILE & LOGIN SECURITY SCREEN */}
        {appMode === 'profile' && (
          <div className="flex-1 bg-slate-100/60 p-4 sm:p-6 overflow-y-auto">
            <ProfileScreen
              user={currentUser || INITIAL_USER}
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout}
              onNavigateToLogin={() => setAppMode('login')}
              onViewOrders={() => {
                setAppMode('patient');
                setPatientTab('order-history');
              }}
            />
          </div>
        )}

        {/* MODE 5: SYSTEM ARCHITECTURE BLUEPRINT */}
        {appMode === 'architecture' && <ArchitectureExplorer />}

        {/* MODE 6: FULL SPECIFICATION PRD */}
        {appMode === 'prd' && <PrdViewer />}
      </main>
    </div>
  );
}
