'use client';

import { RefreshCw } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface RefreshButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isLoading?: boolean;
  size?: 'sm' | 'lg';
  tooltip?: string;
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  isLoading = false,
  size = 'sm',
  tooltip = 'Refresh',
  className,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
  };

  return (
    <Button
      variant='outline'
      size={size}
      className={cn(
        sizeClasses[size],
        'p-0 transition-all roun duration-300 ease-in-out hover:scale-105 hover:border-primary hover:bg-primary/5',
        isLoading && 'cursor-wait opacity-70',
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        if (!isLoading && onClick) {
          onClick(e);
        }
      }}
      disabled={isLoading}
      title={tooltip}
    >
      <div className='relative flex items-center justify-center'>
        <RefreshCw
          className={cn(
            'transition-transform duration-300 h-4 w-4',
            isLoading ? 'animate-spin text-primary' : 'text-muted-foreground',
          )}
        />
        {!isLoading && (
          <span className='absolute -top-2 -right-2 h-1.5 w-1.5 rounded-full bg-primary animate-pulse'></span>
        )}
      </div>
    </Button>
  );
};
