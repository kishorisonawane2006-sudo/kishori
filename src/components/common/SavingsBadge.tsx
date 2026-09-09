import React from 'react';
import { calculateSavingsAmount, calculateSavingsPercent, formatCurrency, isHighSavings } from '../../utils/formatters';

interface SavingsBadgeProps {
  brandReferenceMrp: number;
  genericUnitPrice: number;
  /** 'pill' = compact green pill (default), 'card' = larger stacked display */
  variant?: 'pill' | 'card';
  className?: string;
}

/**
 * Displays patient savings as a green pill or card block.
 * Per ADR-012: emerald-600 is exclusively reserved for savings callouts.
 * Per rules.md §4.2: every generic card MUST show brand MRP, generic price, and percentage saved.
 */
export const SavingsBadge: React.FC<SavingsBadgeProps> = ({
  brandReferenceMrp,
  genericUnitPrice,
  variant = 'pill',
  className = '',
}) => {
  const savingsAmount = calculateSavingsAmount(brandReferenceMrp, genericUnitPrice);
  const savingsPercent = calculateSavingsPercent(brandReferenceMrp, genericUnitPrice);

  if (savingsPercent <= 0) return null;

  const highSavings = isHighSavings(savingsPercent);

  if (variant === 'card') {
    return (
      <div
        className={`flex flex-col gap-0.5 bg-emerald-50 border border-emerald-200 rounded-xl p-3 ${className}`}
        aria-label={`Save ${savingsPercent}% — ${formatCurrency(savingsAmount)} off brand price`}
      >
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
          Patient Savings
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-emerald-700">{savingsPercent}%</span>
          <span className="text-sm text-emerald-600 font-medium">
            ({formatCurrency(savingsAmount)} off)
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-xs text-slate-500 line-through">
            Brand: {formatCurrency(brandReferenceMrp)}
          </span>
          <span className="text-xs text-slate-400">→</span>
          <span className="text-sm font-bold text-emerald-700">
            {formatCurrency(genericUnitPrice)}
          </span>
        </div>
      </div>
    );
  }

  // Default: compact pill
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold
        ${highSavings
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
          : 'bg-slate-100 text-slate-600 border border-slate-200'
        } ${className}`}
      aria-label={`Save ${savingsPercent}% — ${formatCurrency(savingsAmount)} off brand price`}
    >
      <span className="material-symbols-outlined text-[12px] filled">
        {highSavings ? 'savings' : 'arrow_downward'}
      </span>
      Save {savingsPercent}% ({formatCurrency(savingsAmount)})
    </span>
  );
};
