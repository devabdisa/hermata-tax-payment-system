'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
}

export default function RHFPasswordField({
  name,
  label,
  isRequired = true,
  className = '',
  ...other
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const { control, clearErrors } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='space-y-1.5'>
          <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />

          <div className='relative'>
            <div className='pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground'>
              <Lock className='size-5' aria-hidden='true' />
            </div>

            <Input
              id={name}
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(e.target.value);
                clearErrors(name);
              }}
              type={showPassword ? 'text' : 'password'}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn('h-11 pl-10 pr-11 text-base md:text-sm', className)}
              {...other}
            />

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className='size-5' /> : <Eye className='size-5' />}
            </button>
          </div>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
}
