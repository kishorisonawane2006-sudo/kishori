import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** 'page' = full-height centered (default), 'inline' = compact inline block */
  variant?: 'page' | 'inline';
  className?: string;
}

/**
 * Accessible empty state component per rules.md §1.3:
 * "Always provide accessible empty states rather than rendering blank screens."
 *
 * Used across: search results, order history, cart, vendor listings.
 * Uses Material Symbols outlined icons for consistency.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
  secondaryAction,
  variant = 'page',
  className = '',
}) => {
  const isPage = variant === 'page';

  return (
    <div
      className={`flex flex-col items-center justify-center text-center
        ${isPage ? 'py-16 px-6' : 'py-8 px-4'}
        ${className}`}
      role="status"
      aria-live="polite"
    >
      {/* Icon container */}
      <div
        className={`flex items-center justify-center rounded-2xl mb-4
          ${isPage ? 'w-16 h-16 bg-slate-100' : 'w-12 h-12 bg-slate-100/80'}`}
        aria-hidden="true"
      >
        <span
          className={`material-symbols-outlined text-slate-400
            ${isPage ? 'text-3xl' : 'text-2xl'}`}
        >
          {icon}
        </span>
      </div>

      {/* Title */}
      <h3
        className={`font-semibold text-slate-700
          ${isPage ? 'text-base' : 'text-sm'}`}
      >
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p
          className={`text-slate-500 mt-1.5 max-w-xs leading-relaxed
            ${isPage ? 'text-sm' : 'text-xs'}`}
        >
          {description}
        </p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold
                hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="px-4 py-2 rounded-xl bg-white text-slate-600 text-sm font-semibold
                border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
