'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
}

const RHFNumberPasswordField = ({
  name,
  label,
  isRequired = true,
  placeholder,
  className,
  ...other
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { control, clearErrors } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleInput = (value: string) => value.replace(/\D/g, '');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='relative space-y-1.5'>
          {label && <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />}

          <div className='relative'>
            <Input
              id={name}
              {...field}
              type={showPassword ? 'text' : 'password'}
              inputMode='numeric'
              placeholder={placeholder}
              value={field.value ?? ''}
              onChange={(e) => {
                field.onChange(handleInput(e.target.value));
                clearErrors(name);
              }}
              aria-invalid={!!error}
              aria-describedby={error ? `${name}-error` : undefined}
              className={cn('h-10 pr-11', className)}
              {...other}
            />
            <button
              type='button'
              onClick={() => setShowPassword((p) => !p)}
              className='absolute right-3 top-1/2 -translate-y-1/2 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
              tabIndex={-1}
              aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
            >
              {showPassword ? <Eye className='size-5' /> : <EyeOff className='size-5' />}
            </button>
          </div>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFNumberPasswordField;
