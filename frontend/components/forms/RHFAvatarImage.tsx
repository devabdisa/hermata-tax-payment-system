'use client';

import { RotateCcw, UploadIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useFormContext } from 'react-hook-form';

import { FormFieldError } from '@/components/forms/form-field-parts';
import { cn } from '@/lib/utils';

interface RHFAvatarImageProps {
  name: string;
  label?: string;
  size?: number;
}

const RHFAvatarImage = ({ name, label = 'Profile Picture', size = 138 }: RHFAvatarImageProps) => {
  const { control, setValue } = useFormContext();
  const [lastFile, setLastFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) {
        return;
      }
      const file = acceptedFiles[0];
      setLastFile(file);
      setValue(name, file);
    },
    [name, setValue],
  );

  const dropzone = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
  });

  const handleRemove = () => {
    setLastFile(null);
    setValue(name, null);
  };

  const handleRetry = () => {
    if (lastFile) {
      setValue(name, lastFile);
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const value = field.value as File | string | null;

        const isFile = value instanceof File;
        const isUrl = typeof value === 'string';

        const preview = (() => {
          if (isFile) {
            return URL.createObjectURL(value);
          }
          if (isUrl) {
            return value;
          }
          return null;
        })();

        return (
          <div className='flex flex-col items-center gap-3'>
            <div className='relative' style={{ width: size, height: size }}>
              <div
                {...dropzone.getRootProps()}
                className={cn(
                  'relative size-full cursor-pointer overflow-hidden rounded-full border-4 border-primary/25 bg-muted shadow-sm transition-colors',
                  'hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  fieldState.error && 'border-destructive',
                )}
              >
                <input {...dropzone.getInputProps()} />

                {preview ? (
                  <Image
                    src={preview}
                    width={size}
                    height={size}
                    alt=''
                    className='size-full object-cover'
                  />
                ) : (
                  <div className='flex size-full items-center justify-center'>
                    <UploadIcon className='text-muted-foreground' size={size * 0.35} />
                  </div>
                )}
              </div>

              {value && (
                <button
                  type='button'
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemove();
                  }}
                  className='absolute -right-1 -top-1 rounded-full bg-destructive p-1.5 text-destructive-foreground shadow-md transition-colors hover:bg-destructive/90'
                  aria-label='Remove image'
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className='flex flex-col gap-1 text-center text-sm'>
              <p className='font-medium text-foreground'>{label}</p>

              {fieldState.error && (
                <FormFieldError id={`${name}-error`} message={fieldState.error.message ?? ''} />
              )}
            </div>

            {lastFile && !value && (
              <button
                onClick={handleRetry}
                type='button'
                className='flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline'
              >
                Retry <RotateCcw size={14} />
              </button>
            )}
          </div>
        );
      }}
    />
  );
};

export default RHFAvatarImage;
