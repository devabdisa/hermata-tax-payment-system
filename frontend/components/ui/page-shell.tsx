import * as React from 'react';

import { cn } from '@/lib/utils';

interface PageShellProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  background?: 'default' | 'gradient' | 'glow';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * PageShell Component
 * 
 * Consistent content wrapper with max-width constraints and beautiful backgrounds.
 * Part of the Modern Civic SaaS UI redesign.
 * 
 * @param children - Content to render inside the page shell
 * @param maxWidth - Maximum width constraint (sm, md, lg, xl, 2xl, full). Default: 'full'
 * @param background - Background variation (default, gradient, glow). Default: 'default'
 * @param padding - Padding size (sm, md, lg). Default: 'md'
 * @param className - Additional CSS classes
 * 
 * @example
 * ```tsx
 * <PageShell maxWidth="2xl" background="gradient" padding="lg">
 *   <PageHeader title="Dashboard" />
 *   <div>Content here</div>
 * </PageShell>
 * ```
 */
export function PageShell({
  children,
  maxWidth = 'full',
  background = 'default',
  padding = 'md',
  className,
}: PageShellProps) {
  // Max-width classes mapping
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  // Background variation classes
  const backgroundClasses = {
    default: 'bg-background',
    gradient: 'bg-gradient-to-br from-background via-background-secondary to-background',
    glow: 'relative bg-background',
  };

  // Padding size classes
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={cn(
        'min-h-screen w-full',
        backgroundClasses[background],
        className,
      )}
    >
      {/* Radial glow effect for 'glow' background */}
      {background === 'glow' && (
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="absolute right-0 top-1/3 translate-x-1/3">
            <div className="h-[400px] w-[400px] rounded-full bg-success/5 blur-3xl" />
          </div>
        </div>
      )}

      {/* Content container with max-width and padding */}
      <div
        className={cn(
          'relative mx-auto w-full',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
        )}
      >
        {children}
      </div>
    </div>
  );
}
