import React from 'react';

interface RxRequiredBadgeProps {
  isRx: boolean;
  /** 'pill' = small badge (default), 'banner' = wider alert strip */
  variant?: 'pill' | 'banner';
  className?: string;
}

/**
 * Prescription requirement indicator badge.
 * Per ADR-005 & ADR-012: amber is reserved for Rx verification alerts and pending actions.
 * All Schedule H / prescription-only medicines must display this badge clearly.
 */
export const RxRequiredBadge: React.FC<RxRequiredBadgeProps> = ({
  isRx,
  variant = 'pill',
  className = '',
}) => {
  if (!isRx) {
    if (variant === 'banner') {
      return (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 ${className}`}
          role="note"
          aria-label="No prescription required — available over the counter"
        >
          <span className="material-symbols-outlined text-sm text-emerald-600 filled">
            check_circle
          </span>
          <span className="text-xs font-semibold text-emerald-700">
            No Prescription Required (OTC)
          </span>
        </div>
      );
    }
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
          bg-emerald-50 text-emerald-700 border border-emerald-200 ${className}`}
        aria-label="Over-the-counter — no prescription required"
      >
        <span className="material-symbols-outlined text-[12px] filled">check_circle</span>
        OTC
      </span>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 ${className}`}
        role="alert"
        aria-label="Prescription required — valid Rx must be uploaded before dispensing"
      >
        <span className="material-symbols-outlined text-sm text-amber-600 filled">
          assignment
        </span>
        <span className="text-xs font-semibold text-amber-700">
          Prescription Required (Schedule H)
        </span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
        bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
      aria-label="Prescription required — valid Rx must be uploaded"
    >
      <span className="material-symbols-outlined text-[12px] filled">assignment</span>
      Rx Required
    </span>
  );
};
