'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const rootVariants = cva('flex text-balance', {
  variants: {
    variant: {
      page: 'min-h-[200px] flex-col items-center justify-center gap-3 px-4 py-8 text-center',
      embedded: 'flex-col items-center justify-center gap-2 py-6 text-center',
      compact: 'flex-col items-center justify-center gap-2 px-3 py-4 text-center',
      banner:
        'min-h-0 flex-row items-start gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left',
    },
  },
  defaultVariants: {
    variant: 'page',
  },
});

const iconWrapVariants = cva('flex shrink-0 items-center justify-center rounded-full', {
  variants: {
    tone: {
      destructive: 'bg-destructive/10 [&_svg]:text-destructive',
      warning: 'bg-amber-500/10 [&_svg]:text-amber-700 dark:[&_svg]:text-amber-500',
      muted: 'bg-muted [&_svg]:text-muted-foreground',
    },
    iconSize: {
      default: 'p-2.5 [&_svg]:h-6 [&_svg]:w-6',
      sm: 'p-2 [&_svg]:h-5 [&_svg]:w-5',
    },
  },
  defaultVariants: {
    tone: 'destructive',
    iconSize: 'default',
  },
});

export interface AppErrorStateProps extends VariantProps<typeof rootVariants> {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionClassName?: string;
  tone?: VariantProps<typeof iconWrapVariants>['tone'];
  iconSize?: VariantProps<typeof iconWrapVariants>['iconSize'];
}

export function AppErrorState({
  title,
  description,
  icon: Icon = AlertTriangle,
  action,
  variant,
  className,
  iconClassName,
  titleClassName,
  descriptionClassName,
  actionClassName,
  tone = 'destructive',
  iconSize = 'default',
}: AppErrorStateProps) {
  const isBanner = variant === 'banner';

  const body = (
    <>
      <h2
        className={cn(
          'font-semibold text-foreground',
          isBanner ? 'text-sm' : 'text-base',
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description !== undefined && description !== null && description !== '' ? (
        <p
          className={cn(
            'max-w-sm text-xs text-muted-foreground',
            isBanner && 'max-w-none text-sm',
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
      {!isBanner && action ? <div className={cn('mt-1', actionClassName)}>{action}</div> : null}
    </>
  );

  return (
    <div
      className={cn(rootVariants({ variant }), className)}
      data-slot='app-error-state'
      role='alert'
    >
      <div
        className={cn(iconWrapVariants({ tone, iconSize }), isBanner && 'mt-0.5', iconClassName)}
        aria-hidden
      >
        <Icon className='shrink-0' strokeWidth={1.75} />
      </div>
      {isBanner ? (
        <>
          <div className='min-w-0 flex-1 space-y-1'>{body}</div>
          {action ? (
            <div className={cn('shrink-0 self-center', actionClassName)}>{action}</div>
          ) : null}
        </>
      ) : (
        body
      )}
    </div>
  );
}
