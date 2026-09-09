import React, { useState } from 'react';
import { RiderProfile, DeliveryStop, ShipmentEventStatus } from '../../types';
import { INITIAL_RIDERS, INITIAL_DISPATCHES } from '../../data/initialData';
import { ColdChainBadge } from '../common/ColdChainBadge';

interface RiderCompanionScreenProps {
  riderId?: string;
}

type RiderTab = 'route' | 'scanner' | 'otp' | 'pod';

const MOCK_STOPS: DeliveryStop[] = INITIAL_DISPATCHES.slice(0, 3).map((d, idx) => ({
  shipmentId: d.id,
  orderId: d.orderId,
  orderNumber: d.orderNumber,
  address: d.deliveryAddress,
  recipientName: ['Sarah Jenkins', 'Marcus Sterling', 'David K. Zhao'][idx] ?? 'Patient',
  recipientPhone: '+1 (•••) •••-' + (4821 + idx),
  distanceMiles: d.distanceMiles,
  estimatedMins: Math.round(d.distanceMiles * 6),
  requiresOtp: true,
  requiresPod: true,
  isColdChain: d.isColdChain,
  status: d.currentStatus,
}));

export const RiderCompanionScreen: React.FC<RiderCompanionScreenProps> = ({ riderId = 'rider-001' }) => {
  const rider: RiderProfile = INITIAL_RIDERS.find(r => r.id === riderId) ?? INITIAL_RIDERS[0];

  const [tab, setTab] = useState<RiderTab>('route');
  const [stops, setStops] = useState<DeliveryStop[]>(MOCK_STOPS);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpShipmentId, setOtpShipmentId] = useState(MOCK_STOPS[0]?.shipmentId ?? '');
  const [otpResult, setOtpResult] = useState<{ success: boolean; message: string } | null>(null);
  const [podSubmitted, setPodSubmitted] = useState<string[]>([]);
  const [tempReading, setTempReading] = useState(4.2);

  const completedCount = stops.filter(s => s.status === 'DELIVERED').length;

  const handleScan = () => {
    if (!scanInput.trim()) return;
    const matched = stops.find(s => {
      const dispatch = INITIAL_DISPATCHES.find(d => d.id === s.shipmentId);
      return dispatch?.barcodeData?.includes(scanInput.replace(/-/g, '')) ||
             dispatch?.waybillNumber === scanInput;
    });
    if (matched) {
      setScanResult({ success: true, message: `✓ Shipment verified: ${matched.orderNumber} — ${matched.address}` });
      setStops(prev => prev.map(s => s.shipmentId === matched.shipmentId ? { ...s, status: 'PICKED_UP' as ShipmentEventStatus } : s));
    } else {
      setScanResult({ success: false, message: '✗ Barcode not found. Please retry or contact dispatch.' });
    }
    setScanInput('');
  };

  const handleOtpVerify = () => {
    if (!otpInput.trim() || otpInput.length !== 4) {
      setOtpResult({ success: false, message: 'OTP must be exactly 4 digits.' });
      return;
    }
    // Simulate: any 4-digit code is valid for demo
    const isValid = /^\d{4}$/.test(otpInput);
    if (isValid) {
      setOtpResult({ success: true, message: `✓ OTP verified for shipment ${otpShipmentId}. Proceed to capture POD.` });
      setStops(prev => prev.map(s => s.shipmentId === otpShipmentId ? { ...s, status: 'OUT_FOR_DELIVERY' as ShipmentEventStatus } : s));
    } else {
      setOtpResult({ success: false, message: '✗ Invalid OTP. Ask the patient to resend.' });
    }
    setOtpInput('');
  };

  const handlePodCapture = (shipmentId: string) => {
    setPodSubmitted(prev => [...prev, shipmentId]);
    setStops(prev => prev.map(s => s.shipmentId === shipmentId ? { ...s, status: 'DELIVERED' as ShipmentEventStatus } : s));
  };

  const tabs: { id: RiderTab; label: string; icon: string }[] = [
    { id: 'route',   label: 'Route',   icon: 'route' },
    { id: 'scanner', label: 'Scanner', icon: 'qr_code_scanner' },
    { id: 'otp',     label: 'OTP',     icon: 'pin' },
    { id: 'pod',     label: 'POD',     icon: 'photo_camera' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-white">

      {/* Rider Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-white filled">person</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm">{rider.fullName}</p>
            <p className="text-xs text-slate-400">{rider.vehicleType} · {rider.vehicleNumber}</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="text-center">
              <p className="font-bold text-white">{completedCount}/{stops.length}</p>
              <p className="text-slate-400">Stops</p>
            </div>
            <div className="text-center">
              <p className={`font-bold ${rider.batteryPercent < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {rider.batteryPercent}%
              </p>
              <p className="text-slate-400">Battery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cold-Chain Live Sensor Strip */}
      <div className="bg-slate-800/60 border-b border-slate-700 px-4 py-2 flex items-center gap-3">
        <span className="text-xs text-slate-400 font-medium flex-shrink-0">Cool-Box Sensor:</span>
        <ColdChainBadge temperatureCelsius={tempReading} variant="pill" live className="flex-shrink-0" />
        <input
          type="range"
          min={0} max={12} step={0.1}
          value={tempReading}
          onChange={e => setTempReading(parseFloat(e.target.value))}
          className="flex-1 h-1.5 accent-blue-500 cursor-pointer"
          aria-label="Simulate temperature sensor reading"
        />
        <span className="text-xs text-slate-400 font-mono flex-shrink-0">{tempReading.toFixed(1)}°C</span>
      </div>

      {/* Tab Bar */}
      <div className="flex border-b border-slate-700">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-all cursor-pointer
              ${tab === t.id ? 'text-blue-400 border-b-2 border-blue-400 bg-slate-800/40' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">

        {/* Route */}
        {tab === 'route' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Delivery Queue ({stops.length} stops)</p>
            {stops.map((stop, idx) => (
              <div key={stop.shipmentId} className={`rounded-2xl border p-4 flex flex-col gap-3
                ${stop.status === 'DELIVERED' ? 'bg-slate-800/40 border-slate-700 opacity-60' : 'bg-slate-800 border-slate-700'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold
                      ${stop.status === 'DELIVERED' ? 'bg-emerald-800 text-emerald-200' : 'bg-blue-700 text-white'}`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{stop.recipientName}</p>
                      <p className="text-xs text-slate-400">{stop.recipientPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {stop.isColdChain && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700 font-semibold">
                        ❄ Cold
                      </span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border
                      ${stop.status === 'DELIVERED' ? 'bg-emerald-900/40 text-emerald-300 border-emerald-700'
                      : stop.status === 'OUT_FOR_DELIVERY' ? 'bg-amber-900/40 text-amber-300 border-amber-700'
                      : 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                      {stop.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-slate-400">location_on</span>
                  {stop.address}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">straighten</span>
                    {stop.distanceMiles} mi
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    ~{stop.estimatedMins} min
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">qr_code</span>
                    {stop.shipmentId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scanner */}
        {tab === 'scanner' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Barcode Scanner — Package Verification</p>
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex flex-col gap-3">
              <div className="aspect-square max-w-xs mx-auto w-full rounded-xl bg-slate-900 border-2 border-dashed border-slate-600 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-slate-500 block mb-2">qr_code_scanner</span>
                  <p className="text-xs text-slate-500">Camera viewfinder simulation</p>
                  <p className="text-xs text-slate-600 mt-1">Type waybill or barcode below</p>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={e => setScanInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleScan()}
                  placeholder="Waybill number or barcode…"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleScan}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Scan
                </button>
              </div>
              {scanResult && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium
                  ${scanResult.success ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-rose-900/40 text-rose-300 border border-rose-700'}`}>
                  <span className="material-symbols-outlined text-[16px] mt-0.5 filled">
                    {scanResult.success ? 'check_circle' : 'error'}
                  </span>
                  {scanResult.message}
                </div>
              )}
              <div className="mt-2">
                <p className="text-xs text-slate-500 mb-1">Available waybills for testing:</p>
                {INITIAL_DISPATCHES.slice(0, 3).map(d => (
                  <button
                    key={d.id}
                    onClick={() => { setScanInput(d.waybillNumber); setScanResult(null); }}
                    className="block text-xs text-blue-400 font-mono hover:text-blue-300 cursor-pointer"
                  >
                    {d.waybillNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* OTP */}
        {tab === 'otp' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">OTP Doorstep Verification</p>
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex flex-col gap-3">
              <p className="text-xs text-slate-400">
                Ask the patient for the 4-digit OTP sent to their registered mobile number.
                Required before handing over prescription medicines.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Shipment</label>
                <select
                  value={otpShipmentId}
                  onChange={e => { setOtpShipmentId(e.target.value); setOtpResult(null); }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-600 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stops.map(s => (
                    <option key={s.shipmentId} value={s.shipmentId}>
                      {s.orderNumber} — {s.recipientName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Patient OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={otpInput}
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="4-digit code"
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-600 text-2xl font-mono text-white tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleOtpVerify}
                disabled={otpInput.length !== 4}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                Verify OTP & Confirm Handover
              </button>
              {otpResult && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium
                  ${otpResult.success ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700' : 'bg-rose-900/40 text-rose-300 border border-rose-700'}`}>
                  <span className="material-symbols-outlined text-[16px] mt-0.5 filled">
                    {otpResult.success ? 'check_circle' : 'error'}
                  </span>
                  {otpResult.message}
                </div>
              )}
            </div>
          </div>
        )}

        {/* POD */}
        {tab === 'pod' && (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Proof of Delivery (POD)</p>
            {stops.map(stop => (
              <div key={stop.shipmentId} className={`bg-slate-800 rounded-2xl border p-4 flex flex-col gap-3
                ${podSubmitted.includes(stop.shipmentId) ? 'border-emerald-700 opacity-80' : 'border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{stop.recipientName}</p>
                    <p className="text-xs text-slate-400">{stop.orderNumber} · {stop.address}</p>
                  </div>
                  {podSubmitted.includes(stop.shipmentId) && (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <span className="material-symbols-outlined text-[16px] filled">check_circle</span>
                      POD Submitted
                    </span>
                  )}
                </div>

                {!podSubmitted.includes(stop.shipmentId) && (
                  <>
                    {/* Simulated camera viewfinder */}
                    <div className="w-full h-32 rounded-xl bg-slate-900 border border-dashed border-slate-600 flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-3xl text-slate-500 filled">photo_camera</span>
                        <p className="text-xs text-slate-500 mt-1">Tap to capture delivery photo</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePodCapture(stop.shipmentId)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                      Capture & Submit POD
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
