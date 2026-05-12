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
  subtitle?: string;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
  isRequired?: boolean;
}

const RHFSelectCardGroupVertical = ({ name, label, options, isRequired = true }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='w-full space-y-2'>
          {label && <FormFieldLabel label={label} isRequired={isRequired} />}

          <div className='grid max-h-80 grid-cols-1 gap-3 overflow-y-auto py-1 no-scrollbar lg:grid-cols-2'>
            {options.map((opt) => {
              const selected = field.value === opt.value;

              return (
                <button
                  type='button'
                  key={opt.value}
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'flex w-full flex-row items-start gap-3 rounded-2xl border p-4 text-left transition-all',
                    selected ? formCardClasses.selected : formCardClasses.unselected,
                  )}
                >
                  {selected ? (
                    <CheckCircle className='size-5 shrink-0 text-primary' />
                  ) : (
                    <Circle className='size-5 shrink-0 text-muted-foreground' />
                  )}

                  <div className='flex flex-col'>
                    <span className='text-base font-medium text-foreground'>{opt.label}</span>

                    {opt.subtitle && (
                      <span className='mt-1 text-xs leading-snug text-muted-foreground'>
                        {opt.subtitle}
                      </span>
                    )}
                  </div>
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

export default RHFSelectCardGroupVertical;
