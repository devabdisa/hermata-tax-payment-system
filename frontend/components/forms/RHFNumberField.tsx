'use client';

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

const RHFNumberField = ({
  name,
  label,
  isRequired = true,
  placeholder,
  className,
  ...other
}: IProps & React.InputHTMLAttributes<HTMLInputElement>) => {
  const { control, clearErrors } = useFormContext();

  const handleInput = (value: string) => {
    // Allow + only at the beginning, then digits
    if (value.startsWith('+')) {
      return '+' + value.slice(1).replace(/\D/g, '');
    }
    return value.replace(/\D/g, '');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='relative space-y-1.5'>
          {label && <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />}

          <Input
            id={name}
            type='text'
            inputMode='numeric'
            autoComplete='off'
            {...field}
            placeholder={placeholder}
            value={field.value ?? ''}
            onChange={(e) => {
              field.onChange(handleInput(e.target.value));
              clearErrors(name);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className={cn('h-10', className)}
            {...other}
          />

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFNumberField;
