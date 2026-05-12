import * as React from 'react';
import {
  FileText,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Archive,
  Clock,
  ShieldCheck,
  Ban,
  FileCheck,
  CreditCard,
  AlertCircle,
  LucideIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * StatusBadge Component
 * 
 * Unified status badges for all entity states with localized labels and icons.
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11**
 * 
 * Features:
 * - Display localized status label
 * - Apply color-coded styling based on status type
 * - Support optional icon display
 * - Support different sizes (sm, md, lg)
 * - Map all status types to visual configurations
 * - Fallback to raw status value if translation missing
 */

export type StatusType =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'PENDING'
  | 'VERIFIED'
  | 'CANCELLED'
  | 'ISSUED'
  | 'PAID'
  | 'OVERDUE';

export interface StatusBadgeProps {
  /** Status type */
  status: StatusType;
  /** Current locale (e.g., 'en', 'am') */
  locale?: string;
  /** Dictionary object for localization */
  dict?: Record<string, any>;
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show icon */
  showIcon?: boolean;
  /** Additional CSS classes */
  className?: string;
}

interface StatusConfig {
  label: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
}

/**
 * Get status configuration including colors, icon, and localized label
 */
function getStatusConfig(
  status: StatusType,
  dict?: Record<string, any>,
): StatusConfig {
  // Get localized label with fallback
  const label = dict?.status?.[status] || status;

  // Map status to visual configuration
  const statusMap: Record<StatusType, Omit<StatusConfig, 'label'>> = {
    DRAFT: {
      textColor: 'text-slate-700 dark:text-slate-300',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
      borderColor: 'border-slate-200 dark:border-slate-700',
      icon: FileText,
    },
    SUBMITTED: {
      textColor: 'text-blue-700 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      borderColor: 'border-blue-200 dark:border-blue-800',
      icon: Send,
    },
    UNDER_REVIEW: {
      textColor: 'text-purple-700 dark:text-purple-300',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      borderColor: 'border-purple-200 dark:border-purple-800',
      icon: Eye,
    },
    APPROVED: {
      textColor: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      icon: CheckCircle,
    },
    REJECTED: {
      textColor: 'text-red-700 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: XCircle,
    },
    ARCHIVED: {
      textColor: 'text-gray-700 dark:text-gray-300',
      bgColor: 'bg-gray-50 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: Archive,
    },
    PENDING: {
      textColor: 'text-amber-700 dark:text-amber-300',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      borderColor: 'border-amber-200 dark:border-amber-800',
      icon: Clock,
    },
    VERIFIED: {
      textColor: 'text-teal-700 dark:text-teal-300',
      bgColor: 'bg-teal-50 dark:bg-teal-950',
      borderColor: 'border-teal-200 dark:border-teal-800',
      icon: ShieldCheck,
    },
    CANCELLED: {
      textColor: 'text-orange-700 dark:text-orange-300',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-200 dark:border-orange-800',
      icon: Ban,
    },
    ISSUED: {
      textColor: 'text-indigo-700 dark:text-indigo-300',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      icon: FileCheck,
    },
    PAID: {
      textColor: 'text-green-700 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: CreditCard,
    },
    OVERDUE: {
      textColor: 'text-rose-700 dark:text-rose-300',
      bgColor: 'bg-rose-50 dark:bg-rose-950',
      borderColor: 'border-rose-200 dark:border-rose-800',
      icon: AlertCircle,
    },
  };

  const config = statusMap[status];

  return {
    label,
    ...config,
  };
}

/**
 * StatusBadge displays entity status with color-coded styling and optional icon
 */
export const StatusBadge = React.memo(({
  status,
  locale,
  dict,
  size = 'md',
  showIcon = false,
  className,
}: StatusBadgeProps) => {
  const config = getStatusConfig(status, dict);
  const Icon = config.icon;

  // Size variants
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] uppercase tracking-wider gap-1',
    md: 'px-2.5 py-1 text-xs uppercase tracking-wider gap-1.5',
    lg: 'px-3 py-1.5 text-sm uppercase tracking-wider gap-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border font-bold transition-all duration-200 shadow-sm',
        config.textColor,
        config.bgColor,
        config.borderColor,
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && Icon && (
        <Icon className={cn(iconSizes[size], 'shrink-0')} aria-hidden="true" />
      )}
      <span>{config.label}</span>
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';
