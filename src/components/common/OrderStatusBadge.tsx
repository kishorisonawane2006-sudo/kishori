import React from 'react';
import { PlatformOrder } from '../../types';

interface OrderStatusBadgeProps {
  status: PlatformOrder['status'];
  className?: string;
}

type StatusConfig = {
  bg: string;
  text: string;
  border: string;
  icon: string;
  label: string;
};

const STATUS_CONFIG: Record<PlatformOrder['status'], StatusConfig> = {
  'Fulfilled': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    icon: 'check_circle',
    label: 'Fulfilled',
  },
  'Out for Delivery': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    icon: 'local_shipping',
    label: 'Out for Delivery',
  },
  'In-Transit': {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-300',
    icon: 'directions_car',
    label: 'In Transit',
  },
  'Dispensing': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    icon: 'medication',
    label: 'Dispensing',
  },
  'Cold-Chain Packaged': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    border: 'border-cyan-300',
    icon: 'ac_unit',
    label: 'Cold-Chain Packaged',
  },
  'Awaiting Pickup': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    icon: 'storefront',
    label: 'Awaiting Pickup',
  },
  'Validating Rx': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-300',
    icon: 'assignment',
    label: 'Validating Rx',
  },
  'Re-dispatching': {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-300',
    icon: 'refresh',
    label: 'Re-dispatching',
  },
};

/**
 * Displays an order lifecycle status with a consistent color-coded pill.
 * Per ADR-012: each status maps to a semantic design token (emerald/blue/amber/rose).
 */
export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] ?? {
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: 'info',
    label: status,
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
        border ${config.bg} ${config.text} ${config.border} ${className}`}
      aria-label={`Order status: ${config.label}`}
    >
      <span className="material-symbols-outlined text-[13px] filled">{config.icon}</span>
      {config.label}
    </span>
  );
};
