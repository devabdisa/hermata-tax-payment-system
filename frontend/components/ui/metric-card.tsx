"use client";

import * as React from 'react';
import { ArrowDown, ArrowUp, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';

/**
 * MetricCard Component
 * 
 * Dynamic KPI cards for dashboard with premium styling.
 * 
 * **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9**
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
  /** Optional unit (e.g. "ETB", "sqm") */
  unit?: string;
  /** Optional href for linking */
  href?: string;
  /** Visual variant for the icon container */
  variant?: 'default' | 'success' | 'info' | 'warning';
}

/**
 * MetricCard displays KPI metrics with premium styling
 */
export const MetricCard = React.memo(({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  description,
  className,
  unit,
  href,
  variant = 'default',
}: MetricCardProps) => {
  const router = useRouter();
  
  // Format number values with thousands separator
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-US').format(value);
    }
    return value;
  }, [value]);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        'premium-card p-6 transition-colors duration-300 group cursor-pointer relative overflow-hidden',
        className,
      )}
      onClick={() => href && router.push(href)}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </p>
          
          <div className="mt-2 flex items-baseline gap-1">
            <h3 className="text-3xl font-bold tracking-tight text-foreground">
              {formattedValue}
            </h3>
            {unit && <span className="text-sm font-medium text-muted-foreground ml-1">{unit}</span>}
          </div>
          
          {change && change.trend !== 'neutral' && (
            <div
              className={cn(
                'mt-2 flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full w-fit',
                change.trend === 'up' 
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-success' 
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-destructive',
              )}
            >
              {change.trend === 'up' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              <span>{Math.abs(change.value)}%</span>
            </div>
          )}
          
          {description && (
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
              iconColor,
              'group-hover:scale-110 group-hover:rotate-3'
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={1.5} />
          </div>
        )}
      </div>
    </motion.div>
  );
});

MetricCard.displayName = 'MetricCard';
