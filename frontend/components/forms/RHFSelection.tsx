'use client';

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

interface Options {
  value: string;
  label: string;
}

interface RHFSelectionProps {
  name: string;
  label: string;
  options: Options[];
  isRequired?: boolean;
  className?: string;
  showLabel?: boolean;
  disabled?: boolean;
  defaultValue?: string;
}

const RHFSelection = ({
  name,
  label,
  options,
  isRequired = true,
  className,
  showLabel = true,
  disabled = false,
  defaultValue,
}: RHFSelectionProps) => {
  const { control, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('w-full space-y-2', className)}>
          {showLabel && <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />}

          <Select
            onValueChange={(v) => {
              field.onChange(v);
              clearErrors(name);
            }}
            value={field.value || undefined}
            disabled={disabled}
          >
            <SelectTrigger
              id={name}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn(
                'h-11 w-full rounded-md border border-input bg-transparent font-normal text-foreground shadow-xs',
                error && 'border-destructive',
              )}
            >
              {!defaultValue && <SelectValue placeholder={`Select ${label}`} />}
            </SelectTrigger>
            <SelectContent className='rounded-md border border-border bg-popover'>
              {options.map((option) => (
                <SelectItem
                  defaultValue={defaultValue}
                  key={option.value}
                  value={option.value}
                  className='cursor-pointer'
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFSelection;
