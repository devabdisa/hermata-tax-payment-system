'use client';

import { Calendar } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface RHFYearPickerProps {
  name: string;
  label: string;
  placeholder?: string;
  isRequired?: boolean;
  startYear?: number;
  endYear?: number;
}

const RHFYearPicker = ({
  name,
  label,
  placeholder = 'Select Year',
  isRequired = true,
  startYear = 2000,
  endYear = new Date().getFullYear() + 1,
}: RHFYearPickerProps) => {
  const { control, clearErrors } = useFormContext();
  const [open, setOpen] = useState(false);

  const years = useMemo(() => {
    const y: number[] = [];
    for (let i = endYear; i >= startYear; i--) {
      y.push(i);
    }
    return y;
  }, [startYear, endYear]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className='space-y-2'>
          <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                id={name}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={cn(
                  'h-10 w-full justify-between border-input bg-background px-3 text-left font-normal shadow-xs',
                  'hover:bg-accent hover:text-accent-foreground',
                  !field.value && 'text-muted-foreground',
                  error && 'border-destructive',
                )}
              >
                {field.value || placeholder}
                <Calendar className='size-4 opacity-70' />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className='max-h-64 w-[var(--radix-popover-trigger-width)] overflow-y-auto border border-border bg-popover p-2 shadow-md'
              align='start'
              side='bottom'
              sideOffset={4}
            >
              <div className='grid grid-cols-3 gap-2 p-1'>
                {years.map((year) => (
                  <button
                    key={year}
                    type='button'
                    onClick={() => {
                      field.onChange(String(year));
                      clearErrors(name);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-md border px-2 py-2 text-center text-sm transition-colors',
                      field.value === String(year)
                        ? 'border-primary bg-primary/10 font-semibold text-primary'
                        : 'border-border bg-card text-foreground hover:bg-accent',
                    )}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFYearPicker;
