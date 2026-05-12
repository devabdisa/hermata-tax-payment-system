'use client';

import 'react-phone-input-2/lib/style.css';

import parsePhoneNumberFromString from 'libphonenumber-js';
import { Controller, useFormContext } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';



import { FormFieldError, FormFieldLabel } from './form-field-parts';

interface IProps {
  name: string;
  label: string;
  isRequired?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
}

const RHFPhoneTextField = ({
  name,
  isRequired = true,
  label,
  disabled,
  showLabel = true,
}: IProps) => {
  const m = { required: 'This field is required', phone: 'Invalid phone number' };
  const { control } = useFormContext();

  const validatePhoneNumber = (inputNumber: string) => {
    if (!inputNumber) {
      return false;
    }
    const phoneNumber = parsePhoneNumberFromString(`+${inputNumber}`);
    return phoneNumber ? phoneNumber.isValid() : false;
  };

  return (
    <Controller
      name={name}
      control={control}
      disabled={disabled}
      rules={{
        required: isRequired ? m.required : undefined,
        validate: (value) => !value || validatePhoneNumber(value) || m.phone,
      }}
      render={({ field, fieldState: { error } }) => (
        <div className='mb-0'>
          <div className='space-y-1.5 mb-1'>
            {showLabel && <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />}
          </div>

          <PhoneInput
            country='et'
            value={field.value || ''}
            disabled={disabled}
            onChange={(value: any) => field.onChange(value)}
            inputProps={{
              id: name,
              name,
              required: isRequired,
              'aria-invalid': !!error,
              'aria-describedby': error ? `${name}-error` : undefined,
            }}
            containerClass='w-full'
            inputStyle={{
              width: '100%',
              minHeight: '44px',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              borderColor: error ? 'var(--destructive)' : 'var(--border)',
              borderRadius: 'var(--radius)',
              marginTop: '8px',
              fontSize: '14px',
            }}
            buttonStyle={{
              backgroundColor: 'var(--background)',
              borderColor: error ? 'var(--destructive)' : 'var(--border)',
              borderTopLeftRadius: 'var(--radius)',
              borderBottomLeftRadius: 'var(--radius)',
            }}
            dropdownStyle={{
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              width: 'max-content',
              maxHeight: '200px',
            }}
            masks={{ et: '(...) ..-..-..' }}
          />

          {/* Fix hover and highlight states for dark mode */}
          <style>
            {`
              .react-tel-input .country-list .country:hover {
                background-color: var(--accent) !important;
              }
              .react-tel-input .country-list .country.highlight {
                background-color: var(--accent) !important;
              }
            `}
          </style>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFPhoneTextField;
