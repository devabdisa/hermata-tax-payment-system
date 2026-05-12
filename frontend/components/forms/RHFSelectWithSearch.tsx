'use client';

import { Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError, FormFieldLabel } from '@/components/forms/form-field-parts';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import LoadingSpinner from '../loader/LoadingSpinner';

interface Options {
  value: string;
  label: string;
}

interface RHFSelectWithSearchProps {
  name: string;
  label: string;
  options: Options[];
  isRequired?: boolean;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  isSearchable?: boolean;
  disabled?: boolean;
  isNullable?: boolean;
  hasMore?: boolean;
  defaultValueLabel: string;
  onSearch?: (value: string) => void;
  fetchMore?: () => void;
  className?: string;
  onChange?: (value: string | undefined) => void;
}

const RHFSelectWithSearch = ({
  name,
  label,
  options,
  isRequired = true,
  isLoading = false,
  isFetchingMore = false,
  isSearchable = false,
  disabled = false,
  isNullable = false,
  hasMore = false,
  defaultValueLabel,
  onSearch,
  fetchMore,
  className,
  onChange,
}: RHFSelectWithSearchProps) => {
  const { control, setValue, clearErrors } = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLButtonElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);
  const [inputWidth, setInputWidth] = useState<number | undefined>(undefined);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const displayedOptions = useMemo(() => {
    if (isSearchable && !onSearch && searchTerm.trim().length > 0) {
      const normalized = searchTerm.trim().toLowerCase();
      return options.filter((opt) => opt.label.toLowerCase().includes(normalized));
    }
    return options;
  }, [isSearchable, onSearch, searchTerm, options]);

  const handleSelect = (value: string | undefined) => {
    setValue(name, value, { shouldDirty: true, shouldValidate: true, shouldTouch: true });
    clearErrors(name);
    setPopoverOpen(false);
    onChange?.(value);
  };

  useEffect(() => {
    if (inputRef.current) {
      setInputWidth(inputRef.current.offsetWidth);
    }
  }, [popoverOpen]);

  useEffect(() => {
    if (!popoverOpen || !fetchMore || !hasMore || !sentinelRef.current) {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingMore) {
          fetchMore?.();
        }
      },
      {
        root: commandListRef.current,
        rootMargin: '0px 0px 100px 0px',
        threshold: 0.1,
      },
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [popoverOpen, fetchMore, hasMore, isFetchingMore]);

  const clearSelection = () => {
    handleSelect(undefined);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className={cn('relative mb-2 w-full', className)}>
          {label && <FormFieldLabel className='mb-2' label={label} isRequired={isRequired} />}

          <Popover open={popoverOpen} modal onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild disabled={disabled}>
              <Button
                ref={inputRef}
                role='combobox'
                type='button'
                variant='outline'
                disabled={disabled}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={cn(
                  'group relative h-12 w-full justify-between rounded-xl border bg-background/50 px-4 py-2 text-left text-base font-normal shadow-sm transition-all duration-200',
                  'hover:border-primary/40 hover:bg-accent/30 hover:shadow-md',
                  'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  !field.value && 'text-muted-foreground',
                  error && 'border-destructive focus:ring-destructive/30',
                  popoverOpen && 'border-primary/50 ring-2 ring-primary/20',
                )}
              >
                <span className='flex-1 truncate'>
                  {field.value
                    ? options.find((opt) => opt.value === field.value)?.label || defaultValueLabel
                    : defaultValueLabel}
                </span>
                <div className='flex items-center gap-1'>
                  {field.value && isNullable && (
                    <button
                      type='button'
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelection();
                      }}
                      className='rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
                      aria-label='Clear selection'
                    >
                      <X className='size-3.5' />
                    </button>
                  )}
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 opacity-60 transition-transform duration-200',
                      popoverOpen && 'rotate-180',
                    )}
                  />
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className='mt-2 rounded-2xl border border-border/70 bg-popover/95 p-2 shadow-xl ring-1 ring-border/45 backdrop-blur-sm dark:bg-popover/92 animate-in fade-in-0 zoom-in-95 duration-200'
              style={{ width: inputWidth }}
              align='start'
              side='bottom'
              sideOffset={4}
              avoidCollisions={true}
            >
              <Command className='bg-transparent text-popover-foreground'>
                {isSearchable && (
                  <CommandInput
                    placeholder={`Search ${label.toLowerCase()}...`}
                    className='h-9 rounded-lg border border-input/70 bg-muted/45 text-sm placeholder:text-muted-foreground'
                    value={searchTerm}
                    onValueChange={(val) => {
                      setSearchTerm(val);
                      onSearch?.(val);
                    }}
                  />
                )}

                <CommandList
                  ref={commandListRef}
                  className={cn(
                    'max-h-[300px] overflow-y-auto overflow-x-hidden scroll-smooth',
                    'scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent',
                    ' [&::-webkit-scrollbar]:w-1.5',
                    'dark:scrollbar-thumb-muted-foreground/30',
                    // Subtle fade edges for better UX
                    '[mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%-20px),transparent)]',
                  )}
                >
                  {isLoading ? (
                    <CommandEmpty className='py-6'>
                      <div className='flex justify-center'>
                        <LoadingSpinner />
                      </div>
                    </CommandEmpty>
                  ) : displayedOptions.length === 0 && !isNullable ? (
                    <CommandEmpty className='py-6 text-center text-muted-foreground text-sm'>
                      No {label.toLowerCase()} found.
                    </CommandEmpty>
                  ) : (
                    <CommandGroup className='p-1 space-y-0.5'>
                      {isNullable && !searchTerm && (
                        <CommandItem
                          key='none'
                          onSelect={() => handleSelect(undefined)}
                          className={cn(
                            'cursor-pointer flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors duration-150',
                            'hover:bg-accent/60',
                            'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          <span className='flex items-center gap-2'>
                            <span>None / Clear</span>
                          </span>
                        </CommandItem>
                      )}
                      {displayedOptions.map((opt) => {
                        const isSelected = field.value === opt.value;
                        return (
                          <CommandItem
                            key={opt.value}
                            onSelect={() => handleSelect(opt.value)}
                            className={cn(
                              'cursor-pointer flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors duration-150',
                              'hover:bg-accent/60',
                              isSelected
                                ? 'bg-primary/14 text-primary font-medium ring-1 ring-primary/25'
                                : 'text-foreground',
                            )}
                          >
                            <span className='flex-1 truncate'>{opt.label}</span>
                            {isSelected && (
                              <Check className='ml-2 h-4 w-4 shrink-0 text-primary animate-in fade-in-0 zoom-in-100 duration-150' />
                            )}
                          </CommandItem>
                        );
                      })}

                      <div ref={sentinelRef} className='h-px w-full relative top-[100px]' />
                      {isFetchingMore && (
                        <div className='flex justify-center py-2'>
                          <LoadingSpinner />
                        </div>
                      )}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {error && <FormFieldError id={`${name}-error`} message={error.message ?? ''} />}
        </div>
      )}
    />
  );
};

export default RHFSelectWithSearch;
