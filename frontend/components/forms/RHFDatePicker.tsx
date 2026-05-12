'use client';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerDisabledProps {
  before?: Date;
  after?: Date;
  dates?: Date[];
}

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  disabled?: DatePickerDisabledProps;
}

const RHFDatePicker = ({
  name,
  label,
  isRequired = true,
  placeholder = 'YYYY-MM-DD',
  disabled,
}: IProps) => {
  const { control, clearErrors } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedDate = field.value ? new Date(field.value) : undefined;
        const isValidDate = selectedDate && !isNaN(selectedDate.getTime());

        return (
          <div className='space-y-2'>
            <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type='button'
                  variant='outline'
                  id={name}
                  aria-invalid={!!error}
                  aria-describedby={error ? `${name}-error` : undefined}
                  className={cn(
                    'h-10 w-full justify-between border-input bg-background px-3 text-left font-normal text-foreground shadow-xs',
                    'hover:bg-accent hover:text-accent-foreground',
                    !field.value && 'text-muted-foreground',
                    error && 'border-destructive',
                  )}
                >
                  {isValidDate ? format(selectedDate, 'MM/dd/yyyy') : placeholder}
                  <CalendarIcon className='size-5 opacity-60' />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className='w-auto border border-border bg-popover p-0 shadow-md'
                align='start'
                side='bottom'
                sideOffset={4}
              >
                <Calendar
                  mode='single'
                  captionLayout='dropdown'
                  // @ts-ignore
                  fromYear={disabled?.before ? disabled.before.getFullYear() : 1900}
                  // @ts-ignore
                  toYear={disabled?.after ? disabled.after.getFullYear() : 2100}
                  selected={isValidDate ? selectedDate : undefined}
                  defaultMonth={isValidDate ? selectedDate : new Date()}
                  disabled={(date) => {
                    if (disabled?.before && date < disabled.before) {
                      return true;
                    }
                    if (disabled?.after && date > disabled.after) {
                      return true;
                    }
                    if (
                      disabled?.dates?.some(
                        (d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
                      )
                    ) {
                      return true;
                    }
                    return false;
                  }}
                  onMonthChange={() => {}}
                  onSelect={(date) => {
                    if (date) {
                      const isoDate = date.toISOString().split('T')[0];
                      field.onChange(isoDate);
                      clearErrors(name);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>

            {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
          </div>
        );
      }}
    />
  );
};

export default RHFDatePicker;
