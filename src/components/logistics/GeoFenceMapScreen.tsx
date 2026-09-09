import React, { useState } from 'react';
import { GeoFencePolygon, ProximityScore, GeoCoordinate } from '../../types';
import { INITIAL_GEO_FENCES, INITIAL_PROXIMITY_SCORES } from '../../data/initialData';

interface GeoFenceMapScreenProps {
  onZoneSelect?: (zone: GeoFencePolygon) => void;
}

const CARRIER_ICONS: Record<string, string> = {
  'Dunzo': 'bolt',
  'Shadowfax': 'local_shipping',
  'FedEx Healthcare Express': 'flight',
};

const CARRIER_COLORS: Record<string, string> = {
  'Dunzo': 'text-blue-600',
  'Shadowfax': 'text-indigo-600',
  'FedEx Healthcare Express': 'text-slate-600',
};

// Map NYC bounding box to SVG canvas coordinates
const MAP_BOUNDS = {
  latMin: 40.6, latMax: 40.95,
  lngMin: -74.05, lngMax: -73.75,
};

function geoToSvg(coord: GeoCoordinate, width: number, height: number): { x: number; y: number } {
  const x = ((coord.longitude - MAP_BOUNDS.lngMin) / (MAP_BOUNDS.lngMax - MAP_BOUNDS.lngMin)) * width;
  const y = ((MAP_BOUNDS.latMax - coord.latitude) / (MAP_BOUNDS.latMax - MAP_BOUNDS.latMin)) * height;
  return { x: +x.toFixed(1), y: +y.toFixed(1) };
}

function polygonSvgPoints(vertices: GeoCoordinate[], width: number, height: number): string {
  return vertices.map(v => {
    const { x, y } = geoToSvg(v, width, height);
    return `${x},${y}`;
  }).join(' ');
}

const ZONE_COLORS = ['#3B82F6', '#6366F1', '#06B6D4', '#8B5CF6'];

export const GeoFenceMapScreen: React.FC<GeoFenceMapScreenProps> = ({ onZoneSelect }) => {
  const [zones, setZones] = useState<GeoFencePolygon[]>(INITIAL_GEO_FENCES);
  const [proximityScores] = useState<ProximityScore[]>(INITIAL_PROXIMITY_SCORES);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [patientCoord] = useState<GeoCoordinate>({ latitude: 40.6763, longitude: -73.9588 }); // Brooklyn
  const [editingZoneId, setEditingZoneId] = useState<string | null>(null);
  const [editRadius, setEditRadius] = useState('');

  const SVG_W = 600;
  const SVG_H = 400;

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  const handleToggleZone = (zoneId: string) => {
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, isActive: !z.isActive } : z));
  };

  const handleSaveRadius = (zoneId: string) => {
    const radius = parseFloat(editRadius);
    if (!isNaN(radius) && radius > 0) {
      setZones(prev => prev.map(z => z.id === zoneId ? { ...z, radiusMiles: radius } : z));
    }
    setEditingZoneId(null);
    setEditRadius('');
  };

  const patientSvg = geoToSvg(patientCoord, SVG_W, SVG_H);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-7xl mx-auto w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 font-headline flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 filled">map</span>
            Geo-Fence Delivery Zone Editor
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pharmacy service radii · Proximity Buy-Box weighting · Workstream 2.4
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            Patient: Brooklyn, NY
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* SVG Map */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">New York City — Pharmacy Delivery Zones</p>
            <span className="text-xs text-slate-400">Click a zone to inspect</span>
          </div>
          <div className="relative bg-slate-50">
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full"
              style={{ aspectRatio: `${SVG_W}/${SVG_H}` }}
              aria-label="Geo-fence delivery zone map of New York City"
            >
              {/* Grid lines */}
              {[...Array(6)].map((_, i) => (
                <line key={`h${i}`} x1={0} y1={(SVG_H / 5) * i} x2={SVG_W} y2={(SVG_H / 5) * i}
                  stroke="#e2e8f0" strokeWidth={0.5} />
              ))}
              {[...Array(7)].map((_, i) => (
                <line key={`v${i}`} x1={(SVG_W / 6) * i} y1={0} x2={(SVG_W / 6) * i} y2={SVG_H}
                  stroke="#e2e8f0" strokeWidth={0.5} />
              ))}

              {/* Zone polygons */}
              {zones.map((zone, idx) => {
                const pts = polygonSvgPoints(zone.vertices, SVG_W, SVG_H);
                const color = ZONE_COLORS[idx % ZONE_COLORS.length];
                const isSelected = selectedZoneId === zone.id;
                const centroid = geoToSvg(
                  {
                    latitude: zone.vertices.reduce((s, v) => s + v.latitude, 0) / zone.vertices.length,
                    longitude: zone.vertices.reduce((s, v) => s + v.longitude, 0) / zone.vertices.length,
                  },
                  SVG_W,
                  SVG_H
                );
                return (
                  <g key={zone.id} onClick={() => { setSelectedZoneId(zone.id); onZoneSelect?.(zone); }}
                    style={{ cursor: 'pointer' }}>
                    <polygon
                      points={pts}
                      fill={zone.isActive ? `${color}20` : '#94a3b820'}
                      stroke={zone.isActive ? color : '#94a3b8'}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      strokeDasharray={zone.isActive ? '' : '4,3'}
                    />
                    {zone.isActive && (
                      <text x={centroid.x} y={centroid.y} textAnchor="middle" dominantBaseline="middle"
                        fontSize={10} fill={color} fontWeight="600">
                        {zone.pharmacyName.split('—')[0].trim()}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Patient location pin */}
              <circle cx={patientSvg.x} cy={patientSvg.y} r={8} fill="#ef4444" opacity={0.9} />
              <circle cx={patientSvg.x} cy={patientSvg.y} r={14} fill="#ef444430" />
              <text x={patientSvg.x + 16} y={patientSvg.y + 4} fontSize={10} fill="#ef4444" fontWeight="700">
                You
              </text>
            </svg>
          </div>
          {/* Legend */}
          <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-4 flex-wrap">
            {zones.map((zone, idx) => (
              <div key={zone.id} className="flex items-center gap-1.5 text-xs">
                <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: ZONE_COLORS[idx % ZONE_COLORS.length] + '40', border: `1.5px solid ${ZONE_COLORS[idx % ZONE_COLORS.length]}` }} />
                <span className="text-slate-600">{zone.pharmacyName.split('—')[1]?.trim() ?? zone.pharmacyName}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
              <span className="text-slate-600">Patient</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Zone Editor */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-indigo-600">edit_location</span>
              Delivery Zones
            </p>
            <div className="flex flex-col gap-2">
              {zones.map((zone, idx) => (
                <div key={zone.id} className={`p-3 rounded-xl border transition-all ${
                  selectedZoneId === zone.id ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: ZONE_COLORS[idx % ZONE_COLORS.length] }} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{zone.pharmacyName}</p>
                        <p className="text-xs text-slate-400">{zone.radiusMiles}mi · {zone.maxDeliveryMins}min max</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => { setEditingZoneId(zone.id); setEditRadius(zone.radiusMiles.toString()); }}
                        className="p-1 rounded-lg hover:bg-slate-200 cursor-pointer transition-all"
                        aria-label="Edit zone radius"
                      >
                        <span className="material-symbols-outlined text-[14px] text-slate-500">edit</span>
                      </button>
                      <button
                        onClick={() => handleToggleZone(zone.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                          zone.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {zone.isActive ? 'Active' : 'Off'}
                      </button>
                    </div>
                  </div>
                  {editingZoneId === zone.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        min="0.5" max="50" step="0.5"
                        value={editRadius}
                        onChange={e => setEditRadius(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Radius (miles)"
                      />
                      <button
                        onClick={() => handleSaveRadius(zone.id)}
                        className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Proximity Scores (Buy-Box weighting) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <p className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600">speed</span>
              Proximity Buy-Box Scores
            </p>
            <p className="text-xs text-slate-400 mb-3">
              ADR-004: score = max(0, 100 − distanceMi × 5)
            </p>
            <div className="flex flex-col gap-2">
              {proximityScores.map((score, idx) => (
                <div key={score.pharmacyId} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${idx === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-slate-700 truncate">{score.pharmacyName.split('—')[0].trim()}</p>
                      <p className="text-xs font-bold text-slate-800 flex-shrink-0 ml-2">{score.proximityScore}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${idx === 0 ? 'bg-emerald-500' : 'bg-blue-400'}`}
                          style={{ width: `${score.proximityScore}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{score.distanceMiles}mi</span>
                      <span className={`text-[10px] flex items-center gap-0.5 flex-shrink-0 ${CARRIER_COLORS[score.carrier]}`}>
                        <span className="material-symbols-outlined text-[11px]">{CARRIER_ICONS[score.carrier]}</span>
                        {score.carrier.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                  {score.withinServiceZone && (
                    <span className="text-[10px] text-emerald-600 font-semibold flex-shrink-0">In Zone</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
