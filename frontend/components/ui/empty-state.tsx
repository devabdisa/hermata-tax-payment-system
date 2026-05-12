import * as React from 'react';
import { type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/**
 * EmptyState Component
 * 
 * Premium feedback component for empty data states.
 * Displays icon, title, description, and optional CTA button with premium styling.
 * 
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6
 * 
 * @example
 * ```tsx
 * <EmptyState
 *   icon={Home}
 *   title="No properties found"
 *   description="Get started by adding your first property"
 *   action={{
 *     label: "Add Property",
 *     onClick: () => router.push('/properties/new')
 *   }}
 * />
 * ```
 */

interface EmptyStateProps {
  /**
   * Icon component to display (from lucide-react)
   * Requirement 13.2: WHERE an icon is provided, THE Empty_State SHALL display it
   */
  icon?: LucideIcon;
  
  /**
   * Title text to display
   * Requirement 13.1: THE Empty_State SHALL display a title
   */
  title: string;
  
  /**
   * Optional description text
   * Requirement 13.3: WHERE a description is provided, THE Empty_State SHALL display it below the title
   */
  description?: string;
  
  /**
   * Optional call-to-action button configuration
   * Requirement 13.4: WHERE an action is provided, THE Empty_State SHALL display a call-to-action button
   */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * EmptyState Component
 * 
 * Renders a premium empty state with icon, title, description, and optional action button.
 * Applies premium styling with proper spacing and supports localization.
 * 
 * Requirement 13.5: THE Empty_State SHALL apply premium styling with proper spacing
 * Requirement 13.6: THE Empty_State SHALL localize all labels based on the current locale
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        // Premium container with proper spacing
        'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg p-12 text-center',
        // Soft background with subtle border
        'bg-muted/30 border border-dashed border-border',
        className,
      )}
    >
      {/* Icon with premium styling */}
      {Icon && (
        <div
          className={cn(
            // Premium icon container with gradient background
            'flex size-16 shrink-0 items-center justify-center rounded-xl',
            // Soft gradient background
            'bg-gradient-to-br from-muted to-muted/50',
            // Subtle shadow for depth
            'shadow-sm ring-1 ring-foreground/5',
          )}
        >
          <Icon className="size-8 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}

      {/* Content container */}
      <div className="flex max-w-md flex-col items-center gap-2">
        {/* Title with proper typography hierarchy */}
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>

        {/* Description with muted color */}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed text-balance">
            {description}
          </p>
        )}
      </div>

      {/* Optional CTA button */}
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          size="default"
          className="mt-2"
        >
          {action.icon && <action.icon className="mr-2 size-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
