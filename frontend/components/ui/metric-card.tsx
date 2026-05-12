import * as React from 'react';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * MetricCard Component
 * 
 * Dynamic KPI cards for dashboard with premium styling.
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9**
 * 
 * Features:
 * - Display title, value, optional change indicator with trend arrows
 * - Display optional icon with colored background
 * - Apply premium card styling with soft shadows
 * - Support up/down/neutral trends with appropriate colors
 */

export interface MetricCardProps {
  /** Metric title */
  title: string;
  /** Metric value (string or number) */
  value: string | number;
  /** Optional change indicator with trend */
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  /** Optional icon component */
  icon?: LucideIcon;
  /** Optional icon color class (e.g., "text-blue-600") */
  iconColor?: string;
  /** Optional description text */
  description?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * MetricCard displays KPI metrics with premium styling
 */
export const MetricCard = React.memo(({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  description,
  href,
  variant = 'default',
  className,
}: MetricCardProps & { unit?: string, trend?: { value: string, isPositive: boolean, label: string }, href?: string, variant?: 'default' | 'success' | 'info' | 'warning' }) => {
  return (
    <div
      className={cn(
        'premium-card p-6 transition-smooth hover-lift group cursor-pointer',
        className,
      )}
      onClick={() => href && (window.location.href = href)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          
          <div className="mt-2 flex items-baseline gap-1">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </h3>
            {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
          </div>
          
          {trend && (
            <div className="mt-2 flex items-center gap-1.5">
              <div
                className={cn(
                  'flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full',
                  trend.isPositive 
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
                )}
              >
                {trend.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {trend.value}
              </div>
              <span className="text-[10px] text-muted-foreground">{trend.label}</span>
            </div>
          )}
          
          {description && !trend && (
            <p className="mt-2 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        
        {Icon && (
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 shadow-sm ring-1 ring-foreground/5',
              variant === 'default' && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
              variant === 'success' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
              variant === 'info' && 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
              variant === 'warning' && 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
              'group-hover:scale-110 group-hover:rotate-3'
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </div>
  );
});

MetricCard.displayName = 'MetricCard';
