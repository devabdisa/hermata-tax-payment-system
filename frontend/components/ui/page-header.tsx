import * as React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional icon component */
  icon?: LucideIcon;
  /** Breadcrumbs for navigation context */
  breadcrumbs?: {
    label: string;
    href: string;
  }[];
  /** List of actions for the header */
  actions?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
    variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive';
    disabled?: boolean;
    loading?: boolean;
  }[];
  /** Additional CSS classes */
  className?: string;
}

/**
 * PageHeader Component
 * 
 * Shared component for consistent page titles, breadcrumbs, and actions.
 * Part of the Modern Civic SaaS UI redesign.
 */
export function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between mb-8 pb-6 border-b border-border/50',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={cn(
              'hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
              'bg-gradient-to-br from-primary/10 via-primary/5 to-transparent',
              'border border-primary/10 shadow-sm',
            )}
          >
            <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
        )}

        <div className="flex flex-col gap-1">
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1.5 mb-1" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <Link 
                    href={crumb.href}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          {description && (
            <p className="text-sm text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'default'}
              onClick={action.onClick}
              disabled={action.disabled || action.loading}
              className="h-10 rounded-xl px-4 gap-2 shadow-sm font-semibold"
            >
              {action.icon && (
                <action.icon
                  className={cn("h-4 w-4", action.loading && "animate-spin")}
                  aria-hidden="true"
                />
              )}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
