import React from 'react';
import { UserProfile, PatientTab } from '../../types';
import { User, LogIn, ShoppingBag, History, Sparkles } from 'lucide-react';

interface PatientHeaderProps {
  activeTab: PatientTab;
  onSelectTab: (tab: PatientTab) => void;
  cartCount: number;
  user?: UserProfile | null;
  onOpenLogin?: () => void;
  onToggleMenuBar?: () => void;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  user,
  onOpenLogin,
  onToggleMenuBar
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3.5 py-2.5 shadow-xs">
      <div className="flex items-center justify-between gap-2.5">
        {/* Top Left Menu Points & Brand */}
        <div className="flex items-center gap-2">
          {/* THREE MENU POINTS AT TOP LEFT */}
          <button
            id="patient-top-left-three-points-menu-btn"
            onClick={onToggleMenuBar}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center justify-center shrink-0 group focus:outline-none focus:ring-2 focus:ring-sky-500"
            title="Click to open Menu Bar (Three Menu Points)"
            aria-label="Open navigation menu bar"
          >
            <div className="flex flex-col gap-0.5 items-center justify-center w-4 h-4">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-600 transition-colors"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-600 transition-colors"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-sky-600 transition-colors"></span>
            </div>
          </button>

          <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-xs shrink-0">
            <span className="material-symbols-outlined text-white text-lg">medication</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 text-sm font-headline">MediGeneric</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 rounded">
                Rx Instant
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="material-symbols-outlined text-[13px] text-sky-600">location_on</span>
              <span className="truncate max-w-[125px] sm:max-w-[190px]">
                {user?.primaryAddress ? `${user.primaryAddress.zipCode} ${user.primaryAddress.city} • 20-30m` : '10001 New York • 20-30m'}
              </span>
            </div>
          </div>
        </div>

        {/* Action icons: Cart & User Profile / Login */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('cart')}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="View Cart"
          >
            <span className="material-symbols-outlined text-xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <button
              onClick={() => onSelectTab('profile')}
              className={`flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full border transition-all ${
                activeTab === 'profile'
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="View Profile & Login Information"
            >
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80'}
                alt={user.fullName}
                className="w-5 h-5 rounded-full object-cover border border-slate-300"
              />
              <span className="text-xs font-semibold max-w-[70px] truncate hidden xs:inline">
                {user.fullName.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shadow-xs"
              title="Sign In to Your Account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export const PatientBottomNav: React.FC<{
  activeTab: PatientTab;
  onSelectTab: (tab: PatientTab) => void;
  cartCount: number;
}> = ({ activeTab, onSelectTab, cartCount }) => {
  return (
    <nav className="bg-white border-t border-slate-200 sticky bottom-0 z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => onSelectTab('discover')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
          activeTab === 'discover' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className={`material-symbols-outlined text-xl ${activeTab === 'discover' ? 'filled' : ''}`}>
          explore
        </span>
        <span className="text-[10px] mt-0.5">Discover</span>
      </button>

      <button
        onClick={() => onSelectTab('price-compare')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
          activeTab === 'price-compare' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className={`material-symbols-outlined text-xl ${activeTab === 'price-compare' ? 'filled' : ''}`}>
          compare_arrows
        </span>
        <span className="text-[10px] mt-0.5">Compare</span>
      </button>

      <button
        onClick={() => onSelectTab('cart')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors relative ${
          activeTab === 'cart' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className={`material-symbols-outlined text-xl ${activeTab === 'cart' ? 'filled' : ''}`}>
          shopping_bag
        </span>
        <span className="text-[10px] mt-0.5">Cart</span>
        {cartCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow-xs">
            {cartCount}
          </span>
        )}
      </button>

      <button
        onClick={() => onSelectTab('order-history')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
          activeTab === 'order-history' || activeTab === 'my-orders' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className={`material-symbols-outlined text-xl ${activeTab === 'order-history' || activeTab === 'my-orders' ? 'filled' : ''}`}>
          history
        </span>
        <span className="text-[10px] mt-0.5">Orders</span>
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
          activeTab === 'profile' ? 'text-sky-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span className={`material-symbols-outlined text-xl ${activeTab === 'profile' ? 'filled' : ''}`}>
          person
        </span>
        <span className="text-[10px] mt-0.5">Profile</span>
      </button>
    </nav>
  );
};
