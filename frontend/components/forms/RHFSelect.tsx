'use client';

import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface RHFSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { value: string; label: string }[];
  className?: string;
  isLoading?: boolean;
  isRequired?: boolean;
  defaultValue?: string;
  isDisabled?: boolean;
}

export default function RHFSelect({
  name,
  label,
  placeholder = 'Select...',
  options,
  className = '',
  isLoading,
  isRequired = true,
  isDisabled = false,
  defaultValue,
}: RHFSelectProps) {
  const { control, clearErrors, getValues, setValue } = useFormContext();

  useEffect(() => {
    if (options.length === 0) {
      return;
    }

    const currentValue = getValues(name);
    const hasValidCurrentValue =
      typeof currentValue === 'string' && options.some((opt) => opt.value === currentValue);

    if (hasValidCurrentValue) {
      return;
    }

    if (defaultValue && options.some((opt) => opt.value === defaultValue)) {
      setValue(name, defaultValue, { shouldValidate: true, shouldDirty: false });
      return;
    }

    if (isRequired) {
      setValue(name, options[0].value, { shouldValidate: true, shouldDirty: false });
    }
  }, [defaultValue, getValues, isRequired, name, options, setValue]);

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue || ''}
      render={({ field, fieldState: { error } }) => (
        <div className='space-y-2'>
          {label && <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />}

          <Select
            disabled={isDisabled}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value);
              clearErrors(name);
            }}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                'h-10 w-full rounded-md border border-input bg-transparent font-normal text-foreground shadow-xs',
                'focus:outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                'disabled:cursor-not-allowed disabled:opacity-50',
                error && 'border-destructive focus-visible:ring-destructive/20',
                className,
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent className='max-h-[300px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md'>
              {isLoading ? (
                <div className='flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground'>
                  <div className='size-3 animate-spin rounded-full border-2 border-primary border-t-transparent' />
                  Loading...
                </div>
              ) : (
                options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className='cursor-pointer rounded-sm focus:bg-accent focus:text-accent-foreground'
                  >
                    {opt.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
}
