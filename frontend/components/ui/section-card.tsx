'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './collapsible';

export interface SectionCardProps {
  /**
   * Section title displayed in the card header
   */
  title: string;
  /**
   * Optional description displayed below the title
   */
  description?: string;
  /**
   * Form fields or content to display within the section
   */
  children: React.ReactNode;
  /**
   * Whether the section can be collapsed/expanded
   * @default false
   */
  collapsible?: boolean;
  /**
   * Initial collapsed state when collapsible is true
   * @default true
   */
  defaultOpen?: boolean;
  /**
   * Additional CSS classes for the card container
   */
  className?: string;
}

/**
 * SectionCard Component
 * 
 * Premium form section component that groups related form fields in a visually
 * distinct card with soft shadows and consistent spacing. Supports collapsible
 * sections for better organization of complex forms.
 * 
 * **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7**
 * 
 * @example
 * ```tsx
 * <SectionCard title="Personal Information" description="Enter your basic details">
 *   <div className="space-y-4">
 *     <Input label="Full Name" />
 *     <Input label="Email" />
 *   </div>
 * </SectionCard>
 * ```
 * 
 * @example
 * ```tsx
 * <SectionCard 
 *   title="Advanced Settings" 
 *   collapsible 
 *   defaultOpen={false}
 * >
 *   <div className="space-y-4">
 *     <Switch label="Enable notifications" />
 *     <Switch label="Auto-save" />
 *   </div>
 * </SectionCard>
 * ```
 */
export function SectionCard({
  title,
  description,
  children,
  collapsible = false,
  defaultOpen = true,
  className,
}: SectionCardProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  // Non-collapsible section
  if (!collapsible) {
    return (
      <Card className={cn('shadow-soft', className)}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    );
  }

  // Collapsible section
  return (
    <Card className={cn('shadow-soft', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="cursor-pointer">
          <CollapsibleTrigger className="flex w-full items-start justify-between gap-4 text-left hover:opacity-80 transition-opacity">
            <div className="flex-1 space-y-1">
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </div>
            <ChevronDown
              className={cn(
                'h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-4">{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
