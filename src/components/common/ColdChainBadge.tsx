import React from 'react';
import {
  isColdChainOptimal,
  isColdChainBreached,
  formatTemperature,
  getColdChainStatusLabel,
} from '../../utils/formatters';

interface ColdChainBadgeProps {
  temperatureCelsius: number;
  /** 'pill' = single-line compact indicator (default), 'panel' = expanded with label */
  variant?: 'pill' | 'panel';
  /** Show animated pulse ring when actively monitoring */
  live?: boolean;
  className?: string;
}

/**
 * Cold-chain temperature indicator badge.
 * Per ADR-008 & ADR-012: rose-red is reserved strictly for cold-chain breaches.
 * Optimal range: 2°C – 8°C (GDP compliant). Breach thresholds: < 1.8°C or > 8.2°C.
 */
export const ColdChainBadge: React.FC<ColdChainBadgeProps> = ({
  temperatureCelsius,
  variant = 'pill',
  live = false,
  className = '',
}) => {
  const optimal = isColdChainOptimal(temperatureCelsius);
  const breached = isColdChainBreached(temperatureCelsius);
  const label = getColdChainStatusLabel(temperatureCelsius);
  const tempStr = formatTemperature(temperatureCelsius);

  const colors = breached
    ? { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-300', dot: 'bg-rose-500', icon: 'thermostat' }
    : optimal
    ? { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-300', dot: 'bg-emerald-500', icon: 'ac_unit' }
    : { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500', icon: 'thermostat' };

  if (variant === 'panel') {
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-xl border ${colors.bg} ${colors.border} ${className}`}
        role="status"
        aria-label={`Cold-chain status: ${label} at ${tempStr}`}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <span className={`material-symbols-outlined text-xl ${colors.text} filled`}>
            {colors.icon}
          </span>
          {live && (
            <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${colors.dot} ring-2 ring-white animate-pulse`} />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${colors.text}`}>{tempStr}</span>
            {live && (
              <span className={`text-[10px] font-semibold uppercase tracking-wide ${colors.text} opacity-70`}>
                Live
              </span>
            )}
          </div>
          <p className={`text-xs font-medium ${colors.text} mt-0.5`}>{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">Optimal range: 2.0°C – 8.0°C (GDP)</p>
        </div>
      </div>
    );
  }

  // Default: compact pill
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
        border ${colors.bg} ${colors.text} ${colors.border} ${className}`}
      role="status"
      aria-label={`Cold-chain: ${label} at ${tempStr}`}
    >
      {live && (
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
      )}
      <span className="material-symbols-outlined text-[12px] filled">{colors.icon}</span>
      {tempStr}
      {breached && <span className="ml-0.5">⚠ Breach</span>}
    </span>
  );
};
