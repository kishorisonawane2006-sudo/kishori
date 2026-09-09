import React, { useState } from 'react';
import {
  HubWarehouse, DemandForecast, DroneCorridor, CityExpansion, ReplenishmentOrder,
} from '../../types';
import {
  INITIAL_HUB_WAREHOUSES, INITIAL_DRONE_CORRIDORS, INITIAL_CITY_EXPANSIONS,
} from '../../data/initialData';
import { formatCurrency } from '../../utils/formatters';

type HubTab = 'map' | 'forecast' | 'replenishment' | 'drones' | 'cities';

const LAUNCH_CONFIG: Record<CityExpansion['launchStatus'], { bg: string; text: string; dot: string }> = {
  Live:         { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Soft_Launch:  { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  Planned:      { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  Announced:    { bg: 'bg-slate-100',  text: 'text-slate-600',   dot: 'bg-slate-400'   },
};

const SEASONAL_MOLECULES = ['Atorvastatin Calcium', 'Metformin HCl', 'Amoxicillin Trihydrate', 'Levothyroxine Sodium', 'Sertraline HCl'];

// Map US bounds to SVG canvas
const MAP = { latMin: 24.5, latMax: 49.5, lngMin: -125, lngMax: -66 };
function geoToSvg(lat: number, lng: number, w: number, h: number) {
  return {
    x: +((lng - MAP.lngMin) / (MAP.lngMax - MAP.lngMin) * w).toFixed(1),
    y: +((MAP.latMax - lat) / (MAP.latMax - MAP.latMin) * h).toFixed(1),
  };
}

export const HubLogisticsMeshScreen: React.FC = () => {
  const [tab, setTab] = useState<HubTab>('map');
  const [hubs] = useState<HubWarehouse[]>(INITIAL_HUB_WAREHOUSES);
  const [corridors] = useState<DroneCorridor[]>(INITIAL_DRONE_CORRIDORS);
  const [cities] = useState<CityExpansion[]>(INITIAL_CITY_EXPANSIONS);
  const [replenishments, setReplenishments] = useState<ReplenishmentOrder[]>([]);
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [selectedHub, setSelectedHub] = useState<HubWarehouse | null>(null);
  const [forecastSalt, setForecastSalt] = useState('Atorvastatin Calcium');
  const [forecastDays, setForecastDays] = useState(30);
  const [forecasting, setForecasting] = useState(false);

  const liveMetrics = {
    totalCities: cities.length,
    liveCities:  cities.filter(c => c.launchStatus === 'Live').length,
    pharmacies:  cities.filter(c => c.launchStatus === 'Live').reduce((s, c) => s + c.activePharmacies, 0),
    patients:    cities.filter(c => c.launchStatus === 'Live').reduce((s, c) => s + c.activePatients, 0),
    gmv:         cities.filter(c => c.launchStatus === 'Live').reduce((s, c) => s + c.monthlyGmv, 0),
  };

  const handleForecast = () => {
    if (!selectedHub) return;
    setForecasting(true);
    setTimeout(() => {
      const SEASONAL: Record<number, number> = { 0:1.15,1:1.10,2:1.05,3:0.95,4:0.90,5:0.90,6:0.85,7:0.88,8:0.92,9:1.00,10:1.10,11:1.20 };
      const m = new Date().getMonth();
      const seasonality = SEASONAL[m] ?? 1.0;
      const diseaseAdj = forecastSalt.includes('Metformin') ? 1.04 : forecastSalt.includes('Atorvastatin') ? 1.02 : 1.0;
      const baseVelocity = Math.round((selectedHub.activeSkus / 100) * (selectedHub.branchesServed / 10));
      const forecastedUnits = Math.round(baseVelocity * (forecastDays / 7) * seasonality * diseaseAdj);
      const currentStock = Math.round(forecastedUnits * (0.6 + Math.random() * 0.3));
      const f: DemandForecast = {
        hubId: selectedHub.id,
        genericSalt: forecastSalt,
        forecastPeriodDays: forecastDays,
        historicalWeeklyVelocity: baseVelocity,
        seasonalityMultiplier: seasonality,
        diseaseIncidenceAdjustment: diseaseAdj,
        forecastedUnits,
        currentStock,
        replenishmentQuantity: Math.max(0, forecastedUnits - currentStock + Math.round(forecastedUnits * 0.15)),
        confidenceScore: +(0.82 + Math.random() * 0.12).toFixed(3),
        forecastedAt: new Date().toISOString(),
        algorithm: 'holt_winters',
      };
      setForecasts(prev => [f, ...prev.filter(x => !(x.hubId === f.hubId && x.genericSalt === f.genericSalt))]);
      setForecasting(false);
    }, 700);
  };

  const handleReplenish = (f: DemandForecast) => {
    const hub = hubs.find(h => h.id === f.hubId);
    const r: ReplenishmentOrder = {
      id: `REP-${Date.now().toString().slice(-6)}`,
      hubId: f.hubId,
      hubName: hub?.name ?? f.hubId,
      destinationBranchId: `branch-${Math.floor(Math.random() * 200)}`,
      destinationBranchName: `Retail Branch #${Math.floor(100 + Math.random() * 900)}`,
      genericSalt: f.genericSalt,
      quantity: f.replenishmentQuantity,
      priorityLevel: f.replenishmentQuantity > 5000 ? 'High' : 'Standard',
      scheduledDispatchAt: new Date(Date.now() + 30 * 60000).toISOString(),
      estimatedArrivalAt: new Date(Date.now() + (hub?.avgReplenishmentCycleHours ?? 5) * 3600000 + 3600000).toISOString(),
      status: 'Scheduled',
      isColdChain: f.genericSalt.includes('Insulin'),
    };
    setReplenishments(prev => [r, ...prev]);
    setTab('replenishment');
  };

  const SVG_W = 700; const SVG_H = 380;
  const tabs: Array<{ id: HubTab; label: string; icon: string }> = [
    { id: 'map',          label: 'Hub Network',      icon: 'map'              },
    { id: 'forecast',     label: 'Demand Forecast',  icon: 'trending_up'      },
    { id: 'replenishment',label: `Replenishment (${replenishments.length})`, icon: 'local_shipping' },
    { id: 'drones',       label: 'Drone Corridors',  icon: 'airplanemode_active' },
    { id: 'cities',       label: `${liveMetrics.liveCities} Live Cities`, icon: 'location_city' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600 filled">hub</span>
            Pan-National Hub-and-Spoke Logistics Mesh
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {liveMetrics.liveCities} live cities · {liveMetrics.pharmacies} pharmacies · {liveMetrics.patients.toLocaleString()} patients — Phase 4 Workstream 5.2
          </p>
        </div>
        <div className="flex gap-2 text-xs flex-wrap">
          {[
            { label: 'Monthly GMV',  value: formatCurrency(liveMetrics.gmv),                 color: 'indigo' },
            { label: 'Active Hubs',  value: `${hubs.filter(h => h.isActive).length}`,         color: 'blue'   },
            { label: 'Drone Routes', value: `${corridors.filter(c => c.isActive).length}`,    color: 'sky'    },
          ].map(k => (
            <span key={k.label} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-${k.color}-50 border border-${k.color}-200 text-${k.color}-700 font-semibold`}>
              {k.value} {k.label}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto no-scrollbar w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all cursor-pointer
              ${tab === t.id ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}>
            <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Map */}
      {tab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-700">United States — Distribution Hub Network</p>
            </div>
            <div className="bg-slate-50 p-2">
              <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full" style={{ aspectRatio: `${SVG_W}/${SVG_H}` }}
                aria-label="Hub warehouse network map">
                {/* Grid */}
                {[...Array(6)].map((_, i) => <line key={`h${i}`} x1={0} y1={(SVG_H/5)*i} x2={SVG_W} y2={(SVG_H/5)*i} stroke="#e2e8f0" strokeWidth={0.5} />)}
                {[...Array(8)].map((_, i) => <line key={`v${i}`} x1={(SVG_W/7)*i} y1={0} x2={(SVG_W/7)*i} y2={SVG_H} stroke="#e2e8f0" strokeWidth={0.5} />)}
                {/* Hub markers */}
                {hubs.map(hub => {
                  const p = geoToSvg(hub.latitude, hub.longitude, SVG_W, SVG_H);
                  const isSelected = selectedHub?.id === hub.id;
                  const r = hub.tier === 'Tier1_Metro' ? 10 : 7;
                  return (
                    <g key={hub.id} onClick={() => setSelectedHub(hub)} style={{ cursor: 'pointer' }}>
                      <circle cx={p.x} cy={p.y} r={r + 4} fill="#3b82f620" />
                      <circle cx={p.x} cy={p.y} r={r} fill={isSelected ? '#1d4ed8' : '#3b82f6'} stroke="white" strokeWidth={2} />
                      <text x={p.x} y={p.y + r + 12} textAnchor="middle" fontSize={9} fill="#1e40af" fontWeight="600">{hub.city}</text>
                    </g>
                  );
                })}
                {/* City expansion dots */}
                {cities.filter(c => c.launchStatus !== 'Live').map(city => {
                  const latMap: Record<string, number> = { Houston: 29.76, Phoenix: 33.45, Philadelphia: 39.95, 'San Antonio': 29.42, 'San Diego': 32.72, Austin: 30.27, Jacksonville: 30.33 };
                  const lngMap: Record<string, number> = { Houston: -95.37, Phoenix: -112.07, Philadelphia: -75.17, 'San Antonio': -98.49, 'San Diego': -117.16, Austin: -97.74, Jacksonville: -81.65 };
                  const lat = latMap[city.cityName]; const lng = lngMap[city.cityName];
                  if (!lat || !lng) return null;
                  const p = geoToSvg(lat, lng, SVG_W, SVG_H);
                  const color = city.launchStatus === 'Soft_Launch' ? '#3b82f6' : city.launchStatus === 'Planned' ? '#f59e0b' : '#94a3b8';
                  return (
                    <g key={city.cityName}>
                      <circle cx={p.x} cy={p.y} r={4} fill={color} opacity={0.7} />
                      <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize={7} fill={color}>{city.cityName.split(' ')[0]}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Legend */}
            <div className="px-4 py-2 border-t border-slate-100 flex gap-4 flex-wrap text-xs">
              {[['#3b82f6', 'Active Hub'], ['#3b82f680', 'Soft Launch'], ['#f59e0b80', 'Planned'], ['#94a3b880', 'Announced']].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: c as string }} /><span className="text-slate-600">{l}</span></div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hubs.map(hub => (
              <div key={hub.id} onClick={() => setSelectedHub(hub)}
                className={`bg-white rounded-2xl border shadow-xs p-3 cursor-pointer transition-all hover:shadow-md
                  ${selectedHub?.id === hub.id ? 'border-blue-400 ring-2 ring-blue-200' : 'border-slate-200'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{hub.city}, {hub.state}</p>
                    <p className="text-xs text-slate-500">{hub.tier.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full mt-1 ${hub.utilisationPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <span className="material-symbols-outlined text-[12px]">store</span>
                  {hub.branchesServed} branches
                  <span className="ml-auto text-slate-400">{hub.utilisationPercent}% used</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${hub.utilisationPercent > 75 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${hub.utilisationPercent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demand Forecast */}
      {tab === 'forecast' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <p className="text-sm font-bold text-slate-900 mb-4">Run Demand Forecast</p>
            <div className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hub</label>
                <select value={selectedHub?.id ?? ''} onChange={e => setSelectedHub(hubs.find(h => h.id === e.target.value) ?? null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <option value="">Select hub…</option>
                  {hubs.map(h => <option key={h.id} value={h.id}>{h.city} Hub</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generic Salt</label>
                <select value={forecastSalt} onChange={e => setForecastSalt(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                  {SEASONAL_MOLECULES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Forecast Period (days)</label>
                <input type="number" min={7} max={90} value={forecastDays} onChange={e => setForecastDays(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <button onClick={handleForecast} disabled={!selectedHub || forecasting}
              className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 cursor-pointer transition-all flex items-center justify-center gap-2">
              {forecasting
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Forecasting…</>
                : <><span className="material-symbols-outlined text-[18px]">trending_up</span>Run Forecast</>}
            </button>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-3">
            {forecasts.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
                <span className="material-symbols-outlined text-4xl block mb-2">trending_up</span>
                Select a hub and molecule to run a demand forecast.
              </div>
            )}
            {forecasts.map((f, idx) => {
              const stockPct = Math.min(100, Math.round((f.currentStock / Math.max(1, f.forecastedUnits)) * 100));
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                  <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{f.genericSalt}</p>
                      <p className="text-xs text-slate-500">{hubs.find(h => h.id === f.hubId)?.city} Hub · {f.forecastPeriodDays}-day forecast · {f.algorithm.replace(/_/g, ' ')}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold border ${f.confidenceScore > 0.9 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                      {(f.confidenceScore * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Forecasted</p><p className="font-bold text-slate-800">{f.forecastedUnits.toLocaleString()}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Current Stock</p><p className={`font-bold ${stockPct < 70 ? 'text-amber-700' : 'text-emerald-700'}`}>{f.currentStock.toLocaleString()}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Replenish</p><p className="font-bold text-blue-700">{f.replenishmentQuantity.toLocaleString()}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Season ×</p><p className="font-bold text-slate-700">{f.seasonalityMultiplier.toFixed(2)}</p></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] text-slate-400 mb-1">Stock level vs forecast</p>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${stockPct < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${stockPct}%` }} />
                      </div>
                    </div>
                    {f.replenishmentQuantity > 0 && (
                      <button onClick={() => handleReplenish(f)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer flex-shrink-0">
                        Trigger Replenishment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Replenishment */}
      {tab === 'replenishment' && (
        <div className="flex flex-col gap-3">
          {replenishments.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">local_shipping</span>
              No replenishment orders yet. Run a demand forecast and trigger replenishment.
            </div>
          )}
          {replenishments.map(r => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{r.genericSalt}</p>
                <p className="text-xs text-slate-500">{r.hubName} → {r.destinationBranchName}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div><p className="text-slate-400">Quantity</p><p className="font-bold text-blue-700">{r.quantity.toLocaleString()} units</p></div>
                <div><p className="text-slate-400">Priority</p><p className={`font-bold ${r.priorityLevel === 'Critical' ? 'text-rose-700' : r.priorityLevel === 'High' ? 'text-amber-700' : 'text-slate-700'}`}>{r.priorityLevel}</p></div>
                <div><p className="text-slate-400">ETA</p><p className="font-bold text-slate-700">{new Date(r.estimatedArrivalAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">{r.status.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Drone Corridors */}
      {tab === 'drones' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {corridors.map(c => (
            <div key={c.id} className={`bg-white rounded-2xl border shadow-xs p-4 ${!c.isActive ? 'opacity-60' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.originCity} → {c.destinationZone}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${c.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Distance</p><p className="font-bold">{c.distanceMiles}mi</p></div>
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Flight Time</p><p className="font-bold">{c.avgFlightMins}min</p></div>
                <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Payload</p><p className="font-bold">{c.maxPayloadKg}kg</p></div>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                {c.supportsColdChain && <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold">❄ Cold-Chain</span>}
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">{c.regulatoryApproval}</span>
                <span className="ml-auto">{c.altitudeFeet}ft AGL</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* City Expansion */}
      {tab === 'cities' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cities.map(city => {
            const cfg = LAUNCH_CONFIG[city.launchStatus];
            return (
              <div key={city.cityName} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{city.cityName}</p>
                    <p className="text-xs text-slate-500">{city.state} · {city.tier.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.bg} ${cfg.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {city.launchStatus.replace(/_/g, ' ')}
                  </span>
                </div>
                {city.launchStatus === 'Live' || city.launchStatus === 'Soft_Launch' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Pharmacies</p><p className="font-bold text-slate-800">{city.activePharmacies}</p></div>
                    <div className="bg-slate-50 rounded-lg p-2"><p className="text-slate-400">Patients</p><p className="font-bold text-slate-800">{city.activePatients.toLocaleString()}</p></div>
                    {city.monthlyGmv > 0 && <div className="col-span-2 bg-indigo-50 rounded-lg p-2"><p className="text-indigo-500 text-[10px]">Monthly GMV</p><p className="font-bold text-indigo-700">{formatCurrency(city.monthlyGmv)}</p></div>}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Launch date: {new Date(city.launchDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
