'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
}

const RHFStyledNumberSelector = ({
  name,
  label,
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='relative w-full space-y-2'>
          <FormFieldLabel label={label} isRequired={false} />

          <div className='flex max-w-full flex-row gap-2 overflow-x-auto no-scrollbar'>
            {[...Array(10)].map((_, index) => {
              const value = index;
              const isSelected = Number(field.value) === value;

              return (
                <button
                  key={index}
                  type='button'
                  onClick={() => field.onChange(value)}
                  className={cn(
                    'flex h-12 w-20 shrink-0 items-center justify-center rounded-[10px] border text-sm font-medium transition-all',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-accent',
                  )}
                >
                  {index === 0 ? 'None' : value}
                </button>
              );
            })}
          </div>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFStyledNumberSelector;
