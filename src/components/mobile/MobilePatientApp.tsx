import React, { useState, useRef } from 'react';
import { MobileNotification, IoTSensorPacket } from '../../types';
import { ColdChainBadge } from '../common/ColdChainBadge';
import { OrderStatusBadge } from '../common/OrderStatusBadge';
import { formatTemperature } from '../../utils/formatters';
import { INITIAL_MOBILE_NOTIFICATIONS, INITIAL_IOT_PACKETS } from '../../data/initialData';

type MobileScreen = 'home' | 'biometric' | 'rx-camera' | 'notifications' | 'tracking';

const BIOMETRIC_STATES = ['idle', 'scanning', 'success', 'failed'] as const;
type BiometricState = typeof BIOMETRIC_STATES[number];

export const MobilePatientApp: React.FC = () => {
  const [screen, setScreen] = useState<MobileScreen>('home');
  const [biometricState, setBiometricState] = useState<BiometricState>('idle');
  const [notifications, setNotifications] = useState<MobileNotification[]>(INITIAL_MOBILE_NOTIFICATIONS);
  const [iotPackets] = useState<IoTSensorPacket[]>(INITIAL_IOT_PACKETS);
  const [rxCapturing, setRxCapturing] = useState(false);
  const [rxCaptured, setRxCaptured] = useState(false);
  const [offlineBanner, setOfflineBanner] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const latestPacket = iotPackets[iotPackets.length - 1];

  const handleBiometricAuth = () => {
    setScreen('biometric');
    setBiometricState('scanning');
    setTimeout(() => {
      setBiometricState('success');
      setTimeout(() => setScreen('home'), 900);
    }, 1800);
  };

  const handleRxCapture = () => {
    setRxCapturing(true);
    setTimeout(() => {
      setRxCapturing(false);
      setRxCaptured(true);
    }, 1500);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const notifColors: Record<MobileNotification['type'], { bg: string; icon: string; iconColor: string }> = {
    order_dispatched:   { bg: 'bg-blue-50 border-blue-200',    icon: 'local_shipping', iconColor: 'text-blue-600'   },
    temperature_stable: { bg: 'bg-emerald-50 border-emerald-200', icon: 'ac_unit',      iconColor: 'text-emerald-600'},
    temperature_breach: { bg: 'bg-rose-50 border-rose-200',    icon: 'thermostat',     iconColor: 'text-rose-600'   },
    out_for_delivery:   { bg: 'bg-amber-50 border-amber-200',  icon: 'directions_car', iconColor: 'text-amber-600'  },
    delivered:          { bg: 'bg-emerald-50 border-emerald-200', icon: 'check_circle', iconColor: 'text-emerald-600'},
    refill_reminder:    { bg: 'bg-indigo-50 border-indigo-200',icon: 'medication',     iconColor: 'text-indigo-600' },
    rx_approved:        { bg: 'bg-emerald-50 border-emerald-200', icon: 'verified',     iconColor: 'text-emerald-600'},
    rx_rejected:        { bg: 'bg-rose-50 border-rose-200',    icon: 'cancel',         iconColor: 'text-rose-600'   },
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">

      {/* Offline banner */}
      {offlineBanner && (
        <div className="bg-amber-500 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between" role="alert">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">wifi_off</span>
            Offline — Cart saved locally. Changes will sync when reconnected.
          </span>
          <button onClick={() => setOfflineBanner(false)} className="cursor-pointer" aria-label="Dismiss offline banner">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* ── Biometric Auth Screen ───────────────────────────────────────────── */}
      {screen === 'biometric' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 gap-6 px-8">
          <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500
            ${biometricState === 'scanning' ? 'border-blue-400 bg-blue-900/30 animate-pulse'
            : biometricState === 'success' ? 'border-emerald-400 bg-emerald-900/30'
            : biometricState === 'failed' ? 'border-rose-400 bg-rose-900/30'
            : 'border-slate-600 bg-slate-800'}`}>
            <span className={`material-symbols-outlined text-5xl filled
              ${biometricState === 'scanning' ? 'text-blue-300'
              : biometricState === 'success' ? 'text-emerald-300'
              : biometricState === 'failed' ? 'text-rose-300'
              : 'text-slate-400'}`}>
              {biometricState === 'success' ? 'check_circle' : 'fingerprint'}
            </span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              {biometricState === 'idle' && 'Touch to Authenticate'}
              {biometricState === 'scanning' && 'Scanning…'}
              {biometricState === 'success' && 'Identity Verified ✓'}
              {biometricState === 'failed' && 'Authentication Failed'}
            </p>
            <p className="text-slate-400 text-xs mt-1">Face ID / Touch ID — EPCS Authenticated</p>
          </div>
        </div>
      )}

      {/* ── Rx Camera Screen ────────────────────────────────────────────────── */}
      {screen === 'rx-camera' && (
        <div className="flex-1 flex flex-col bg-slate-900">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800">
            <button onClick={() => setScreen('home')} className="cursor-pointer" aria-label="Back">
              <span className="material-symbols-outlined text-white">arrow_back</span>
            </button>
            <p className="text-white font-bold text-sm">Upload Prescription</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
            {/* Camera viewfinder */}
            <div className={`w-full max-w-xs aspect-[3/4] rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden
              ${rxCaptured ? 'border-emerald-400 bg-emerald-900/20' : 'border-dashed border-slate-500 bg-slate-800'}`}>
              {!rxCaptured && (
                <>
                  {/* Corner brackets */}
                  {[['top-2 left-2','border-t-2 border-l-2'],['top-2 right-2','border-t-2 border-r-2'],
                    ['bottom-2 left-2','border-b-2 border-l-2'],['bottom-2 right-2','border-b-2 border-r-2']
                  ].map(([pos, border], i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 border-blue-400 ${border}`} />
                  ))}
                  {rxCapturing && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  )}
                  <span className="material-symbols-outlined text-4xl text-slate-500 filled">photo_camera</span>
                  <p className="text-xs text-slate-400 mt-2 text-center px-4">
                    Position prescription within frame. AI will auto-detect text.
                  </p>
                </>
              )}
              {rxCaptured && (
                <div className="text-center">
                  <span className="material-symbols-outlined text-5xl text-emerald-400 filled block">check_circle</span>
                  <p className="text-emerald-300 font-semibold text-sm mt-2">Prescription Captured</p>
                  <p className="text-emerald-400/70 text-xs mt-1">Gemini OCR processing…</p>
                </div>
              )}
            </div>

            {/* Extracted fields preview */}
            {rxCaptured && (
              <div className="w-full max-w-xs bg-slate-800 rounded-xl border border-slate-700 p-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-slate-300 mb-1">AI-Extracted Fields</p>
                {[
                  { label: 'Doctor', value: 'Dr. Harrison Wright, MD' },
                  { label: 'Reg. No.', value: 'MCR-NY-89421' },
                  { label: 'Salts', value: 'Atorvastatin 20mg, Metformin 500mg' },
                  { label: 'Date', value: new Date().toLocaleDateString() },
                ].map(f => (
                  <div key={f.label} className="flex items-start gap-2">
                    <span className="text-[10px] text-slate-500 font-medium w-14 flex-shrink-0 pt-0.5">{f.label}</span>
                    <span className="text-xs text-slate-200 font-semibold">{f.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 w-full max-w-xs">
              {!rxCaptured ? (
                <>
                  <button
                    onClick={handleRxCapture}
                    disabled={rxCapturing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-all"
                  >
                    {rxCapturing
                      ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Capturing…</>
                      : <><span className="material-symbols-outlined text-[18px]">photo_camera</span>Capture</>
                    }
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-3 rounded-xl border border-slate-600 text-slate-300 text-sm font-semibold hover:bg-slate-700 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload_file</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" aria-label="Upload prescription file" />
                </>
              ) : (
                <button
                  onClick={() => setScreen('home')}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 cursor-pointer transition-all"
                >
                  Submit for Pharmacist Review
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Notifications Screen ─────────────────────────────────────────────── */}
      {screen === 'notifications' && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <button onClick={() => setScreen('home')} aria-label="Back" className="cursor-pointer">
                <span className="material-symbols-outlined text-slate-600">arrow_back</span>
              </button>
              <p className="font-bold text-slate-900 text-sm">Notifications</p>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">{unreadCount}</span>
              )}
            </div>
            <button onClick={markAllRead} className="text-xs text-blue-600 font-semibold cursor-pointer">Mark all read</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {notifications.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <span className="material-symbols-outlined text-4xl block mb-2">notifications_none</span>
                No notifications yet.
              </div>
            )}
            {notifications.map(notif => {
              const cfg = notifColors[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl border ${cfg.bg} ${notif.isRead ? 'opacity-70' : ''}`}
                  onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n))}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/70`}>
                    <span className={`material-symbols-outlined text-[18px] filled ${cfg.iconColor}`}>{cfg.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.body}</p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Tracking Screen ──────────────────────────────────────────────────── */}
      {screen === 'tracking' && (
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-slate-200">
            <button onClick={() => setScreen('home')} aria-label="Back" className="cursor-pointer">
              <span className="material-symbols-outlined text-slate-600">arrow_back</span>
            </button>
            <p className="font-bold text-slate-900 text-sm">Live Order Tracking</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-3 font-medium">ORDER #ORD-2026-8941</p>
              <OrderStatusBadge status="Out for Delivery" className="mb-3" />

              {latestPacket && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Cold-Chain Telemetry</p>
                  <ColdChainBadge temperatureCelsius={latestPacket.temperatureCelsius} variant="panel" live />
                  <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Humidity', value: `${latestPacket.humidityPercent ?? 45}%` },
                      { label: 'Battery', value: `${latestPacket.batteryPercent}%` },
                      { label: 'Excursion', value: `${latestPacket.cumulativeExcursionMins}min` },
                    ].map(s => (
                      <div key={s.label} className="bg-slate-50 rounded-xl p-2">
                        <p className="text-xs font-bold text-slate-800">{s.value}</p>
                        <p className="text-[10px] text-slate-400">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Temperature sparkline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-700 mb-3">Temperature History</p>
              <div className="flex items-end gap-1 h-16">
                {iotPackets.slice(-12).map((p, i) => {
                  const heightPct = Math.min(100, Math.max(10, ((p.temperatureCelsius - 1) / 9) * 100));
                  const isBreached = p.isBreached;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div
                        className={`w-full rounded-sm ${isBreached ? 'bg-rose-400' : 'bg-emerald-400'}`}
                        style={{ height: `${heightPct}%` }}
                        title={`${formatTemperature(p.temperatureCelsius)} @ ${new Date(p.timestamp).toLocaleTimeString()}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>1°C</span>
                <span className="text-emerald-600 font-medium">Safe: 2–8°C</span>
                <span>10°C</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Home Screen ──────────────────────────────────────────────────────── */}
      {screen === 'home' && (
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Status bar simulation */}
          <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-[10px]">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
              <span className="material-symbols-outlined text-[12px]">wifi</span>
              <span className="material-symbols-outlined text-[12px]">battery_full</span>
            </span>
          </div>

          {/* App header */}
          <div className="bg-slate-900 text-white px-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-slate-400">Welcome back,</p>
                <p className="font-bold text-white">Sarah Jenkins</p>
              </div>
              <button
                onClick={() => setScreen('notifications')}
                className="relative p-2 cursor-pointer"
                aria-label={`Notifications — ${unreadCount} unread`}
              >
                <span className="material-symbols-outlined text-white">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Offline cart banner toggle for demo */}
            <button
              onClick={() => setOfflineBanner(v => !v)}
              className="w-full text-left text-[10px] text-slate-500 mb-2 cursor-pointer underline"
            >
              {offlineBanner ? 'Hide' : 'Simulate'} offline cart banner
            </button>
          </div>

          <div className="p-4 flex flex-col gap-4 bg-slate-50 flex-1">

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Biometric Login', icon: 'fingerprint', color: 'bg-blue-600', onClick: handleBiometricAuth },
                { label: 'Upload Rx', icon: 'qr_code_2', color: 'bg-indigo-600', onClick: () => { setRxCaptured(false); setRxCapturing(false); setScreen('rx-camera'); } },
                { label: 'Track Order', icon: 'local_shipping', color: 'bg-amber-600', onClick: () => setScreen('tracking') },
                { label: 'Notifications', icon: 'notifications', color: 'bg-rose-600', onClick: () => setScreen('notifications') },
              ].map(action => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl ${action.color} text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all cursor-pointer`}
                >
                  <span className="material-symbols-outlined text-3xl filled">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>

            {/* Live cold-chain widget */}
            {latestPacket && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-cyan-600 filled">ac_unit</span>
                  Live Cold-Chain Status
                </p>
                <ColdChainBadge temperatureCelsius={latestPacket.temperatureCelsius} variant="panel" live />
              </div>
            )}

            {/* Recent notifications preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-slate-700">Recent Activity</p>
                <button onClick={() => setScreen('notifications')} className="text-xs text-blue-600 font-semibold cursor-pointer">
                  View all
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {notifications.slice(0, 3).map(notif => {
                  const cfg = notifColors[notif.type];
                  return (
                    <div key={notif.id} className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-[16px] filled ${cfg.iconColor}`}>{cfg.icon}</span>
                      <p className="text-xs text-slate-600 flex-1 truncate">{notif.title}</p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Native app features callout */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 text-white">
              <p className="text-xs font-bold mb-2">React Native / Expo Features</p>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {[
                  ['fingerprint', 'Face ID / Touch ID biometric authentication'],
                  ['photo_camera', 'Native camera with perspective correction & OCR'],
                  ['notifications', 'Push notifications for dispatch & temperature alerts'],
                  ['offline_bolt', 'Offline-first cart with encrypted local SQLite cache'],
                  ['bluetooth', 'BLE temperature logger sync on delivery'],
                ].map(([icon, text]) => (
                  <li key={icon} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-blue-400">{icon}</span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
