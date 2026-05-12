'use client';

import { ArrowRight, Rocket, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface AppComingSoonProps {
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function AppComingSoon({
  title = 'Coming Soon',
  description = "We're working on something powerful. This feature will be available shortly.",
  action,
  className,
}: AppComingSoonProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        'relative flex min-h-[50vh] w-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-card p-8 text-center backdrop-blur-sm',
        className,
      )}
    >
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl' />
        <div className='absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/5 blur-3xl' />
      </div>

      <div className='relative z-10 max-w-md space-y-6'>
        <div className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
          <Sparkles className='h-4 w-4' />
          <span>In Progress</span>
        </div>

        <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
          <Rocket className='h-8 w-8 text-primary' />
        </div>

        <h2 className='text-2xl font-bold text-foreground'>{title}</h2>

        <p className='text-sm leading-relaxed text-muted-foreground'>{description}</p>

        <div className='flex flex-col items-center gap-3 pt-2'>
          {action ?? (
            <button
              onClick={() => router.push('/dashboard')}
              className='group inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-secondary hover:underline'
            >
              Go to Dashboard
              <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
