'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { cn } from '@/lib/utils';

interface RHFOTPProps {
  name: string;
  label: string;
  maxLength?: number;
  isRequired?: boolean;
}

const RHFOTP = ({ name, label, maxLength = 6, isRequired = true }: RHFOTPProps) => {
  const { control, setValue } = useFormContext();

  return (
    <div className='flex flex-col gap-2'>
      {label && <FormFieldLabel label={label} isRequired={isRequired} />}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div className='flex flex-col gap-1'>
            <InputOTP
              maxLength={maxLength}
              value={field.value || ''}
              onChange={(newOtp: string) => {
                field.onChange(newOtp);
                setValue(name, newOtp);
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              containerClassName='gap-2 sm:gap-3'
            >
              <InputOTPGroup
                className={cn(
                  'w-full justify-between gap-2',
                  error && '[&_[data-slot=input-otp-slot]]:border-destructive',
                )}
              >
                {Array.from({ length: maxLength }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className='size-11 text-base font-semibold sm:size-12 sm:text-lg'
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
          </div>
        )}
      />
    </div>
  );
};

export default RHFOTP;
