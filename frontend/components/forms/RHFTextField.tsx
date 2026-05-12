'use client';

import { BriefcaseBusiness, Building2, Globe, Hash, Mail, MapPin, Phone, User } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  leftIcon?:
    | 'mail'
    | 'user'
    | 'phone'
    | 'globe'
    | 'hash'
    | 'building'
    | 'briefcaseBusiness'
    | 'mapPin';
  type?: React.HTMLInputTypeAttribute;
}

type CombinedProps = IProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

const iconMap = {
  mail: Mail,
  user: User,
  phone: Phone,
  globe: Globe,
  hash: Hash,
  building: Building2,
  briefcaseBusiness: BriefcaseBusiness,
  mapPin: MapPin,
};

export default function RHFTextField({
  name,
  label,
  isRequired = true,
  leftIcon,
  type = 'text',
  className = '',
  ...other
}: CombinedProps) {
  const { control, clearErrors } = useFormContext();
  const Icon = leftIcon ? iconMap[leftIcon] : null;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value: string | number = e.target.value;

          if (type === 'number') {
            value = e.target.value ? parseFloat(e.target.value) : '';
          }

          field.onChange(value);
          clearErrors(name);
        };

        return (
          <div className='space-y-1.5'>
            <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />

            <div className='relative'>
              {Icon && (
                <div className='pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground'>
                  <Icon className='size-5' aria-hidden='true' />
                </div>
              )}

              <Input
                id={name}
                type={type}
                {...field}
                value={field.value ?? ''}
                onChange={handleChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={cn(
                  'h-11 text-base md:text-sm',
                  Icon ? 'pl-10' : 'pl-3',
                  'pr-3',
                  className,
                )}
                {...other}
              />
            </div>

            {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
          </div>
        );
      }}
    />
  );
}
