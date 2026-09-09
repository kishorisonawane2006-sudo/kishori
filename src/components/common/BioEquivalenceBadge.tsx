import React from 'react';

interface BioEquivalenceBadgeProps {
  rating: string;
  /** 'compact' = small pill (default), 'full' = pill with label prefix */
  variant?: 'compact' | 'full';
  className?: string;
}

type RatingTier = 'ab' | 'approved' | 'equivalent' | 'pending' | 'unknown';

function classifyRating(rating: string): RatingTier {
  const r = rating.toLowerCase();
  if (r.includes('ab')) return 'ab';
  if (r.includes('approved')) return 'approved';
  if (r.includes('equivalent')) return 'equivalent';
  if (r.includes('pending') || r.includes('bx') || r.includes('insufficient')) return 'pending';
  return 'unknown';
}

const TIER_STYLES: Record<RatingTier, { bg: string; text: string; border: string; icon: string }> = {
  ab: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    icon: 'verified',
  },
  approved: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    icon: 'check_circle',
  },
  equivalent: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-300',
    icon: 'science',
  },
  pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    icon: 'pending',
  },
  unknown: {
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    icon: 'help_outline',
  },
};

/**
 * Renders a bio-equivalence / regulatory rating badge.
 * Per rules.md §4.2: therapeutic equivalence rating must be prominently displayed
 * so users feel 100% confident in clinical safety.
 *
 * Supports FDA Orange Book AB ratings, CDSCO Approved, and FDA Equivalent labels.
 */
export const BioEquivalenceBadge: React.FC<BioEquivalenceBadgeProps> = ({
  rating,
  variant = 'compact',
  className = '',
}) => {
  const tier = classifyRating(rating);
  const styles = TIER_STYLES[tier];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
        border ${styles.bg} ${styles.text} ${styles.border} ${className}`}
      title={`Therapeutic Equivalence: ${rating}`}
      aria-label={`Regulatory rating: ${rating}`}
    >
      <span className="material-symbols-outlined text-[12px] filled">{styles.icon}</span>
      {variant === 'full' && (
        <span className="font-normal opacity-70 mr-0.5">Equiv:</span>
      )}
      {rating}
    </span>
  );
};
