import React, { useState } from 'react';
import { CartItem, PlatformOrder } from '../../types';

interface CartScreenProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onPlaceOrder: (newOrder: PlatformOrder) => void;
  onGoToShop: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  onGoToShop
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'apple' | 'card' | 'hsa'>('apple');
  const [isPlacing, setIsPlacing] = useState(false);

  const genericTotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const brandedTotal = cart.reduce((acc, item) => acc + item.brandedPrice * item.quantity, 0);
  const totalSavings = Math.max(0, brandedTotal - genericTotal);
  const savingsPercent = brandedTotal > 0 ? Math.round((totalSavings / brandedTotal) * 100) : 0;

  const handleCheckout = () => {
    setIsPlacing(true);
    setTimeout(() => {
      const orderNum = `#ORD-2026-${Math.floor(8000 + Math.random() * 1999)}`;
      const newOrder: PlatformOrder = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNum,
        orderDate: 'Today',
        orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerName: 'Sarah Jenkins',
        customerAddress: '482 Atlantic Ave, Brooklyn NY 11217',
        distanceMiles: 1.8,
        channel: 'Patient Mobile App v2.4',
        tenantStoreName: 'Apollo Pharmacy Hub',
        tenantStoreNumber: '#104',
        genericMolecule: cart.map((i) => i.medicineName).join(' + '),
        brandReference: cart.map((i) => i.brandName).join(' & '),
        items: cart.map((i) => ({
          name: i.medicineName,
          dosage: i.dosage,
          packaging: i.packDescription,
          lotNumber: 'ATR-8812',
          price: i.unitPrice,
          quantity: i.quantity
        })),
        orderTotal: genericTotal,
        brandedValue: brandedTotal,
        patientSavingsPercent: savingsPercent,
        patientSavingsAmount: totalSavings,
        platformFee: Number((genericTotal * 0.1).toFixed(2)),
        status: 'Out for Delivery',
        rxNumber: 'RX-99410',
        prescribingDoctor: 'Dr. Harrison Wright, MD',
        pharmacistAudit: 'Pharm. David Cole, RPh (#PH-492)',
        deliveryType: 'Cold-Chain',
        courierName: 'Carlos M.',
        courierVehicle: 'SwiftMed Courier Fleet #84',
        courierEtaMins: 18,
        courierTempCelsius: 3.8
      };

      onPlaceOrder(newOrder);
      setIsPlacing(false);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="p-8 text-center max-w-sm mx-auto space-y-4 pt-16">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <span className="material-symbols-outlined text-3xl">shopping_cart</span>
        </div>
        <h2 className="font-bold text-slate-800 text-base font-headline">Your Affordability Basket is Empty</h2>
        <p className="text-xs text-slate-500">
          Search branded medicines or generic salts to save up to 85% with instant pharmacy delivery.
        </p>
        <button
          onClick={onGoToShop}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          Explore Generic Deals
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto pb-24 text-xs">
      {/* Lowest Price Guarantee Banner */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900">
        <span className="material-symbols-outlined text-emerald-600 text-xl shrink-0">verified</span>
        <div className="text-[11px]">
          <strong className="font-semibold block text-emerald-800">Guaranteed Lowest Market Price</strong>
          Verified against 14 local licensed pharmacies with real-time stock sync.
        </div>
      </div>

      {/* Delivery Address Pill */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sky-600 text-lg">home</span>
          <div>
            <div className="font-semibold text-slate-900 text-xs">Deliver to Home</div>
            <div className="text-[11px] text-slate-500">482 Atlantic Ave, Brooklyn NY 11217</div>
          </div>
        </div>
        <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-full">
          25-35 mins
        </span>
      </div>

      {/* Prescription Badge */}
      <div className="bg-indigo-50/70 rounded-2xl p-3 border border-indigo-200/80 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-indigo-900">
          <span className="material-symbols-outlined text-indigo-600 text-base">description</span>
          <span>Rx Attached: <strong className="font-mono">RX-99410</strong> (Dr. H. Wright)</span>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
          Verified
        </span>
      </div>

      {/* Cart Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-3">
        <div className="font-bold text-slate-800 font-headline text-xs">Prescription Medicines ({cart.length})</div>

        <div className="space-y-3 divide-y divide-slate-100">
          {cart.map((item) => (
            <div key={item.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0 mt-0.5">
                <img
                  src={item.image}
                  alt={item.medicineName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-900 text-xs truncate">{item.medicineName}</div>
                <div className="text-[10px] text-slate-500">
                  {item.dosage} • Generic for {item.brandName}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{item.packDescription}</div>

                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-bold text-slate-900 font-price-headline text-sm">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400 line-through">
                    ${(item.brandedPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-[10px] text-slate-400 hover:text-red-600"
                >
                  Remove
                </button>

                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebration Savings Callout */}
      <div className="bg-emerald-600 text-white rounded-2xl p-4 shadow-md space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
            Total Patient Benefit
          </span>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-full font-bold">
            {savingsPercent}% Lower
          </span>
        </div>
        <div className="text-xl font-bold font-headline">
          🎉 You are saving ${totalSavings.toFixed(2)}
        </div>
        <p className="text-[11px] text-emerald-100">
          Direct wholesale parity comparison vs standard retail branded markup.
        </p>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-2">
        <div className="font-bold text-slate-800 text-xs">Payment Summary</div>

        <div className="space-y-1 text-slate-600 text-[11px]">
          <div className="flex justify-between">
            <span>Branded Retail Reference</span>
            <span className="line-through text-slate-400">${brandedTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>Generic Savings Applied</span>
            <span>-${totalSavings.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Prescription Subtotal</span>
            <span className="font-semibold text-slate-800">${genericTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Express Cold-Chain Delivery</span>
            <span className="text-emerald-700 font-bold">FREE ($0.00)</span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Rx Sales Tax</span>
            <span className="text-slate-400">$0.00 (Exempt)</span>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
            <span>Total to Pay</span>
            <span className="font-price-headline text-base">${genericTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Selector */}
      <div className="space-y-1.5">
        <span className="font-semibold text-slate-700 text-xs">Select Payment</span>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setPaymentMethod('apple')}
            className={`py-2 px-3 rounded-xl border text-center font-bold flex items-center justify-center gap-1.5 transition-all ${
              paymentMethod === 'apple'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>Apple Pay</span>
          </button>

          <button
            onClick={() => setPaymentMethod('card')}
            className={`py-2 px-3 rounded-xl border text-center font-semibold flex items-center justify-center gap-1 transition-all ${
              paymentMethod === 'card'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>Visa •• 4291</span>
          </button>

          <button
            onClick={() => setPaymentMethod('hsa')}
            className={`py-2 px-3 rounded-xl border text-center font-semibold flex items-center justify-center gap-1 transition-all ${
              paymentMethod === 'hsa'
                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            <span>HSA / FSA</span>
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={isPlacing}
        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
      >
        {isPlacing ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Securing Lowest Parity & Dispatching...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-base">check_circle</span>
            <span>Place Order & Dispatch (${genericTotal.toFixed(2)})</span>
          </>
        )}
      </button>
    </div>
  );
};
