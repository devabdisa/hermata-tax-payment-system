'use client';

import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

type FormFieldLabelProps = {
  htmlFor?: string;
  label: string;
  isRequired?: boolean;
  className?: string;
};

const OPTIONAL_FALLBACK = '(optional)';

/** Labels and required/optional markers aligned with `globals.css` theme tokens. */
export function FormFieldLabel({
  htmlFor,
  label,
  isRequired = true,
  className,
}: FormFieldLabelProps) {
  const optionalText = OPTIONAL_FALLBACK;

  return (
    <Label
      htmlFor={htmlFor}
      className={cn('text-sm font-normal leading-none text-foreground', className)}
    >
      {label}
      {isRequired ? (
        <span className='text-primary ml-0.5' aria-hidden='true'>
          *
        </span>
      ) : (
        <span className='ml-1 text-xs font-normal text-muted-foreground'>{optionalText}</span>
      )}
    </Label>
  );
}

type FormFieldErrorProps = {
  id: string;
  message: string;
};

export function FormFieldError({ id, message }: FormFieldErrorProps) {
  return (
    <p id={id} className='text-destructive text-xs mt-1.5 flex items-center gap-1.5' role='alert'>
      <span className='size-1 shrink-0 rounded-full bg-destructive' aria-hidden='true' />
      {message}
    </p>
  );
}

/** Shared classes for selectable cards / toggles (unselected vs selected). */
export const formCardClasses = {
  unselected: 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50',
  selected: 'border-primary bg-primary/5 text-foreground shadow-sm',
} as const;
