'use client';

import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  rows?: number;
}

export default function RHFTextArea({
  name,
  isRequired = true,
  label,
  rows = 3,
  className,
  ...other
}: IProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { control, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='space-y-1.5'>
          <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />
          <Textarea
            id={name}
            {...field}
            rows={rows}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            onChange={(e) => {
              field.onChange(e.target.value);
              clearErrors(name);
            }}
            className={cn('min-h-18 resize-y text-base md:text-sm', className)}
            {...other}
          />
          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
}
