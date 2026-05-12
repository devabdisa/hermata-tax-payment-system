import { Loader } from 'lucide-react';
import React from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PrimaryButtonProps {
  title: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  isLoading?: boolean;
  isDisabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  icon,
  onClick,
  className,
  type = 'button',
  isLoading = false,
  isDisabled = false,
  variant = 'default',
  size = 'default',
  fullWidth = true,
}) => {
  const sizeClassesMap: Record<string, string> = {
    default: 'h-16 text-base rounded-[48px] px-6',
    sm: 'h-10 text-sm rounded-md px-3',
    lg: 'h-20 text-lg rounded-[56px] px-8',
    icon: 'h-10 w-10 p-2 rounded-full',
  };
  const sizeClasses = sizeClassesMap[size] ?? sizeClassesMap.default;

  const defaultVariantClasses = cn(
    'cursor-pointer bg-primary text-primary-foreground',
    'hover:bg-primary/90 active:bg-primary/95',
    'shadow-[0_14px_22px_-10px_rgba(249,31,104,0.45)]',
    'transition-all duration-200',
  );

  const outlineVariantClasses = cn(
    'cursor-pointer border border-border bg-background text-foreground',
    'hover:bg-accent/45 hover:text-foreground hover:border-primary/30',
    'transition-colors duration-200',
  );

  const baseVariantClass = buttonVariants({ variant, size });
  const widthClass = fullWidth ? 'w-full' : 'w-auto';

  const finalClassName = cn(
    baseVariantClass,
    widthClass,
    sizeClasses,
    variant === 'default' ? defaultVariantClasses : null,
    variant === 'outline' ? outlineVariantClasses : null,
    className,
  );

  const disabled = isLoading || isDisabled;

  return (
    <Button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={finalClassName}
      aria-busy={isLoading}
      aria-disabled={disabled}
    >
      <span className={cn('inline-flex items-center justify-center gap-3')}>
        {icon && icon}
        <span>{title}</span>
        {isLoading && <Loader className='ml-1 h-4 w-4 animate-spin' />}
      </span>
    </Button>
  );
};

export default PrimaryButton;
