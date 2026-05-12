import { Controller, useController, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from './form-field-parts';

type RHFSwitchProps = {
  name: string;
  label?: string;
  isDisabled?: boolean;
  onChange?: (value: boolean) => void;
};

const RHFSwitch = ({ name, label, isDisabled, onChange: HandleOnChange }: RHFSwitchProps) => {
  const { control } = useFormContext();

  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
    defaultValue: false,
  });

  return (
    <label className='flex items-center  flex-col gap-2 '>
      {label && <span className='text-sm text-foreground'>{label}</span>}

      <div className='relative'>
        <input
          type='checkbox'
          checked={!!value}
          onChange={(e) => {
            onChange(e.target.checked);
            HandleOnChange?.(e.target.checked);
          }}
          disabled={isDisabled}
          className='sr-only peer cursor-pointer'
        />

        <div
          className={`
            w-10 h-5 rounded-full transition-colors
            ${value ? 'bg-primary' : 'bg-border'}
          `}
        />

        <div
          className={`
            absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow
            transform transition-transform
            ${value ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </div>
    </label>
  );
};

export default RHFSwitch;

export const ToggleButton = ({
  name,
  label,
  isRequired = false,
}: {
  name: string;
  label: string;
  isRequired?: boolean;
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='space-y-2'>
          <FormFieldLabel htmlFor={name} label={label} isRequired={isRequired} />
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => field.onChange(true)}
              className={`px-4 py-2 rounded-md transition-all flex-1 ${
                field.value === true
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Enabled
            </button>
            <button
              type='button'
              onClick={() => field.onChange(false)}
              className={`px-4 py-2 rounded-md transition-all flex-1 ${
                field.value === false
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Disabled
            </button>
          </div>
          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};
