'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const rootVariants = cva(
  'flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/15 text-center text-balance',
  {
    variants: {
      variant: {
        default: 'gap-3 py-10 px-6',
        compact: 'gap-2 py-8 px-4',
        tight: 'gap-1.5 py-6 px-3',
      },
    },
    defaultVariants: {
      variant: 'compact',
    },
  },
);

const iconWrapVariants = cva(
  'flex shrink-0 items-center justify-center text-muted-foreground/50 [&_svg]:shrink-0',
  {
    variants: {
      iconSize: {
        default: '[&_svg]:h-7 [&_svg]:w-7',
        sm: '[&_svg]:h-6 [&_svg]:w-6',
        lg: '[&_svg]:h-9 [&_svg]:w-9',
      },
    },
    defaultVariants: {
      iconSize: 'default',
    },
  },
);

export interface AppEmptyStateProps extends VariantProps<typeof rootVariants> {
  /** Lucide icon component */
  icon: LucideIcon;
  title: string;
  description?: ReactNode;
  /** Primary CTA (e.g. button) */
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  iconSize?: VariantProps<typeof iconWrapVariants>['iconSize'];
}

export function AppEmptyState({
  icon: Icon,
  title,
  description,
  action,
  variant,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  actionClassName,
  iconSize,
}: AppEmptyStateProps) {
  return (
    <div className={cn(rootVariants({ variant }), className)} data-slot='app-empty-state'>
      <div className={cn(iconWrapVariants({ iconSize }), iconClassName)} aria-hidden>
        <Icon strokeWidth={1.5} />
      </div>
      <p className={cn('text-sm font-medium text-foreground', titleClassName)}>{title}</p>
      {description !== undefined && description !== null && description !== '' ? (
        <div
          className={cn(
            'max-w-sm text-xs leading-relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4',
            descriptionClassName,
          )}
        >
          {description}
        </div>
      ) : null}
      {action ? <div className={cn('mt-2', actionClassName)}>{action}</div> : null}
    </div>
  );
}
