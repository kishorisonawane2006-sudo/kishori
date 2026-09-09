import React from 'react';

interface LoadingSpinnerProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Label shown below spinner for accessibility */
  label?: string;
  /** 'page' = full-height centered, 'inline' = inline element */
  variant?: 'page' | 'inline';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-10 h-10 border-[3px]',
};

/**
 * Accessible loading spinner for async operations.
 * Used during: Gemini OCR cold start (2.5–4s), API calls, checkout processing.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  variant = 'inline',
  className = '',
}) => {
  const spinner = (
    <div
      role="status"
      aria-label={label || 'Loading…'}
      className={`flex flex-col items-center gap-2 ${className}`}
    >
      <div
        className={`${SIZE_MAP[size]} rounded-full border-slate-200 border-t-blue-600 animate-spin`}
        aria-hidden="true"
      />
      {label && (
        <p className="text-xs text-slate-500 font-medium animate-pulse">{label}</p>
      )}
    </div>
  );

  if (variant === 'page') {
    return (
      <div className="flex flex-1 items-center justify-center py-16">
        {spinner}
      </div>
    );
  }

  return spinner;
};
