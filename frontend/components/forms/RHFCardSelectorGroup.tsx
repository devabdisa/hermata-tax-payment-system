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
  title: string;
  subtitle?: string;
  description?: string;
  value: string | number;
}

interface Props {
  name: string;
  options: Option[];
  label?: string;
  isRequired?: boolean;
  className?: string;
}

const RHFCardSelectorGroup = ({ name, label, options, isRequired = true, className }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('w-full space-y-2', className)}>
          {label && <FormFieldLabel label={label} isRequired={isRequired} />}

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            {options.map((opt) => {
              const selected = opt.value === field.value;

              return (
                <button
                  key={opt.value}
                  type='button'
                  onClick={() => field.onChange(opt.value)}
                  className={cn(
                    'flex cursor-pointer flex-col gap-4 rounded-[20px] border p-4 pt-3.5 pr-3.5 pb-4 pl-6 text-left transition-all duration-150',
                    selected ? formCardClasses.selected : formCardClasses.unselected,
                  )}
                >
                  <div className='flex justify-end'>
                    {selected ? (
                      <CheckCircle className='size-7 text-primary' />
                    ) : (
                      <Circle className='size-7 text-muted-foreground' />
                    )}
                  </div>

                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-xl font-black text-foreground'>{opt.title}</p>
                      {opt.subtitle && (
                        <p className='text-base font-bold text-muted-foreground'>{opt.subtitle}</p>
                      )}
                    </div>
                    {opt.description && (
                      <p className='text-xs font-normal text-muted-foreground'>{opt.description}</p>
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

export default RHFCardSelectorGroup;
