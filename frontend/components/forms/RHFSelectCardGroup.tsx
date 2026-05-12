'use client';

import { CheckCircle, Circle } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import {
  formCardClasses,
  FormFieldError,
  FormFieldLabel,
} from '@/components/forms/form-field-parts';
import { cn } from '@/lib/utils';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  name: string;
  label: string;
  isLoading?: boolean;
  options: Option[];
  isRequired?: boolean;
  className?: string;
}

const RHFSelectCardGroup = ({
  name,
  label,
  options,
  isLoading = false,
  isRequired = true,
  className = '',
}: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('w-full space-y-2', className)}>
          {label && <FormFieldLabel label={label} isRequired={isRequired} />}

          <div className='flex max-w-full flex-row gap-2 overflow-x-auto py-1 no-scrollbar'>
            {isLoading ? (
              <div className='flex flex-row gap-2'>
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className='h-16 w-24 shrink-0 animate-pulse rounded-md bg-muted sm:h-18 sm:w-28 md:h-20 md:w-32 lg:w-36'
                  />
                ))}
              </div>
            ) : (
              options.map((opt) => {
                const selected = field.value === opt.value;

                return (
                  <button
                    type='button'
                    key={opt.value}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'flex min-w-[90px] shrink-0 items-center gap-2 rounded-xl border px-3 py-2 xs:min-w-[100px] sm:min-w-[120px] sm:py-3 sm:px-4 md:min-w-[140px] lg:min-w-[160px]',
                      selected ? formCardClasses.selected : formCardClasses.unselected,
                    )}
                  >
                    {selected ? (
                      <CheckCircle className='size-5 shrink-0 text-primary' />
                    ) : (
                      <Circle className='size-5 shrink-0 text-muted-foreground' />
                    )}
                    <span className='truncate text-xs sm:text-sm md:text-base'>{opt.label}</span>
                  </button>
                );
              })
            )}
          </div>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFSelectCardGroup;
