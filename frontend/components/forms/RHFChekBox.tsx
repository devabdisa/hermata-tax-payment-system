'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Controller, useFormContext } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface RHFCheckboxProps {
  name: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
}

const RHFCheckbox = ({
  name,
  label,
  description,
  disabled,
  className,
  labelClassName,
  descriptionClassName,
}: RHFCheckboxProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'group relative rounded-lg transition-all duration-200',
            'hover:bg-accent/5',
            disabled && 'opacity-60 cursor-not-allowed',
            error && 'border-destructive/50 bg-destructive/5',
            className,
          )}
        >
          <div
            className={cn(
              'flex items-start gap-3 p-2 -m-2',
              'transition-colors duration-200',
              !disabled && 'cursor-pointer',
            )}
          >
            {/* Animated Checkbox Container */}
            <motion.div
              whileHover={!disabled ? { scale: 1.05 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className='relative'
            >
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={(val) => field.onChange(val)}
                disabled={disabled}
                className={cn(
                  'mt-0.5',
                  'border-2 border-border/60',
                  'data-[state=checked]:bg-primary data-[state=checked]:border-primary',
                  'data-[state=checked]:shadow-lg data-[state=checked]:shadow-primary/20',
                  'transition-all duration-200',
                  'hover:border-primary/60 hover:shadow-md',
                  'focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background',
                  error && 'border-destructive/60 focus:ring-destructive/50',
                )}
              />
            </motion.div>

            {/* Label with Enhanced Styling */}
            <Label
              htmlFor={name}
              className={cn(
                'cursor-pointer font-normal leading-relaxed',
                'transition-colors duration-200',
                !disabled && 'group-hover:text-foreground',
                description ? 'items-start' : 'items-center',
                labelClassName,
              )}
            >
              <motion.span
                className={cn(
                  'text-sm font-medium text-foreground/90',
                  'transition-all duration-200',
                  !disabled && 'group-hover:text-foreground',
                )}
              >
                {label}
              </motion.span>

              {description && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={cn(
                    'mt-1.5 block text-xs text-muted-foreground',
                    'leading-relaxed',
                    'transition-colors duration-200',
                    !disabled && 'group-hover:text-muted-foreground/80',
                    descriptionClassName,
                  )}
                >
                  {description}
                </motion.span>
              )}
            </Label>
          </div>

          {/* Error Message with Animation */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ duration: 0.2 }}
                className='mt-1.5 text-xs text-destructive ml-7'
              >
                {error.message}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Focus Ring Effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-lg pointer-events-none',
              'ring-2 ring-primary/20 ring-offset-2 ring-offset-background',
              'opacity-0 transition-opacity duration-200',
              'focus-within:opacity-100',
            )}
          />
        </motion.div>
      )}
    />
  );
};

export default RHFCheckbox;
