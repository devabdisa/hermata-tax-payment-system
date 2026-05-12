'use client';

import { CheckCircle, Circle } from 'lucide-react';
import Image from 'next/image';
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
  icon: string;
}

interface Props {
  name: string;
  label: string;
  options: Option[];
  isRequired?: boolean;
}

const RHFLargeSelectCardGroup = ({ name, label, options, isRequired = true }: Props) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='w-full space-y-2'>
          {label && <FormFieldLabel label={label} isRequired={isRequired} />}

          <div className='flex max-w-full flex-row gap-2 overflow-x-auto py-1 no-scrollbar'>
            {options.map((opt) => {
              const selected = field.value === opt.value;

              return (
                <button
                  type='button'
                  key={opt.value}
                  onClick={(e) => {
                    e.preventDefault();
                    field.onChange(opt.value);
                  }}
                  className={cn(
                    'flex h-[200px] min-w-[170px] max-w-44 flex-col justify-between gap-2 rounded-2xl border px-4 py-4 pl-4 pr-6 whitespace-nowrap',
                    selected ? formCardClasses.selected : formCardClasses.unselected,
                  )}
                >
                  <div className='flex w-full justify-end'>
                    {selected ? (
                      <CheckCircle className='size-6 shrink-0 text-primary' />
                    ) : (
                      <Circle className='size-6 shrink-0 text-muted-foreground' />
                    )}
                  </div>
                  <div className='flex flex-col gap-3.5 justify-start'>
                    <Image
                      width={45}
                      height={37}
                      src={opt.icon}
                      alt=''
                      className='object-contain'
                    />
                    <p
                      className={cn(
                        'text-[15px] font-bold',
                        selected ? 'text-primary' : 'text-muted-foreground',
                      )}
                    >
                      {opt.label}
                    </p>
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

export default RHFLargeSelectCardGroup;
