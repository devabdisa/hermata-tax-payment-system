import { AlertCircle } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  /**
   * Error title (required)
   */
  title: string;
  /**
   * Optional error description
   */
  description?: string;
  /**
   * Optional error object to display technical details
   */
  error?: Error;
  /**
   * Optional retry callback function
   */
  retry?: () => void;
  /**
   * Optional custom retry button label
   */
  retryLabel?: string;
  /**
   * Optional icon component (defaults to AlertCircle)
   */
  icon?: React.ElementType;
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ErrorState Component
 * 
 * Premium error feedback component with recovery actions.
 * Displays error icon, title, description, optional error details, and retry button.
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8
 * 
 * @example
 * ```tsx
 * <ErrorState
 *   title="Failed to load data"
 *   description="We couldn't load the requested data. Please try again."
 *   retry={() => refetch()}
 *   retryLabel="Try Again"
 * />
 * ```
 */
export function ErrorState({
  title,
  description,
  error,
  retry,
  retryLabel = 'Try Again',
  icon: Icon = AlertCircle,
  className,
}: ErrorStateProps) {
  return (
    <div
      data-slot="error-state"
      className={cn(
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center text-balance',
        className,
      )}
    >
      {/* Error Icon */}
      <div
        data-slot="error-icon"
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
      >
        <Icon className="size-6" aria-hidden="true" />
      </div>

      {/* Error Header */}
      <div
        data-slot="error-header"
        className="flex max-w-md flex-col items-center gap-2"
      >
        {/* Error Title */}
        <h3
          data-slot="error-title"
          className="text-lg font-semibold tracking-tight text-destructive"
        >
          {title}
        </h3>

        {/* Error Description */}
        {description && (
          <p
            data-slot="error-description"
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>

      {/* Error Details (Technical) */}
      {error && (
        <details
          data-slot="error-details"
          className="w-full max-w-md rounded-md border border-destructive/20 bg-destructive/5 p-3 text-left"
        >
          <summary className="cursor-pointer text-xs font-medium text-destructive hover:text-destructive/80">
            Technical Details
          </summary>
          <pre className="mt-2 overflow-auto text-xs text-muted-foreground">
            {error.message}
            {error.stack && (
              <>
                {'\n\n'}
                {error.stack}
              </>
            )}
          </pre>
        </details>
      )}

      {/* Retry Button */}
      {retry && (
        <div data-slot="error-action" className="mt-2">
          <Button
            onClick={retry}
            variant="outline"
            size="default"
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
