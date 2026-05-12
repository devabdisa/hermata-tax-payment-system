'use client';

import { Controller, useFormContext } from 'react-hook-form';

import {
  formCardClasses,
  FormFieldError,
  FormFieldLabel,
} from '@/components/forms/form-field-parts';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
  options: {
    label: string;
    value: string | number;
  }[];
  isRequired?: boolean;
}

const RHFStyledRadioGroup = ({ name, label, options, isRequired = true }: IProps) => {
  const { control, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='relative space-y-2'>
          <FormFieldLabel label={label} isRequired={isRequired} />

          <RadioGroup
            value={
              field.value !== undefined && field.value !== null ? String(field.value) : undefined
            }
            onValueChange={(value) => {
              const raw = options.find((o) => String(o.value) === value)?.value;
              field.onChange(raw);
              clearErrors(name);
            }}
            className={cn(
              'flex flex-row gap-2 overflow-x-auto py-2 no-scrollbar',
              error && 'rounded-md border border-destructive/50 p-2',
            )}
          >
            {options.map((option) => {
              const isSelected = String(field.value) === String(option.value);

              return (
                <div
                  key={String(option.value)}
                  className={cn(
                    'flex min-w-[163px] items-center rounded-2xl border px-4 py-4',
                    isSelected ? formCardClasses.selected : formCardClasses.unselected,
                  )}
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem id={`${name}-${option.value}`} value={String(option.value)} />
                    <Label
                      htmlFor={`${name}-${option.value}`}
                      className='cursor-pointer font-normal text-foreground'
                    >
                      {option.label}
                    </Label>
                  </div>
                </div>
              );
            })}
          </RadioGroup>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFStyledRadioGroup;
